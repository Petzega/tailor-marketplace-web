# SPEC.md - AME: Araceli Moda y Estilos

## 1. Información General del Proyecto

| Atributo | Descripción |
|----------|-------------|
| **Nombre del Proyecto** | AME - Tailor Marketplace |
| **Tipo de Aplicación** | E-commerce con servicios de sastrería |
| **Ubicación del Negocio** | Iquitos, Perú |
| **Versión** | 1.0.0 |
| **Estado** | En producción (MVP) |

### 1.1 Descripción del Negocio

AME (Araceli Moda y Estilos) es un negocio de venta de ropa y servicios de costura ubicado en Iquitos, Perú. El proyecto начаó como una idea de venta de ropa y servicios de costura, y evolucionó para incluir la venta de diversos productos además del servicio de costura.

### 1.2 Stakeholders

- **Propietario**: Administrador del negocio de costura
- **Clientes**: Personas en Iquitos que compran ropa y/o servicios de sastrería
- **Administradores**: Personal autorizado para gestionar el panel admin

---

## 2. Requisitos Funcionales

### 2.1 Catálogo de Productos (Público)

| RF-01 | El sistema debe mostrar un catálogo de productos accesibles públicamente |
|-------|----------------------------------------------------------------------------|
| RF-02 | El sistema debe permitir filtrar productos por categoría |
| RF-03 | El sistema debe mostrar la galería de imágenes de cada producto |
| RF-04 | El sistema debe mostrar el stock disponible por talla |
| RF-05 | El sistema debe permitir buscar productos por nombre |
| RF-06 | El sistema debe mostrar productos relacionados (pestaña "Otros") |

### 2.2 Carrito de Compras

| RF-07 | El sistema debe permitir agregar productos al carrito sin necesidad de autenticación |
|-------|---------------------------------------------------------------------------------------|
| RF-08 | El sistema debe permitir seleccionar la talla al agregar un producto |
| RF-09 | El sistema debe persistir el carrito en el almacenamiento local del navegador |
| RF-10 | El sistema debe permitir modificar la cantidad de cada item |
| RF-11 | El sistema debe permitir eliminar productos del carrito |
| RF-12 | El sistema debe mostrar el resumen del carrito en un drawer emergente |

### 2.3 Checkout

| RF-13 | El sistema debe permitir capturar los datos del cliente (nombre, teléfono, documento, dirección) |
|-------|-------------------------------------------------------------------------------------------------------|
| RF-14 | El sistema debe permitir seleccionar el método de entrega (retiro en tienda / delivery) |
| RF-15 | El sistema debe permitir seleccionar el método de pago |
| RF-16 | El sistema debe calcular automáticamente el total incluyendo costo de envío si aplica |
| RF-17 | El sistema debe generar un código de orden único con formato `ORD-YYMMDD###` |
| RF-18 | El sistema debe generar un código de validación de 6 caracteres para seguimiento |
| RF-19 | El sistema debe almacenar la orden en la base de datos con estado inicial PENDING |
| RF-20 | El sistema debe redireccionar a WhatsApp con el mensaje formateado de la orden |

### 2.4 Métodos de Pago

Los únicos métodos de pago aceptados son:

| RF-21 | Yape |
|-------|------|
| RF-22 | Plin |
| RF-23 | Transferencia BCP |
| RF-24 | Transferencia Interbank |
| RF-25 | Transferencia BBVA |
| RF-26 | Pago en efectivo |

> **Nota**: No se aceptan pagos con tarjetas de crédito o débito.

### 2.5 Seguimiento de Órdenes

| RF-27 | El sistema debe permitir consultar el estado de una orden mediante ID + token |
|-------|---------------------------------------------------------------------------------|
| RF-28 | El sistema debe mostrar el detalle completo de la orden (productos, totales, estado) |
| RF-29 | El sistema debe mostrar los posibles estados de la orden |

### 2.6 Panel de Administración

| RF-30 | El sistema debe permitir gestionar productos (crear, editar, eliminar, listar) |
|-------|------------------------------------------------------------------------------------|
| RF-31 | El sistema debe permitir gestionar clientes (crear, editar, eliminar, listar) |
| RF-32 | El sistema debe permitir gestionar órdenes (listar, cambiar estado) |
| RF-33 | El sistema debe permitir gestionar servicios de sastrería |
| RF-34 | El sistema debe mostrar un dashboard con analytics (ventas, productos críticos) |
| RF-35 | El sistema debe registrar un log de auditoría de todas las acciones admin |

### 2.7 Integración con WhatsApp/n8n

| RF-36 | El sistema debe exponer un webhook para actualizar el estado de las órdenes |
|-------|--------------------------------------------------------------------------------|
| RF-37 | El sistema debe validar la autenticación del webhook mediante Bearer token |

---

## 3. Requisitos No Funcionales

