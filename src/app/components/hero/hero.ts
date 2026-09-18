import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-hero',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="inicio" class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      <!-- Ambient Glow Backgrounds -->
      <div class="absolute -top-10 left-1/4 w-72 h-72 bg-[#FCE7F3] rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div class="absolute top-20 right-10 w-96 h-96 bg-[#F3E8FF] rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FDF2F8] via-[#FAF5FF] to-[#FFF0F6] border border-[#F8D8E7] shadow-xl shadow-[#F8D8E7]/30 p-6 sm:p-10 lg:p-14">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <!-- Left Content -->
          <div class="lg:col-span-7 space-y-6 text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#F472B6]/40 text-[#BE185D] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <span class="text-sm">🌸</span>
              <span>Emprendimiento SAMELÁ · SENA Ficha 3167081</span>
            </div>

            <div class="space-y-2">
              <span class="block font-serif-title italic text-lg sm:text-xl text-[#9D174D]">
                Tu lugar favorito ♡
              </span>
              <h1 class="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#4A044E] leading-[1.1]">
                Brilla a tu manera con el mejor <span class="bg-gradient-to-r from-[#BE185D] to-[#9333EA] bg-clip-text text-transparent">cuidado facial</span>.
              </h1>
            </div>

            <p class="text-base sm:text-lg text-[#701A75]/90 leading-relaxed max-w-2xl font-normal">
              Descubre rutinas faciales botánicas, accesorios delicados en oro de 18k y cajas de regalo diseñadas para sorprender. Explora cada producto con nuestro <strong>visor 3D interactivo 360°</strong> y realiza tu pedido con pago por transferencia bancaria o contra entrega.
            </p>

            <!-- Highlights Badges -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div class="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/70 border border-[#F8D8E7]/80 backdrop-blur-sm">
                <div class="w-8 h-8 rounded-xl bg-[#FCE7F3] text-[#BE185D] flex items-center justify-center shrink-0">
                  <mat-icon class="text-base">view_in_ar</mat-icon>
                </div>
                <div class="text-left">
                  <div class="text-xs font-bold text-[#831843]">Modelos 3D</div>
                  <div class="text-[11px] text-[#9D174D]">Rotación 360°</div>
                </div>
              </div>

              <div class="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/70 border border-[#F8D8E7]/80 backdrop-blur-sm">
                <div class="w-8 h-8 rounded-xl bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center shrink-0">
                  <mat-icon class="text-base">receipt_long</mat-icon>
                </div>
                <div class="text-left">
                  <div class="text-xs font-bold text-[#581C87]">Facturación</div>
                  <div class="text-[11px] text-[#7E22CE]">PDF & WhatsApp</div>
                </div>
              </div>

              <div class="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/70 border border-[#F8D8E7]/80 backdrop-blur-sm col-span-2 sm:col-span-1">
                <div class="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                  <mat-icon class="text-base">verified</mat-icon>
                </div>
                <div class="text-left">
                  <div class="text-xs font-bold text-[#065F46]">Pago Seguro</div>
                  <div class="text-[11px] text-[#059669]">Nequi / Efectivo</div>
                </div>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#catalogo"
                class="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] via-[#DB2777] to-[#9D174D] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#BE185D]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <span>Explorar Catálogo Facial</span>
                <mat-icon class="text-lg">arrow_forward</mat-icon>
              </a>

              <button
                type="button"
                (click)="openFeatured3D()"
                class="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-[#FDF2F7] text-[#BE185D] font-bold text-sm sm:text-base border border-[#F8D8E7] shadow-sm hover:border-[#F472B6] transition-all"
              >
                <mat-icon class="text-lg text-[#EC4899]">3d_rotation</mat-icon>
                <span>Probar Visor 3D</span>
              </button>
            </div>
          </div>

          <!-- Right Feature Box: Visual Card with 3D Tag -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md rounded-3xl overflow-hidden bg-white p-4 sm:p-5 border border-[#F8D8E7] shadow-2xl shadow-[#BE185D]/15">
              
              <!-- Badge Overlay -->
              <div class="absolute top-7 left-7 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#F8D8E7] shadow-sm text-xs font-bold text-[#BE185D]">
                <span class="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
                <span>DESTACADO SAMELÁ</span>
              </div>

              <div class="absolute top-7 right-7 z-10">
                <button
                  type="button"
                  (click)="openFeatured3D()"
                  class="px-2.5 py-1 rounded-full bg-[#831843] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#9D174D] transition-colors shadow-md"
                >
                  <mat-icon class="text-sm scale-75">view_in_ar</mat-icon>
                  <span>3D Interactivo</span>
                </button>
              </div>

              <!-- Product Image -->
              <div class="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF0F8] group">
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80"
                  alt="Kit Glow SAMELÁ"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div class="absolute bottom-3 left-3 right-3 text-white text-left">
                  <div class="text-[11px] uppercase tracking-wider font-semibold opacity-90">Rutina Completa 4 Pasos</div>
                  <div class="font-serif-title text-xl font-bold">Kit Glow Facial & Gotero 3D</div>
                </div>
              </div>

              <!-- Product Quick Info inside card -->
              <div class="pt-4 pb-1 text-left">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs text-[#9D174D] font-bold uppercase tracking-wider">Cuidado Facial Especializado</span>
                    <h3 class="font-serif-title text-lg font-bold text-[#4A044E]">Kit Glow + Sérum Vitamina C</h3>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-stone-400 line-through block">$110.000</span>
                    <span class="text-xl font-extrabold text-[#BE185D]">$89.000 <small class="text-xs text-stone-500">COP</small></span>
                  </div>
                </div>

                <div class="mt-3 pt-3 border-t border-[#F8D8E7] flex items-center justify-between text-xs text-stone-600">
                  <div class="flex items-center gap-1 text-amber-500">
                    <mat-icon class="text-sm scale-90">star</mat-icon>
                    <span class="font-bold text-stone-700">4.9 / 5.0</span>
                    <span class="text-stone-400">(48 reseñas)</span>
                  </div>
                  <button
                    type="button"
                    (click)="openFeatured3D()"
                    class="font-bold text-[#9333EA] hover:text-[#7E22CE] flex items-center gap-1"
                  >
                    <span>Inspeccionar en 3D</span>
                    <mat-icon class="text-sm scale-75">360</mat-icon>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class HeroComponent {
  private productService = inject(ProductService);

  openFeatured3D(): void {
    const kitGlow = this.productService.getProductById('prod-01');
    if (kitGlow) {
      this.productService.open3DViewer(kitGlow);
    }
  }
}
