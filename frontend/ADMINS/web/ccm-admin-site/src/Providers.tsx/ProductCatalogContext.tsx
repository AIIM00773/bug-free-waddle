import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export interface Product {
    title: string;
    sku: string;
    description: string;
    category: string | null;
    brand: string | null;
    merchant: string | null;
    marketplace: string | null;
    prevPrice: number | null;
    currentPrice: number;
    currency: string | null;
    inStock: boolean;
}

interface Catalog {
    products: Product[];
    isLoading: boolean;
    error: string | null;


    // Search and Filter Functions
    searchByTitle: (title: string) => void;
    searchBySku: (sku: string) => void;
    searchByDescription: (desc: string) => void;
    filterByCategory: (category: string | null) => void;
    filterByBrand: (brand: string | null) => void;
    filterByPriceRange: (min: number, max: number) => void;
    filterByInStock: () => void;
    filterByOutOfStock: () => void;
    resetFilters: () => void;

    // Mutation Routines
    addToCatalog: (newProduct: Product) => Promise<void>;
    removeFromCatalog: (productSku: string) => Promise<void>;
    updateProduct: (updatedProduct: Product) => Promise<void>;
    getCatalog: () => Promise<void>;
}

const CatalogContext = createContext<Catalog | undefined>(undefined);

// Initial placeholder mock data to prevent UI from breaking during initialization
const initialMockCatalog: Product[] = [
    {
        title: "Enterprise AI Gateway Node",
        sku: "SKU-SOKO-AI-01",
        description: "High-performance processing hub for secure telemetry streaming ingestion routing.",
        category: "Infrastructure",
        brand: "Soko Core",
        merchant: "Alpha Nexus",
        marketplace: "Global Node",
        prevPrice: 1200,
        currentPrice: 950,
        currency: "USD",
        inStock: true
    },
    {
        title: "Quantum Ledger Storage Core",
        sku: "SKU-SOKO-QLS-02",
        description: "Cryptographically bound ledger array for transactional ledger currency accounting.",
        category: "Data Engine",
        brand: "Ledger Stack",
        merchant: "Soko Tech Labs",
        marketplace: "EMEA Region",
        prevPrice: null,
        currentPrice: 2400,
        currency: "USD",
        inStock: false
    }
];



export const CatalogProvider = ({ children }: { children: ReactNode }) => {
    const [masterProducts, setMasterProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    // Load baseline inventory data node structures on mounting sequence
    useEffect(() => {
        getCatalog();
    }, []);


    const getCatalog = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            setMasterProducts(initialMockCatalog);
            setFilteredProducts(initialMockCatalog);
        } catch (err) {
            setError("Failed to interface with server database storage node cluster.");
        } finally {
            setIsLoading(false);
        }
    };

    const searchByTitle = (title: string) => {
        if (!title.trim()) return setFilteredProducts(masterProducts);
        setFilteredProducts(
            masterProducts.filter((p) => p.title.toLowerCase().includes(title.toLowerCase()))
        );
    };

    const searchBySku = (sku: string) => {
        if (!sku.trim()) return setFilteredProducts(masterProducts);
        setFilteredProducts(
            masterProducts.filter((p) => p.sku.toLowerCase().includes(sku.toLowerCase()))
        );
    };

    const searchByDescription = (desc: string) => {
        if (!desc.trim()) return setFilteredProducts(masterProducts);
        setFilteredProducts(
            masterProducts.filter((p) => p.description.toLowerCase().includes(desc.toLowerCase()))
        );
    };

    const filterByCategory = (category: string | null) => {
        if (!category) return setFilteredProducts(masterProducts);
        setFilteredProducts(masterProducts.filter((p) => p.category === category));
    };

    const filterByBrand = (brand: string | null) => {
        if (!brand) return setFilteredProducts(masterProducts);
        setFilteredProducts(masterProducts.filter((p) => p.brand === brand));
    };

    const filterByPriceRange = (min: number, max: number) => {
        setFilteredProducts(
            masterProducts.filter((p) => p.currentPrice >= min && p.currentPrice <= max)
        );
    };

    const filterByInStock = () => {
        setFilteredProducts(masterProducts.filter((p) => p.inStock));
    };

    const filterByOutOfStock = () => {
        setFilteredProducts(masterProducts.filter((p) => !p.inStock));
    };

    const resetFilters = () => {
        setFilteredProducts(masterProducts);
    };

    const addToCatalog = async (newProduct: Product) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 400));
            setMasterProducts((prev) => {
                const next = [newProduct, ...prev];
                setFilteredProducts(next);
                return next;
            });
        } catch (err) {
            setError("Failed to push configuration block matrix mutations onto registry.");
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCatalog = async (productSku: string) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 400));
            setMasterProducts((prev) => {
                const next = prev.filter((p) => p.sku !== productSku);
                setFilteredProducts(next);
                return next;
            });
        } catch (err) {
            setError("Failed to drop database object identification footprint.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 400));
            setMasterProducts((prev) => {
                const next = prev.map((p) => (p.sku === updatedProduct.sku ? updatedProduct : p));
                setFilteredProducts(next);
                return next;
            });
        } catch (err) {
            setError("Failed to write upstream atomic data change mapping blocks.");
        } finally {
            setIsLoading(false);
        }
    };

    const value: Catalog = {
        products: filteredProducts,
        isLoading,
        error,
        searchByTitle,
        searchBySku,
        searchByDescription,
        filterByCategory,
        filterByBrand,
        filterByPriceRange,
        filterByInStock,
        filterByOutOfStock,
        resetFilters,
        addToCatalog,
        removeFromCatalog,
        updateProduct,
        getCatalog,
    };

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export function useCatalog() { 
    const ctx = useContext(CatalogContext);
    if (!ctx) {
        throw new Error("useCatalog must be utilized inside a valid explicit CatalogProvider tree element structure.");
    }
    return ctx;
}