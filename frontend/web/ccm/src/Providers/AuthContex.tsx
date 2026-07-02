import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    useMemo,
} from "react";

/* TYPES & INTERFACES */

export type AuthRoute = "login" | "signup" | "forgot-password" | "reset-password";

export interface AuthUser {
    id: string;
    phone: string | null;
    email: string;
    first_name: string;
    last_name: string;
    dob: string | null;
    gender: string | null;
    country: string | null;
    is_merchant: boolean;
    search_allowance: number | null;
    is_on_free_tier: boolean;
    current_tier_use: number;
    free_tier_search_limit: number;
    eligible: boolean;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    authError: string | null;
    authRoute: AuthRoute;
    setAuthRoute: (route: AuthRoute) => void;
    login: (phone: string, password: string) => Promise<void>;
    signUp: (
        email: string,
        password: string,
        first_name: string,
        last_name: string,
        phone: string | null
    ) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (password: string) => Promise<void>;
    initializeAuth: () => Promise<void>;
    clearAuthError: () => void;
}

/* =========Config and Endpoints  */

export const API_BASE_URL = "http://127.0.0.1:8000";

const ENDPOINTS = {
    REGISTER: `${API_BASE_URL}/public/api/v1/users/register/`,
    LOGIN: `${API_BASE_URL}/public/api/v1/users/login/`,
    PROFILE: `${API_BASE_URL}/public/api/v1/users/profile/`,
    LOGOUT: `${API_BASE_URL}/public/api/v1/users/logout/`,
    REFRESH: `${API_BASE_URL}/public/api/v1/auth/token/refresh/`,
    FORGOT_PASSWORD: `${API_BASE_URL}/public/api/v1/users/forgot-password/`,
    RESET_PASSWORD: `${API_BASE_URL}/public/api/v1/users/resetpassword/`,
    VALIDATE_TOKEN: `${API_BASE_URL}/public/api/v1/users/validate-token/`,
};

export const AUTH_KEYS = {
    ACCESS_TOKEN_KEY: "soko_user_access_token",
    REFRESH_TOKEN_KEY: "soko_user_refresh_token",
    AUTH_ROUTE_KEY: "soko_user_auth_route",
};

/* ============Utilities Helper  */

const sanitizeInput = (value: string): string => {
    return value.trim().replace(/[<>]/g, "");
};

const parseResponseError = async (response: Response): Promise<string> => {
    try {
        const data = await response.json();
        if (typeof data === "string") return data;
        if (data.detail) return data.detail;

        if (data && typeof data === "object") {
            const errors = Object.values(data)
                .flat()
                .filter((val) => typeof val === "string")
                .join(", ");
            return errors || "Validation error encountered.";
        }
        return "Request validation rejected.";
    } catch {
        return `Server error: Status code ${response.status}`;
    }
};













