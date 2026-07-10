import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

// ============================================================================
// 1. TYPES & INTERFACES DEFINITIONS
// ============================================================================

export type ShopCategory =
    | "Electronics"
    | "GeneralShop"
    | "Clothing Apparel"
    | "Grocery Food"
    | "Health Beauty"
    | "Home Decor"
    | "Automotive Parts"
    | "Books Stationery"
    | "Sports Outdoors"
    | "Toys Hobbies"
    | "Pharmacy Medical"
    | "Pet Supplies"
    | "Hardware Construction"
    | "Restaurant Cafe";

export type VerificationStatus = "verified" | "pending_review" | "suspended";
export type AuthRoute = "login" | "signup" | "forgot-password" | "reset-password" | "merchant_onboarding";
export type PayoutMethod = "M-Pesa Send Money" | "Bank Transfer" | "M-pesa Paybill" | "M-pesa Till";

export interface SignupPayloadType {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string | null;
}

export interface LoginPayloadType {
    phone: string;
    password: string;
}


export interface BranchType {
    unique_id: string;
    branchName: string;
    country: string;
    county: string;
    cityTown: string;
    isPrimary: string;
    isActive: string;
    operatingHours:string;
    managerName:string;
    managerPhone:string;
    managerEmail:string;
    
                
    
}

export interface BranchInventoryType{
    parrentBranchID: string;
    inventoryID: string;
    inventoryTitle: string;
    inventoryLocked: boolean;
    totalProducts: number;
    totalInventoryValue: string | number | null;
    lowStockItems: number;
    outOfStockItems:number;
    
};





export interface CatalogItemOverviewType {
    unique_id: string;
    parrentInventory: string | null;
    sku: string;
    title: string;
    category: string;
    currentStock: number;
    minimumStockThreshhold: number;
    price: number;
};






export interface MerchantsAlertsType {
    unique_id: string | null;
    Type: string;
    Priority: string;
    Message: string;
    created_at: string;
    Read: boolean;
};



export interface MerchantIncomingOrdersType {
    unique_id: string | null;
    order_id: string;
    shippingCustomerName: string;
    branch: string;
    gross_sales_amount: number;
    currency: string;
    status: string;
    createdAt: string | Date | any;
};




export interface CatalogLowStocItemsType {
    unique_id: string;
    title: string;
    category: string;
    categoryPersist: string;
    currentStock: number | string;
    minimumStockThreshhold: number | string;
    price: number | string;
}

export interface MerchantIncomingReviewsType {
    unique_id: string | null;
    customer: string;
    ratting: string;
    comment: string;
    date: string;
}

export interface InternalMerchantProfile {
    unique_id: string;
    _business_branches: BranchType[];
    _branch_inventory: BranchInventoryType[];
    _gross_net_payout: number;
    _gross_sales_today: number;
    _awaiting_orders_queue: number;
    _catalog_stock_items_overview: CatalogItemOverviewType[];
    _catalog_low_stock_items: CatalogLowStockItemsType[];
    _merchant_alerts: MerchantsAlertsType[];
    _incoming_orders: MerchantIncomingOrdersType[];
    _incoming_reviews: MerchantIncomingReviewsType[];
    
    vendorCode: string | null;
    shopName: string;
    shopDescription: string;
    accountEmail: string;
    accountPhone: string;
    shopLogoPlaceHolder: URL | string | null;
    shopBannerPlaceHolder: URL | string | null;
    shopLogo: any | null;
    shopBanner: any | null;
    is_accepting_orders: boolean;
    shopCategory: string | null;
    shopCategoryPersist: string | null;
    bussinessRegisted: boolean;
    taxPin: string | null;
    businessRegistrationNumber: string | null;
    legalDocument: any | null;
    commissionCutPercent: number | string | null;
    totalActiveListings: number;
    isCommissionFree: boolean;
    verificationStatus: VerificationStatus;
    verified: boolean;
    payoutMethod: PayoutMethod | null;
    bankAccountNumber: string | null;
    bankName: string | null;
    payBillNumber: string | null;
    accountNumber: string | null;
    sendMoneyPhone: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    vendorOwner: string;
};




export interface UserType {
    unique_id: string;
    phone: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    is_active: boolean;
    is_merchant: boolean;
    is_banned: boolean;
    is_suspended: boolean;
    is_blocked: boolean;
    is_email_verified: boolean;
    is_phone_verified: boolean;
    onboarding_completed: boolean;
    mfa_required: boolean;
    age: number | null;
    created_at: string;
    is_merchant_verified: boolean;
}

interface AuthContextType {
    user: UserType | null;
    merchantProfile: InternalMerchantProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isMerchant: boolean;
    isMerchantVerified: boolean;
    authError: string | null;
    authRoute: AuthRoute;
    userAccessAllowed: boolean;

    // Core Setters & Background Synchronization Actions
    setUser: Dispatch<SetStateAction<UserType | null>>;
    
    refreshUser: () => Promise<void>;
    fetchMerchantProfile: () => Promise<void>;
    updateMerchantState: (profile: InternalMerchantProfile) => Promise<void>;

