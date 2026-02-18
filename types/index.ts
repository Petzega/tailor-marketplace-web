export type Category = 'READY_MADE' | 'SERVICE';

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
}