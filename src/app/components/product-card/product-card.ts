import { ChangeDetectionStrategy, Component, input, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="group relative flex flex-col justify-between bg-white rounded-3xl border border-[#F8D8E7] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#BE185D]/10 hover:-translate-y-1.5"
    >
      <!-- Top Image Area -->
      <div class="relative aspect-square w-full overflow-hidden bg-[#FAF0F8]">
        
        <!-- Badge -->
        @if (product().badge) {
          <span
            class="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-xs"
            [class.bg-[#BE185D]]="product().badge === 'MÁS VENDIDO' || product().badge === 'RUTINA COMPLETA'"
            [class.text-white]="product().badge === 'MÁS VENDIDO' || product().badge === 'RUTINA COMPLETA'"
            [class.bg-[#9333EA]]="product().badge === 'EDICIÓN LIMITADA'"
            [class.text-white]="product().badge === 'EDICIÓN LIMITADA'"
            [class.bg-[#FFF0F6]]="product().badge === 'OFERTA' || product().badge === 'NUEVO'"
            [class.text-[#BE185D]]="product().badge === 'OFERTA' || product().badge === 'NUEVO'"
            [class.border]="product().badge === 'OFERTA' || product().badge === 'NUEVO'"
            [class.border-[#F472B6]]="product().badge === 'OFERTA' || product().badge === 'NUEVO'"
          >
            {{ product().badge }}
          </span>
        }

        <!-- 3D Viewer Trigger Button -->
        <button
          type="button"
          (click)="onOpen3D($event)"
          class="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 hover:bg-[#831843] text-[#831843] hover:text-white border border-[#F8D8E7] shadow-sm backdrop-blur-md text-[11px] font-bold transition-all duration-200 cursor-pointer"
          title="Ver modelo 3D interactivo"
        >
          <mat-icon class="text-xs scale-90">view_in_ar</mat-icon>
          <span>3D</span>
        </button>

        <!-- Image -->
        <img
          [src]="product().imageUrl"
          [alt]="product().name"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
        />

        <!-- Hover Overlay Details Button -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button
            type="button"
            (click)="onOpenDetails()"
            class="w-full py-2 px-3 rounded-xl bg-white/95 text-[#831843] font-bold text-xs flex items-center justify-center gap-1 hover:bg-white transition-colors shadow-md"
          >
            <mat-icon class="text-sm scale-90">visibility</mat-icon>
            <span>Ver fórmula y detalles</span>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-5 flex-1 flex flex-col justify-between text-left">
        <div>
          <!-- Category & Rating -->
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#9D174D]">
              {{ product().categoryLabel }}
            </span>

            <div class="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">
              <mat-icon class="text-xs scale-90">star</mat-icon>
              <span>{{ product().rating }}</span>
              <span class="text-stone-400 text-[11px]">({{ product().reviewsCount }})</span>
            </div>
          </div>

          <!-- Title -->
          <h3
            (click)="onOpenDetails()"
            class="font-serif-title text-lg font-bold text-[#4A044E] group-hover:text-[#BE185D] transition-colors cursor-pointer line-clamp-1"
          >
            {{ product().name }}
          </h3>

          <!-- Short description -->
          <p class="mt-1 text-xs text-[#701A75]/80 line-clamp-2 leading-relaxed min-h-[32px]">
            {{ product().shortDescription }}
          </p>
        </div>

        <!-- Price & Add to Cart -->
        <div class="mt-4 pt-3 border-t border-[#F8D8E7]/70 flex items-center justify-between gap-2">
          <div>
            @if (product().originalPrice) {
              <span class="text-[11px] text-stone-400 line-through block leading-none">
                \${{ product().originalPrice?.toLocaleString('es-CO') }}
              </span>
            }
            <span class="text-lg font-extrabold text-[#BE185D]">
              \${{ product().price.toLocaleString('es-CO') }}
              <span class="text-[10px] font-bold text-stone-500">COP</span>
            </span>
          </div>

          <button
            type="button"
            (click)="onAddToCart()"
            [disabled]="isAdding()"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            [class.bg-[#BE185D]]="!isAdding()"
            [class.text-white]="!isAdding()"
            [class.hover:bg-[#9D174D]]="!isAdding()"
            [class.shadow-md]="!isAdding()"
            [class.shadow-[#BE185D]/20]="!isAdding()"
            [class.bg-[#10B981]]="isAdding()"
            [class.text-white]="isAdding()"
          >
            <mat-icon class="text-sm scale-90">
              {{ isAdding() ? 'check' : 'add_shopping_cart' }}
            </mat-icon>
            <span>{{ isAdding() ? '¡Agregado!' : 'Añadir' }}</span>
          </button>
        </div>
      </div>
    </article>
  `
})
export class ProductCardComponent {
  product = input.required<Product>();

  private cartService = inject(CartService);
  private productService = inject(ProductService);

  readonly isAdding = signal<boolean>(false);

  onAddToCart(): void {
    this.isAdding.set(true);
    this.cartService.addItem(this.product(), 1);
    setTimeout(() => {
      this.isAdding.set(false);
    }, 1200);
  }

  onOpenDetails(): void {
    this.productService.openProductModal(this.product());
  }

  onOpen3D(event: MouseEvent): void {
    event.stopPropagation();
    this.productService.open3DViewer(this.product());
  }
}
