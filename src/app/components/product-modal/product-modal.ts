import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ThreeViewerComponent } from '../three-viewer/three-viewer';

@Component({
  selector: 'app-product-modal',
  imports: [MatIconModule, ThreeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (productService.selectedProductForModal(); as product) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-[#2E1026]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        (click)="closeModal()"
      >
        <!-- Modal Container -->
        <div
          class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#F8D8E7] overflow-hidden my-6 text-left"
          (click)="$event.stopPropagation()"
        >
          <!-- Close Button -->
          <button
            type="button"
            (click)="closeModal()"
            class="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-[#FDF2F7] text-[#831843] border border-[#F8D8E7] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            aria-label="Cerrar ventana"
          >
            <mat-icon class="text-base">close</mat-icon>
          </button>

          <div class="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
            
            <!-- Left: Media (Image or 3D switch) -->
            <div class="md:col-span-6 bg-[#FAF0F8] p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#F8D8E7]">
              
              <!-- View mode toggle: Image vs 3D -->
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#FCE7F3] text-[#BE185D]">
                  {{ product.categoryLabel }}
                </span>

                <div class="inline-flex rounded-full p-0.5 bg-white border border-[#F8D8E7] shadow-2xs">
                  <button
                    type="button"
                    (click)="activeTabMedia.set('image')"
                    class="px-2.5 py-1 text-xs font-bold rounded-full transition-all"
                    [class.bg-[#BE185D]]="activeTabMedia() === 'image'"
                    [class.text-white]="activeTabMedia() === 'image'"
                    [class.text-[#831843]]="activeTabMedia() !== 'image'"
                  >
                    Foto
                  </button>
                  <button
                    type="button"
                    (click)="activeTabMedia.set('3d')"
                    class="px-2.5 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1"
                    [class.bg-[#BE185D]]="activeTabMedia() === '3d'"
                    [class.text-white]="activeTabMedia() === '3d'"
                    [class.text-[#831843]]="activeTabMedia() !== '3d'"
                  >
                    <mat-icon class="text-xs scale-75">view_in_ar</mat-icon>
                    <span>3D</span>
                  </button>
                </div>
              </div>

              <!-- Media Display -->
              <div class="my-auto">
                @if (activeTabMedia() === 'image') {
                  <div class="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-white">
                    <img
                      [src]="product.imageUrl"
                      [alt]="product.name"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute bottom-3 left-3 right-3 text-center">
                      <button
                        type="button"
                        (click)="activeTabMedia.set('3d')"
                        class="px-3 py-1.5 rounded-full bg-white/95 text-[#831843] text-xs font-bold shadow-md hover:bg-white inline-flex items-center gap-1.5"
                      >
                        <mat-icon class="text-sm text-[#EC4899]">360</mat-icon>
                        <span>Explorar en 3D interactivo</span>
                      </button>
                    </div>
                  </div>
                } @else {
                  <app-three-viewer
                    [modelType]="product.model3DType"
                    [productName]="product.name"
                  ></app-three-viewer>
                }
              </div>

              <!-- Extra Guarantee Note -->
              <div class="mt-4 pt-3 border-t border-[#F8D8E7]/80 text-[11px] text-[#701A75] flex items-center justify-between">
                <span class="flex items-center gap-1">
                  <mat-icon class="text-sm text-[#10B981]">verified_user</mat-icon>
                  Calidad Garantizada
                </span>
                <span>Envíos a todo el país</span>
              </div>
            </div>

            <!-- Right: Details & Purchase -->
            <div class="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between space-y-5">
              
              <div class="space-y-4">
                <!-- Title & Rating -->
                <div>
                  <div class="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                    <mat-icon class="text-sm">star</mat-icon>
                    <span>{{ product.rating }}</span>
                    <span class="text-stone-400">({{ product.reviewsCount }} opiniones de clientes)</span>
                  </div>

                  <h2 class="font-serif-title text-2xl sm:text-3xl font-bold text-[#4A044E] leading-tight">
                    {{ product.name }}
                  </h2>

                  <!-- Price -->
                  <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl font-black text-[#BE185D]">
                      \${{ product.price.toLocaleString('es-CO') }}
                    </span>
                    <span class="text-xs font-bold text-stone-500 uppercase">COP</span>
                    @if (product.originalPrice) {
                      <span class="text-sm text-stone-400 line-through">
                        \${{ product.originalPrice.toLocaleString('es-CO') }}
                      </span>
                    }
                  </div>
                </div>

                <!-- Full Description -->
                <p class="text-sm text-[#701A75]/90 leading-relaxed">
                  {{ product.fullDescription }}
                </p>

                <!-- Benefits List -->
                <div class="space-y-1.5 bg-[#FFF5F9] p-3.5 rounded-2xl border border-[#F8D8E7]">
                  <span class="text-xs font-bold uppercase tracking-wider text-[#9D174D] block mb-1">
                    Beneficios Principales:
                  </span>
                  @for (benefit of product.benefits; track benefit) {
                    <div class="flex items-start gap-1.5 text-xs text-[#831843]">
                      <span class="text-[#EC4899] font-bold">✓</span>
                      <span>{{ benefit }}</span>
                    </div>
                  }
                </div>

                <!-- Includes List if available -->
                @if (product.includes && product.includes.length > 0) {
                  <div>
                    <span class="text-xs font-bold uppercase tracking-wider text-[#701A75] block mb-1.5">
                      ¿Qué incluye este kit?
                    </span>
                    <ul class="text-xs text-[#831843] space-y-1 list-disc list-inside bg-white p-3 rounded-xl border border-[#F8D8E7]">
                      @for (item of product.includes; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  </div>
                }

                <!-- How to use -->
                @if (product.howToUse) {
                  <div class="text-xs text-[#701A75]">
                    <strong class="text-[#9D174D] block mb-0.5">Modo de aplicación:</strong>
                    <p>{{ product.howToUse }}</p>
                  </div>
                }
              </div>

              <!-- Bottom Add to Cart Bar -->
              <div class="pt-4 border-t border-[#F8D8E7] flex items-center gap-3">
                <!-- Quantity Selector -->
                <div class="flex items-center rounded-2xl border border-[#F8D8E7] bg-white p-1">
                  <button
                    type="button"
                    (click)="decreaseQuantity()"
                    class="w-7 h-7 rounded-xl bg-[#FFF5F9] hover:bg-[#FCE7F3] text-[#831843] flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span class="w-8 text-center text-xs font-black text-[#831843]">
                    {{ quantity() }}
                  </span>
                  <button
                    type="button"
                    (click)="increaseQuantity()"
                    class="w-7 h-7 rounded-xl bg-[#FFF5F9] hover:bg-[#FCE7F3] text-[#831843] flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <!-- Add Button -->
                <button
                  type="button"
                  (click)="addToCart(product)"
                  class="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#BE185D] to-[#9D174D] hover:from-[#9D174D] hover:to-[#831843] text-white font-bold text-sm shadow-md shadow-[#BE185D]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <mat-icon class="text-base">shopping_bag</mat-icon>
                  <span>Añadir al Carrito</span>
                  <span class="text-xs opacity-90">
                    (\${{ (product.price * quantity()).toLocaleString('es-CO') }})
                  </span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    }
  `
})
export class ProductModalComponent {
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);

  readonly activeTabMedia = signal<'image' | '3d'>('image');
  readonly quantity = signal<number>(1);

  closeModal(): void {
    this.productService.closeProductModal();
    this.quantity.set(1);
    this.activeTabMedia.set('image');
  }

  increaseQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decreaseQuantity(): void {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  addToCart(product: any): void {
    this.cartService.addItem(product, this.quantity());
    this.closeModal();
  }
}
