import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface Marketplace {
  unique_id: string | null;
  title: string;
  sku: string;
  base_url: string;
  base_search_url: string;
  categorised_search_url: string;
  region_boundary: string;
  currency: string;
  index_output: string;
  is_active: boolean;
  is_suspended: boolean;
  is_running: boolean;
  logo_url: string | null;
}

interface Markets {
  markets: Marketplace[];
  filteredMarkets: Marketplace[];
  isLoading: boolean;
  error: string | null;

  // Active mutation routines
  addNew: (newMarketplace: Marketplace) => Promise<void>;
  removeMarket: (market_sku: string) => Promise<void>;
  editMarket: (new_version: Marketplace) => Promise<void>;
  refreshMarkets: () => Promise<void>;

  // System status filter and search subroutines
  searchByTitle: (query: string) => void;
  byRegion: (region: string) => void;
  byActivity: (isActive: boolean) => void;
  bySuspensionState: (isSuspended: boolean) => void;
  byRunningState: (isRunning: boolean) => void;
  resetMarketFilters: () => void;
}

export const BASE_URL = "http://127.0.0.1:8000";

export const BASE_ROUTES = {
  BASE_ROUTE_GET: "/adm/root/api/v1/cd7bbe787516468fbd92b361b6be452f/markets/",  // GET and POST 
  BASE_ROUTE_UPDATE_DELETE: "/adm/root/api/v1/cd7bbe787516468fbd92b361b6be452f/markets/update/delete/",  //update/delete
  BASE_ROUTE_FILTER: "",
};

const MarketplaceContext = createContext<Markets | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<Marketplace[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Marketplace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch active merchant networks on instantiation
  useEffect(() => {
    refreshMarkets();
  }, []);

  // Fetch / Sync pipeline endpoints from Django nodes
  const refreshMarkets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rawTokens = sessionStorage.getItem("soko_ai_admin_token");
      const access = rawTokens ? JSON.parse(rawTokens)?.access : null;

      const response = await fetch(`${BASE_URL}${BASE_ROUTES.BASE_ROUTE_GET}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching markets from server.");
      }

      const resp = await response.json();
      setMarkets(resp.markets || []);
      setFilteredMarkets(resp.markets || []);
    } catch (err: any) {
      setError(err.message || "Failed to stream connection nodes layout from backend network hub.");
    } finally {
      setIsLoading(false);
    }
  };







  // Add a new merchant provider node registry block
  const addNew = async (newMarketplace: Marketplace) => {
    setIsLoading(true);
    try {

      const rawTokens = sessionStorage.getItem("soko_ai_admin_token");
      const access = rawTokens ? JSON.parse(rawTokens)?.access : null;

      const response = await fetch(`${BASE_URL}${BASE_ROUTES.BASE_ROUTE_GET}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
        body: JSON.stringify(newMarketplace)
      });

      if (!response.ok) {

        const error = await response.json()

        setError(error.error);
        return
      }
      setMarkets((prev) => {
        const next = [...prev, newMarketplace];
        setFilteredMarkets(next);
        return next;
      });

    } catch (err) {
      setError("Database mutation failure: Could not record current node configuration map.");
    } finally {
      setIsLoading(false);
    }
  };






  // Remove tracking node completely via structural identification index match
  const removeMarket = async (market_sku: string) => {
    setIsLoading(true);
    try {
      const rawTokens = sessionStorage.getItem("soko_ai_admin_token");
      const access = rawTokens ? JSON.parse(rawTokens)?.access : null;

      const response = await fetch(`${BASE_URL}${BASE_ROUTES.BASE_ROUTE_UPDATE_DELETE}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(access ? { Authorization: `Bearer ${access}` } : {})

        },
        body: JSON.stringify({ "sku": market_sku })
      });

      if (!response.ok) {
        const resp = await response.json();
        setError("Error deleting the marketplace : " + `${resp.error}`)
        return
      };


      setMarkets((prev) => {
        const next = prev.filter((m) => m.sku !== market_sku);
        setFilteredMarkets(next);
        return next;
      });
    } catch (err) {
      setError("Database execution tracking fault: Target node could not be dropped.");
    } finally {
      setIsLoading(false);
    }
  };












// Edit/Mutate an active marketplace record setup safely inline
const editMarket = async (new_version: Marketplace) => {
  setIsLoading(true);
  setError(null); 
  
  try {
    const rawTokens = sessionStorage.getItem("soko_ai_admin_token");
    const access = rawTokens ? JSON.parse(rawTokens)?.access : null;

    const response = await fetch(`${BASE_URL}${BASE_ROUTES.BASE_ROUTE_UPDATE_DELETE}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(access ? { Authorization: `Bearer ${access}` } : {})
      },
      body: JSON.stringify({"sku":new_version.sku, "is_suspended": !new_version.is_active  })
    });

    if (!response.ok) {
      const resp = await response.json();
      setError("Error while updating the marketplace: " + `${resp.error || response.statusText}`);
      return;
    }

    setMarkets((prev) => {
      const next = prev.map((m) => (m.sku === new_version.sku ? new_version : m));
      setFilteredMarkets(next);
      return next;
    });
  } catch (err) {
    setError("Database structural edit transaction block atomic write anomaly.");
  } finally {
    setIsLoading(false);
  }
};





  // Filter Subroutines (Normalized string parsing protects against case mismatch anomalies)
  // Note: These currently override each other. If you need stacked filtering (e.g., Active AND in a specific region), 
  // you will eventually want to transition to a single combined `applyFilters(criteria)` function.
  const searchByTitle = (query: string) => {
    if (!query.trim()) return setFilteredMarkets(markets);
    setFilteredMarkets(
      markets.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const byRegion = (region: string) => {
    if (!region || region.toLowerCase() === "all") return setFilteredMarkets(markets);
    setFilteredMarkets(
      markets.filter((m) => m.region_boundary.toLowerCase() === region.toLowerCase())
    );
  };

  const byActivity = (isActive: boolean) => {
    setFilteredMarkets(markets.filter((m) => m.is_active === isActive));
  };

  const bySuspensionState = (isSuspended: boolean) => {
    setFilteredMarkets(markets.filter((m) => m.is_suspended === isSuspended));
  };

  const byRunningState = (isRunning: boolean) => {
    setFilteredMarkets(markets.filter((m) => m.is_running === isRunning));
  };

  const resetMarketFilters = () => {
    setFilteredMarkets(markets);
  };

  const value: Markets = {
    markets,
    filteredMarkets,
    isLoading,
    error,
    addNew,
    removeMarket,
    editMarket,
    refreshMarkets,
    searchByTitle,
    byRegion,
    byActivity,
    bySuspensionState,
    byRunningState,
    resetMarketFilters,
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

// Consumer validation hook loop layer
export function useMarketplaces() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error(
      "useMarketplaces must be wrapped dynamically inside a valid MarketplaceProvider architecture frame structure boundary node loop."
    );
  }
  return context;
}