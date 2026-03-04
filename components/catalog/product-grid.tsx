import { getProducts } from "@/actions/products";
import Link from "next/link";
import { PaginationControls } from "./pagination-controls";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { AutoCarousel } from "./auto-carousel";
import { Calendar } from "lucide-react";
import { Product } from "@/types";
import { ProductCardGallery } from "./product-card-gallery";
import { Badge } from "@/components/ui/badge";

interface ProductGridProps {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    gender?: string;
    clothingType?: string;
    products?: Product[];
    layout?: "grid" | "carousel";
}

// Función auxiliar para formatear los textos de los badges
const formatLabel = (text: string | null | undefined) => {
    if (!text) return null;
    if (text === 'NINO') return 'Niño';
    if (text === 'NINA') return 'Niña';
    return text.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export async function ProductGrid({
    query, category, minPrice, maxPrice, sort, page = 1, gender, clothingType,
    products: passedProducts, layout = "grid"
}: ProductGridProps) {

    let displayProducts = passedProducts;
    let totalPages = 0;

    if (!displayProducts) {
        const data = await getProducts(query, category, page, minPrice, maxPrice, sort, gender, clothingType);
        displayProducts = data.products;
        totalPages = data.totalPages;
    }

    if (displayProducts.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">
                    {query ? `No encontramos productos para "${query}"` : "No hay productos disponibles por el momento."}
                </p>
            </div>
        );
    }

    const isCarousel = layout === "carousel";

    const itemClasses = isCarousel
        ? "group relative flex flex-col h-full snap-start shrink-0 w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] outline-none transition-all duration-300 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 p-3 active:scale-[0.98]"
        : "group relative flex flex-col h-full transition-all duration-300 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 p-3 active:scale-[0.98]";

    const productCards = displayProducts.map((product) => {
        const isOutOfStock = product.stock === 0;
        const isService = product.category === 'SERVICE';

        const whatsappMessage = encodeURIComponent(`Hola, me interesa el ${isService ? 'servicio' : 'producto'}: ${product.name} (SKU: ${product.sku}). ¿Podrían darme más información?`);
        const whatsappLink = `https://wa.me/51992431513?text=${whatsappMessage}`;

        const productToDisplay: Product = isCarousel ? { ...product, gallery: [] } : product;

        return (
            <div key={product.id} className={itemClasses} tabIndex={0}>

                <ProductCardGallery product={productToDisplay} isOutOfStock={isOutOfStock} />

                <div className="flex flex-col flex-1 mt-3">

                    {/* 👇 AQUÍ MUDAMOS LOS BADGES: Ahora viven fuera de la imagen y le dan contexto al título */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {product.gender && (
                            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-[9px] font-extrabold py-0 px-2 shadow-none uppercase">
                                {formatLabel(product.gender)}
                            </Badge>
                        )}
                        {product.clothingType && (
                            <Badge className="bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-[9px] font-bold py-0 px-2 shadow-none uppercase">
                                {formatLabel(product.clothingType)}
                            </Badge>
                        )}
                        {isService && (
                            <Badge className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 text-[9px] font-bold py-0 px-2 shadow-none uppercase">
                                SERVICIO
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-col mb-3">
                        <Link href={`/product/${product.id}`} className="group/link block">
                            <h3 className="text-[15px] font-bold text-gray-900 line-clamp-2 min-h-[2.8rem] group-hover/link:text-green-600 transition-colors" title={product.name}>
                                {product.name}
                            </h3>
                        </Link>

                        <p className="mt-1 text-xs text-gray-500 line-clamp-1 min-h-[1rem]">
                            {product.description || "\u00A0"}
                        </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-black text-gray-900">
                                S/ {product.price.toFixed(2)}
                            </p>
                        </div>

                        <div className="w-full">
                            {isOutOfStock ? (
                                <button disabled className="w-full h-11 flex items-center justify-center gap-2 bg-gray-50 text-gray-400 font-medium rounded-lg text-sm cursor-not-allowed border border-gray-200">
                                    No disponible
                                </button>
                            ) : isService ? (
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full h-11 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg text-sm transition-colors shadow-sm active:scale-[0.98]">
                                    <Calendar size={18} /> Agendar Cita
                                </a>
                            ) : (
                                <Link
                                    href={`/product/${product.id}`}
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-black active:scale-[0.98]"
                                >
                                    Seleccionar Talla
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className="flex flex-col w-full h-full">
            {isCarousel ? (
                <AutoCarousel>
                    {productCards}
                </AutoCarousel>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-stretch">
                    {productCards}
                </div>
            )}
            {!isCarousel && totalPages > 1 && (
                <div className="mt-10 w-full flex justify-center pb-8">
                    <PaginationControls totalPages={totalPages} currentPage={page} />
                </div>
            )}
        </div>
    );
}