import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CustomerProfile {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    countryNode: 'KE' | 'UG' | 'TZ';
    status: 'active' | 'flagged' | 'suspended';
    joinedDate: string;
}

export interface CustomerActiveCartItem {
    id: string;
    title: string;
    marketplace: string;
    priceLocal: number;
    currency: string;
    isAvailableInCache: boolean;
}

export interface CustomerOrderHistory {
    id: string;
    itemTitle: string;
    totalCost: number;
    currency: string;
    status: 'verified_payout' | 'pending_network_callback' | 'disputed_by_partner' | 'conversion_failed';
    trackingToken: string;
    timestamp: string;
}

export interface CustomerDealAlert {
    keyword: string;
    category: string;
    frequency: string;
    isTriggered: boolean;
}

interface CustomerSupportContextType {
    customer: CustomerProfile | null;
    cartItems: CustomerActiveCartItem[];
    orders: CustomerOrderHistory[];
    alerts: CustomerDealAlert[];
    isLoading: boolean;
    error: string | null;
    lookupCustomerProfile: (query: string) => Promise<void>;
    freezeCustomerAccount: () => Promise<void>;
    dispatchWorkerScraperJob: (itemId: string) => Promise<void>;
    forceApproveOrderStatus: (orderId: string) => Promise<void>;
    appendCallIncidentMemo: (memo: string) => Promise<void>;
    clearActiveSession: () => void;
}

const CustomerSupportContext = createContext<CustomerSupportContextType | undefined>(undefined);

export function CustomerSupportProvider({ children }: { children: React.ReactNode }) {
    const [customer, setCustomer] = useState<CustomerProfile | null>(null);
    const [cartItems, setCartItems] = useState<CustomerActiveCartItem[]>([]);
    const [orders, setOrders] = useState<CustomerOrderHistory[]>([]);
    const [alerts, setAlerts] = useState<CustomerDealAlert[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearActiveSession = useCallback(() => {
        setCustomer(null);
        setCartItems([]);
        setOrders([]);
        setAlerts([]);
        setError(null);
    }, []);

    const lookupCustomerProfile = useCallback(async (query: string) => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            // Simulate backend routing gateway optimization delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            setCustomer({
                id: "USR-9912-KE",
                fullName: "John Kamau Mwangi",
                email: "kamau.j.mwangi@outlook.com",
                phone: "+254 712 345 678",
                countryNode: "KE",
                status: "active",
                joinedDate: "2026-01-14"
            });

            setCartItems([
                { id: "SKU-JM-7741", title: "Air Max Alpha Trainer 5 - Black/White", marketplace: "Jumia Kenya", priceLocal: 6200, currency: "KES", isAvailableInCache: true },
                { id: "SKU-KM-9012", title: "Ergonomic Dumbbell Set 20KG", marketplace: "Kilimall", priceLocal: 4200, currency: "KES", isAvailableInCache: false }
            ]);

            setOrders([
                { id: "ORD-2026-3391", itemTitle: "Resistance Band Multi-Pack High Tension", totalCost: 1450, currency: "KES", status: "pending_network_callback", trackingToken: "st_tok_774112_aff_kli", timestamp: "2026-06-10 08:45" },
                { id: "ORD-2026-0104", itemTitle: "Ultraboost Light Running Shoes", totalCost: 18500, currency: "KES", status: "verified_payout", trackingToken: "st_tok_110492_aff_jum", timestamp: "2026-05-18 14:22" }
            ]);

            setAlerts([
                { keyword: "Adjustable Bench Press Units", category: "Gym Equipments", frequency: "Immediate", isTriggered: true }
            ]);
        } catch (err) {
            setError("Database connection trace timed out. No customer profile could be verified.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const freezeCustomerAccount = useCallback(async () => {
        if (!customer) return;
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setCustomer(prev => prev ? { ...prev, status: 'suspended' } : null);
        } catch (err) {
            setError("Failed to execute IAM system lock down override command.");
        } finally {
            setIsLoading(false);
        }
    }, [customer]);

    const dispatchWorkerScraperJob = useCallback(async (itemId: string) => {
        setIsLoading(true);
        try {
            // Pushes task event to Celery redis pipeline
            await new Promise((resolve) => setTimeout(resolve, 400));
        } catch (err) {
            setError(`Failed to wake spider runtime context worker index target: ${itemId}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const forceApproveOrderStatus = useCallback(async (orderId: string) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'verified_payout' } : o));
        } catch (err) {
            setError("Affiliate database status record override operation failed.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const appendCallIncidentMemo = useCallback(async (memo: string) => {
        setIsLoading(true);
        try {
            console.log(memo);
            await new Promise((resolve) => setTimeout(resolve, 300));
            // Appends audit metadata pipeline log
        } catch (err) {
            setError("Failed to save session incident log parameters safely.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <CustomerSupportContext.Provider value={{
            customer, cartItems, orders, alerts, isLoading, error,
            lookupCustomerProfile, freezeCustomerAccount, dispatchWorkerScraperJob,
            forceApproveOrderStatus, appendCallIncidentMemo, clearActiveSession
        }}>
            {children}
        </CustomerSupportContext.Provider>
    );
}

export function useCustomerSupport() {
    const context = useContext(CustomerSupportContext);
    if (!context) {
        throw new Error("useCustomerSupport must be mounted inside an operational CustomerSupportProvider element hierarchy.");
    }
    return context;
}