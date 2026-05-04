import React, { createContext, useContext } from 'react';
import { AIResponse } from './ConversationProvider';
import { useProducts } from './ProductProvider';

interface SearchContextType {
  searchByText: (query: string, filters?: any) => Promise<AIResponse>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const { products } = useProducts();

  const searchByText = async (query: string, filters?: any): Promise<AIResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple search logic
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase())
    );

    const responses = [
      `Based on your search for "${query}", I've found ${filteredProducts.length} options for you.`,
      `I've analyzed our catalog for "${query}" and found these matches.`,
    ];

    return {
      type: filteredProducts.length > 0 ? 'search_result' : 'error',
      content: {
        explanation: responses[Math.floor(Math.random() * responses.length)],
        products: filteredProducts,
        followupSurgestions: [
          { label: "Show more like this" },
          { label: "Filter by price" }
        ],
        confidenceScore: 0.95,
      },
      is_final: true,
      is_liked: false,
      is_disliked: false,
    };
  };

  return (
    <SearchContext.Provider value={{ searchByText }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};