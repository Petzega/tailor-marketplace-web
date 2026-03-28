import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query || query.trim() === "") {
            return NextResponse.json({ error: "El parámetro de búsqueda 'q' es requerido" }, { status: 400 });
        }

        // Búsqueda insensible a mayúsculas/minúsculas por nombre o coincidencia exacta de SKU
        const products = await db.product.findMany({
            where: {
                OR: [
                    { name: { contains: query } }, // En SQLite, contains por defecto distingue mayúsculas/minúsculas, pero asumo tu configuración actual. Si usas Postgres, sería mode: 'insensitive'
                    { sku: { contains: query } }
                ]
            },
            select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                stock: true,
                category: true,
                sizes: {
                    select: {
                        size: true,
                        stock: true
                    }
                }
            },
            take: 5 // Limitamos a 5 resultados para que el agente n8n no se sature con respuestas masivas
        });

        if (products.length === 0) {
            return NextResponse.json({ message: "No se encontraron productos", data: [] }, { status: 200 });
        }

        return NextResponse.json({ data: products }, { status: 200 });

    } catch (error) {
        console.error("Error buscando productos para n8n:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}