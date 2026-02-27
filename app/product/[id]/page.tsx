import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";
import { ShieldCheck, Clock, Sparkles, Calendar } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { SpotlightProduct } from "@/actions/search";
import { BackButton } from "@/components/product/back-button";
import { ProductGallery } from "@/components/product/product-gallery"; // 👈 Importamos la nueva galería

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

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

    // Mensaje estandarizado de WhatsApp
    const whatsappMessage = encodeURIComponent(`Hola, me interesa el ${isService ? 'servicio' : 'producto'}: ${product.name} (SKU: ${product.sku}). ¿Podrían darme más información?`);
    const whatsappLink = `https://wa.me/51992431513?text=${whatsappMessage}`;

    // 👇 Preparamos el array de imágenes combinando la principal con la galería
    const productWithGallery = product as any; // Truco TypeScript temporal
    const allImages = [
        productWithGallery.imageUrl,
        ...(productWithGallery.gallery?.map((g: any) => g.url) || [])
    ].filter(Boolean) as string[];

    return (
        <div className="min-h-screen bg-white">

            {/* --- BREADCRUMB / NAVEGACIÓN --- */}
            <div className="border-b border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <BackButton />
                    <span className="text-xs font-mono text-gray-500 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                        SKU: {product.sku}
                    </span>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* 👇 COLUMNA IZQUIERDA: Usamos nuestro nuevo componente de Galería */}
                    <ProductGallery
                        images={allImages}
                        isOutOfStock={isOutOfStock}
                        isService={isService}
                    />

                    {/* COLUMNA DERECHA: Detalles del Producto */}
                    <div className="flex flex-col h-full">

                        <div className="mb-4">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                                {isService ? 'Servicio de Sastrería' : 'Prenda Lista para Usar'}
                            </p>
                        </div>

                        <div className="mb-6 pb-6 border-b border-gray-100">
                            <p className="text-4xl font-extrabold text-gray-900 flex items-baseline gap-1">
                                <span className="text-2xl text-gray-400 font-medium">S/</span>
                                {product.price.toFixed(2)}
                            </p>
                            {isService && <p className="text-sm text-gray-500 mt-2">Precio base. El costo final puede variar según los requerimientos de la prenda.</p>}
                        </div>

                        <div className="mb-8 text-gray-600 text-base leading-relaxed">
                            {product.description || 'Sin descripción detallada para este producto.'}
                        </div>

                        {/* Estado del Stock (Solo para ropa) */}
                        {!isService && (
                            <div className="mb-8 flex items-center gap-3">
                                <div className={`h-3 w-3 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                                <span className="text-sm font-medium text-gray-700">
                                    {isOutOfStock ? 'Agotado temporalmente' : `${product.stock} unidades disponibles para envío`}
                                </span>
                            </div>
                        )}

                        {/* 👇 ZONA DE BOTONES DE ACCIÓN */}
                        <div className="mt-auto">
                            {isOutOfStock ? (
                                <button disabled className="w-full h-14 flex items-center justify-center gap-2 bg-gray-50 text-gray-400 font-medium rounded-xl text-base cursor-not-allowed border border-gray-200">
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

                        {/* Garantías / Trust Badges */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-gray-700">
                                <ShieldCheck className="text-green-500" size={24} />
                                <span className="text-sm font-medium">Pagos 100% Seguros</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                {isService ? <Sparkles className="text-[#25D366]" size={24} /> : <Clock className="text-blue-500" size={24} />}
                                <span className="text-sm font-medium">{isService ? 'Atención Personalizada' : 'Envíos Rápidos'}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}