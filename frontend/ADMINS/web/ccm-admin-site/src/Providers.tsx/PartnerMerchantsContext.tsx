import React, { createContext, useContext, useState, useCallback } from 'react';

export interface InternalMerchantProfile {
    id: string;
    shopName: string;
    vendorOwner: string;
    accountEmail: string;
    commissionCutPercent: number;
    totalActiveListings: number;
    verificationStatus: 'verified' | 'pending_review' | 'suspended';
    payoutMethod: 'M-Pesa' | 'Bank Transfer' | 'Card Settlement';
}

interface MerchantsContextType {
    merchants: InternalMerchantProfile[];
    isLoading: boolean;
    error: string | null;
    refreshMerchantData: () => Promise<void>;
    onboardNewVendor: (newVendor: Omit<InternalMerchantProfile, 'totalActiveListings'>) => Promise<void>;
    updateMerchantDetails: (id: string, updatedFields: Partial<InternalMerchantProfile>) => Promise<void>;
    updatePlatformTakeRate: (id: string, newRate: number) => Promise<void>;
    toggleVendorVerification: (id: string, nextStatus: InternalMerchantProfile['verificationStatus']) => Promise<void>;
    removeVendorAccount: (id: string) => Promise<void>;
}

const SEED_INTERNAL_MERCHANTS: InternalMerchantProfile[] = [
    {
        id: "VN-NBO-091",
        shopName: "Nairobi Sneaker Syndicate",
        vendorOwner: "Mwangi K.",
        accountEmail: "info@sneakersyndicate.ke",
        commissionCutPercent: 7.5,
        totalActiveListings: 142,
        verificationStatus: "verified",
        payoutMethod: "M-Pesa"
    },
    {
        id: "VN-MSA-043",
        shopName: "Coast Wave Cosmetics",
        vendorOwner: "Fatma B.",
        accountEmail: "fatma.b@coastwave.co.ke",
        commissionCutPercent: 10.0,
        totalActiveListings: 89,
        verificationStatus: "verified",
        payoutMethod: "Bank Transfer"
    },
    {
        id: "VN-ELD-112",
        shopName: "Eldoret Tech & Spares",
        vendorOwner: "Kipchumba J.",
        accountEmail: "spares@eldotech.com",
        commissionCutPercent: 5.0,
        totalActiveListings: 234,
        verificationStatus: "pending_review",
        payoutMethod: "M-Pesa"
    }
];

const MerchantsContext = createContext<MerchantsContextType | undefined>(undefined);

export function DirectMerchantsProvider({ children }: { children: React.ReactNode }) {
    const [merchants, setMerchants] = useState<InternalMerchantProfile[]>(SEED_INTERNAL_MERCHANTS);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const refreshMerchantData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            setMerchants(prev => prev.map(m =>
                m.verificationStatus === 'verified'
                    ? { ...m, totalActiveListings: m.totalActiveListings + (Math.random() > 0.8 ? 1 : 0) }
                    : m
            ));
        } catch (err) {
            setError("Failed to refresh database. Connection timeout.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onboardNewVendor = useCallback(async (newVendor: Omit<InternalMerchantProfile, 'totalActiveListings'>) => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            let targetId = newVendor.id.toUpperCase().trim();
            if (!targetId) {
                targetId = `VN-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            }

            setMerchants((prev) => {
                if (prev.some(v => v.id === targetId)) {
                    throw new Error(`Merchant conflict: ID "${targetId}" is already mapped.`);
                }
                return [...prev, { ...newVendor, id: targetId, totalActiveListings: 0 }];
            });
        } catch (err: any) {
            setError(err.message || "Failed to onboard new vendor.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateMerchantDetails = useCallback(async (id: string, updatedFields: Partial<InternalMerchantProfile>) => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 400));
            setMerchants(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
        } catch (err) {
            setError("Failed to update merchant configuration.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updatePlatformTakeRate = useCallback(async (id: string, newRate: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const clampedRate = Math.min(Math.max(newRate, 0), 100);
            setMerchants(prev => prev.map(m => m.id === id ? { ...m, commissionCutPercent: clampedRate } : m));
        } catch (err) {
            setError("Failed to alter platform commission rates.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const toggleVendorVerification = useCallback(async (id: string, nextStatus: InternalMerchantProfile['verificationStatus']) => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setMerchants(prev => prev.map(m => m.id === id ? { ...m, verificationStatus: nextStatus } : m));
        } catch (err) {
            setError("Failed to alter vendor verification status workflow state.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const removeVendorAccount = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setMerchants(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            setError("Failed to remove vendor from registry registry database.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <MerchantsContext.Provider
            value={{
                merchants,
                isLoading,
                error,
                refreshMerchantData,
                onboardNewVendor,
                updateMerchantDetails,
                updatePlatformTakeRate,
                toggleVendorVerification,
                removeVendorAccount
            }}
        >
            {children}
        </MerchantsContext.Provider>
    );
}

export function useDirectMerchants() {
    const context = useContext(MerchantsContext);
    if (!context) {
        throw new Error("useDirectMerchants must be executed within a DirectMerchantsProvider boundary tree.");
    }
    return context;
}