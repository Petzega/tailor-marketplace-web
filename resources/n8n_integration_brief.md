# 📝 Briefing de Proyecto Técnico para Equipo N8N

> Copia y comparte este documento textualmente con el equipo de integraciones, bots de IA (ChatGPT/Claude) de automatización o Devops a cargo de la puesta en marcha de n8n.

---

## 1. Estado Actual del Arte y Flujo de Negocio (Tailor Marketplace)

**El proyecto se encuentra en Fase Gold (Release Candidate) al 100% de desarrollo para su pase a producción**. El núcleo del negocio opera como un E-Commerce con cotización fluida (Sin fricción de inicio de sesión de usuarios). 

**Flujo Operativo (Checkout-to-Delivery):**
1. El usuario arma su carrito en el Frontend público y oprime "Finalizar".
2. Nuestro servidor valida la data, calcula los precios finales internamente y registra la orden atómicamente en Base de Datos como estado inicial `PENDING`. 
3. A la orden se le asigna de forma nativa un identificador personalizado (Ej. `ORD-260407001`) y un candado generacional aleatorio llamado `validationCode` de 6 caracteres (vital para seguimiento y Anti-IDOR).
4. El cliente es redirigido con su cotización hacia un Whatsapp asociado a la compañía para coordinar pagos y lógicas de envío fuera del aplicativo web.
5. *(Frontera N8N)*: Allí empieza el dominio de la automatización externa.

Las interfaces administrativas de la empresa (Logística de Sastrería en un Kanban Board y Analíticas Monetarias) funcionan con un acceso altamente restringido en `/ame-studio-ops` que depende del status maestro de la orden. 

## 2. Tecnologías y Stack Implementado

Hemos modelado la arquitectura con las herramientas más modernas del ecosistema Typescript (MERN evolucionado):
*   **Framework Fullstack:** Next.js 15 (App Router, SSR, Server Actions puros usando React 19).
*   **Base de Datos / ORM:** SQLite gestionado íntegramente por Prisma, con relaciones en cascada tipo M:N y 1:M.
*   **Autenticación y Seguridad (Admin):** Clerk (Middleware en Edge Networking, Session claims y Hard-codding de lista blanca de Servidor).
*   **Validación Estructural:** Zod, utilizado estrictamente a nivel de Red (Runtime payload validation) en cada uno de los inputs del API antes de inyectarse al ORM.
*   **Gestión de Assets (Imágenes):** Cloudinary conectado en Node Server-side, sin intermediación del cliente para evadir exposición de tokens en JSON.
*   **Gestión de UI:** TailwindCSS, Shadcn, y `useOptimistic` Hook para transiciones de UI manuales.

## 3. Mejoras Realizadas y Mejores Prácticas (Blindaje de Grado Empresarial)

El equipo de Core ha desplegado parches y fortificaciones para asegurar las operaciones:
-   **Defensas contra Ataques DoS / Memoria Colapsada:** Filtros de bloque para arreglos Zod `.max(50)`, paginaciones estrictas en la consulta de Kanban (ocultando basura histórica) y selectores fraccionarios en Prisma (`select: { }`) que evitan congelaciones del hilo principal de JavaScript al realizar cálculos en gráficas estadisticas inmensas.
-   **Seguridad de Acceso (Zero Trust):** Los endpoints no asumen permisos de nadie; el cliente web está desacoplado de las reglas de negocio. En cada _Server Action_ privado se invoca internamente `auth()` de Clerk  y verificaciones de email para garantizar que las peticiones a la DB solo corran si son administradores reales, matando intentos de uso por bots automatizados.
-   **Tolerancia a Fallos Transaccional (ACID):** Cualquier modificación severa (ej. guardar un nuevo producto y su historial de auditoría) se envía envuelto por `db.$transaction`. Si un paso de subida aborta, toda la historia retrocede y la BD queda inmaculada sin data huérfana parcial.
-   **Comodidad N8N mediante API Mapping:** Las bases de datos nativas esperan estados limpios (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`). Para no limitar las capacidades de diseño de N8n, se construyó un "mapeador" de estados que asimilará variables granulares (`DELIVERED_STORE`, `IN_PROCESS`) y las asimilará tras bastidores al sistema nativo.

## 4. ¿Qué necesitan ustedes (Equipo n8n) para integrarse exitosamente?

El sistema Web ha expuesto 2 conductos estrictos para que su infraestructura se enlace con los datos de The Tailor Marketplace.

### Requisito A: Configurar sus Credenciales (Bearer Tokens)
Para que el flujo funcione, los Servidores de n8n deben apuntalar peticiones cURL (HTTP Request Node) portando una variable en las cabeceras: `Authorization: Bearer <SECRETO_HEXADECIMAL>`. Ustedes y el equipo de Backend de Next.js deben pasarse la misma variable y ponerla como Variables de Entorno (`N8N_API_KEY` y `WEBHOOK_SECRET`). 

### Requisito B: Reportar Estados (El Webhook)
Cuando el asesor de Tailor dé la conformidad del "pago por Whatsapp", el flujo de ustedes en n8n debe impactar nuestro servidor para arrancar la maquinaria de logística y que la Venta se compute en el Dashboard financiero. 

**Endpoint:** `POST https://[DOMINIO]/api/webhooks/orders`
**Header:** `Authorization: Bearer <TÚ_WEBHOOK_SECRET>`
**Payload a enviar:**
```json
{
  "orderId": "ORD-260407001",
  "newStatus": "DELIVERED_STORE" // Pueden usar: PENDING, IN_PROCESS, DELIVERED_STORE, DELIVERED_DELIVERY, o CANCELLED
}
```
_Nota: Tras enviarlo exitosamente, el servidor les responderá 200 OK y la venta figurará ingresada al sistema E-Commerce._

### Requisito C: Proveer la URL de Seguimiento Seguro (Tracking) al Cliente
Dado que no existe login de usuarios en el E-Commerce (para facilitar hiperventas), el proyecto se protege del espionaje limitando sus pantallas al uso de un "Token Generacional Único" (`validationCode`). Si N8n envía actualizaciones por automatización al Whatsapp del comprador (ej. *"Su pedido está en curso"*), **deberán** enviar el link compuesto adecuadamente para que el usuario logre visualizarlo en pantalla.
Estructura final del enlace requerida a mandar por Whatsapp:
```text
https://[DOMINIO]/order/[orderId]?token=[validationCode]
```
