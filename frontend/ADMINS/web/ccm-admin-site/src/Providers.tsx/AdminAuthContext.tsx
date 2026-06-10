import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ==========================================
// 1. HARDENED PRODUCTION TYPE DEFINITIONS
// ==========================================
export type AdminRole =
    | 'SuperAdmin'
    | 'SecOps'
    | 'DataEngineer'
    | 'CustomerService'
    | 'SecurityAnalyzer'
    | 'Sales'
    | 'Marketing';


export interface AdminUser {
    username: string;
    role: AdminRole;
    establishedAt: string;
    email?: string;
}



interface AdminAuthContextType {
    isAuthenticated: boolean;
    isMfaRequired: boolean;
    adminUser: AdminUser | null;
    sessionToken: string | null;
    authError: string | null;
    isProcessing: boolean;
    initiateFirstStep: (username: string, password: string) => Promise<boolean>;
    verifyMfaToken: (token: string) => Promise<boolean>;
    terminateAdminSession: () => void;
    clearAuthErrors: () => void;
}



const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'soko_ai_admin_payload';
const TOKEN_KEY = 'soko_ai_admin_token';

// ==========================================
// 2. BACKEND API PLACEHOLDER CONFIGURATION
// ==========================================


// TODO: Swap out this mock structure with your real Axios/Fetch client module configuration:
// import api from '../Services/apiClient'; 
const api = {
    post: async (url: string, data: any): Promise<any> => {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Network simulation delay loop

        if (url.includes('/step-one/')) {
            if (data.username.trim().toLowerCase() === 'admin' && data.password === 'admin') {
                return { data: { mfa_required: true, status: 'awaiting_token' } };
            }
            throw new Error('Invalid administrative operator credentials.');
        }

        if (url.includes('/step-two/')) {
            if (data.token === '0000') {
                return {
                    data: {
                        token: `sk_admin_live_${btoa(data.username + Date.now())}`,
                        user: {
                            username: data.username,
                            role: 'SuperAdmin',
                            establishedAt: new Date().toISOString()
                        }
                    }
                };
            }
            throw new Error('Multi-Factor verification hash failed. Trace signature mismatched.');
        }
    }
};




// ==========================================
// 3. CORE AUTH PROVIDER IMPLEMENTATION
// ==========================================
export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [sessionToken, setSessionToken] = useState<string | null>(() => {
        try {
            return sessionStorage.getItem(TOKEN_KEY);
        } catch {
            return null; // Prevents crash if browser disables sessionStorage privacy loops
        }
    });

    const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [isMfaRequired, setIsMfaRequired] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [stashedUsername, setStashedUsername] = useState<string | null>(null);

    // Synchronize state loops safely against session storage changes & update network clients
    useEffect(() => {
        try {
            if (sessionToken && adminUser) {
                sessionStorage.setItem(TOKEN_KEY, sessionToken);
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));

                // --- ENDPOINT PLUG: Global Auth Header Mounting ---
                // Automatically appends Bearer validation to every downstream request node
                // api.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
            } else {
                sessionStorage.removeItem(TOKEN_KEY);
                sessionStorage.removeItem(STORAGE_KEY);

                // --- ENDPOINT PLUG: Global Auth Header Flushing ---
                // delete api.defaults.headers.common['Authorization'];
            }
        } catch (err) {
            console.error("Storage sync failure on authentication state transaction:", err);
        }
    }, [sessionToken, adminUser]);

    const clearAuthErrors = () => setAuthError(null);

    const initiateFirstStep = async (username: string, password: string): Promise<boolean> => {
        setIsProcessing(true);
        setAuthError(null);

        try {
            // --- ENDPOINT PLUG: Swap with true api route payload ---
            const response = await api.post('/api/v1/admin/auth/step-one/', {
                username: username.trim(),
                password
            });

            if (response.data.mfa_required) {
                setStashedUsername(username.trim());
                setIsMfaRequired(true);
                return true;
            }

            return false;
        } catch (err: any) {
            // Gracefully maps Axios error messages vs standard system exceptions
            const systemMessage = err.response?.data?.detail || err.message || 'A catastrophic handshake error occurred on the security route.';
            setAuthError(systemMessage);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const verifyMfaToken = async (token: string): Promise<boolean> => {
        if (!stashedUsername) {
            setAuthError('Authentication sequence workflow broken. Please start from step one.');
            return false;
        }

        setIsProcessing(true);
        setAuthError(null);

        try {
            // --- ENDPOINT PLUG: Swap with true verification network profile response ---
            const response = await api.post('/api/v1/admin/auth/step-two/', {
                username: stashedUsername,
                token
            });

            const { token: receivedToken, user: receivedUser } = response.data;

            setSessionToken(receivedToken);
            setAdminUser({
                username: receivedUser.username,
                role: receivedUser.role as AdminRole,
                establishedAt: receivedUser.establishedAt
            });

            setIsMfaRequired(false);
            setStashedUsername(null);
            return true;
        } catch (err: any) {
            const systemMessage = err.response?.data?.detail || err.message || 'MFA validation layer timed out.';
            setAuthError(systemMessage);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const terminateAdminSession = () => {
        setSessionToken(null);
        setAdminUser(null);
        setIsMfaRequired(false);
        setStashedUsername(null);
        setAuthError(null);
        try {
            sessionStorage.clear();
        } catch (err) {
            console.warn("Session isolation clearance caught exception:", err);
        }
    };

    return (
        <AdminAuthContext.Provider
            value={{
                isAuthenticated: !!sessionToken,
                isMfaRequired,
                adminUser,
                sessionToken,
                authError,
                isProcessing,
                initiateFirstStep,
                verifyMfaToken,
                terminateAdminSession,
                clearAuthErrors
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}

// Custom security hook ensuring context structures are strictly called within provider barriers
export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be executed within an explicit <AdminAuthProvider /> block loop.');
    }
    return context;
}