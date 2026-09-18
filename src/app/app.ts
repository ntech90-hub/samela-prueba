import { ChangeDetectionStrategy, Component, inject, signal, computed, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { ProductCardComponent } from './components/product-card/product-card';
import { ProductModalComponent } from './components/product-modal/product-modal';
import { ViewerModalComponent } from './components/viewer-modal/viewer-modal';
import { CustomKitBuilderComponent } from './components/custom-kit-builder/custom-kit-builder';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer';
import { AuthModalComponent } from './components/auth-modal/auth-modal';
import { CheckoutModalComponent } from './components/checkout-modal/checkout-modal';
import { OrderSuccessModalComponent } from './components/order-success-modal/order-success-modal';
import { InvoiceModalComponent } from './components/invoice-modal/invoice-modal';
import { OrdersHistoryModalComponent } from './components/orders-history-modal/orders-history-modal';
import { AdminPanelComponent } from './components/admin-panel/admin-panel';
import { FooterComponent } from './components/footer/footer';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { ProductCategory, Product } from './models/product.model';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    NavbarComponent,
    HeroComponent,
    ProductCardComponent,
    ProductModalComponent,
    ViewerModalComponent,
    CustomKitBuilderComponent,
    CartDrawerComponent,
    AuthModalComponent,
    CheckoutModalComponent,
    OrderSuccessModalComponent,
    InvoiceModalComponent,
    OrdersHistoryModalComponent,
    AdminPanelComponent,
    FooterComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);

  @ViewChild('ordersHistoryModal') ordersHistoryModal?: OrdersHistoryModalComponent;

  readonly searchControl = new FormControl('');

  readonly categories: { key: ProductCategory | 'todos'; label: string; icon: string }[] = [
    { key: 'todos', label: 'Todos los Productos', icon: 'auto_awesome' },
    { key: 'skincare', label: 'Cuidado Facial', icon: 'spa' },
    { key: 'accesorios', label: 'Accesorios & Joyería', icon: 'diamond' },
    { key: 'regalos', label: 'Kits & Cajas de Regalo', icon: 'card_giftcard' }
  ];

  readonly filteredProducts = computed(() => {
    return this.productService.filteredProducts();
  });

  onCategoryChange(cat: ProductCategory | 'todos'): void {
    this.productService.setCategory(cat);
  }

  onSearchChange(): void {
    const term = this.searchControl.value || '';
    this.productService.setSearchQuery(term);
  }

  openOrdersHistory(): void {
    this.ordersHistoryModal?.open();
  }

  openViewerForFeatured(type: string): void {
    const found = this.productService.getProducts().find(p => p.model3DType === type);
    if (found) {
      this.productService.open3DViewer(found);
    }
  }
}