| RNF-01 | El sistema debe cargar las páginas en menos de 3 segundos |
|--------|------------------------------------------------------------|
| RNF-02 | El sistema debe ser responsive (móvil, tablet, desktop) |
| RNF-03 | El sistema debe funcionar sin necesidad de que el usuario inicie sesión |
| RNF-04 | El sistema debe validar todos los datos de entrada con Zod |
| RNF-05 | El sistema debe proteger los endpoints de administración con autenticación |
| RNF-06 | Las imágenes de productos no deben exceder 5MB |
| RNF-07 | El sistema debe usar Cloudinary para el almacenamiento de imágenes |

---

## 4. Arquitectura del Sistema

### 4.1 Stack Tecnológico

| Capa | Tecnología |
|------|-------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Estilos** | Tailwind CSS v4, shadcn/ui |
| **Backend** | Next.js (Server Actions), API Routes |
| **Base de Datos** | SQLite con Prisma ORM |
| **Autenticación** | Clerk (solo para admin) |
| **Estado** | Zustand (carrito) |
| **Validación** | Zod |
| **Imágenes** | Cloudinary |

### 4.2 Estructura de Archivos

```
tailor-marketplace-web/
├── actions/           # Server Actions (Next.js)
│   ├── analytics.ts
│   ├── customers.ts
│   ├── orders.ts
│   ├── products.ts
│   ├── search.ts
│   ├── services.ts
│   └── tracking.ts
├── app/               # Next.js App Router
│   ├── ame-studio-ops/   # Panel de admin
│   ├── checkout/         # Checkout público
│   ├── order/[id]/       # Seguimiento de orden
│   ├── product/[id]/     # Detalle de producto
│   ├── search/           # Búsqueda
│   └── services/         # Servicios de costura
├── components/        # Componentes React
├── lib/              # Utilidades y configuración
├── prisma/          # Schema y migraciones
├── store/           # Zustand stores
└── types/           # Tipos TypeScript
```

### 4.3 Modelo de Datos

#### Producto
```typescript
{
  id: string           // CUID
  name: string
  description?: string
  price: number
  stock: number        // Stock total (legacy)
  imageUrl?: string
  category: string     // READY_MADE, etc.
  gender?: string
  clothingType?: string
  ageGroup: string    // ADULT, KIDS, BABY
  sku: string         // Unique
}
```

#### Producto (Tallas)
```typescript
{
  id: string
  size: string         // S, M, L, XL, 32, 34...
  stock: number
  productId: string
}
```

#### Orden
```typescript
{
  id: string           // ORD-YYMMDD###
  status: string       // PENDING, IN_PROGRESS, DELIVERED_STORE, DELIVERED_DELIVERY, CANCELLED
  validationCode: string // 6 caracteres únicos

  // Cliente
  customerName: string
  customerPhone: string
  customerDocType: string  // DNI, RUC, CE, PASAPORTE
  customerDocument: string

  // Envío
  deliveryMethod: string  // STORE, DELIVERY
  address?: string
  reference?: string

  // Pago
  paymentMethod: string   // YAPE, PLIN, BCP, IBK, BBVA, EFECTIVO
  subtotal: number
  deliveryCost: number
  total: number

  // Relaciones
  items: OrderItem[]
  customer?: Customer
}
```

#### Cliente
```typescript
{
  id: string
  docType: string
  documentNumber: string  // Unique
  name: string
  phone?: string
  address?: string
  measurements?: string  // JSON para medidas de sastrería
  notes?: string
}
```

#### Servicio (Sastrería)
```typescript
{
  id: string
  status: string       // PENDING, FITTING, READY, DELIVERED
  serviceType: string
  description: string
  serviceNotes?: string
  price: number
  deposit: number
  balance: number
  receptionDate: DateTime
  fittingDate?: DateTime
  deliveryDate?: DateTime
  customerId: string
}
```

---

## 5. Flujos de Usuario

### 5.1 Flujo de Compra (Cliente)

```
1. Usuario explora el catálogo (Home / Search)
2. Usuario selecciona un producto
3. Usuario selecciona talla y cantidad
4. Usuario agrega al carrito
5. Usuario repite 2-4 para más productos
6. Usuario abre el carrito y hace click en "Finalizar Pedido"
7. Usuario completa formulario de checkout
8. Usuario selecciona método de entrega
9. Usuario selecciona método de pago
10. Usuario acepta términos y condiciones
11. Sistema crea la orden en BD (estado PENDING)
12. Sistema genera código de validación
13. Sistema redirecciona a WhatsApp con mensaje formateado
14. Usuario coordina pago con vendedor por WhatsApp
15. Vendedor confirma pago
16. Vendedor/n8n actualiza estado a IN_PROGRESS
17. Sistema envía código de validación al cliente
```

### 5.2 Flujo de Seguimiento

```
1. Cliente recibe código de validación por WhatsApp
2. Cliente visita /order/[id]
3. Cliente ingresa el token de validación
4. Sistema muestra el detalle de la orden
```

### 5.3 Flujo de Administración

```
1. Administrador inicia sesión en /ame-studio-ops (Clerk)
2. Administrador puede:
   - Ver dashboard con métricas
   - Gestionar productos (CRUD)
   - Gestionar clientes
   - Ver/actualizar órdenes
   - Gestionar servicios de sastrería
```

