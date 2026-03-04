// types/index.ts

export type Category = 'READY_MADE' | 'SERVICE';

export interface ProductImage {
    id: string;
    url: string;
    productId: string;
    createdAt: Date;
}

// 👇 NUEVO: Interfaz para las variantes de talla
export interface ProductSize {
    id: string;
    size: string;
    stock: number;
    productId: string;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    category: string;
    imageUrl: string | null;
    createdAt: Date;
    sku: string;
    updatedAt: Date;

    gallery?: ProductImage[];
    sizes?: ProductSize[];

    gender?: string | null;
    clothingType?: string | null;
    ageGroup?: string | null; // 👈 NUEVO CAMPO AÑADIDO
}