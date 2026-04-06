'use server'

import { db } from "@/lib/db";
import { Product } from "@/types";
import { revalidatePath } from "next/cache";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { Prisma } from "@prisma/client";
import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// ============================================================================
// CONFIGURACIÓN Y UTILIDADES DE CLOUDINARY
// ============================================================================
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileUri, {
            folder: 'ame_studio_products',
            resource_type: 'image',
        }, (error, result) => {
            if (error || !result) reject(error);
            else resolve(result.secure_url);
        });
    });
}

// NUEVA FUNCIÓN: Destrucción de imágenes huérfanas
async function deleteFromCloudinary(imageUrl: string) {
    if (!imageUrl) return;
    try {
        const parts = imageUrl.split('/upload/');
        if (parts.length < 2) return;

        const pathWithVersion = parts[1];
        const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, '');
        const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.'));

        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log(`[Cloudinary] Imagen huérfana eliminada: ${publicId}`);
        }
    } catch (error) {
        console.error("[Cloudinary] Error al intentar eliminar la imagen antigua:", error);
    }
}

// ============================================================================
// ESQUEMAS DE VALIDACIÓN (ZOD)
// ============================================================================
const productSizeSchema = z.object({
    size: z.string().min(1),
    stock: z.coerce.number().int().nonnegative()
});

const productSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
    price: z.coerce.number().nonnegative("El precio no puede ser negativo"),
    // 👈 CORRECCIÓN AQUÍ: Evitamos que un string vacío rompa Zod
    stock: z.union([z.coerce.number().int().nonnegative(), z.string().transform(v => Number(v) || 0)]).default(0),
    category: z.string().min(1, "La categoría es requerida"),
    gender: z.string().nullable().optional(),
    clothingType: z.string().nullable().optional(),
    imageUrl: z.string().optional(),
    sizesData: z.string().optional(),
});

// ============================================================================
// MIDDLEWARE DE AUTENTICACIÓN ADMIN
// ============================================================================
async function requireAdminAuth() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Acceso denegado: Se requieren permisos de administrador.");
    }
    return userId;
}

// ============================================================================
// MÉTODOS PÚBLICOS (E-COMMERCE) - No requieren autenticación
// ============================================================================
export type GetProductsResult = {
    products: Product[];
    total: number;
    totalPages: number;
};

export async function getProducts(
    query?: string, category?: string, page: number = 1,
    minPrice?: number, maxPrice?: number, sort?: string,
    gender?: string, clothingType?: string
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
        if (category && category !== 'ALL') andConditions.push({ category });
        if (gender && gender !== 'ALL') andConditions.push({ gender });
        if (clothingType && clothingType !== 'ALL') andConditions.push({ clothingType });
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
                include: { gallery: true, sizes: true }
            }),
            db.product.count({ where: whereClause }),
        ]);

        return { products: products as unknown as Product[], total, totalPages: Math.ceil(total / ITEMS_PER_PAGE) };
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

export async function getProductById(id: string) {
    try {
        return await db.product.findUnique({
            where: { id },
            include: { gallery: true, sizes: true }
        });
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        return null;
    }
}

// ============================================================================
// MÉTODOS PRIVADOS (AME STUDIO OPS) - Requieren autenticación y validación
// ============================================================================
async function generateSku(category: string): Promise<string> {
    let typePrefix = category === 'SERVICE' ? 'SRV' : (category === 'READY_MADE' ? 'CLT' : 'PRD');
    const now = new Date(new Date().getTime() - 5 * 60 * 60 * 1000);
    const yy = String(now.getUTCFullYear()).slice(-2);
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const prefix = `${typePrefix}-${yy}${mm}${dd}`;

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
        await requireAdminAuth();

        const allProducts = await db.product.findMany({
            select: { price: true, stock: true, category: true },
        });

        return {
            total: allProducts.length,
            lowStockCount: allProducts.filter(p => p.stock < 5 && p.stock > 0 && p.category !== 'SERVICE').length,
            totalValue: allProducts.reduce((acc, p) => acc + p.price * p.stock, 0),
        };
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return { total: 0, lowStockCount: 0, totalValue: 0, error: "No autorizado" };
    }
}

