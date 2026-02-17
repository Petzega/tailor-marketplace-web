import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/layout/hero";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Footer } from "@/components/layout/footer"; // 👈 Importamos

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20"> {/* Agregué padding-bottom aquí */}
        <div className="py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Latest Collection</h2>
            <span className="text-sm text-gray-500">Showing all items</span>
          </div>
          <div className="mt-6 border-b border-gray-200 pb-5 mb-8"></div>
        </div>

        <ProductGrid />
      </div>

      <Footer /> {/* 👈 Aquí va el Footer, fuera del div contenedor */}
    </main>
  );
}