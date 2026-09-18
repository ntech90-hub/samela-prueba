import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-orders-history-modal',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 bg-[#2E1026]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        (click)="close()"
      >
        <div
          class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F8D8E7] overflow-hidden my-4 text-left"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-[#FCE7F3] via-[#FAF5FF] to-[#FFF0F6] px-6 py-4 border-b border-[#F8D8E7] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">📦</span>
              <div>
                <h3 class="font-serif-title text-xl font-bold text-[#831843]">Mis Pedidos y Facturas</h3>
                <span class="text-xs text-[#9D174D]">
                  Historial de compras de {{ authService.currentUser()?.fullName || 'Cliente' }}
                </span>
              </div>
            </div>

            <button
              type="button"
              (click)="close()"
              class="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#831843] flex items-center justify-center shadow-xs cursor-pointer"
            >
              <mat-icon class="text-base">close</mat-icon>
            </button>
          </div>

          <!-- Content List -->
          <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-[#FFF9FC]">
            @if (userOrders().length === 0) {
              <div class="py-12 text-center space-y-2">
                <div class="w-14 h-14 rounded-full bg-[#FCE7F3] text-[#BE185D] mx-auto flex items-center justify-center text-2xl">
                  🛍
                </div>
                <h4 class="font-serif-title text-base font-bold text-[#831843]">Aún no tienes pedidos registrados</h4>
                <p class="text-xs text-stone-500 max-w-sm mx-auto">
                  Tus órdenes generadas y facturas verificadas aparecerán aquí para consultar y descargar cuando desees.
                </p>
              </div>
            } @else {
              @for (order of userOrders(); track order.id) {
                <div class="bg-white p-5 rounded-2xl border border-[#F8D8E7] shadow-2xs space-y-3">
                  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#F8D8E7]/80 pb-3">
                    <div>
                      <span class="font-serif-title font-bold text-sm text-[#4A044E]">
                        Orden N° {{ order.id }}
                      </span>
                      <span class="text-xs text-stone-400 block">{{ order.createdAt }}</span>
                    </div>

                    <div class="flex items-center gap-2">
                      <span
                        class="px-2.5 py-1 rounded-full text-xs font-bold"
                        [class.bg-[#ECFDF5]]="order.status === 'pago_verificado'"
                        [class.text-[#065F46]]="order.status === 'pago_verificado'"
                        [class.bg-[#FFF0F6]]="order.status !== 'pago_verificado'"
                        [class.text-[#BE185D]]="order.status !== 'pago_verificado'"
                      >
                        {{ order.status === 'pago_verificado' ? '✓ PAGO VERIFICADO' : '⏳ PENDIENTE DE PAGO' }}
                      </span>
                    </div>
                  </div>

                  <!-- Items list in order -->
                  <div class="text-xs space-y-1 text-stone-600">
                    @for (item of order.items; track item.productId) {
                      <div class="flex justify-between">
                        <span>{{ item.quantity }}x {{ item.productName }}</span>
                        <span class="font-bold">\${{ item.subtotal.toLocaleString('es-CO') }}</span>
                      </div>
                    }
                  </div>

                  <!-- Footer with Totals and Action Buttons -->
                  <div class="pt-3 border-t border-[#F8D8E7] flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span class="text-xs text-stone-500 block">Total de la orden:</span>
                      <span class="text-base font-black text-[#BE185D]">
                        \${{ order.total.toLocaleString('es-CO') }} COP
                      </span>
                    </div>

                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        (click)="viewInvoice(order)"
                        class="px-3.5 py-2 rounded-xl bg-[#BE185D] hover:bg-[#9D174D] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                      >
                        <mat-icon class="text-sm scale-90">receipt</mat-icon>
                        <span>{{ order.status === 'pago_verificado' ? 'Ver Factura' : 'Ver Orden' }}</span>
                      </button>

                      <button
                        type="button"
                        (click)="sendWhatsApp(order)"
                        class="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                        title="Enviar al WhatsApp de SAMELÁ"
                      >
                        <span>💬</span>
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>

                </div>
              }
            }
          </div>

        </div>
      </div>
    }
  `
})
export class OrdersHistoryModalComponent {
  readonly orderService = inject(OrderService);
  readonly authService = inject(AuthService);

  readonly isOpen = signal<boolean>(false);

  readonly userOrders = computed(() => {
    const user = this.authService.currentUser();
    const all = this.orderService.orders();
    if (!user) return all;
    // Show orders matching this user's email or ID, or all if demo user
    return all.filter(o => o.customer.email === user.email || o.customer.id === user.id);
  });

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  viewInvoice(order: Order): void {
    this.close();
    this.orderService.openInvoiceModal(order);
  }

  sendWhatsApp(order: Order): void {
    this.orderService.sendToWhatsApp(order);
  }
}
