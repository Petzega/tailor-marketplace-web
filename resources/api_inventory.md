# 🌐 Inventario de APIs y Server Actions (The Tailor Marketplace)

En la arquitectura actual de **Next.js (App Router)**, los puntos de conexión se dividen en dos categorías: APIs Clásicas REST (diseñadas para integraciones externas como n8n) y Server Actions (endpoints RPC invisibles para los componentes de React).

---

## 🟩 1. APIs Clásicas REST (Integraciones Externas / HTTP Fetch)

Estas rutas viven dentro de la carpeta `app/api/` y responden a peticiones HTTP convencionales.

### Módulo Público
| Método | Endpoint | Descripción | Seguridad / Auth |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/orders` | Procesamiento público del carrito, cálculo de precios e inyección en BD. | Abierto (Límite max 50 ítems) |
| **POST** | `/api/webhooks/orders` | Recibe confirmaciones de pago por WhatsApp y mutaciones externas. | `WEBHOOK_SECRET` |

### Módulo Integración n8n (`/api/n8n/`)
_Todas las rutas debajo están protegidas por el Middleware exigiendo `N8N_API_KEY` o `N8N_WEBHOOK_SECRET` como Bearer Token._

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/api/n8n/products/search` | Motor de búsqueda de catálogo para respuestas de chatbot. |
| **GET** | `/api/n8n/orders/[id]` | Consulta información general y estado financiero de un pedido existente. |
| **POST**| `/api/n8n/orders/validate` | Validar operaciones de transferencia, datos e integridad. |
| **PATCH**| `/api/n8n/orders/[id]/status` | Modificar el estado de la venta. Se unifican los estados a los nativos (Prisma). |
| **PATCH**| `/api/n8n/orders/[id]/items` | Corrección logística si el vendedor manipula un producto internamente. |

---

## 🟦 2. Server Actions Internas (Interfaces UI Administrador)

Estas funciones viven dentro de la carpeta `actions/` y actúan como RPC Server-side para los componentes del panel. Todas (excepto las especificadas como públicas) están protegidas por Zod y la lista blanca de Email en Clerk.

### 📦 Gestión de Órdenes (`actions/orders.ts`)
*   `createOrder()` : Replicante del checkout para crear transacciones masivas/limitadas. *(Público)*
*   `getOrders(page, limit, query, ...)` : Consumo hiper-paginado de la tabla matriz en /ame-studio-ops.
*   `getOrderById(id)` : Ficha del pedido.
*   `getOrderStats()` : Tablero de métricas (Pending vs Completed).
*   `updateOrderStatus()` : Control manual de ciclo de vida.

### 👗 Catálogo de Productos (`actions/products.ts`)
*   `getProducts(...)` / `getProductById(id)` : Visor de aparadores con filtros por Categoría, Talla, Genero. *(Público)*
*   `createProduct()` : Validador de Zod y gestor de subida directa bufferizada en Cloudinary (< 5MB limit).
*   `updateProduct()` / `deleteProduct()` : Rollback a Cloudinary .destroy() si se elimina y transacción en Cascada.
*   `getProductStats()` : Reportes numéricos para el Kanban administrativo.

### 🧵 Sastrería Kanban (`actions/services.ts`)
*   `getKanbanServices()` : Tablero Drag&Drop que filtra históricamente ocultando órdenes `DELIVERED` viejas (+7 días) para impedir Fugas de Memoria y caídas DOM.
*   `updateServiceStatus(...)` : Modificador de ficha React-based.
*   `saveService(...)` : Transacción atómica M:N para confecciones.

### 📊 Sistema Centralizado
*   `getDashboardAnalytics()` en `analytics.ts` : Selector de Prisma inteligente que omite Descripciones y Metadata pesada y grafica las ventas por mes/día en el panel principal.
*   `getOrderByToken(id, token)` en `tracking.ts` : API de consulta al cliente que implementa candados Anti-IDOR para proteger información personal de atacantes masivos. *(Público con Token)*
