import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

// ==========================================
// --- TYPESCRIPT CORE DOMAIN INTERFACES ---
// ==========================================

export interface MerchantOwner {
    full_name: string;
    email: string;
    phone: string;
    continent: string | null;
    country: string | null;
    country_code: string | null;
    state: string | null;
    city: string | null;
    timezone_name: string | null;
    gender: string | null;
    date_of_birth: string | null;
    is_merchant: boolean;
    is_merchant_verified: boolean;
    is_banned: boolean;
    is_suspended: boolean;
    is_blocked: boolean;
    is_email_verified: boolean;
    is_phone_verified: boolean;
    onboarding_completed: boolean;
    created_at: string;
    age: number | null;
}

// Basic merchant summary payload from / (refreshMerchantData)
export interface MerchantSummary {
    unique_id: string;
    shopName: string;
    shopDescription: string;
    accountEmail: string;
    accountPhone: string;
    shopCategoryPersist: string;
    bussinessRegisted: boolean;
    commissionCutPercent: string; // Server returns this as a string numeric value
    isCommissionFree: boolean;
    verified: boolean;
    payoutMethod: string;
    verificationStatus: string;
    owner: MerchantOwner;
    createdAt: string;
}

export interface MerchantProfile {
    shopName: string;
    description: string;
    verificationStatus: string;
    email: string;
    is_verified: boolean;
    commissionCutPercent: number; // Detail view returns this as a raw number
    isCommissionFree: boolean;
    payoutMethod: string;
    createdAt: string;
    updatedAt: string;
}

export interface PayoutRoutes {
    mpesa: string | null;
    paybill: string | null;
    till: string | null;
    bank: string | null;
}

export interface Branch {
    name: string;
    city: string;
    isPrimary: boolean;
    [key: string]: any; // Allows fallback structures from your UI context
}

export interface CatalogSummaryItem {
    title: string;
    sku: string;
}

export interface CatalogSummary {
    total: number;
    items: CatalogSummaryItem[];
}

export interface RecentActivity {
    event: string;
    date: string;
    severity: string;
}

// Full detailed merchant from the /details endpoint
export interface MerchantDetails {
    unique_id: string; // Stored natively during fetch ingestion
    profile: MerchantProfile;
    payout_routes: PayoutRoutes;
    branches: Branch[];
    catalog_summary: CatalogSummary;
    recent_activity: RecentActivity[];
}

interface MerchantsContextType {
    merchants: MerchantSummary[];
    individualMerchant: MerchantDetails | null;
    isLoading: boolean;
    loadingIndividual: boolean;
    error: string | null;
    clearError: () => void;
    refreshMerchantData: () => Promise<void>;
    fetchIndividualMerchant: (unique_id: string) => Promise<void>;
    ActivateMerchantProfile: (id: string) => Promise<void>;
    DeactivateMerchantProfile: (id: string) => Promise<void>;
    removeVendorAccount: (id: string) => Promise<void>;
    resetActiveMerchant: () => void;
}

// ==========================================
// --- CONFIGURATION & UTILITIES ---
// ==========================================

const API_BASE_URL = (import.meta.env.NEXT_PUBLIC_API_URL as string)?.trim() || "http://localhost:8000/";
const BASE_MERCHANT_PATH = `${API_BASE_URL}adm/root/api/v1/8be4df6193ca11d2aa0d00e098032b8c/merchants`;

const MerchantsContext = createContext<MerchantsContextType | undefined>(undefined);

const getAuthHeaders = (): HeadersInit => {
    try {
        const rawTokens = sessionStorage.getItem("soko_ai_admin_token");
        const access = rawTokens ? JSON.parse(rawTokens)?.access : null;
        return {
            "Content-Type": "application/json",
            ...(access ? { Authorization: `Bearer ${access}` } : {})
        };
    } catch {
        return { "Content-Type": "application/json" };
    }
};

// ==========================================
// --- CONTEXT PROVIDER IMPLEMENTATION ---
// ==========================================

