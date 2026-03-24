# AME (Araceli Moda y Estilos) - E-commerce Platform

## 📖 Contexto del Proyecto
AME (anteriormente Stitch & Style) es una plataforma web moderna de comercio electrónico diseñada para la venta de prendas de vestir y servicios de confección. El sistema permite a los usuarios explorar un catálogo de productos, gestionar un carrito de compras y finalizar sus pedidos de manera ágil mediante una integración directa con WhatsApp. Adicionalmente, cuenta con un CMS (Content Management System) propio para la administración del inventario y catálogo.

## 🛠️ Stack Tecnológico
* **Framework Core:** Next.js (App Router)
* **Frontend y UI:** React, Tailwind CSS, Lucide React (iconografía)
* **Base de Datos:** SQLite (entorno de desarrollo local)
* **ORM:** Prisma
* **Integraciones:** Redirección de Checkout a WhatsApp API (Frontend)

## ✅ Avances hasta la Fecha (Estado Actual)

**1. Arquitectura y Base de Datos:**
* Esquema de Prisma configurado con modelos relacionales (`Product`, `ProductImage`).
* Implementación de la tabla `ProductSize` para el control de inventario granular e individualizado por tallas (S, M, L, etc.).

**2. Tienda Pública (Frontend):**
* **Catálogo Completo:** Página principal con Hero section y carruseles automáticos.
* **Búsqueda Avanzada:** Vista `/search` equipada con filtros dinámicos (categoría, edad, etc.), versión móvil de filtros y barra de comandos.
* **Detalle de Producto:** Vista `/product/[id]` con galería de imágenes y selección de atributos (tallas, cantidades).
* **Carrito de Compras:** Gestor de estado global con panel lateral interactivo (`cart-sheet.tsx`).
* **Flujo de Checkout:** Formulario dinámico (`/checkout`) que recopila datos del cliente, método de entrega (Tienda/Delivery) y métodos de pago (Yape, Plin, Transferencias). Culmina generando un ticket formateado y redirigiendo a WhatsApp.
* **Legal:** Páginas de Términos y Condiciones, y Políticas de Privacidad implementadas.

**3. Panel de Administración (`/admin`):**
* CMS interno protegido por rutas (actualmente en desarrollo de auth).
* CRUD completo (Crear, Leer, Actualizar, Borrar) para productos del catálogo.
* Interfaz con paginación, filtros de búsqueda en tabla y notificaciones visuales (toasts) tras cada acción.

---

## 🚀 Qué falta por implementar (Próximos Pasos)

**1. Gestión Integral de Órdenes (Rama `feature/order`) [Prioridad Alta]:**
* Crear modelos `Order` y `OrderItem` en la base de datos para tener un registro histórico de ventas.
* Crear un *Server Action* en el checkout para guardar la orden en la BD y obtener un ID único (ej. `#ORD-001`) *antes* de abrir WhatsApp.
* Integrar la lógica para descontar automáticamente el stock (en `ProductSize` y `Product`) al momento de generar el pedido.
* Desarrollar la vista `/admin/orders` para que el administrador pueda cambiar estados (Pendiente, Pagado, Enviado).

**2. Autenticación y Seguridad:**
* Implementar NextAuth.js o Supabase Auth para proteger definitivamente el panel `/admin` mediante credenciales de administrador, evitando accesos públicos no autorizados.

**3. Preparación para Producción (Despliegue):**
* **Migración de Base de Datos:** Cambiar la base de datos de desarrollo (SQLite local) a un motor en la nube (PostgreSQL o MySQL) apto para despliegues *serverless* (ej. Vercel).
* **Alojamiento de Imágenes (Storage):** Integrar un servicio como Cloudinary, AWS S3 o Vercel Blob para la subida de imágenes de productos desde el panel admin, reemplazando el almacenamiento local.

**4. Aseguramiento de Calidad (QA):**
* Implementar automatización de pruebas End-to-End (E2E) con Playwright para blindar los flujos críticos de la aplicación (añadir al carrito, validación de checkout, etc.).