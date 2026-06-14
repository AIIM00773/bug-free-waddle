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

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

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

    const isAuthenticated = !!sessionToken?.access && !!adminUser && adminUser.is_active;

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

    const logout = useCallback(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        setSessionToken(null);
        setAdminUser(null);
        setIsMfaRequired(false);
        setAuthError(null);
    }, []);

    // ======================================================
    // CORE ASYNCHRONOUS ENGINE OPERATIONS
    // ======================================================

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setAuthError(null);

        try {
            const response = await fetch(`${API_BASE}/adm/root/auth/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data: LoginResponse = await response.json();

            if (!response.ok) {
                throw new Error((data as any)?.detail || "Invalid username or password");
            }

            if (data.mfa_required) {
                setIsMfaRequired(true);
                return false;
            }

            persistAuth({ access: data.access, refresh: data.refresh }, data.user);
            return true;
        } catch (error: any) {
            setAuthError(error?.message ?? "Authentication failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshAccessToken = useCallback(async (currentRefreshToken: string): Promise<string | null> => {
        try {
            const response = await fetch(`${API_BASE}/adm/root/auth/token/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: currentRefreshToken }),
            });

            if (!response.ok) return null;

            const data: RefreshResponse = await response.json();
            return data.access;
        } catch {
            return null;
        }
    }, []);

    const refreshAuth = useCallback(async () => {
        // Read directly from storage to get the fresh tokens for bootstrap initialization execution
        let tokenData: AuthTokens | null = null;
        try {
            const stored = sessionStorage.getItem(TOKEN_KEY);
            if (stored) tokenData = JSON.parse(stored);
        } catch {
            tokenData = null;
        }

        if (!tokenData?.access) {
            setIsLoading(false);
            return;
        }

        try {
            let response = await fetch(`${API_BASE}/adm/root/auth/me/`, {
                headers: { Authorization: `Bearer ${tokenData.access}` },
            });

            if (response.status === 401 && tokenData.refresh) {
                const newAccessToken = await refreshAccessToken(tokenData.refresh);

                if (!newAccessToken) {
                    throw new Error("Session refresh window expired");
                }

                const updatedTokens: AuthTokens = {
                    ...tokenData,
                    access: newAccessToken,
                };

                setSessionToken(updatedTokens);
                sessionStorage.setItem(TOKEN_KEY, JSON.stringify(updatedTokens));

                response = await fetch(`${API_BASE}/adm/root/auth/me/`, {
                    headers: { Authorization: `Bearer ${newAccessToken}` },
                });
            }

            if (!response.ok) throw new Error("Profile structure sync validation failed");

            const user: AdminUser = await response.json();
            setAdminUser(user);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } catch {
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [refreshAccessToken, logout]);

    // ======================================================
    // INITIALIZATION LOCK
    // ======================================================

    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    const value: AdminAuthContextType = {
        isAuthenticated,
        isLoading,
        isMfaRequired,
        adminUser,
        sessionToken,
        authError,
        login,
        logout,
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
        throw new Error("useAdminAuth must be used within an initialized AdminAuthProvider engine wrapper");
    }
    return ctx;
}