'use server'

import { db } from "@/lib/db";
import { Product } from "@/types";

// 👇 AQUÍ ESTÁ EL CAMBIO (Opción B):
// Agregamos ": Promise<Product[]>" para garantizar que devuelve productos reales
export async function getProducts(): Promise<Product[]> {
    try {
        const products = await db.product.findMany({
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