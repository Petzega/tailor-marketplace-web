'user-server'

import { db } from "@/lib/db"
import { Product } from "@types"

export async function getProducts() {
    try {
        const products = await db.product.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return products;
    } catch (error) {
        console.error("Error al obtener productos:", error)
        return [];
    }
}