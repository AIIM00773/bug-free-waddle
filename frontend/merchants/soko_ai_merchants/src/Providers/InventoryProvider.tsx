import React, { useState, createContext, useContext, useMemo, useCallback } from "react";
import { 
  getHeaders, 
  API_BASE_URL, 
  MERCHANTS_API_ROUTES, 
  MERCHANTS_PRODUCTS_API_ROUTES 
} from "./AuthProvider";

// Note: Ensure the 'Inventory' type is imported if it exists in another file.
// import { Inventory } from "./types"; 

interface InventoryContextType {
  inventory: any|null; 
  fetchInventory:() => Promise<void>;
  inventoryFetchingError: string | null;
  inventoryLoading: boolean;
  onboardNewItem: (newItem: any) => Promise<void>;
  productOnboardingError: string | null;
  productLoadingError: string | null;
  productOnboardingSuccess: string | null; 
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryContextProvider({ children }: { children: React.ReactNode }) {
  // State Management
  const [inventory, setInventory] = useState<any| null>(null);
  const [inventoryFetchingError, setInventoryFetchingError] = useState<string | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState<boolean>(false);
  
  // Cleaned up spelling and added explicit null types for initialization
  const [productOnboardingSuccess, setProductOnboardingSuccess] = useState<string | null>(null);
  const [productOnboardingError, setProductOnboardingError] = useState<string | null>(null);
  const [productLoadingError, setProductLoadingError] = useState<string | null>(null);

  // 1. Fetch Inventories
  const fetchInventory = useCallback(async () => {
    setInventoryLoading(true);
    setInventoryFetchingError(null);

    try {
      const response = await fetch(`${MERCHANTS_API_ROUTES.GETPROFILE}inventory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred fetching the inventory.");
      }

      const data = await response.json();
      setInventory(data.inventory);
    } catch (error) {
      console.error(error);
      setInventoryFetchingError("An error occurred when fetching your inventory .");
    } finally {
      setInventoryLoading(false);
    }
  }, []);







  // 2. Onboard New Item
  const onboardNewItem = useCallback(async (item: any) => {
    setProductOnboardingError(null);
    setProductOnboardingSuccess(null);
    setProductLoadingError(null);

    try {
      const formData = new FormData();

      Object.keys(item).forEach((key) => {
        if (key !== "productImages") {
          const value = item[key];
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value)); 
          } else {
            formData.append(key, ""); 
          }
        }
      });

      // Processing  image files  outside the loop
      if (item.productImages && Array.isArray(item.productImages)) {
        item.productImages.forEach((file: File) => {
          formData.append("productImages", file);
        });
      }

      // Dispatch payload
      const response = await fetch(`${MERCHANTS_PRODUCTS_API_ROUTES.ONBOARD}`, {
        method: "POST",
        headers: getHeaders(false), 
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server Error:", errorData);
        setProductOnboardingError(errorData?.message || "Failed to onboard product.");
        return;
      }

      // Added 'await' and 'const' to properly resolve the JSON promise
      const resp = await response.json();
      console.log("Product added successfully:", resp);
      
      setProductOnboardingSuccess("Product added successfully"); 
      setTimeout(()=>{
      setProductOnboardingSuccess(null); 
      },3500)

    } catch (err) {
      console.error("Form Submission Error:", err);
      setProductOnboardingError("A network or processing error occurred.");
    }
  }, []);





  // 3. Memoizing  Context Value
  const value = useMemo(
    () => ({ 
      inventory, 
      fetchInventory, 
      inventoryFetchingError, 
      inventoryLoading,
      onboardNewItem,
      productLoadingError,
      productOnboardingError,
      productOnboardingSuccess
    }),
    [ 
      inventory, 
      fetchInventory, 
      inventoryFetchingError, 
      inventoryLoading,
      onboardNewItem,
      productLoadingError,
      productOnboardingError,
      productOnboardingSuccess
    ]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

// Custom Hook
export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryContextProvider");
  }
  return context;
}
