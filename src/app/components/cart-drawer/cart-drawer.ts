import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart-drawer',
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cartService.isCartOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-[#2E1026]/50 backdrop-blur-xs flex justify-end"
        (click)="cartService.closeCart()"
      >
        <!-- Slide-over Drawer -->
        <div
          class="relative w-full max-w-md bg-[#FFF9FC] h-full shadow-2xl flex flex-col justify-between border-l border-[#F8D8E7] text-left transition-transform duration-300"
          (click)="$event.stopPropagation()"
        >
          <!-- Drawer Header -->
          <div class="p-5 border-b border-[#F8D8E7] bg-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">🛍</span>
              <div>
                <h3 class="font-serif-title text-xl font-bold text-[#831843]">Tu Carrito</h3>
                <span class="text-xs text-[#9D174D]">
                  {{ cartService.itemsCount() }} {{ cartService.itemsCount() === 1 ? 'producto' : 'productos' }}
                </span>
              </div>
            </div>

            <button
              type="button"
              (click)="cartService.closeCart()"
              class="w-8 h-8 rounded-full bg-[#FAF0F8] hover:bg-[#FCE7F3] text-[#831843] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Cerrar carrito"
            >
              <mat-icon class="text-base">close</mat-icon>
            </button>
          </div>

          <!-- Free Shipping Progress -->
          <div class="px-5 py-3 bg-[#FAF5FF] border-b border-[#F8D8E7]">
            <div class="flex justify-between items-center text-xs font-semibold mb-1">
              <span class="text-[#701A75]">
                {{ amountForFreeShipping() <= 0 ? '🎉 ¡Felicidades! Tienes Envío Gratis' : 'Faltan $' + amountForFreeShipping().toLocaleString('es-CO') + ' para Envío Gratis' }}
              </span>
              <span class="text-[#9333EA] font-bold">{{ shippingProgressPercent() }}%</span>
            </div>
            <div class="w-full bg-[#E9D5FF] h-2 rounded-full overflow-hidden">
              <div
                class="bg-gradient-to-r from-[#BE185D] to-[#9333EA] h-full rounded-full transition-all duration-300"
                [style.width.%]="shippingProgressPercent()"
              ></div>
            </div>
          </div>

          <!-- Cart Items List -->
          <div class="flex-1 overflow-y-auto p-5 space-y-4">
            @if (cartService.items().length === 0) {
              <div class="py-16 text-center space-y-3">
                <div class="w-16 h-16 rounded-full bg-[#FCE7F3] text-[#BE185D] mx-auto flex items-center justify-center text-3xl">
                  🌸
                </div>
                <h4 class="font-serif-title text-lg font-bold text-[#831843]">Tu carrito está vacío</h4>
                <p class="text-xs text-[#701A75]/80 max-w-xs mx-auto">
                  Añade tus tratamientos de cuidado facial y accesorios favoritos para comenzar tu pedido.
                </p>
                <button
                  type="button"
                  (click)="cartService.closeCart()"
                  class="mt-2 px-5 py-2.5 rounded-full bg-[#BE185D] text-white text-xs font-bold shadow-md hover:bg-[#9D174D] transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            } @else {
              @for (item of cartService.items(); track item.product.id) {
                <div class="flex gap-3 bg-white p-3.5 rounded-2xl border border-[#F8D8E7] shadow-2xs">
                  <img
                    [src]="item.product.imageUrl"
                    [alt]="item.product.name"
                    class="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#FAF0F8]"
                  />

                  <div class="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div class="flex items-start justify-between gap-1">
                        <h4 class="text-xs font-bold text-[#4A044E] truncate">
                          {{ item.product.name }}
                        </h4>
                        <button
                          type="button"
                          (click)="cartService.removeItem(item.product.id)"
                          class="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Eliminar producto"
                        >
                          <mat-icon class="text-sm scale-75">delete_outline</mat-icon>
                        </button>
                      </div>
                      <span class="text-[11px] font-bold text-[#BE185D]">
                        \${{ item.product.price.toLocaleString('es-CO') }} COP
                      </span>
                    </div>

                    <!-- Quantity controls -->
                    <div class="flex items-center justify-between mt-2 pt-1 border-t border-[#F8D8E7]/60">
                      <div class="flex items-center rounded-lg border border-[#F8D8E7] bg-[#FFF9FC] p-0.5">
                        <button
                          type="button"
                          (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                          class="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#831843] hover:bg-[#FCE7F3] rounded"
                        >
                          -
                        </button>
                        <span class="w-6 text-center text-xs font-bold text-[#831843]">
                          {{ item.quantity }}
                        </span>
                        <button
                          type="button"
                          (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                          class="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#831843] hover:bg-[#FCE7F3] rounded"
                        >
                          +
                        </button>
                      </div>

                      <span class="text-xs font-black text-[#831843]">
                        \${{ (item.product.price * item.quantity).toLocaleString('es-CO') }}
                      </span>
                    </div>

                  </div>
                </div>
              }

              <!-- Gift Packaging Option -->
              <div class="p-4 rounded-2xl bg-white border border-[#F8D8E7] space-y-2.5">
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#831843]">
                  <input
                    type="checkbox"
                    [checked]="cartService.giftPackaging()"
                    (change)="toggleGiftPackaging($event)"
                    class="rounded text-[#BE185D] focus:ring-[#BE185D] w-4 h-4"
                  />
                  <span>¿Es para regalo? Agregar empaque de lujo (+\$8.000 COP)</span>
                </label>

                @if (cartService.giftPackaging()) {
                  <div class="pl-6 space-y-1.5">
                    <span class="text-[11px] text-[#701A75] block">
                      Incluye caja rígida rosa SAMELÁ, lazo de satén, papel seda perfumado y tarjeta con tu mensaje:
                    </span>
                    <input
                      type="text"
                      [formControl]="giftNoteControl"
                      (blur)="updateGiftNote()"
                      placeholder="Dedicatoria: 'Para Sofía con mucho cariño...'"
                      class="w-full text-xs p-2 rounded-xl border border-[#F8D8E7] outline-none bg-[#FFF9FC] focus:border-[#BE185D]"
                    />
                  </div>
                }
              </div>

              <!-- Coupon Code -->
              <div class="p-3 bg-white rounded-2xl border border-[#F8D8E7] flex items-center gap-2">
                <input
                  type="text"
                  [formControl]="couponControl"
                  placeholder="Cupón (ej: SAMELA10 o SENA2026)"
                  class="flex-1 text-xs p-2 rounded-xl border border-[#F8D8E7] uppercase outline-none focus:border-[#BE185D]"
                />
                <button
                  type="button"
                  (click)="applyCoupon()"
                  class="px-3 py-2 rounded-xl bg-[#831843] hover:bg-[#9D174D] text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Aplicar
                </button>
              </div>

              @if (couponFeedback()) {
                <div
                  class="text-[11px] p-2 rounded-xl font-medium text-center"
                  [class.bg-[#ECFDF5]]="couponFeedback()?.success"
                  [class.text-[#065F46]]="couponFeedback()?.success"
                  [class.bg-[#FEF2F2]]="!couponFeedback()?.success"
                  [class.text-rose-700]]="!couponFeedback()?.success"
                >
                  {{ couponFeedback()?.message }}
                </div>
              }
            }
          </div>

          <!-- Drawer Footer: Summary & Checkout Button -->
          @if (cartService.items().length > 0) {
            <div class="p-5 bg-white border-t border-[#F8D8E7] space-y-3">
              <!-- Pricing breakdown -->
              <div class="space-y-1.5 text-xs text-stone-600">
                <div class="flex justify-between">
                  <span>Subtotal:</span>
                  <span class="font-bold text-stone-800">
                    \${{ cartService.subtotal().toLocaleString('es-CO') }}
                  </span>
                </div>

                @if (cartService.discountAmount() > 0) {
                  <div class="flex justify-between text-[#059669]">
                    <span>Descuento cupón ({{ cartService.appliedCoupon()?.code }}):</span>
                    <span class="font-bold">
                      -\${{ cartService.discountAmount().toLocaleString('es-CO') }}
                    </span>
                  </div>
                }

                @if (cartService.giftPackaging()) {
                  <div class="flex justify-between text-[#9D174D]">
                    <span>Empaque de regalo de lujo:</span>
                    <span class="font-bold">+\$8.000</span>
                  </div>
                }

                <div class="flex justify-between">
                  <span>Envío:</span>
                  <span class="font-bold" [class.text-[#059669]]="cartService.shippingCost() === 0">
                    {{ cartService.shippingCost() === 0 ? 'GRATIS' : '\$' + cartService.shippingCost().toLocaleString('es-CO') }}
                  </span>
                </div>

                <div class="pt-2 border-t border-[#F8D8E7] flex justify-between items-baseline text-sm">
                  <span class="font-serif-title font-bold text-[#4A044E]">TOTAL A PAGAR:</span>
                  <span class="text-xl font-black text-[#BE185D]">
                    \${{ cartService.total().toLocaleString('es-CO') }}
                    <small class="text-xs text-stone-500 font-semibold">COP</small>
                  </span>
                </div>
              </div>

              <!-- Customer Registration Required Notice -->
              @if (!authService.isLoggedIn()) {
                <div class="p-2.5 rounded-xl bg-[#FFF0F6] border border-[#F472B6]/40 text-[#BE185D] text-xs font-semibold flex items-center gap-1.5">
                  <mat-icon class="text-sm scale-90">lock</mat-icon>
                  <span>Para comprar debes estar registrada. ¡Solo toma 30 segundos!</span>
                </div>
              }

              <!-- Checkout Button -->
              <button
                type="button"
                (click)="proceedToCheckout()"
                class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#BE185D] via-[#DB2777] to-[#9D174D] text-white font-bold text-sm shadow-lg shadow-[#BE185D]/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <mat-icon class="text-base">payment</mat-icon>
                <span>
                  {{ authService.isLoggedIn() ? 'Continuar al Pago (Transferencia / Efectivo)' : 'Registrarme y Comprar' }}
                </span>
              </button>

              <div class="flex items-center justify-center gap-2 text-[10px] text-stone-400">
                <span>Pagos Seguros Bancolombia · Nequi · Efectivo</span>
              </div>
            </div>
          }

        </div>
      </div>
    }
  `
})
export class CartDrawerComponent {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);

  readonly couponControl = new FormControl('');
  readonly giftNoteControl = new FormControl('');
  readonly couponFeedback = signal<{ success: boolean; message: string } | null>(null);

  readonly isCheckoutOpen = signal<boolean>(false);

  readonly amountForFreeShipping = computed(() => {
    return Math.max(0, 90000 - this.cartService.subtotal());
  });

  readonly shippingProgressPercent = computed(() => {
    const p = Math.min(100, Math.round((this.cartService.subtotal() / 90000) * 100));
    return p;
  });

  toggleGiftPackaging(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.cartService.setGiftPackaging(checked, this.giftNoteControl.value || '');
  }

  updateGiftNote(): void {
    if (this.cartService.giftPackaging()) {
      this.cartService.setGiftPackaging(true, this.giftNoteControl.value || '');
    }
  }

  applyCoupon(): void {
    const code = this.couponControl.value || '';
    const res = this.cartService.applyCoupon(code);
    this.couponFeedback.set(res);
  }

  proceedToCheckout(): void {
    if (!this.authService.isLoggedIn()) {
      this.cartService.closeCart();
      this.authService.openAuthModal('register', 'Por favor crea tu cuenta de cliente o inicia sesión para continuar con tu pedido.');
      return;
    }

    // Customer is registered, emit checkout trigger (we will handle via CheckoutModal)
    this.cartService.closeCart();
    this.openCheckoutModal();
  }

  openCheckoutModal(): void {
    const event = new CustomEvent('open-checkout');
    window.dispatchEvent(event);
  }
}
