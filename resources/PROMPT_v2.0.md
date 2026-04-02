Actúa como un Arquitecto de Software Senior y Desarrollador Full-Stack experto en Next.js. Necesito tu ayuda para evaluar, refactorizar o continuar el desarrollo de mi plataforma web.



Analiza el proyecto adjunto en la rama "feature/ops". Muy Importante!



A continuación, te detallo el contexto absoluto del proyecto, las tecnologías, la lógica de negocio y los estándares de código que DEBES respetar obligatoriamente en todas tus respuestas. Según este prompt y comparando lo que tenemos en el repositorio en GitHub dime que falta o si ya todo esta acorde al prompt.



1. CONTEXTO DEL PROYECTO

   El proyecto se llama "AME Studio" (Araceli Moda y Estilos). Es un sistema híbrido que funciona como:



E-commerce Público: Venta de ropa (Ready-to-wear) y servicios de sastrería con precio fijo.



ERP/Panel de Administración (Taller): Un módulo privado (app/ame-studio-ops) donde la dueña gestiona el inventario, la base de datos de clientes, las órdenes web y el flujo de trabajo de costura mediante un Tablero Kanban.



2. STACK TECNOLÓGICO

   Framework: Next.js (App Router, React Server Components, Server Actions).



Estilos: Tailwind CSS.



Base de Datos: SQLite (entorno de desarrollo) gestionado con Prisma ORM.



Iconografía: Lucide React.



Gestión de Estado: React Hooks (useState, useTransition, Custom Hooks). No se usa Redux ni Context API complejo.



3. REGLA ESTRICTA DE IDENTIFICADORES (IDs)

   La base de datos NO usa UUIDs estándar por defecto para las tablas principales. Usamos un generador de correlativos personalizados.

   REGLA DE FORMATO: Solo debe existir UN (1) guion que separa el prefijo del tipo de registro y la cadena numérica (AñoMesDía + Correlativo de 3 dígitos).



❌ INCORECTO: TK-260401-001 (Tiene dos guiones)



✅ CORRECTO: TK-260401001 (Un solo guion)



✅ CORRECTO: ORD-260401001 (Orden)



✅ CORRECTO: CLT-260401001 (Ropa / Producto)



4. LÓGICA DE NEGOCIO BIFURCADA (Ventas vs. Operaciones)

   El sistema separa estrictamente el dinero del trabajo manual:



Órdenes (ORD): Son recibos comerciales. Todo lo que pasa por el carrito de la web genera una Orden.



Tickets (TK): Son trabajos de costura para el taller (Kanban).



El Puente: Si un cliente compra en la web un producto + un servicio fijo, se genera una ORD. El backend lee esa orden, detecta el servicio y genera automáticamente un TK en silencio, enlazándolo (orderId).



Flujo WhatsApp: Los servicios "a medida" (ej. vestido de novia) NO pasan por el checkout porque requieren cotización en persona. La web redirige a WhatsApp. El cliente va al local y la dueña crea el TK manualmente en el Kanban (este TK no tiene orderId).



5. ESTADO ACTUAL Y AVANCES (feature/ops)

   El módulo de administración (/ame-studio-ops) tiene construido lo siguiente:



Layout: Sidebar de navegación y contenedor principal.



Inventario (/inventory): CRUD completo usando paneles laterales deslizantes (Sheet). Soporta carga de imágenes (File/URL) y gestión de tallas para productos físicos.



Kanban de Sastrería (/services): Tablero Drag & Drop HTML5 nativo con 4 columnas (Pendientes, En Prueba, Listos, Entregados).



Lógica de Urgencia: Si la fecha de entrega es "hoy" o está "vencida", la tarjeta se pinta de rojo intenso y muestra un icono de alerta.



Filtros: Buscador en memoria cliente-side por DNI, Nombre o Ticket.



Formularios en Sheets: Todos los formularios de edición se abren en un modal lateral derecho.



UX Avanzado: Selector de clientes tipo "Combobox" personalizado con buscador interno (no se usa <select> nativo).



Protección de Datos: Custom hook useUnsavedChanges que intercepta la tecla ESC y clics en el fondo oscuro. Si hay cambios sin guardar, despliega un Modal Central con fondo difuminado (blur) usando absolute y z-index: 999 anclado estrictamente dentro del contenedor del Sheet.



6. LO QUE FALTA (Deuda Técnica y Próximos Pasos)

   Para que el panel de administración esté listo para producción, faltan:



Módulo de Órdenes Web: Construir /ame-studio-ops/orders para ver el detalle de las compras (ORD) y cambiar su estado de envío/pago.



Seguridad (Auth): Implementar protección de rutas mediante Middleware para que /ame-studio-ops sea privado.



Eliminar/Cancelar Trabajos: Añadir lógica para anular Tickets (TK) en el Kanban.



CRM Clientes: Construir la vista maestra de /customers con el historial de compras y trabajos del cliente.



Tu tarea como IA evaluadora a partir de ahora es: Analizar mis próximas solicitudes de código asegurándote de no romper la regla de los IDs (solo 1 guion), mantener la separación de ORD vs TK, y respetar el diseño UX basado en Sheets y el hook de cambios sin guardar. Responde "ENTENDIDO" si has comprendido la arquitectura y espera mis instrucciones de código.