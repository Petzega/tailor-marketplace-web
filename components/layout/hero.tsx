import Link from "next/link";
import { ArrowRight, Scissors } from "lucide-react";

export function Hero() {
    return (
        <div className="relative overflow-hidden bg-white border-b border-gray-100">
            {/* Imagen de fondo sutil (Opcional, usando Unsplash como placeholder) */}
            <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] pointer-events-none"
            />

            <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-32">
                <div className="mx-auto max-w-2xl text-center">

                    {/* Badge superior */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mb-8">
                        <Scissors size={14} />
                        <span>Crafting elegance since 2024</span>
                    </div>

                    {/* Título Principal */}
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        <span className="block">Custom Tailoring &</span>
                        <span className="block text-green-600 mt-2">Premium Fashion</span>
                    </h1>

                    {/* Subtítulo */}
                    <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600 leading-relaxed">
                        Discover our exclusive collection of ready-made garments and personalized alteration services for the perfect fit.
                    </p>

                    {/* Botones de Acción */}
                    <div className="mt-10 flex items-center justify-center gap-4 flex-col sm:flex-row">
                        <Link
                            href="/search"
                            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-all hover:scale-105 active:scale-95"
                        >
                            Explore Catalog
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="#services"
                            className="text-sm font-semibold leading-6 text-gray-900 hover:text-green-600 transition-colors py-3.5"
                        >
                            View Services <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}