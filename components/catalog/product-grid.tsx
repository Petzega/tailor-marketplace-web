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

        const productWithGallery = product as any;
        const productToDisplay = isCarousel ? { ...productWithGallery, gallery: [] } : productWithGallery;

        return (
            <div key={product.id} className={itemClasses} tabIndex={0}>

                <div className="relative overflow-hidden rounded-xl">
                    <ProductCardGallery product={productToDisplay} isOutOfStock={isOutOfStock} />

                    <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10 flex gap-1.5 pointer-events-none h-1/4 items-end">
                        {product.gender && (
                            <Badge className="bg-white/95 text-gray-900 border-none text-[9px] font-extrabold py-0.5 px-2 shadow-sm">
                                {formatLabel(product.gender)}
                            </Badge>
                        )}
                        {product.clothingType && (
                            <Badge className="bg-white/95 text-gray-600 border-none text-[9px] font-bold py-0.5 px-2 shadow-sm">
                                {formatLabel(product.clothingType)}
                            </Badge>
                        )}
                        {isService && (
                            <Badge className="bg-green-500 text-white border-none text-[9px] font-bold py-0.5 px-2 shadow-sm">
                                SERVICIO
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex flex-col flex-1 mt-3">
                    <div className="flex flex-col mb-3">
                        <Link href={`/product/${product.id}`} className="group/link block">
                            <h3 className="text-[15px] font-bold text-gray-900 truncate group-hover/link:text-green-600 transition-colors" title={product.name}>
                                {product.name}
                            </h3>
                        </Link>

                        <p className="mt-1 text-xs text-gray-500 truncate">
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
                                <div className="grid grid-cols-[1fr_44px] gap-2 h-11">
                                    <AddToCartButton product={product} isOutOfStock={isOutOfStock} />
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex h-full w-full items-center justify-center rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                    </a>
                                </div>
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
                <AutoCarousel>{productCards}</AutoCarousel>
            ) : (
                // 👇 CAMBIO AQUÍ: Reducido al mínimo elegante para la grilla: gap-2 (8px)
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