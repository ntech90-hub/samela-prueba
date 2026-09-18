import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ThreeViewerComponent } from '../three-viewer/three-viewer';

@Component({
  selector: 'app-viewer-modal',
  imports: [MatIconModule, ThreeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (productService.selectedProductFor3D(); as product) {
      <div
        class="fixed inset-0 z-50 bg-[#2E1026]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        (click)="close()"
      >
        <div
          class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F8D8E7] overflow-hidden my-4"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#F8D8E7] bg-[#FFF9FC]">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#EC4899]"></span>
              <div>
                <h3 class="font-serif-title text-xl font-bold text-[#831843] leading-none">
                  {{ product.name }}
                </h3>
                <span class="text-xs text-[#9D174D] font-medium">
                  {{ product.model3DLabel }}
                </span>
              </div>
            </div>

            <button
              type="button"
              (click)="close()"
              class="w-8 h-8 rounded-full bg-white hover:bg-[#FDF2F7] text-[#831843] border border-[#F8D8E7] flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <mat-icon class="text-base">close</mat-icon>
            </button>
          </div>

          <!-- 3D Canvas Area -->
          <div class="p-4 sm:p-6 bg-gradient-to-b from-[#FFF5F9] to-white">
            <app-three-viewer
              [modelType]="product.model3DType"
              [productName]="product.name"
            ></app-three-viewer>
          </div>

          <!-- Bottom Footer -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#FAF0F8] border-t border-[#F8D8E7]">
            <div class="text-center sm:text-left">
              <span class="text-xs text-stone-500 block">Precio especial de lanzamiento:</span>
              <span class="text-xl font-black text-[#BE185D]">
                \${{ product.price.toLocaleString('es-CO') }} COP
              </span>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                (click)="openFullDetails(product)"
                class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF0F6] text-[#831843] border border-[#F8D8E7] text-xs font-bold transition-all"
              >
                Ver Ficha Completa
              </button>

              <button
                type="button"
                (click)="addToCart(product)"
                class="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BE185D] to-[#9D174D] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <mat-icon class="text-sm">shopping_bag</mat-icon>
                <span>Añadir al Carrito</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `
})
export class ViewerModalComponent {
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);

  close(): void {
    this.productService.close3DViewer();
  }

  openFullDetails(product: any): void {
    this.close();
    this.productService.openProductModal(product);
  }

  addToCart(product: any): void {
    this.cartService.addItem(product, 1);
    this.close();
  }
}
