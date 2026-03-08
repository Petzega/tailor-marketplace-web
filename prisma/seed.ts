import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función auxiliar para fechas pasadas
const getPastDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
};

async function main() {
    console.log('🧹 Limpiando la base de datos...');

    // 👇 NUEVO: Limpiamos las órdenes primero para evitar errores de relación
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.productSize.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();

    console.log('🌱 Sembrando base de datos masiva...');

    const productsData = [
        // ==========================================
        // 🧥 1. ROPA DE ADULTOS (Letras y Números de pantalón)
        // ==========================================
        {
            name: 'Abrigo de Invierno Premium',
            description: 'Abrigo de lana 100% italiana, ideal para bajas temperaturas. Corte elegante y forro de seda.',
            price: 320.00, stock: 15, category: 'READY_MADE', gender: 'HOMBRE', clothingType: 'CASACA', ageGroup: 'ADULT',
            sku: 'CLT-260305001',
            imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(2),
            gallery: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1551028719-01c1eb56211d?auto=format&fit=crop&w=800&q=80' },
                    { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80' }
                ]
            },
            sizes: { create: [{ size: 'S', stock: 5 }, { size: 'M', stock: 5 }, { size: 'L', stock: 5 }] }
        },
        {
            name: 'Vestido de Fiesta Lentejuelas',
            description: 'Vestido deslumbrante para eventos nocturnos. Completamente forrado para mayor comodidad.',
            price: 180.00, stock: 2, category: 'READY_MADE', gender: 'MUJER', clothingType: 'VESTIDO', ageGroup: 'ADULT',
            sku: 'CLT-260305002',
            imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(45),
            sizes: { create: [{ size: 'S', stock: 2 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }] }
        },
        {
            name: 'Jeans Skinny Fit Tiro Alto',
            description: 'Jeans de mezclilla elástica premium que realzan la figura.',
            price: 110.00, stock: 18, category: 'READY_MADE', gender: 'MUJER', clothingType: 'PANTALON', ageGroup: 'ADULT',
            sku: 'CLT-260305003',
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(10),
            sizes: { create: [{ size: '28', stock: 6 }, { size: '30', stock: 6 }, { size: '32', stock: 6 }] }
        },
        {
            name: 'Polo Básico Algodón Pima (Agotado)',
            description: 'El clásico polo negro de algodón pima peruano. Suavidad extrema.',
            price: 45.00, stock: 0, category: 'READY_MADE', gender: 'UNISEX', clothingType: 'POLO', ageGroup: 'ADULT',
            sku: 'CLT-260305004',
            imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(100),
            sizes: { create: [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }] }
        },

        // ==========================================
        // 🧸 2. ROPA DE NIÑOS Y BEBÉS (Números)
        // ==========================================
        {
            name: 'Pantalón Jogger Kids Aventura',
            description: 'Pantalón súper cómodo y resistente para niños que no paran. Cintura elástica reforzada.',
            price: 45.00, stock: 20, category: 'READY_MADE', gender: 'NINO', clothingType: 'PANTALON', ageGroup: 'KIDS',
            sku: 'CLT-260305005',
            imageUrl: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(5),
            gallery: {
                create: [{ url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80' }]
            },
            sizes: { create: [{ size: '4', stock: 5 }, { size: '6', stock: 5 }, { size: '8', stock: 5 }, { size: '10', stock: 5 }] }
        },
        {
            name: 'Vestido de Primavera Niña',
            description: 'Vestido ligero con estampado de mariposas. Incluye lazo a juego.',
            price: 60.00, stock: 9, category: 'READY_MADE', gender: 'NINA', clothingType: 'VESTIDO', ageGroup: 'KIDS',
            sku: 'CLT-260305006',
            imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(30),
            sizes: { create: [{ size: '6', stock: 3 }, { size: '8', stock: 6 }, { size: '10', stock: 0 }] }
        },
        {
            name: 'Enterizo de Algodón Orgánico Bebé',
            description: 'Onesie suave, hipoalergénico y sin costuras molestas. Ideal para pieles sensibles.',
            price: 35.00, stock: 15, category: 'READY_MADE', gender: 'UNISEX', clothingType: 'POLO', ageGroup: 'BABY',
            sku: 'CLT-260305007',
            imageUrl: 'https://images.unsplash.com/photo-1522771930-78848d92871d?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(1),
            sizes: { create: [{ size: '0-3M', stock: 5 }, { size: '3-6M', stock: 5 }, { size: '6-12M', stock: 5 }] }
        },

        // ==========================================
        // ✂️ 3. SERVICIOS (Sin tallas ni stock)
        // ==========================================
        {
            name: 'Confección de Traje a Medida',
            description: 'Servicio premium de sastrería. Incluye toma de medidas, selección de telas italianas y dos pruebas. Precio base.',
            price: 500.00, stock: 0, category: 'SERVICE', gender: 'HOMBRE', clothingType: 'TRAJE', ageGroup: 'ADULT',
            sku: 'SRV-260305001',
            imageUrl: 'https://images.unsplash.com/photo-1594938298596-70f58bf4dd0a?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(200),
            gallery: {
                create: [{ url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' }]
            }
        },
        {
            name: 'Basta de Pantalón (Express 24h)',
            description: 'Servicio de ajuste de basta para pantalones de vestir o jeans. Entrega rápida y acabados de primera.',
            price: 15.00, stock: 0, category: 'SERVICE', gender: 'UNISEX', clothingType: 'PANTALON', ageGroup: 'ADULT',
            sku: 'SRV-260305002',
            imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(150),
        },
        {
            name: 'Ajuste de Vestido de Novia',
            description: 'Entalle perfecto para el día más especial. Servicio de alta costura, pedrería y encajes.',
            price: 250.00, stock: 0, category: 'SERVICE', gender: 'MUJER', clothingType: 'VESTIDO', ageGroup: 'ADULT',
            sku: 'SRV-260305003',
            imageUrl: 'https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(50),
        },

        // ==========================================
        // 🎒 4. ACCESORIOS (Talla Única)
        // ==========================================
        {
            name: 'Bolso de Cuero Artesanal',
            description: 'Bolso amplio fabricado con cuero 100% genuino de primera calidad. Acabados a mano.',
            price: 250.00, stock: 4, category: 'READY_MADE', gender: 'MUJER', clothingType: 'ACCESORIOS', ageGroup: 'ADULT',
            sku: 'CLT-260305008',
            imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(60),
            sizes: { create: [{ size: 'UNICA', stock: 4 }] }
        },
        {
            name: 'Corbata de Seda Italiana',
            description: 'Corbata 100% seda, patrón sutil a rayas. Ideal para complementar trajes oscuros.',
            price: 45.00, stock: 8, category: 'READY_MADE', gender: 'HOMBRE', clothingType: 'ACCESORIOS', ageGroup: 'ADULT',
            sku: 'CLT-260305009',
            imageUrl: 'https://images.unsplash.com/photo-1595341513840-798c5ce9c228?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(5),
            sizes: { create: [{ size: 'UNICA', stock: 8 }] }
        },

        // ==========================================
        // 👕 5. MÁS RELLENO VARIADO
        // ==========================================
        {
            name: 'Casaca Denim Vintage Unisex',
            description: 'Casaca de jean clásica con lavado vintage y botones metálicos.',
            price: 145.00, stock: 6, category: 'READY_MADE', gender: 'UNISEX', clothingType: 'CASACA', ageGroup: 'ADULT',
            sku: 'CLT-260305010',
            imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(80),
            sizes: { create: [{ size: 'S', stock: 3 }, { size: 'M', stock: 0 }, { size: 'L', stock: 3 }] }
        },
        {
            name: 'Blusa de Seda Elegante',
            description: 'Blusa de seda suave con cuello en V. Perfecta para looks de noche o eventos formales.',
            price: 95.00, stock: 12, category: 'READY_MADE', gender: 'MUJER', clothingType: 'CAMISA', ageGroup: 'ADULT',
            sku: 'CLT-260305011',
            imageUrl: 'https://images.unsplash.com/photo-1564222256577-45e728f2c611?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(12),
            gallery: {
                create: [{ url: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80' }]
            },
            sizes: { create: [{ size: 'S', stock: 4 }, { size: 'M', stock: 4 }, { size: 'L', stock: 4 }] }
        },
        {
            name: 'Conjunto Deportivo Niño (Agotado)',
            description: 'Buzo completo para niño. Casaca con capucha y pantalón.',
            price: 85.00, stock: 0, category: 'READY_MADE', gender: 'NINO', clothingType: 'CASACA', ageGroup: 'KIDS',
            sku: 'CLT-260305012',
            imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(40),
            sizes: { create: [{ size: '8', stock: 0 }, { size: '10', stock: 0 }, { size: '12', stock: 0 }] }
        },
        {
            name: 'Chompa de Hilo Cuello Tortuga',
            description: 'Chompa abrigadora para días fríos de oficina.',
            price: 85.00, stock: 10, category: 'READY_MADE', gender: 'HOMBRE', clothingType: 'CASACA', ageGroup: 'ADULT',
            sku: 'CLT-260305013',
            imageUrl: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(20),
            sizes: { create: [{ size: 'M', stock: 5 }, { size: 'L', stock: 5 }] }
        },
        {
            name: 'Vestido Floral de Verano',
            description: 'Hermoso vestido floral ligero, ideal para la temporada de playa. Confeccionado en algodón transpirable.',
            price: 120.00, stock: 15, category: 'READY_MADE', gender: 'MUJER', clothingType: 'VESTIDO', ageGroup: 'ADULT',
            sku: 'CLT-260305014',
            imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
            createdAt: getPastDate(3),
            gallery: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
                    { url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=800&q=80' }
                ]
            },
            sizes: { create: [{ size: 'S', stock: 5 }, { size: 'M', stock: 5 }, { size: 'L', stock: 5 }] }
        }
    ];

    // Insertar productos
    for (const product of productsData) {
        await prisma.product.create({
            data: product
        });
    }

    // ==========================================
    // 🛒 SEMBRAR ÓRDENES DE PRUEBA
    // ==========================================
    console.log('📦 Sembrando órdenes de prueba...');

    // Obtenemos un par de productos reales recién creados para la orden
    const dbProducts = await prisma.product.findMany({ take: 2 });

    if (dbProducts.length >= 2) {
        const product1 = dbProducts[0];
        const product2 = dbProducts[1];

        // Orden 1: Pendiente y Delivery
        await prisma.order.create({
            data: {
                shortId: 'ORD-260307001',
                token: 'token-magico-123',
                customerName: 'María García',
                customerPhone: '999888777',
                customerAddress: 'Av. Las Flores 456, Surco',
                customerReference: 'Frente al parque',
                deliveryMethod: 'DELIVERY',
                paymentMethod: 'Yape',
                subtotal: product1.price,
                deliveryCost: 10,
                total: product1.price + 10,
                status: 'PENDING',
                createdAt: getPastDate(1), // Ayer
                items: {
                    create: [
                        { productId: product1.id, quantity: 1, price: product1.price, size: 'M' }
                    ]
                }
            }
        });

        // Orden 2: En Proceso y Retiro en tienda
        await prisma.order.create({
            data: {
                shortId: 'ORD-260307002',
                token: 'token-magico-456',
                customerName: 'Juan Pérez',
                customerPhone: '911222333',
                deliveryMethod: 'STORE',
                paymentMethod: 'Efectivo',
                subtotal: product2.price * 2,
                deliveryCost: 0,
                total: product2.price * 2,
                status: 'IN_PROCESS',
                createdAt: getPastDate(0), // Hoy
                items: {
                    create: [
                        { productId: product2.id, quantity: 2, price: product2.price, size: 'S' }
                    ]
                }
            }
        });
    }

    console.log(`✅ ¡Base de datos poblada con éxito! (${productsData.length} productos y 2 órdenes creadas)`);
}

main()
    .catch((e) => {
        console.error('❌ Error al correr el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });