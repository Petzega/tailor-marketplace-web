# 🚀 Roadmap: Integración de WhatsApp Cloud API (Oficial)

Este documento detalla el plan de acción paso a paso para implementar notificaciones automatizadas de WhatsApp en el Marketplace, migrando de soluciones no oficiales (web scraping/Baileys) a la **API Oficial de Meta**.

## 🏗️ Arquitectura
* **Frontend:** Alojado en CDN (Vercel / Cloudflare Pages) para carga rápida.
* **Backend & Base de Datos:** VPS en Hetzner (PostgreSQL + Backend API).
* **Mensajería:** Instancia ligera de n8n (Docker) conectada vía Webhook al Backend y vía API Oficial a Meta.

---

## 🗺️ Fases de Implementación

### Fase 1: El Terreno de Meta (Configuración Inicial)
*Objetivo: Obtener las credenciales oficiales de desarrollo para enviar mensajes.*

- [ ] **Crear cuenta de Desarrollador:** Ingresar a [Facebook Developers](https://developers.facebook.com/) y crear una nueva "Business App".
- [ ] **Activar WhatsApp:** Agregar el producto "WhatsApp" a la aplicación creada.
- [ ] **Registrar números de prueba:** Configurar el número personal como destinatario autorizado para recibir los mensajes del número virtual de prueba provisto por Meta.
- [ ] **Extraer Credenciales:** Guardar de forma segura en variables de entorno:
    - `WA_TEMPORARY_TOKEN` (Token temporal de 24h).
    - `WA_PHONE_NUMBER_ID` (Identificador del número que envía).
    - `WA_BUSINESS_ACCOUNT_ID`.

### Fase 2: El Puente Local (n8n en entorno de desarrollo)
*Objetivo: Limpiar el entorno Docker y lograr el primer envío "Hola Mundo" desde n8n.*

- [ ] **Limpieza de Docker:** Editar `docker-compose.yml` para eliminar `evolution-api` y `redis`. Mantener únicamente `postgres`, `n8n` y el contenedor del backend.
- [ ] **Crear el Flujo en n8n:** Configurar un flujo de dos nodos:
    1. `Webhook` (Método POST, capturar URL de prueba).
    2. `WhatsApp` (Nodo nativo oficial).
- [ ] **Configurar Credenciales en n8n:** Añadir el Token temporal y el Phone Number ID en el nodo de WhatsApp.
- [ ] **Prueba Unitaria:** Disparar el flujo manualmente en n8n para verificar la recepción del mensaje en el celular.

### Fase 3: Integración con el Backend (`tailor-marketplace-web`)
*Objetivo: Disparar la notificación automáticamente mediante código al crear una orden.*

- [ ] **Capturar el evento de compra:** Ubicar el servicio/controlador donde la orden cambia a estado `PENDIENTE` y se guarda en la base de datos.
- [ ] **Inyectar el Webhook:** Escribir la petición HTTP que enviará los datos a n8n.
  ```javascript
  // Ejemplo de implementación en el backend
  fetch("http://n8n:5678/webhook-test/nueva-orden", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orden: nuevaOrden.id,
      telefono_seller: "51999888777",
      total: nuevaOrden.total
    })
  });