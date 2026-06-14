


import React, { createContext, useContext, useState } from 'react';

export interface CurrencyRate {
    code: string;
    name: string;
    symbol: string;
    exchangeRateToKes: number;
    isBaseCurrency: boolean;
    precisionDigits: number;
    lastUpdatedSource: string;
}

interface CurrencyContextType {
    rates: CurrencyRate[];
    isLoading: boolean;
    error: string | null;
    triggerLiveRatesPoll: () => Promise<void>;
    addCurrencyNode: (newRate: CurrencyRate) => void;
    updateCurrencyMultiplier: (code: string, multiplier: number) => void;
}

const CurrencyLedgerContext = createContext<CurrencyContextType | undefined>(undefined);

const SEED_RATES: CurrencyRate[] = [
    {
        code: "KES",
        name: "Kenyan Shilling",
        symbol: "KSh",
        exchangeRateToKes: 1.0000,
        isBaseCurrency: true,
        precisionDigits: 0,
        lastUpdatedSource: "System Baseline Node"
    },
    {
        code: "UGX",
        name: "Ugandan Shilling",
        symbol: "USh",
        exchangeRateToKes: 0.0345,
        isBaseCurrency: false,
        precisionDigits: 0,
        lastUpdatedSource: "Central Bank of Kenya API"
    },
    {
        code: "TZS",
        name: "Tanzanian Shilling",
        symbol: "TSh",
        exchangeRateToKes: 0.0481,
        isBaseCurrency: false,
        precisionDigits: 0,
        lastUpdatedSource: "Central Bank of Kenya API"
    },
    {
        code: "USD",
        name: "United States Dollar",
        symbol: "$",
        exchangeRateToKes: 131.2500,
        isBaseCurrency: false,
        precisionDigits: 2,
        lastUpdatedSource: "OpenExchangeRates Live Feed"
    }
];

export function CurrencyLedgerProvider({ children }: { children: React.ReactNode }) {
    const [rates, setRates] = useState<CurrencyRate[]>(SEED_RATES);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const triggerLiveRatesPoll = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Mimicking real network transit delay
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setRates((prevRates) =>
                prevRates.map((rate) => {
                    if (rate.isBaseCurrency) return rate;
                    // Add minor simulated fluctuation parameter adjustments to represent dynamic API feeds
                    const jitter = 1 + (Math.random() * 0.02 - 0.01);
                    return {
                        ...rate,
                        exchangeRateToKes: Number((rate.exchangeRateToKes * jitter).toFixed(4)),
                        lastUpdatedSource: `${rate.lastUpdatedSource.split(' (')[0]} (Synced Live)`
                    };
                })
            );
        } catch (err) {
            setError("Upstream financial gateway timeout. Failed to track active regional multipliers.");
        } finally {
            setIsLoading(false);
        }
    };

    const addCurrencyNode = (newRate: CurrencyRate) => {
        setRates((prev) => {
            if (prev.some((r) => r.code.toUpperCase() === newRate.code.toUpperCase())) {
                setError(`Data Integrity Error: Token entity node "${newRate.code}" already allocated.`);
                return prev;
            }
            return [...prev, { ...newRate, code: newRate.code.toUpperCase() }];
        });
    };

    const updateCurrencyMultiplier = (code: string, multiplier: number) => {
        setRates((prev) =>
            prev.map((r) =>
                r.code === code
                    ? { ...r, exchangeRateToKes: multiplier, lastUpdatedSource: "Manual System Overrides Node" }
                    : r
            )
        );
    };

    return (
        <CurrencyLedgerContext.Provider
            value={{
                rates,
                isLoading,
                error,
                triggerLiveRatesPoll,
                addCurrencyNode,
                updateCurrencyMultiplier,
            }}
        >
            {children}
        </CurrencyLedgerContext.Provider>
    );
}

export function useCurrencyLedger() {
    const context = useContext(CurrencyLedgerContext);
    if (!context) {
        throw new Error("useCurrencyLedger must be wrapper managed inside a CurrencyLedgerProvider boundary.");
    }
    return context;
}