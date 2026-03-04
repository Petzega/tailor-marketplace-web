import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Limpiando la base de datos...');
    await prisma.productSize.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();

    console.log('🌱 Sembrando 20 productos y servicios de prueba...');

    const productsData = [
        // --- 1. PRODUCTO NORMAL (Varias fotos, Todas las tallas con stock) ---
        {
            name: 'Vestido Floral de Verano',
            description: 'Hermoso vestido floral ligero, ideal para la temporada de verano. Confeccionado en algodón transpirable.',
            price: 120.00,
            stock: 15, // Total
            category: 'READY_MADE',
            gender: 'MUJER',
            clothingType: 'VESTIDO',
            sku: 'VST-001',
            imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
            gallery: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
                    { url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=800&q=80' }
                ]
            },
            sizes: {
                create: [
                    { size: 'S', stock: 5 },
                    { size: 'M', stock: 5 },
                    { size: 'L', stock: 5 }
                ]
            }
        },

        // --- 2. SERVICIO (Sin tallas, Botón WhatsApp directo) ---
        {
            name: 'Confección de Traje a Medida',
            description: 'Servicio premium de sastrería. Incluye toma de medidas, selección de telas italianas y dos pruebas. Precio base.',
            price: 500.00,
            stock: 0,
            category: 'SERVICE',
            gender: 'HOMBRE',
            clothingType: 'TRAJE',
            sku: 'SRV-001',
            imageUrl: 'https://images.unsplash.com/photo-1594938298596-70f58bf4dd0a?auto=format&fit=crop&w=800&q=80',
            gallery: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' }
                ]
            }
        },

        // --- 3. PRODUCTO TOTALMENTE AGOTADO ---
        {
            name: 'Camisa Oxford Clásica Celeste',
            description: 'Camisa de manga larga estilo Oxford. Perfecta para ocasiones casuales y de oficina. Botones de nácar.',
            price: 85.50,
            stock: 0, // 👈 Totalmente agotado
            category: 'READY_MADE',
            gender: 'HOMBRE',
            clothingType: 'CAMISA',
            sku: 'CAM-001',
            imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e23?auto=format&fit=crop&w=800&q=80',
            sizes: {
                create: [
                    { size: 'S', stock: 0 },
                    { size: 'M', stock: 0 },
                    { size: 'L', stock: 0 }
                ]
            }
        },

        // --- 4. PRODUCTO CON STOCK PARCIAL (Talla M agotada) ---
        {
            name: 'Casaca Denim Vintage',
            description: 'Casaca de jean clásica con lavado vintage y botones metálicos. Un básico que no pasa de moda.',
            price: 145.00,
            stock: 6, // 3 en S, 0 en M, 3 en L
            category: 'READY_MADE',
            gender: 'UNISEX',
            clothingType: 'CASACA',
            sku: 'CSK-001',
            imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
            sizes: {
                create: [
                    { size: 'S', stock: 3 },
                    { size: 'M', stock: 0 }, // 👈 La talla M debe aparecer bloqueada
                    { size: 'L', stock: 3 }
                ]
            }
        },

        // --- 5. ROPA DE NIÑO (1 sola foto, probar que no salgan flechas) ---
        {
            name: 'Pantalón Jogger Kids',
            description: 'Pantalón súper cómodo y resistente para niños. Cintura elástica y tobillos ajustados.',
            price: 45.00,
            stock: 15,
            category: 'READY_MADE',
            gender: 'NINO',
            clothingType: 'PANTALON',
            sku: 'PNT-001',
            imageUrl: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=800&q=80',
            // Sin galería
            sizes: {
                create: [
                    { size: '4', stock: 5 },
                    { size: '6', stock: 5 },
                    { size: '8', stock: 5 }
                ]
            }
        },

        // --- 6. ACCESORIO (Talla Única) ---
        {
            name: 'Bolso de Cuero Artesanal',
            description: 'Bolso amplio fabricado con cuero 100% genuino de primera calidad. Acabados a mano.',
            price: 250.00,
            stock: 4,
            category: 'READY_MADE',
            gender: 'MUJER',
            clothingType: 'ACCESORIOS',
            sku: 'ACC-001',
            imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
            sizes: {
                create: [
                    { size: 'UNICA', stock: 4 }
                ]
            }
        },

        // --- 7. SERVICIO RÁPIDO ---
        {
            name: 'Basta de Pantalón (Express)',
            description: 'Servicio de ajuste de basta para pantalones de vestir o jeans. Entrega en 24 horas.',
            price: 15.00,
            stock: 0,
            category: 'SERVICE',
            gender: 'UNISEX',
            clothingType: 'PANTALON',
            sku: 'SRV-002',
            imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80'
        },

        // --- 8. PRODUCTO CON FOTOS EXTRAS ---
        {
            name: 'Blusa de Seda Elegante',
            description: 'Blusa de seda suave con cuello en V. Perfecta para looks de noche o eventos formales.',
            price: 95.00,
            stock: 12,
            category: 'READY_MADE',
            gender: 'MUJER',
            clothingType: 'CAMISA',
            sku: 'BLS-001',
            imageUrl: 'https://images.unsplash.com/photo-1564222256577-45e728f2c611?auto=format&fit=crop&w=800&q=80',
            gallery: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80' }
                ]
            },
            sizes: {
                create: [
                    { size: 'S', stock: 4 },
                    { size: 'M', stock: 4 },
                    { size: 'L', stock: 4 }
                ]
            }
        },

        // --- 9 al 20. RELLENO PARA PAGINACIÓN ---
        {
            name: 'Polo Básico Algodón Blanco',
            description: 'Polo de algodón peinado, cuello redondo. Corte regular.',
            price: 35.00, stock: 20, category: 'READY_MADE', gender: 'HOMBRE', clothingType: 'POLO', sku: 'POL-001',
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
            sizes: { create: [{ size: 'S', stock: 10 }, { size: 'M', stock: 10 }] }
        },
        {
            name: 'Polo Básico Algodón Negro (Agotado)',
            description: 'El clásico polo negro que combina con todo.',
            price: 35.00, stock: 0, category: 'READY_MADE', gender: 'HOMBRE', clothingType: 'POLO', sku: 'POL-002',
            imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
            sizes: { create: [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }] }
        },
        {
            name: 'Abrigo de Invierno Lana',
            description: 'Abrigo largo de lana premium con forro interior.',
            price: 280.00, stock: 5, category: 'READY_MADE', gender: 'MUJER', clothingType: 'CASACA', sku: 'ABR-001',
            imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=800&q=80',
            sizes: { create: [{ size: 'M', stock: 2 }, { size: 'L', stock: 3 }] }
        },
        {
            name: 'Ajuste de Vestido de Novia',
            description: 'Entalle perfecto para el día más especial. Servicio de alta costura.',
            price: 250.00, stock: 0, category: 'SERVICE', gender: 'MUJER', clothingType: 'VESTIDO', sku: 'SRV-003',
            imageUrl: 'https://images.unsplash.com/photo-1596450514735-111a2fe02935?auto=format&fit=crop&w=800&q=80'
        },
        {
            name: 'Jeans Skinny Fit Tiro Alto',
            description: 'Jeans de mezclilla elástica que realzan la figura.',
            price: 110.00, stock: 18, category: 'READY_MADE', gender: 'MUJER', clothingType: 'PANTALON', sku: 'JNS-001',
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
            sizes: { create: [{ size: '28', stock: 6 }, { size: '30', stock: 6 }, { size: '32', stock: 6 }] }
        },
        {
            name: 'Corbata de Seda (Accesorio)',
            description: 'Corbata 100% seda italiana, patrón sutil.',
            price: 45.00, stock: 8, category: 'READY_MADE', gender: 'HOMBRE', clothingType: 'ACCESORIOS', sku: 'ACC-002',
            imageUrl: 'https://images.unsplash.com/photo-1595341513840-798c5ce9c228?auto=format&fit=crop&w=800&q=80',
            sizes: { create: [{ size: 'UNICA', stock: 8 }] }
        },
        {
            name: 'Vestido de Fiesta Lentejuelas',
            description: 'Vestido deslumbrante para eventos nocturnos.',
            price: 180.00, stock: 2, category: 'READY_MADE', gender: 'MUJER', clothingType: 'VESTIDO', sku: 'VST-002',
            imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
            sizes: { create: [{ size: 'S', stock: 2 }, { size: 'M', stock: 0 }] } // M agotada
        },
        {
            name: 'Servicio: Entalle de Camisa',
            description: 'Ajustamos tu camisa para que te quede a la perfección (pinzas y mangas).',
            price: 25.00, stock: 0, category: 'SERVICE', gender: 'HOMBRE', clothingType: 'CAMISA', sku: 'SRV-004',
            imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
        },
        {
            name: 'Chompa de Hilo Cuello Tortuga',
            description: 'Chompa abrigadora para días fríos.',
            price: 85.00, stock: 10, category: 'READY_MADE', gender: 'HOMBRE', clothingType: 'CASACA', sku: 'CHM-001',
            imageUrl: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?auto=format&fit=crop&w=800&q=80',
            sizes: { create: [{ size: 'M', stock: 5 }, { size: 'L', stock: 5 }] }
        },
        {
            name: 'Falda Plisada Midi',
            description: 'Falda de largo midi, muy versátil.',
            price: 70.00, stock: 0, category: 'READY_MADE', gender: 'MUJER', clothingType: 'PANTALON', sku: 'FLD-001',
            imageUrl: 'https://images.unsplash.com/photo-1583496661160-c5dcb2241c6d?auto=format&fit=crop&w=800&q=80',
            sizes: { create: [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }] }
        },
        {
            name: 'Conjunto Niña Primavera',
            description: 'Polo y short fresco para niñas.',
            price: 55.00, stock: 12, category: 'READY_MADE', gender: 'NINA', clothingType: 'POLO', sku: 'CNJ-001',
            imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
            sizes: { create: [{ size: '4', stock: 6 }, { size: '6', stock: 6 }] }
        },
        {
            name: 'Blazer Casual Elegante',
            description: 'Blazer con forro interno, ideal para oficina o salidas.',
            price: 160.00, stock: 7, category: 'READY_MADE', gender: 'HOMBRE', clothingType: 'CASACA', sku: 'BLZ-001',
            imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
            sizes: { create: [{ size: 'S', stock: 2 }, { size: 'M', stock: 3 }, { size: 'L', stock: 2 }] }
        }
    ];

    for (const product of productsData) {
        await prisma.product.create({
            data: product
        });
    }

    console.log('✅ ¡Base de datos poblada con éxito! (20 registros creados)');
}

main()
    .catch((e) => {
        console.error('❌ Error al correr el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });