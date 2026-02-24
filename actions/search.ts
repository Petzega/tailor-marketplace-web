'use server'

import { db } from "@/lib/db";

export type SpotlightProduct = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    imageUrl: string | null;
    category: string;
    sku: string;
};

export type SpotlightResult = {
    products: SpotlightProduct[];
    services: SpotlightProduct[];
};

export async function spotlightSearch(query: string): Promise<SpotlightResult> {
    if (!query || query.trim().length < 2) {
        return { products: [], services: [] };
    }

    try {
        const results = await db.product.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                    { sku: { contains: query } },
                ],
            },
            take: 8,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, name: true, description: true,
                price: true, stock: true, imageUrl: true,
                category: true, sku: true,
            },
        });

        return {
            products: results.filter(p => p.category !== 'SERVICE'),
            services: results.filter(p => p.category === 'SERVICE'),
        };
    } catch (error) {
        console.error("Error en spotlight search:", error);
        return { products: [], services: [] };
    }
}