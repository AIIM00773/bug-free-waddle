import { useState, createContext, useContext, useMemo, useCallback } from "react";
import { getHeaders,API_BASE_URL,MERCHANTS_API_ROUTES } from "./AuthProvider";

interface Inventory {
  id: string;
  name: string;
  // Add other properties relevant to your inventory object
}

interface InventoryContextType {
  branchInventories: Inventory[];
  activeInventory: Inventory | null;
  setActiveInventory: (inventory: Inventory | null) => void;
  fetchBranchInventories: (branch_id: string) => Promise<void>;
  inventoryFetchingError: string | null;
  inventoryLoading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryContextProvider({ children }: { children: React.ReactNode }) {
  const [branchInventories, setBranchInventories] = useState<Inventory[]>([]);
  const [activeInventory, setActiveInventory] = useState<Inventory | null>(null);
  const [inventoryFetchingError, setInventoryFetchingError] = useState<string | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  const fetchBranchInventories = useCallback(async (branch_id: string) => {
    setInventoryLoading(true);
    setInventoryFetchingError(null);

    try {
      // Note: Ensure your branch_id is utilized in the URL if required
      const response = await fetch(`${MERCHANTS_API_ROUTES.GETPROFILE}inventories/${branch_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`An error occurred fetching the inventories!!`);
      }

      const data = await response.json();
      setBranchInventories(data);
    } catch (error) {
      setInventoryFetchingError(
        "An  error occurred when fetching your invetotries "
      );
    } finally {
      setInventoryLoading(false);
    }
  }, []);


  // Memoize the value to prevent unnecessary re-renders of consumer components
  const value = useMemo(
    () => ({
      branchInventories,
      activeInventory,
      setActiveInventory,
      fetchBranchInventories,
      inventoryFetchingError,
      inventoryLoading,
    }),
    [
      branchInventories,
      activeInventory,
      fetchBranchInventories,
      inventoryFetchingError,
      inventoryLoading,
    ]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryContextProvider");
  }
  return context;
}
