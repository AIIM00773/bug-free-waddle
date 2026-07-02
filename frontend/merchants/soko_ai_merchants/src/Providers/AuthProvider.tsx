import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";







// --- TYPES ---
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



export interface signupPayloadType {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string | null;
}



export interface loginPayloadType {
    phone: string;
    password: string;
}

export interface branchType {
    "unique_id": string,
    "branchName": string,
    "phone": string,
    "email": string,
    "county": string,
    "cityTown": string,
    "physicalAddress": string,
    "isPrimary": boolean,
    "isActive": boolean
}



export interface merchantsAlertsType {
    "unique_id": string | null,
    "Type": string,
    "Priority": string,
    "Message": string,
    "created_at": string,
    "Read": boolean,
};


export interface merchantIncomingOrdersType {
    "unique_id": string | null,
    "order_id": string,
    "shippingCustomerName": string,
    "branch": string,
    "gross_sales_amount": number,
    'currency': string,
    "status": string,
    "createdAt": string | Date | any,
}


export interface catalogLowStocItemsType {
    "unique_id": string,
    "title": string,
    "category": string,
    "categoryPersist":string,
    "currentStock": number| string,
    "minimumStockThreshhold": number | string,
    "price": number | string
}


export interface InternalMerchantProfile {
    "_business_branches": branchType[],
    "_gross_net_payout": number,
    "_gross_sales_today": number,
    "_awaiting_orders_queue": number,
    "_catalog_stock_items_overview": any[],
    "_catalog_low_stock_items": catalogLowStocItemsType[],
    "_merchant_alerts": merchantsAlertsType[],
    "_incoming_orders": merchantIncomingOrdersType[],


    // ================================================

    "unique_id": string,
    "shopName": string,
    "shopDescription": string,
    "accountEmail": string,
    "shop_logo_url": string | null,
    "shop_banner_url": string | null,
    "is_accepting_orders": boolean,
    "shopCategoryPersist": string,
    "bussinessRegisted": boolean,
    "taxPin": string,
    "businessRegistrationNumber": string,
    "support_phone": string,
    "legalDocument": null,
    "commissionCutPercent": string | number | null,
    "totalActiveListings": number,
    "isCommissionFree": false,
    "verificationStatus": string,
    "verified": boolean,
    "payoutMethod": string,
    "bankAccountNumber": string | null,
    "bankName": string | null,
    "payBillNumber": string | null,
    "accountNumber": string | null,
    "accountPhone": string,
    "createdAt": string,
    "updatedAt": string,
    "vendorOwner": string,
    "shopCategory": any[]
}



export interface UserType {
    "unique_id": string,
    "phone": string,
    "email": string,
    "first_name": string,
    "last_name": string,
    "full_name": string,
    "is_active": boolean,
    "is_merchant": boolean,
    "is_banned": boolean,
    "is_suspended": boolean,
    "is_blocked": boolean,
    "is_email_verified": boolean,
    "is_phone_verified": boolean,
    "onboarding_completed": boolean,
    "mfa_required": boolean,
    "age": number | null,
    "created_at": string,
    "is_merchant_verified": boolean,
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

    // Core 
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    refreshUser: () => Promise<void>;
    fetchMerchantProfile: () => Promise<void>;
    updateMerchantState: (profile: InternalMerchantProfile) => Promise<void>;

    // Auth 
    userSignup: (payload: signupPayloadType) => Promise<void>;
    userLogin: (payload: loginPayloadType) => Promise<void>;
    userLogout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (authenticationCode: string | number, newPassword: string) => Promise<void>;

    // UI/Flow 
    setAuthRoute: (route: AuthRoute) => Promise<void>;
    clearAuthError: () => Promise<void>;
    merchantOnboarding: (payload: any) => Promise<void>;
    userAccessAllowed: Boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- API ROUTES ---
export const API_BASE_URL = "http://127.0.0.1:8000";

const BASE_API_ROUTES = {
    REGISTER: `${API_BASE_URL}/public/api/v1/users/register/`,
    LOGIN: `${API_BASE_URL}/public/api/v1/users/login/`,
    PROFILE: `${API_BASE_URL}/public/api/v1/users/profile/`,
    LOGOUT: `${API_BASE_URL}/public/api/v1/users/logout/`,
    REFRESH: `${API_BASE_URL}/public/api/v1/auth/token/refresh/`,
    FORGOT_PASSWORD: `${API_BASE_URL}/public/api/v1/users/forgot-password/`,
    RESET_PASSWORD: `${API_BASE_URL}/public/api/v1/users/resetpassword/`,
    VALIDATE_TOKEN: `${API_BASE_URL}/public/api/v1/users/validate-token/`,
};



const MERCHANTS_API_ROUTES = {
    AUTHENTICATE: `${API_BASE_URL}/public/api/v1/merchants/authenticate/`,
    GETPROFILE: `${API_BASE_URL}/public/api/v1/merchants/`,
    ONBOARD: `${API_BASE_URL}/public/api/v1/merchants/onboard/`,
    UPDATE: `${API_BASE_URL}/public/api/v1/merchants/update/`,
};




// HELPERS

export function getHeaders() {
    const token = sessionStorage.getItem("soko_ai_merchant_auth_token_access");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}




// PROVIDER 
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [merchantProfile, setMerchantProfile] = useState<InternalMerchantProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [authRouteState, setAuthRouteState] = useState<AuthRoute>("login");

