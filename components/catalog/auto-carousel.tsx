"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AutoCarousel({ children }: { children: React.ReactNode }) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const scrollNext = () => {
        const carousel = carouselRef.current;
        if (!carousel) return;
        const scrollAmount = carousel.offsetWidth;

        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10) {
            carousel.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const scrollPrev = () => {
        const carousel = carouselRef.current;
        if (!carousel) return;
        const scrollAmount = carousel.offsetWidth;

        if (carousel.scrollLeft <= 0) {
            carousel.scrollTo({ left: carousel.scrollWidth, behavior: "smooth" });
        } else {
            carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (isHovered) return;
        const intervalId = setInterval(scrollNext, 4000);
        return () => clearInterval(intervalId);
    }, [isHovered]);

    return (
        <div
            className="w-full relative group/carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
        >
            {/* FLECHA IZQUIERDA: Siempre visible en móvil, se esconde y sale al hover en PC */}
            <button
                onClick={scrollPrev}
                className="absolute left-2 sm:-left-5 top-[35%] -translate-y-1/2 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-gray-100 transition-all duration-300 hover:bg-white hover:scale-110 opacity-90 sm:opacity-0 sm:group-hover/carousel:opacity-100"
                aria-label="Anterior"
            >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* FLECHA DERECHA */}
            <button
                onClick={scrollNext}
                className="absolute right-2 sm:-right-5 top-[35%] -translate-y-1/2 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-gray-100 transition-all duration-300 hover:bg-white hover:scale-110 opacity-90 sm:opacity-0 sm:group-hover/carousel:opacity-100"
                aria-label="Siguiente"
            >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* 👇 El contenedor usa gap para separar las tarjetas limpiamente */}
            <div
                ref={carouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-8 pt-2 focus:outline-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
                tabIndex={0}
            >
                {children}
            </div>
        </div>
    );
}