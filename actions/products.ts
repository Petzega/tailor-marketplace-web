'use server'

import { db } from "@/lib/db";
import { Product } from "@/types";
import { revalidatePath } from "next/cache";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { Prisma } from "@prisma/client";
// 👇 1. Importamos Cloudinary
import { v2 as cloudinary } from 'cloudinary';

// 👇 2. Configuramos las credenciales desde el .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 👇 3. Función auxiliar para subir el archivo (File) a Cloudinary
async function uploadToCloudinary(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    // Formato Data URI que Cloudinary entiende nativamente
    const fileUri = `data:${file.type};base64,${base64Data}`;

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileUri, {
            folder: 'ame_studio_products', // Carpeta para mantener tu dashboard ordenado
            resource_type: 'image',
        }, (error, result) => {
            if (error || !result) {
                reject(error);
            } else {
                resolve(result.secure_url);
            }
        });
    });
}

export type GetProductsResult = {
    products: Product[];
    total: number;
    totalPages: number;
};

// GENERADOR DE SKU MULTI-CATEGORÍA
async function generateSku(category: string): Promise<string> {
    let typePrefix = 'PRD';

    if (category === 'SERVICE') {
        typePrefix = 'SRV';
    } else if (category === 'READY_MADE') {
        typePrefix = 'CLT';
    }

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
                include: { gallery: true, sizes: true }
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
            include: { gallery: true, sizes: true }
        });
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        return null;
    }
}

export async function createProduct(formData: FormData) {
    const category = formData.get("category") as string;
    const sku = await generateSku(category);

    const imageUrlText = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = imageUrlText;

    // 👇 4. Subida real a Cloudinary en CREACIÓN
    if (imageFile && imageFile.size > 0) {
        try {
            finalImageUrl = await uploadToCloudinary(imageFile);
        } catch (error) {
            console.error("Error crítico subiendo a Cloudinary:", error);
            // Si falla, evitamos guardar basura y detenemos el proceso (opcional)
            throw new Error("Fallo la subida de la imagen");
        }
    }

    const gender = formData.get("gender") as string;
    const clothingType = formData.get("clothingType") as string;

    const sizesData = formData.get("sizesData") as string;
    let sizes: { size: string, stock: number }[] = [];
    try {
        if (sizesData) sizes = JSON.parse(sizesData);
    } catch(e) {
        console.error("Error al parsear tallas JSON", e);
    }

    const validSizes = sizes.filter(s => s.size.trim() !== '');

    // Calcular el stock real: Forzamos la conversión a Number
    const manualStock = parseInt(formData.get("stock") as string) || 0;
    const calculatedStock = validSizes.length > 0
        ? validSizes.reduce((sum, s) => sum + Number(s.stock), 0) // 👈 Convertimos a Number aquí
        : manualStock;

    await db.product.create({
        data: {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: parseFloat(formData.get("price") as string),
            stock: calculatedStock,
            category: category,
            imageUrl: finalImageUrl || null,
            sku,
            gender: gender || null,
            clothingType: clothingType || null,
            sizes: validSizes.length > 0 ? {
                create: validSizes.map(s => ({
                    size: s.size.trim().toUpperCase(),
                    stock: Number(s.stock) // 👈 Convertimos a Number aquí también
                }))
            } : undefined
        },
    });

    revalidatePath("/");
    revalidatePath("/ame-studio-ops/inventory");
    return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
    const imageUrlText = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl: string | undefined = undefined;

    // 👇 5. Subida real a Cloudinary en EDICIÓN
    if (imageFile && imageFile.size > 0) {
        try {
            finalImageUrl = await uploadToCloudinary(imageFile);
        } catch (error) {
            console.error("Error crítico subiendo a Cloudinary:", error);
            return { success: false, error: "Fallo la subida de la imagen" };
        }
    } else if (imageUrlText && imageUrlText.trim() !== "") {
        finalImageUrl = imageUrlText;
    }

    const gender = formData.get("gender") as string;
    const clothingType = formData.get("clothingType") as string;
    const category = formData.get("category") as string;

    const sizesData = formData.get("sizesData") as string;
    let sizes: { size: string, stock: number }[] = [];
    try {
        if (sizesData) sizes = JSON.parse(sizesData);
    } catch(e) {
        console.error("Error al parsear tallas JSON en update", e);
    }

    const validSizes = sizes.filter(s => s.size.trim() !== '');

    const manualStock = parseInt(formData.get("stock") as string) || 0;
    const calculatedStock = validSizes.length > 0
        ? validSizes.reduce((sum, s) => sum + Number(s.stock), 0)
        : manualStock;

    try {
        await db.product.update({
            where: { id },
            data: {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                price: parseFloat(formData.get("price") as string),
                stock: calculatedStock,
                category: category,
                // Solo se actualiza la imagen si se subió una nueva
                ...(finalImageUrl !== undefined && { imageUrl: finalImageUrl }),
                gender: gender || null,
                clothingType: clothingType || null,
                sizes: {
                    deleteMany: {},
                    create: category !== 'SERVICE' && validSizes.length > 0 ? validSizes.map(s => ({
                        size: s.size.trim().toUpperCase(),
                        stock: Number(s.stock)
                    })) : []
                }
            },
        });

        revalidatePath("/ame-studio-ops/inventory");
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
        revalidatePath("/ame-studio-ops");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar:", error);
        return { success: false, error: "No se pudo eliminar el producto" };
    }
}