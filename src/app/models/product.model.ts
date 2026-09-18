export type ProductCategory = 'todos' | 'skincare' | 'accesorios' | 'regalos' | 'combos';

export interface Product {
  id: string;
  name: string;
  category: 'skincare' | 'accesorios' | 'regalos' | 'combos';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: 'OFERTA' | 'MÁS VENDIDO' | 'NUEVO' | 'EDICIÓN LIMITADA' | 'RUTINA COMPLETA';
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  includes?: string[];
  skinType?: string;
  howToUse?: string;
  ingredients?: string;
  imageUrl: string;
  model3DType: 'jar' | 'serum' | 'mirror' | 'box' | 'jewelry';
  model3DLabel: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customNote?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string; // WhatsApp
  documentId: string; // Cédula o NIT
  address: string;
  city: string;
  neighborhood: string;
  additionalNotes?: string;
  createdAt: string;
}

export type PaymentMethod = 'transferencia' | 'efectivo';

export type PaymentStatus = 
  | 'pendiente_pago' 
  | 'comprobante_enviado' 
  | 'pago_verificado' 
  | 'en_preparacion' 
  | 'despachado' 
  | 'entregado';

export interface OrderItem {
  productId: string;
  productName: string;
  categoryLabel: string;
  price: number;
  quantity: number;
  subtotal: number;
  model3DType?: string;
}

export interface Order {
  id: string; // e.g. OC-2026-4891
  invoiceNumber?: string; // e.g. FACT-SM26-1042
  createdAt: string;
  verifiedAt?: string;
  customer: UserProfile;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    bankName?: string; // Bancolombia / Nequi / Daviplata / Efectivo
    referenceNumber?: string; // Comprobante de transferencia
    voucherFileSimulated?: string;
    cashAmountToPay?: number; // Con cuánto paga para cambio
    notes?: string;
  };
  giftPackaging: boolean;
  giftDedicationMessage?: string;
  status: PaymentStatus;
  notes?: string;
}
