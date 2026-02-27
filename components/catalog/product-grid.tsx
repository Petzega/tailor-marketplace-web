"use client"; // 👈 IMPORTANTE: Esto es necesario para usar hooks como useEffect y useState

import { getProducts } from "@/actions/products";
import { Calendar } from "lucide-react";
import { Product } from "@/types";
import Image from "next/image";
import { ProductPagination } from "@/components/admin/product-pagination";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { useEffect, useRef, useState } from "react"; // 👈 Importamos los hooks necesarios

interface ProductGridProps {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    products?: Product[];
    layout?: "grid" | "carousel";
}

export async function ProductGrid({
                                      query,
                                      category,
                                      minPrice,
                                      maxPrice,
                                      sort,
                                      page = 1,
                                      products: passedProducts,
                                      layout = "grid"
                                  }: ProductGridProps) {

    let displayProducts = passedProducts;
    let totalPages = 0;
    let totalItems = 0;

    if (!displayProducts) {
        const data = await getProducts(query, category, page);
        displayProducts = data.products;
        totalPages = data.totalPages;
        totalItems = data.total;
    }

    if (displayProducts.length === 0) {
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

    // --- LÓGICA DEL CARRUSEL AUTOMÁTICO ---
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false); // Estado para saber si el mouse está encima

    useEffect(() => {
        // Solo ejecutamos la lógica si estamos en modo carrusel y el mouse NO está encima
        if (layout !== "carousel" || isHovered) return;

        const carousel = carouselRef.current;
        if (!carousel) return;

        // Función que realiza el desplazamiento
        const scrollCarousel = () => {
            const { scrollLeft, offsetWidth, scrollWidth } = carousel;

            // Calculamos cuánto scroll falta para llegar al final
            const maxScroll = scrollWidth - offsetWidth;

            // Si estamos cerca del final, volvemos al principio. Si no, avanzamos una "página" (el ancho visible).
            // Usamos un pequeño margen de error (5px) para la comparación
            if (scrollLeft >= maxScroll - 5) {
                carousel.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                carousel.scrollBy({ left: offsetWidth, behavior: "smooth" });
            }
        };

        // Creamos el intervalo de 3 segundos (3000ms)
        const intervalId = setInterval(scrollCarousel, 3000);

        // Función de limpieza: se ejecuta cuando el componente se desmonta o cambia el layout/hover
        // Esto es crucial para evitar que el temporizador siga corriendo en segundo plano
        return () => clearInterval(intervalId);
    }, [layout, isHovered]); // El efecto se vuelve a ejecutar si cambia el layout o el estado de hover

    // --- CLASES DINÁMICAS (CORRECCIÓN DE ICONOS CORTADOS) ---
    const containerClasses = layout === "carousel"
        ? "flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] focus:outline-none" // 👈 Eliminados -mx-4 px-4, añadido focus:outline-none
        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8";

    const itemClasses = layout === "carousel"
        ? "group relative flex flex-col gap-3 snap-start shrink-0 w-[280px] sm:w-[300px] outline-none" // 👈 Añadido outline-none
        : "group relative flex flex-col gap-3";

    return (
        <div className="flex flex-col gap-8">
            {/* Contenedor dinámico (Grid o Carrusel) */}
            <div
                ref={carouselRef} // 👈 Asignamos la referencia para controlar el scroll
                className={containerClasses}
                // Eventos para pausar/reanudar el movimiento automático
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(true)} // Para dispositivos táctiles
                onTouchEnd={() => setIsHovered(false)}
                tabIndex={0} // Permite que el div reciba foco para pausar con teclado
            >
                {displayProducts.map((product) => {
                    const isOutOfStock = product.stock === 0;
                    const isLowStock = product.stock > 0 && product.stock < 5;
                    const isService = product.category === 'SERVICE';

                    return (
                        <div key={product.id} className={itemClasses} tabIndex={0}> {/* tabIndex para accesibilidad */}
                            {/* 1. Imagen y Badges */}
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-400 bg-gray-200">
                                        Sin Foto
                                    </div>
                                )}

                                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                    {isService && (
                                        <span className="bg-black text-white text-[10px] px-2 py-1 font-bold uppercase tracking-wide rounded">
                                            Servicio
                                        </span>
                                    )}
                                    {!isService && !isOutOfStock && (
                                        <span className="bg-white/90 text-black text-[10px] px-2 py-1 font-bold uppercase tracking-wide rounded shadow-sm">
                                            Nuevo
                                        </span>
                                    )}
                                </div>

                                {isOutOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-10">
                                        <span className="bg-white text-black px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-sm shadow-lg">
                                            Agotado
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* 2. Información del Producto */}
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                    {product.description}
                                </p>
                            </div>

                            {/* 3. Precio y Stock */}
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xl font-bold text-gray-900">
                                    S/ {product.price.toFixed(2)}
                                </span>

                                {isLowStock && (
                                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                                        ¡Quedan {product.stock}!
                                    </span>
                                )}
                            </div>

                            {/* 4. Botón de Acción */}
                            {isOutOfStock ? (
                                <button disabled className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed border border-gray-200">
                                    No disponible
                                </button>
                            ) : (
                                <button className="w-full flex items-center justify-center gap-2 rounded-md bg-green-600 hover:bg-green-700 transition-all duration-200 px-4 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg active:scale-[0.98]">
                                    {isService ? <Calendar size={18} /> : <WhatsAppIcon />}
                                    {isService ? 'Agendar Cita' : 'Pedir por WhatsApp'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 5. Paginador */}
            {!passedProducts && totalPages > 1 && (
                <div className="mt-8 rounded-lg overflow-hidden border border-gray-100">
                    <ProductPagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                    />
                </div>
            )}
        </div>
    );
}

function WhatsAppIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.305-5.235c0-5.438 4.411-9.856 9.854-9.856 2.632 0 5.108 1.026 6.969 2.888 1.861 1.862 2.888 4.337 2.888 6.968 0 5.443-4.415 9.865-9.855 9.865" />
        </svg>
    )
}