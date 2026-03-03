"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

const formatLabel = (text: string | null | undefined) => {
    if (!text) return null;
    if (text === 'NINO') return 'Niño';
    if (text === 'NINA') return 'Niña';
    return text.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export function ProductCardGallery({ product, isOutOfStock }: { product: Product; isOutOfStock: boolean }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [product.imageUrl, ...(product.gallery?.map((g) => g.url) || [])].filter(Boolean);
    const hasMultiple = images.length > 1;

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const isService = product.category === 'SERVICE';

    return (
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200 block group/gallery">

            <Link href={`/product/${product.id}`} className="block w-full h-full relative overflow-hidden">

                {/* ETIQUETAS SUPERIORES */}
                <div className="absolute top-2 left-2 z-30 flex gap-2">
                    {isOutOfStock ? (
                        <div className="bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-sm shadow-sm">
                            AGOTADO
                        </div>
                    ) : (
                        <div className="bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 rounded-sm shadow-sm">
                            NUEVO
                        </div>
                    )}
                </div>

                {/* BADGES INFERIORES */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-30 flex gap-1.5 pointer-events-none h-1/4 items-end">
                    {product.gender && (
                        <Badge className="bg-white/95 text-blue-700 border-none text-[9px] font-extrabold py-0.5 px-2 shadow-sm uppercase">
                            {formatLabel(product.gender)}
                        </Badge>
                    )}
                    {product.clothingType && (
                        <Badge className="bg-white/95 text-purple-700 border-none text-[9px] font-bold py-0.5 px-2 shadow-sm uppercase">
                            {formatLabel(product.clothingType)}
                        </Badge>
                    )}
                    {isService && (
                        <Badge className="bg-green-500 text-white border-none text-[9px] font-bold py-0.5 px-2 shadow-sm uppercase">
                            SERVICIO
                        </Badge>
                    )}
                </div>

                {/* SLIDER DE IMÁGENES */}
                <div
                    className="flex w-full h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((imgSrc, idx) => (
                        <div key={idx} className="relative w-full h-full shrink-0">
                            <Image
                                src={imgSrc || "https://placehold.co/600x400?text=Sin+Imagen"}
                                alt={`${product.name} - Vista ${idx + 1}`}
                                fill
                                priority={idx === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className={`object-cover object-center group-hover/gallery:scale-105 transition-transform duration-700 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                            />
                        </div>
                    ))}
                </div>
            </Link>

            {/* CONTROLES DE LA GALERÍA (Flechas y Puntos) */}
            {hasMultiple && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-40 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md opacity-0 transition-all duration-200 hover:bg-white hover:scale-110 group-hover/gallery:opacity-100 hidden sm:flex"
                        aria-label="Foto anterior"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-40 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md opacity-0 transition-all duration-200 hover:bg-white hover:scale-110 group-hover/gallery:opacity-100 hidden sm:flex"
                        aria-label="Siguiente foto"
                    >
                        <ChevronRight size={16} />
                    </button>

                    {/* 👇 MEJORA 2 APLICADA: Subimos los puntitos (bottom-8) para que no toquen los badges */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5 z-40 pointer-events-none">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                className={`h-1.5 rounded-full shadow-sm transition-all duration-300 pointer-events-auto ${index === currentIndex ? "w-3 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                                }`}
                                aria-label={`Ver foto ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}