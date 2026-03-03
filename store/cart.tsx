import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SpotlightProduct } from '@/actions/search';

interface CartItem extends SpotlightProduct {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    // 👇 Modificado para aceptar una cantidad opcional
    addItem: (product: SpotlightProduct, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCart = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            // 👇 Ahora acepta "qty" y lo suma a lo que ya tenías
            addItem: (product, qty = 1) => set((state) => {
                const existingItem = state.items.find((item) => item.id === product.id);
                if (existingItem) {
                    return {
                        items: state.items.map((item) =>
                            item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
                        )
                    };
                }
                return {
                    items: [...state.items, { ...product, quantity: qty }]
                };
            }),

            removeItem: (productId) => set((state) => ({
                items: state.items.filter((item) => item.id !== productId)
            })),

            updateQuantity: (productId, quantity) => set((state) => ({
                items: state.items.map((item) =>
                    item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                )
            })),

            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'tailor-cart-storage',
        }
    )
);