    // Memoized 
    const isAuthenticated = !!user;
    const userAccessAllowed = !user?.is_banned && !user?.is_suspended;
    const isMerchant = !!user?.is_merchant;
    const isMerchantVerified = useMemo(() => merchantProfile?.verificationStatus === "verified", [merchantProfile]);



    //UTILITIES
    const clearAuthError = useCallback(async () => {
        setAuthError(null);
    }, []);


    const setAuthRoute = useCallback(async (route: AuthRoute) => {
        setAuthRouteState(route);
        setAuthError(null);
    }, []);




    //CORE AUTH METHODS
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
            if (resp) setUser(resp.user);

        } catch (error: any) {
            setAuthError(`Session evaluation failed: ${error.message}`);
            setUser(null);
            sessionStorage.removeItem("soko_ai_merchant_auth_token");
        }
    }, []);





    // // Add this to your AuthProvider to debug
    // useEffect(() => {
    //     console.log("Current User Object:", user);
    //     console.log("Current Merchant Profile:", merchantProfile);
    //     console.log("Is Merchant Verified:", isMerchantVerified);
    // }, [user, merchantProfile, isMerchantVerified]);




    useEffect(() => {
        if (isAuthenticated && isMerchant && !merchantProfile) {
            fetchMerchantProfile();
        }
    }, [isAuthenticated, isMerchant, merchantProfile]);

    const fetchMerchantProfile = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await fetch(MERCHANTS_API_ROUTES.GETPROFILE, {
                method: "GET",
                headers: getHeaders(),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched Merchant Profile:", data);
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





    const userSignup = useCallback(async (payload: signupPayloadType) => {
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
            };



            const data = await response.json();
            const access = data.tokens?.access || data.access;
            const refresh = data.tokens?.refresh || data.refresh;

            if (access && refresh) {
                sessionStorage.setItem("soko_ai_merchant_auth_token_access", access);
                sessionStorage.setItem("soko_ai_merchant_auth_token_refresh", access);
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





    const userLogin = useCallback(async (payload: loginPayloadType) => {
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
            console.log(data);

            const access = data.tokens?.access || data.access;
            const refresh = data.tokens?.refresh || data.refresh;

            if (access && refresh) {
                sessionStorage.setItem("soko_ai_merchant_auth_token_access", access);
                sessionStorage.setItem("soko_ai_merchant_auth_token_refresh", access);
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

            if (!response.ok) console.warn("Backend failed to invalidate token, clearing locally anyway.");
        } catch (error) {
            console.error("Logout network error:", error);
        } finally {
            sessionStorage.removeItem("soko_ai_merchant_auth_token");
            setUser(null);
            setIsLoading(false);
        }
    }, []);





    // PASSWORD MANAGEMENT
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


    //MERCHANT SPECIFIC

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
                throw new Error(errorData.detail || errorData.error || "Onboarding failed");
            }

            const resp: InternalMerchantProfile = await response.json();

            setUser((currentUser) => {
                if (!currentUser) return null;
                return { ...currentUser, is_merchant: true, merchant_profile: resp };
            });
        } catch (e: any) {
            setAuthError(`Onboarding Error: ${e.message}`);
            throw e;
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






    //MOUNT EFFECT
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);



    return (
        <AuthContext.Provider
            value={{
                user,
                merchantProfile,
                isAuthenticated,
                isLoading,
                isMerchant,
                isMerchantVerified,
                authError,
                authRoute: authRouteState,

                setUser,
                updateMerchantState,
                userLogout,
                refreshUser,
                fetchMerchantProfile,
                userSignup,
                userLogin,
                merchantOnboarding,
                setAuthRoute,
                forgotPassword,
                resetPassword,
                clearAuthError,
                userAccessAllowed,

            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}