const AuthContext = createContext<AuthContextType | undefined>(undefined);
/* =========Provider Engine  */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const [authRoute, setAuthRouteState] = useState<AuthRoute>(() => {
        try {
            const saved = localStorage.getItem(AUTH_KEYS.AUTH_ROUTE_KEY) as AuthRoute | null;
            const validRoutes: AuthRoute[] = ["login", "signup", "forgot-password", "reset-password"];
            return saved && validRoutes.includes(saved) ? saved : "login";
        } catch {
            return "login";
        }
    });


    const clearAuthError = useCallback(() => setAuthError(null), []);

    const setAuthRoute = useCallback((route: AuthRoute) => {
        try {
            localStorage.setItem(AUTH_KEYS.AUTH_ROUTE_KEY, route);
        } catch (err) {
            console.warn("Storage write blocked:", err);
        }
        setAuthRouteState(route);
    }, []);



    /* ===========Token Management  */

    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        const refresh = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN_KEY);
        if (!refresh) return false;

        try {
            const response = await fetch(ENDPOINTS.REFRESH, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh }),
            });

            if (!response.ok) return false;

            const data = await response.json();
            const newAccess = data.tokens?.access || data.access;
            const newRefresh = data.tokens?.refresh || data.refresh;

            if (newAccess) localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN_KEY, newAccess);
            if (newRefresh) localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN_KEY, newRefresh);

            return true;
        } catch {
            return false;
        }
    }, []);





    const logout = useCallback(async () => {
        try {
            const refresh = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN_KEY);
            if (refresh) {
                await fetch(ENDPOINTS.LOGOUT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh }),
                });
            }
        } catch (err) {
            console.warn("Server-side session revocation skipped:", err);
        } finally {
            localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN_KEY);
            localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN_KEY);
            setUser(null);
            setIsAuthenticated(false);
            setAuthRoute("login");
            clearAuthError();
        }
    }, [setAuthRoute, clearAuthError]);




    /* ======== Authentication logc interfaces   */
    const initializeAuth = useCallback(async () => {
        setIsLoading(true);
        const access = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN_KEY);

        if (!access) {
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            let response = await fetch(ENDPOINTS.VALIDATE_TOKEN, {
                headers: { Authorization: `Bearer ${access}` },
            });

            if (response.status === 401) {
                const refreshed = await refreshAccessToken();
                if (!refreshed) {
                    await logout();
                    return; 
                }
                const newAccess = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN_KEY);
                response = await fetch(ENDPOINTS.VALIDATE_TOKEN, {
                    headers: { Authorization: `Bearer ${newAccess}` },
                });
            }

            if (!response.ok) throw new Error("Token verification invalid");

            const data = await response.json();
            setUser(data.user);
            setIsAuthenticated(true);

        } catch (error) {
            console.error("Auth initialization failed:", error);
            try {
                await logout();
            } catch (logoutError) {
                console.warn("Logout cleanup failed during auth init:", logoutError);
            }
        } finally {
            setIsLoading(false);
        }
    }, [refreshAccessToken, logout]);




    const login = useCallback(async (phone: string, password: string) => {
        clearAuthError();
        const cleanPhone = sanitizeInput(phone);

        if (!cleanPhone) {
            throw new Error("Please enter a valid phone number.");
        }

        setIsLoading(true); // <-- Added
        try {
            const response = await fetch(ENDPOINTS.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: cleanPhone, password }),
            });

            if (!response.ok) {
                const errorMsg = await parseResponseError(response);
                setAuthError(errorMsg);
                throw new Error(errorMsg);
            }

            const data = await response.json();
            const access = data.tokens?.access || data.access;
            const refresh = data.tokens?.refresh || data.refresh;

            if (access && refresh) {
                localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN_KEY, access);
                localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN_KEY, refresh);
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                throw new Error("Missing credentials in server response.");
            }
        } catch (error: any) {
            if (!authError) setAuthError(error?.message || "Authentication failed.");
            throw error;
        } finally {
            setIsLoading(false); // <-- Added
        }
    }, [authError, clearAuthError]);




    const signUp = useCallback(async (
        email: string,
        password: string,
        first_name: string,
        last_name: string,
        phone: string | null
    ) => {
        clearAuthError();
        setIsLoading(true); // <-- Added

        try {
            const response = await fetch(ENDPOINTS.REGISTER, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: sanitizeInput(email),
                    password,
                    first_name: sanitizeInput(first_name),
                    last_name: sanitizeInput(last_name),
                    phone: phone ? sanitizeInput(phone) : "",
                }),
            });

            if (!response.ok) {
                const errorMsg = await parseResponseError(response);
                setAuthError(errorMsg);
                throw new Error(errorMsg);
            }

            const data = await response.json();
            const access = data.tokens?.access || data.access;
            const refresh = data.tokens?.refresh || data.refresh;

            if (access && refresh) {
                localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN_KEY, access);
                localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN_KEY, refresh);
                setUser(data.user);
                setIsAuthenticated(true);
            }
        } catch (error: any) {
            if (!authError) setAuthError(error?.message || "Registration failed.");
            throw error;
        } finally {
            setIsLoading(false); // <-- Added
        }
    }, [authError, clearAuthError]);




    const forgotPassword = useCallback(async (email: string) => {
        clearAuthError();
        setIsLoading(true); 
        
        try {
            const response = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: sanitizeInput(email) }),
            });

            if (!response.ok) {
                const errorMsg = await parseResponseError(response);
                setAuthError(errorMsg);
                throw new Error(errorMsg);
            }
        } finally {
            setIsLoading(false); 
        }
    }, [clearAuthError]);



    const resetPassword = useCallback(async (password: string) => {
        clearAuthError();
        setIsLoading(true); 

        try {
            const response = await fetch(ENDPOINTS.RESET_PASSWORD, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                const errorMsg = await parseResponseError(response);
                setAuthError(errorMsg);
                throw new Error(errorMsg);
            }

            setAuthRoute("login");
        } finally {
            setIsLoading(false); // <-- Added
        }
    }, [setAuthRoute, clearAuthError]);


    /* ========= Lifecycle initialization */

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const contextValue: AuthContextType = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        authError,
        authRoute,
        setAuthRoute,
        login,
        signUp,
        logout,
        forgotPassword,
        resetPassword,
        initializeAuth,
        clearAuthError,
    }), [
        user,
        isAuthenticated,
        isLoading,
        authError,
        authRoute,
        setAuthRoute,
        login,
        signUp,
        logout,
        forgotPassword,
        resetPassword,
        initializeAuth,
        clearAuthError,
    ]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider setup.");
    }
    return context;
};

export default AuthContext;