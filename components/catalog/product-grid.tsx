// components/catalog/product-grid.tsx
import { getProducts } from "@/actions/products";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export async function ProductGrid() {
    // 1. Llamamos a la función que creamos en el paso 1
    const products = await getProducts();

    // 2. Si no hay productos, mostramos un aviso
    if (products.length === 0) {
        return <p className="text-center text-gray-500">No hay productos disponibles aún.</p>;
    }

    // 3. Pintamos la rejilla (Grid)
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 w-full bg-gray-100">
                        {/* Usamos un div gris si no hay imagen, o la imagen real si existe */}
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Sin foto
                            </div>
                        )}
                    </div>

                    <CardHeader className="p-4">
                        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                        <p className="text-sm text-gray-500">{product.category === 'SERVICE' ? 'Servicio' : 'Producto'}</p>
                    </CardHeader>

                    <CardContent className="p-4 pt-0">
                        <p className="font-bold text-xl text-green-600">
                            S/ {product.price.toFixed(2)}
                        </p>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                        <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
                            Ver en WhatsApp
                        </button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}