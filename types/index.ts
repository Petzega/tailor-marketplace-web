export type Category = 'READY_MADE' | 'SERVICE';

// ¡Fíjate que diga EXPORT!
export interface Product {
    id: string;
    name: string;
    description: string | null; // Prisma a veces devuelve null, es bueno contemplarlo
    price: number;
    stock: number;
    imageUrl: string | null;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}