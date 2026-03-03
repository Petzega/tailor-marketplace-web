import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ProductSeedData = {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    sku: string;
    imageUrl: string;
    gender?: string;          // 👈 Nuevo campo opcional
    clothingType?: string;    // 👈 Nuevo campo opcional
    galleryUrls?: string[];
};

async function main() {
    console.log('Vaciando la base de datos de productos...');
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});

    console.log('Creando productos y servicios con categorías actualizadas...');

    const dummyData: ProductSeedData[] = [
        // --- SERVICIOS (No suelen llevar género/tipo prenda) ---
        { name: 'Basta de pantalón (Sencilla)', description: 'Servicio rápido para acortar o alargar la basta de pantalones de vestir o jeans.', price: 15.0, stock: 99, category: 'SERVICE', sku: '20260225001', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80&fit=crop' },
        { name: 'Entallado de Camisa', description: 'Ajuste de costados y pinzas traseras para un fit perfecto al cuerpo.', price: 35.0, stock: 99, category: 'SERVICE', sku: '20260225002', imageUrl: 'https://images.unsplash.com/photo-1598522325854-474c106dd1a5?w=600&q=80&fit=crop' },

        // --- PRODUCTOS READY-MADE (CON BADGES) ---

        // HOMBRES
        {
            name: 'Camisa Blanca Slim Fit',
            description: 'Camisa de algodón pima, resistente a arrugas. Ideal para oficina.',
            price: 120.0, stock: 8, category: 'READY_MADE', sku: '20260225011',
            gender: 'HOMBRE', clothingType: 'CAMISA', // 👈 Badges: Hombre, Camisa
            imageUrl: 'https://images.unsplash.com/photo-1620012253295-c15b118b631b?w=600&q=80&fit=crop'
        },
        {
            name: 'Pantalón Chino Azul',
            description: 'Pantalón casual de gabardina con corte entallado.',
            price: 145.0, stock: 12, category: 'READY_MADE', sku: '20260225012',
            gender: 'HOMBRE', clothingType: 'PANTALON', // 👈 Badges: Hombre, Pantalón
            imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80&fit=crop'
        },

        // MUJERES (Nuevos datos para probar)
        {
            name: 'Vestido de Seda Floral',
            description: 'Vestido ligero de seda con estampado primaveral.',
            price: 280.0, stock: 5, category: 'READY_MADE', sku: '20260225030',
            gender: 'MUJER', clothingType: 'VESTIDO', // 👈 Badges: Mujer, Vestido
            imageUrl: 'https://images.unsplash.com/photo-1572804013307-5977c14ca4bb?w=600&q=80&fit=crop'
        },
        {
            name: 'Blusa de Lino Blanca',
            description: 'Blusa fresca 100% lino para clima cálido.',
            price: 115.0, stock: 10, category: 'READY_MADE', sku: '20260225031',
            gender: 'MUJER', clothingType: 'CAMISA',
            imageUrl: 'https://images.unsplash.com/photo-1548624149-f7b31668850a?w=600&q=80&fit=crop'
        },

        // NIÑOS Y NIÑAS
        {
            name: 'Polo Dino Kids',
            description: 'Polo de algodón con estampado de dinosaurio.',
            price: 45.0, stock: 20, category: 'READY_MADE', sku: '20260225032',
            gender: 'NINO', clothingType: 'POLO', // 👈 Badges: Niño, Polo
            imageUrl: 'https://images.unsplash.com/photo-1519235106638-30cc4903f70b?w=600&q=80&fit=crop'
        },
        {
            name: 'Vestido Tutú Rosa',
            description: 'Vestido de fiesta para niñas con falda de tul.',
            price: 95.0, stock: 15, category: 'READY_MADE', sku: '20260225033',
            gender: 'NINA', clothingType: 'VESTIDO', // 👈 Badges: Niña, Vestido
            imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80&fit=crop'
        },

        // UNISEX / ACCESORIOS
        {
            name: 'Corbata de Seda Azul',
            description: 'Corbata clásica 100% seda.',
            price: 75.0, stock: 15, category: 'READY_MADE', sku: '20260225009',
            gender: 'UNISEX', clothingType: 'ACCESORIOS',
            imageUrl: 'https://images.unsplash.com/photo-1589756818134-453086eb2a36?w=600&q=80&fit=crop'
        }
    ];

    for (const item of dummyData) {
        const { galleryUrls, ...productData } = item;

        await prisma.product.create({
            data: {
                ...productData,
                gallery: galleryUrls && galleryUrls.length > 0 ? {
                    create: galleryUrls.map(url => ({ url: url }))
                } : undefined
            }
        });
    }

    console.log('¡Base de datos poblada con éxito! Ahora puedes ver los badges en el detalle del producto.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });