Contexto del Negocio: "Stitch & Style"
Actúa como un Desarrollador Full-Stack y Tech Lead. Estamos construyendo un e-commerce MVP (Producto Mínimo Viable) para una marca llamada "Stitch & Style", ubicada en Iquitos, Perú. El negocio tiene un modelo híbrido: venden ropa lista para usar (Ready-made) y ofrecen servicios de sastrería a medida (Alteraciones, Reparaciones, Confección Custom).
El modelo de ventas es "High-Touch": no usamos pasarelas de pago complejas (Stripe/Paypal) todavía. En su lugar, el carrito de compras recopila los productos y genera un mensaje estructurado que redirige al cliente a WhatsApp para cerrar la venta mediante transferencias locales (Yape, Plin, BCP).

Stack Tecnológico Actual:

Framework: Next.js (App Router) con React.

Lenguaje: TypeScript.

Estilos: Tailwind CSS + Lucide React (iconos).

Base de Datos (ORM): Prisma.

Motor de Base de Datos: SQLite (Local).

¿Por qué SQLite? Se eligió temporalmente para el entorno de desarrollo local porque permite iterar rapidísimo sin configurar servidores Docker o bases de datos en la nube. Al usar Prisma, la migración futura a PostgreSQL o MySQL para producción será transparente y requerirá cambiar solo una línea de código.

Control de Versiones: Git (Actualmente con una rama master estable y trabajando en la rama feature/categorias).

Progreso Actual (Lo que ya está construido y funciona):

Frontend Público Completo: Landing page responsiva con un Hero section, carrusel de productos destacados, y accesos directos a servicios de sastrería.

Catálogo y Búsqueda: Página de búsqueda (/search) con interfaz de filtros laterales (desktop) y modales (mobile), barra de búsqueda, y esqueletos de carga (Skeleton loading) para una UX premium.

Detalle de Producto: Vista individual del producto con selector de cantidad y botón para agregar al carrito.

Carrito de Compras (Cart Sheet): Un panel lateral (Sheet) que muestra los productos, calcula el total, y tiene un botón de "Comprar por WhatsApp". Este botón formatea un texto con el detalle del pedido y abre la API de WhatsApp. Además, incluye insignias visuales de los métodos de pago aceptados (Yape, Plin, BCP).

Git: El código base del frontend está totalmente consolidado y limpio en la rama master.

Lo que estamos a punto de hacer (El paso actual):
Estamos en la rama feature/categorias listos para modificar el archivo prisma/schema.prisma. El objetivo es enriquecer el modelo Product añadiendo clasificaciones más granulares mediante Enums para mejorar los filtros:

Gender: Hombre, Mujer, Niño, Niña, Unisex.

ClothingType: Camisa, Pantalón, Short, Lencería, Ropa interior, Polo, Accesorios, Vestidos.

Hoja de Ruta: Lo que falta por implementar:

Actualizar Base de Datos: Modificar el schema.prisma, correr las migraciones (npx prisma migrate dev) y actualizar el script de seed con datos de prueba que usen estas nuevas categorías.

Conectar Filtros del Frontend: Actualizar la UI de /search para que los menús desplegables lean y filtren usando las nuevas categorías de la base de datos (Server Actions).

Panel de Administración (Admin Dashboard): Construir las vistas en la ruta /admin para hacer un CRUD completo de productos (Crear, Leer, Actualizar, Eliminar).

Integración de Imágenes: Conectar el formulario de creación de productos del Admin con Cloudinary (usando Upload Presets sin firmar) para alojar las imágenes en la nube en lugar de localmente.

Despliegue (Deploy): Migrar la base de datos a un entorno de producción (ej. PostgreSQL en Vercel, Supabase o Neon) y desplegar la aplicación final en Vercel.

Instrucciones para ti (IA):
Sabiendo todo esto, necesito que me des el código exacto y actualizado para modificar mi archivo prisma/schema.prisma incorporando los Enums de Gender y ClothingType dentro del modelo de Producto, asegurando que se mantengan las relaciones existentes.