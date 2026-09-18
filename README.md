# SAMELÁ · Belleza, Accesorios y Regalos ♡
> **"Pequeños detalles, grandes momentos · Tu brillo, nuestra inspiración"**  
> *Proyecto Formativo SENA: Técnico en Programación de Software — Ficha 3167081*  
> *Institución Educativa Marco Fidel Suárez · Bogotá D.C., Colombia (Septiembre 2026)*  
> **Emprendedoras y Desarrolladoras:** Pamela Cuéllar Bonilla & Sara Sofía Cardozo Cuéllar  
> **Docente Asesor:** Lic. Yair Fernando Merchán Lesmes

---

## Tabla de Contenido
1. [Descripción General](#1-descripción-general)
2. [Requisitos del Sistema e Instalación](#2-requisitos-del-sistema-e-instalación)
3. [Configuración y Variables de Entorno](#3-configuración-y-variables-de-entorno)
4. [Arquitectura del Software](#4-arquitectura-del-software)
5. [Diseño Visual y Sistema de Estilos](#5-diseño-visual-y-sistema-de-estilos)
6. [Estructura y Esquema de Datos](#6-estructura-y-esquema-de-datos)
7. [Flujo de Negocio: Pagos, Órdenes y Facturación](#7-flujo-de-negocio-pagos-órdenes-y-facturación)
8. [Estructura de Carpetas del Proyecto](#8-estructura-de-carpetas-del-proyecto)
9. [Comandos de Verificación y Compilación](#9-comandos-de-verificación-y-compilación)

---

## 1. Descripción General

**SAMELÁ** es una plataforma de comercio electrónico de alta gama especializada en el cuidado facial femenino, accesorios delicados y kits de regalo personalizados. Desarrollada como proyecto aplicativo para el programa Técnico en Programación de Software del SENA, integra:

- **Catálogo Interactivo con Visor 3D WebGL**: Permite inspeccionar envases cosméticos de vidrio esmerilado, frascos cuentagotas para sérums con refracción óptica, tapas en oro rosa, espejos compactos grabados y cajas de regalo con lazo de satén mediante rotación 360° y zoom orbital.
- **Configurador "Arma tu Caja de Regalo SAMELÁ"**: Selector interactivo paso a paso para combinar productos de skincare facial con accesorios y lazos personalizados.
- **Módulo Obligatorio de Registro de Clientes**: Verificación de identidad, dirección completa y canal de WhatsApp para entrega y facturación legal.
- **Sistema Integrado de Pagos Exclusivos (Transferencia o Efectivo)**: Validación de cuentas oficiales (Bancolombia, Nequi y Daviplata) y registro de pagos en efectivo contra entrega.
- **Emisión de Órdenes de Compra y Facturas de Venta en PDF**: Panel administrativo para verificar comprobantes, asignar número consecutivo de factura electrónica, imprimir/descargar en PDF optimizado y enviar directamente a WhatsApp.

---

## 2. Requisitos del Sistema e Instalación

### 2.1 Requisitos Previos
- **Node.js**: Versión `20.18.0` o superior (LTS recomendada `v22.x`).
- **NPM**: Versión `10.x` o superior (o gestor compatible como `bun`).
- **Navegador Web**: Chrome, Edge, Safari o Firefox con soporte para **WebGL 2.0**.

### 2.2 Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ai-studio-angular-app
   ```

2. **Instalar dependencias de producción y desarrollo:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   El aplicativo se desplegará localmente en `http://localhost:3000` (o `0.0.0.0:3000`).

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Genera los paquetes optimizados en el directorio `dist/`.

---

## 3. Configuración y Variables de Entorno

### 3.1 Variables de Entorno (`.env` / `.env.example`)
El aplicativo cuenta con el archivo `.env.example`. Para entornos de despliegue personalizados, copie o defina los valores correspondientes:

```env
# GEMINI_API_KEY: Llave de API opcional para servicios generativos y de análisis en backend
GEMINI_API_KEY=""

# APP_URL: URL base pública del aplicativo (ej. Cloud Run, dominio personalizado o localhost)
APP_URL="http://localhost:3000"
```

### 3.2 Configuración del Puerto en Angular CLI (`angular.json`)
El servidor de desarrollo está preconfigurado para escuchar en el puerto `3000` y exponer la interfaz a la red local mediante el script:
```json
"dev": "cross-env ng serve --port=3000 --host=0.0.0.0 --allowed-hosts=true"
```

### 3.3 Presupuestos de Memoria y Bundle (`budgets`)
Debido a la inclusión del motor gráfico 3D **Three.js** y **Canvas-Confetti**, `angular.json` cuenta con presupuestos de compilación ajustados para evitar errores por tamaño inicial:
```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "2MB",
    "maximumError": "4MB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "4kB",
    "maximumError": "8kB"
  }
]
```

---

## 4. Arquitectura del Software

El sistema está construido siguiendo la arquitectura moderna de **Angular 21**:

```
+--------------------------------------------------------------------------+
|                               CAPA CLIENTE                               |
|                                                                          |
|  +--------------------+   +---------------------+   +-----------------+  |
|  |  Catálogo & Filtros|   | Configurador Regalos|   | Visor 3D WebGL  |  |
|  | (ProductCard/Modal)|   | (CustomKitBuilder)  |   | (ThreeViewer)   |  |
|  +---------+----------+   +----------+----------+   +--------+--------+  |
|            |                         |                       |           |
|  +---------v-------------------------v-----------------------v--------+  |
|  |                        SERVICIOS REACTIVOS                         |  |
|  |   - ProductService  : Estado de catálogo, filtros y búsquedas      |  |
|  |   - CartService     : Carrito de compras, descuentos y empaques    |  |
|  |   - AuthService     : Registro de clientes y sesión persistente    |  |
|  |   - OrderService    : Órdenes, conciliación y facturación oficial  |  |
|  +-----------------------------------+--------------------------------+  |
|                                      |                                   |
|  +-----------------------------------v--------------------------------+  |
|  |                   PAGO, CONCILIACIÓN Y EXPORTACIÓN                 |  |
|  |  +------------------+  +------------------+  +-------------------+ |  |
|  |  | CheckoutModal    |  | AdminPanel       |  | InvoiceModal      | |  |
|  |  | (Transfer/Cash)  |  | (Auditoría Tienda|  | (PDF print /      | |  |
|  |  |                  |  | & Aprobación)    |  |  WhatsApp export) | |  |
|  |  +------------------+  +------------------+  +-------------------+ |  |
+--------------------------------------------------------------------------+
```

### 4.1 Principios y Tecnologías Clave:
- **Zoneless con Angular Signals**: Rendimiento óptimo sin la sobrecarga de `zone.js`. El estado se propaga mediante primitivas reactivas `signal()`, `computed()` y `effect()`.
- **Componentes Standalone**: Arquitectura desacoplada sin `NgModule` legacy.
- **Formularios Reactivos (`ReactiveFormsModule`)**: Validación estricta en tiempo real en los formularios de registro de clientes (`AuthModalComponent`) y pasarela de pago (`CheckoutModalComponent`). Prohibido el uso de `ngModel`.
- **Motor Gráfico Three.js (WebGL 2.0)**:
  - Materiales físicos avanzados (`MeshPhysicalMaterial`) con propiedades de rugosidad, transmisión de luz (`transmission`), grosor (`thickness`) y brillo metálico para tapas doradas y cristales.
  - Generación procedural de geometrías (tarros cosméticos, botellas cuentagotas con pipeta, cajas cúbicas con lazo y espejos circulares grabados).
  - Controles de órbita y animación con amortiguación suave (`damping`) y soporte táctil para dispositivos móviles.
- **Server-Side Rendering (SSR)**: Servidor Express integrado para optimización SEO, entrega inicial ultrarrápida y metadatos OpenGraph.

---

## 5. Diseño Visual y Sistema de Estilos

El diseño fue concebido bajo una estética editorial femenina, elegante y pulcra, utilizando **Tailwind CSS v4** y tipografía de alto contraste.

### 5.1 Paleta Cromática Institucional

| Tono | Código HEX | Rol / Uso en la Interfaz |
| :--- | :--- | :--- |
| **Rosa Lienzo** | `#FFF9FC` | Fondo principal de la aplicación, suave y descansado a la vista. |
| **Rosa Suave** | `#FFF0F6` / `#FCE7F3` | Contenedores secundarios, tarjetas de producto y badges. |
| **Borde Rosa Delicado** | `#F8D8E7` | Separadores y líneas de acento sutiles para delimitar tarjetas. |
| **Rosa Magenta Primario** | `#BE185D` / `#9D174D` | Botones de acción principal (CTA), precios destacados y lazos. |
| **Lavanda Claro** | `#FAF5FF` / `#EDE9FE` | Fondos de datos informativos, cuentas bancarias y badges. |
| **Púrpura Ciruela Oscuro**| `#4A044E` / `#701A75` | Títulos principales de sección, tipografía editorial y footer. |
| **Verde Esmeralda** | `#059669` / `#ECFDF5` | Sello de "Pago Verificado", facturas aprobadas y badges de éxito. |

### 5.2 Tipografía

1. **Titulares y Display**: `'Playfair Display', Georgia, serif`
   - Aplicado mediante la clase utilitaria `.font-serif-title`.
   - Evoca elegancia, sofisticación y el encanto de la perfumería y cosmética de lujo.
2. **Cuerpo y Controles**: `'DM Sans', system-ui, sans-serif`
   - Aplicado mediante la clase utilitaria `.font-sans-body`.
   - Garantiza alta legibilidad en pantallas retina y dispositivos móviles.

---

## 6. Estructura y Esquema de Datos

Los contratos de datos se encuentran modelados con estricta seguridad tipográfica en TypeScript (`src/app/models/product.model.ts`):

### 6.1 Modelo de Usuario / Cliente (`UserProfile`)
Contrato de datos para registrar los clientes antes de procesar una orden de compra:
```typescript
interface UserProfile {
  id: string;               // Identificador único del cliente (UUID o timestamp)
  fullName: string;         // Nombre y apellidos completos
  email: string;            // Correo electrónico para facturación
  phone: string;            // Teléfono o WhatsApp de contacto
  documentId: string;       // Cédula de ciudadanía o NIT para factura legal
  city: string;             // Ciudad de despacho (ej. Bogotá D.C., Medellín)
  address: string;          // Dirección completa de entrega
  neighborhood: string;     // Barrio o sector
  additionalNotes?: string; // Indicaciones adicionales para el repartidor
}
```

### 6.2 Modelo de Catálogo de Productos (`Product`)
Representación de cosméticos, accesorios y kits:
```typescript
interface Product {
  id: string;               // Código SKU del producto (ej. "sk-glow-kit")
  name: string;             // Nombre comercial
  category: ProductCategory;// 'skincare' | 'accesorios' | 'regalos' | 'combos'
  categoryLabel: string;    // Etiqueta legible (ej. "Cuidado Facial")
  price: number;            // Precio en Pesos Colombianos (COP)
  originalPrice?: number;   // Precio tachado anterior para promociones
  rating: number;           // Calificación promedio (1.0 - 5.0)
  reviewsCount: number;     // Cantidad de reseñas
  badge?: string;           // Distintivo (ej. "MÁS VENDIDO", "EDICIÓN LIMITADA")
  shortDescription: string; // Resumen para tarjeta de catálogo
  fullDescription: string;  // Descripción extendida
  benefits: string[];       // Lista de beneficios dermatológicos o de uso
  includes: string[];       // Contenido del empaque o rutina
  imageUrl: string;         // Fotografía de alta resolución
  model3DType: 'jar' | 'serum' | 'mirror' | 'box' | 'jewelry'; // Geometría 3D asociada
  model3DLabel: string;     // Etiqueta del modelo 3D
  inStock: boolean;         // Disponibilidad de inventario
}
```

### 6.3 Modelo de Órdenes y Facturación (`Order` y `OrderItem`)
Estructura del documento de compra y factura comercial:
```typescript
type PaymentMethod = 'transferencia' | 'efectivo';
type PaymentStatus = 'pendiente_pago' | 'comprobante_enviado' | 'pago_verificado';

interface OrderItem {
  productId: string;
  productName: string;
  categoryLabel: string;
  price: number;
  quantity: number;
  subtotal: number;
  model3DType: string;
}

interface PaymentDetails {
  bankName?: string;             // "Bancolombia" | "Nequi" | "Daviplata" | etc.
  referenceNumber?: string;      // Número de aprobación o comprobante de transferencia
  voucherImageUrl?: string;      // Comprobante adjunto
  cashAmountToPay?: number;      // Denominación del billete con que pagará en efectivo
  notes?: string;                // Comentarios adicionales del cliente
}

interface Order {
  id: string;                    // Consecutivo comercial (ej. "OC-2026-8492")
  invoiceNumber?: string;        // Número de Factura Oficial (ej. "FACT-SM26-1049")
  createdAt: string;             // Fecha y hora de creación
  verifiedAt?: string;           // Fecha y hora de conciliación del pago
  customer: UserProfile;         // Cliente registrado asociado
  items: OrderItem[];            // Productos ordenados
  subtotal: number;              // Subtotal de ítems
  discount: number;              // Descuento aplicado por cupón
  shippingCost: number;          // Costo de envío ($0 si subtotal >= $90.000)
  total: number;                 // Total neto a pagar (COP)
  paymentMethod: PaymentMethod;  // 'transferencia' | 'efectivo'
  status: PaymentStatus;         // Estado del ciclo de vida
  paymentDetails: PaymentDetails;// Datos de pago
  giftPackaging: boolean;        // Indicador de empaque de lujo (+$8.000)
  giftDedicationMessage?: string;// Mensaje caligrafiado para la tarjeta
}
```

### 6.4 Persistencia de Datos
El aplicativo almacena los estados reactivos de forma sincronizada en el almacenamiento local del cliente (`localStorage`), garantizando que las órdenes registradas, el perfil del usuario autenticado y los artículos del carrito persistan entre recargas de página sin depender de una base de datos externa obligatoria durante la fase de prototipado. La estructura está lista para conectarse directamente a **Cloud Firestore** o una API REST en PostgreSQL/Cloud SQL.

---

## 7. Flujo de Negocio: Pagos, Órdenes y Facturación

El sistema cumple rigurosamente las condiciones comerciales solicitadas:

```
[Cliente añade al carrito] 
           │
           ▼
[¿Está registrado?] ──── NO ───► [AuthModal: Registro con Cédula, Teléfono y Dirección]
           │ SÍ
           ▼
[CheckoutModal: Selección de Método de Pago]
    ├── Opción A: Transferencia Digital (Bancolombia Cta 524-892104-32 o Nequi 3145678901)
    │             Ingresa N° de comprobante / referencia bancaria.
    └── Opción B: Efectivo contra entrega (Indica valor con el que cancelará para cambio).
           │
           ▼
[Generación Inmediata de Orden de Compra: OC-2026-XXXX]
           │
           ▼
[Panel de Tienda SAMELÁ (AdminPanel)]
  - Pamela & Sara auditan el pago en su cuenta.
  - Hacen clic en "Verificar Pago y Emitir Factura".
           │
           ▼
[Emisión de Factura Oficial de Venta: FACT-SM26-XXXX]
  - Sello de certificación y conciliación de fondos.
  - Firma de las fundadoras y código QR de verificación.
  - Opciones de entrega:
      1. Descarga / Impresión en PDF limpio (`window.print()` con `#invoice-printable-area`).
      2. Envío directo al WhatsApp de la tienda y del cliente (`api.whatsapp.com`).
```

---

## 8. Estructura de Carpetas del Proyecto

```
/
├── .env.example                            # Plantilla de variables de entorno
├── angular.json                            # Configuración de compilación, SSR y presupuestos
├── eslint.config.js                        # Reglas de validación de código TypeScript y plantillas
├── metadata.json                           # Metadatos del aplicativo (nombre, permisos, capacidades)
├── package.json                            # Dependencias del proyecto y scripts de ejecución
├── tsconfig.json                           # Configuración base de TypeScript
│
├── public/                                 # Recursos estáticos globales
│   └── favicon.ico                         # Favicon corporativo
│
└── src/
    ├── index.html                          # Entrada HTML, fuentes tipográficas y metadatos SEO
    ├── styles.css                          # Importación de Tailwind v4, fuentes y CSS para impresión
    ├── main.ts                             # Bootstrap del cliente (Zoneless)
    ├── main.server.ts                      # Bootstrap SSR para Node.js
    ├── server.ts                           # Servidor Express para servir SSR y rutas estáticas
    │
    └── app/
        ├── app.ts                          # Componente raíz de la aplicación
        ├── app.html                        # Maquetación global (Hero, Catálogo, 3D Spotlight, Modales)
        ├── app.css                         # Estilos locales de la aplicación
        │
        ├── models/
        │   └── product.model.ts            # Interfaces de TypeScript (Product, Order, User, etc.)
        │
        ├── services/
        │   ├── product.service.ts          # Gestión del catálogo de productos y filtros
        │   ├── cart.service.ts             # Lógica del carrito de compras, cupones y totales
        │   ├── auth.service.ts             # Registro y autenticación de clientes y modo administrador
        │   └── order.service.ts            # Gestión del ciclo de órdenes, facturas, PDF y WhatsApp
        │
        └── components/
            ├── navbar/                     # Barra superior de navegación y accesos rápidos
            ├── hero/                       # Banner principal de presentación y llamado a la acción
            ├── three-viewer/               # Motor WebGL 3D con Three.js (renderizado de frascos y cajas)
            ├── product-card/               # Tarjeta interactiva de producto con botón 3D y carrito
            ├── product-modal/              # Modal detallado con beneficios, ingredientes e includes
            ├── viewer-modal/               # Modal dedicado para inspección 3D orbital en pantalla completa
            ├── custom-kit-builder/         # Configurador interactivo "Arma tu Caja de Regalo SAMELÁ"
            ├── cart-drawer/                # Carrito deslizable lateral con cálculo de envío y cupones
            ├── auth-modal/                 # Formulario de registro e inicio de sesión de clientes
            ├── checkout-modal/             # Pasarela de pagos (Transferencia Bancaria o Efectivo)
            ├── order-success-modal/        # Confirmación de orden generada y registro de comprobante
            ├── invoice-modal/              # Factura oficial de venta y orden imprimible en PDF
            ├── orders-history-modal/       # Historial de pedidos anteriores del cliente
            ├── admin-panel/                # Panel flotante de verificación y auditoría para la tienda
            └── footer/                     # Pie de página con créditos SENA y datos de contacto
```

---

## 9. Comandos de Verificación y Compilación

Para asegurar la calidad del código, ejecute los siguientes comandos en la terminal:

- **Validación de Linter (ESLint):**
  ```bash
  npm run lint
  ```
  *Garantiza que no existan errores de sintaxis, variables huérfanas o tipos incompatibles.*

- **Compilación de Producción:**
  ```bash
  npm run build
  ```
  *Ejecuta la compilación AOT de Angular 21, genera los paquetes para navegador (`browser`) y servidor (`server`), y valida los presupuestos de memoria.*

---

*SAMELÁ — Emprendimiento de Belleza, Cuidado Facial y Accesorios.*  
*Diseñado con dedicación y excelencia técnica para el Servicio Nacional de Aprendizaje (SENA).*
