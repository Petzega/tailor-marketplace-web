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
    gender?: string;
    clothingType?: string;
    galleryUrls?: string[];
};

async function main() {
    console.log('Vaciando la base de datos...');
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});

    console.log('Generando 30 productos/servicios para pruebas de paginado...');

    const dummyData: ProductSeedData[] = [
        // --- SERVICIOS ---
        { name: 'Basta de pantalón (Sencilla)', description: 'Servicio rápido para acortar o alargar la basta.', price: 15.0, stock: 99, category: 'SERVICE', sku: 'SKU-001', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80&fit=crop' },
        { name: 'Entallado de Camisa', description: 'Ajuste de costados y pinzas traseras.', price: 35.0, stock: 99, category: 'SERVICE', sku: 'SKU-002', imageUrl: 'https://images.unsplash.com/photo-1598522325854-474c106dd1a5?w=600&q=80&fit=crop' },
        { name: 'Cambio de Cierre', description: 'Reemplazo de cierre frontal en casacas.', price: 45.0, stock: 99, category: 'SERVICE', sku: 'SKU-003', imageUrl: 'https://images.unsplash.com/photo-1528652613149-6e3e1ba1f1b4?w=600&q=80&fit=crop' },
        { name: 'Ajuste de Cintura', description: 'Reducción o ampliación de cintura.', price: 25.0, stock: 99, category: 'SERVICE', sku: 'SKU-004', imageUrl: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&q=80&fit=crop' },

        // --- HOMBRES ---
        { name: 'Camisa Blanca Slim Fit', description: 'Algodón pima resistente a arrugas.', price: 120.0, stock: 10, category: 'READY_MADE', sku: 'SKU-005', gender: 'HOMBRE', clothingType: 'CAMISA', imageUrl: 'https://images.unsplash.com/photo-1620012253295-c15b118b631b?w=600&q=80&fit=crop' },
        { name: 'Pantalón Chino Azul', description: 'Corte entallado casual.', price: 145.0, stock: 15, category: 'READY_MADE', sku: 'SKU-006', gender: 'HOMBRE', clothingType: 'PANTALON', imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80&fit=crop' },
        { name: 'Blazer Gris Oxford', description: 'Saco elegante para eventos formales.', price: 380.0, stock: 5, category: 'READY_MADE', sku: 'SKU-007', gender: 'HOMBRE', clothingType: 'SACO', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80&fit=crop' },
        { name: 'Polo Negro Premium', description: 'Cuello redondo, 100% algodón.', price: 65.0, stock: 25, category: 'READY_MADE', sku: 'SKU-008', gender: 'HOMBRE', clothingType: 'POLO', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80&fit=crop' },
        { name: 'Jeans Clásicos', description: 'Mezclilla duradera corte recto.', price: 160.0, stock: 12, category: 'READY_MADE', sku: 'SKU-009', gender: 'HOMBRE', clothingType: 'PANTALON', imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80&fit=crop' },

        // --- MUJERES ---
        { name: 'Vestido Seda Floral', description: 'Estampado primaveral ligero.', price: 280.0, stock: 8, category: 'READY_MADE', sku: 'SKU-010', gender: 'MUJER', clothingType: 'VESTIDO', imageUrl: 'https://images.unsplash.com/photo-1572804013307-5977c14ca4bb?w=600&q=80&fit=crop' },
        { name: 'Blusa Lino Blanca', description: 'Fresca y elegante para el verano.', price: 115.0, stock: 14, category: 'READY_MADE', sku: 'SKU-011', gender: 'MUJER', clothingType: 'CAMISA', imageUrl: 'https://images.unsplash.com/photo-1548624149-f7b31668850a?w=600&q=80&fit=crop' },
        { name: 'Falda Plisada Midi', description: 'Color beige, ideal para oficina.', price: 130.0, stock: 9, category: 'READY_MADE', sku: 'SKU-012', gender: 'MUJER', clothingType: 'PANTALON', imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80&fit=crop' },
        { name: 'Chaqueta de Cuero Negra', description: 'Estilo biker con cierres plateados.', price: 450.0, stock: 4, category: 'READY_MADE', sku: 'SKU-013', gender: 'MUJER', clothingType: 'SACO', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80&fit=crop' },
        { name: 'Pantalón Palazo Rojo', description: 'Corte alto y elegante.', price: 175.0, stock: 6, category: 'READY_MADE', sku: 'SKU-014', gender: 'MUJER', clothingType: 'PANTALON', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80&fit=crop' },

        // --- NIÑOS/AS ---
        { name: 'Polo Dino Kids', description: 'Divertido estampado de dinosaurio.', price: 45.0, stock: 30, category: 'READY_MADE', sku: 'SKU-015', gender: 'NINO', clothingType: 'POLO', imageUrl: 'https://images.unsplash.com/photo-1519235106638-30cc4903f70b?w=600&q=80&fit=crop' },
        { name: 'Vestido Tutú Rosa', description: 'Falda de tul para fiestas.', price: 95.0, stock: 12, category: 'READY_MADE', sku: 'SKU-016', gender: 'NINA', clothingType: 'VESTIDO', imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80&fit=crop' },
        { name: 'Camisa Infantil Cuadros', description: 'Estilo leñador para niños.', price: 75.0, stock: 20, category: 'READY_MADE', sku: 'SKU-017', gender: 'NINO', clothingType: 'CAMISA', imageUrl: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80&fit=crop' },
        { name: 'Overol de Jean Niña', description: 'Clásico y resistente.', price: 110.0, stock: 10, category: 'READY_MADE', sku: 'SKU-018', gender: 'NINA', clothingType: 'PANTALON', imageUrl: 'https://images.unsplash.com/photo-1519457431-75514b711b9b?w=600&q=80&fit=crop' },

        // --- ACCESORIOS Y MÁS ---
        { name: 'Corbata Seda Azul', description: '100% seda italiana.', price: 85.0, stock: 40, category: 'READY_MADE', sku: 'SKU-019', gender: 'UNISEX', clothingType: 'ACCESORIOS', imageUrl: 'https://images.unsplash.com/photo-1589756818134-453086eb2a36?w=600&q=80&fit=crop' },
        { name: 'Cinturón de Cuero', description: 'Cuero genuino marrón.', price: 95.0, stock: 25, category: 'READY_MADE', sku: 'SKU-020', gender: 'UNISEX', clothingType: 'ACCESORIOS', imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80&fit=crop' },
        { name: 'Bufanda de Lana', description: 'Muy suave para el invierno.', price: 55.0, stock: 30, category: 'READY_MADE', sku: 'SKU-021', gender: 'UNISEX', clothingType: 'ACCESORIOS', imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80&fit=crop' },

        // --- MÁS PARA LLEGAR A 30 ---
        { name: 'Gorra Deportiva', description: 'Ajustable, color negro.', price: 40.0, stock: 50, category: 'READY_MADE', sku: 'SKU-022', gender: 'UNISEX', clothingType: 'ACCESORIOS', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80&fit=crop' },
        { name: 'Saco de Lana Mujer', description: 'Abrigo largo y elegante.', price: 520.0, stock: 3, category: 'READY_MADE', sku: 'SKU-023', gender: 'MUJER', clothingType: 'SACO', imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80&fit=crop' },
        { name: 'Polo Blanco Básico', description: 'Pack x3 unidades.', price: 90.0, stock: 20, category: 'READY_MADE', sku: 'SKU-024', gender: 'HOMBRE', clothingType: 'POLO', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&fit=crop' },
        { name: 'Vestido Negro Corto', description: 'El clásico infaltable.', price: 190.0, stock: 7, category: 'READY_MADE', sku: 'SKU-025', gender: 'MUJER', clothingType: 'VESTIDO', imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80&fit=crop' },
        { name: 'Pantalón de Vestir Gris', description: 'Corte recto formal.', price: 165.0, stock: 11, category: 'READY_MADE', sku: 'SKU-026', gender: 'HOMBRE', clothingType: 'PANTALON', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80&fit=crop' },
        { name: 'Camisa Denim', description: 'Tela resistente, estilo vaquero.', price: 135.0, stock: 8, category: 'READY_MADE', sku: 'SKU-027', gender: 'HOMBRE', clothingType: 'CAMISA', imageUrl: 'https://images.unsplash.com/photo-1588359348347-9bc6cbb669ff?w=600&q=80&fit=crop' },
        { name: 'Cardigan Tejido', description: 'Para media estación, mujer.', price: 145.0, stock: 5, category: 'READY_MADE', sku: 'SKU-028', gender: 'MUJER', clothingType: 'SACO', imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80&fit=crop' },
        { name: 'Short de Verano Kids', description: 'Cómodo para jugar.', price: 55.0, stock: 25, category: 'READY_MADE', sku: 'SKU-029', gender: 'NINO', clothingType: 'PANTALON', imageUrl: 'https://images.unsplash.com/photo-1519457431-75514b711b9b?w=600&q=80&fit=crop' },
        { name: 'Pañuelo de Bolsillo', description: 'Seda con bordes remallados.', price: 35.0, stock: 15, category: 'READY_MADE', sku: 'SKU-030', gender: 'HOMBRE', clothingType: 'ACCESORIOS', imageUrl: 'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?w=600&q=80&fit=crop' },
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

    console.log('¡Población completada! Se crearon 30 registros.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });