// lib/db.ts
import { PrismaClient } from "@prisma/client";

// 1. Declaramos una variable global para TypeScript
declare global {
    var prisma: PrismaClient | undefined;
}

// 2. Creamos la instancia (o usamos la que ya existe)
export const db = globalThis.prisma || new PrismaClient();

// 3. Guardamos la instancia en la variable global solo si NO estamos en producción
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}