import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";
import { ShieldCheck, Clock, Sparkles, Calendar, Star, Truck, RefreshCw, ChevronRight } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { SpotlightProduct } from "@/actions/search";
import { BackButton } from "@/components/product/back-button";
import { ProductGallery } from "@/components/product/product-gallery";
import { ScrollToTop } from "@/components/product/scroll-to-top";
import Link from "next/link";
import { ProductGrid } from "@/components/catalog/product-grid";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

type ProductWithGallery = SpotlightProduct & {
    gallery?: { url: string }[];
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

            {/* --- 1. BREADCRUMBS PREMIUM --- */}
            <div className="border-b border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Link href="/" className="hover:text-gray-900 transition-colors">Inicio</Link>
                        <ChevronRight size={14} className="text-gray-400" />
                        <Link href="/search" className="hover:text-gray-900 transition-colors">Catálogo</Link>
                        <ChevronRight size={14} className="text-gray-400" />
                        <span className="text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">{product.name}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-500 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm hidden sm:block">
                        SKU: {product.sku}
                    </span>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* COLUMNA IZQUIERDA: Galería */}
                    <ProductGallery images={allImages} isOutOfStock={isOutOfStock} isService={isService} />

                    {/* COLUMNA DERECHA: Detalles del Producto */}
                    <div className="flex flex-col h-full">

                        {/* Título y Reviews */}
                        <div className="mb-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                {isService ? 'Servicio de Sastrería' : 'Prenda Lista para Usar'}
                            </p>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Estrellas Visuales */}
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <span className="text-sm font-medium text-gray-500 underline decoration-gray-300 cursor-pointer hover:text-gray-900 transition-colors">
                                    (Ver reseñas)
                                </span>
                            </div>
                        </div>

                        <div className="mb-6 pb-6 border-b border-gray-100">
                            <p className="text-4xl font-black text-gray-900 tracking-tight">
                                S/ {product.price.toFixed(2)}
                            </p>
                            {isService && <p className="text-sm text-gray-500 mt-2">Precio base. El costo final puede variar según los requerimientos.</p>}
                        </div>

                        {/* 2. SELECTOR DE TALLAS (Visual) */}
                        {!isService && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Talla</h3>
                                    <button className="text-xs font-medium text-gray-500 underline hover:text-gray-900 transition-colors">Guía de tallas</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['S', 'M', 'L', 'XL'].map((talla) => (
                                        <button
                                            key={talla}
                                            className={`h-12 w-16 rounded-xl border text-sm font-bold transition-all ${
                                                talla === 'M'
                                                    ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                                                    : 'border-gray-200 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                        >
                                            {talla}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-8 text-gray-600 text-base leading-relaxed">
                            {product.description || 'Sin descripción detallada para este producto.'}
                        </div>

                        {/* Estado del Stock con diseño Premium */}
                        {!isService && (
                            <div className="mb-8 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className={`h-2.5 w-2.5 rounded-full shadow-sm ${isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                                <span className="text-sm font-bold text-gray-800">
                                    {isOutOfStock ? 'Agotado temporalmente' : `¡Quedan ${product.stock} unidades en stock!`}
                                </span>
                            </div>
                        )}

                        {/* ZONA DE BOTONES DE ACCIÓN */}
                        <div className="mt-auto">
                            {isOutOfStock ? (
                                <button disabled className="w-full h-14 flex items-center justify-center gap-2 bg-gray-50 text-gray-400 font-bold rounded-xl text-base cursor-not-allowed border border-gray-200 shadow-sm">
                                    No disponible temporalmente
                                </button>
                            ) : isService ? (
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full h-14 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-base transition-colors shadow-md active:scale-[0.98]"
                                >
                                    <Calendar size={20} />
                                    Agendar Cita por WhatsApp
                                </a>
                            ) : (
                                <div className="grid grid-cols-[1fr_56px] gap-3 h-14">
                                    <AddToCartButton product={cartProduct} isOutOfStock={isOutOfStock} />

                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-full w-full items-center justify-center rounded-xl bg-[#25D366] hover:bg-[#20bd5a] transition-all duration-200 text-white shadow-md active:scale-[0.98]"
                                        title="Preguntar por WhatsApp"
                                    >
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* 3. INFO EXTRA (Garantías) */}
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:bg-gray-100">
                                <Truck className="text-gray-900 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Envíos a todo el Perú</h4>
                                    <p className="text-xs text-gray-500 mt-1">24-48h en Lima, 3-5 días en provincias.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:bg-gray-100">
                                <RefreshCw className="text-gray-900 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Cambios fáciles</h4>
                                    <p className="text-xs text-gray-500 mt-1">Hasta 7 días para devoluciones.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- 4. PRODUCTOS RELACIONADOS --- */}
                <div className="mt-20 lg:mt-32 pt-16 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            También te podría gustar
                        </h2>
                        <Link href={`/search?category=${product.category}`} className="text-sm font-bold text-gray-500 hover:text-gray-900 hidden sm:flex items-center gap-1 transition-colors">
                            Ver más <ChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Reutilizamos tu componente estrella. ¡Hará el fetch automático! */}
                    <div className="w-full">
                        <ProductGrid category={product.category} layout="carousel" />
                    </div>
                </div>

            </div>
        </div>
    );
}