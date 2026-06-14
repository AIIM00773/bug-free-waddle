import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    useMemo,
} from "react";

/* ==========================================================================
   TYPES
   ========================================================================== */

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

/* ==========================================================================
   CONFIG & ENDPOINTS
   ========================================================================== */

const API_BASE_URL = "http://127.0.0.1:8000";

const ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/api/users/login/`,
    REGISTER: `${API_BASE_URL}/api/users/register/`,
    REFRESH: `${API_BASE_URL}/auth/api/token/refresh/`,
    LOGOUT: `${API_BASE_URL}/api/users/logout/`,
    FORGOT_PASSWORD: `${API_BASE_URL}/users/api/auth/forgot-password/`,
    RESET_PASSWORD: `${API_BASE_URL}/users/api/auth/reset-password/`,
    VALIDATE_TOKEN: `${API_BASE_URL}/api/users/validate-token/`,
};

// Isolated keys to avoid collisions with admin workspace tokens on localhost
const ACCESS_TOKEN_KEY = "soko_user_access_token";
const REFRESH_TOKEN_KEY = "soko_user_refresh_token";
const AUTH_ROUTE_KEY = "soko_user_auth_route";

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */

const sanitizeInput = (value: string): string => {
    return value.trim().replace(/[<>]/g, "");
};

const parseResponseError = async (response: Response): Promise<string> => {
    try {
        const data = await response.json();
        if (typeof data === "string") return data;
        if (data.detail) return data.detail;
        
        // Handle Django Rest Framework dictionary validation arrays
        if (data && typeof data === "object") {
            const errors = Object.values(data)
                .flat()
                .filter((val) => typeof val === "string")
                .join(", ");
            return errors || "Validation challenge intercept dropped.";
        }
        return "Request validation rejected.";
    } catch {
        return `Server responded with status code: ${response.status}`;
    }
};

/* ==========================================================================
   CONTEXT INITIALIZATION
   ========================================================================== */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ==========================================================================
   PROVIDER ENGINE
   ========================================================================== */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [authError, setAuthError] = useState<string | null>(null);
    
    const [authRoute, setAuthRouteState] = useState<AuthRoute>(() => {
        try {
            const saved = localStorage.getItem(AUTH_ROUTE_KEY) as AuthRoute | null;
            return saved && ["login", "signup", "forgot-password", "reset-password"].includes(saved) 
                ? saved 
                : "login";
        } catch {
            return "login";
        }
    });

    const clearAuthError = useCallback(() => setAuthError(null), []);

    const setAuthRoute = useCallback((route: AuthRoute) => {
        try {
            localStorage.setItem(AUTH_ROUTE_KEY, route);
        } catch (err) {
            console.warn("Storage write stream blocked:", err);
        }
        setAuthRouteState(route);
    }, []);

    /* ======================================================
       TOKEN ROTATION MUTATION HANDLERS
       ====================================================== */

    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
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

            if (newAccess) localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
            if (newRefresh) localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);

            return true;
        } catch {
            return false;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
            if (refresh) {
                await fetch(ENDPOINTS.LOGOUT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh }),
                });
            }
        } catch (err) {
            console.warn("Server side session revocation dropped silently:", err);
        } finally {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            setUser(null);
            setIsAuthenticated(false);
            setAuthRoute("login");
            clearAuthError();
        }
    }, [setAuthRoute, clearAuthError]);

    /* ======================================================
       AUTHENTICATION CORE INTERFACE HANDSHAKES
       ====================================================== */

    const initializeAuth = useCallback(async () => {
        setIsLoading(true);
        const access = localStorage.getItem(ACCESS_TOKEN_KEY);

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

                const newAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
                response = await fetch(ENDPOINTS.VALIDATE_TOKEN, {
                    headers: { Authorization: `Bearer ${newAccess}` },
                });
            }

            if (!response.ok) throw new Error("Token resolution verification invalid");

            const data = await response.json();
            setUser(data.user);
            setIsAuthenticated(true);
        } catch {
            await logout();
        } finally {
            setIsLoading(false);
        }
    }, [refreshAccessToken, logout]);

    const login = useCallback(async (phone: string, password: string) => {
        clearAuthError();
        const cleanPhone = sanitizeInput(phone);

        if (!cleanPhone) {
            throw new Error("Please enter a valid phone verification routing string.");
        }

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
                localStorage.setItem(ACCESS_TOKEN_KEY, access);
                localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                throw new Error("Missing authentication credentials in server response.");
            }
        } catch (error: any) {
            if (!authError) setAuthError(error?.message || "Authentication attempt aborted.");
            throw error;
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
                localStorage.setItem(ACCESS_TOKEN_KEY, access);
                localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
                setUser(data.user);
                setIsAuthenticated(true);
            }
        } catch (error: any) {
            if (!authError) setAuthError(error?.message || "Registration trace rejected.");
            throw error;
        }
    }, [authError, clearAuthError]);

    const forgotPassword = useCallback(async (email: string) => {
        clearAuthError();
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
    }, [clearAuthError]);

    const resetPassword = useCallback(async (password: string) => {
        clearAuthError();
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
    }, [setAuthRoute, clearAuthError]);

    /* ======================================================
       INITIALIZATION RUNTIME DEPLOYMENT
       ====================================================== */

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
        clearAuthError
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
        clearAuthError
    ]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

/* ==========================================================================
   HOOKS EXTRACTION
   ========================================================================== */

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth operations hook execution requires instantiation inside an AuthProvider element layout container.");
    }
    return context;
};

export default AuthContext;