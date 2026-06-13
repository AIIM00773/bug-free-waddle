import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "soko_ai_admin_user";
const TOKEN_KEY = "soko_ai_admin_token";

const API_BASE = "http://127.0.0.1:8000";

// ======================================================
// TYPES (MATCH BACKEND RESPONSE)
// ======================================================

export interface AdminUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

interface LoginResponse {
    access: string;
    refresh: string;
    user: AdminUser;
    mfa_required?: boolean;
}

interface RefreshResponse {
    access: string;
}

interface AdminAuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    isMfaRequired: boolean;

    adminUser: AdminUser | null;
    sessionToken: AuthTokens | null;

    authError: string | null;

    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;

    refreshAuth: () => Promise<void>;
    clearAuthError: () => void;

    getAccessToken: () => string | null;
    getRefreshToken: () => string | null;
}

// ======================================================
// CONTEXT
// ======================================================

const AdminAuthContext = createContext<
    AdminAuthContextType | undefined
>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export function AdminAuthProvider({ children }: { children: ReactNode }) {

    const [sessionToken, setSessionToken] = useState<AuthTokens | null>(() => {
        try {
            const stored = sessionStorage.getItem(TOKEN_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isMfaRequired, setIsMfaRequired] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const isAuthenticated =
        !!sessionToken?.access && !!adminUser && adminUser.is_active;

    // ======================================================
    // HELPERS
    // ======================================================

    const clearAuthError = () => setAuthError(null);

    const getAccessToken = () => sessionToken?.access ?? null;
    const getRefreshToken = () => sessionToken?.refresh ?? null;

    const persistAuth = (tokens: AuthTokens, user: AdminUser) => {
        sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));

        setSessionToken(tokens);
        setAdminUser(user);
    };

    const clearAuth = () => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(STORAGE_KEY);

        setSessionToken(null);
        setAdminUser(null);
        setIsMfaRequired(false);
        setAuthError(null);
    };

    // ======================================================
    // LOGIN
    // ======================================================

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setAuthError(null);

        try {
            const response = await fetch(
                `${API_BASE}/adm/root/auth/login/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            const data: LoginResponse = await response.json();

            if (!response.ok) {
                throw new Error(
                    (data as any)?.detail ||
                    "Invalid username or password"
                );
            }

            if (data.mfa_required) {
                setIsMfaRequired(true);
                return false;
            }

            persistAuth(
                {
                    access: data.access,
                    refresh: data.refresh,
                },
                data.user
            );

            return true;
        } catch (error: any) {
            setAuthError(error?.message ?? "Authentication failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // ======================================================
    // REFRESH TOKEN
    // ======================================================

    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        if (!sessionToken?.refresh) return false;

        try {
            const response = await fetch(
                `${API_BASE}/api/admin/auth/token/refresh/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        refresh: sessionToken.refresh,
                    }),
                }
            );

            if (!response.ok) return false;

            const data: RefreshResponse = await response.json();

            const updated: AuthTokens = {
                ...sessionToken,
                access: data.access,
            };

            setSessionToken(updated);
            sessionStorage.setItem(TOKEN_KEY, JSON.stringify(updated));

            return true;
        } catch {
            return false;
        }
    }, [sessionToken]);

    // ======================================================
    // AUTH RESTORE (/me equivalent)
    // ======================================================

    const refreshAuth = useCallback(async () => {
        if (!sessionToken?.access) {
            setIsLoading(false);
            return;
        }

        try {
            let response = await fetch(
                `${API_BASE}/adm/root/auth/me/`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionToken.access}`,
                    },
                }
            );

            if (response.status === 401) {
                const refreshed = await refreshAccessToken();

                if (!refreshed) throw new Error("Session expired");

                const latest = JSON.parse(
                    sessionStorage.getItem(TOKEN_KEY) || "{}"
                ) as AuthTokens;

                response = await fetch(
                    `${API_BASE}/api/admin/auth/me/`,
                    {
                        headers: {
                            Authorization: `Bearer ${latest.access}`,
                        },
                    }
                );
            }

            if (!response.ok) throw new Error("Auth failed");

            const user: AdminUser = await response.json();

            setAdminUser(user);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } catch {
            clearAuth();
        } finally {
            setIsLoading(false);
        }
    }, [sessionToken, refreshAccessToken]);

    // ======================================================
    // INIT
    // ======================================================

    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    // ======================================================
    // CONTEXT VALUE
    // ======================================================

    const value: AdminAuthContextType = {
        isAuthenticated,
        isLoading,
        isMfaRequired,

        adminUser,
        sessionToken,

        authError,

        login,
        logout: clearAuth,

        refreshAuth,
        clearAuthError,

        getAccessToken,
        getRefreshToken,
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
}

// ======================================================
// HOOK
// ======================================================

export function useAdminAuth() {
    const ctx = useContext(AdminAuthContext);

    if (!ctx) {
        throw new Error("useAdminAuth must be used within AdminAuthProvider");
    }

    return ctx;
}