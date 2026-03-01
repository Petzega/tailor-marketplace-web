import { Suspense } from "react";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/catalog/product-grid";
import { SearchFilters } from "@/components/search/search-filters";
import { MobileFilters } from "@/components/search/mobile-filters";
import { Spinner } from "@/components/ui/spinner"; // 👈 Importamos nuestro loader estándar

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
        min?: string;
        max?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;

    const query = params.q || "";
    const category = params.category || "";
    const sort = params.sort || "";
    const minPrice = params.min ? Number(params.min) : undefined;
    const maxPrice = params.max ? Number(params.max) : undefined;
    const page = params.page ? parseInt(params.page) : 1;

    const filterProps = {
        currentQuery: query,
        currentCategory: category,
        currentSort: sort,
        currentMin: params.min || "",
        currentMax: params.max || ""
    };

    const suspenseKey = `${query}-${category}-${minPrice}-${maxPrice}-${sort}-${page}`;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            {query ? `Resultados para "${query}"` : "Catálogo Completo"}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Usa los filtros para refinar tu búsqueda
                        </p>
                    </div>

                    <div className="lg:hidden mt-2">
                        <MobileFilters {...filterProps} />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="hidden lg:block w-64 shrink-0">
                        <SearchFilters {...filterProps} />
                    </aside>

                    <section className="flex-1">
                        {/* 👇 Usamos nuestro Spinner estándar en lugar del Skeleton */}
                        <Suspense key={suspenseKey} fallback={
                            <div className="py-20 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center">
                                <Spinner text="Buscando productos..." />
                            </div>
                        }>
                            <ProductGrid
                                query={query}
                                category={category}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                sort={sort}
                                page={page}
                            />
                        </Suspense>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}