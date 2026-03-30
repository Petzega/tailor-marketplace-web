import { getProductById } from "@/actions/products";
import { EditProductForm } from "@/components/admin/edit-product-form";
import { notFound } from "next/navigation";

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: EditPageProps) {
    // 1. Leemos el ID de la URL (ej: .../edit/20260218001)
    const { id } = await params;

    // 2. Buscamos los datos reales en la base de datos
    const product = await getProductById(id);

    // 3. Seguridad: Si el ID no existe, mandamos error 404
    if (!product) {
        notFound();
    }

    // 4. Si existe, le pasamos los datos al formulario para que los pinte
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <EditProductForm product={product} />
        </div>
    );
}