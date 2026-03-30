# Roadmap de Implementación: Gestión de Órdenes y Soporte para n8n

Este documento rastrea el progreso de la refactorización del flujo de checkout y la creación de la API para el agente de WhatsApp (n8n).

## Fase 1: Capa de Datos (Prisma) 🗄️
*Objetivo: Persistir la intención de compra y generar los validadores necesarios.*

- [ ] **Actualizar `schema.prisma`:**
  - [ ] Crear el modelo `Order` con los estados: `PENDING`, `IN_PROGRESS`, `CANCELLED`, `COMPLETED`.
  - [ ] Añadir campos de identidad en `Order`: `customerDocType` (DNI, RUC, CE) y `customerDocument`.
  - [ ] Añadir campos financieros y logísticos: `subtotal`, `deliveryCost`, `total`, `deliveryMethod`, `paymentMethod`.
  - [ ] Añadir campo de seguridad: `validationCode` (único por orden).
  - [ ] Crear el modelo `OrderItem` vinculado a `Order` y `Product`.
  - [ ] Añadir campos a `OrderItem`: `productId`, `size` (opcional), `quantity`, `price` (precio congelado al momento de la compra).
- [ ] **Migración:**
  - [ ] Ejecutar `npx prisma migrate dev --name add_orders_schema`.
  - [ ] Generar el nuevo cliente de Prisma (`npx prisma generate`).

## Fase 2: Lógica de Negocio y API REST (Backend) ⚙️
*Objetivo: Exponer los servicios de forma segura para que el agente n8n pueda leer y mutar las órdenes.*

- [ ] **Configuración de Seguridad:**
  - [ ] Crear variable de entorno `N8N_API_KEY` para proteger las rutas.
  - [ ] Crear un middleware o utilidad para validar el header `Authorization` en las rutas `/api/n8n/*`.
- [ ] **Endpoint: Creación de Orden (Uso interno del Frontend):**
  - [ ] Crear Server Action o ruta `POST /api/orders` que reciba el carrito y los datos del cliente, genere el `validationCode`, y guarde la orden en estado `PENDING`. Devuelve el `orderId`.
- [ ] **Endpoints para n8n:**
  - [ ] [cite_start]`GET /api/n8n/orders/[id]`: Retorna el detalle completo de la orden (Escenarios: Confirmación [cite: 6]).
  - [ ] `POST /api/n8n/orders/validate`: Recibe `customerDocument` y `validationCode`. [cite_start]Retorna la orden si coincide (Escenarios: Consulta [cite: 7] [cite_start]y Cancelación [cite: 8]).
  - [ ] `PATCH /api/n8n/orders/[id]/status`: Permite a n8n actualizar el estado (ej. de PENDING a IN_PROGRESS o CANCELLED).
  - [ ] [cite_start]`PATCH /api/n8n/orders/[id]/items`: Permite agregar o remover productos de una orden y recalcula totales (Escenarios: Disminución [cite: 8] [cite_start]y Aumento de productos [cite: 9, 10]).

## Fase 3: Interfaz de Usuario (Frontend) 🖥️
*Objetivo: Actualizar el formulario de checkout para recolectar la identidad del cliente y conectar con el backend.*

- [ ] **Actualizar `app/checkout/page.tsx`:**
  - [ ] Modificar el estado `customerData` para incluir `docType` (DNI, RUC, CE) y `documentNumber`.
  - [ ] Añadir el selector de tipo de documento en la UI.
  - [ ] Añadir el input para el número de documento con validación básica de longitud.
  - [ ] Refactorizar `handleWhatsAppCheckout` para que sea asíncrono.
  - [ ] Enviar el payload al backend (ruta interna creada en Fase 2) antes de abrir WhatsApp.
  - [ ] Mostrar un `<Spinner />` o estado de carga mientras se crea la orden en la base de datos.
  - [ ] Usar el `orderId` devuelto por el backend para generar el ticket.

## Fase 4: Utilidades e Integración 🛠️
*Objetivo: Asegurar que el mensaje enviado por el usuario contenga el ID necesario para n8n.*

- [ ] **Actualizar `lib/whatsapp.ts`:**
  - [ ] Modificar la interfaz `WhatsAppMessageData` para que requiera el `orderId`.
  - [ ] Modificar `generateWhatsAppTicket` para incluir el `orderId` al inicio del mensaje (ej. `*ORDEN #123456*`).

## Fase 5: Pruebas End-to-End (Opcional pero recomendado) 🧪
- [ ] Simular flujo de compra completo desde el frontend.
- [ ] Verificar que la base de datos registre la orden correctamente.
- [ ] Probar los endpoints de n8n usando Postman/Insomnia simulando ser el agente.