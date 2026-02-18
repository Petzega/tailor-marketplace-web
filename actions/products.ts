'use server'

import { db } from "@/lib/db";
import { Product } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- NUEVA FUNCIÓN GENERADORA DE SKU ---
async function generateSku(): Promise<string> {
    // 1. Obtenemos la fecha actual (Año, Mes, Día)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // '02'
    const day = String(now.getDate()).padStart(2, '0');        // '18'

    // Prefijo ej: "20260218"
    const prefix = `${year}${month}${day}`;

    // 2. Buscamos el último producto creado HOY
    const lastProduct = await db.product.findFirst({
        where: {
            sku: {
                startsWith: prefix, // Que empiece con la fecha de hoy
            },
        },
        orderBy: {
            sku: 'desc', // El más alto primero
        },
    });

    // 3. Calculamos el correlativo
    let sequence = 1; // Por defecto es el 001

    if (lastProduct) {
        // El SKU anterior será tipo "20260218005"
        // Cortamos los últimos 3 dígitos ("005") y los convertimos a número
        const lastSequenceStr = lastProduct.sku.slice(-3);
        const lastSequence = parseInt(lastSequenceStr, 10);

        if (!isNaN(lastSequence)) {
            sequence = lastSequence + 1;
        }
    }

    // 4. Devolvemos el SKU final (ej: "20260218006")
    return `${prefix}${String(sequence).padStart(3, '0')}`;
}

// --- TUS FUNCIONES EXISTENTES ---

export async function getProducts(query?: string, category?: string): Promise<Product[]> {
    try {
        const products = await db.product.findMany({
            where: {
                AND: [
                    query ? {
                        OR: [
                            { name: { contains: query } },
                            { description: { contains: query } },
                            { sku: { contains: query } } // ¡Ahora también buscamos por SKU!
                        ]
                    } : {},
                    category && category !== 'ALL' ? {
                        category: category
                    } : {}
                ]
            },
            orderBy: { createdAt: 'desc' },
        });
        return products;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createProduct(formData: FormData) {

    // 1. Generamos el SKU automático justo antes de guardar
    const sku = await generateSku();

    // 2. Recogemos los datos (Igual que antes)
    const imageUrlText = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;
    let finalImageUrl = imageUrlText;

    if (imageFile && imageFile.size > 0) {
        console.log("Archivo recibido:", imageFile.name);
        // Placeholder temporal hasta que conectemos almacenamiento real
        finalImageUrl = "https://placehold.co/600x400?text=Imagen+Local";
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = formData.get("category") as string;

    // 3. Guardamos en la base de datos INCLUYENDO el SKU
    await db.product.create({
        data: {
            name,
            description,
            price,
            stock,
            category,
            imageUrl: finalImageUrl || null,
            sku: sku, // <--- AQUÍ ENVIAMOS EL SKU GENERADO
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
}