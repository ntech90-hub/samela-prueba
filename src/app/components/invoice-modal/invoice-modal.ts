import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-invoice-modal',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (orderService.isInvoiceModalOpen(); as isOpen) {
      @if (orderService.activeOrderForModal(); as order) {
        <div
          class="fixed inset-0 z-50 bg-[#2E1026]/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          (click)="close()"
        >
          <div
            class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#F8D8E7] overflow-hidden my-4 text-left flex flex-col max-h-[92vh]"
            (click)="$event.stopPropagation()"
          >
            <!-- Top Controls (Hidden during print) -->
            <div class="no-print bg-[#FFF9FC] px-6 py-4 border-b border-[#F8D8E7] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div class="flex items-center gap-2">
                <span class="text-xl">🧾</span>
                <div>
                  <h3 class="font-serif-title text-lg font-bold text-[#831843]">
                    {{ order.status === 'pago_verificado' ? 'Factura Oficial de Venta' : 'Orden de Compra' }}
                  </h3>
                  <span class="text-xs text-[#9D174D]">
                    {{ order.id }} · {{ order.invoiceNumber || 'Pendiente de emisión fiscal' }}
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2 flex-wrap">
                <!-- Verify now if admin/owner -->
                @if (order.status !== 'pago_verificado') {
                  <button
                    type="button"
                    (click)="verifyPayment(order.id)"
                    class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <mat-icon class="text-sm scale-75">verified</mat-icon>
                    <span>Verificar Pago y Emitir Factura</span>
                  </button>
                }

                <!-- Print / Save PDF -->
                <button
                  type="button"
                  (click)="printPDF()"
                  class="px-3.5 py-1.5 rounded-xl bg-[#BE185D] hover:bg-[#9D174D] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                  title="Descargar en PDF o Imprimir documento"
                >
                  <mat-icon class="text-sm scale-90">picture_as_pdf</mat-icon>
                  <span>Descargar PDF</span>
                </button>

                <!-- WhatsApp Share -->
                <button
                  type="button"
                  (click)="shareWhatsApp(order)"
                  class="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                >
                  <span class="text-xs">💬</span>
                  <span>WhatsApp</span>
                </button>

                <!-- Email Share -->
                <button
                  type="button"
                  (click)="sendEmail(order)"
                  class="px-3 py-1.5 rounded-xl bg-[#701A75] hover:bg-[#581C87] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                >
                  <mat-icon class="text-sm scale-90">email</mat-icon>
                  <span>Enviar Correo</span>
                </button>

                <!-- Close -->
                <button
                  type="button"
                  (click)="close()"
                  class="w-8 h-8 rounded-full bg-white hover:bg-[#FDF2F7] text-[#831843] border border-[#F8D8E7] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <mat-icon class="text-base">close</mat-icon>
                </button>
              </div>
            </div>

            <!-- Email Notification Feedback -->
            @if (emailSentNotice()) {
              <div class="no-print bg-[#ECFDF5] text-[#065F46] p-2 text-xs font-bold text-center border-b border-[#A7F3D0]">
                ✓ Factura electrónica enviada al correo del cliente ({{ order.customer.email }}).
              </div>
            }

            <!-- Printable Document Area -->
            <div id="invoice-printable-area" class="flex-1 overflow-y-auto p-6 sm:p-8 bg-white space-y-6 text-stone-800 text-xs">
              
              <!-- Company Header -->
              <div class="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-[#BE185D] pb-5">
                <div>
                  <div class="font-serif-title text-3xl font-bold text-[#831843] flex items-center gap-2">
                    <span>SAMELÁ</span>
                    <span class="text-sm text-[#EC4899]">♡</span>
                  </div>
                  <span class="block text-[11px] font-bold text-[#9D174D] uppercase tracking-wider">
                    Belleza, Accesorios y Regalos
                  </span>
                  <div class="mt-2 text-[11px] text-stone-500 space-y-0.5">
                    <div><strong>Proyecto Formativo SENA:</strong> Técnico en Programación de Software</div>
                    <div><strong>Ficha:</strong> 3167081 · Institución Educativa Marco Fidel Suárez</div>
                    <div><strong>Emprendedoras:</strong> Pamela Cuéllar Bonilla & Sara Sofía Cardozo Cuéllar</div>
                    <div><strong>Docente Asesor:</strong> Yair Fernando Merchán Lesmes</div>
                    <div><strong>NIT:</strong> 901.842.109-4 · Régimen No Responsable de IVA</div>
                    <div><strong>Contacto:</strong> +57 314 567 8901 · Bogotá D.C., Colombia</div>
                  </div>
                </div>

                <!-- Invoice Meta Box -->
                <div class="sm:text-right bg-[#FFF9FC] p-4 rounded-2xl border border-[#F8D8E7] min-w-[220px]">
                  <span class="inline-block px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wider uppercase mb-1"
                    [class.bg-[#ECFDF5]]="order.status === 'pago_verificado'"
                    [class.text-[#065F46]]="order.status === 'pago_verificado'"
                    [class.bg-[#FFF0F6]]="order.status !== 'pago_verificado'"
                    [class.text-[#BE185D]]="order.status !== 'pago_verificado'"
                  >
                    {{ order.status === 'pago_verificado' ? 'FACTURA ELECTRÓNICA DE VENTA' : 'ORDEN DE COMPRA COMERCIAL' }}
                  </span>

                  <div class="text-base font-black text-[#831843]">
                    {{ order.invoiceNumber || order.id }}
                  </div>
                  @if (order.invoiceNumber) {
                    <div class="text-[11px] text-stone-500">Orden Ref: {{ order.id }}</div>
                  }

                  <div class="mt-2 pt-2 border-t border-[#F8D8E7] text-[11px] text-stone-600 space-y-0.5">
                    <div><strong>Fecha Emisión:</strong> {{ order.createdAt }}</div>
                    @if (order.verifiedAt) {
                      <div><strong>Fecha Verificación:</strong> {{ order.verifiedAt }}</div>
                    }
                    <div><strong>Estado:</strong> 
                      <span class="font-bold" [class.text-[#059669]]="order.status === 'pago_verificado'" [class.text-[#BE185D]]="order.status !== 'pago_verificado'">
                        {{ order.status === 'pago_verificado' ? 'PAGADO Y VERIFICADO' : 'PENDIENTE DE PAGO' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Customer Info & Shipping Address -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF5FF] p-4 rounded-2xl border border-[#E9D5FF]">
                <div>
                  <span class="font-bold text-[11px] uppercase tracking-wider text-[#6B21A8] block mb-1">
                    Facturado a (Cliente Registrada):
                  </span>
                  <div class="font-bold text-sm text-[#4A044E]">{{ order.customer.fullName }}</div>
                  <div class="text-stone-600">C.C. / NIT: {{ order.customer.documentId }}</div>
                  <div class="text-stone-600">Email: {{ order.customer.email }}</div>
                  <div class="text-stone-600">WhatsApp / Tel: {{ order.customer.phone }}</div>
                </div>

                <div>
                  <span class="font-bold text-[11px] uppercase tracking-wider text-[#6B21A8] block mb-1">
                    Dirección de Entrega y Envío:
                  </span>
                  <div class="font-bold text-stone-800">{{ order.customer.address }}</div>
                  <div class="text-stone-600">Barrio: {{ order.customer.neighborhood }}</div>
                  <div class="text-stone-600">Ciudad: {{ order.customer.city }}</div>
                  @if (order.customer.additionalNotes) {
                    <div class="text-[10px] text-stone-500 italic mt-1">
                      Nota: {{ order.customer.additionalNotes }}
                    </div>
                  }
                </div>
              </div>

              <!-- Items Table -->
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#FFF0F6] text-[#831843] border-b border-[#F8D8E7]">
                      <th class="py-2.5 px-3 font-bold">Ítem / Producto</th>
                      <th class="py-2.5 px-3 font-bold">Categoría</th>
                      <th class="py-2.5 px-3 font-bold text-center">Cant.</th>
                      <th class="py-2.5 px-3 font-bold text-right">Precio Unit.</th>
                      <th class="py-2.5 px-3 font-bold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#F8D8E7]">
                    @for (item of order.items; track item.productId) {
                      <tr>
                        <td class="py-3 px-3">
                          <span class="font-bold text-[#4A044E] block">{{ item.productName }}</span>
                          <span class="text-[10px] text-stone-400">SKU: {{ item.productId }}</span>
                        </td>
                        <td class="py-3 px-3 text-stone-600">{{ item.categoryLabel }}</td>
                        <td class="py-3 px-3 text-center font-bold">{{ item.quantity }}</td>
                        <td class="py-3 px-3 text-right text-stone-600">
                          \${{ item.price.toLocaleString('es-CO') }}
                        </td>
                        <td class="py-3 px-3 text-right font-bold text-[#831843]">
                          \${{ item.subtotal.toLocaleString('es-CO') }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <!-- Financial Totals & Payment Proof Details -->
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
                
                <!-- Payment verification stamp / box -->
                <div class="sm:col-span-7 space-y-3">
                  <div class="p-4 rounded-2xl border bg-[#FFF9FC]"
                    [class.border-[#10B981]]="order.status === 'pago_verificado'"
                    [class.border-[#F8D8E7]]="order.status !== 'pago_verificado'"
                  >
                    <div class="flex items-center gap-2 mb-1.5">
                      <span class="text-sm">
                        {{ order.status === 'pago_verificado' ? '🛡️' : '⏳' }}
                      </span>
                      <strong class="text-xs uppercase tracking-wider text-[#831843]">
                        Detalle de Pago: {{ order.paymentMethod === 'transferencia' ? 'Transferencia Bancaria' : 'Efectivo Contra Entrega' }}
                      </strong>
                    </div>

                    <div class="text-[11px] text-stone-600 space-y-1">
                      @if (order.paymentMethod === 'transferencia') {
                        <div><strong>Banco Receptor:</strong> {{ order.paymentDetails.bankName || 'Bancolombia' }}</div>
                        @if (order.paymentDetails.referenceNumber) {
                          <div><strong>N° Comprobante:</strong> {{ order.paymentDetails.referenceNumber }}</div>
                        }
                      } @else {
                        <div><strong>Modalidad:</strong> Pago en efectivo al recibir el pedido</div>
                        @if (order.paymentDetails.cashAmountToPay) {
                          <div><strong>Paga con billete de:</strong> \${{ order.paymentDetails.cashAmountToPay.toLocaleString('es-CO') }} COP</div>
                        }
                      }

                      @if (order.status === 'pago_verificado') {
                        <div class="mt-2 pt-2 border-t border-[#A7F3D0] text-[#065F46] font-bold flex items-center gap-1.5">
                          <span>✓ CERTIFICADO: PAGO VERIFICADO Y CONCILIADO POR SAMELÁ</span>
                        </div>
                      } @else {
                        <div class="mt-2 text-rose-700 italic">
                          * Factura provisional en espera de validación de fondos.
                        </div>
                      }
                    </div>
                  </div>

                  @if (order.giftPackaging) {
                    <div class="p-3 bg-[#FAF5FF] rounded-xl border border-[#E9D5FF] text-[11px] text-[#701A75]">
                      🎁 <strong>Empaque de Regalo Signature SAMELÁ:</strong> Incluye caja rígida rosa, lazo de satén, papel seda y tarjeta.
                      @if (order.giftDedicationMessage) {
                        <p class="mt-1 italic font-serif-title text-[#4A044E]">
                          "{{ order.giftDedicationMessage }}"
                        </p>
                      }
                    </div>
                  }
                </div>

                <!-- Totals Calculation -->
                <div class="sm:col-span-5 bg-[#FAF0F8] p-4 rounded-2xl border border-[#F8D8E7] space-y-2">
                  <div class="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span class="font-bold">\${{ order.subtotal.toLocaleString('es-CO') }}</span>
                  </div>

                  @if (order.discount > 0) {
                    <div class="flex justify-between text-[#059669]">
                      <span>Descuento de Cupón:</span>
                      <span class="font-bold">-\${{ order.discount.toLocaleString('es-CO') }}</span>
                    </div>
                  }

                  @if (order.giftPackaging) {
                    <div class="flex justify-between text-[#9D174D]">
                      <span>Empaque de Regalo:</span>
                      <span class="font-bold">+\$8.000</span>
                    </div>
                  }

                  <div class="flex justify-between text-stone-600">
                    <span>Costo de Envío:</span>
                    <span class="font-bold" [class.text-[#059669]]="order.shippingCost === 0">
                      {{ order.shippingCost === 0 ? 'GRATIS' : '\$' + order.shippingCost.toLocaleString('es-CO') }}
                    </span>
                  </div>

                  <div class="flex justify-between text-stone-400 text-[10px]">
                    <span>IVA (Régimen Especial):</span>
                    <span>$0 (Excluido)</span>
                  </div>

                  <div class="pt-2 border-t border-[#F8D8E7] flex justify-between items-baseline text-sm">
                    <span class="font-serif-title font-bold text-[#4A044E]">TOTAL:</span>
                    <span class="text-xl font-black text-[#BE185D]">
                      \${{ order.total.toLocaleString('es-CO') }}
                      <small class="text-xs text-stone-500 font-bold">COP</small>
                    </span>
                  </div>
                </div>

              </div>

              <!-- Signatures & Official Footnote -->
              <div class="pt-6 border-t border-[#F8D8E7] grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-[10px] text-stone-500">
                <div>
                  <div class="font-serif-title italic font-bold text-xs text-[#831843] mb-1">
                    Pamela Cuéllar Bonilla
                  </div>
                  <div class="border-t border-stone-300 pt-1">
                    Co-fundadora & Gestión SAMELÁ
                  </div>
                </div>

                <div>
                  <div class="font-serif-title italic font-bold text-xs text-[#831843] mb-1">
                    Sara Sofía Cardozo Cuéllar
                  </div>
                  <div class="border-t border-stone-300 pt-1">
                    Co-fundadora & Finanzas SAMELÁ
                  </div>
                </div>

                <div class="col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
                  <div class="w-12 h-12 rounded-lg bg-[#FAF0F8] border border-[#F8D8E7] flex items-center justify-center text-xs font-mono text-[#BE185D]">
                    [ QR ]
                  </div>
                  <span class="text-[9px] text-stone-400 mt-1">Verificación Digital SAMELÁ</span>
                </div>
              </div>

              <div class="text-[10px] text-stone-400 text-center pt-2">
                Documento generado por el sistema de e-commerce SAMELÁ. "Tu brillo, nuestra inspiración ♡". Conserva este documento para garantías.
              </div>

            </div>

          </div>
        </div>
      }
    }
  `
})
export class InvoiceModalComponent {
  readonly orderService = inject(OrderService);
  readonly emailSentNotice = signal<boolean>(false);

  close(): void {
    this.orderService.closeInvoiceModal();
  }

  verifyPayment(orderId: string): void {
    this.orderService.verifyPayment(orderId);
  }

  printPDF(): void {
    this.orderService.printInvoice();
  }

  shareWhatsApp(order: Order): void {
    this.orderService.sendToWhatsApp(order);
  }

  sendEmail(order: Order): void {
    this.emailSentNotice.set(true);
    setTimeout(() => this.emailSentNotice.set(false), 4000);
  }
}
