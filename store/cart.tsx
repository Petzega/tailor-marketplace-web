import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SpotlightProduct } from '@/actions/search'; // Reutilizamos este tipo de dato

interface CartItem extends SpotlightProduct {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (product: SpotlightProduct) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            addItem: (product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                        isOpen: true,
                    });
                } else {
                    set({
                        items: [...currentItems, { ...product, quantity: 1 }],
                        isOpen: true
                    });
                }
            },

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
            name: 'tailor-cart-storage', // Guarda el carrito en el navegador (Local Storage)
        }
    )
);