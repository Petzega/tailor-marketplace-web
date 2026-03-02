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
    galleryUrls?: string[];
    // 👇 NUEVOS CAMPOS AÑADIDOS
    gender?: string;
    clothingType?: string;
};

async function main() {
    console.log('Vaciando la base de datos de productos...');
    // Borramos las imágenes primero (por si acaso) y luego los productos
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});

    console.log('Creando productos y servicios con categorías avanzadas...');

    const dummyData: ProductSeedData[] = [
        // --- SERVICIOS ---
        { name: 'Basta de pantalón (Sencilla)', description: 'Servicio rápido para acortar o alargar la basta de pantalones de vestir o jeans.', price: 15.0, stock: 99, category: 'SERVICE', sku: '20260225001', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80&fit=crop', gender: 'UNISEX' },
        { name: 'Entallado de Camisa', description: 'Ajuste de costados y pinzas traseras para un fit perfecto al cuerpo.', price: 35.0, stock: 99, category: 'SERVICE', sku: '20260225002', imageUrl: 'https://images.unsplash.com/photo-1598522325854-474c106dd1a5?w=600&q=80&fit=crop', gender: 'UNISEX' },
        { name: 'Cambio de Cierre (Casaca)', description: 'Reemplazo completo de cierre frontal con repuestos de alta calidad.', price: 45.0, stock: 99, category: 'SERVICE', sku: '20260225003', imageUrl: 'https://images.unsplash.com/photo-1528652613149-6e3e1ba1f1b4?w=600&q=80&fit=crop', gender: 'UNISEX' },
        { name: 'Ajuste de Cintura', description: 'Reducción o ampliación de cintura en faldas y pantalones.', price: 25.0, stock: 99, category: 'SERVICE', sku: '20260225004', imageUrl: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&q=80&fit=crop', gender: 'UNISEX' },
        { name: 'Zurcido Invisible', description: 'Reparación de rasgaduras o polillas en prendas de lana o casimir.', price: 50.0, stock: 99, category: 'SERVICE', sku: '20260225005', imageUrl: 'https://images.unsplash.com/photo-1605280263929-1c4ffa370e5b?w=600&q=80&fit=crop', gender: 'UNISEX' },
        {
            name: 'Confección de Traje a Medida',
            description: 'Traje completo (saco y pantalón) hecho a mano con telas premium.',
            price: 850.0,
            stock: 10,
            category: 'SERVICE',
            sku: '20260225006',
            imageUrl: 'https://images.unsplash.com/photo-1594938298596-70f56fb3cecb?w=600&q=80&fit=crop',
            gender: 'HOMBRE',
            galleryUrls: [
                'https://images.unsplash.com/photo-1598522325840-05820bd59d43?w=600&q=80&fit=crop',
                'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=600&q=80&fit=crop',
            ]
        },
        { name: 'Acortar Mangas de Saco', description: 'Ajuste de largo de mangas manteniendo los botones originales.', price: 60.0, stock: 99, category: 'SERVICE', sku: '20260225007', imageUrl: 'https://images.unsplash.com/photo-1593030103066-0093718efce9?w=600&q=80&fit=crop', gender: 'UNISEX' },
        { name: 'Cambio de Forro', description: 'Reemplazo del forro interno de sacos o abrigos.', price: 120.0, stock: 99, category: 'SERVICE', sku: '20260225008', imageUrl: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80&fit=crop', gender: 'UNISEX' },

        // --- PRODUCTOS READY-MADE ORIGINALES ---
        { name: 'Corbata de Seda Azul Marino', description: 'Corbata 100% seda italiana, textura fina y elegante.', price: 85.0, stock: 15, category: 'READY_MADE', sku: '20260225009', imageUrl: 'https://images.unsplash.com/photo-1589756818134-453086eb2a36?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'ACCESORIOS' },
        { name: 'Pañuelo de Bolsillo Blanco', description: 'Pañuelo clásico de algodón con bordes remallados a mano.', price: 20.0, stock: 30, category: 'READY_MADE', sku: '20260225010', imageUrl: 'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'ACCESORIOS' },
        {
            name: 'Camisa Blanca Slim Fit (Talla M)',
            description: 'Camisa de algodón pima, resistente a arrugas. Ideal para oficina o eventos formales.',
            price: 120.0,
            stock: 8,
            category: 'READY_MADE',
            sku: '20260225011',
            imageUrl: 'https://images.unsplash.com/photo-1620012253295-c15b118b631b?w=600&q=80&fit=crop',
            gender: 'HOMBRE',
            clothingType: 'CAMISA',
            galleryUrls: [
                'https://images.unsplash.com/photo-1602810316498-ab67cefa81f1?w=600&q=80&fit=crop',
                'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80&fit=crop',
            ]
        },
        { name: 'Pantalón de Vestir Gris (Talla 32)', description: 'Pantalón corte recto en mezcla de lana.', price: 180.0, stock: 5, category: 'READY_MADE', sku: '20260225012', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'PANTALON' },
        { name: 'Cinturón de Cuero Reversible', description: 'Cinturón negro/marrón con hebilla plateada clásica.', price: 95.0, stock: 12, category: 'READY_MADE', sku: '20260225013', imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'ACCESORIOS' },
        { name: 'Gemelos de Plata', description: 'Gemelos para camisa con diseño minimalista.', price: 150.0, stock: 4, category: 'READY_MADE', sku: '20260225014', imageUrl: 'https://images.unsplash.com/photo-1588661794246-27670b8c668d?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'ACCESORIOS' },
        { name: 'Calcetines de Vestir (Pack de 3)', description: 'Calcetines largos en colores oscuros (Negro, Azul, Gris).', price: 45.0, stock: 25, category: 'READY_MADE', sku: '20260225015', imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'ACCESORIOS' },
        { name: 'Corbata de Punto Burdeos', description: 'Corbata de punto de seda, ideal para looks casuales de negocios.', price: 75.0, stock: 0, category: 'READY_MADE', sku: '20260225016', imageUrl: 'https://images.unsplash.com/photo-1610488057106-de046d3f23a8?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'ACCESORIOS' },
        { name: 'Tirantes Clásicos Negros', description: 'Tirantes elásticos con clips de alta resistencia.', price: 65.0, stock: 10, category: 'READY_MADE', sku: '20260225017', imageUrl: 'https://images.unsplash.com/photo-1506622709141-8e010a30b776?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'ACCESORIOS' },
        { name: 'Alfiler de Corbata', description: 'Alfiler metálico dorado para mantener la corbata en su lugar.', price: 30.0, stock: 18, category: 'READY_MADE', sku: '20260225018', imageUrl: 'https://images.unsplash.com/photo-1579910480061-fcd34d67d716?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'ACCESORIOS' },
        { name: 'Cepillo para Trajes', description: 'Cepillo de cerdas naturales para limpiar el polvo de los sacos.', price: 40.0, stock: 20, category: 'READY_MADE', sku: '20260225019', imageUrl: 'https://images.unsplash.com/photo-1626297316301-38295b95baea?w=600&q=80&fit=crop', gender: 'UNISEX', clothingType: 'ACCESORIOS' },
        { name: 'Funda para Traje', description: 'Funda protectora transpirable con cierre largo.', price: 25.0, stock: 50, category: 'READY_MADE', sku: '20260225020', imageUrl: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=600&q=80&fit=crop', gender: 'UNISEX', clothingType: 'ACCESORIOS' },
        { name: 'Perchas de Madera (Pack de 5)', description: 'Perchas anchas de madera de cedro para conservar la forma del saco.', price: 85.0, stock: 15, category: 'READY_MADE', sku: '20260225021', imageUrl: 'https://images.unsplash.com/photo-1551325444-f81d856037a5?w=600&q=80&fit=crop', gender: 'UNISEX', clothingType: 'ACCESORIOS' },
        { name: 'Camisa Celeste Oxford (Talla L)', description: 'Camisa casual/elegante en tela Oxford.', price: 110.0, stock: 6, category: 'READY_MADE', sku: '20260225022', imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'CAMISA' },
        {
            name: 'Blazer Azul Marino',
            description: 'Saco versátil sin forro para clima templado. Estilo moderno y ligero.',
            price: 350.0,
            stock: 3,
            category: 'READY_MADE',
            sku: '20260225023',
            imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80&fit=crop',
            gender: 'HOMBRE',
            clothingType: 'CAMISA',
            galleryUrls: [
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80&fit=crop'
            ]
        },
        { name: 'Chaleco de Vestir Gris', description: 'Chaleco de 5 botones con ajuste en la espalda.', price: 140.0, stock: 7, category: 'READY_MADE', sku: '20260225024', imageUrl: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'CAMISA' },
        { name: 'Corbata de Moño (Michi) Negra', description: 'Corbata de lazo pre-armada para eventos de gala.', price: 55.0, stock: 22, category: 'READY_MADE', sku: '20260225025', imageUrl: 'https://images.unsplash.com/photo-1580556608985-7171d7ebc238?w=600&q=80&fit=crop', gender: 'HOMBRE', clothingType: 'ACCESORIOS' },

        // --- PRODUCTOS NUEVOS PARA PROBAR FILTROS (Mujer y Niños) ---
        { name: 'Blusa de Seda Elegante', description: 'Blusa de seda suave para oficina o noche.', price: 130.0, stock: 12, category: 'READY_MADE', sku: '20260225030', imageUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80&fit=crop', gender: 'MUJER', clothingType: 'CAMISA' },
        { name: 'Vestido de Noche Floral', description: 'Vestido largo con estampado floral sutil.', price: 250.0, stock: 4, category: 'READY_MADE', sku: '20260225031', imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80&fit=crop', gender: 'MUJER', clothingType: 'VESTIDO' },
        { name: 'Pantalón Palazzo Negro', description: 'Pantalón de tiro alto, corte ancho.', price: 160.0, stock: 8, category: 'READY_MADE', sku: '20260225032', imageUrl: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&q=80&fit=crop', gender: 'MUJER', clothingType: 'PANTALON' },
        { name: 'Camisa de Lino Niño', description: 'Camisa fresca ideal para verano.', price: 60.0, stock: 15, category: 'READY_MADE', sku: '20260225033', imageUrl: 'https://images.unsplash.com/photo-1519238385078-43d7890f5a7a?w=600&q=80&fit=crop', gender: 'NINO', clothingType: 'CAMISA' },
        { name: 'Pantalón Escolar Azul', description: 'Pantalón resistente con refuerzo en rodillas.', price: 75.0, stock: 20, category: 'READY_MADE', sku: '20260225034', imageUrl: 'https://images.unsplash.com/photo-1594633313593-cb40da25ec49?w=600&q=80&fit=crop', gender: 'NINO', clothingType: 'PANTALON' },
        { name: 'Vestido de Fiesta Niña', description: 'Vestido con tul y lazo en la cintura.', price: 110.0, stock: 6, category: 'READY_MADE', sku: '20260225035', imageUrl: 'https://images.unsplash.com/photo-1621450190137-0245a198583c?w=600&q=80&fit=crop', gender: 'NINA', clothingType: 'VESTIDO' },
        { name: 'Short de Algodón Unisex', description: 'Short cómodo para jugar.', price: 40.0, stock: 25, category: 'READY_MADE', sku: '20260225036', imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80&fit=crop', gender: 'UNISEX', clothingType: 'SHORT' }
    ];

    for (const item of dummyData) {
        // Separamos el array de la galería del resto de datos del producto
        const { galleryUrls, ...productData } = item;

        await prisma.product.create({
            data: {
                ...productData,
                // Si el producto tiene fotos extra, le decimos a Prisma que las cree
                gallery: galleryUrls && galleryUrls.length > 0 ? {
                    create: galleryUrls.map(url => ({ url: url }))
                } : undefined
            }
        });
    }

    console.log('¡Base de datos poblada exitosamente con imágenes reales y TODAS las categorías!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });