import { Injectable, signal } from '@angular/core';
import { Order, UserProfile, OrderItem, PaymentMethod, PaymentStatus } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly STORAGE_KEY = 'samela_orders_v1';

  readonly orders = signal<Order[]>([]);
  readonly activeOrderForModal = signal<Order | null>(null);
  readonly isInvoiceModalOpen = signal<boolean>(false);
  readonly isOrderSuccessModalOpen = signal<boolean>(false);
  readonly recentlyCreatedOrder = signal<Order | null>(null);

  constructor() {
    this.initOrders();
  }

  private initOrders(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.orders.set(JSON.parse(stored));
      } else {
        // Seed an initial demo order showing verified invoice
        const initialOrder: Order = {
          id: 'OC-2026-1024',
          invoiceNumber: 'FACT-SM26-0042',
          createdAt: '2026-09-17 10:30',
          verifiedAt: '2026-09-17 11:15',
          customer: {
            id: 'usr-001',
            fullName: 'Camila Andrea Mendoza',
            email: 'camila.mendoza@gmail.com',
            phone: '3145678901',
            documentId: '1023948572',
            address: 'Carrera 15 # 93-40, Apto 402',
            city: 'Bogotá D.C.',
            neighborhood: 'Chicó Norte',
            createdAt: '2026-09-01'
          },
          items: [
            {
              productId: 'prod-01',
              productName: 'Kit Glow Facial Completo',
              categoryLabel: 'Skincare Facial',
              price: 89000,
              quantity: 1,
              subtotal: 89000
            },
            {
              productId: 'prod-05',
              productName: 'Espejo Compacto Grabado SAMELÁ Dorado',
              categoryLabel: 'Accesorios y Detalles',
              price: 36000,
              quantity: 1,
              subtotal: 36000
            }
          ],
          subtotal: 125000,
          discount: 12500, // Cupón SAMELA10
          shippingCost: 0, // Envío gratis
          total: 112500,
          paymentMethod: 'transferencia',
          paymentDetails: {
            bankName: 'Bancolombia',
            referenceNumber: 'TRF-982341-BCOL',
            voucherFileSimulated: 'comprobante_bancolombia_112500.pdf',
            notes: 'Transferencia realizada desde app Bancolombia'
          },
          giftPackaging: true,
          giftDedicationMessage: '¡Feliz cumpleaños hermosa! Que este kit llene de luz y amor tus días.',
          status: 'pago_verificado',
          notes: 'Pago recibido y verificado por Administración SAMELÁ.'
        };

        this.orders.set([initialOrder]);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([initialOrder]));
      }
    } catch {
      this.orders.set([]);
    }
  }

  private saveOrders(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.orders()));
  }

  createOrder(params: {
    customer: UserProfile;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
    paymentMethod: PaymentMethod;
    paymentDetails: Order['paymentDetails'];
    giftPackaging: boolean;
    giftDedicationMessage?: string;
  }): Order {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `OC-2026-${randomNum}`;
    
    // Initial status: if customer attached voucher number, it's 'comprobante_enviado', else 'pendiente_pago'
    const initialStatus: PaymentStatus = params.paymentDetails.referenceNumber 
      ? 'comprobante_enviado' 
      : 'pendiente_pago';

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      customer: params.customer,
      items: params.items,
      subtotal: params.subtotal,
      discount: params.discount,
      shippingCost: params.shippingCost,
      total: params.total,
      paymentMethod: params.paymentMethod,
      paymentDetails: params.paymentDetails,
      giftPackaging: params.giftPackaging,
      giftDedicationMessage: params.giftDedicationMessage,
      status: initialStatus
    };

    this.orders.update(current => [newOrder, ...current]);
    this.saveOrders();

    this.recentlyCreatedOrder.set(newOrder);
    this.isOrderSuccessModalOpen.set(true);

    return newOrder;
  }

  submitPaymentProof(orderId: string, referenceNumber: string, bankName: string, notes?: string): void {
    this.orders.update(list => {
      return list.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'comprobante_enviado',
            paymentDetails: {
              ...order.paymentDetails,
              bankName,
              referenceNumber,
              notes: notes || order.paymentDetails.notes
            }
          };
        }
        return order;
      });
    });
    this.saveOrders();

    // Update active order if open
    const currentActive = this.activeOrderForModal();
    if (currentActive && currentActive.id === orderId) {
      const updated = this.orders().find(o => o.id === orderId);
      if (updated) this.activeOrderForModal.set(updated);
    }
  }

  verifyPayment(orderId: string): Order | undefined {
    let updatedOrder: Order | undefined;
    const invSequence = Math.floor(100 + Math.random() * 900);
    const invoiceNumber = `FACT-SM26-${invSequence}`;

    this.orders.update(list => {
      return list.map(order => {
        if (order.id === orderId) {
          updatedOrder = {
            ...order,
            status: 'pago_verificado',
            invoiceNumber: order.invoiceNumber || invoiceNumber,
            verifiedAt: new Date().toLocaleString('es-CO', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }),
            notes: 'Pago verificado exitosamente por el equipo comercial de SAMELÁ. Factura oficial emitida.'
          };
          return updatedOrder;
        }
        return order;
      });
    });
    this.saveOrders();

    if (updatedOrder) {
      this.activeOrderForModal.set(updatedOrder);
    }
    return updatedOrder;
  }

  updateOrderStatus(orderId: string, status: PaymentStatus): void {
    this.orders.update(list => {
      return list.map(order => {
        if (order.id === orderId) {
          return { ...order, status };
        }
        return order;
      });
    });
    this.saveOrders();
  }

  openInvoiceModal(order: Order): void {
    this.activeOrderForModal.set(order);
    this.isInvoiceModalOpen.set(true);
  }

  closeInvoiceModal(): void {
    this.isInvoiceModalOpen.set(false);
  }

  closeOrderSuccessModal(): void {
    this.isOrderSuccessModalOpen.set(false);
  }

  generateWhatsAppMessage(order: Order): string {
    const isVerified = order.status === 'pago_verificado';
    const title = isVerified 
      ? '🧾 *FACTURA DE VENTA - SAMELÁ*' 
      : '🛍 *ORDEN DE COMPRA - SAMELÁ*';

    const itemsSummary = order.items.map(item => `  • ${item.quantity}x ${item.productName} - $${item.subtotal.toLocaleString('es-CO')}`).join('\n');
    const paymentLabel = order.paymentMethod === 'transferencia' 
      ? `Transferencia Bancaria (${order.paymentDetails.bankName || 'Bancolombia/Nequi'})`
      : 'Efectivo / Pago Contra Entrega';

    const invoiceLine = order.invoiceNumber ? `\n*Factura N°:* ${order.invoiceNumber}` : '';
    const refLine = order.paymentDetails.referenceNumber ? `\n*Comprobante:* ${order.paymentDetails.referenceNumber}` : '';

    const text = 
`${title}
*Emprendimiento:* SAMELÁ · Belleza, Accesorios y Regalos
*Proyecto SENA Ficha:* 3167081 (Pamela Cuéllar & Sara Cardozo)
----------------------------------------
*N° Pedido:* ${order.id}${invoiceLine}
*Fecha:* ${order.createdAt}
*Estado:* ${isVerified ? '✅ PAGO VERIFICADO Y FACTURADO' : '⏳ PENDIENTE DE VERIFICACIÓN'}

*Datos del Cliente:*
• *Nombre:* ${order.customer.fullName}
• *Cédula/NIT:* ${order.customer.documentId}
• *WhatsApp:* ${order.customer.phone}
• *Dirección:* ${order.customer.address}
• *Ciudad:* ${order.customer.city} (${order.customer.neighborhood})

*Detalle de Productos:*
${itemsSummary}
${order.giftPackaging ? '  • Empaque de Regalo Signature SAMELÁ con lazo ($8.000)' : ''}

*Subtotal:* $${order.subtotal.toLocaleString('es-CO')}
${order.discount > 0 ? `*Descuento Cupón:* -$${order.discount.toLocaleString('es-CO')}\n` : ''}*Envío:* ${order.shippingCost === 0 ? 'GRATIS' : '$' + order.shippingCost.toLocaleString('es-CO')}
*TOTAL:* $${order.total.toLocaleString('es-CO')} COP

*Método de Pago:* ${paymentLabel}${refLine}
${order.giftDedicationMessage ? `\n💌 *Dedicatoria:* "${order.giftDedicationMessage}"` : ''}
----------------------------------------
¡Gracias por elegir SAMELÁ! "Tu brillo, nuestra inspiración ♡"`;

    return encodeURIComponent(text);
  }

  sendToWhatsApp(order: Order): void {
    const encoded = this.generateWhatsAppMessage(order);
    // WhatsApp contact for SAMELÁ (can be store or customer)
    const phone = order.customer.phone ? `57${order.customer.phone.replace(/\D/g, '')}` : '573145678901';
    if (typeof window !== 'undefined') {
      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`, '_blank');
    }
  }

  printInvoice(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
