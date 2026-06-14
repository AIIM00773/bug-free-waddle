import React, { createContext, useContext, useState, useCallback } from 'react';

export interface OrderRecord {
  id: string;
  userEmail: string;
  itemTitle: string;
  marketplaceOrigin: string;
  merchantRef: string;
  orderTotal: number;
  currency: string;
  affiliateStatus: 'verified_payout' | 'pending_network_callback' | 'disputed_by_partner' | 'conversion_failed';
  trackingToken: string; 
  timestamp: string;
  resolutionNotes?: string;
}

interface OrderRecordsContextType {
  orders: OrderRecord[];
  isLoading: boolean;
  error: string | null;
  syncOrderPipelines: () => Promise<void>;
  updateAffiliateStatus: (orderId: string, nextStatus: OrderRecord['affiliateStatus']) => Promise<void>;
  appendResolutionMemo: (orderId: string, memo: string) => Promise<void>;
}

const SEED_ORDER_LEDGERS: OrderRecord[] = [
  {
    id: "ORD-2026-8841",
    userEmail: "mwangi.dev@gmail.com",
    itemTitle: "Air Max Alpha Trainer 5 - Black/White",
    marketplaceOrigin: "Jumia Kenya",
    merchantRef: "MCH-JUM-OFF",
    orderTotal: 6200,
    currency: "KES",
    affiliateStatus: "verified_payout",
    trackingToken: "st_tok_991204_aff_ke",
    timestamp: "2026-06-10 09:12 EAT"
  },
  {
    id: "ORD-2026-3391",
    userEmail: "kamau.j@outlook.com",
    itemTitle: "Ergonomic Dumbbell Set 20KG",
    marketplaceOrigin: "Kilimall",
    merchantRef: "MCH-KLI-FIT",
    orderTotal: 4200,
    currency: "KES",
    affiliateStatus: "pending_network_callback",
    trackingToken: "st_tok_774112_aff_kli",
    timestamp: "2026-06-10 08:45 EAT"
  },
  {
    id: "ORD-2026-1102",
    userEmail: "atieno_fit@yahoo.com",
    itemTitle: "Ultraboost Light Running Shoes",
    marketplaceOrigin: "Jumia Uganda",
    merchantRef: "MCH-JUM-SPS",
    orderTotal: 215000,
    currency: "UGX",
    affiliateStatus: "disputed_by_partner",
    trackingToken: "st_tok_441092_aff_ug",
    timestamp: "2026-06-09 16:22 EAT",
    resolutionNotes: "Partner network flag: Cookie mismatch parameter detected at checkout conversion window."
  },
  {
    id: "ORD-2026-0941",
    userEmail: "omondi.fitness@gmail.com",
    itemTitle: "Resistance Band Multi-Pack High Tension",
    marketplaceOrigin: "Copia",
    merchantRef: "MCH-COP-GLB",
    orderTotal: 1450,
    currency: "KES",
    affiliateStatus: "conversion_failed",
    trackingToken: "st_tok_110293_aff_cop",
    timestamp: "2026-06-08 11:04 EAT",
    resolutionNotes: "User terminated external session before cart pixel firing trigger sequence completed."
  }
];

const OrderRecordsContext = createContext<OrderRecordsContextType | undefined>(undefined);

export function OrderRecordsProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<OrderRecord[]>(SEED_ORDER_LEDGERS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncOrderPipelines = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mimics full asynchronous database fetch from Jumia/Kilimall aggregator scrapers
      await new Promise((resolve) => setTimeout(resolve, 600));
      setOrders(prev => [...prev]);
    } catch (err) {
      setError("Failed to fetch fresh transaction records from the scraping processing nodes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAffiliateStatus = useCallback(async (orderId: string, nextStatus: OrderRecord['affiliateStatus']) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        affiliateStatus: nextStatus,
        resolutionNotes: `Manual admin intervention override applied to status at ${new Date().toISOString().split('T')[0]}.`
      } : o));
    } catch (err) {
      setError(`Critical Exception: Failed to modify pipeline state parameters for Order node ${orderId}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const appendResolutionMemo = useCallback(async (orderId: string, memo: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        resolutionNotes: memo.trim()
      } : o));
    } catch (err) {
      setError("Failed to log tracking anomaly resolution parameters.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <OrderRecordsContext.Provider
      value={{
        orders,
        isLoading,
        error,
        syncOrderPipelines,
        updateAffiliateStatus,
        appendResolutionMemo
      }}
    >
      {children}
    </OrderRecordsContext.Provider>
  );
}

export function useOrderRecords() {
  const context = useContext(OrderRecordsContext);
  if (!context) {
    throw new Error("useOrderRecords must be wrapped inside a valid OrderRecordsProvider element tree.");
  }
  return context;
}