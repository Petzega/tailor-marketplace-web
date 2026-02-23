import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, ShieldCheck, Ruler, Clock, Sparkles } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { SpotlightProduct } from "@/actions/search";

// En Next.js 15, los params de las páginas dinámicas se tratan como una Promesa
interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    // 1. Obtenemos el ID de la URL
    const { id } = await params;

    // 2. Buscamos el producto en la BD
    const product = await getProductById(id);

    // 3. Si alguien escribe un ID que no existe, mostramos página 404
    if (!product) {
        notFound();
    }

    // Helpers visuales
    const isService = product.category === 'SERVICE';
    const isOutOfStock = product.stock === 0 && !isService;

    const cartProduct: SpotlightProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        category: product.category,
        sku: product.sku || '', // Por si el SKU está vacío en la BD
    };

    return (
        <div className="min-h-screen bg-white">
            {/* --- BREADCRUMB / NAVEGACIÓN --- */}
            <div className="border-b border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 text-sm font-medium">
                        <ArrowLeft size={16} /> Back to Catalog
                    </Link>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
            SKU: {product.sku}
          </span>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* COLUMNA IZQUIERDA: Imagen */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative group">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    {isService ? <Ruler size={64} className="opacity-20 mb-4" /> : <ShoppingBag size={64} className="opacity-20 mb-4" />}
                                    <p>No image available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Detalles del Producto */}
                    <div className="flex flex-col">

                        {/* Categoría y Título */}
                        <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${
                  isService ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
              }`}>
                {isService ? 'Tailoring Service' : 'Ready-to-wear'}
              </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                                {product.name}
                            </h1>
                        </div>

                        {/* Precio */}
                        <div className="mb-6 pb-6 border-b border-gray-100">
                            <p className="text-4xl font-bold text-gray-900">
                                <span className="text-2xl text-gray-400 font-medium mr-1">S/</span>
                                {product.price.toFixed(2)}
                            </p>
                            {isService && <p className="text-sm text-gray-500 mt-1">Base price. May vary depending on the garment.</p>}
                        </div>

                        {/* Descripción */}
                        <div className="mb-8 prose prose-sm text-gray-600">
                            <p className="leading-relaxed text-base">{product.description || 'No description provided for this item.'}</p>
                        </div>

                        {/* Estado del Stock (Solo para productos) */}
                        {!isService && (
                            <div className="mb-8 flex items-center gap-3">
                                <div className={`h-3 w-3 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                                <span className="text-sm font-medium text-gray-700">
                  {isOutOfStock ? 'Currently out of stock' : `${product.stock} items available ready to ship`}
                </span>
                            </div>
                        )}

                        {/* Botón de Acción Principal (Añadir al carrito) */}
                        <div className="mt-auto">
                            <AddToCartButton product={cartProduct} isOutOfStock={isOutOfStock} />
                        </div>

                        {/* Garantías / Trust Badges */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-gray-600">
                                <ShieldCheck className="text-green-500" size={24} />
                                <span className="text-sm font-medium">Secure Payments</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                {isService ? <Sparkles className="text-indigo-500" size={24} /> : <Clock className="text-blue-500" size={24} />}
                                <span className="text-sm font-medium">{isService ? 'Expert Tailors' : 'Fast Shipping'}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}