export async function createProduct(formData: FormData) {
    try {
        await requireAdminAuth();

        const rawData = Object.fromEntries(formData.entries());
        const validation = productSchema.safeParse(rawData);

        if (!validation.success) {
            console.error("Zod Validation Error:", validation.error);
            return { success: false, error: "Datos de formulario inválidos." };
        }
        const data = validation.data;

        let validSizes: z.infer<typeof productSizeSchema>[] = [];
        if (data.sizesData) {
            try {
                const parsed = JSON.parse(data.sizesData);
                validSizes = z.array(productSizeSchema).parse(parsed).filter(s => s.size.trim() !== '');
            } catch (e) {
                return { success: false, error: "El formato de las tallas es inválido." };
            }
        }

        const calculatedStock = validSizes.length > 0
            ? validSizes.reduce((sum, s) => sum + s.stock, 0)
            : data.stock;

        const imageFile = formData.get("imageFile") as File | null;
        let finalImageUrl = data.imageUrl;

        if (imageFile && imageFile.size > 0) {
            try {
                finalImageUrl = await uploadToCloudinary(imageFile);
            } catch (error) {
                return { success: false, error: "Falló la subida de la imagen a Cloudinary." };
            }
        }

        const sku = await generateSku(data.category);

        await db.product.create({
            data: {
                name: data.name,
                description: data.description || null,
                price: data.price,
                stock: calculatedStock,
                category: data.category,
                imageUrl: finalImageUrl || null,
                sku,
                gender: data.gender || null,
                clothingType: data.clothingType || null,
                sizes: validSizes.length > 0 ? {
                    create: validSizes.map(s => ({ size: s.size.trim().toUpperCase(), stock: s.stock }))
                } : undefined
            },
        });

        revalidatePath("/");
        revalidatePath("/ame-studio-ops/inventory");
        return { success: true };
    } catch (error) {
        console.error("Error al crear producto:", error);
        return { success: false, error: "No se pudo crear el producto. Acceso denegado o error interno." };
    }
}

export async function updateProduct(id: string, formData: FormData) {
    try {
        await requireAdminAuth();

        if (!id) return { success: false, error: "ID de producto faltante." };

        // OBTENEMOS IMAGEN ACTUAL PARA BORRARLA LUEGO
        const existingProduct = await db.product.findUnique({ where: { id }, select: { imageUrl: true } });
        if (!existingProduct) return { success: false, error: "Producto no encontrado." };

        const rawData = Object.fromEntries(formData.entries());
        const validation = productSchema.safeParse(rawData);

        if (!validation.success) {
            console.error("Zod Validation Error:", validation.error.flatten());
            return { success: false, error: "Datos de formulario inválidos." };
        }
        const data = validation.data;

        let validSizes: z.infer<typeof productSizeSchema>[] = [];
        if (data.sizesData) {
            try {
                const parsed = JSON.parse(data.sizesData);
                validSizes = z.array(productSizeSchema).parse(parsed).filter(s => s.size.trim() !== '');
            } catch (e) {
                return { success: false, error: "El formato de las tallas es inválido." };
            }
        }

        const calculatedStock = validSizes.length > 0
            ? validSizes.reduce((sum, s) => sum + s.stock, 0)
            : data.stock;

        const imageFile = formData.get("imageFile") as File | null;
        let finalImageUrl: string | undefined = undefined;
        let shouldDeleteOldImage = false;

        if (imageFile && imageFile.size > 0) {
            try {
                finalImageUrl = await uploadToCloudinary(imageFile);
                shouldDeleteOldImage = true;
            } catch (error) {
                return { success: false, error: "Falló la subida de la nueva imagen." };
            }
        } else if (data.imageUrl && data.imageUrl.trim() !== "") {
            finalImageUrl = data.imageUrl;
        }

        await db.product.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description || null,
                price: data.price,
                stock: calculatedStock,
                category: data.category,
                ...(finalImageUrl !== undefined && { imageUrl: finalImageUrl }),
                gender: data.gender || null,
                clothingType: data.clothingType || null,
                sizes: {
                    deleteMany: {},
                    create: data.category !== 'SERVICE' && validSizes.length > 0 ? validSizes.map(s => ({
                        size: s.size.trim().toUpperCase(),
                        stock: s.stock
                    })) : []
                }
            },
        });

        // LIMPIEZA DE CLOUDINARY AUTOMÁTICA
        if (shouldDeleteOldImage && existingProduct.imageUrl) {
            await deleteFromCloudinary(existingProduct.imageUrl);
        }

        revalidatePath("/ame-studio-ops/inventory");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar:", error);
        return { success: false, error: "Error al actualizar el producto o falta de permisos." };
    }
}

export async function deleteProduct(id: string) {
    try {
        await requireAdminAuth();

        if (!id) return { success: false, error: "ID inválido" };

        const existingProduct = await db.product.findUnique({ where: { id }, select: { imageUrl: true } });

        await db.product.delete({ where: { id } });

        if (existingProduct?.imageUrl) {
            await deleteFromCloudinary(existingProduct.imageUrl);
        }

        revalidatePath("/ame-studio-ops");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar:", error);
        return { success: false, error: "No se pudo eliminar el producto o falta de permisos." };
    }
}