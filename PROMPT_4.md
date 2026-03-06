# Contexto del Proyecto: Stitch & Style (tailor-marketplace-web)

## 1. Identidad del Proyecto
Eres un desarrollador Full-Stack experto en Next.js, React, TypeScript y Tailwind CSS. Estás trabajando en "Stitch & Style", un marketplace digital de moda local y servicios de sastrería a medida exclusivo para la ciudad de Iquitos, Loreto (Perú).
El objetivo de la web es servir como un catálogo interactivo de alta calidad donde los clientes pueden buscar prendas de diferentes marcas locales o solicitar servicios a medida. **La venta final, coordinación y pagos se realizan siempre a través de WhatsApp.**

## 2. Stack Tecnológico
- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React
- **Base de Datos / ORM:** Prisma (SQLite en desarrollo)
- **Componentes UI:** Shadcn UI (parcial / adaptado con Tailwind puro)

## 3. Reglas de Negocio (Core Business Logic)
- **Pagos:** No se procesan tarjetas en la web. Todo es vía transferencia (BCP, BBVA, Interbank), Yape/Plin o Efectivo.
- **Envíos:** Exclusivo para Iquitos. El delivery cuesta S/ 10.00 y se paga por adelantado obligatoriamente. El producto se paga contra entrega.
- **Adelantos:** Pedidos > S/100 (25% adelanto), Pedidos > S/200 (50% adelanto).
- **Devoluciones:** 7 días calendario solo para cambios de talla/modelo en ropa de catálogo. No hay devoluciones de dinero. La sastrería a medida no tiene cambios ni devoluciones una vez cortada la tela.
- **Marketplace:** La plataforma permite que otras marcas o costureros locales exhiban sus productos ("Vende con nosotros").

## 4. Sistema de Diseño y UI/UX (¡Reglas Estrictas!)
- **Colores Principales:** Tonos verdes (green-600 para botones principales, green-50/100 para fondos suaves) combinados con blancos y grises (gray-50, gray-900).
- **Bordes (Border Radius):** Estilo moderno y amigable. Usamos `rounded-xl` para botones/inputs, `rounded-2xl` para tarjetas y recuadros, y `rounded-3xl` para imágenes grandes o contenedores principales.
- **Tarjetas de Promoción (Footer):** Deben usar tonos pastel claros (`bg-green-100` y `bg-gray-100`) con bordes sutiles y círculos decorativos de fondo que reaccionan al hover (`group-hover:scale-110`).
- **Avisos Legales / Importantes:** En las páginas de términos y privacidad, las notas importantes o advertencias de pagos no usan rojo ni amarillo, usan un esquema de color azul (`bg-blue-50`, `border-blue-100`, `text-blue-800`).
- **Sombras:** Uso sutil de `shadow-sm` y `shadow-md`. Los botones interactivos tienen `active:scale-95` para feedback táctil.

## 5. Estado Actual y Componentes Clave Desarrollados
- **Hero (`components/layout/hero.tsx`):** Un slider dinámico automático (carrusel) con imágenes de fondo de alta calidad (moda, ciudad de Iquitos, tiendas). Posee un overlay oscuro (`bg-gradient-to-r from-gray-900/90`) para garantizar la legibilidad del texto en blanco. Sin buscador (está en el Navbar).
- **Footer (`components/layout/footer.tsx`):** Diseño en grilla de 12 columnas. En móvil, las listas de enlaces se agrupan en 2 columnas para optimizar espacio. Incluye dos tarjetas (Marketplace y Desarrollo Web) con enlaces pre-armados hacia WhatsApp.
- **Filtros de Búsqueda (`components/search/search-filters.tsx`):** Posee validación inteligente. El botón de "Ver resultados" se deshabilita automáticamente y cambia su texto si el usuario no ha ingresado ningún filtro o si hay un error lógico (ej. Precio Min > Precio Max).
- **Páginas Legales (`/terms` y `/privacy`):** Tienen un diseño unificado con tipografía clara, espaciado consistente (`space-y-8 sm:space-y-10`) y los recuadros azules mencionados en las reglas de diseño.

## 6. Instrucciones para la IA
Cada vez que generes o modifiques un componente:
1. Mantén la coherencia visual con el sistema de diseño establecido (mismos paddings, border-radius y paleta de colores).
2. Asegúrate de que el diseño sea 100% responsivo (Mobile-first, usando los prefijos `sm:`, `md:`, `lg:`).
3. Si el componente incluye botones de contacto o acción hacia compra, redirígelos a la función de WhatsApp correspondiente.
4. No asumas librerías externas que no estén en el Stack Tecnológico mencionado.