export function DirectMerchantsProvider({ children }: { children: React.ReactNode }) {
    const [merchants, setMerchants] = useState<MerchantSummary[]>([]);
    const [individualMerchant, setIndividualMerchant] = useState<MerchantDetails | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingIndividual, setLoadingIndividual] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    // Auto-Dismiss Errors Engine
    useEffect(() => {
        if (!error) return;
        const handle = setTimeout(() => setError(null), 4500);
        return () => clearTimeout(handle);
    }, [error]);

    // FETCH ALL VENDORS (Handles Array payload or object wrappers cleanly)
    const refreshMerchantData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_MERCHANT_PATH}/`, {
                method: "GET",
                headers: getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Server responded with status code ${response.status}`);
            }

            // Normalizes payload variance if the data is a direct raw array or deep under nested results keys
            if (Array.isArray(data)) {
                setMerchants(data);
            } else if (data && Array.isArray(data.results)) {
                setMerchants(data.results);
            } else {
                setMerchants([]);
            }
        } catch (err: any) {
            setError(err.message || "Failed to sync merchant system profiles registry database.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial background synchronization
    useEffect(() => {
        refreshMerchantData();
    }, [refreshMerchantData]);

    // FETCH INDIVIDUAL MERCHANT DETAILS DATA NODE
    const fetchIndividualMerchant = useCallback(async (unique_id: string) => {
        if (!unique_id?.trim()) {
            setError("Merchant identification code missing in the payload!");
            return;
        }

        setLoadingIndividual(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_MERCHANT_PATH}/details/?id=${unique_id}`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            const resp = await response.json();

            if (!response.ok) {
                throw new Error(resp.error || `Error Loading the Individual Merchant Profile (Status: ${response.status})`);
            }

            // Injects unique_id into state data object explicitly since it comes from the query string parameters context
            setIndividualMerchant({
                ...resp,
                unique_id: resp.unique_id || unique_id
            });
        } catch (err: any) {
            setError(err.message || "Network layout pipeline breakdown while seeking profile metrics.");
        } finally {
            setLoadingIndividual(false);
        }
    }, []);

    // TOGGLE VENDOR VERIFICATION STATUS (ACTIVATE)
    const ActivateMerchantProfile = useCallback(async (id: string) => {
        setError(null);
        try {
            const response = await fetch(`${BASE_MERCHANT_PATH}/activate/?id=${id}`, {
                method: "PATCH",
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to toggle vendor verification status.");
            }

            if (individualMerchant?.unique_id === id) {
                await fetchIndividualMerchant(id);
            }
            await refreshMerchantData();
        } catch (err: any) {
            setError(err.message || "Verification activation failed.");
        }
    }, [individualMerchant, fetchIndividualMerchant, refreshMerchantData]);

    // TOGGLE VENDOR VERIFICATION STATUS (DEACTIVATE)
    const DeactivateMerchantProfile = useCallback(async (id: string) => {
        setError(null);
        try {
            const response = await fetch(`${BASE_MERCHANT_PATH}/deactivate/?id=${id}`, {
                method: "PATCH",
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to toggle vendor verification status.");
            }

            if (individualMerchant?.unique_id === id) {
                await fetchIndividualMerchant(id);
            }
            await refreshMerchantData();
        } catch (err: any) {
            setError(err.message || "Verification deactivation failed.");
        }
    }, [individualMerchant, fetchIndividualMerchant, refreshMerchantData]);

    // DROP ACCOUNT DESTROY NODE (DELETE)
    const removeVendorAccount = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        const previousState = [...merchants];
        setMerchants(prev => prev.filter(m => m.unique_id !== id));

        try {
            const response = await fetch(`${BASE_MERCHANT_PATH}/update/delete/?id=${id}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Remote execution denied account drop process.");
            }

            if (individualMerchant?.unique_id === id) {
                setIndividualMerchant(null);
            }
        } catch (err: any) {
            setMerchants(previousState);
            setError(err.message || "Failed to remove vendor from system index data nodes.");
        } finally {
            setIsLoading(false);
        }
    }, [merchants, individualMerchant]);

    const resetActiveMerchant = useCallback(() => {
        setIndividualMerchant(null);
    }, []);

    const contextValue = useMemo(() => ({
        merchants,
        individualMerchant,
        isLoading,
        loadingIndividual,
        error,
        clearError,
        refreshMerchantData,
        fetchIndividualMerchant,
        ActivateMerchantProfile,
        DeactivateMerchantProfile,
        removeVendorAccount,
        resetActiveMerchant
    }), [
        merchants,
        individualMerchant,
        isLoading,
        loadingIndividual,
        error,
        clearError,
        refreshMerchantData,
        fetchIndividualMerchant,
        ActivateMerchantProfile,
        DeactivateMerchantProfile,
        removeVendorAccount,
        resetActiveMerchant
    ]);

    return (
        <MerchantsContext.Provider value={contextValue}>
            {children}
        </MerchantsContext.Provider>
    );
}

// ==========================================
// --- CUSTOM HOOK ---
// ==========================================

export function useDirectMerchants() {
    const context = useContext(MerchantsContext);
    if (!context) {
        throw new Error("useDirectMerchants must be executed within a DirectMerchantsProvider boundary tree.");
    }
    return context;
}