    // Security & Auth Subroutines
    userSignup: (payload: SignupPayloadType) => Promise<void>;
    userLogin: (payload: LoginPayloadType) => Promise<void>;
    userLogout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (authenticationCode: string | number, newPassword: string) => Promise<void>;

    // Navigation & UI Layout Helpers
    setAuthRoute: (route: AuthRoute) => Promise<void>;
    clearAuthError: () => Promise<void>;
    merchantOnboarding: (payload: any) => Promise<void>;
}

// ============================================================================
// 2. CONFIGURATIONS & NETWORK ROUTES
// ============================================================================

export const API_BASE_URL = "http://127.0.0.1:8000";

export const BASE_API_ROUTES = {
    REGISTER: `${API_BASE_URL}/public/api/v1/users/register/`,
    LOGIN: `${API_BASE_URL}/public/api/v1/users/login/`,
    PROFILE: `${API_BASE_URL}/public/api/v1/users/profile/`,
    LOGOUT: `${API_BASE_URL}/public/api/v1/users/logout/`,
    REFRESH: `${API_BASE_URL}/public/api/v1/auth/token/refresh/`,
    FORGOT_PASSWORD: `${API_BASE_URL}/public/api/v1/users/forgot-password/`,
    RESET_PASSWORD: `${API_BASE_URL}/public/api/v1/users/resetpassword/`,
    VALIDATE_TOKEN: `${API_BASE_URL}/public/api/v1/users/validate-token/`,
};

export const MERCHANTS_API_ROUTES = {
    AUTHENTICATE: `${API_BASE_URL}/public/api/v1/merchants/authenticate/`,
    GETPROFILE: `${API_BASE_URL}/public/api/v1/merchants/`,
    ONBOARD: `${API_BASE_URL}/public/api/v1/merchants/merchant/onboard/`,
    UPDATE: `${API_BASE_URL}/public/api/v1/merchants/update/`,
};

