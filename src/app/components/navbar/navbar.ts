import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top Announcement Bar -->
    <div class="bg-gradient-to-r from-[#4A044E] via-[#831843] to-[#4A044E] text-white text-[12px] font-medium tracking-wide py-2 px-4 text-center select-none flex items-center justify-center gap-3">
      <span class="hidden sm:inline">✨</span>
      <span>OFERTAS ESPECIALES · CUIDADO FACIAL & ACCESORIOS EXCLUSIVOS · SAMELÁ</span>
      <span class="hidden md:inline bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
        Envío Gratis en compras > $90.000 COP
      </span>
      <span class="hidden sm:inline">✨</span>
    </div>

    <!-- Main Header -->
    <header class="sticky top-0 z-40 bg-[#FFF9FC]/95 backdrop-blur-md border-b border-[#F8D8E7] transition-all shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        <!-- Brand Logo -->
        <a href="#inicio" class="flex items-center gap-2 group text-left">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F472B6] via-[#EC4899] to-[#C084FC] flex items-center justify-center text-white shadow-md shadow-[#F472B6]/30 group-hover:scale-105 transition-transform">
            <span class="text-xl">👑</span>
          </div>
          <div>
            <div class="font-serif-title text-2xl sm:text-3xl font-bold tracking-tight text-[#831843] leading-none flex items-center gap-1.5">
              <span>SAMELÁ</span>
              <span class="text-xs text-[#EC4899] font-normal">♡</span>
            </div>
            <span class="block text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#9D174D] uppercase">
              Belleza · Accesorios · Regalos
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-[#6B21A8]">
          <button
            type="button"
            (click)="selectCategory('todos')"
            [class.text-[#BE185D]]="productService.selectedCategory() === 'todos'"
            [class.bg-[#FCE7F3]]="productService.selectedCategory() === 'todos'"
            class="px-3 py-1.5 rounded-full hover:bg-[#FDF2F7] hover:text-[#BE185D] transition-all"
          >
            Todos
          </button>

          <button
            type="button"
            (click)="selectCategory('skincare')"
            [class.text-[#BE185D]]="productService.selectedCategory() === 'skincare'"
            [class.bg-[#FCE7F3]]="productService.selectedCategory() === 'skincare'"
            class="px-3 py-1.5 rounded-full hover:bg-[#FDF2F7] hover:text-[#BE185D] transition-all flex items-center gap-1"
          >
            <span>Cuidado Facial</span>
            <span class="text-[10px] bg-[#F472B6]/30 text-[#831843] px-1.5 py-0.2 rounded-full font-bold">Top</span>
          </button>

          <button
            type="button"
            (click)="selectCategory('accesorios')"
            [class.text-[#BE185D]]="productService.selectedCategory() === 'accesorios'"
            [class.bg-[#FCE7F3]]="productService.selectedCategory() === 'accesorios'"
            class="px-3 py-1.5 rounded-full hover:bg-[#FDF2F7] hover:text-[#BE185D] transition-all"
          >
            Accesorios
          </button>

          <button
            type="button"
            (click)="selectCategory('regalos')"
            [class.text-[#BE185D]]="productService.selectedCategory() === 'regalos'"
            [class.bg-[#FCE7F3]]="productService.selectedCategory() === 'regalos'"
            class="px-3 py-1.5 rounded-full hover:bg-[#FDF2F7] hover:text-[#BE185D] transition-all"
          >
            Kits & Regalos 🎁
          </button>

          <a
            href="#arma-tu-kit"
            class="px-3 py-1.5 rounded-full text-[#A21CAF] hover:bg-[#F5D0FE] hover:text-[#701A75] transition-all font-bold"
          >
            Arma tu Caja ♡
          </a>
        </nav>

        <!-- Right Utility Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          
          <!-- Admin Simulator Mode Toggle for Pamela & Sara -->
          <button
            type="button"
            (click)="authService.toggleAdminMode()"
            class="px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border"
            [class.bg-[#701A75]]="authService.adminMode()"
            [class.text-white]="authService.adminMode()"
            [class.border-[#701A75]]="authService.adminMode()"
            [class.bg-white]="!authService.adminMode()"
            [class.text-[#701A75]]="!authService.adminMode()"
            [class.border-[#E9D5FF]]="!authService.adminMode()"
            title="Panel de verificación de pagos (Pamela & Sara - SENA Ficha 3167081)"
          >
            <mat-icon class="text-sm scale-75">admin_panel_settings</mat-icon>
            <span class="hidden md:inline">{{ authService.adminMode() ? 'Modo Tienda: Activo' : 'Verificar Pagos' }}</span>
          </button>

          <!-- Customer Auth Button -->
          @if (authService.currentUser(); as user) {
            <div class="relative group">
              <button
                type="button"
                (click)="authService.openAuthModal('login')"
                class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-[#F8D8E7] hover:border-[#F472B6] transition-all shadow-2xs"
              >
                <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-[#F472B6] to-[#C084FC] text-white flex items-center justify-center text-xs font-bold">
                  {{ user.fullName.charAt(0) }}
                </div>
                <div class="text-left hidden sm:block">
                  <div class="text-[11px] font-bold text-[#831843] leading-none truncate max-w-[90px]">
                    {{ user.fullName.split(' ')[0] }}
                  </div>
                  <span class="text-[9px] text-[#059669] font-semibold flex items-center gap-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    Registrado
                  </span>
                </div>
              </button>
            </div>
          } @else {
            <button
              type="button"
              (click)="authService.openAuthModal('register', 'Por favor regístrate o inicia sesión para continuar con tu compra.')"
              class="px-3 py-1.5 rounded-full bg-white border border-[#F8D8E7] hover:border-[#BE185D] text-xs font-bold text-[#BE185D] hover:bg-[#FDF2F7] transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <mat-icon class="text-sm scale-75">person_outline</mat-icon>
              <span>Ingresar</span>
            </button>
          }

          <!-- Shopping Cart Drawer Button -->
          <button
            type="button"
            (click)="cartService.openCart()"
            class="relative flex items-center gap-2 bg-gradient-to-r from-[#BE185D] to-[#9D174D] text-white px-3.5 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow-md shadow-[#BE185D]/25 hover:shadow-lg hover:from-[#9D174D] hover:to-[#831843] hover:scale-[1.02] active:scale-[0.98] transition-all"
            aria-label="Abrir carrito de compras"
          >
            <mat-icon class="text-base sm:text-lg">shopping_bag</mat-icon>
            <span class="hidden sm:inline">Carrito</span>
            <span class="bg-white text-[#9D174D] text-xs font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
              {{ cartService.itemsCount() }}
            </span>
          </button>

        </div>
      </div>

      <!-- Secondary Category Bar for Mobile -->
      <div class="lg:hidden overflow-x-auto no-scrollbar border-t border-[#F8D8E7]/60 px-4 py-2 flex items-center gap-2 text-xs font-semibold text-[#831843]">
        <button
          type="button"
          (click)="selectCategory('todos')"
          [class.bg-[#BE185D]]="productService.selectedCategory() === 'todos'"
          [class.text-white]="productService.selectedCategory() === 'todos'"
          class="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-[#F8D8E7]"
        >
          Todos
        </button>
        <button
          type="button"
          (click)="selectCategory('skincare')"
          [class.bg-[#BE185D]]="productService.selectedCategory() === 'skincare'"
          [class.text-white]="productService.selectedCategory() === 'skincare'"
          class="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-[#F8D8E7]"
        >
          Cuidado Facial
        </button>
        <button
          type="button"
          (click)="selectCategory('accesorios')"
          [class.bg-[#BE185D]]="productService.selectedCategory() === 'accesorios'"
          [class.text-white]="productService.selectedCategory() === 'accesorios'"
          class="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-[#F8D8E7]"
        >
          Accesorios
        </button>
        <button
          type="button"
          (click)="selectCategory('regalos')"
          [class.bg-[#BE185D]]="productService.selectedCategory() === 'regalos'"
          [class.text-white]="productService.selectedCategory() === 'regalos'"
          class="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-[#F8D8E7]"
        >
          Kits & Regalos
        </button>
        <a
          href="#arma-tu-kit"
          class="whitespace-nowrap px-3 py-1 rounded-full bg-[#FCE7F3] text-[#9D174D] border border-[#F472B6]/40 font-bold"
        >
          Arma tu Caja 🎀
        </a>
      </div>
    </header>
  `
})
export class NavbarComponent {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  readonly productService = inject(ProductService);

  selectCategory(cat: ProductCategory): void {
    this.productService.setCategory(cat);
    // Smooth scroll to catalog section
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
