import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from './ProductProvider';


/* --- TYPES --- */
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: string;
}


export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}



interface CartMetadata {
  size?: string;
  color?: string;
  quantity?: number;
}


interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  loading: boolean;
  error: string | null;
  addToCart: (product: Product, metadata?: CartMetadata) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
  getCartItemCount: () => number;
  prepareCheckout: () => Promise<{ items: CartItem[]; summary: CartSummary }>;
}



const CART_STORAGE_KEY = 'drop_cart_items';
const CartContext = createContext<CartContextType | undefined>(undefined);

/* PROVIDER*/
export function CartProvider({ children }: { children: React.ReactNode }) {

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (stored) setItems(JSON.parse(stored));
      } catch (err) {
        console.error('[CartProvider] Hydration Error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);




  //Persistence Layer
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loading]);



  // 3. Memoized Calculations
  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.16; // 16% VAT
    const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 300;
    const discount = 0;

    return {
      subtotal,
      tax,
      shipping,
      discount,
      total: subtotal + tax + shipping - discount,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
    };
  }, [items]);



  /* --- ACTIONS --- */

  const addToCart = async (product: Product, metadata: CartMetadata = {}) => {
    setError(null);
    const { size, color, quantity = 1 } = metadata;

    try {
      setItems((prev) => {
        // Check if item with same ID AND same variants exists
        const existingIndex = prev.findIndex(
          (item) =>  item.productId === product.id && item.selectedSize === size &&  item.selectedColor === color  );

        if (existingIndex !== -1) {
          const newItems = [...prev];
          const currentItem = newItems[existingIndex];
          const newQty = currentItem.quantity + quantity;

          newItems[existingIndex] = {...currentItem,  quantity: Math.min(newQty, product.stock), };
          return newItems;
        }


        // New Item
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          productId: product.id,
          product,
          quantity: Math.min(quantity, product.stock),
          selectedSize: size,
          selectedColor: color,
          addedAt: new Date().toISOString(),
        };
        return [...prev, newItem];
      });

    } catch (err) {
      setError('Failed to add item to cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, Math.min(quantity, item.product.stock)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = async (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = async () => {
    setItems([]);
  };

  /* --- UTILITIES --- */
  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  const getCartItemCount = useCallback(() => summary.itemCount, [summary.itemCount]);

  const prepareCheckout = async () => {
    const stockIssues = items.filter((item) => item.product.stock < item.quantity);
    if (stockIssues.length > 0) {
      const errorMsg = `${stockIssues[0].product.name} is no longer in stock.`;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    return { items, summary };
  };

  const value = {
    items,
    summary,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getCartItemCount,
    prepareCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};