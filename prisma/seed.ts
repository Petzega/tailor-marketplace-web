import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función auxiliar para fechas pasadas
const getPastDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
};

// Función auxiliar para fechas futuras
const getFutureDate = (daysAhead: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date;
};

async function main() {
    console.log('🧹 Limpiando la base de datos...');

    // 1. Limpiamos las tablas dependientes primero
    await prisma.service.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    // 2. Limpiamos clientes y catálogo
    await prisma.customer.deleteMany();
    await prisma.productSize.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();

    console.log('🌱 Sembrando catálogo de productos...');

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
        // ✂️ 3. SERVICIOS COMO PRODUCTO EN TIENDA
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
        }
    ];

    for (const product of productsData) {
        await prisma.product.create({ data: product });
    }

    // ==========================================
    // 👥 SEMBRAR CLIENTES
    // ==========================================
    console.log('👥 Creando base de datos de clientes...');

    const customer1 = await prisma.customer.create({
        data: {
            docType: 'DNI',
            documentNumber: '74125896',
            name: 'María García',
            phone: '999888777',
            address: 'Av. Las Flores 456, Surco',
            measurements: 'Busto: 92cm | Cintura: 70cm | Cadera: 98cm | Estatura: 1.65m',
            notes: 'Cliente muy detallista. Prefiere entalles ceñidos pero cómodos.'
        }
    });

    const customer2 = await prisma.customer.create({
        data: {
            docType: 'RUC',
            documentNumber: '10741258961',
            name: 'Juan Pérez',
            phone: '911222333',
            address: 'Calle Los Pinos 123, Miraflores',
            measurements: 'Cuello: 40cm | Espalda: 48cm | Pecho: 105cm | Cintura: 88cm | Largo pantalón: 102cm',
            notes: 'Suele pedir trajes oscuros para trabajo corporativo.'
        }
    });

    const customer3 = await prisma.customer.create({
        data: {
            docType: 'CE',
            documentNumber: '001122334',
            name: 'Anna Smith',
            phone: '933444555',
            measurements: 'Busto: 88cm | Cintura: 65cm | Cadera: 90cm',
            notes: 'Habla inglés y un poco de español. Preferencia por telas ligeras.'
        }
    });

    // ==========================================
    // 🛒 SEMBRAR ÓRDENES DE PRUEBA ENLAZADAS A CLIENTES
    // ==========================================
    console.log('📦 Creando órdenes asociadas a los clientes...');

    const dbProducts = await prisma.product.findMany({ take: 2 });

    if (dbProducts.length >= 2) {
        const product1 = dbProducts[0];
        const product2 = dbProducts[1];

        // Orden 1 para María
        await prisma.order.create({
            data: {
                id: 'ORD-260307001',
                validationCode: 'token-magico-123',
                customerId: customer1.id,        // 👈 ENLACE AL CLIENTE
                customerName: customer1.name,
                customerDocType: customer1.docType,
                customerDocument: customer1.documentNumber,
                customerPhone: customer1.phone || '',
                address: customer1.address,
                reference: 'Frente al parque',
                deliveryMethod: 'DELIVERY',
                paymentMethod: 'Yape',
                subtotal: product1.price,
                deliveryCost: 10,
                total: product1.price + 10,
                status: 'PENDING',
                createdAt: getPastDate(1),
                items: {
                    create: [{ productId: product1.id, quantity: 1, price: product1.price, size: 'M' }]
                }
            }
        });

        // Orden 2 para Juan
        await prisma.order.create({
            data: {
                id: 'ORD-260307002',
                validationCode: 'token-magico-456',
                customerId: customer2.id,        // 👈 ENLACE AL CLIENTE
                customerName: customer2.name,
                customerDocType: customer2.docType,
                customerDocument: customer2.documentNumber,
                customerPhone: customer2.phone || '',
                deliveryMethod: 'STORE',
                paymentMethod: 'Efectivo',
                subtotal: product2.price * 2,
                deliveryCost: 0,
                total: product2.price * 2,
                status: 'IN_PROGRESS',
                createdAt: getPastDate(0),
                items: {
                    create: [{ productId: product2.id, quantity: 2, price: product2.price, size: 'S' }]
                }
            }
        });
    }

    // ==========================================
    // ✂️ SEMBRAR SERVICIOS DE SASTRERÍA
    // ==========================================
    console.log('🪡 Creando trabajos y servicios de sastrería...');

    // Servicio 1: En prueba (FITTING) para Juan
    await prisma.service.create({
        data: {
            customerId: customer2.id,
            status: 'FITTING',
            serviceType: 'Confección de Traje a Medida',
            description: 'Traje de 2 piezas (Saco y Pantalón) en lana fría azul marino, forro burdeos.',
            serviceNotes: 'Juan pidió que las solapas sean de pico y el pantalón sin pinzas.',
            price: 550.00,
            deposit: 300.00,
            balance: 250.00,
            receptionDate: getPastDate(15),
            fittingDate: getFutureDate(2), // Prueba en 2 días
            deliveryDate: getFutureDate(10), // Entrega final en 10 días
        }
    });

    // Servicio 2: Listo para entregar (READY) para María
    await prisma.service.create({
        data: {
            customerId: customer1.id,
            status: 'READY',
            serviceType: 'Ajuste de Vestido de Novia',
            description: 'Entalle en la cintura y ajuste de largo (basta) con encaje.',
            serviceNotes: 'Tener mucho cuidado con la pedrería del borde.',
            price: 150.00,
            deposit: 150.00,
            balance: 0.00, // Ya pagó todo
            receptionDate: getPastDate(7),
            deliveryDate: getPastDate(0), // Para entregar hoy
        }
    });

    // Servicio 3: Recién ingresado (PENDING) para Anna
    await prisma.service.create({
        data: {
            customerId: customer3.id,
            status: 'PENDING',
            serviceType: 'Basta de Pantalón',
            description: 'Subir basta de 2 pantalones jeans (clásico).',
            price: 30.00,
            deposit: 10.00,
            balance: 20.00,
            receptionDate: getPastDate(0), // Recibido hoy
            deliveryDate: getFutureDate(1), // Se entrega mañana (Express)
        }
    });

    console.log(`✅ ¡Base de datos poblada con éxito!`);
    console.log(`- Catálogo actualizado`);
    console.log(`- 3 Clientes creados con sus medidas`);
    console.log(`- 2 Órdenes enlazadas a clientes`);
    console.log(`- 3 Servicios de sastrería en progreso`);
}

main()
    .catch((e) => {
        console.error('❌ Error al correr el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });