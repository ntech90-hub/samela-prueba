import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-success-modal',
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (orderService.isOrderSuccessModalOpen(); as isOpen) {
      @if (orderService.recentlyCreatedOrder(); as order) {
        <div
          class="fixed inset-0 z-50 bg-[#2E1026]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          (click)="closeModal()"
        >
          <div
            class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#F8D8E7] overflow-hidden my-4 text-left"
            (click)="$event.stopPropagation()"
          >
            <!-- Top Banner -->
            <div class="bg-gradient-to-r from-[#FCE7F3] via-[#FAF5FF] to-[#FFF0F6] p-6 text-center border-b border-[#F8D8E7] relative">
              <button
                type="button"
                (click)="closeModal()"
                class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#831843] flex items-center justify-center shadow-xs cursor-pointer"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>

              <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-[#BE185D] to-[#9333EA] text-white flex items-center justify-center mx-auto text-3xl shadow-lg shadow-[#BE185D]/25 mb-3">
                ✓
              </div>

              <span class="text-xs font-bold uppercase tracking-wider text-[#9D174D]">
                ¡Orden Generada con Éxito!
              </span>
              <h2 class="font-serif-title text-2xl font-bold text-[#4A044E]">
                N° {{ order.id }}
              </h2>
              <p class="text-xs text-[#701A75] mt-1">
                Gracias, {{ order.customer.fullName.split(' ')[0] }}. Hemos recibido tu pedido en SAMELÁ.
              </p>
            </div>

            <!-- Body Information -->
            <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <!-- Payment Status Card -->
              <div
                class="p-4 rounded-2xl border text-xs"
                [class.bg-[#FFF0F6]]="order.status !== 'pago_verificado'"
                [class.border-[#F472B6]]="order.status !== 'pago_verificado'"
                [class.bg-[#ECFDF5]]="order.status === 'pago_verificado'"
                [class.border-[#10B981]]="order.status === 'pago_verificado'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold uppercase tracking-wider">Estado del Pedido:</span>
                  <span
                    class="px-2 py-0.5 rounded-full font-bold text-[10px]"
                    [class.bg-[#BE185D]]="order.status !== 'pago_verificado'"
                    [class.text-white]="order.status !== 'pago_verificado'"
                    [class.bg-[#059669]]="order.status === 'pago_verificado'"
                    [class.text-white]="order.status === 'pago_verificado'"
                  >
                    {{ order.status === 'pago_verificado' ? 'PAGO VERIFICADO ✓' : 'PENDIENTE DE VERIFICACIÓN' }}
                  </span>
                </div>

                @if (order.status !== 'pago_verificado') {
                  <p class="text-[#831843] leading-relaxed">
                    {{ order.paymentMethod === 'transferencia' 
                      ? 'Una vez confirmemos la transferencia a Bancolombia o Nequi, el sistema emitirá automáticamente tu Factura Oficial de Venta.' 
                      : 'Tu orden en efectivo ha sido agendada para despacho con pago contra entrega.' }}
                  </p>
                } @else {
                  <p class="text-[#065F46] leading-relaxed font-medium">
                    ¡Pago confirmado! Factura Electrónica N° <strong>{{ order.invoiceNumber }}</strong> emitida.
                  </p>
                }
              </div>

              <!-- Action: Submit Voucher Reference if not provided -->
              @if (order.paymentMethod === 'transferencia' && order.status !== 'pago_verificado') {
                <div class="bg-[#FAF5FF] p-4 rounded-2xl border border-[#E9D5FF] space-y-2 text-xs">
                  <strong class="text-[#6B21A8] block">¿Ya realizaste la transferencia?</strong>
                  <p class="text-[#7E22CE]">
                    Ingresa el número de comprobante para agilizar la verificación inmediata de tu pedido:
                  </p>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      [formControl]="refControl"
                      placeholder="ej: TRF-839210"
                      class="flex-1 text-xs p-2 rounded-xl border border-[#E9D5FF] bg-white outline-none"
                    />
                    <button
                      type="button"
                      (click)="saveReference(order.id)"
                      class="px-3 py-2 bg-[#701A75] hover:bg-[#581C87] text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      Registrar
                    </button>
                  </div>
                  @if (savedNotice()) {
                    <span class="text-[11px] text-[#059669] font-bold block">✓ Comprobante registrado. En revisión.</span>
                  }
                </div>
              }

              <!-- Order Summary Items -->
              <div class="bg-white rounded-2xl border border-[#F8D8E7] p-4 text-xs space-y-2">
                <span class="font-bold text-[#4A044E] block border-b border-[#F8D8E7] pb-1">
                  Resumen de Productos:
                </span>
                @for (item of order.items; track item.productId) {
                  <div class="flex justify-between text-stone-700">
                    <span>{{ item.quantity }}x {{ item.productName }}</span>
                    <span class="font-bold">\${{ item.subtotal.toLocaleString('es-CO') }}</span>
                  </div>
                }
                <div class="pt-2 border-t border-[#F8D8E7] flex justify-between font-bold text-sm text-[#BE185D]">
                  <span>Total Pedido:</span>
                  <span>\${{ order.total.toLocaleString('es-CO') }} COP</span>
                </div>
              </div>

              <!-- Quick Verification Shortcut for Evaluators / Store -->
              @if (order.status !== 'pago_verificado') {
                <div class="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
                  <div>
                    <span class="font-bold text-amber-900 block">Simulación Tienda (Pamela & Sara):</span>
                    <span class="text-[11px] text-amber-700">Verifica el pago ahora para emitir la factura</span>
                  </div>
                  <button
                    type="button"
                    (click)="verifyOrderNow(order.id)"
                    class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                  >
                    Verificar Pago
                  </button>
                </div>
              }

              <!-- Main Delivery Options: WhatsApp & PDF Factura -->
              <div class="space-y-2 pt-2">
                <!-- WhatsApp Button -->
                <button
                  type="button"
                  (click)="sendWhatsApp(order)"
                  class="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span class="text-base">💬</span>
                  <span>Enviar Orden & Comprobante por WhatsApp</span>
                </button>

                <!-- PDF Factura Button -->
                <button
                  type="button"
                  (click)="openInvoice(order)"
                  class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#BE185D] to-[#9D174D] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <mat-icon class="text-base">receipt</mat-icon>
                  <span>Ver y Descargar Factura / Orden en PDF</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      }
    }
  `
})
export class OrderSuccessModalComponent {
  readonly orderService = inject(OrderService);

  readonly refControl = new FormControl('');
  readonly savedNotice = signal<boolean>(false);

  closeModal(): void {
    this.orderService.closeOrderSuccessModal();
  }

  saveReference(orderId: string): void {
    const ref = this.refControl.value?.trim();
    if (!ref) return;
    this.orderService.submitPaymentProof(orderId, ref, 'Bancolombia');
    this.savedNotice.set(true);
    setTimeout(() => this.savedNotice.set(false), 2500);
  }

  verifyOrderNow(orderId: string): void {
    this.orderService.verifyPayment(orderId);
  }

  sendWhatsApp(order: any): void {
    this.orderService.sendToWhatsApp(order);
  }

  openInvoice(order: any): void {
    this.orderService.closeOrderSuccessModal();
    this.orderService.openInvoiceModal(order);
  }
}
