import  { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface Marketplace {
  title: string;
  sku: string;
  base_url: string;
  base_search_url: string;
  categoised_search_url: string; // Kept typo to match backend schema exactly

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

const MarketplaceContext = createContext<Markets | undefined>(undefined);

// Core infrastructure mock telemetry to seed data before backend connection links up
const baselineMarketsSeed: Marketplace[] = [
  {
    title: "Jumia Kenya",
    sku: "MKT-JM-KE-01",
    base_url: "https://www.jumia.co.ke",
    base_search_url: "https://www.jumia.co.ke/catalog/?q=",
    categoised_search_url: "https://www.jumia.co.ke/",
    region_boundary: "Kenya",
    currency: "KES",
    index_output: "soko_ai_backend.pipelines.JumiaKePipeline",
    is_active: true,
    is_suspended: false,
    is_running: false,
    logo_url: null
  },
  {
    title: "Kilimall",
    sku: "MKT-KM-KE-02",
    base_url: "https://www.kilimall.co.ke",
    base_search_url: "https://www.kilimall.co.ke/new/am_search?q=",
    categoised_search_url: "https://www.kilimall.co.ke/",
    region_boundary: "Kenya",
    currency: "KES",
    index_output: "soko_ai_backend.pipelines.KilimallPipeline",
    is_active: true,
    is_suspended: false,
    is_running: true,
    logo_url: null
  },
  {
    title: "Copia E-Commerce",
    sku: "MKT-CP-KE-03",
    base_url: "https://copia.co.ke",
    base_search_url: "https://copia.co.ke/?s=",
    categoised_search_url: "https://copia.co.ke/",
    region_boundary: "Kenya",
    currency: "KES",
    index_output: "soko_ai_backend.pipelines.CopiaPipeline",
    is_active: false,
    is_suspended: true,
    is_running: false,
    logo_url: null
  }
];

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<Marketplace[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Marketplace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch active scraped target frames on instantiation
  useEffect(() => {
    refreshMarkets();
  }, []);

  // Fetch / Sync pipeline endpoints from Django nodes
  const refreshMarkets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate remote network handshake execution payload
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMarkets(baselineMarketsSeed);
      setFilteredMarkets(baselineMarketsSeed);
    } catch (err) {
      setError("Failed to stream connection nodes layout from backend network hub.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new target marketplace scraper node registry block
  const addNew = async (newMarketplace: Marketplace) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
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
      await new Promise((resolve) => setTimeout(resolve, 400));
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
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
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
  const searchByTitle = (query: string) => {
    if (!query.trim()) return setFilteredMarkets(markets);
    setFilteredMarkets(
      markets.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const byRegion = (region: string) => {
    if (!region || region === "all") return setFilteredMarkets(markets);
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
    resetMarketFilters
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