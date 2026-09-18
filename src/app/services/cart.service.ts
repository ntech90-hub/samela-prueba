import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'samela_cart_v1';

  readonly items = signal<CartItem[]>([]);
  readonly isCartOpen = signal<boolean>(false);
  readonly appliedCoupon = signal<{ code: string; percent: number } | null>(null);
  readonly giftPackaging = signal<boolean>(false);
  readonly giftDedicationMessage = signal<string>('');

  readonly itemsCount = computed(() => {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  readonly giftPackagingCost = computed(() => {
    return this.giftPackaging() ? 8000 : 0;
  });

  readonly discountAmount = computed(() => {
    const coupon = this.appliedCoupon();
    if (!coupon) return 0;
    return Math.round((this.subtotal() * coupon.percent) / 100);
  });

  readonly shippingCost = computed(() => {
    const sub = this.subtotal();
    if (sub === 0) return 0;
    // Envío gratis en Colombia por compras superiores a $90.000 COP
    return sub >= 90000 ? 0 : 9500;
  });

  readonly total = computed(() => {
    const base = this.subtotal() - this.discountAmount() + this.shippingCost() + this.giftPackagingCost();
    return Math.max(0, base);
  });

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.items.set(JSON.parse(stored));
      }
    } catch {
      this.items.set([]);
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
  }

  addItem(product: Product, quantity = 1): void {
    this.items.update(list => {
      const existingIndex = list.findIndex(i => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...list];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [...list, { product, quantity }];
    });
    this.saveToStorage();
    this.openCart();
  }

  removeItem(productId: string): void {
    this.items.update(list => list.filter(i => i.product.id !== productId));
    this.saveToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update(list => {
      return list.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
    this.saveToStorage();
  }

  clearCart(): void {
    this.items.set([]);
    this.giftPackaging.set(false);
    this.giftDedicationMessage.set('');
    this.appliedCoupon.set(null);
    this.saveToStorage();
  }

  openCart(): void {
    this.isCartOpen.set(true);
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }

  toggleCart(): void {
    this.isCartOpen.update(v => !v);
  }

  applyCoupon(code: string): { success: boolean; message: string } {
    const clean = code.trim().toUpperCase();
    if (clean === 'SAMELA10' || clean === 'GLOW10') {
      this.appliedCoupon.set({ code: clean, percent: 10 });
      return { success: true, message: '¡Cupón de 10% de descuento aplicado con éxito!' };
    }
    if (clean === 'SENA2026' || clean === 'BIENVENIDA') {
      this.appliedCoupon.set({ code: clean, percent: 15 });
      return { success: true, message: '¡Cupón especial de bienvenida de 15% aplicado!' };
    }
    return { success: false, message: 'El cupón ingresado no es válido o ha expirado.' };
  }

  removeCoupon(): void {
    this.appliedCoupon.set(null);
  }

  setGiftPackaging(enabled: boolean, message = ''): void {
    this.giftPackaging.set(enabled);
    if (message) {
      this.giftDedicationMessage.set(message);
    }
  }
}