export function getHeaders() {
    const token = sessionStorage.getItem("soko_ai_merchant_auth_token_access");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

// ============================================================================
// 3. CONTEXT PROVIDER COMPONENT
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [merchantProfile, setMerchantProfile] = useState<InternalMerchantProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [authRouteState, setAuthRouteState] = useState<AuthRoute>("login");

    // Derived Memoized State Values
    const isAuthenticated = !!user;
    const userAccessAllowed = !!user && !user.is_banned && !user.is_suspended;
    const isMerchant = !!user?.is_merchant;

    const isMerchantVerified = useMemo(() => {
        return merchantProfile?.verificationStatus === "verified";
    }, [merchantProfile]);

    // UI & Error Utilities
    const clearAuthError = useCallback(async () => {
        setAuthError(null);
    }, []);

    const setAuthRoute = useCallback(async (route: AuthRoute) => {
        setAuthRouteState(route);
        setAuthError(null);
    }, []);

    // Core Authorization Sync Methods
    const refreshUser = useCallback(async () => {
        try {
            setIsLoading(true);
            setAuthError(null);

            const token = sessionStorage.getItem("soko_ai_merchant_auth_token_access");
            if (!token) {
                setUser(null);
                return;
            }

            const response = await fetch(BASE_API_ROUTES.VALIDATE_TOKEN, {
                method: "GET",
                headers: getHeaders(),
            });

            if (!response.ok) throw new Error("Session expired or invalid");

            const resp = await response.json();
            if (resp?.user) setUser(resp.user);

        } catch (error: any) {
            setAuthError(`Session evaluation failed: ${error.message}`);
            setUser(null);
            sessionStorage.removeItem("soko_ai_merchant_auth_token_access");
            sessionStorage.removeItem("soko_ai_merchant_auth_token_refresh");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchMerchantProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(MERCHANTS_API_ROUTES.GETPROFILE, {
                method: "GET",
                headers: getHeaders(),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.merchant_profile) {
                    setMerchantProfile(data.merchant_profile);
                    setUser(prev => {
                        if (!prev) return null;
                        return { ...prev, merchant_profile: data.merchant_profile };
                    });
                }
            }
        } catch (error) {
            console.error("Failed to hydrate merchant profile", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const userSignup = useCallback(async (payload: SignupPayloadType) => {
        try {
            setIsLoading(true);
            setAuthError(null);

            const response = await fetch(BASE_API_ROUTES.REGISTER, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || errorData.error || "Signup failed");
            }

            const data = await response.json();
            const access = data.tokens?.access || data.access;
            const refresh = data.tokens?.refresh || data.refresh;

            if (access && refresh) {
                sessionStorage.setItem("soko_ai_merchant_auth_token_access", access);
                sessionStorage.setItem("soko_ai_merchant_auth_token_refresh", refresh);
                setUser(data.user);
            } else {
                setAuthError("Missing credentials in server response.");
            }
        } catch (e: any) {
            setAuthError(e.message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const userLogin = useCallback(async (payload: LoginPayloadType) => {
        try {
            setIsLoading(true);
            setAuthError(null);

            const response = await fetch(BASE_API_ROUTES.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Invalid credentials");
            }

            const data = await response.json();
            const access = data.tokens?.access || data.access;
            const refresh = data.tokens?.refresh || data.refresh;

            if (access && refresh) {
                sessionStorage.setItem("soko_ai_merchant_auth_token_access", access);
                sessionStorage.setItem("soko_ai_merchant_auth_token_refresh", refresh);
                setUser(data.user);
            } else {
                setAuthError("Missing credentials in server response.");
            }
        } catch (e: any) {
            setAuthError(e.message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const userLogout = useCallback(async () => {
        try {
            setIsLoading(true);
            setAuthError(null);

            const response = await fetch(BASE_API_ROUTES.LOGOUT, {
                method: "POST",
                headers: getHeaders(),
            });

            if (!response.ok) {
                console.warn("Backend failed to invalidate token, clearing locally anyway.");
            }
        } catch (error) {
            console.error("Logout network error:", error);
        } finally {
            sessionStorage.removeItem("soko_ai_merchant_auth_token_access");
            sessionStorage.removeItem("soko_ai_merchant_auth_token_refresh");
            setUser(null);
            setMerchantProfile(null);
            setIsLoading(false);
        }
    }, []);

    // Account Recovery & Verification Management
    const forgotPassword = useCallback(async (email: string) => {
        try {
            setIsLoading(true);
            setAuthError(null);

            const response = await fetch(BASE_API_ROUTES.FORGOT_PASSWORD, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Failed to initiate password reset");
            }
        } catch (e: any) {
            setAuthError(e.message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (authenticationCode: string | number, newPassword: string) => {
        try {
            setIsLoading(true);
            setAuthError(null);

            const response = await fetch(BASE_API_ROUTES.RESET_PASSWORD, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: authenticationCode, password: newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Failed to reset password");
            }
        } catch (e: any) {
            setAuthError(e.message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Merchant Ecosystem Subroutines
    const merchantOnboarding = useCallback(async (payload: any) => {
        try {
            setIsLoading(true);
            setAuthError(null);

            const response = await fetch(MERCHANTS_API_ROUTES.ONBOARD, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                if (errorData?.errors) {
                    const possibleErrors = [
                        "supportPhone", "accountEmail", "taxPin", "accountPhone",
                        "payBillNumber", "accountNumber", "bankDetails", "profile", "shopName"
                    ];
                    const foundErrorField = possibleErrors.find(field => errorData.errors[field]);
                    if (foundErrorField) {
                        const fieldError = errorData.errors[foundErrorField];
                        const errorMessage = Array.isArray(fieldError) ? fieldError[0] : fieldError;
                        throw new Error(typeof errorMessage === 'string' ? errorMessage : `Invalid data for ${foundErrorField}`);
                    }
                }
                throw new Error(errorData?.message || errorData?.detail || "An unknown error occurred during onboarding.");
            }

            const resp: InternalMerchantProfile = await response.json();
            setUser((currentUser) => {
                if (!currentUser) return null;
                return { ...currentUser, is_merchant: true, merchant_profile: resp };
            });
        } catch (error: any) {
            setAuthError(error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateMerchantState = useCallback(async (updatedProfile: InternalMerchantProfile) => {
        try {
            setIsLoading(true);
            setAuthError(null);

            const response = await fetch(MERCHANTS_API_ROUTES.UPDATE, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(updatedProfile),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Failed to update profile");
            }

            setUser((currentUser) => {
                if (!currentUser) return null;
                return { ...currentUser, is_merchant: true, merchant_profile: updatedProfile };
            });
        } catch (e: any) {
            setAuthError(`Update Error: ${e.message}`);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Runtime Initialization Trigger
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    // Hydrate Merchant Data lazily once authenticating successfully
    useEffect(() => {
        if (isAuthenticated && isMerchant && !merchantProfile) {
            fetchMerchantProfile();
        }
    }, [isAuthenticated, isMerchant, merchantProfile, fetchMerchantProfile]);

    // Comprehensive Provider Reference Value Memoization
    const contextValue = useMemo(() => ({
        user,
        merchantProfile,
        isAuthenticated,
        isLoading,
        isMerchant,
        isMerchantVerified,
        authError,
        authRoute: authRouteState,
        userAccessAllowed,
        setUser,
        refreshUser,
        fetchMerchantProfile,
        updateMerchantState,
        userSignup,
        userLogin,
        userLogout,
        forgotPassword,
        resetPassword,
        setAuthRoute,
        clearAuthError,
        merchantOnboarding,
    }), [
        user,
        merchantProfile,
        isAuthenticated,
        isLoading,
        isMerchant,
        isMerchantVerified,
        authError,
        authRouteState,
        userAccessAllowed,
        refreshUser,
        fetchMerchantProfile,
        updateMerchantState,
        userSignup,
        userLogin,
        userLogout,
        forgotPassword,
        resetPassword,
        setAuthRoute,
        clearAuthError,
        merchantOnboarding,
    ]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// ============================================================================
// 4. CONSUMER CUSTOM HOOK
// ============================================================================

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be called within an active AuthProvider component layout hierarchy.");
    }
    return context;
}
