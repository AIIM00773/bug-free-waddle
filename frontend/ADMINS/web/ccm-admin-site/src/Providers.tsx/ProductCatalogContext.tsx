import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// 1. Updated interface structural properties to accurately match Django serializer data footprints
export interface Product {
    unique_id?: string; 
    title: string;
    sku: string | null;
    description: string | null;
    category: string | null;
    brand: string | null;
    merchant: number | string; 
    original_price: number;     
    deal_price: number;       
    primary_image_url: string;
    secondary_images?: string[];
    is_available: boolean;    
    click_count?: number;
    discount_percentage?: number;
    created_at?: string;
    color?:string;
    size?:string;
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

    // Async Network Mutation Operations
    addToCatalog: (newProduct: Product) => Promise<void>;
    removeFromCatalog: (uniqueId: string) => Promise<void>;
    updateProduct: (updatedProduct: Product) => Promise<void>;
    getCatalog: () => Promise<void>;
}

const CatalogContext = createContext<Catalog | undefined>(undefined);

// API Gateway environment context variables 
const API_BASE_URL = "http://127.0.0.1:8000/adm/root/api/v1/fdf3a589-dd03-4be8-9de4-66922db46e55/catalogs/products/";

export const CatalogProvider = ({ children }: { children: ReactNode }) => {
    const [masterProducts, setMasterProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCatalog();
    }, []);



    // Secure Header Utility
    const getAuthHeaders = (): HeadersInit => {
        try {
            const rawTokens = sessionStorage.getItem("soko_ai_admin_token");
            const access = rawTokens ? JSON.parse(rawTokens)?.access : null;
            return {
                "Content-Type": "application/json",
                ...(access ? { "Authorization": `Bearer ${access}` } : {})
            };
        } catch {
            return { "Content-Type": "application/json" };
        }
    };

    const getCatalog = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error("Server synchronization failed.");
            const data: Product[] = await res.json();
            setMasterProducts(data);
            setFilteredProducts(data);
        } catch (err: any) {
            setError(err.message || "Failed to interface with server database storage node cluster.");
        } finally {
            setIsLoading(false);
        }
    };



    const addToCatalog = async (newProduct: Product) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(newProduct),
            });
            if (!res.ok) throw new Error("Could not persist product entity state to storage engine.");
            const payload = await res.json();

            // Sync local runtime state with backend database record response
            setMasterProducts((prev) => {
                const next = [payload.data, ...prev];
                setFilteredProducts(next);
                return next;
            });
        } catch (err: any) {
            setError(err.message || "Failed to push configuration block matrix mutations onto registry.");
        } finally {
            setIsLoading(false);
        }
    };



    const updateProduct = async (updatedProduct: Product) => {
        if (!updatedProduct.unique_id) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}details/?product_id=${updatedProduct.unique_id}/`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedProduct),
            });
            if (!res.ok) throw new Error("Upstream mutation transaction failed.");
            const payload = await res.json();

            setMasterProducts((prev) => {
                const next = prev.map((p) => (p.unique_id === updatedProduct.unique_id ? payload.data : p));
                setFilteredProducts(next);
                return next;
            });
        } catch (err: any) {
            setError(err.message || "Failed to write upstream atomic data change mapping blocks.");
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCatalog = async (uniqueId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}details/?product_id=${uniqueId}/`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error("Drop sequence execution failed at storage cluster level.");

            setMasterProducts((prev) => {
                const next = prev.filter((p) => p.unique_id !== uniqueId);
                setFilteredProducts(next);
                return next;
            });
        } catch (err: any) {
            setError(err.message || "Failed to drop database object identification footprint.");
        } finally {
            setIsLoading(false);
        }
    };

    // Client-side Memory Engine Filters
    const searchByTitle = (title: string) => {
        if (!title.trim()) return setFilteredProducts(masterProducts);
        setFilteredProducts(
            masterProducts.filter((p) => p.title.toLowerCase().includes(title.toLowerCase()))
        );
    };

    const searchBySku = (sku: string) => {
        if (!sku.trim()) return setFilteredProducts(masterProducts);
        setFilteredProducts(
            masterProducts.filter((p) => p.sku?.toLowerCase().includes(sku.toLowerCase()) ?? false)
        );
    };

    const searchByDescription = (desc: string) => {
        if (!desc.trim()) return setFilteredProducts(masterProducts);
        setFilteredProducts(
            masterProducts.filter((p) => p.description?.toLowerCase().includes(desc.toLowerCase()) ?? false)
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
            masterProducts.filter((p) => p.deal_price >= min && p.deal_price <= max)
        );
    };

    const filterByInStock = () => {
        setFilteredProducts(masterProducts.filter((p) => p.is_available));
    };

    const filterByOutOfStock = () => {
        setFilteredProducts(masterProducts.filter((p) => !p.is_available));
    };

    const resetFilters = () => {
        setFilteredProducts(masterProducts);
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