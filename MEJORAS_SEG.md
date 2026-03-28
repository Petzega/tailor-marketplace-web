# ⚙️ Documentación Técnica: Integración de Órdenes y n8n

Este documento detalla la arquitectura, reglas de negocio y contratos de la API desarrollados para el sistema de checkout y su integración con el agente de IA en WhatsApp (n8n).

## 1. Mejoras Arquitectónicas Implementadas

### A. Generación Segura de IDs de Orden
- **Formato Legible:** Se reemplazó el uso de CUIDs de Prisma por un formato secuencial diario (`ORD-YYMMDDXXX`). Ejemplo: `ORD-260327001`.
- **Patrón de Reintento (Retry Pattern):** Se implementó un bucle de seguridad (máximo 3 reintentos) en la creación de la orden para manejar condiciones de carrera (alta concurrencia) si dos usuarios intentan comprar en el mismo milisegundo.

### B. Desacoplamiento de Identificadores (SKU vs. ID)
- Se eliminó la dependencia de los IDs internos de la base de datos para las mutaciones externas.
- El endpoint de actualización de carrito ahora exige estrictamente el uso del **SKU** (Stock Keeping Unit) del producto, facilitando la interacción del lenguaje natural procesado por n8n.

### C. Detección de Intención de Búsqueda
- El endpoint de búsqueda de productos implementa un **Regex estricto** (`/^[A-Za-z]{3}-\d+/`) para diferenciar la intención del usuario.
- **Flujo A (Búsqueda por Nombre):** Devuelve hasta 5 coincidencias parciales.
- **Flujo B (Búsqueda por SKU):** Exige coincidencia exacta. Si el bot envía un SKU incompleto, la API rechaza la petición (HTTP 400) para evitar que el bot altere la orden con el producto equivocado.

### D. Protección de Casos Extremos (Edge Cases)
- **Vaciado de Carrito:** Al ejecutar una acción `REMOVE` desde n8n, si la cantidad de productos en la orden llega a cero, el sistema previene que quede una orden vacía cobrando solo el envío. (Requiere forzar la cancelación de la orden o bloquear la eliminación del último ítem).

---

## 2. Contratos de API para n8n

**Autenticación Base:** Todas las rutas requieren el header:
`Authorization: Bearer <N8N_API_KEY>`

### 2.1. Búsqueda de Productos en Catálogo
Permite al agente mapear la intención del usuario con el catálogo real.
* **Método:** `GET`
* **Ruta:** `/api/n8n/products/search?q={query}`
* **Lógica:** Si `q` tiene formato de SKU, exige coincidencia total. Si no, busca por aproximación de nombre.

### 2.2. Lectura Inicial de la Orden (Handoff)
Permite al agente obtener el contexto cuando el usuario inicia la conversación desde la web.
* **Método:** `GET`
* **Ruta:** `/api/n8n/orders/{id}`
* **Nota de extracción n8n:** El agente debe usar Regex (`/ORD-\d{9}/`) para extraer el ID del primer mensaje de WhatsApp. No requiere código validador.

### 2.3. Validación de Identidad (Seguridad)
Permite verificar la identidad del usuario cuando realiza consultas asíncronas sobre su pedido.
* **Método:** `POST`
* **Ruta:** `/api/n8n/orders/validate`
* **Body:**
  ```json
  {
    "documentNumber": "74125896",
    "validationCode": "A1B2C3"
  }
  ```
### 2.4. Modificación de Carrito
Agrega o elimina productos y recalcula automáticamente subtotales y envíos en la base de datos.
* **Método:** `PATCH`
* **Ruta:** `/api/n8n/orders/{id}/items`
* **Body:**
  ```json
  {
  "action": "ADD", 
  "sku": "CLT-260305009",
  "quantity": 1,
  "size": "M" 
  }
  ```
* **Nota:** `action` solo admite "ADD" o "REMOVE"

### 2.5. Actualización de Estado Operativo
Cambia el estado de la orden (ej. tras confirmar el pago en WhatsApp).
* **Método:** `PATCH`
* **Ruta:** `/api/n8n/orders/{id}/status`
* **Body:**
  ```json
  {
  "status": "IN_PROGRESS"
  }
  ```
* **Nota:** Estados permitidos: `PENDING`, `IN_PROGRESS`, `CANCELLED`, `COMPLETED`.

### Próximos pasos
Con los 3 problemas estructurales mencionados en mi mensaje anterior resueltos (la corrección de params asíncronos en las 3 rutas, el regex estricto del SKU y la lógica para cuando un carrito se queda vacío tras un `REMOVE`), el backend está técnicamente cerrado.

Si ya aplicaste esos cambios finales, indícame si procedemos a iniciar la **Fase 5: Panel de Administración de Órdenes**.