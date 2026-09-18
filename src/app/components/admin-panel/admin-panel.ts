import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order, PaymentStatus } from '../../models/product.model';

@Component({
  selector: 'app-admin-panel',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (authService.adminMode()) {
      <div class="fixed bottom-4 right-4 z-40 max-w-lg w-full px-4">
        <!-- Collapsible floating panel -->
        <div class="bg-white rounded-3xl shadow-2xl border-2 border-[#701A75] overflow-hidden text-left animate-fade-in">
          
          <!-- Top Bar -->
          <div class="bg-gradient-to-r from-[#4A044E] to-[#701A75] text-white p-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <div>
                <h4 class="font-serif-title text-base font-bold leading-none">
                  Panel de Tienda SAMELÁ
                </h4>
                <span class="text-[11px] opacity-90">
                  Gestión y Verificación de Pagos (Pamela & Sara)
                </span>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <button
                type="button"
                (click)="toggleCollapse()"
                class="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Minimizar panel"
              >
                <mat-icon class="text-sm scale-90">{{ isCollapsed() ? 'expand_less' : 'expand_more' }}</mat-icon>
              </button>
              <button
                type="button"
                (click)="authService.toggleAdminMode()"
                class="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Cerrar panel de administración"
              >
                <mat-icon class="text-sm scale-90">close</mat-icon>
              </button>
            </div>
          </div>

          @if (!isCollapsed()) {
            <div class="p-4 max-h-[380px] overflow-y-auto space-y-3 bg-[#FFF9FC]">
              
              <!-- Filter tabs -->
              <div class="flex gap-1.5 text-xs">
                <button
                  type="button"
                  (click)="filterStatus.set('todos')"
                  class="px-2.5 py-1 rounded-full font-bold transition-all"
                  [class.bg-[#BE185D]]="filterStatus() === 'todos'"
                  [class.text-white]="filterStatus() === 'todos'"
                  [class.bg-white]="filterStatus() !== 'todos'"
                  [class.text-stone-600]="filterStatus() !== 'todos'"
                  [class.border]="filterStatus() !== 'todos'"
                  [class.border-stone-200]="filterStatus() !== 'todos'"
                >
                  Todas ({{ orderService.orders().length }})
                </button>
                <button
                  type="button"
                  (click)="filterStatus.set('pendiente')"
                  class="px-2.5 py-1 rounded-full font-bold transition-all"
                  [class.bg-[#BE185D]]="filterStatus() === 'pendiente'"
                  [class.text-white]="filterStatus() === 'pendiente'"
                  [class.bg-white]="filterStatus() !== 'pendiente'"
                  [class.text-stone-600]="filterStatus() !== 'pendiente'"
                  [class.border]="filterStatus() !== 'pendiente'"
                  [class.border-stone-200]="filterStatus() !== 'pendiente'"
                >
                  Por Verificar ({{ pendingCount() }})
                </button>
                <button
                  type="button"
                  (click)="filterStatus.set('verificado')"
                  class="px-2.5 py-1 rounded-full font-bold transition-all"
                  [class.bg-[#BE185D]]="filterStatus() === 'verificado'"
                  [class.text-white]="filterStatus() === 'verificado'"
                  [class.bg-white]="filterStatus() !== 'verificado'"
                  [class.text-stone-600]="filterStatus() !== 'verificado'"
                  [class.border]="filterStatus() !== 'verificado'"
                  [class.border-stone-200]="filterStatus() !== 'verificado'"
                >
                  Facturadas ({{ verifiedCount() }})
                </button>
              </div>

              <!-- Orders list -->
              <div class="space-y-2.5">
                @for (order of displayedOrders(); track order.id) {
                  <div class="p-3 bg-white rounded-2xl border border-[#F8D8E7] text-xs space-y-2 shadow-2xs">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-[#831843]">{{ order.id }}</span>
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        [class.bg-[#ECFDF5]]="order.status === 'pago_verificado'"
                        [class.text-[#065F46]]="order.status === 'pago_verificado'"
                        [class.bg-[#FFF0F6]]="order.status !== 'pago_verificado'"
                        [class.text-[#BE185D]]="order.status !== 'pago_verificado'"
                      >
                        {{ order.status === 'pago_verificado' ? 'FACTURADO ✓' : 'POR VERIFICAR' }}
                      </span>
                    </div>

                    <div class="text-stone-600 space-y-0.5">
                      <div><strong>Cliente:</strong> {{ order.customer.fullName }} ({{ order.customer.phone }})</div>
                      <div><strong>Total:</strong> \${{ order.total.toLocaleString('es-CO') }} COP · {{ order.paymentMethod === 'transferencia' ? 'Transferencia' : 'Efectivo' }}</div>
                      @if (order.paymentDetails.referenceNumber) {
                        <div class="text-[#7E22CE]"><strong>Comprobante:</strong> {{ order.paymentDetails.referenceNumber }}</div>
                      }
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-end gap-2 pt-1 border-t border-[#F8D8E7]">
                      @if (order.status !== 'pago_verificado') {
                        <button
                          type="button"
                          (click)="verifyPayment(order.id)"
                          class="px-2.5 py-1 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <mat-icon class="text-xs scale-75">check</mat-icon>
                          <span>Verificar y Emitir Factura</span>
                        </button>
                      }

                      <button
                        type="button"
                        (click)="viewInvoice(order)"
                        class="px-2.5 py-1 rounded-xl bg-[#831843] hover:bg-[#9D174D] text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <mat-icon class="text-xs scale-75">receipt</mat-icon>
                        <span>Ver Documento</span>
                      </button>

                      <button
                        type="button"
                        (click)="sendWhatsApp(order)"
                        class="p-1 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] flex items-center justify-center cursor-pointer"
                        title="Enviar al WhatsApp del cliente"
                      >
                        <span class="text-xs">💬</span>
                      </button>
                    </div>

                  </div>
                }
              </div>

            </div>
          }
        </div>
      </div>
    }
  `
})
export class AdminPanelComponent {
  readonly authService = inject(AuthService);
  readonly orderService = inject(OrderService);

  readonly isCollapsed = signal<boolean>(false);
  readonly filterStatus = signal<'todos' | 'pendiente' | 'verificado'>('todos');

  toggleCollapse(): void {
    this.isCollapsed.update(v => !v);
  }

  readonly pendingCount = computed(() => {
    return this.orderService.orders().filter(o => o.status !== 'pago_verificado').length;
  });

  readonly verifiedCount = computed(() => {
    return this.orderService.orders().filter(o => o.status === 'pago_verificado').length;
  });

  readonly displayedOrders = computed(() => {
    const list = this.orderService.orders();
    const filter = this.filterStatus();
    if (filter === 'pendiente') {
      return list.filter(o => o.status !== 'pago_verificado');
    }
    if (filter === 'verificado') {
      return list.filter(o => o.status === 'pago_verificado');
    }
    return list;
  });

  verifyPayment(orderId: string): void {
    this.orderService.verifyPayment(orderId);
  }

  viewInvoice(order: Order): void {
    this.orderService.openInvoiceModal(order);
  }

  sendWhatsApp(order: Order): void {
    this.orderService.sendToWhatsApp(order);
  }
}
