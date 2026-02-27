import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/layout/hero";
import { ProductGrid } from "@/components/catalog/product-grid";
import { getProducts } from "@/actions/products";

export default async function Home() {
    const { products } = await getProducts();
    const featuredProducts = products.slice(0, 12);

    return (
        <main className="min-h-screen bg-white">
            <Hero />

            {/* SECCIÓN 1: Productos Destacados */}
            <section className="py-16 sm:py-20">
                {/* 👇 Aquí restauramos el padding para el margen izquierdo y derecho */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Nuevos Ingresos</h2>
                            <p className="mt-2 text-gray-500">Nuestra colección más reciente, lista para ti.</p>
                        </div>
                        <Link href="/search" className="hidden sm:flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
                            Ver catálogo completo <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="w-full relative">
                        <ProductGrid products={featuredProducts} layout="carousel" />
                    </div>

                    <div className="mt-10 flex justify-center sm:hidden">
                        <Link href="/search" className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-green-600 bg-white px-6 py-3 text-sm font-bold text-green-600 shadow-sm hover:bg-green-50 active:scale-95 transition-all">
                            Ver catálogo completo
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: Servicios a Medida */}
            <section className="bg-gray-50/50 py-16 sm:py-20 border-t border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 md:text-center max-w-2xl md:mx-auto">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Nuestros Servicios a Medida</h2>
                        <p className="mt-4 text-gray-500 text-lg">Más allá de la ropa lista para usar, ofrecemos artesanía pura. Desde un ajuste rápido hasta la creación de una prenda única.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="relative flex flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">✂️</div>
                            <h3 className="text-lg font-bold text-gray-900">Alteraciones</h3>
                            <p className="mt-3 text-sm text-gray-500 leading-relaxed">Ajustes de talla, bastas y entalles para un fit perfecto en tus prendas favoritas.</p>
                        </div>
                        <div className="relative flex flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl">🧵</div>
                            <h3 className="text-lg font-bold text-gray-900">Reparaciones</h3>
                            <p className="mt-3 text-sm text-gray-500 leading-relaxed">Cambio de cierres, botones y remiendos invisibles para darle nueva vida a tu ropa.</p>
                        </div>
                        <div className="relative flex flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-3xl">✨</div>
                            <h3 className="text-lg font-bold text-gray-900">Confección Custom</h3>
                            <p className="mt-3 text-sm text-gray-500 leading-relaxed">Trajes, camisas y vestidos diseñados y fabricados exclusivamente para tus medidas.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}