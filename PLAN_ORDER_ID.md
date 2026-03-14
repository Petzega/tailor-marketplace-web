# 📦 Arquitectura de Pedidos por WhatsApp - AME (Araceli Moda y Estilos)

Este documento detalla el plan de desarrollo para el sistema de gestión de pedidos sin fricción de AME. El objetivo es mantener la fluidez de una venta rápida por WhatsApp (sin obligar al usuario a registrarse), sumando la potencia tecnológica de un e-commerce corporativo con seguimiento en tiempo real.

## 🧠 Decisiones Técnicas Clave

1. **Guest Checkout (Sin Login):** La identidad del usuario se basa en su **Número de Celular**. Esto elimina las barreras de compra. Si en el futuro se implementa un sistema de usuarios, las órdenes históricas se vincularán mediante este número.
2. **Carrito Efímero vs. Orden Persistente:** El carrito de compras vive exclusivamente en la memoria del navegador (Frontend). Solo se interactúa con la base de datos en el momento en que el usuario hace clic en "Hacer pedido", transformando ese carrito temporal en una **Orden** oficial.
3. **Tracking Dual:** El cliente puede rastrear su pedido de dos formas seguras:
    * **Buscador Manual:** Ingresando su `OrderID` + `Teléfono`.
    * **Enlace Mágico:** A través de una URL única con un `token` seguro generada por el sistema y enviada por n8n.

---

## 🚦 Estados de la Orden (Order Statuses)

El ciclo de vida de una prenda en AME se controla mediante el siguiente `Enum` en la base de datos:

| Estado | Significado Técnico | Vista del Cliente |
| :--- | :--- | :--- |
| `PENDING` | Orden creada en BD. Esperando mensaje del cliente en WhatsApp. | 🟡 Pendiente de confirmación |
| `IN_PROCESS` | Pago validado / Prenda en confección o empaque. | 🔵 En proceso |
| `DELIVERED_STORE` | El cliente recogió el producto físicamente en el local. | 🟢 Entregado en tienda |
| `DELIVERED_DELIVERY` | El courier entregó el paquete en el domicilio. | 🟢 Entregado por delivery |
| `CANCELLED` | Venta no concretada, falta de stock o carrito abandonado. | 🔴 Cancelado |

---

## 🚀 Plan de Desarrollo (Fases)

### Fase 1: Cimientos (Base de Datos)
Preparación del esquema para soportar el flujo de órdenes y la seguridad del rastreo.
* **Tecnología:** Prisma ORM.
* **Tareas:**
    * Crear el modelo `Order` con los campos: `shortId` (ej. ORD-12345), `customerName`, `customerPhone`, `total`, `status`.
    * Agregar el campo `token` (String aleatorio) para validar el Enlace Mágico.
    * Crear el modelo `OrderItem` vinculado a la orden y a los productos del catálogo.

### Fase 2: Intercepción del Checkout
Captura de la intención de compra y generación de la orden antes de saltar a la aplicación de mensajería.
* **Tecnología:** Next.js (Server Actions).
* **Tareas:**
    * Crear un Server Action que reciba los datos del carrito y del cliente.
    * Guardar la orden en BD con estado `PENDING`.
    * Generar y devolver el `shortId` y el `token`.
    * Vaciar el estado del carrito en el frontend.
    * Redirigir a `wa.me` con el mensaje estructurado: *"Hola AME, quiero confirmar mi pedido #ORD-12345..."*.

### Fase 3: Vistas de Seguimiento (Frontend)
Interfaces de usuario para consultar el estado de las prendas.
* **Tecnología:** Next.js (Pages/Routing).
* **Tareas:**
    * **Vista 1 (Buscador):** Crear la ruta `/rastrear-pedido` con un formulario de validación doble (Orden + Celular).
    * **Vista 2 (Enlace Mágico):** Crear la ruta dinámica `/pedido/[id]` que valide automáticamente el `token` enviado por URL (`?token=abc-123`) para mostrar el detalle sin fricción.

### Fase 4: La Puerta de Enlace (API Webhook)
Ruta segura para que el sistema de automatización pueda actualizar el estado de los pedidos en tiempo real.
* **Tecnología:** Next.js (Route Handlers).
* **Tareas:**
    * Crear el endpoint `POST /api/webhooks/orders`.
    * Implementar validación de seguridad (API Key privada).
    * Lógica para recibir el `shortId` y el `newStatus`, y actualizar el registro en Prisma.

### Fase 5: El Cerebro Automatizado (n8n)
Orquestación del flujo de comunicación entre WhatsApp y la base de datos de la tienda web.
* **Tecnología:** n8n + API de WhatsApp (Evolution API / Cloud API).
* **Tareas:**
    * **Trigger:** Escuchar mensajes entrantes en el número de ventas.
    * **Filtro (Regex):** Identificar cadenas que coincidan con `#ORD-[A-Z0-9]+`.
    * **Acción 1 (Update):** Al confirmar o entregar un pedido, enviar un HTTP `POST` al Webhook de la Fase 4 para actualizar la web.
    * **Acción 2 (Notificación):** Enviar mensaje automático al cliente con su Enlace Mágico: *"Tu pedido avanza. Síguelo aquí: https://ame-store.com/pedido/ORD-12345?token=abc-123"*.

### Token meta:
EAAXr73hKrXcBQ3sQOp37ndwml4FmPeU4H30RB9f6p9h1ZCrrwtWfO9cLZAZAO9ekAJ32LaXZAZCkeeWPuPxnQ8t3ZC9QLRznUxwZAzENSiKYQOjzw7EN6Rv03OPcZA2mOZCaKo9foxba1w5pNId77b8IteHonLF6LvfDzRzPXgwGkXo2cFt1JYUZCKrNQAM41N34mtFvFzYa6Pa8BkxZAMOs6H4XevFxkqdnsKVjEIXIDe6HtqT5YOYxGD4T3ZCSrz86sUzPelrYADZBTUaHTlNYW7ayQ0OJb
### Identificador de número de teléfono: 
1004630199405725
### Identificador de la cuenta de WhatsApp Business:
1553824412360512
