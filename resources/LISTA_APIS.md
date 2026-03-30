# Documentación de Integración AME: Gestión de Órdenes y n8n

Este documento centraliza el roadmap de desarrollo y los contratos de la API REST para el flujo de checkout y la integración con el agente de WhatsApp (n8n).

## Roadmap de Implementación

### Fase 1: Capa de Datos (Prisma) 🗄️
- [x] Crear modelo `Order` con estados y campos de identidad (DNI, RUC, CE).
- [x] Crear modelo `OrderItem` para congelar precios en el momento de la compra.
- [x] Ejecutar migraciones y poblar base de datos de prueba (`seed.ts`).

### Fase 2: Lógica de Negocio y API REST (Backend) ⚙️
- [ ] Configurar variable de entorno `N8N_API_KEY` y middleware de autenticación.
- [ ] Desarrollar `POST /api/orders` (Creación interna de la orden desde el Frontend).
- [ ] Desarrollar `GET /api/n8n/orders/[id]` (Lectura de orden para n8n).
- [ ] Desarrollar `POST /api/n8n/orders/validate` (Validación de identidad y código validador).
- [ ] Desarrollar `PATCH /api/n8n/orders/[id]/status` (Actualización de estado logístico).
- [ ] Desarrollar `PATCH /api/n8n/orders/[id]/items` (Modificación de carrito desde WhatsApp).

### Fase 3: Interfaz de Usuario (Frontend) 🖥️
- [ ] Actualizar `customerData` en `app/checkout/page.tsx` para incluir tipo de documento (DNI, RUC, CE).
- [ ] Consumir `POST /api/orders` y esperar la respuesta exitosa antes de generar el link de WhatsApp.
- [ ] Manejar estados de carga (`Spinner`) y validaciones de error durante la creación de la orden.

### Fase 4: Utilidades e Integración 🛠️
- [ ] Actualizar `lib/whatsapp.ts` para incluir el ID de la orden en la cabecera del ticket.

---

## Especificaciones de la API REST

### 🔒 Seguridad Requerida
Todas las rutas externas expuestas bajo el prefijo `/api/n8n/*` requieren obligatoriamente el envío del siguiente header HTTP para su autorización:
`Authorization: Bearer <TU_API_KEY_SECRETA>`

---

### 1. APIs Internas (Consumo Frontend)

#### `POST /api/orders`
Crea la orden en la base de datos a partir del carrito, recalcula y congela precios consultando los productos reales, y genera el `validationCode`. No requiere autorización (consumo interno).

* **Body (JSON):**
  ```json
  {
    "customerData": {
      "name": "Juan Pérez",
      "docType": "DNI",
      "documentNumber": "74125896",
      "phone": "999888777",
      "address": "Av. Las Flores 123",
      "reference": "Frente al parque"
    },
    "items": [
      { "id": "cuid_del_producto", "quantity": 2, "size": "M" }
    ],
    "deliveryMethod": "DELIVERY",
    "paymentMethod": "Yape"
  }
  ```    

* **Response (201 Create):** 
  ```json
  {
    "success": true,
    "orderId": "ORD-12345678",
    "validationCode": "A1B2C3"
  }
  ```

### APIs Externas (Consumo n8n)

#### `GET /api/n8n/orders/[id]`
Obtiene el detalle completo de la orden extraída del ticket inicial de WhatsApp para que el agente tenga contexto de la compra.

* **Response (200 OK):**
  ```json
  {
  "id": "ORD-12345678",
  "status": "PENDING",
  "customerName": "Juan Pérez",
  "customerDocType": "DNI",
  "customerDocument": "74125896",
  "deliveryMethod": "DELIVERY",
  "subtotal": 150.00,
  "deliveryCost": 10.00,
  "total": 160.00,
  "items": [
    {
      "productId": "cuid...",
      "productName": "Camisa Oxford",
      "quantity": 2,
      "price": 75.00,
      "size": "M"
    }
   ]
  }
  ```

#### `POST /api/n8n/orders/validate`
Cruza el documento de identidad con el código validador para permitir consultas o cancelaciones seguras.

* **Body (JSON):**
  ```json
  {
  "documentNumber": "74125896",
  "validationCode": "A1B2C3"
  }
  ```

* **Response (200 OK):** 
Devuelve el objeto completo de la orden (misma estructura que el endpoint GET).

* **Response (401 Unauthorized):** 
  ```json
  { "error": "Documento o código validador incorrecto" }
  ```

#### `PATCH /api/n8n/orders/[id]/status`
Cambia el estado operativo de la orden. Fundamental para avanzar a IN_PROGRESS tras confirmar el pago o a CANCELLED.

* **Body (JSON):**
  ```json
  {
  "status": "IN_PROGRESS"
  }
  ```

* **Response (200 OK):**
  ```json
  {
  "success": true,
  "id": "ORD-12345678",
  "status": "IN_PROGRESS",
  "validationCode": "A1B2C3"
  }
  ```

#### `PATCH /api/n8n/orders/[id]/items`
Agrega o elimina items de una orden que continúa en estado PENDING. El backend debe encargarse de recalcular los campos subtotal y total.

* **Body (JSON):**
  ```json
  {
  "action": "ADD", 
  "productId": "cuid_del_producto",
  "size": "M",
  "quantity": 1
  }
  ```

* **Response (200 OK):**
  ```json
  {
  "success": true,
  "message": "Orden actualizada correctamente",
  "newSubtotal": 225.00,
  "newTotal": 235.00,
  "items": [
    {
      "productId": "cuid...",
      "productName": "Camisa Oxford",
      "quantity": 3,
      "price": 75.00,
      "size": "M"
    }
   ]
  }
  ```