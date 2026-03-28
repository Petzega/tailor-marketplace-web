"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types";
import Link from "next/link";

interface ProductCarouselProps {
    products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const SCROLL_AMOUNT = 320;

    const updateScrollButtons = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollButtons();
        el.addEventListener("scroll", updateScrollButtons, { passive: true });
        const ro = new ResizeObserver(updateScrollButtons);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", updateScrollButtons);
            ro.disconnect();
        };
    }, []);

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
    };

    return (
        <div className="relative group/carousel">
            {/* Botón Izquierda */}
            <button
                onClick={scrollLeft}
                aria-label="Anterior"
                className={`
                    absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20
                    flex h-10 w-10 items-center justify-center rounded-full
                    bg-white shadow-lg border border-gray-200
                    text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600
                    transition-all duration-200 active:scale-90
                    opacity-0 group-hover/carousel:opacity-100
                    ${!canScrollLeft ? "invisible" : ""}
                `}
            >
                <ChevronLeft size={20} />
            </button>

            {/* Track del Carrusel */}
            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {products.map((product) => {
                    const isService = product.category === "SERVICE";
                    const isOutOfStock = product.stock === 0 && !isService; // 👈 SOLUCIÓN AQUÍ TAMBIÉN
                    const isLowStock = product.stock > 0 && product.stock < 5;

                    return (
                        <div
                            key={product.id}
                            className="group relative flex flex-col gap-3 snap-start shrink-0 w-[260px] sm:w-[280px]"
                        >
                            {/* Imagen */}
                            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        sizes="280px"
                                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? "opacity-50 grayscale" : ""}`}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-400 bg-gray-200 text-sm">
                                        Sin Foto
                                    </div>
                                )}

                                {/* Badges */}
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

                                {/* Agotado overlay */}
                                {isOutOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-10">
                                        <span className="bg-white text-black px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-sm shadow-lg">
                                            Agotado
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                    {product.description}
                                </p>
                            </div>

                            {/* Precio */}
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

                            {/* Botón */}
                            {isOutOfStock ? (
                                <button
                                    disabled
                                    className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed border border-gray-200"
                                >
                                    No disponible
                                </button>
                            ) : (
                                <Link
                                    href={`/product/${product.id}`}
                                    className={`w-full flex items-center justify-center gap-2 rounded-md transition-all duration-200 px-4 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg active:scale-[0.98] ${isService ? "bg-[#25D366] hover:bg-[#20bd5a]" : "bg-gray-900 hover:bg-black"
                                        }`}
                                >
                                    {isService ? <Calendar size={18} /> : null}
                                    {isService ? "Ver Servicio" : "Seleccionar Talla"}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Botón Derecha */}
            <button
                onClick={scrollRight}
                aria-label="Siguiente"
                className={`
                    absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20
                    flex h-10 w-10 items-center justify-center rounded-full
                    bg-white shadow-lg border border-gray-200
                    text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600
                    transition-all duration-200 active:scale-90
                    opacity-0 group-hover/carousel:opacity-100
                    ${!canScrollRight ? "invisible" : ""}
                `}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
