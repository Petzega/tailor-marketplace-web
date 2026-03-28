'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Scissors, MapPin } from "lucide-react";

const BACKGROUNDS = [
    {
        url: "https://images.pexels.com/photos/20609598/pexels-photo-20609598.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
        alt: "Vista de la ciudad de Iquitos"
    },
    {
        url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
        alt: "Moda y estilo en Iquitos"
    },
    {
        url: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop",
        alt: "Catálogo de prendas locales"
    }
];

export function Hero() {
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % BACKGROUNDS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gray-900">

            {BACKGROUNDS.map((bg, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBg ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Image
                        src={bg.url}
                        alt={bg.alt}
                        fill
                        sizes="100vw"
                        className="object-cover object-center transform scale-105"
                        priority={index === 0}
                    />
                </div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent z-10" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-12 pb-20">
                <div className="max-w-3xl animate-fade-in-up">

                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full font-medium text-sm mb-6 border border-green-400/30 backdrop-blur-sm">
                        <MapPin size={16} />
                        <span>Talento 100% de Iquitos, Loreto</span>
                    </div>

                    {/* 👇 TITULAR ACTUALIZADO */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-[1.1]">
                        Viste a tu medida con <br />
                        <span className="text-green-400">AME</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
                        Conectamos a las mejores marcas locales y sastres expertos contigo. Descubre prendas únicas listas para usar o diseña tu ropa a tu medida en un solo lugar.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/search?category=READY_MADE"
                            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/30 active:scale-95 group"
                        >
                            <ShoppingBag size={20} />
                            Ver Catálogo
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform ml-1" />
                        </Link>

                        <Link
                            href="/search?category=SERVICE"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 backdrop-blur-md px-8 py-4 rounded-xl text-base font-bold hover:bg-white/20 transition-all active:scale-95"
                        >
                            <Scissors size={20} />
                            Sastrería a Medida
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 mt-16">
                        {BACKGROUNDS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentBg(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentBg ? 'w-8 bg-green-400' : 'w-4 bg-white/40 hover:bg-white/60'
                                    }`}
                                aria-label={`Ir a la imagen ${index + 1}`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}