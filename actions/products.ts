'use server'

import { db } from "@/lib/db";
import { Product } from "@/types";
import { revalidatePath } from "next/cache";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { Prisma } from "@prisma/client";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type GetProductsResult = {
    products: Product[];
    total: number;
    totalPages: number;
};

// ─── 1. GENERADOR DE SKU ──────────────────────────────────────────────────────
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

// ─── 2. ESTADÍSTICAS GLOBALES (para las tarjetas del admin) ──────────────────
// Siempre muestra el estado real del inventario, sin importar los filtros activos
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

// ─── 3. OBTENER PRODUCTOS (Con búsqueda, filtros y paginación) ────────────────
export async function getProducts(
    query?: string,
    category?: string,
    page: number = 1,
    minPrice?: number,
    maxPrice?: number,
    sort?: string,
    // 👇 NUEVOS PARÁMETROS AÑADIDOS
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

        if (minPrice !== undefined || maxPrice !== undefined) {
            andConditions.push({
                price: {
                    ...(minPrice !== undefined ? { gte: minPrice } : {}),
                    ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
                }
            });
        }

        // 👇 NUEVA LÓGICA DE FILTRADO
        if (gender) {
            andConditions.push({ gender });
        }

        if (clothingType) {
            andConditions.push({ clothingType });
        }

        const whereClause: Prisma.ProductWhereInput =
            andConditions.length > 0 ? { AND: andConditions } : {};

        let orderByClause: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
        if (sort === 'price_asc') orderByClause = { price: 'asc' };
        if (sort === 'price_desc') orderByClause = { price: 'desc' };

        const [products, total] = await Promise.all([
            db.product.findMany({
                where: whereClause,
                orderBy: orderByClause,
                skip,
                take: ITEMS_PER_PAGE,
                include: {
                    gallery: true
                }
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

// ─── 4. OBTENER PRODUCTO POR ID ───────────────────────────────────────────────
export async function getProductById(id: string) {
    try {
        return await db.product.findUnique({
            where: { id },
            // 👇 AQUÍ AGREGAMOS LA GALERÍA PARA LA VISTA DE DETALLE
            include: {
                gallery: true
            }
        });
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        return null;
    }
}

// ─── 5. CREAR PRODUCTO ────────────────────────────────────────────────────────
export async function createProduct(formData: FormData) {
    const sku = await generateSku();

    const imageUrlText = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = imageUrlText;

    if (imageFile && imageFile.size > 0) {
        console.log("Archivo recibido para crear:", imageFile.name);
        // TODO: Conectar Cloudinary aquí
        finalImageUrl = "https://placehold.co/600x400?text=Imagen+Subida";
    }

    await db.product.create({
        data: {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: parseFloat(formData.get("price") as string),
            stock: parseInt(formData.get("stock") as string),
            category: formData.get("category") as string,
            imageUrl: finalImageUrl || null,
            sku,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
}

// ─── 6. ACTUALIZAR PRODUCTO ───────────────────────────────────────────────────
export async function updateProduct(id: string, formData: FormData) {
    const imageUrlText = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl: string | undefined = undefined;

    if (imageFile && imageFile.size > 0) {
        finalImageUrl = "https://placehold.co/600x400?text=Nueva+Imagen+Update";
    } else if (imageUrlText && imageUrlText.trim() !== "") {
        finalImageUrl = imageUrlText;
    }

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

// ─── 7. ELIMINAR PRODUCTO ─────────────────────────────────────────────────────
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