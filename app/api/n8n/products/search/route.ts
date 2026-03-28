import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.trim();

        if (!query) {
            return NextResponse.json({ error: "El parámetro de búsqueda 'q' es requerido" }, { status: 400 });
        }

        // 1. Detección de Intención: Validamos si el texto parece un SKU (Prefijo + Guion + Datos)
        // Esto captura entradas como "CLT-", "CLT-2603", "CLT-260305009"
        const isSkuIntent = /^[A-Za-z]{3}-\d+/.test(query);

        if (isSkuIntent) {
            // 2. Ruta A: Búsqueda EXACTA por SKU
            const productsBySku = await db.product.findMany({
                where: { sku: query }, // Ya no usamos "contains". Exigimos coincidencia total.
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    stock: true,
                    category: true,
                    sizes: { select: { size: true, stock: true } }
                }
            });

            // Si detectamos formato de SKU pero no hay coincidencia exacta, rechazamos la petición.
            if (productsBySku.length === 0) {
                return NextResponse.json(
                    { error: "El SKU ingresado está incompleto o es inválido. Debe proporcionar el SKU completo (ej. CLT-260305009)." },
                    { status: 400 }
                );
            }

            return NextResponse.json({ data: productsBySku }, { status: 200 });
        }

        // 3. Ruta B: Búsqueda PARCIAL por Nombre (Si no tiene formato de SKU)
        const productsByName = await db.product.findMany({
            where: {
                name: { contains: query }
            },
            select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                stock: true,
                category: true,
                sizes: { select: { size: true, stock: true } }
            },
            take: 5
        });

        if (productsByName.length === 0) {
            return NextResponse.json({ message: "No se encontraron productos", data: [] }, { status: 200 });
        }

        return NextResponse.json({ data: productsByName }, { status: 200 });

    } catch (error) {
        console.error("Error buscando productos para n8n:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}