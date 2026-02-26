import { getProducts } from "@/actions/products";
import Image from "next/image";
import { PaginationControls } from "./pagination-controls";

interface ProductGridProps {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
}

export async function ProductGrid({ query, category, minPrice, maxPrice, sort, page = 1 }: ProductGridProps) {
    const { products, totalPages } = await getProducts(query, category, page, minPrice, maxPrice, sort);

    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">
                    {query
                        ? `No encontramos productos para "${query}"`
                        : "No hay productos disponibles por el momento."}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full">
            {/* 1. LA CUADRÍCULA DE PRODUCTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => {
                    const isOutOfStock = product.stock === 0;
                    const isService = product.category === 'SERVICE';

                    // Mensaje predeterminado para WhatsApp
                    const whatsappMessage = encodeURIComponent(`Hola, me interesa el ${isService ? 'servicio' : 'producto'}: ${product.name} (SKU: ${product.sku}). ¿Podrían darme más información?`);
                    const whatsappLink = `https://wa.me/51992431513?text=${whatsappMessage}`; // TODO: Reemplaza con tu número real

                    return (
                        <div key={product.id} className="group relative flex flex-col gap-3">
                            {/* Contenedor de la Imagen */}
                            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                                {/* Etiqueta NUEVO */}
                                <div className="absolute top-2 left-2 z-10 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 rounded-sm shadow-sm">
                                    NUEVO
                                </div>

                                {/* Imagen del producto */}
                                <Image
                                    src={product.imageUrl || "https://placehold.co/600x400?text=Sin+Imagen"}
                                    alt={product.name}
                                    fill
                                    className={`object-cover object-center transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                                />

                                {/* Etiqueta AGOTADO */}
                                {isOutOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-900 rounded-sm shadow-md">
                                            AGOTADO
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Información del Producto */}
                            <div className="flex flex-col flex-1 mt-2">
                                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                    {product.description}
                                </p>

                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-lg font-bold text-gray-900">
                                        S/ {product.price.toFixed(2)}
                                    </p>
                                </div>

                                {/* Botón de Acción */}
                                <div className="mt-4 mt-auto">
                                    {isOutOfStock ? (
                                        <button disabled className="w-full py-2 px-4 bg-gray-50 text-gray-400 font-medium rounded-lg text-sm cursor-not-allowed border border-gray-200">
                                            No disponible
                                        </button>
                                    ) : (
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center py-2 px-4 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                                </svg>
                                                Pedir por WhatsApp
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 2. CONTROLES DE PAGINACIÓN */}
            {/* Ahora están estrictamente FUERA del grid, ocupando el 100% del ancho (w-full) y centrados */}
            <div className="mt-12 w-full flex justify-center pb-8">
                <PaginationControls totalPages={totalPages} currentPage={page} />
            </div>
        </div>
    );
}