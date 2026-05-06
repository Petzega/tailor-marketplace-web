# AGENTS.md

## Dev Commands
- `npm run dev` - Start dev server (localhost:3000)
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm run typecheck` - TypeScript
- `npx prisma db push --force-reset` - Reset DB (step 1)
- `npx prisma generate` - Update Prisma client (step 2)
- `npx prisma db seed` - Load seed data (step 3)

## Project Structure
- `app/` - Next.js App Router pages
- `app/ame-studio-ops/` - Admin dashboard (products, orders, customers, services)
- `app/product/[id]/` - Public product page
- `app/checkout/` - Checkout flow
- `components/` - React components (admin/, catalog/, checkout/, layout/, product/, search/, shared/, ui/)
- `prisma/schema.prisma` - Database schema

## Tech Stack
- Next.js 16, React 19, TypeScript
- Prisma + Postgres (via @prisma/client)
- Clerk (@clerk/nextjs) - Authentication
- Tailwind CSS v4 + shadcn
- Zustand - State management
- Zod - Validation

## Setup Order
1. `npx prisma db push --force-reset`
2. `npx prisma generate`
3. `npx prisma db seed`
4. `npm run dev`

## Local Infra
- Docker Compose for n8n/Redis/Postgres automation (`ame-bot/workflows/docker-compose.yml`)
- `docker compose up -d` to start
- Redis flush: `docker exec ame-redis redis-cli -a <password> FLUSHALL`

## Notes
- Image uploads limited to 5MB (configured in next.config.ts)
- Cloudinary configured for image hosting (remotePatterns)
- ESLint config: eslint-config-next
- TypeScript strict mode enabled