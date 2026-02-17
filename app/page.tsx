import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/layout/hero";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Footer } from "@/components/layout/footer";
import { CategoryTabs } from "@/components/catalog/CategoryTabs";

// 1. Definimos el tipo como una Promesa
interface HomeProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

// 2. Agregamos 'async' a la función
export default async function Home({ searchParams }: HomeProps) {

  // 3. ¡AQUÍ ESTÁ LA MAGIA! Esperamos a que la promesa se resuelva
  const params = await searchParams;

  // 4. Ahora sí leemos los valores de forma segura
  const query = params.q || "";
  const category = params.category || "";

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {query ? `Resultados para "${query}"` : "Latest Collection"}
            </h2>
            <span className="text-sm text-gray-500">Showing items</span>
          </div>

          <div className="mt-6 border-b border-gray-200 pb-5 mb-8">
            <CategoryTabs />
          </div>
        </div>

        {/* Pasamos los valores ya limpios a la grilla */}
        <ProductGrid query={query} category={category} />
      </div>

      <Footer />
    </main>
  );
}