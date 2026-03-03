'use server'

import { db } from "@/lib/db";
import { Product } from "@/types";
import { revalidatePath } from "next/cache";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { Prisma } from "@prisma/client";

export type GetProductsResult = {
    products: Product[];
    total: number;
    totalPages: number;
};

async function generateSku(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const prefix = `${year}${month}${day}`;

    const lastProduct = await db.product.findFirst({
        where: { sku: { startsWith: prefix } },
        orderBy: { sku: 'desc' },
    });

    let sequence = 1;
    if (lastProduct) {
        const lastSequence = parseInt(lastProduct.sku.slice(-3), 10);
        if (!isNaN(lastSequence)) sequence = lastSequence + 1;
    }

    return `${prefix}${String(sequence).padStart(3, '0')}`;
}

export async function getProductStats() {
    try {
        const allProducts = await db.product.findMany({
            select: { price: true, stock: true, category: true },
        });

        return {
            total: allProducts.length,
            lowStockCount: allProducts.filter(
                (p) => p.stock < 5 && p.stock > 0 && p.category !== 'SERVICE'
            ).length,
            totalValue: allProducts.reduce((acc, p) => acc + p.price * p.stock, 0),
        };
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return { total: 0, lowStockCount: 0, totalValue: 0 };
    }
}

export async function getProducts(
    query?: string,
    category?: string,
    page: number = 1,
    minPrice?: number,
    maxPrice?: number,
    sort?: string,
    gender?: string,
    clothingType?: string
): Promise<GetProductsResult> {
    try {
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const andConditions: Prisma.ProductWhereInput[] = [];

        if (query) {
            andConditions.push({
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                    { sku: { contains: query } },
                ]
            });
        }

        if (category && category !== 'ALL') {
            andConditions.push({ category });
        }

        if (gender && gender !== 'ALL') {
            andConditions.push({ gender });
        }

        if (clothingType && clothingType !== 'ALL') {
            andConditions.push({ clothingType });
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            andConditions.push({
                price: {
                    ...(minPrice !== undefined ? { gte: minPrice } : {}),
                    ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
                }
            });
        }

        const whereClause: Prisma.ProductWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

        let orderByClause: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
        if (sort === 'price_asc') orderByClause = { price: 'asc' };
        if (sort === 'price_desc') orderByClause = { price: 'desc' };

        const [products, total] = await Promise.all([
            db.product.findMany({
                where: whereClause,
                orderBy: orderByClause,
                skip,
                take: ITEMS_PER_PAGE,
                include: { gallery: true }
            }),
            db.product.count({ where: whereClause }),
        ]);

        return {
            products: products as unknown as Product[],
            total,
            totalPages: Math.ceil(total / ITEMS_PER_PAGE),
        };
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

export async function getProductById(id: string) {
    try {
        return await db.product.findUnique({
            where: { id },
            include: { gallery: true }
        });
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        return null;
    }
}

export async function createProduct(formData: FormData) {
    const sku = await generateSku();
    const imageUrlText = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = imageUrlText;

    if (imageFile && imageFile.size > 0) {
        finalImageUrl = "https://placehold.co/600x400?text=Imagen+Subida";
    }

    const gender = formData.get("gender") as string;
    const clothingType = formData.get("clothingType") as string;

    await db.product.create({
        data: {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: parseFloat(formData.get("price") as string),
            stock: parseInt(formData.get("stock") as string),
            category: formData.get("category") as string,
            imageUrl: finalImageUrl || null,
            sku,
            gender: gender || null,
            clothingType: clothingType || null,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
    const imageUrlText = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl: string | undefined = undefined;

    if (imageFile && imageFile.size > 0) {
        finalImageUrl = "https://placehold.co/600x400?text=Nueva+Imagen+Update";
    } else if (imageUrlText && imageUrlText.trim() !== "") {
        finalImageUrl = imageUrlText;
    }

    const gender = formData.get("gender") as string;
    const clothingType = formData.get("clothingType") as string;

    try {
        await db.product.update({
            where: { id },
            data: {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                price: parseFloat(formData.get("price") as string),
                stock: parseInt(formData.get("stock") as string),
                category: formData.get("category") as string,
                imageUrl: finalImageUrl,
                gender: gender || null,
                clothingType: clothingType || null,
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

export async function deleteProduct(id: string) {
    try {
        await db.product.delete({ where: { id } });
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar:", error);
        return { success: false, error: "No se pudo eliminar el producto" };
    }
}