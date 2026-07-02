import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ======================================================
// TYPE DEFINITIONS & SCHEMAS
// ======================================================
export interface AppUser {
    id: string; 
    maskedEmail: string;
    clearTextEmailProxy: string;
    dateJoined: string;
    accountRole: 'standard_user' | 'moderator_admin' | 'system_developer';
    accountStatus: 'active' | 'suspended_breach' | 'pending_verification';
    totalAlertsConfigured: number;
}

export type CreateUserPayload = Omit<AppUser, 'id' | 'dateJoined' | 'maskedEmail'>;

interface UsersContextType {
    users: AppUser[];
    isLoading: boolean;
    error: string | null;
    refreshDirectory: () => Promise<void>;
    createNewUser: (payload: CreateUserPayload) => Promise<void>;
    updateUserRole: (id: string, newRole: AppUser['accountRole']) => Promise<void>;
    updateUserStatus: (id: string, targetStatus: AppUser['accountStatus']) => Promise<void>;
    deleteUserAccount: (id: string) => Promise<void>;
}

// ======================================================
// CONFIGURATION & CORE HELPERS
// ======================================================
const UsersContext = createContext<UsersContextType | undefined>(undefined);
const TOKEN_KEY = 'soko_ai_admin_token';
const API_BASE_URL = 'http://127.0.0.1:8000/adm/root/api/v1/cd7bbe787516468fbd92b361b6be452f/users';

const getAuthHeaders = (): HeadersInit => {
    try {
        const rawTokens = sessionStorage.getItem(TOKEN_KEY);
        const access = rawTokens ? JSON.parse(rawTokens)?.access : null;
        
        return {
            'Content-Type': 'application/json',
            ...(access ? { 'Authorization': `Bearer ${access}` } : {}),
        };
    } catch {
        return { 'Content-Type': 'application/json' };
    }
};

// ======================================================
// PROVIDER ENGINE IMPLEMENTATION
// ======================================================
export function PlatformUsersProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch User Directory (GET)
    const refreshDirectory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.detail || "Failed to sync client state with user directory.");
            }
            setUsers(data.users || data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown sync error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. Provision New User (POST)
    const createNewUser = useCallback(async (payload: CreateUserPayload) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.detail || "Failed to create identity record mapping.");
            }
            setUsers((prev) => [data, ...prev]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to execute create operations.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 3. Mutate Administrative Authorization Role (PUT)
    const updateUserRole = useCallback(async (id: string, newRole: AppUser['accountRole']) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ accountRole: newRole }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.detail || "Failed to commit authorization role modifications.");
            }
            setUsers((prev) => prev.map((u) => (u.id === id ? data : u)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to complete security role change.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 4. Mutate Security Lifecycle State (PUT)
    const updateUserStatus = useCallback(async (id: string, targetStatus: AppUser['accountStatus']) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ accountStatus: targetStatus }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.detail || "Failed to update target node lifecycle state.");
            }
            setUsers((prev) => prev.map((u) => (u.id === id ? data : u)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to alter account validation status.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 5. Decommission Identity Vector (DELETE)
    const deleteUserAccount = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || data.detail || "Failed to safely decommission identity context.");
            }
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Decommission execution pipeline failed.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Memoize value to lock down and prevent downstream component updates
    const contextValue = useMemo(() => ({
        users,
        isLoading,
        error,
        refreshDirectory,
        createNewUser,
        updateUserRole,
        updateUserStatus,
        deleteUserAccount
    }), [users, isLoading, error, refreshDirectory, createNewUser, updateUserRole, updateUserStatus, deleteUserAccount]);

    return (
        <UsersContext.Provider value={contextValue}>
            {children}
        </UsersContext.Provider>
    );
}

// ======================================================
// CONSUMPTION HOOK
// ======================================================
export function usePlatformUsers() {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error("usePlatformUsers must be executed inside an initialized PlatformUsersProvider engine wrapper.");
    }
    return context;
}