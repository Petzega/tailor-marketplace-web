# Plan de Implementación - Tailor Marketplace Web

## 1. Resumen Ejecutivo

Este documento detalla el plan de mejoras y correcciones para el proyecto `tailor-marketplace-web`, basado en el análisis completo del codebase. El plan está organizado por prioridad y fase de implementación.

### Estado Actual del Proyecto
- **Stack**: Next.js 16, React 19, TypeScript, Prisma (SQLite), Clerk, Cloudinary, n8n
- **Funcionalidades implementadas**: Catálogo, checkout, panel admin (AME Studio Ops), integración WhatsApp/n8n, tracking de órdenes
- **Funcionalidades parcialmente implementadas**: Modificación de órdenes vía n8n, notificaciones al vendedor
- **Funcionalidades faltantes**: Cancelación de órdenes, descuento de stock, tests automatizados

---

## 2. Mapa de Problemas

| # | Problema | Severidad | Estado |
|---|----------|-----------|--------|
| 1 | `app/api/orders/route.ts` duplica `actions/orders.ts` | CRÍTICA | Pendiente |
| 2 | `Math.random()` para validationCode | ALTA | Pendiente |
| 3 | No se descuenta stock al crear orden | ALTA | Pendiente |
| 4 | Auth admin duplicada en 5 archivos | MEDIA | Pendiente |
| 5 | Sin transacciones en modificación de items | ALTA | Pendiente |
| 6 | Sin índices en campos de búsqueda | MEDIA | Pendiente |
| 7 | No existe cancelación de órdenes | MEDIA | Pendiente |
| 8 | No hay notificación de nueva orden al vendedor | BAJA | Pendiente |
| 9 | Cero tests automatizados | MEDIA | Pendiente |
| 10 | `.env.local` con secrets reales | CRÍTICA | Pendiente |
| 11 | Archivos de debug en repo | BAJA | Pendiente |
| 12 | SQLite en lugar de PostgreSQL | MEDIA | Pendiente |

---

## 3. Fase 1: Correcciones Críticas (Semana 1)

### 3.1 Eliminar API Route duplicada `app/api/orders/route.ts`

**Problema**: Existen dos endpoints para crear órdenes:
- `actions/orders.ts` → Server Action `createOrder()` (usado por el frontend)
- `app/api/orders/route.ts` → API Route POST (duplicado, inconsistente)

**Solución**:
1. Eliminar `app/api/orders/route.ts`
2. Asegurar que todo el frontend use el Server Action `createOrder()`
3. Si n8n necesita crear órdenes, usar el Server Action o crear un endpoint específico en `/api/n8n/orders`

**Archivos afectados**:
- `app/api/orders/route.ts` → ELIMINAR
- `app/api/orders/[document]/` → Verificar si está vacío, eliminar si no se usa

### 3.2 Reemplazar `Math.random()` por `crypto.randomBytes`

**Problema**: `Math.random()` no es criptográficamente seguro para generar validation codes.

**Solución**: Crear función utilitaria en `lib/utils.ts`:

```typescript
import { randomBytes } from 'crypto';

export function generateValidationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(6);
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}
```

**Archivos afectados**:
- `lib/utils.ts` → Agregar función
- `actions/orders.ts` → Usar función de `lib/utils.ts`
- `app/api/n8n/orders/[id]/items/route.ts` → Si aplica

### 3.3 Descontar stock al crear orden

**Problema**: `createOrder()` no descuenta el stock de `ProductSize` cuando se crea una orden. Esto causa overselling.

**Solución**: Agregar lógica de descuento de stock dentro de una transacción Prisma:

