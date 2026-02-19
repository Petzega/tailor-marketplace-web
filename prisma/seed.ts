import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.product.deleteMany()

    // Simulamos la fecha de hoy para el ejemplo
    const todayPrefix = '20260218';

    // 1. Producto Normal
    await prisma.product.create({
        data: {
            name: 'Vestido de Lino Verano',
            description: 'Fresco y elegante.',
            price: 180.00,
            stock: 50,
            category: 'READY_MADE',
            sku: `${todayPrefix}001`, // 👈 SKU Manual 001
            imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'
        },
    })

    // 2. Producto Low Stock
    await prisma.product.create({
        data: {
            name: 'Camisa Oxford Clásica',
            description: 'Algodón premium.',
            price: 120.00,
            stock: 2,
            category: 'READY_MADE',
            sku: `${todayPrefix}002`, // 👈 SKU Manual 002
            imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'
        },
    })

    // 3. Producto Agotado
    await prisma.product.create({
        data: {
            name: 'Bufanda de Seda',
            description: 'Edición limitada.',
            price: 85.00,
            stock: 0,
            category: 'READY_MADE',
            sku: `${todayPrefix}003`, // 👈 SKU Manual 003
            imageUrl: 'https://images.unsplash.com/photo-1481325545291-94394fe1cf95?w=500'
        },
    })

    // 4. Servicio
    await prisma.product.create({
        data: {
            name: 'Basta de Jeans Original',
            description: 'Acabado original.',
            price: 20.00,
            stock: 999,
            category: 'SERVICE',
            sku: `${todayPrefix}004`, // 👈 SKU Manual 004
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'
        },
    })

    console.log('✅ Datos sembrados con SKUs correctos')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })