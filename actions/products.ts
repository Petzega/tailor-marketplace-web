'use server'

import { db } from "@/lib/db";
import { Product } from "@/types";

// Aceptamos un argumento "query" que puede ser string o undefined
export async function getProducts(query?: string, category?: string): Promise<Product[]> {
    try {
        const products = await db.product.findMany({
            where: {
                // Si hay query, buscamos por nombre O descripción
                ...(query ? {
                    OR: [
                        { name: { contains: query } },
                        { description: { contains: query } }
                    ]
                } : {}),

                // Si hay categoría y no es vacío, filtramos
                ...(category && category !== 'ALL' ? {
                    category: category
                } : {})
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return products;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
}