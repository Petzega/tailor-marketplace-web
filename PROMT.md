Actúa como un Arquitecto de Software Senior experto en Next.js 15, React y diseño de interfaces (UI/UX). Necesito tu ayuda para completar un proyecto que ya está en una fase avanzada de desarrollo.

1. CONTEXTO DEL NEGOCIO
   El proyecto se llama "Stitch & Style", un Tailor Marketplace (Marketplace de Sastrería). Ofrece tanto Productos Físicos (ej. ropa ready-to-wear, hilos) como Servicios (ej. basta, entallado).
   Modelo de Venta (WhatsApp Commerce): El sistema NO tiene pasarela de pagos tradicional. Los usuarios agregan productos/servicios a un carrito de compras y el "Checkout" consiste en generar un mensaje de texto formateado con el resumen del pedido que redirige automáticamente al WhatsApp del negocio para cerrar la venta manualmente.

2. STACK TECNOLÓGICO

Framework: Next.js 15 (App Router). Uso intensivo de Server Components y Server Actions.

Estilos y UI: Tailwind CSS, Lucide React (íconos). Uso de componentes personalizados tipo "Sheet" (paneles laterales deslizables) y modales.

Base de Datos: Prisma ORM (actualmente con SQLite en entorno local).

Estado Global: Zustand (con middleware persist en localStorage para el carrito).

3. LO QUE YA ESTÁ CONSTRUIDO (Avance Actual)

Panel de Administración (/admin): CRUD completo de inventario. Tiene búsqueda local, filtros, y usa "Sheets" laterales para Crear/Editar. Todas las acciones (Crear, Editar, Eliminar) tienen modales de confirmación personalizados. Se usa un Notificador Global (ActionToast) que lee parámetros de la URL (?action=created) para mostrar mensajes de éxito.

Buscador Global Inteligente (CommandSearch): Un buscador tipo Spotlight (accesible con Cmd+K o ícono en el Navbar) con debounce de 300ms. Separa visualmente los resultados entre Productos y Servicios. Permite navegación por teclado.

Página de Detalle de Producto (/product/[id]): Vista Server-Side que muestra información dinámica. El diseño y el botón de acción principal cambian dependiendo de si el ítem es un "Servicio" ("Book This Service") o un "Producto Físico" ("Add to Cart", validando el stock).

Carrito de Compras (Zustand): Un panel lateral (CartSheet) accesible desde toda la app. Permite modificar cantidades, eliminar ítems, calcula el total en tiempo real y contiene el botón final que codifica el pedido y redirige a la API de WhatsApp (wa.me).

4. LO QUE FALTA PARA TERMINAR EL PROYECTO (Siguientes Pasos)
   Faltan las siguientes funcionalidades para tener el proyecto 100% listo para producción:

Seguridad y Autenticación: Proteger la ruta /admin mediante un Middleware para que solo un usuario autenticado (el dueño) pueda gestionar el inventario.

Página de Inicio (Landing Page /): Diseñar el app/page.tsx con un Hero Section atractivo, categorías destacadas y un grid con los últimos productos/servicios añadidos.

Página de Catálogo/Búsqueda Avanzada (/search): Crear la página que recibe el parámetro ?q= del buscador y muestra una cuadrícula completa de resultados con filtros (rango de precio, categoría, disponibilidad).

Migración a Producción: Cambiar la base de datos local de SQLite a PostgreSQL (ej. Vercel Postgres) y hacer el despliegue final.

5. INSTRUCCIONES PARA TI
   Entiende esta arquitectura y confirma que la has asimilado. Luego, pregúntame por cuál de los 4 puntos pendientes prefiero empezar y dame el código paso a paso asegurándote de mantener la coherencia visual (Tailwind) y estructural (Server Actions) que ya tiene el proyecto.