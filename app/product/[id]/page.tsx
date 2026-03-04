import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";
import { Truck, RefreshCw, ChevronRight, ShieldCheck } from "lucide-react";
import { SpotlightProduct } from "@/actions/search";
import { ProductGallery } from "@/components/product/product-gallery";
import { ScrollToTop } from "@/components/product/scroll-to-top";
import Link from "next/link";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ProductOptions } from "@/components/product/product-options"; // 👈 AQUÍ IMPORTAMOS EL NUEVO COMPONENTE

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

type ProductWithGallery = SpotlightProduct & {
    gallery?: { url: string }[];
    sizes?: { size: string; stock: number }[]; // 👈 NUEVO: Le avisamos a TS que vienen tallas
    gender?: string | null;
    clothingType?: string | null;
};

const formatLabel = (text: string | null | undefined) => {
    if (!text) return null;
    if (text === 'NINO') return 'Niño';
    if (text === 'NINA') return 'Niña';
    return text.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    const isService = product.category === 'SERVICE';
    const isOutOfStock = product.stock === 0 && !isService;

    const cartProduct: SpotlightProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        category: product.category,
        sku: product.sku || '',
    };

    const whatsappMessage = encodeURIComponent(`Hola, me interesa el ${isService ? 'servicio' : 'producto'}: ${product.name} (SKU: ${product.sku}). ¿Podrían darme más información?`);
    const whatsappLink = `https://wa.me/51992431513?text=${whatsappMessage}`;

    const typedProduct = product as unknown as ProductWithGallery;
    const allImages = [
        typedProduct.imageUrl,
        ...(typedProduct.gallery?.map((g) => g.url) || [])
    ].filter(Boolean) as string[];

    return (
        <div className="min-h-screen bg-white">
            <ScrollToTop />

            {/* BREADCRUMBS */}
            <div className="border-b border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                        <Link href="/" className="hover:text-gray-900 transition-colors">Inicio</Link>
                        <ChevronRight size={12} className="text-gray-400" />
                        <Link href="/search" className="hover:text-gray-900 transition-colors">Catálogo</Link>
                        <ChevronRight size={12} className="text-gray-400" />
                        <span className="text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">{product.name}</span>
                    </div>
                    <span className="text-[11px] font-bold font-mono text-gray-500 tracking-widest hidden sm:block">
                        SKU: {product.sku}
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-14 items-start relative">

                    {/* COLUMNA IZQUIERDA */}
                    <div className="w-full md:w-1/2 shrink-0">
                        <ProductGallery images={allImages} isOutOfStock={isOutOfStock} isService={isService} />
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div className="w-full md:w-1/2 flex flex-col gap-5 lg:sticky lg:top-24">

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    {isService ? 'Servicio de Sastrería' : 'Prenda Lista para Usar'}
                                </p>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex flex-wrap gap-2 mt-1">
                                {typedProduct.gender && (
                                    <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-extrabold py-0.5 px-2.5 rounded-md uppercase">
                                        {formatLabel(typedProduct.gender)}
                                    </span>
                                )}
                                {typedProduct.clothingType && (
                                    <span className="bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold py-0.5 px-2.5 rounded-md uppercase">
                                        {formatLabel(typedProduct.clothingType)}
                                    </span>
                                )}
                                {isService && (
                                    <span className="bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold py-0.5 px-2.5 rounded-md uppercase">
                                        SERVICIO
                                    </span>
                                )}
                            </div>

                            <div className="mt-3 flex items-end gap-3">
                                <p className="text-3xl font-black text-gray-900 tracking-tighter">
                                    S/ {product.price.toFixed(2)}
                                </p>
                            </div>
                            {isService && <p className="text-xs font-medium text-gray-500">Precio base. El costo final puede variar según detalles.</p>}
                        </div>

                        <hr className="border-gray-100" />

                        {/* 👇 LA NUEVA ZONA INTERACTIVA */}
                        <ProductOptions
                            product={cartProduct}
                            sizes={typedProduct.sizes || []} // 👈 NUEVO: Pasamos las tallas reales
                            description={product.description}
                            isOutOfStock={isOutOfStock}
                            isService={isService}
                            whatsappLink={whatsappLink}
                        />

                        {/* GARANTÍAS */}
                        <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3 mt-3 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="text-green-600" size={16} />
                                <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Compra 100% Segura</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-start gap-1.5">
                                    <Truck className="text-gray-400 shrink-0 mt-0.5" size={14} />
                                    <p className="text-[10px] text-gray-600 leading-tight">Envíos nacionales rápidos.</p>
                                </div>
                                <div className="flex items-start gap-1.5">
                                    <RefreshCw className="text-gray-400 shrink-0 mt-0.5" size={14} />
                                    <p className="text-[10px] text-gray-600 leading-tight">Devoluciones en 7 días.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-16 pt-10 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Completa tu estilo</h2>
                        <Link href={`/search?category=${product.category}`} className="text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:text-gray-900 hidden sm:flex items-center gap-1 transition-colors">
                            Ver todo <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="w-full">
                        <ProductGrid category={product.category} layout="carousel" />
                    </div>
                </div>
            </div>
        </div>
    );
}