```typescript
// En actions/orders.ts, dentro de createOrder()
await db.$transaction(async (tx) => {
  // 1. Verificar stock disponible para cada item
  for (const item of data.items) {
    if (item.size) {
      const productSize = await tx.productSize.findUnique({
        where: { productId_size: { productId: item.id, size: item.size } }
      });
      if (!productSize || productSize.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${item.id} talla ${item.size}`);
      }
    } else {
      const product = await tx.product.findUnique({ where: { id: item.id } });
      if (!product || product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${item.id}`);
      }
    }
  }

  // 2. Crear la orden
  const order = await tx.order.create({ /* ... */ });

  // 3. Descontar stock
  for (const item of data.items) {
    if (item.size) {
      await tx.productSize.update({
        where: { productId_size: { productId: item.id, size: item.size } },
        data: { stock: { decrement: item.quantity } }
      });
    } else {
      await tx.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } }
      });
    }
  }

  return order;
});
```

**Archivos afectados**:
- `actions/orders.ts` → Modificar `createOrder()`
- `app/api/n8n/orders/[id]/items/route.ts` → Agregar verificación de stock al agregar items

### 3.4 Extraer `requireAdminAuth()` a módulo compartido

**Problema**: La función `requireAdminAuth()` está copiada en:
- `actions/orders.ts`
- `actions/products.ts`
- `actions/services.ts`
- `actions/customers.ts`
- `actions/analytics.ts`

**Solución**:
1. Crear `lib/auth.ts` con la función centralizada
2. Reemplazar todas las copias locales con imports

```typescript
// lib/auth.ts
import { auth, currentUser } from "@clerk/nextjs/server";

export async function requireAdminAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("Acceso denegado: No autenticado.");

  const user = await currentUser();
  if (!user) throw new Error("Acceso denegado: Usuario no encontrado.");

  const allowedEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  const isAuthorized = user.emailAddresses.some(
    (email) => allowedEmails.includes(email.emailAddress)
  );

  if (!isAuthorized) {
    throw new Error("Acceso denegado: Solo administradores.");
  }

  return user;
}
```

**Archivos afectados**:
- `lib/auth.ts` → CREAR
- `actions/orders.ts`, `actions/products.ts`, `actions/services.ts`, `actions/customers.ts`, `actions/analytics.ts` → Reemplazar función local por import

---

## 4. Fase 2: Funcionalidades Faltantes (Semana 2)

### 4.1 Cancelación de órdenes desde WhatsApp/n8n

**Problema**: No existe endpoint para cancelar órdenes.

**Solución**: Crear `app/api/n8n/orders/[id]/cancel/route.ts`:

```typescript
// app/api/n8n/orders/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación n8n
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const orderId = resolvedParams.id;
    const body = await request.json();
    const { reason = "Cancelado por cliente" } = body;

    // Verificar que la orden exista y esté en estado cancelable
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }
    if (!["PENDING", "IN_PROGRESS"].includes(order.status)) {
      return NextResponse.json({
        error: "Solo se pueden cancelar órdenes en estado PENDING o IN_PROGRESS"
      }, { status: 400 });
    }

    // Cancelar orden y restaurar stock
    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" }
      });

      // Restaurar stock
      const items = await tx.orderItem.findMany({ where: { orderId } });
      for (const item of items) {
        if (item.size) {
          await tx.productSize.update({
            where: { productId_size: { productId: item.productId, size: item.size } },
            data: { stock: { increment: item.quantity } }
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
        }
      }
    });

    return NextResponse.json({ success: true, orderId, status: "CANCELLED" });
  } catch (error) {
    console.error("Error cancelando orden:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
```

**Archivos afectados**:
- `app/api/n8n/orders/[id]/cancel/route.ts` → CREAR
- `lib/schemas.ts` → Agregar schema de validación si es necesario

### 4.2 Notificación de nueva orden al vendedor

**Problema**: Cuando se crea una orden, n8n no notifica al vendedor.

**Solución**: Agregar webhook en `createOrder()` después de crear la orden:

```typescript
// En actions/orders.ts, después de crear la orden exitosamente
const n8nNewOrderWebhook = process.env.N8N_NEW_ORDER_WEBHOOK_URL;
if (n8nNewOrderWebhook) {
  fetch(n8nNewOrderWebhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      total: order.total,
      items: order.items.map(i => ({ name: i.product.name, quantity: i.quantity }))
    })
  }).catch(err => console.error("[n8n] Error notificando nueva orden:", err));
}
```

**Archivos afectados**:
- `actions/orders.ts` → Agregar notificación post-creación
- `.env.local` → Agregar `N8N_NEW_ORDER_WEBHOOK_URL`

### 4.3 Transacciones atómicas en modificación de items

**Problema**: `PATCH /api/n8n/orders/[id]/items` modifica items y recalcula totales en operaciones separadas, sin transacción.

**Solución**: Envolver toda la lógica en `db.$transaction()`:

```typescript
// En app/api/n8n/orders/[id]/items/route.ts
await db.$transaction(async (tx) => {
  // 1. Verificar orden y stock
  // 2. Modificar item (ADD/REMOVE)
  // 3. Recalcular totales
  // 4. Actualizar orden
});
```

**Archivos afectados**:
- `app/api/n8n/orders/[id]/items/route.ts` → Refactorizar con transacción

---

## 5. Fase 3: Optimización de Base de Datos (Semana 3)

### 5.1 Agregar índices a campos de búsqueda frecuente

**Problema**: Campos como `validationCode`, `customerDocument`, `customerPhone` se usan en búsquedas pero no tienen índices.

**Solución**: Modificar `prisma/schema.prisma`:

```prisma
model Order {
  id               String   @id
  validationCode   String   @unique @db.VarChar(6)
  customerDocument String   @db.VarChar(20)
  customerPhone    String   @db.VarChar(20)
  status           String   @default("PENDING") @db.VarChar(20)
  createdAt        DateTime @default(now())

  @@index([customerDocument])
  @@index([customerPhone])
  @@index([status, createdAt])
  @@index([validationCode])
}

model Product {
  id          String   @id
  sku         String   @unique @db.VarChar(50)
  category    String   @db.VarChar(50)
  createdAt   DateTime @default(now())

  @@index([category])
  @@index([sku])
  @@index([createdAt])
}
```

**Archivos afectados**:
- `prisma/schema.prisma` → Agregar índices
- Ejecutar: `npx prisma db push` y `npx prisma generate`

### 5.2 Migrar de SQLite a PostgreSQL (Opcional pero recomendado)

**Problema**: SQLite no soporta concurrencia alta ni escalabilidad para producción.

**Solución**:
1. Cambiar provider en `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Configurar `DATABASE_URL` en `.env.local`
3. Ejecutar migración: `npx prisma db push`
4. Actualizar Docker Compose si es necesario

**Archivos afectados**:
- `prisma/schema.prisma` → Cambiar provider
- `.env.local` → Agregar `DATABASE_URL`
- `docker-compose.yml` → Verificar configuración Postgres

---

## 6. Fase 4: Seguridad y DevOps (Semana 4)

### 6.1 Sanitizar `.env.local` y crear `.env.example`

**Problema**: `.env.local` contiene secrets reales commiteados.

**Solución**:
1. Verificar que `.env.local` esté en `.gitignore`
2. Crear `.env.example` con placeholders:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Admin Access
ADMIN_EMAILS=admin@example.com

# Database
DATABASE_URL="file:./dev.db"  # SQLite local, PostgreSQL en producción

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# n8n Integration
N8N_API_KEY=your_n8n_api_key
N8N_WEBHOOK_SECRET=your_webhook_secret
N8N_ORDER_STATUS_WEBHOOK_URL=https://your-n8n-instance/webhook/order-status
N8N_NEW_ORDER_WEBHOOK_URL=https://your-n8n-instance/webhook/new-order

# Webhooks
WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Archivos afectados**:
- `.env.example` → CREAR
- `.gitignore` → Verificar que `.env.local` esté excluido

### 6.2 Eliminar archivos de debug del repo

**Problema**: Archivos como `eslint-output.json`, `tsc-output.txt`, `Escenarios AME.csv/xlsx` no deberían estar en el repo.

**Solución**:
1. Agregar patrones a `.gitignore`
2. Eliminar archivos del tracking: `git rm --cached <file>`

**Archivos afectados**:
- `.gitignore` → Agregar patrones
- `eslint-output.json` → ELIMINAR
- `tsc-output.txt` → ELIMINAR
- `Escenarios AME.*` → ELIMINAR o mover a carpeta ignorada

### 6.3 Agregar tests unitarios críticos

**Problema**: Cero tests automatizados.

**Solución**: Configurar Vitest + Testing Library y agregar tests para:

1. **`lib/utils.ts`** → `generateValidationCode()` (longitud, caracteres válidos, unicidad)
2. **`lib/schemas.ts`** → Validación de schemas Zod
3. **`actions/orders.ts`** → `createOrder()` (validación, stock, transacciones)
4. **`app/api/n8n/orders/[id]/items/route.ts`** → ADD/REMOVE items

**Configuración inicial**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Archivos a crear**:
- `vitest.config.ts`
- `actions/orders.test.ts`
- `lib/utils.test.ts`
- `lib/schemas.test.ts`

---

## 7. Checklist de Implementación

### Fase 1: Correcciones Críticas
- [ ] Eliminar `app/api/orders/route.ts`
- [ ] Eliminar `app/api/orders/[document]/` si está vacío
- [ ] Crear `generateValidationCode()` en `lib/utils.ts` con `crypto.randomBytes`
- [ ] Actualizar `actions/orders.ts` para usar nueva función
- [ ] Agregar descuento de stock en `createOrder()` con transacción
- [ ] Crear `lib/auth.ts` con `requireAdminAuth()` centralizada
- [ ] Reemplazar copias duplicadas en 5 archivos de actions

### Fase 2: Funcionalidades Faltantes
- [ ] Crear `app/api/n8n/orders/[id]/cancel/route.ts`
- [ ] Agregar restauración de stock al cancelar
- [ ] Agregar notificación de nueva orden al vendedor en `createOrder()`
- [ ] Refactorizar `PATCH /api/n8n/orders/[id]/items` con transacción atómica
- [ ] Agregar verificación de stock al agregar items

### Fase 3: Optimización de Base de Datos
- [ ] Agregar índices en `prisma/schema.prisma`
- [ ] Ejecutar `npx prisma db push`
- [ ] Ejecutar `npx prisma generate`
- [ ] (Opcional) Migrar a PostgreSQL

### Fase 4: Seguridad y DevOps
- [ ] Verificar `.gitignore` excluye `.env.local`
- [ ] Crear `.env.example` con placeholders
- [ ] Eliminar archivos de debug del repo
- [ ] Configurar Vitest
- [ ] Crear tests para `lib/utils.ts`
- [ ] Crear tests para `lib/schemas.ts`
- [ ] Crear tests para `actions/orders.ts`

---

## 8. Dependencias y Requisitos

### Técnicas
- Node.js 18+
- Next.js 16
- Prisma 6+
- Clerk @clerk/nextjs ^7.0.7
- n8n (self-hosted o cloud)
- WhatsApp Business API

### Variables de Entorno Nuevas
```bash
N8N_NEW_ORDER_WEBHOOK_URL=https://your-n8n-instance/webhook/new-order
DATABASE_URL="postgresql://user:password@localhost:5432/tailor_marketplace"  # Si migra a PostgreSQL
```

---

## 9. Estimación de Tiempo

| Fase | Duración | Entregable |
|------|----------|------------|
| Fase 1: Correcciones Críticas | 1 semana | Código seguro, sin duplicación, stock correcto |
| Fase 2: Funcionalidades Faltantes | 1 semana | Cancelación, notificaciones, transacciones |
| Fase 3: Optimización DB | 2-3 días | Índices, mejor performance |
| Fase 4: Seguridad y DevOps | 1 semana | Tests, .env.example, limpieza |

**Total estimado: 3.5 - 4 semanas**

---

## 10. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Descuento de stock causa errores en órdenes existentes | Alto | Ejecutar migración de stock inicial antes de deploy |
| Migración a PostgreSQL rompe queries SQLite | Medio | Testear en staging primero, usar Prisma para abstracción |
| Tests fallan por dependencias de Clerk/n8n | Medio | Mockear servicios externos en tests unitarios |
| Transacciones lentas bajo carga | Bajo | Monitorear con Prisma Studio, agregar índices si es necesario |

---

## 11. Cambios respecto al PLAN_IMPLEMENTACION.md original

### Eliminado:
- ~~Fase 1: Nuevos endpoints API~~ → Ya existen (`/api/n8n/orders/[id]`, `/api/n8n/orders/validate`, `/api/n8n/orders/[id]/items`, `/api/n8n/orders/[id]/status`)
- ~~Fase 2: Agente n8n con intents~~ → Fuera del scope de este repo (es configuración de n8n, no código Next.js)
- ~~Flujos de conversación WhatsApp~~ → Fuera del scope (se configura en n8n)

### Agregado:
- Eliminación de API route duplicada
- Reemplazo de `Math.random()` por `crypto.randomBytes`
- Descuento de stock al crear orden
- Centralización de `requireAdminAuth()`
- Transacciones atómicas en modificación de items
- Índices de base de datos
- Sanitización de `.env.local` y creación de `.env.example`
- Tests unitarios
- Migración opcional a PostgreSQL

### Modificado:
- Fase 1 ahora se enfoca en correcciones críticas en lugar de nuevos endpoints
- Fase 2 se enfoca en funcionalidades realmente faltantes (cancelación, notificaciones)
- Fase 3 agregada para optimización de DB
- Fase 4 agregada para seguridad y DevOps

---

*Plan actualizado el 2026-05-08 basado en análisis completo del codebase*
