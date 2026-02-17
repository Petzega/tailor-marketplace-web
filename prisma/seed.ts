import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.product.deleteMany()

    // 1. Producto Normal (Vestido)
    await prisma.product.create({
        data: {
            name: 'Vestido de Lino Verano',
            description: 'Fresco y elegante para la temporada.',
            price: 180.00,
            stock: 50,
            category: 'READY_MADE',
            imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500' // URL Nueva
        },
    })

    // 2. Producto "Low Stock" (Camisa)
    await prisma.product.create({
        data: {
            name: 'Camisa Oxford Clásica',
            description: 'Algodón premium, corte slim fit.',
            price: 120.00,
            stock: 2,
            category: 'READY_MADE',
            imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'
        },
    })

    // 3. Producto Agotado (Bufanda)
    await prisma.product.create({
        data: {
            name: 'Bufanda de Seda',
            description: 'Edición limitada.',
            price: 85.00,
            stock: 0,
            category: 'READY_MADE',
            imageUrl: 'https://images.unsplash.com/photo-1481325545291-94394fe1cf95?w=500' // URL Nueva (se verá gris)
        },
    })

    // 4. Servicio (Basta de Jeans) - AQUÍ ESTABA EL ERROR
    await prisma.product.create({
        data: {
            name: 'Basta de Jeans Original',
            description: 'Mantenemos el acabado original del ruedo.',
            price: 20.00,
            stock: 999,
            category: 'SERVICE',
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500' // URL de Jeans real
        },
    })

    console.log('✅ Datos corregidos sembrados')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })