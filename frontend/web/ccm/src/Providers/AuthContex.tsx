import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

/* ==========================================================================
   TYPES
   ========================================================================== */

export type AuthRoute =
    | "login"
    | "signup"
    | "forgot-password"
    | "reset-password";

export interface AuthUser {
    id: string | null;
    phone: string | null;
    email: string;
    first_name: string;
    last_name: string;
    dob: any|null;
    gender:string |null;
    country:string|null;

    is_merchant: boolean;
    search_allowance: number | any | null;
    is_on_free_tier: boolean;
    current_tier_use: number;
    free_tier_search_limit: number;
    eligible: boolean | null ;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    authError: string | null;
    authRoute: AuthRoute;
    setAuthRoute: (route: AuthRoute) => void;
    changeAuthRoute: (route: AuthRoute) => void;
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
    refreshAccessToken: () => Promise<boolean>;
}

/* ==========================================================================
   CONFIG
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

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const AUTH_ROUTE_KEY = "auth_route";

/* ==========================================================================
   CONTEXT
   ========================================================================== */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ==========================================================================
   HELPERS
   ========================================================================== */

const sanitizeInput = (value: string) => value.trim().replace(/[<>]/g, "");

const parseResponseError = async (response: Response): Promise<string> => {
    try {
        const data = await response.json();

        if (typeof data === "string") {
            return data;
        }

        if (data.detail) {
            return data.detail;
        }

        const errors = Object.values(data)
            .flat()
            .join(", ");

        return errors || "Request failed.";
    } catch {
        return "Unexpected server error.";
    }
};

/* ==========================================================================
   PROVIDER
   ========================================================================== */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [authRoute, setAuthRouteState] = useState<AuthRoute>(() => {
        const saved = sessionStorage.getItem(AUTH_ROUTE_KEY) as AuthRoute | null;
        return saved || "login";
    });

    const mountedRef = useRef(true);

    /* ======================================================
       ROUTES
    ====================================================== */

    const changeAuthRoute = useCallback((route: AuthRoute) => {
        sessionStorage.setItem(AUTH_ROUTE_KEY, route);
        setAuthRouteState(route);
    }, []);

    const setAuthRoute = useCallback((route: AuthRoute) => {
        changeAuthRoute(route);
    }, [changeAuthRoute]);

    /* ======================================================
       TOKENS
    ====================================================== */

    const saveTokens = (access: string, refresh: string) => {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, access);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    };

    const clearTokens = () => {
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    };

    /* ======================================================
       REFRESH TOKEN
    ====================================================== */

    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        try {
            const refresh = sessionStorage.getItem(REFRESH_TOKEN_KEY);
            if (!refresh) return false;

            const response = await fetch(ENDPOINTS.REFRESH, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh }),
            });

            if (!response.ok) return false;

            const data = await response.json();
            
            // Handles both structures: data.tokens.access or top-level data.access
            const newAccess = data.tokens?.access || data.access;
            const newRefresh = data.tokens?.refresh || data.refresh;

            if (newAccess) sessionStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
            if (newRefresh) sessionStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);

            return true;
        } catch {
            return false;
        }
    }, []);

    /* ======================================================
       INIT
    ====================================================== */

    const initializeAuth = useCallback(async () => {
        try {
            setIsLoading(true);
            const access = sessionStorage.getItem(ACCESS_TOKEN_KEY);

            if (!access) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

            let response = await fetch(ENDPOINTS.VALIDATE_TOKEN, {
                headers: { Authorization: `Bearer ${access}` },
            });

            if (!response.ok) {
                const refreshed = await refreshAccessToken();

                if (!refreshed) {
                    clearTokens();
                    setUser(null);
                    setIsAuthenticated(false);
                    return;
                }

                const newAccess = sessionStorage.getItem(ACCESS_TOKEN_KEY);
                response = await fetch(ENDPOINTS.VALIDATE_TOKEN, {
                    headers: { Authorization: `Bearer ${newAccess}` },
                });
            }

            if (!response.ok) throw new Error();

            const data = await response.json();

            if (!mountedRef.current) return;

            setUser(data.user);
            setIsAuthenticated(true);
        } catch {
            clearTokens();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [refreshAccessToken]);

    /* ======================================================
       LOGIN
    ====================================================== */

    const login = useCallback(async (phone: string, password: string) => {
        setAuthError(null);

        if (!phone) {
            throw new Error("Please enter your phone number.");
        }

        const response = await fetch(ENDPOINTS.LOGIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phone: sanitizeInput(phone),
                password,
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

        saveTokens(access, refresh);
        setUser(data.user);
        setIsAuthenticated(true);
    }, []);

    /* ======================================================
       SIGNUP
    ====================================================== */

    const signUp = useCallback(async (
        email: string,
        password: string,
        first_name: string,
        last_name: string,
        phone: string | null
    ) => {
        setAuthError(null);

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

        saveTokens(access, refresh);
        setUser(data.user);
        setIsAuthenticated(true);
    }, []);

    /* ======================================================
       LOGOUT
    ====================================================== */

    const logout = useCallback(async () => {
        try {
            const refresh = sessionStorage.getItem(REFRESH_TOKEN_KEY);
            if (refresh) {
                await fetch(ENDPOINTS.LOGOUT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh }),
                });
            }
        } catch {
            // Silently fail if server logout endpoint drops
        } finally {
            clearTokens();
            setUser(null);
            setIsAuthenticated(false);
            changeAuthRoute("login");
        }
    }, [changeAuthRoute]);

    /* ======================================================
       PASSWORDS
    ====================================================== */

    const forgotPassword = useCallback(async (email: string) => {
        const response = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: sanitizeInput(email) }),
        });

        if (!response.ok) {
            throw new Error(await parseResponseError(response));
        }
    }, []);

    const resetPassword = useCallback(async (password: string) => {
        const response = await fetch(ENDPOINTS.RESET_PASSWORD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) {
            throw new Error(await parseResponseError(response));
        }

        changeAuthRoute("login");
    }, [changeAuthRoute]);

    /* ======================================================
       EFFECTS
    ====================================================== */

    useEffect(() => {
        mountedRef.current = true;
        initializeAuth();
        return () => {
            mountedRef.current = false;
        };
    }, [initializeAuth]);

    /* ======================================================
       VALUE
    ====================================================== */

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        authError,
        authRoute,
        setAuthRoute,
        changeAuthRoute,
        login,
        signUp,
        logout,
        forgotPassword,
        resetPassword,
        initializeAuth,
        refreshAccessToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/* ==========================================================================
   HOOK
   ========================================================================== */

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;