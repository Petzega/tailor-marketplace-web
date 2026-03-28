"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AutoCarousel({ children }: { children: React.ReactNode }) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // 🧠 MAGIA MATEMÁTICA: Calculamos la distancia exacta en píxeles entre las tarjetas originales y sus clones
    const getShiftAmount = () => {
        const carousel = carouselRef.current;
        if (!carousel) return 0;

        const totalItems = carousel.children.length;
        if (totalItems < 2) return 0;

        const midpoint = Math.floor(totalItems / 2);
        const firstItem = carousel.children[0] as HTMLElement;
        const cloneItem = carousel.children[midpoint] as HTMLElement;

        if (firstItem && cloneItem) {
            return cloneItem.offsetLeft - firstItem.offsetLeft;
        }
        return 0;
    };

    const scrollNext = useCallback(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const scrollAmount = carousel.offsetWidth;
        const shift = getShiftAmount();

        // Si ya entramos a la zona de las tarjetas clonadas...
        if (shift > 0 && carousel.scrollLeft >= shift) {
            // 1. Truco de magia: Salto silencioso e invisible de regreso a las tarjetas originales
            carousel.scrollTo({ left: carousel.scrollLeft - shift, behavior: "auto" });

            // 2. Esperamos una fracción de segundo y hacemos el scroll suave
            setTimeout(() => {
                carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }, 10);
        } else {
            // Scroll normal
            carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    }, []);

    const scrollPrev = () => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const scrollAmount = carousel.offsetWidth;
        const shift = getShiftAmount();

        // Si estamos al principio y el usuario intenta ir hacia atrás...
        if (shift > 0 && carousel.scrollLeft <= 0) {
            // 1. Truco de magia: Salto silencioso hacia el final (zona clonada)
            carousel.scrollTo({ left: carousel.scrollLeft + shift, behavior: "auto" });

            // 2. Animamos hacia atrás suavemente
            setTimeout(() => {
                carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            }, 10);
        } else {
            // Scroll normal
            carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (isHovered) return;
        const intervalId = setInterval(scrollNext, 4000);
        return () => clearInterval(intervalId);
    }, [isHovered, scrollNext]);

    return (
        <div
            className="w-full relative group/carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
        >
            <button
                onClick={scrollPrev}
                className="absolute left-2 sm:-left-5 top-[35%] -translate-y-1/2 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-gray-100 transition-all duration-300 hover:bg-white hover:scale-110 opacity-90 sm:opacity-0 sm:group-hover/carousel:opacity-100"
                aria-label="Anterior"
            >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            <button
                onClick={scrollNext}
                className="absolute right-2 sm:-right-5 top-[35%] -translate-y-1/2 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-gray-100 transition-all duration-300 hover:bg-white hover:scale-110 opacity-90 sm:opacity-0 sm:group-hover/carousel:opacity-100"
                aria-label="Siguiente"
            >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Los estilos aquí siguen EXACTAMENTE iguales a como los dejaste */}
            <div
                ref={carouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-8 pt-2 focus:outline-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
                tabIndex={0}
            >
                {/* Renderizamos las tarjetas originales */}
                {children}

                {/* 👈 ESTE ES EL SECRETO: Volvemos a renderizar las mismas tarjetas justo al lado para crear el bucle infinito */}
                {children}
            </div>
        </div>
    );
}