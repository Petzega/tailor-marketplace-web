import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando el vaciado de la base de datos...');
    // Limpiamos la base de datos antes de poblarla
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();

    console.log('Creando productos de prueba...');

    // 1. PRODUCTO NORMAL (Mujer, Vestido, Múltiples fotos)
    await prisma.product.create({
        data: {
            name: 'Vestido Floral de Verano',
            description: 'Hermoso vestido floral ligero, ideal para la temporada de verano. Confeccionado en algodón transpirable con detalles en la cintura.',
            price: 120.00,
            stock: 15,
            category: 'READY_MADE',
            gender: 'MUJER',
            clothingType: 'VESTIDO',
            sku: '20260303001',
            imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
            gallery: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
                    { url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=800&q=80' }
                ]
            }
        }
    });

    // 2. SERVICIO (Sastrería, Hombre, Traje, Múltiples fotos)
    await prisma.product.create({
        data: {
            name: 'Confección de Traje a Medida',
            description: 'Servicio premium de sastrería. Incluye toma de medidas, selección de telas italianas de alta costura y dos pruebas de ajuste. El precio indicado es el abono inicial.',
            price: 500.00,
            stock: 0, // Los servicios no usan stock, pero por seguridad le ponemos 0
            category: 'SERVICE',
            gender: 'HOMBRE',
            clothingType: 'TRAJE',
            sku: '20260303002',
            imageUrl: 'https://images.unsplash.com/photo-1594938298596-70f58bf4dd0a?auto=format&fit=crop&w=800&q=80',
            gallery: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
                    { url: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&w=800&q=80' }
                ]
            }
        }
    });

    // 3. PRODUCTO AGOTADO (Hombre, Camisa, Múltiples fotos)
    await prisma.product.create({
        data: {
            name: 'Camisa Oxford Clásica',
            description: 'Camisa de manga larga estilo Oxford en color celeste. Perfecta para ocasiones casuales y de oficina. Botones de nácar y corte slim fit.',
            price: 85.50,
            stock: 0, // 👈 AGOTADO
            category: 'READY_MADE',
            gender: 'HOMBRE',
            clothingType: 'CAMISA',
            sku: '20260303003',
            imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e23?auto=format&fit=crop&w=800&q=80',
            gallery: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
                    { url: 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?auto=format&fit=crop&w=800&q=80' }
                ]
            }
        }
    });

    // 4. PRODUCTO INFANTIL (Niño, Pantalón, Una sola foto para probar fallback)
    await prisma.product.create({
        data: {
            name: 'Pantalón Jogger Kids',
            description: 'Pantalón súper cómodo y resistente para niños. Cintura elástica y tobillos ajustados, ideal para jugar todo el día.',
            price: 45.00,
            stock: 20,
            category: 'READY_MADE',
            gender: 'NINO',
            clothingType: 'PANTALON',
            sku: '20260303004',
            imageUrl: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=800&q=80',
            // 👈 Sin galería adicional para validar que no se rompa y no muestre flechas
        }
    });

    // 5. PRODUCTO SIN GÉNERO (Accesorios, Varias fotos)
    await prisma.product.create({
        data: {
            name: 'Bolso de Cuero Artesanal',
            description: 'Bolso amplio fabricado con cuero 100% genuino de primera calidad. Acabados a mano con compartimentos internos para portátil.',
            price: 250.00,
            stock: 5,
            category: 'READY_MADE',
            gender: 'UNISEX',
            clothingType: 'ACCESORIOS',
            sku: '20260303005',
            imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
            gallery: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80' },
                    { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' }
                ]
            }
        }
    });

    console.log('✅ Base de datos poblada exitosamente con productos de prueba.');
}

main()
    .catch((e) => {
        console.error('❌ Error al correr el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });