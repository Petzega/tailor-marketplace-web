
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/catalog/product-grid";
import { SearchFilters } from "@/components/search/search-filters";

interface SearchPageProps {
    searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    // Resolvemos la promesa de los parámetros
    const params = await searchParams;
    const query = params.q || "";
    const category = params.category || "";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-b border-gray-200 pb-6 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {query ? `Resultados para "${query}"` : "Catálogo Completo"}
                    </h1>
                    <p className="mt-4 text-sm text-gray-500 md:mt-0">
                        Usa los filtros para refinar tu búsqueda
                    </p>
                </div>

                {/* Layout: Sidebar + Cuadrícula */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Panel Lateral de Filtros */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <SearchFilters currentQuery={query} currentCategory={category} />
                    </aside>

                    {/* Resultados de la búsqueda */}
                    <section className="flex-1">
                        <ProductGrid query={query} category={category} />
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}