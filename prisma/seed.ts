import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Vaciando la base de datos de productos...');
    await prisma.product.deleteMany({}); // Limpiamos primero para no duplicar

    console.log('Creando 25 productos y servicios de prueba...');

    const dummyData = [
        // --- SERVICIOS ---
        { name: 'Basta de pantalón (Sencilla)', description: 'Servicio rápido para acortar o alargar la basta de pantalones de vestir o jeans.', price: 15.0, stock: 99, category: 'SERVICE', sku: '20260225001', imageUrl: 'https://placehold.co/600x400?text=Basta+Pantalón' },
        { name: 'Entallado de Camisa', description: 'Ajuste de costados y pinzas traseras para un fit perfecto al cuerpo.', price: 35.0, stock: 99, category: 'SERVICE', sku: '20260225002', imageUrl: 'https://placehold.co/600x400?text=Entallado+Camisa' },
        { name: 'Cambio de Cierre (Casaca)', description: 'Reemplazo completo de cierre frontal con repuestos de alta calidad.', price: 45.0, stock: 99, category: 'SERVICE', sku: '20260225003', imageUrl: 'https://placehold.co/600x400?text=Cambio+Cierre' },
        { name: 'Ajuste de Cintura', description: 'Reducción o ampliación de cintura en faldas y pantalones.', price: 25.0, stock: 99, category: 'SERVICE', sku: '20260225004', imageUrl: 'https://placehold.co/600x400?text=Ajuste+Cintura' },
        { name: 'Zurcido Invisible', description: 'Reparación de rasgaduras o polillas en prendas de lana o casimir.', price: 50.0, stock: 99, category: 'SERVICE', sku: '20260225005', imageUrl: 'https://placehold.co/600x400?text=Zurcido+Invisible' },
        { name: 'Confección de Traje a Medida', description: 'Traje completo (saco y pantalón) hecho a mano con telas premium.', price: 850.0, stock: 10, category: 'SERVICE', sku: '20260225006', imageUrl: 'https://placehold.co/600x400?text=Traje+a+Medida' },
        { name: 'Acortar Mangas de Saco', description: 'Ajuste de largo de mangas manteniendo los botones originales.', price: 60.0, stock: 99, category: 'SERVICE', sku: '20260225007', imageUrl: 'https://placehold.co/600x400?text=Mangas+Saco' },
        { name: 'Cambio de Forro', description: 'Reemplazo del forro interno de sacos o abrigos.', price: 120.0, stock: 99, category: 'SERVICE', sku: '20260225008', imageUrl: 'https://placehold.co/600x400?text=Cambio+Forro' },

        // --- PRODUCTOS READY-MADE (Ropa lista para llevar) ---
        { name: 'Corbata de Seda Azul Marino', description: 'Corbata 100% seda italiana, textura fina y elegante.', price: 85.0, stock: 15, category: 'READY_MADE', sku: '20260225009', imageUrl: 'https://placehold.co/600x400?text=Corbata+Seda' },
        { name: 'Pañuelo de Bolsillo Blanco', description: 'Pañuelo clásico de algodón con bordes remallados a mano.', price: 20.0, stock: 30, category: 'READY_MADE', sku: '20260225010', imageUrl: 'https://placehold.co/600x400?text=Pañuelo+Blanco' },
        { name: 'Camisa Blanca Slim Fit (Talla M)', description: 'Camisa de algodón pima, resistente a arrugas.', price: 120.0, stock: 8, category: 'READY_MADE', sku: '20260225011', imageUrl: 'https://placehold.co/600x400?text=Camisa+Blanca' },
        { name: 'Pantalón de Vestir Gris (Talla 32)', description: 'Pantalón corte recto en mezcla de lana.', price: 180.0, stock: 5, category: 'READY_MADE', sku: '20260225012', imageUrl: 'https://placehold.co/600x400?text=Pantalón+Gris' },
        { name: 'Cinturón de Cuero Reversible', description: 'Cinturón negro/marrón con hebilla plateada clásica.', price: 95.0, stock: 12, category: 'READY_MADE', sku: '20260225013', imageUrl: 'https://placehold.co/600x400?text=Cinturón+Cuero' },
        { name: 'Gemelos de Plata', description: 'Gemelos para camisa con diseño minimalista.', price: 150.0, stock: 4, category: 'READY_MADE', sku: '20260225014', imageUrl: 'https://placehold.co/600x400?text=Gemelos+Plata' },
        { name: 'Calcetines de Vestir (Pack de 3)', description: 'Calcetines largos en colores oscuros (Negro, Azul, Gris).', price: 45.0, stock: 25, category: 'READY_MADE', sku: '20260225015', imageUrl: 'https://placehold.co/600x400?text=Calcetines+Pack' },
        { name: 'Corbata de Punto Burdeos', description: 'Corbata de punto de seda, ideal para looks casuales de negocios.', price: 75.0, stock: 0, category: 'READY_MADE', sku: '20260225016', imageUrl: 'https://placehold.co/600x400?text=Corbata+Punto' }, // <-- Sin stock para probar el filtro visual
        { name: 'Tirantes Clásicos Negros', description: 'Tirantes elásticos con clips de alta resistencia.', price: 65.0, stock: 10, category: 'READY_MADE', sku: '20260225017', imageUrl: 'https://placehold.co/600x400?text=Tirantes+Negros' },
        { name: 'Alfiler de Corbata', description: 'Alfiler metálico dorado para mantener la corbata en su lugar.', price: 30.0, stock: 18, category: 'READY_MADE', sku: '20260225018', imageUrl: 'https://placehold.co/600x400?text=Alfiler+Corbata' },
        { name: 'Cepillo para Trajes', description: 'Cepillo de cerdas naturales para limpiar el polvo de los sacos.', price: 40.0, stock: 20, category: 'READY_MADE', sku: '20260225019', imageUrl: 'https://placehold.co/600x400?text=Cepillo+Trajes' },
        { name: 'Funda para Traje', description: 'Funda protectora transpirable con cierre largo.', price: 25.0, stock: 50, category: 'READY_MADE', sku: '20260225020', imageUrl: 'https://placehold.co/600x400?text=Funda+Traje' },
        { name: 'Perchas de Madera (Pack de 5)', description: 'Perchas anchas de madera de cedro para conservar la forma del saco.', price: 85.0, stock: 15, category: 'READY_MADE', sku: '20260225021', imageUrl: 'https://placehold.co/600x400?text=Perchas+Madera' },
        { name: 'Camisa Celeste Oxford (Talla L)', description: 'Camisa casual/elegante en tela Oxford.', price: 110.0, stock: 6, category: 'READY_MADE', sku: '20260225022', imageUrl: 'https://placehold.co/600x400?text=Camisa+Celeste' },
        { name: 'Blazer Azul Marino', description: 'Saco versátil sin forro para clima templado.', price: 350.0, stock: 3, category: 'READY_MADE', sku: '20260225023', imageUrl: 'https://placehold.co/600x400?text=Blazer+Azul' },
        { name: 'Chaleco de Vestir Gris', description: 'Chaleco de 5 botones con ajuste en la espalda.', price: 140.0, stock: 7, category: 'READY_MADE', sku: '20260225024', imageUrl: 'https://placehold.co/600x400?text=Chaleco+Gris' },
        { name: 'Corbata de Moño (Michi) Negra', description: 'Corbata de lazo pre-armada para eventos de gala.', price: 55.0, stock: 22, category: 'READY_MADE', sku: '20260225025', imageUrl: 'https://placehold.co/600x400?text=Corbata+Moño' },
    ];

    for (const item of dummyData) {
        await prisma.product.create({
            data: item
        });
    }

    console.log('¡Base de datos poblada exitosamente con 25 ítems!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });