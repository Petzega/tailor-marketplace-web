"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AutoCarousel({ children }: { children: React.ReactNode }) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const scrollNext = () => {
        const carousel = carouselRef.current;
        const track = trackRef.current;
        if (!carousel || !track) return;

        const scrollAmount = carousel.offsetWidth;
        const snapPoint = track.offsetWidth;

        if (carousel.scrollLeft >= snapPoint) {
            carousel.scrollLeft = carousel.scrollLeft - snapPoint;
        }
        setTimeout(() => {
            carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }, 10);
    };

    const scrollPrev = () => {
        const carousel = carouselRef.current;
        const track = trackRef.current;
        if (!carousel || !track) return;

        const scrollAmount = carousel.offsetWidth;
        const snapPoint = track.offsetWidth;

        if (carousel.scrollLeft <= 0) {
            carousel.scrollLeft = snapPoint;
        }
        setTimeout(() => {
            carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }, 10);
    };

    useEffect(() => {
        if (isHovered) return;
        const intervalId = setInterval(scrollNext, 3000); // 👈 3 segundos
        return () => clearInterval(intervalId);
    }, [isHovered]);

    return (
        <div
            className="relative group/carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
        >
            <button
                onClick={scrollPrev}
                className="absolute left-2 top-[40%] -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 transition-all duration-300 hover:bg-white hover:scale-110 group-hover/carousel:opacity-100 disabled:opacity-0"
                aria-label="Anterior"
            >
                <ChevronLeft size={28} />
            </button>

            <button
                onClick={scrollNext}
                className="absolute right-2 top-[40%] -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 transition-all duration-300 hover:bg-white hover:scale-110 group-hover/carousel:opacity-100"
                aria-label="Siguiente"
            >
                <ChevronRight size={28} />
            </button>

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