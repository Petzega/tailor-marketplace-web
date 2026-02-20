'use server'

import { db } from "@/lib/db";
import { Product } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- 1. FUNCIÓN GENERADORA DE SKU (Lógica Fecha + Correlativo) ---
async function generateSku(): Promise<string> {
    // A. Obtenemos fecha actual (Año, Mes, Día)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // Prefijo ej: "20260218"
    const prefix = `${year}${month}${day}`;

    // B. Buscamos el último producto creado HOY que tenga ese prefijo
    const lastProduct = await db.product.findFirst({
        where: {
            sku: {
                startsWith: prefix,
            },
        },
        orderBy: {
            sku: 'desc', // Ordenamos descendente para obtener el último
        },
    });

    // C. Calculamos el correlativo (Si existe el 005, toca el 006)
    let sequence = 1;

    if (lastProduct) {
        // Cortamos los últimos 3 dígitos del SKU anterior
        const lastSequenceStr = lastProduct.sku.slice(-3);
        const lastSequence = parseInt(lastSequenceStr, 10);

        if (!isNaN(lastSequence)) {
            sequence = lastSequence + 1;
        }
    }

    // D. Devolvemos el SKU final (ej: "20260218006")
    return `${prefix}${String(sequence).padStart(3, '0')}`;
}

// --- 2. OBTENER TODOS LOS PRODUCTOS (Con Filtros) ---
export async function getProducts(query?: string, category?: string): Promise<Product[]> {
    try {
        const products = await db.product.findMany({
            where: {
                AND: [
                    // Filtro de búsqueda (Nombre, Descripción o SKU)
                    query ? {
                        OR: [
                            { name: { contains: query } },
                            { description: { contains: query } },
                            { sku: { contains: query } }
                        ]
                    } : {},
                    // Filtro de Categoría
                    category && category !== 'ALL' ? {
                        category: category
                    } : {}
                ]
            },
            orderBy: { createdAt: 'desc' },
        });
        return products;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
}

// --- 3. OBTENER UN PRODUCTO POR ID (Para Edición) ---
export async function getProductById(id: string) {
    try {
        const product = await db.product.findUnique({
            where: { id },
        });
        return product;
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        return null;
    }
}

// --- 4. CREAR PRODUCTO (Usa generateSku) ---
export async function createProduct(formData: FormData) {

    // A. Generamos el SKU automático justo antes de guardar
    const sku = await generateSku();

    // B. Lógica de Imagen (Prioridad: Archivo > URL)
    const imageUrlText = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = imageUrlText;

    if (imageFile && imageFile.size > 0) {
        console.log("Archivo recibido para crear:", imageFile.name);
        // TODO: Conectar Cloudinary aquí
        finalImageUrl = "https://placehold.co/600x400?text=Imagen+Subida";
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = formData.get("category") as string;

    // C. Guardamos en la BD
    await db.product.create({
        data: {
            name,
            description,
            price,
            stock,
            category,
            imageUrl: finalImageUrl || null,
            sku: sku,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
}

// --- 5. ACTUALIZAR PRODUCTO ---
export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = formData.get("category") as string;

    // Lógica de Imagen para Update
    const imageUrlText = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;

    let finalImageUrl = undefined; // undefined significa "no tocar lo que ya existe"

    if (imageFile && imageFile.size > 0) {
        // Si suben archivo nuevo, reemplazamos
        finalImageUrl = "https://placehold.co/600x400?text=Nueva+Imagen+Update";
    } else if (imageUrlText && imageUrlText.trim() !== "") {
        // Si no hay archivo pero sí URL, usamos la URL
        finalImageUrl = imageUrlText;
    }

    try {
        await db.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                stock,
                category,
                imageUrl: finalImageUrl, // Si es undefined, Prisma no lo actualiza
            },
        });

        revalidatePath("/admin");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Error al actualizar:", error);
        return { success: false, error: "Error al actualizar el producto" };
    }
}

// --- 6. ELIMINAR PRODUCTO ---
export async function deleteProduct(id: string) {
    try {
        await db.product.delete({
            where: { id },
        });

        revalidatePath("/admin");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Error al eliminar:", error);
        return { success: false, error: "No se pudo eliminar el producto" };
    }
}