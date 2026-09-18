import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-custom-kit-builder',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="arma-tu-kit" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="rounded-3xl bg-gradient-to-br from-[#FAF5FF] via-[#FFF5F9] to-[#FCE7F3] border border-[#F8D8E7] p-6 sm:p-10 shadow-lg text-left">
        
        <!-- Header -->
        <div class="max-w-2xl mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-[#BE185D] text-xs font-bold uppercase tracking-wider mb-2 border border-[#F8D8E7]">
            <span>🎁</span>
            <span>Personalización Exclusiva</span>
          </div>
          <h2 class="font-serif-title text-3xl sm:text-4xl font-bold text-[#4A044E]">
            Arma tu Caja de Regalo SAMELÁ ♡
          </h2>
          <p class="mt-2 text-sm sm:text-base text-[#701A75]/90">
            Diseña un detalle inolvidable: elige el tratamiento facial, añade un accesorio delicado, escoge el lazo de satén y personaliza tu dedicatoria especial.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Steps Configuration -->
          <div class="lg:col-span-7 space-y-6">
            
            <!-- Step 1: Choose Facial Product -->
            <div class="bg-white p-5 rounded-2xl border border-[#F8D8E7] shadow-2xs">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-6 h-6 rounded-full bg-[#BE185D] text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 class="font-serif-title text-base sm:text-lg font-bold text-[#4A044E]">
                  Selecciona el Producto de Cuidado Facial
                </h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                @for (item of skincareOptions(); track item.id) {
                  <button
                    type="button"
                    (click)="selectedSkincare.set(item)"
                    class="p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer"
                    [class.border-[#BE185D]]="selectedSkincare()?.id === item.id"
                    [class.bg-[#FFF0F6]]="selectedSkincare()?.id === item.id"
                    [class.border-stone-200]="selectedSkincare()?.id !== item.id"
                    [class.hover:border-[#F472B6]]="selectedSkincare()?.id !== item.id"
                  >
                    <img [src]="item.imageUrl" [alt]="item.name" class="w-12 h-12 rounded-lg object-cover" />
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-bold text-[#831843] truncate">{{ item.name }}</div>
                      <div class="text-xs font-extrabold text-[#BE185D] mt-0.5">
                        \${{ item.price.toLocaleString('es-CO') }}
                      </div>
                    </div>
                  </button>
                }
              </div>
            </div>

            <!-- Step 2: Choose Accessory -->
            <div class="bg-white p-5 rounded-2xl border border-[#F8D8E7] shadow-2xs">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-6 h-6 rounded-full bg-[#BE185D] text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 class="font-serif-title text-base sm:text-lg font-bold text-[#4A044E]">
                  Selecciona el Accesorio o Joya Delicada
                </h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                @for (item of accessoryOptions(); track item.id) {
                  <button
                    type="button"
                    (click)="selectedAccessory.set(item)"
                    class="p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer"
                    [class.border-[#BE185D]]="selectedAccessory()?.id === item.id"
                    [class.bg-[#FFF0F6]]="selectedAccessory()?.id === item.id"
                    [class.border-stone-200]="selectedAccessory()?.id !== item.id"
                    [class.hover:border-[#F472B6]]="selectedAccessory()?.id !== item.id"
                  >
                    <img [src]="item.imageUrl" [alt]="item.name" class="w-12 h-12 rounded-lg object-cover" />
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-bold text-[#831843] truncate">{{ item.name }}</div>
                      <div class="text-xs font-extrabold text-[#BE185D] mt-0.5">
                        \${{ item.price.toLocaleString('es-CO') }}
                      </div>
                    </div>
                  </button>
                }
              </div>
            </div>

            <!-- Step 3: Ribbon & Dedication -->
            <div class="bg-white p-5 rounded-2xl border border-[#F8D8E7] shadow-2xs space-y-4">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-[#BE185D] text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 class="font-serif-title text-base sm:text-lg font-bold text-[#4A044E]">
                  Color de Lazo y Dedicatoria
                </h3>
              </div>

              <!-- Ribbon color selection -->
              <div>
                <label class="text-xs font-bold text-[#701A75] block mb-1.5">Color del Lazo de Satén:</label>
                <div class="flex gap-2">
                  @for (ribbon of ribbonOptions; track ribbon.name) {
                    <button
                      type="button"
                      (click)="selectedRibbon.set(ribbon.name)"
                      class="px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5"
                      [class.border-[#BE185D]]="selectedRibbon() === ribbon.name"
                      [class.bg-[#FCE7F3]]="selectedRibbon() === ribbon.name"
                      [class.text-[#BE185D]]="selectedRibbon() === ribbon.name"
                      [class.border-stone-200]="selectedRibbon() !== ribbon.name"
                    >
                      <span class="w-2.5 h-2.5 rounded-full" [style.background]="ribbon.hex"></span>
                      <span>{{ ribbon.name }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Card Message -->
              <div>
                <label for="custom-card-message" class="text-xs font-bold text-[#701A75] block mb-1.5">
                  Mensaje para la Tarjeta de Regalo:
                </label>
                <textarea
                  id="custom-card-message"
                  #msgInput
                  (input)="cardMessage.set(msgInput.value)"
                  [value]="cardMessage()"
                  rows="2"
                  placeholder="Ej: 'Para mi mejor amiga: que hoy tu sonrisa brille más que nunca. Te quiero mucho!'"
                  class="w-full text-xs p-3 rounded-xl border border-[#F8D8E7] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none resize-none bg-[#FFF9FC]"
                ></textarea>
              </div>
            </div>

          </div>

          <!-- Right Box Summary -->
          <div class="lg:col-span-5 sticky top-24">
            <div class="bg-white rounded-3xl p-6 border border-[#F8D8E7] shadow-xl space-y-4">
              <div class="flex items-center justify-between border-b border-[#F8D8E7] pb-3">
                <span class="font-serif-title font-bold text-lg text-[#831843]">
                  Resumen de tu Regalo
                </span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-[#FCE7F3] text-[#BE185D] font-bold">
                  Empaque de Lujo Incluido
                </span>
              </div>

              <!-- Preview items -->
              <div class="space-y-3 text-xs">
                <div class="flex justify-between items-center text-stone-700">
                  <span class="font-medium truncate max-w-[200px]">
                    1. {{ selectedSkincare()?.name || 'Selecciona un skincare' }}
                  </span>
                  <span class="font-bold text-[#BE185D]">
                    \${{ selectedSkincare()?.price?.toLocaleString('es-CO') || '0' }}
                  </span>
                </div>

                <div class="flex justify-between items-center text-stone-700">
                  <span class="font-medium truncate max-w-[200px]">
                    2. {{ selectedAccessory()?.name || 'Selecciona un accesorio' }}
                  </span>
                  <span class="font-bold text-[#BE185D]">
                    \${{ selectedAccessory()?.price?.toLocaleString('es-CO') || '0' }}
                  </span>
                </div>

                <div class="flex justify-between items-center text-stone-700">
                  <span class="font-medium">3. Caja Rosa SAMELÁ + Lazo {{ selectedRibbon() }}</span>
                  <span class="font-bold text-[#10B981]">GRATIS (Promo)</span>
                </div>

                <div class="flex justify-between items-center text-stone-700">
                  <span class="font-medium">4. Tarjeta Caligrafiada</span>
                  <span class="font-bold text-[#10B981]">Incluida ♡</span>
                </div>
              </div>

              <!-- Total price -->
              <div class="pt-4 border-t border-[#F8D8E7] flex items-center justify-between">
                <div>
                  <span class="text-xs text-stone-500 block">Total del Combo Personalizado:</span>
                  <span class="text-2xl font-black text-[#BE185D]">
                    \${{ totalCustomPrice().toLocaleString('es-CO') }}
                  </span>
                  <span class="text-xs font-bold text-stone-500 ml-1">COP</span>
                </div>

                <button
                  type="button"
                  (click)="addCustomBoxToCart()"
                  [disabled]="!canAddToCart()"
                  class="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#BE185D] to-[#9D174D] text-white font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <mat-icon class="text-base">card_giftcard</mat-icon>
                  <span>Añadir Caja</span>
                </button>
              </div>

              @if (addedNotice()) {
                <div class="p-2.5 rounded-xl bg-[#ECFDF5] text-[#065F46] text-xs font-bold text-center animate-fade-in">
                  ✓ ¡Caja personalizada agregada al carrito con éxito!
                </div>
              }

            </div>
          </div>

        </div>

      </div>
    </section>
  `
})
export class CustomKitBuilderComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  readonly ribbonOptions = [
    { name: 'Rosa Pastel', hex: '#F472B6' },
    { name: 'Lavanda Dulce', hex: '#C084FC' },
    { name: 'Oro Rosa', hex: '#FB7185' }
  ];

  readonly skincareOptions = computed(() => {
    return this.productService.getProducts().filter(p => p.category === 'skincare').slice(0, 4);
  });

  readonly accessoryOptions = computed(() => {
    return this.productService.getProducts().filter(p => p.category === 'accesorios').slice(0, 4);
  });

  readonly selectedSkincare = signal<Product | null>(null);
  readonly selectedAccessory = signal<Product | null>(null);
  readonly selectedRibbon = signal<string>('Rosa Pastel');
  readonly cardMessage = signal<string>('Con mucho cariño para alguien muy especial ♡');
  readonly addedNotice = signal<boolean>(false);

  constructor() {
    // Select initial items
    const sk = this.skincareOptions()[0];
    const acc = this.accessoryOptions()[0];
    if (sk) this.selectedSkincare.set(sk);
    if (acc) this.selectedAccessory.set(acc);
  }

  readonly totalCustomPrice = computed(() => {
    const s = this.selectedSkincare()?.price || 0;
    const a = this.selectedAccessory()?.price || 0;
    return s + a;
  });

  readonly canAddToCart = computed(() => {
    return this.selectedSkincare() !== null && this.selectedAccessory() !== null;
  });

  addCustomBoxToCart(): void {
    const sk = this.selectedSkincare();
    const acc = this.selectedAccessory();
    if (!sk || !acc) return;

    // Create a special custom kit product representation
    const customProduct: Product = {
      id: `custom-box-${Date.now()}`,
      name: `Caja Personalizada SAMELÁ (${sk.name} + ${acc.name})`,
      category: 'regalos',
      categoryLabel: 'Regalo Personalizado',
      price: this.totalCustomPrice(),
      rating: 5.0,
      reviewsCount: 1,
      badge: 'EDICIÓN LIMITADA',
      shortDescription: `Caja rosa con lazo ${this.selectedRibbon()}, ${sk.name} y ${acc.name}. Incluye tarjeta con dedicatoria.`,
      fullDescription: `Caja de regalo armada a medida con empaque de satén ${this.selectedRibbon()}. Dedicatoria: "${this.cardMessage()}"`,
      benefits: ['Empaque de lujo listo para obsequio', 'Selección de piezas favoritas', 'Tarjeta personalizada'],
      includes: [sk.name, acc.name, `Caja rígida rosa con lazo ${this.selectedRibbon()}`, 'Tarjeta de dedicatoria caligrafiada'],
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      model3DType: 'box',
      model3DLabel: 'Caja Regalo Personalizada 3D',
      inStock: true
    };

    this.cartService.addItem(customProduct, 1);
    this.addedNotice.set(true);
    setTimeout(() => {
      this.addedNotice.set(false);
    }, 2500);
  }
}
