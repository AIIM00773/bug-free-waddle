import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

export interface CartMetricsSummary {
    totalActiveCartsCount: number;
    grossIntentValueKes: number;
    averageCartSizeItems: number;
    globalAbandonmentRatePercent: number;
}

export interface HighIntentProduct {
    id: string;
    title: string;
    category: string;
    primaryMarketplace: string;
    activeCartCount: number;
    aggregatedValueKes: number;
    velocityTrend: 'surging' | 'stable' | 'fading';
}

export interface MissingIntentAlert {
    categoryKeyword: string;
    totalSearchTriggersCount: number;
    estimatedLostValueKes: number;
    lastTriggeredTimestamp: string;
}

interface CartAnalyticsContextType {
    summary: CartMetricsSummary | null;
    topItems: HighIntentProduct[];
    missingIntentAlerts: MissingIntentAlert[];
    isLoading: boolean;
    error: string | null;
    categoryFilter: string;
    setCategoryFilter: (category: string) => void;
    filteredTopItems: HighIntentProduct[];
    recalculateSessionPipelines: () => Promise<void>;
    dispatchTargetedScraperPipeline: (categoryKeyword: string) => Promise<void>;
}

const CartAnalyticsContext = createContext<CartAnalyticsContextType | undefined>(undefined);

export function CartAnalyticsProvider({ children }: { children: React.ReactNode }) {
    const [summary, setSummary] = useState<CartMetricsSummary | null>({
        totalActiveCartsCount: 1420,
        grossIntentValueKes: 2485000,
        averageCartSizeItems: 3.2,
        globalAbandonmentRatePercent: 68.4
    });

    const [topItems, setTopItems] = useState<HighIntentProduct[]>([]);

    
    const placeholder =[
        {
            id: "SKU-JM-7741",
            title: "Air Max Alpha Trainer 5 - Black/White",
            category: "Shoes / Gym Equipments",
            primaryMarketplace: "Jumia Kenya",
            activeCartCount: 184,
            aggregatedValueKes: 1140800,
            velocityTrend: "surging"
        },
        {
            id: "SKU-KM-9012",
            title: "Ergonomic Dumbbell Set 20KG",
            category: "Gym Equipments",
            primaryMarketplace: "Kilimall",
            activeCartCount: 92,
            aggregatedValueKes: 386400,
            velocityTrend: "surging"
        },
        {
            id: "SKU-JM-3304",
            title: "Ultraboost Light Running Shoes",
            category: "Shoes",
            primaryMarketplace: "Jumia Uganda",
            activeCartCount: 45,
            aggregatedValueKes: 322500,
            velocityTrend: "stable"
        }
    ] as HighIntentProduct[];




    useEffect(()=>{
        setTopItems(placeholder)
    },[])



    const [missingIntentAlerts, setMissingIntentAlerts] = useState<MissingIntentAlert[]>([
        {
            categoryKeyword: "High Tension Resistance Bands",
            totalSearchTriggersCount: 78,
            estimatedLostValueKes: 113100,
            lastTriggeredTimestamp: "12 mins ago"
        },
        {
            categoryKeyword: "Adjustable Bench Press Units",
            totalSearchTriggersCount: 52,
            estimatedLostValueKes: 624000,
            lastTriggeredTimestamp: "42 mins ago"
        },
        {
            categoryKeyword: "Trail Running Shoes Size 11",
            totalSearchTriggersCount: 31,
            estimatedLostValueKes: 263500,
            lastTriggeredTimestamp: "2 hours ago"
        }
    ]);


    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    
    // Memoized filter calculation processing to protect render cycles
    const filteredTopItems = useMemo(() => {
        return topItems.filter(item =>
            categoryFilter === 'all' || item.category.toLowerCase().includes(categoryFilter.toLowerCase())
        );
    }, [topItems, categoryFilter]);

    // Forces map-reduce execution aggregation over session databases
    const recalculateSessionPipelines = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Simulating a minor data change on live pipeline refresh
            setSummary({
                totalActiveCartsCount: 1432,
                grossIntentValueKes: 2512400,
                averageCartSizeItems: 3.3,
                globalAbandonmentRatePercent: 67.9
            });
        } catch (err) {
            setError("Failed to run pipeline map-reduce task over session metrics.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Dispatches on-demand scraper triggers for unmapped categories
    const dispatchTargetedScraperPipeline = useCallback(async (categoryKeyword: string) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            // Action point: call API endpoint to spawn worker spiders here

            // Optimistically remove the alert from dashboard state upon success
            setMissingIntentAlerts(prev => prev.filter(alert => alert.categoryKeyword !== categoryKeyword));
        } catch (err) {
            setError(`Failed to queue backend workers for tracking target token matching parameters.`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <CartAnalyticsContext.Provider value={{
            summary, topItems, missingIntentAlerts, isLoading, error,
            categoryFilter, setCategoryFilter, filteredTopItems,
            recalculateSessionPipelines, dispatchTargetedScraperPipeline
        }}>
            {children}
        </CartAnalyticsContext.Provider>
    );
}

export function useCartAnalytics() {
    const context = useContext(CartAnalyticsContext);
    if (!context) {
        throw new Error("useCartAnalytics must be initialized inside an active CartAnalyticsProvider node.");
    }
    return context;
}