---

## 6. API Endpoints

### 6.1 Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/webhooks/orders` | Webhook para actualizar estado de orden (requiere Bearer token) |

### 6.2 Server Actions (Internas)

| Función | Ubicación | Descripción |
|---------|-----------|-------------|
| `getProducts` | actions/products.ts | Obtener productos con filtros |
| `getProductById` | actions/products.ts | Obtener detalle de producto |
| `createProduct` | actions/products.ts | Crear producto (admin) |
| `updateProduct` | actions/products.ts | Actualizar producto (admin) |
| `deleteProduct` | actions/products.ts | Eliminar producto (admin) |
| `createOrder` | actions/orders.ts | Crear orden desde checkout |
| `getOrderByToken` | actions/tracking.ts | Consultar orden por ID + token |
| `getCustomers` | actions/customers.ts | Listar clientes (admin) |
| `createCustomer` | actions/customers.ts | Crear cliente (admin) |
| `getServices` | actions/services.ts | Listar servicios (admin) |
| `createService` | actions/services.ts | Crear servicio (admin) |
| `getDashboardAnalytics` | actions/analytics.ts | Métricas del dashboard |

---

## 7. Casos de Uso

### UC-01: Compra de Productos
- **Actor**: Cliente sin cuenta
- **Precondiciones**: Ninguna
- **Flujo principal**:
  1. Explorar catálogo
  2. Agregar productos al carrito
  3. Completar checkout
  4. Redireccionar a WhatsApp
- **Postcondiciones**: Orden creada en BD, cliente en WhatsApp

### UC-02: Seguimiento de Orden
- **Actor**: Cliente
- **Precondiciones**: Tener código de orden y token de validación
- **Flujo principal**:
  1. Ingresar a /order/[id]
  2. Proporcionar token
  3. Ver detalle de orden
- **Postcondiciones**: Información de orden mostrada

### UC-03: Modificación de Orden Post-Checkout
- **Actor**: Cliente (vía WhatsApp/n8n)
- **Precondiciones**: Orden en estado PENDING
- **Flujo**: NO IMPLEMENTADO (pendiente)
- **Postcondiciones**: Pendiente

### UC-04: Cancelación de Orden
- **Actor**: Cliente (vía WhatsApp/n8n) o Administrador
- **Precondiciones**: Orden en estado PENDING o IN_PROGRESS
- **Flujo**: NO IMPLEMENTADO para cliente (solo admin desde panel)
- **Postcondiciones**: Pendiente

---

## 8. Estados de Orden

| Estado | Descripción |
|--------|-------------|
| PENDING | Orden creada, esperando confirmación de pago |
| IN_PROCESS | Pago confirmado, orden en preparación |
| DELIVERED_STORE | Orden entregada en tienda |
| DELIVERED_DELIVERY | Orden entregada por delivery |
| CANCELLED | Orden cancelada |

---

## 9. Validaciones del Checkout

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| Nombre | texto | Sí | min 2, max 100 caracteres |
| Teléfono | texto | Sí | formato Perú (9 dígitos) |
| Tipo documento | select | Sí | DNI, RUC, CE, PASAPORTE |
| Número documento | texto | Sí | según tipo documento |
| Dirección | texto | Sí si delivery | max 200 caracteres |
| Referencia | texto | No | max 100 caracteres |
| Método entrega | select | Sí | STORE, DELIVERY |
| Método pago | select | Sí | YAPE, PLIN, BCP, IBK, BBVA, EFECTIVO |
| Términos | checkbox | Sí | debe estar marcado |

---

## 10. Seguridad

- Los endpoints de administración requieren autenticación Clerk
- Las Server Actions verifican el email del usuario contra lista blanca (`ADMIN_EMAILS`)
- El webhook de órdenes valida Bearer token
- Todas las entradas se validan con Zod
- Los tokens de orden son únicos y generatedos aleatoriamente

---

## 11. Limitaciones del Sistema

1. **Sin negociación post-checkout**: No hay forma de modificar productos después de creado el pedido desde la web.
2. **Sin agente WhatsApp completo**: Los flujos de consulta y cancelación desde WhatsApp no están completamente implementados.
3. **Pago solo efectivo/transferencia**: No hay integración con pasarelas de pago.
4. **Base de datos SQLite**: No diseñado para alta concurrencia (para producción se recomienda PostgreSQL).

---

## 12. Glosario

| Término | Definición |
|---------|------------|
| CUID | Identificador único generado por Prisma |
| Orden ID | Identificador legible de orden con formato ORD-YYMMDD### |
| Validation Code | Código de 6 caracteres para seguimiento de orden |
| Server Action | Función server-side en Next.js |
| Bearer Token | Token de autenticación para webhooks |
| n8n | Herramienta de automatización (utilizada para WhatsApp) |

---

## 13. Historial de Versiones

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.0.0 | 2026-05 | Versión inicial del proyecto |

---

*Documento generado automáticamente*