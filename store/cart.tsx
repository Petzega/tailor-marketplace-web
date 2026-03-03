import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SpotlightProduct } from '@/actions/search';

// Ampliamos el CartItem para aceptar la talla
export interface CartItem extends SpotlightProduct {
    quantity: number;
    size?: string;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (product: SpotlightProduct, quantity?: number, size?: string) => void;
    removeItem: (productId: string, size?: string) => void;
    updateQuantity: (productId: string, quantity: number, size?: string) => void;
    clearCart: () => void;
}

export const useCart = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            addItem: (product, qty = 1, size) => set((state) => {
                // Comparamos por ID y Talla
                const existingItem = state.items.find((item) => item.id === product.id && item.size === size);
                if (existingItem) {
                    return {
                        items: state.items.map((item) =>
                            item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + qty } : item
                        )
                    };
                }
                return { items: [...state.items, { ...product, quantity: qty, size }] };
            }),

            removeItem: (productId, size) => set((state) => ({
                items: state.items.filter((item) => !(item.id === productId && item.size === size))
            })),

            updateQuantity: (productId, quantity, size) => set((state) => ({
                items: state.items.map((item) =>
                    item.id === productId && item.size === size ? { ...item, quantity: Math.max(1, quantity) } : item
                )
            })),

            clearCart: () => set({ items: [] }),
        }),
        { name: 'tailor-cart-storage' }
    )
);