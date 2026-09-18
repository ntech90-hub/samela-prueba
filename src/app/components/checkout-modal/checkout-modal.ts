import { ChangeDetectionStrategy, Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import confetti from 'canvas-confetti';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { PaymentMethod, OrderItem } from '../../models/product.model';

@Component({
  selector: 'app-checkout-modal',
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 bg-[#2E1026]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        (click)="close()"
      >
        <div
          class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F8D8E7] overflow-hidden my-4 text-left"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-[#FCE7F3] via-[#FAF5FF] to-[#FFF0F6] px-6 py-4 border-b border-[#F8D8E7] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">💳</span>
              <div>
                <h3 class="font-serif-title text-xl font-bold text-[#831843]">Finalizar Pedido · SAMELÁ</h3>
                <span class="text-xs text-[#9D174D] font-medium">
                  Pagos verificados: Transferencia Bancaria o Efectivo
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

          <!-- Checkout Form -->
          <form [formGroup]="checkoutForm" (ngSubmit)="submitOrder()" class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            <!-- Section 1: Customer Data Review (Requirement: cliente registrado) -->
            @if (authService.currentUser(); as customer) {
              <div class="p-4 rounded-2xl bg-[#FFF9FC] border border-[#F8D8E7] space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-[#9D174D] uppercase tracking-wider flex items-center gap-1.5">
                    <mat-icon class="text-sm text-[#059669]">check_circle</mat-icon>
                    Cliente Registrada
                  </span>
                  <button
                    type="button"
                    (click)="authService.openAuthModal('login')"
                    class="text-[11px] text-[#BE185D] underline font-bold"
                  >
                    Cambiar datos
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#701A75]">
                  <div><strong>Nombre:</strong> {{ customer.fullName }}</div>
                  <div><strong>Cédula / Documento:</strong> {{ customer.documentId }}</div>
                  <div><strong>WhatsApp / Celular:</strong> {{ customer.phone }}</div>
                  <div><strong>Ciudad / Barrio:</strong> {{ customer.city }} ({{ customer.neighborhood }})</div>
                  <div class="sm:col-span-2"><strong>Dirección de entrega:</strong> {{ customer.address }}</div>
                </div>
              </div>
            }

            <!-- Section 2: Choose Payment Method (Only Cash or Bank Transfer per requirements) -->
            <div>
              <label class="block text-xs font-bold text-[#701A75] uppercase tracking-wider mb-2">
                Selecciona tu Método de Pago:
              </label>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Transferencia Bancaria -->
                <button
                  type="button"
                  (click)="selectedPayment.set('transferencia')"
                  class="p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer"
                  [class.border-[#BE185D]]="selectedPayment() === 'transferencia'"
                  [class.bg-[#FFF0F6]]="selectedPayment() === 'transferencia'"
                  [class.shadow-sm]="selectedPayment() === 'transferencia'"
                  [class.border-stone-200]="selectedPayment() !== 'transferencia'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-bold text-sm text-[#831843] flex items-center gap-1.5">
                      <mat-icon class="text-base text-[#BE185D]">account_balance</mat-icon>
                      Transferencia Digital
                    </span>
                    <span class="w-4 h-4 rounded-full border flex items-center justify-center"
                      [class.border-[#BE185D]]="selectedPayment() === 'transferencia'"
                      [class.bg-[#BE185D]]="selectedPayment() === 'transferencia'"
                    >
                      @if (selectedPayment() === 'transferencia') {
                        <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                      }
                    </span>
                  </div>
                  <p class="text-[11px] text-[#701A75]">
                    Bancolombia, Nequi o Daviplata. Se genera orden y factura una vez verificado.
                  </p>
                </button>

                <!-- Efectivo Contra Entrega -->
                <button
                  type="button"
                  (click)="selectedPayment.set('efectivo')"
                  class="p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer"
                  [class.border-[#BE185D]]="selectedPayment() === 'efectivo'"
                  [class.bg-[#FFF0F6]]="selectedPayment() === 'efectivo'"
                  [class.shadow-sm]="selectedPayment() === 'efectivo'"
                  [class.border-stone-200]="selectedPayment() !== 'efectivo'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-bold text-sm text-[#831843] flex items-center gap-1.5">
                      <mat-icon class="text-base text-[#BE185D]">payments</mat-icon>
                      Efectivo / Entrega
                    </span>
                    <span class="w-4 h-4 rounded-full border flex items-center justify-center"
                      [class.border-[#BE185D]]="selectedPayment() === 'efectivo'"
                      [class.bg-[#BE185D]]="selectedPayment() === 'efectivo'"
                    >
                      @if (selectedPayment() === 'efectivo') {
                        <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                      }
                    </span>
                  </div>
                  <p class="text-[11px] text-[#701A75]">
                    Pagas en efectivo al recibir tu pedido en tu domicilio o punto de entrega acordado.
                  </p>
                </button>
              </div>
            </div>

            <!-- Details for Transferencia Bancaria -->
            @if (selectedPayment() === 'transferencia') {
              <div class="p-4 rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF] space-y-3 animate-fade-in">
                <div class="flex items-center justify-between border-b border-[#E9D5FF] pb-2">
                  <span class="text-xs font-bold text-[#6B21A8]">Cuentas Oficiales SAMELÁ:</span>
                  <span class="text-[10px] bg-[#E9D5FF] text-[#581C87] px-2 py-0.5 rounded-full font-semibold">
                    Cero Comisión
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#581C87]">
                  <div class="bg-white p-2.5 rounded-xl border border-[#E9D5FF]">
                    <strong class="block text-[#9333EA]">Bancolombia Ahorros</strong>
                    <span>Cta: <strong>524-892104-32</strong></span>
                    <span class="block text-[11px] text-stone-500">Titular: Pamela Cuéllar (SAMELÁ)</span>
                  </div>
                  <div class="bg-white p-2.5 rounded-xl border border-[#E9D5FF]">
                    <strong class="block text-[#9333EA]">Nequi / Daviplata</strong>
                    <span>Número: <strong>314 567 8901</strong></span>
                    <span class="block text-[11px] text-stone-500">Titular: Sara Cardozo (SAMELÁ)</span>
                  </div>
                </div>

                <!-- Input transfer proof -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label for="ch-bank" class="block text-[11px] font-bold text-[#581C87] mb-1">
                      Banco desde el que transferiste:
                    </label>
                    <select
                      id="ch-bank"
                      formControlName="bankName"
                      class="w-full text-xs p-2.5 rounded-xl border border-[#E9D5FF] bg-white outline-none"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Nequi">Nequi</option>
                      <option value="Daviplata">Daviplata</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="BBVA">BBVA</option>
                      <option value="Transfiya">Transfiya / Bre-B</option>
                    </select>
                  </div>

                  <div>
                    <label for="ch-ref" class="block text-[11px] font-bold text-[#581C87] mb-1">
                      N° de Comprobante / Aprobación:
                    </label>
                    <input
                      id="ch-ref"
                      type="text"
                      formControlName="referenceNumber"
                      placeholder="ej: 9821345 o TRF-0192"
                      class="w-full text-xs p-2.5 rounded-xl border border-[#E9D5FF] bg-white outline-none focus:border-[#9333EA]"
                    />
                  </div>
                </div>

                <div class="text-[11px] text-[#7E22CE]">
                  📌 <em>Nota: Puedes ingresar el número ahora o enviarlo directamente por WhatsApp al generar la orden.</em>
                </div>
              </div>
            }

            <!-- Details for Efectivo -->
            @if (selectedPayment() === 'efectivo') {
              <div class="p-4 rounded-2xl bg-[#FFF0F6] border border-[#F472B6]/40 space-y-2 animate-fade-in text-xs text-[#831843]">
                <strong class="block text-[#9D174D]">Instrucciones de Pago en Efectivo:</strong>
                <p>
                  El domiciliario entregará tu orden de compra en mano y recibirá el dinero en efectivo.
                </p>
                <div>
                  <label for="ch-cash" class="block font-bold mb-1">
                    ¿Con qué billete pagarás para llevarte el cambio exacto? (Opcional):
                  </label>
                  <input
                    id="ch-cash"
                    type="number"
                    formControlName="cashAmountToPay"
                    placeholder="ej: 100000"
                    class="w-full sm:w-1/2 text-xs p-2.5 rounded-xl border border-[#F8D8E7] bg-white outline-none"
                  />
                </div>
              </div>
            }

            <!-- Section 3: Summary Breakdown -->
            <div class="p-4 rounded-2xl bg-white border border-[#F8D8E7] space-y-2 text-xs">
              <div class="flex justify-between text-stone-600">
                <span>Subtotal ({{ cartService.itemsCount() }} items):</span>
                <span class="font-bold">\${{ cartService.subtotal().toLocaleString('es-CO') }}</span>
              </div>
              @if (cartService.discountAmount() > 0) {
                <div class="flex justify-between text-[#059669]">
                  <span>Descuento de Cupón:</span>
                  <span class="font-bold">-\${{ cartService.discountAmount().toLocaleString('es-CO') }}</span>
                </div>
              }
              @if (cartService.giftPackaging()) {
                <div class="flex justify-between text-[#9D174D]">
                  <span>Caja de Regalo de Lujo:</span>
                  <span class="font-bold">+\$8.000</span>
                </div>
              }
              <div class="flex justify-between text-stone-600">
                <span>Costo de Envío:</span>
                <span class="font-bold" [class.text-[#059669]]="cartService.shippingCost() === 0">
                  {{ cartService.shippingCost() === 0 ? 'GRATIS' : '\$' + cartService.shippingCost().toLocaleString('es-CO') }}
                </span>
              </div>
              <div class="pt-2 border-t border-[#F8D8E7] flex justify-between items-baseline text-sm">
                <span class="font-serif-title font-bold text-[#4A044E]">TOTAL A PAGAR:</span>
                <span class="text-xl font-black text-[#BE185D]">
                  \${{ cartService.total().toLocaleString('es-CO') }} COP
                </span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#BE185D] via-[#DB2777] to-[#9D174D] text-white font-bold text-sm shadow-lg shadow-[#BE185D]/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <mat-icon class="text-lg">check_circle</mat-icon>
              <span>Generar Orden de Compra Oficial (SAMELÁ)</span>
            </button>

            <p class="text-[11px] text-center text-stone-400">
              Al generar la orden recibirás tu comprobante oficial para descargar en PDF o enviar por WhatsApp.
            </p>

          </form>
        </div>
      </div>
    }
  `
})
export class CheckoutModalComponent implements OnInit, OnDestroy {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  readonly orderService = inject(OrderService);

  readonly isOpen = signal<boolean>(false);
  readonly selectedPayment = signal<PaymentMethod>('transferencia');

  readonly checkoutForm = new FormGroup({
    bankName: new FormControl('Bancolombia'),
    referenceNumber: new FormControl(''),
    cashAmountToPay: new FormControl<number | null>(null),
    notes: new FormControl('')
  });

  private openListener = () => {
    this.isOpen.set(true);
  };

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('open-checkout', this.openListener);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('open-checkout', this.openListener);
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  submitOrder(): void {
    const customer = this.authService.currentUser();
    if (!customer) {
      this.close();
      this.authService.openAuthModal('register', 'Por favor regístrate antes de continuar.');
      return;
    }

    const cartItems = this.cartService.items();
    if (cartItems.length === 0) return;

    const orderItems: OrderItem[] = cartItems.map(i => ({
      productId: i.product.id,
      productName: i.product.name,
      categoryLabel: i.product.categoryLabel,
      price: i.product.price,
      quantity: i.quantity,
      subtotal: i.product.price * i.quantity,
      model3DType: i.product.model3DType
    }));

    const formVal = this.checkoutForm.value;

    const newOrder = this.orderService.createOrder({
      customer,
      items: orderItems,
      subtotal: this.cartService.subtotal(),
      discount: this.cartService.discountAmount(),
      shippingCost: this.cartService.shippingCost(),
      total: this.cartService.total(),
      paymentMethod: this.selectedPayment(),
      paymentDetails: {
        bankName: this.selectedPayment() === 'transferencia' ? (formVal.bankName || 'Bancolombia') : 'Efectivo Contra Entrega',
        referenceNumber: formVal.referenceNumber || '',
        cashAmountToPay: formVal.cashAmountToPay || undefined,
        notes: formVal.notes || undefined
      },
      giftPackaging: this.cartService.giftPackaging(),
      giftDedicationMessage: this.cartService.giftDedicationMessage()
    });

    // Confetti celebration for placing order
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F472B6', '#EC4899', '#C084FC', '#F59E0B']
      });
    } catch {
      // safe fallback
    }

    // Clear cart and close checkout modal
    this.cartService.clearCart();
    this.close();
  }
}
