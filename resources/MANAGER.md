# 🗺️ Roadmap: Desarrollo del Panel de Administración (AME Studio Ops)

Este documento define las fases de construcción de la interfaz interna de gestión para el marketplace.

## Fase 1: Gestión de Órdenes (Prioridad Crítica)
*El corazón operativo del e-commerce. Sin esto, no se pueden procesar las ventas.*

- [ ] **1.1. Tabla Maestra de Órdenes (`/ame-studio-ops/orders`)**
    - Crear la vista para listar todas las órdenes registradas en la tabla `Order`.
    - Implementar filtros por `status` (PENDING, IN_PROGRESS, COMPLETED, CANCELLED) y `paymentMethod`.
    - Mostrar datos clave: ID corto, Cliente, Total (S/), Estado y Fecha.
- [ ] **1.2. Vista de Detalle de la Orden (`/ame-studio-ops/orders/[id]`)**
    - Interfaz de lectura detallada (Customer Info, Delivery Info, Payment Info).
    - Listado de `OrderItem` con sus precios históricos y tallas.
    - Exposición del `validationCode` para el cruce de información con el bot de n8n.
- [ ] **1.3. Mutaciones de Estado (Server Actions)**
    - Implementar botones para cambiar el estado de la orden (Ej: "Marcar como En Preparación", "Completar").
    - Conectar los cambios de estado con webhooks hacia n8n para disparar mensajes de WhatsApp automáticos.

## Fase 2: Refactorización de Arquitectura Visual (Dashboard vs Inventory)
*Separación de responsabilidades de las vistas.*

- [ ] **2.1. Limpieza del Root Admin (`/ame-studio-ops/page.tsx`)**
    - Remover la tabla de inventario de esta vista.
    - Transformar en un Dashboard gerencial: Gráficos de ingresos, contador de órdenes de hoy, listado de "Últimas 5 órdenes", alertas de bajo stock.
- [ ] **2.2. Migración del Inventario (`/ame-studio-ops/inventory/page.tsx`)**
    - Trasladar el código de la tabla de productos actual a esta nueva ruta.
    - Asegurar que la paginación y filtros sigan funcionando correctamente.

## Fase 3: Gestión Avanzada de Productos
*Alineación de la UI con el esquema real de la base de datos Prisma.*

- [ ] **3.1. Gestión de Tallas (`ProductSize`)**
    - Actualizar los formularios de creación (`ProductSheet`) y edición (`EditProductSheet`) para permitir agregar múltiples tallas y asignar stock individual a cada una.
    - Modificar la tabla de inventario para que el stock refleje la suma de las tallas o un desglose rápido.
- [ ] **3.2. Gestión de Imágenes (`ProductImage`)**
    - Implementar subida y eliminación de múltiples imágenes por producto (actualmente la UI solo asume un `imageUrl` principal).

## Fase 4: Servicios y Clientes
*Módulos complementarios para la operación de sastrería.*

- [ ] **4.1. Panel de Servicios (`/ame-studio-ops/services`)**
    - Vista filtrada estrictamente para productos donde `category === 'SERVICE'`.
    - UI orientada a la edición de tarifas base y descripciones de arreglos/confección.
- [ ] **4.2. Directorio de Clientes (`/ame-studio-ops/customers`)**
    - Interfaz analítica que agrupe a los clientes basándose en el historial de la tabla `Order` (Lifetime Value, Número de compras, Datos de contacto).

## Fase 5: Consolidación Omnicanal (WhatsApp & n8n)
*Cierre de la automatización operativa.*

- [ ] **5.1. Status Webhooks**
    - Asegurar que cada Server Action de actualización de órden haga el trigger a los flujos de n8n mencionados en el `PLAN_BACKEND.md`.