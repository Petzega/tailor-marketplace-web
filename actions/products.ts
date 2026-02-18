'use server'

import { db } from "@/lib/db";
import { Product } from "@/types"; // O import { Product } from "@prisma/client" si no usas types.ts
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Función para LEER productos (con filtros de búsqueda y categoría)
export async function getProducts(query?: string, category?: string): Promise<Product[]> {
    try {
        const products = await db.product.findMany({
            where: {
                AND: [
                    // Filtro por Texto (Nombre o Descripción)
                    query ? {
                        OR: [
                            { name: { contains: query } },
                            { description: { contains: query } }
                        ]
                    } : {},

                    // Filtro por Categoría (Ignora si es 'ALL' o está vacío)
                    category && category !== 'ALL' ? {
                        category: category
                    } : {}
                ]
            },
            orderBy: {
                createdAt: 'desc', // Los más nuevos primero
            },
        });
        return products;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
}

// 2. Función para CREAR un producto nuevo (Server Action)
export async function createProduct(formData: FormData) {

    // Extraemos los datos del formulario HTML
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = formData.get("category") as string;
    const imageUrl = formData.get("imageUrl") as string;

    // Guardamos en la base de datos
    await db.product.create({
        data: {
            name,
            description,
            price,
            stock,
            category,
            imageUrl: imageUrl || undefined, // Si viene vacío, lo guardamos como null
        },
    });

    // Actualizamos las cachés para que el producto aparezca al instante
    revalidatePath("/");      // Actualiza la Tienda Pública
    revalidatePath("/admin"); // Actualiza el Panel de Admin

    // Redirigimos al usuario de vuelta a la lista
    redirect("/admin");
}