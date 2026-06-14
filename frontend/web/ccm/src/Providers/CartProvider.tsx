import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Product } from '../Constants/productTypes';
import { EXTENSIVE_MOCK_DATABASE } from '../Constants/fakedb';

// ==========================================
// 1. TYPE DEFINITIONS
// ==========================================

export interface CartItem extends Product {
    quantity: number;
    addedAt: number;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    tax: number;
    total: number;
}

interface CartContextType extends CartState {
    addToCartById: (productId: string | number, quantity?: number) => { success: boolean; error?: string };
    removeFromCart: (productId: string | number) => void;
    updateQuantity: (productId: string | number, delta: number) => void;
    clearCart: () => void;
    isInCart: (productId: string | number) => boolean;
}



const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {


    // STATE & PERSISTENCE
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('soko_shopping_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });



    useEffect(() => {
        localStorage.setItem('soko_shopping_cart', JSON.stringify(items));
    }, [items]);


    // DERIVED CALCULATIONS (MEMOIZED)


    const totals = useMemo(() => {
        const subtotal = items.reduce((acc, item) => {
            // 1. If price is already a number, use it. Otherwise, clean and parse it.
            const numericPrice = typeof item.price === 'number'
                ? item.price
                : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;

            return acc + (numericPrice * item.quantity);
        }, 0);

        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
        const tax = subtotal * 0.16; // 16% VAT for Kenya

        return {
            subtotal,
            totalItems,
            tax,
            total: subtotal + tax
        };
    }, [items]);




    // ==========================================
    // 4. HANDLERS (MUTATORS)
    // ==========================================

    /**
     * Look up product details via database match using only ID and quantity parameters
     */
    const addToCartById = (productId: string | number, quantity: number = 1) => {
        // Find the product structural definitions in the database source
        const targetProduct = EXTENSIVE_MOCK_DATABASE.find(
            prod => String(prod.id) === String(productId)
        );

        if (!targetProduct) {
            console.error(`Product with ID ${productId} not found in database registry.`);
            return { success: false, error: 'Product not found.' };
        }

        setItems(currentItems => {
            const existingItem = currentItems.find(item => String(item.id) === String(productId));

            if (existingItem) {
                return currentItems.map(item =>
                    String(item.id) === String(productId)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // Append item from database match definitions payload cleanly
            return [...currentItems, { ...targetProduct, quantity, addedAt: Date.now() }];
        });

        return { success: true };
    };

    const removeFromCart = (productId: string | number) => {
        setItems(currentItems => currentItems.filter(item => String(item.id) !== String(productId)));
    };

    const updateQuantity = (productId: string | number, delta: number) => {
        setItems(currentItems => {
            return currentItems.map(item => {
                if (String(item.id) === String(productId)) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setItems([]);
    };

    const isInCart = (productId: string | number) => {
        return items.some(item => String(item.id) === String(productId));
    };

    return (
        <CartContext.Provider value={{
            items,
            ...totals,
            addToCartById,
            removeFromCart,
            updateQuantity,
            clearCart,
            isInCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider block.');
    }
    return context;
}