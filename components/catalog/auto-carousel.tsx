"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // 👈 1. Importamos los iconos de las flechas

export function AutoCarousel({ children }: { children: React.ReactNode }) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Función para avanzar
    const scrollNext = () => {
        const carousel = carouselRef.current;
        const track = trackRef.current;
        if (!carousel || !track) return;

        const scrollAmount = carousel.offsetWidth;
        const snapPoint = track.offsetWidth;

        // Si llegamos al final, saltamos al inicio de forma invisible
        if (carousel.scrollLeft >= snapPoint) {
            carousel.scrollLeft = carousel.scrollLeft - snapPoint;
        }

        // Un pequeño retraso para que el salto invisible ocurra antes del movimiento suave
        setTimeout(() => {
            carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }, 10);
    };

    // Función para retroceder
    const scrollPrev = () => {
        const carousel = carouselRef.current;
        const track = trackRef.current;
        if (!carousel || !track) return;

        const scrollAmount = carousel.offsetWidth;
        const snapPoint = track.offsetWidth;

        // Si estamos en el inicio y queremos retroceder, saltamos al clon final de forma invisible
        if (carousel.scrollLeft <= 0) {
            carousel.scrollLeft = snapPoint;
        }

        setTimeout(() => {
            carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }, 10);
    };

    // Temporizador automático
    useEffect(() => {
        if (isHovered) return; // Si el mouse está encima, pausamos el reloj

        const intervalId = setInterval(scrollNext, 8000);
        return () => clearInterval(intervalId);
    }, [isHovered]);

    return (
        // 1. Le damos un "apellido" al grupo: group/carousel
        <div
            className="relative group/carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
        >
            {/* 2. Actualizamos el hover del botón: group-hover/carousel */}
            <button
                onClick={scrollPrev}
                className="absolute left-2 top-[40%] -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 transition-all duration-300 hover:bg-white hover:scale-110 group-hover/carousel:opacity-100 disabled:opacity-0"
                aria-label="Ver productos anteriores"
            >
                <ChevronLeft size={28} />
            </button>

            {/* 3. Actualizamos el hover del otro botón: group-hover/carousel */}
            <button
                onClick={scrollNext}
                className="absolute right-2 top-[40%] -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 transition-all duration-300 hover:bg-white hover:scale-110 group-hover/carousel:opacity-100"
                aria-label="Ver siguientes productos"
            >
                <ChevronRight size={28} />
            </button>

            {/* Contenedor del Carrusel (Se queda igual) */}
            <div
                ref={carouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory pb-8 pt-2 focus:outline-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                tabIndex={0}
            >
                <div ref={trackRef} className="flex gap-6 shrink-0 pr-6">
                    {children}
                </div>
                <div className="flex gap-6 shrink-0 pr-6" aria-hidden="true">
                    {children}
                </div>
            </div>
        </div>
    );
}