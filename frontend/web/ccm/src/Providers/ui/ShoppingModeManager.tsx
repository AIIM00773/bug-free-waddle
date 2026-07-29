import React, { useState, createContext, useContext, useEffect } from 'react';

export type MarketModesType = 'AI mode' | 'catalog' | 'shops';

// 1. Matched the interface properties exactly to what is exported in the provider value
interface ShoppingModeContextType {
  ModeLoading: boolean;
  ShoppingMode: MarketModesType;
  setShoppingMode: React.Dispatch<React.SetStateAction<MarketModesType>>;
}

const ShoppingModeContext = createContext<ShoppingModeContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'active_shopping_mode';

const ShoppingModeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize loading as true so initial layout hydration/storage check is covered
  const [ModeLoading, setModeLoading] = useState<boolean>(true);

  // 2. Fixed state initialization: Removed setModeLoading() calls inside the synchronous 
  // initializer to avoid React warnings and guaranteed state resolution.
  const [ShoppingMode, setShoppingMode] = useState<MarketModesType>(() => {
    try {
      const savedMode = sessionStorage.getItem(STORAGE_KEY);
      if (
        savedMode === 'AI mode' ||
        savedMode === 'catalog' ||
        savedMode === 'shops'
      ) {
        return savedMode as MarketModesType;
      }
    } catch (error) {
      console.warn('Failed to read from sessionStorage:', error);
    }
    return 'AI mode';
  });

  // 3. Resolve the initial loading phase after the component mounts
  useEffect(() => {
    setModeLoading(false);
  }, []);

  // 4. Sync state changes to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, ShoppingMode);
    } catch (error) {
      console.warn('Failed to write to sessionStorage:', error);
    }
  }, [ShoppingMode]);

  return (
    <ShoppingModeContext.Provider
      value={{
        ShoppingMode,
        setShoppingMode,
        ModeLoading,
      }}
    >
      {children}
    </ShoppingModeContext.Provider>
  );
};

const useShoppingMode = (): ShoppingModeContextType => {
  const context = useContext(ShoppingModeContext);

  if (context === undefined) {
    throw new Error(
      'useShoppingMode must be used within a ShoppingModeProvider'
    );
  }

  return context;
};

export { ShoppingModeProvider, useShoppingMode };
