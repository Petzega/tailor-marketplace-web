import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/catalog/product-grid";
import { SearchFilters } from "@/components/search/search-filters";
import { MobileFilters } from "@/components/search/mobile-filters";
import { ProductGridSkeleton } from "@/components/catalog/product-grid-skeleton";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
        min?: string;
        max?: string;
        sort?: string;
        page?: string;
        // 👇 NUEVOS PARÁMETROS DE LA URL
        gender?: string;
        type?: string;
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

    // 👇 LEEMOS LOS NUEVOS PARÁMETROS
    const gender = params.gender || "";
    const clothingType = params.type || "";

    const filterProps = {
        currentQuery: query,
        currentCategory: category,
        currentSort: sort,
        currentMin: params.min || "",
        currentMax: params.max || "",
        // 👇 SE LOS PASAMOS A LOS FILTROS
        currentGender: gender,
        currentClothingType: clothingType
    };

    // 👇 AÑADIMOS LOS PARÁMETROS AL KEY DE SUSPENSE PARA QUE RECARGUE AL FILTRAR
    const suspenseKey = `${query}-${category}-${minPrice}-${maxPrice}-${sort}-${page}-${gender}-${clothingType}`;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col mb-8">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors w-fit">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Volver al inicio
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
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
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="hidden lg:block w-64 shrink-0">
                        <SearchFilters {...filterProps} />
                    </aside>

                    <section className="flex-1">
                        <Suspense key={suspenseKey} fallback={<ProductGridSkeleton />}>
                            <ProductGrid
                                query={query}
                                category={category}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                sort={sort}
                                page={page}
                                // 👇 PASAMOS LOS FILTROS A LA GRILLA DE PRODUCTOS
                                gender={gender}
                                clothingType={clothingType}
                            />
                        </Suspense>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}