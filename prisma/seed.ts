import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Vaciando la base de datos de productos...');
    await prisma.product.deleteMany({}); // Limpiamos primero

    console.log('Creando 25 productos y servicios con imágenes reales de Unsplash...');

    const dummyData = [
        // --- SERVICIOS ---
        { name: 'Basta de pantalón (Sencilla)', description: 'Servicio rápido para acortar o alargar la basta de pantalones de vestir o jeans.', price: 15.0, stock: 99, category: 'SERVICE', sku: '20260225001', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80&fit=crop' },
        { name: 'Entallado de Camisa', description: 'Ajuste de costados y pinzas traseras para un fit perfecto al cuerpo.', price: 35.0, stock: 99, category: 'SERVICE', sku: '20260225002', imageUrl: 'https://images.unsplash.com/photo-1598522325854-474c106dd1a5?w=600&q=80&fit=crop' },
        { name: 'Cambio de Cierre (Casaca)', description: 'Reemplazo completo de cierre frontal con repuestos de alta calidad.', price: 45.0, stock: 99, category: 'SERVICE', sku: '20260225003', imageUrl: 'https://images.unsplash.com/photo-1528652613149-6e3e1ba1f1b4?w=600&q=80&fit=crop' },
        { name: 'Ajuste de Cintura', description: 'Reducción o ampliación de cintura en faldas y pantalones.', price: 25.0, stock: 99, category: 'SERVICE', sku: '20260225004', imageUrl: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&q=80&fit=crop' },
        { name: 'Zurcido Invisible', description: 'Reparación de rasgaduras o polillas en prendas de lana o casimir.', price: 50.0, stock: 99, category: 'SERVICE', sku: '20260225005', imageUrl: 'https://images.unsplash.com/photo-1605280263929-1c4ffa370e5b?w=600&q=80&fit=crop' },
        { name: 'Confección de Traje a Medida', description: 'Traje completo (saco y pantalón) hecho a mano con telas premium.', price: 850.0, stock: 10, category: 'SERVICE', sku: '20260225006', imageUrl: 'https://images.unsplash.com/photo-1594938298596-70f56fb3cecb?w=600&q=80&fit=crop' },
        { name: 'Acortar Mangas de Saco', description: 'Ajuste de largo de mangas manteniendo los botones originales.', price: 60.0, stock: 99, category: 'SERVICE', sku: '20260225007', imageUrl: 'https://images.unsplash.com/photo-1593030103066-0093718efce9?w=600&q=80&fit=crop' },
        { name: 'Cambio de Forro', description: 'Reemplazo del forro interno de sacos o abrigos.', price: 120.0, stock: 99, category: 'SERVICE', sku: '20260225008', imageUrl: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80&fit=crop' },

        // --- PRODUCTOS READY-MADE ---
        { name: 'Corbata de Seda Azul Marino', description: 'Corbata 100% seda italiana, textura fina y elegante.', price: 85.0, stock: 15, category: 'READY_MADE', sku: '20260225009', imageUrl: 'https://images.unsplash.com/photo-1589756818134-453086eb2a36?w=600&q=80&fit=crop' },
        { name: 'Pañuelo de Bolsillo Blanco', description: 'Pañuelo clásico de algodón con bordes remallados a mano.', price: 20.0, stock: 30, category: 'READY_MADE', sku: '20260225010', imageUrl: 'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?w=600&q=80&fit=crop' },
        { name: 'Camisa Blanca Slim Fit (Talla M)', description: 'Camisa de algodón pima, resistente a arrugas.', price: 120.0, stock: 8, category: 'READY_MADE', sku: '20260225011', imageUrl: 'https://images.unsplash.com/photo-1620012253295-c15b118b631b?w=600&q=80&fit=crop' },
        { name: 'Pantalón de Vestir Gris (Talla 32)', description: 'Pantalón corte recto en mezcla de lana.', price: 180.0, stock: 5, category: 'READY_MADE', sku: '20260225012', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80&fit=crop' },
        { name: 'Cinturón de Cuero Reversible', description: 'Cinturón negro/marrón con hebilla plateada clásica.', price: 95.0, stock: 12, category: 'READY_MADE', sku: '20260225013', imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80&fit=crop' },
        { name: 'Gemelos de Plata', description: 'Gemelos para camisa con diseño minimalista.', price: 150.0, stock: 4, category: 'READY_MADE', sku: '20260225014', imageUrl: 'https://images.unsplash.com/photo-1588661794246-27670b8c668d?w=600&q=80&fit=crop' },
        { name: 'Calcetines de Vestir (Pack de 3)', description: 'Calcetines largos en colores oscuros (Negro, Azul, Gris).', price: 45.0, stock: 25, category: 'READY_MADE', sku: '20260225015', imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80&fit=crop' },
        { name: 'Corbata de Punto Burdeos', description: 'Corbata de punto de seda, ideal para looks casuales de negocios.', price: 75.0, stock: 0, category: 'READY_MADE', sku: '20260225016', imageUrl: 'https://images.unsplash.com/photo-1610488057106-de046d3f23a8?w=600&q=80&fit=crop' },
        { name: 'Tirantes Clásicos Negros', description: 'Tirantes elásticos con clips de alta resistencia.', price: 65.0, stock: 10, category: 'READY_MADE', sku: '20260225017', imageUrl: 'https://images.unsplash.com/photo-1506622709141-8e010a30b776?w=600&q=80&fit=crop' },
        { name: 'Alfiler de Corbata', description: 'Alfiler metálico dorado para mantener la corbata en su lugar.', price: 30.0, stock: 18, category: 'READY_MADE', sku: '20260225018', imageUrl: 'https://images.unsplash.com/photo-1579910480061-fcd34d67d716?w=600&q=80&fit=crop' },
        { name: 'Cepillo para Trajes', description: 'Cepillo de cerdas naturales para limpiar el polvo de los sacos.', price: 40.0, stock: 20, category: 'READY_MADE', sku: '20260225019', imageUrl: 'https://images.unsplash.com/photo-1626297316301-38295b95baea?w=600&q=80&fit=crop' },
        { name: 'Funda para Traje', description: 'Funda protectora transpirable con cierre largo.', price: 25.0, stock: 50, category: 'READY_MADE', sku: '20260225020', imageUrl: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=600&q=80&fit=crop' },
        { name: 'Perchas de Madera (Pack de 5)', description: 'Perchas anchas de madera de cedro para conservar la forma del saco.', price: 85.0, stock: 15, category: 'READY_MADE', sku: '20260225021', imageUrl: 'https://images.unsplash.com/photo-1551325444-f81d856037a5?w=600&q=80&fit=crop' },
        { name: 'Camisa Celeste Oxford (Talla L)', description: 'Camisa casual/elegante en tela Oxford.', price: 110.0, stock: 6, category: 'READY_MADE', sku: '20260225022', imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80&fit=crop' },
        { name: 'Blazer Azul Marino', description: 'Saco versátil sin forro para clima templado.', price: 350.0, stock: 3, category: 'READY_MADE', sku: '20260225023', imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80&fit=crop' },
        { name: 'Chaleco de Vestir Gris', description: 'Chaleco de 5 botones con ajuste en la espalda.', price: 140.0, stock: 7, category: 'READY_MADE', sku: '20260225024', imageUrl: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600&q=80&fit=crop' },
        { name: 'Corbata de Moño (Michi) Negra', description: 'Corbata de lazo pre-armada para eventos de gala.', price: 55.0, stock: 22, category: 'READY_MADE', sku: '20260225025', imageUrl: 'https://images.unsplash.com/photo-1580556608985-7171d7ebc238?w=600&q=80&fit=crop' },
    ];

    for (const item of dummyData) {
        await prisma.product.create({
            data: item
        });
    }

    console.log('¡Base de datos poblada exitosamente con imágenes reales!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });