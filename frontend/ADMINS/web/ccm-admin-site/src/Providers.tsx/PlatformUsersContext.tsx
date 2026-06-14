import React, { createContext, useContext, useState, useCallback } from 'react';

export interface AppUserNode {
    id: string;
    maskedEmail: string;
    clearTextEmailProxy: string;
    dateJoined: string;
    accountRole: 'standard_user' | 'moderator_admin' | 'system_developer';
    accountStatus: 'active' | 'suspended_breach' | 'pending_verification';
    totalAlertsConfigured: number;
}

interface UsersContextType {
    users: AppUserNode[];
    isLoading: boolean;
    error: string | null;
    refreshDirectory: () => Promise<void>;
    createNewUser: (user: Omit<AppUserNode, 'id' | 'dateJoined' | 'maskedEmail'>) => Promise<void>;
    updateUserRole: (id: string, newRole: AppUserNode['accountRole']) => Promise<void>;
    mutateLifecycleState: (id: string, targetStatus: AppUserNode['accountStatus']) => Promise<void>;
    purgeUserAccount: (id: string) => Promise<void>;
}

const SEED_DIRECTORY_NODES: AppUserNode[] = [
    {
        id: "USR-0041-KE",
        maskedEmail: "mwangi.*******@gmail.com",
        clearTextEmailProxy: "mwangi.dev@gmail.com",
        dateJoined: "2026-05-12",
        accountRole: "system_developer",
        accountStatus: "active",
        totalAlertsConfigured: 14
    },
    {
        id: "USR-9912-KE",
        maskedEmail: "kamau.******@outlook.com",
        clearTextEmailProxy: "kamau.j@outlook.com",
        dateJoined: "2026-05-28",
        accountRole: "standard_user",
        accountStatus: "active",
        totalAlertsConfigured: 3
    },
    {
        id: "USR-3049-UG",
        maskedEmail: "atieno.******@yahoo.com",
        clearTextEmailProxy: "atieno_fit@yahoo.com",
        dateJoined: "2026-06-02",
        accountRole: "standard_user",
        accountStatus: "pending_verification",
        totalAlertsConfigured: 0
    },
    {
        id: "USR-1102-TZ",
        maskedEmail: "bad.actor.*****@gmail.com",
        clearTextEmailProxy: "bad.actor.scraping@gmail.com",
        dateJoined: "2026-06-05",
        accountRole: "standard_user",
        accountStatus: "suspended_breach",
        totalAlertsConfigured: 89
    }
];

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function PlatformUsersProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<AppUserNode[]>(SEED_DIRECTORY_NODES);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to generate a standardized email mask matchable to custom Django regex backends
    const generateMask = (email: string): string => {
        const [name, domain] = email.split('@');
        if (!name || !domain) return '******@anonymous.internal';
        const visible = name.substring(0, Math.min(3, name.length));
        return `${visible}.*******@${domain}`;
    };

    const refreshDirectory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Simulating picking up upstream changes safely
            setUsers(prev => [...prev]);
        } catch (err) {
            setError("Failed to sync client state with global IAM user directory service.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createNewUser = useCallback(async (newUserPayload: any) => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));

            const emailLower = newUserPayload.clearTextEmailProxy.trim().toLowerCase();

            setUsers((prev) => {
                if (prev.some(u => u.clearTextEmailProxy.toLowerCase() === emailLower)) {
                    throw new Error(`Data Integrity Exception: Email "${emailLower}" already registers an active identity link.`);
                }

                const generatedNode: AppUserNode = {
                    id: `USR-${Math.floor(1000 + Math.random() * 9000)}-KE`,
                    clearTextEmailProxy: emailLower,
                    maskedEmail: generateMask(emailLower),
                    dateJoined: new Date().toISOString().split('T')[0],
                    accountRole: newUserPayload.accountRole,
                    accountStatus: newUserPayload.accountStatus,
                    totalAlertsConfigured: 0
                };

                return [generatedNode, ...prev];
            });
        } catch (err: any) {
            setError(err.message || "Failed to populate identity database mapping.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateUserRole = useCallback(async (id: string, newRole: AppUserNode['accountRole']) => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 400));
            setUsers(prev => prev.map(u => u.id === id ? { ...u, accountRole: newRole } : u));
        } catch (err) {
            setError("Failed to commit authorization role mutation parameters.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const mutateLifecycleState = useCallback(async (id: string, targetStatus: AppUserNode['accountStatus']) => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 400));
            setUsers(prev => prev.map(u => {
                if (u.id === id) {
                    if (u.accountRole === 'system_developer' && targetStatus === 'suspended_breach') {
                        throw new Error("Security Guardrail Exception: Core engineering accounts cannot be modified to suspended workflows.");
                    }
                    return { ...u, accountStatus: targetStatus };
                }
                return u;
            }));
        } catch (err: any) {
            setError(err.message || "Failed to update target verification node lifecycle state.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const purgeUserAccount = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setUsers(prev => {
                const target = prev.find(u => u.id === id);
                if (target?.accountRole === 'system_developer') {
                    throw new Error("Fatal Security Overwrite Prevention: Cannot purge an active Core Engineer node from the live registry.");
                }
                return prev.filter(u => u.id !== id);
            });
        } catch (err: any) {
            setError(err.message || "Failed to safely decommission identity vector context.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <UsersContext.Provider
            value={{
                users,
                isLoading,
                error,
                refreshDirectory,
                createNewUser,
                updateUserRole,
                mutateLifecycleState,
                purgeUserAccount
            }}
        >
            {children}
        </UsersContext.Provider>
    );
}

export function usePlatformUsers() {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error("usePlatformUsers hook must be bound within a PlatformUsersProvider node tree context.");
    }
    return context;
}