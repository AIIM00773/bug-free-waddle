import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getHeaders } from "./AuthProvider";


const BASE_URL_ROUTE = "http://127.0.0.1:8000";
const API_BASE_URL = BASE_URL_ROUTE + "/public/api/v1/merchants/";


// ==========================================
// 1. Interfaces & Types
// ==========================================


export interface ProductType {
    unique_id: string;
    merchant: string | null;

    // Basic Info
    title: string;
    sku: string;
    description: string;
    category: string | number | null;
    brand: string | number | null;
    categoryPersist: string;

    // Attributes
    color: string | number | null;
    size: string | number | null;
    shape: string | number | null;
    isRefurbished: boolean;
    isNew: boolean;

    // Search & SEO
    slug: string | null;
    searchTags: string[] | null;
    userAddedSearchTags: string[];

    // Pricing
    originalPrice: number;
    dealPrice: number;
    priceChangeRecord: number[] | any[] | null;
    priceCompetitionRecord: any[];

    // Logistics & Physical
    weightKg: number | string | null;
    isPhysical: boolean;
    isTaxExempt: boolean;

    // Visual & Dynamic States
    primaryImageUrl: string | null;
    secondaryImages: string[] | null;
    isAvailable: boolean;
    clickCount: number;
    minimumStockThreshold: number;
    stockQuantity: number;

    createdAt: string | Date;
    updatedAt: string | Date;
}

interface ProductContextType {
    // Variables
    products: ProductType[];
    totalProductsCount: number;
    activeListings: number;
    lowStockAlerts: number;
    isLoading: boolean;
    errorMessage: string | null;


    // Functions
    clearErrors: () => void;
    refreshProducts: () => Promise<void>;
    onboardProduct: (product: ProductType) => Promise<void>;
    editProduct: (product: ProductType) => Promise<void>;
    adjustProductCount: (sku: string, newCount: number) => Promise<void>;
    activateProduct: (sku: string) => Promise<void>;
    deactivateProduct: (sku: string) => Promise<void>;
    deleteProduct: (sku: string) => Promise<void>;
    fetchIndividualProduct: (sku: string) => Promise<ProductType | null | any>;
}




//Context;

const ProductContext = createContext<ProductContextType | undefined>(undefined);

//Provider Component

export function ProductContextProvider({ children }: { children: React.ReactNode }) {



    // State Variables
    const [products, setProducts] = useState<ProductType[]>([]);
    const [totalProductsCount, setTotalProductsCount] = useState<number>(0);
    const [activeListings, setActiveListings] = useState<number>(0);
    const [lowStockAlerts, setLowStockAlerts] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);



    function clearErrors() { setErrorMessage(null); }

    // API Implementations
    const refreshProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: "GET",
                headers: getHeaders()
            });
            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();

            setProducts(data.products || []);
            setTotalProductsCount(data.totalCount || 0);
            setActiveListings(data.activeCount || 0);
            setLowStockAlerts(data.lowStockCount || 0);
        } catch (error) {
            setErrorMessage("Error refreshing products:" + " " + error);
        } finally {
            setIsLoading(false);
        }
    }, []);






    const onboardProduct = useCallback(async (product: ProductType) => {
        try {
            const response = await fetch(`${API_BASE_URL}new/`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(product),
            });

            if (!response.ok) throw new Error("Failed to onboard product");
            if (!response.ok) throw new Error("Failed to onboard product");

            const newProductmap = await response.json();
            const newProd: ProductType = newProductmap.product;

            setProducts((prevProducts) => [...prevProducts, newProd]);

            setTotalProductsCount((prev) => prev + 1);

            if (newProd.isAvailable) {
                setActiveListings((prev) => prev + 1);
            }

            if (newProd.stockQuantity <= newProd.minimumStockThreshold) {
                setLowStockAlerts((prev) => prev + 1);
            }
        } catch (error) {
            setErrorMessage("Error onboarding product:" + " " + error);
        }
    }, []);







    const editProduct = useCallback(async (product: ProductType) => {
        try {
            const response = await fetch(`${API_BASE_URL}product/update/${product.sku}`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(product),
            });

            if (!response.ok) throw new Error("Failed to edit product");

            const data = await response.json();
            const newVersion: ProductType = data.product;

            setProducts((prevProducts) =>
                prevProducts.map((p) => (p.sku === newVersion.sku ? newVersion : p))
            );

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setErrorMessage("Error editing product: " + message);
        }
    }, []);







    const adjustProductCount = useCallback(async (sku: string, newCount: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}product/qunatity/${sku}`, {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify({ stockQuantity: newCount }),
            });
            if (!response.ok) throw new Error("Failed to adjust product count");
            const data = await response.json();
            const newVersion: ProductType = data.product;

            setProducts((prevProducts) =>
                prevProducts.map((p) => (p.sku === newVersion.sku ? newVersion : p))
            );

        } catch (error) {
            setErrorMessage("Error adjusting product count:" + error);
        }
    }, []);





    const activateProduct = useCallback(async (sku: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${sku}/activate`, { method: "PATCH" });
            if (!response.ok) throw new Error("Failed to activate product");

            const data = await response.json();
            const newVersion: ProductType = data.product;

            setProducts((prevProducts) =>
                prevProducts.map((p) => (p.sku === newVersion.sku ? newVersion : p))
            );

        } catch (error) {
            setErrorMessage("Error activating product:" + error);
        }
    }, []);




    const deactivateProduct = useCallback(async (sku: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${sku}/deactivate`,
                {
                    method: "PATCH", headers: getHeaders()
                });
            if (!response.ok) throw new Error("Failed to deactivate product");

            const data = await response.json();
            const newVersion: ProductType = data.product;

            setProducts((prevProducts) =>
                prevProducts.map((p) => (p.sku === newVersion.sku ? newVersion : p))
            );

        } catch (error) {
            setErrorMessage("Error activating product:" + error);
        }
    }, []);





    const deleteProduct = useCallback(async (sku: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${sku}`, {
                method: "DELETE",
                headers: getHeaders()
            });

            if (!response.ok) throw new Error("Failed to delete product");

            setProducts((prevProducts) => prevProducts.filter((p) => p.sku !== sku));
            setTotalProductsCount((prev) => Math.max(0, prev - 1));

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setErrorMessage("Error deleting product: " + message);
        }
    }, []);






    const fetchIndividualProduct = useCallback(async (sku: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${sku}`);
            if (!response.ok) throw new Error("Failed to fetch product");

            const data: ProductType = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching individual product:", error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);



    // Load products on initial mount
    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);




    // Expose Context Values
    const values: ProductContextType = {
        // Variables
        products,
        totalProductsCount,
        activeListings,
        lowStockAlerts,
        isLoading,
        errorMessage,


        // Functions
        clearErrors,
        refreshProducts,
        onboardProduct,
        editProduct,
        adjustProductCount,
        activateProduct,
        deactivateProduct,
        deleteProduct,
        fetchIndividualProduct,
    };

    return (
        <ProductContext.Provider value={values}>
            {children}
        </ProductContext.Provider>
    );
}

// ==========================================
// 5. Custom Hook
// ==========================================

export function useProduct() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProduct must be used within a ProductContextProvider");
    }
    return context;
}