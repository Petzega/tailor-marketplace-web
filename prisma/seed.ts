// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Limpiar la base de datos antes de crear (para no duplicar si corres el comando 2 veces)
    await prisma.product.deleteMany()

    await prisma.product.create({
        data: {
            name: 'Vestido de Lino Verano',
            description: 'Ideal para el calor.',
            price: 120.00,
            stock: 5,
            category: 'READY_MADE',
            imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
        },
    })

    await prisma.product.create({
        data: {
            name: 'Basta de Pantalón',
            description: 'Servicio de ajuste de largo.',
            price: 15.00,
            stock: 999,
            category: 'SERVICE'
        },
    })

    console.log('✅ Base de datos sembrada con éxito')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })