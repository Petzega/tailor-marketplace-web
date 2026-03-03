import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";
import { Clock, Calendar, Star, Truck, RefreshCw, ChevronRight, ShieldCheck } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { SpotlightProduct } from "@/actions/search";
import { ProductGallery } from "@/components/product/product-gallery";
import { ScrollToTop } from "@/components/product/scroll-to-top";
import Link from "next/link";
import { ProductGrid } from "@/components/catalog/product-grid";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

// Extendemos el tipo para incluir la galería, el género y el tipo de ropa
type ProductWithGallery = SpotlightProduct & {
    gallery?: { url: string }[];
    gender?: string | null;
    clothingType?: string | null;
};

// Función auxiliar para formatear los textos de los badges
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

            {/* CONTENEDOR PRINCIPAL */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-14 items-start relative">

                    {/* COLUMNA IZQUIERDA (Galería 50%) */}
                    <div className="w-full md:w-1/2 shrink-0">
                        <ProductGallery images={allImages} isOutOfStock={isOutOfStock} isService={isService} />
                    </div>

                    {/* COLUMNA DERECHA (Detalles 50%) */}
                    <div className="w-full md:w-1/2 flex flex-col gap-5 lg:sticky lg:top-24">

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    {isService ? 'Servicio de Sastrería' : 'Prenda Lista para Usar'}
                                </p>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star size={12} fill="currentColor" />
                                    <span className="text-[11px] font-bold text-gray-600 ml-1">4.9</span>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                                {product.name}
                            </h1>

                            {/* 👇 AQUÍ ESTÁN LOS BADGES MOSTRANDO LAS CARACTERÍSTICAS TÉCNICAS */}
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

                        {!isService && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Selecciona tu Talla</h3>
                                    <button className="text-[11px] font-bold text-gray-500 underline underline-offset-2 hover:text-gray-900 transition-colors">Guía de medidas</button>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {['S', 'M', 'L', 'XL'].map((talla) => (
                                        <button
                                            key={talla}
                                            className={`h-10 w-12 rounded-md border text-xs font-bold transition-all ${
                                                talla === 'M'
                                                    ? 'border-gray-900 bg-gray-900 text-white shadow-md ring-2 ring-gray-900 ring-offset-2'
                                                    : 'border-gray-200 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                        >
                                            {talla}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Descripción</h3>
                            <p className="text-gray-600 text-[13px] leading-relaxed">
                                {product.description || 'Detalles premium y acabados de alta calidad diseñados para durar. Esta pieza es un básico esencial para cualquier guardarropa.'}
                            </p>
                        </div>

                        {!isService && (
                            <div className="flex items-center gap-2 bg-gray-50 py-2.5 px-3 rounded-md border border-gray-100 w-fit">
                                <div className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                                    {isOutOfStock ? 'Agotado temporalmente' : `Solo quedan ${product.stock} unidades`}
                                </span>
                            </div>
                        )}

                        {/* ZONA DE ACCIÓN: Botón Contador + Botón WhatsApp */}
                        <div className="pt-2">
                            {isOutOfStock ? (
                                <button disabled className="w-full h-12 flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-bold rounded-lg text-sm cursor-not-allowed border border-gray-200">
                                    Agotado
                                </button>
                            ) : isService ? (
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full h-12 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                                >
                                    <Calendar size={18} />
                                    Agendar Cita en WhatsApp
                                </a>
                            ) : (
                                <div className="flex gap-2.5 h-12 w-full">
                                    <div className="flex-1">
                                        <AddToCartButton product={cartProduct} isOutOfStock={isOutOfStock} showQuantity={true} />
                                    </div>
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] hover:bg-[#20bd5a] transition-all text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                                        title="Consultar por WhatsApp"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Garantías */}
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

                {/* --- PRODUCTOS RELACIONADOS --- */}
                <div className="mt-16 pt-10 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            Completa tu estilo
                        </h2>
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