"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Ruler, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    isOutOfStock: boolean;
    isService: boolean;
}

export function ProductGallery({ images, isOutOfStock, isService }: ProductGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasMultiple = images.length > 1;

    // Si por alguna razón el producto no tiene ni una sola foto
    if (images.length === 0) {
        return (
            <div className="relative aspect-square w-full max-w-xl mx-auto overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-gray-400">
                {isService ? <Ruler size={64} className="opacity-20 mb-4" /> : <ShoppingBag size={64} className="opacity-20 mb-4" />}
                <p>Sin imagen disponible</p>
            </div>
        );
    }

    // Funciones para las flechas
    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col gap-4">

            {/* 1. IMAGEN PRINCIPAL GIGANTE CON TRANSICIÓN SUAVE */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-sm group">
                <div className="absolute top-4 left-4 z-30 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-900 rounded-sm shadow-md">
                    NUEVO
                </div>

                {/* Apilamos todas las fotos y jugamos con la opacidad */}
                {images.map((img, idx) => (
                    <Image
                        key={idx}
                        src={img}
                        alt={`Producto vista ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        className={`object-cover object-center transition-opacity duration-700 ease-in-out ${
                            idx === currentIndex ? "opacity-100 z-20" : "opacity-0 z-10"
                        } ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                    />
                ))}

                {isOutOfStock && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center">
                        <span className="bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-gray-900 rounded-sm shadow-xl">
                            AGOTADO
                        </span>
                    </div>
                )}

                {/* Flechas de navegación (Aparecen al pasar el mouse en PC) */}
                {hasMultiple && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md opacity-0 transition-all duration-200 hover:bg-white hover:scale-110 group-hover:opacity-100 hidden sm:flex"
                            aria-label="Foto anterior"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md opacity-0 transition-all duration-200 hover:bg-white hover:scale-110 group-hover:opacity-100 hidden sm:flex"
                            aria-label="Siguiente foto"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* 2. CARRUSEL DE MINIATURAS (THUMBNAILS) */}
            {hasMultiple && (
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative h-20 w-20 shrink-0 snap-start rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                currentIndex === idx
                                    ? 'border-gray-900 opacity-100 scale-100' // Foto seleccionada
                                    : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105' // Efecto hover en no seleccionadas
                            }`}
                        >
                            <Image
                                src={img}
                                alt={`Miniatura ${idx + 1}`}
                                fill
                                className="object-cover object-center"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}