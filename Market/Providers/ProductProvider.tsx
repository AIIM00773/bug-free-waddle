import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useConversation } from './ConversationProvider';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Made optional to prevent crashes if backend only sends one image
  category: string;
  merchantName?: string;
  stock?: number;
  rating?: number;
  isActive?: boolean;
}

interface ProductContextType {
  products: Product[];
  productsLoading: boolean;
  selectedProduct: Product | null;
  setSelectedProductById: (id: string | null) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { currentConversation } = useConversation();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // HARMONY: Sync products with the Active Conversation state
  useEffect(() => {
    if (!currentConversation) {
      setProducts([]); 
      return;
    }

    setLoading(true);

    try {
      /**
       * HARMONY FIX: 
       * Django sends 'agent_response' containing 'products'.
       * We flatMap to get every product mentioned in the entire chat thread.
       */
      const allItems = currentConversation.conversationHistory.flatMap(
        (historyItem) => historyItem.agent_response?.products || []
      );

      // Remove duplicates by ID (AI might repeat a top-seller in a follow-up)
      const uniqueProducts = Array.from(
        new Map(allItems.map(p => [String(p.id), p])).values()
      );

      setProducts(uniqueProducts);
    } catch (error) {
      console.error("Error parsing products from history:", error);
    } finally {
      setLoading(false);
    }
  }, [currentConversation]);

  /**
   * setSelectedProductById:
   * Finds the product in the local synced state.
   */
  const setSelectedProductById = useCallback((id: string | null) => {
    if (!id) {
      setSelectedProduct(null);
      return;
    }

    // Convert to string to ensure matching works regardless of type
    const found = products.find((p) => String(p.id) === String(id));
    if (found) {
      setSelectedProduct(found);
    }
  }, [products]);

  const value = {
    products,
    productsLoading: loading,
    selectedProduct,
    setSelectedProductById,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};