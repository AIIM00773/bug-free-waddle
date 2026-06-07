import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    useContext,
} from "react";



/* =========================================================================
   TYPES & CONFIG
   ========================================================================= */

export type AuthRoute =
    | "login"
    | "signup"
    | "forgot-password"
    | "reset-password";



interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    remindAlertActive: boolean;
    authRoute: AuthRoute;
    setAuthRoute: (route: AuthRoute) => void;
    changeAuthRoute: (route: AuthRoute) => void;
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, firstName: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (newPassword: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    initializeAuth: () => Promise<void>;
    remindToLogin: () => void;
    dismissReminder: () => void;
    authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "authToken";
const REMINDER_INTERVAL = 3 * 60 * 1000; // 3 minutes

// Centralized API configuration endpoint base
const API_BASE_URL =  "https://example.com/signup";

/* =========================================================================
   SECURITY & UTILS HELPERS
   ========================================================================= */

/**
 * Trims and strips dangerous basic HTML elements to protect against basic injection vectors.
 */
const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, "");
};

/**
 * Normalizes backend error exceptions down to a consumer-friendly UI message.
 */
const parseResponseError = async (response: Response): Promise<string> => {
    try {
        const errorData = await response.json();
        return errorData.message || errorData.error || `Error: Code ${response.status}`;
    } catch {
        return `Server encountered an issue (${response.status}). Please try again later.`;
    }
};

/* =========================================================================
   PROVIDER
   ========================================================================= */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [remindAlertActive, setRemindAlertActive] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const [authRoute, setAuthRouteState] = useState<AuthRoute>(() => {
        try {
            const savedRoute = sessionStorage.getItem("authRoute") as AuthRoute;
            return savedRoute || "login";
        } catch {
            return "login";
        }
    });

    const reminderIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isMounted = useRef<boolean>(true);

    // Track component mounting lifecycle to prevent setting state on unmounted trees
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Global Error Auto-dismissal
    useEffect(() => {
        if (authError) {
            const timer = setTimeout(() => {
                if (isMounted.current) setAuthError(null);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [authError]);

    /* ================================
       ROUTE CONTROL
    ================================= */

    const changeAuthRoute = useCallback((route: AuthRoute) => {
        try {
            sessionStorage.setItem("authRoute", route);
            setAuthRouteState(route);
        } catch (err) {
            setAuthRouteState(route);
        }
    }, []);

    const setAuthRoute = useCallback((route: AuthRoute) => {
        changeAuthRoute(route);
    }, [changeAuthRoute]);

    /* ================================
       REMINDER SYSTEM
    ================================= */

    const dismissReminder = useCallback(() => {
        setRemindAlertActive(false);
    }, []);

    const remindToLogin = useCallback(() => {
        if (isAuthenticated) return;
        setRemindAlertActive(true);
    }, [isAuthenticated]);

    const stopReminderCycle = useCallback(() => {
        if (reminderIntervalRef.current) {
            clearInterval(reminderIntervalRef.current);
            reminderIntervalRef.current = null;
        }
    }, []);

    const startReminderCycle = useCallback(() => {
        stopReminderCycle();
        if (isAuthenticated) return;

        reminderIntervalRef.current = setInterval(() => {
            try {
                const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
                if (!token && isMounted.current) {
                    setRemindAlertActive(true);
                }
            } catch {
                if (isMounted.current) setRemindAlertActive(true);
            }
        }, REMINDER_INTERVAL);
    }, [isAuthenticated, stopReminderCycle]);

    /* ================================
       AUTH INITIALIZATION
    ================================= */

    const initializeAuth = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
            
            if (!token) {
                if (isMounted.current) {
                    setIsAuthenticated(false);
                    startReminderCycle();
                }
                return;
            }

            // OPTIONAL SECURITY STEP: Place an API validation ping here to verify token expiry
            /*
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Expired Token");
            */

            if (isMounted.current) {
                setIsAuthenticated(true);
                stopReminderCycle();
            }
        } catch (err) {
            try {
                sessionStorage.removeItem(AUTH_TOKEN_KEY);
            } catch {}
            if (isMounted.current) {
                setIsAuthenticated(false);
                setAuthError("Session expired. Please log in again.");
                startReminderCycle();
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, [startReminderCycle, stopReminderCycle]);

    /* ================================
       AUTH ACTIONS
    ================================= */

    const login = useCallback(
        async (email: string, password: string) => {
            if (!email || !password) {
                setAuthError("Email and password fields are required.");
                return;
            }

            const sanitizedEmail = sanitizeInput(email);

            try {
                setIsLoading(true);
                // PLACE YOUR ACTUAL LOGIN ROUTE HERE
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: sanitizedEmail, password }),
                });

                if (!response.ok) {
                    const errMsg = await parseResponseError(response);
                    throw new Error(errMsg);
                }

                const data = await response.json();
                
                // Assuming backend drops a token payload key named 'token' or 'accessToken'
                const token = data.token || "mock-valid-fallback-token";
                
                sessionStorage.setItem(AUTH_TOKEN_KEY, token);

                if (isMounted.current) {
                    setIsAuthenticated(true);
                    setRemindAlertActive(false);
                    setAuthError(null);
                    stopReminderCycle();
                }
            } catch (err: any) {
                if (isMounted.current) {
                    setAuthError(err.message || "An unexpected login connection error occurred.");
                }
                throw err;
            } finally {
                if (isMounted.current) setIsLoading(false);
            }
        },
        [stopReminderCycle]
    );

    const signUp = useCallback(
        async (email: string, password: string, firstName: string) => {
            if (!email || !password || !firstName) {
                setAuthError("All matching signup credentials are required.");
                return;
            }

            const sanitizedEmail = sanitizeInput(email);
            const sanitizedName = sanitizeInput(firstName);

            try {
                setIsLoading(true);
                // PLACE YOUR ACTUAL SIGNUP ROUTE HERE
                const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        email: sanitizedEmail, 
                        password, 
                        firstName: sanitizedName 
                    }),
                });

                if (!response.ok) {
                    const errMsg = await parseResponseError(response);
                    throw new Error(errMsg);
                }

                const data = await response.json();
                const token = data.token || "mock-valid-fallback-token";

                sessionStorage.setItem(AUTH_TOKEN_KEY, token);

                if (isMounted.current) {
                    setIsAuthenticated(true);
                    setRemindAlertActive(false);
                    setAuthError(null);
                    stopReminderCycle();
                }
            } catch (err: any) {
                if (isMounted.current) {
                    setAuthError(err.message || "Account creation failed connection check.");
                }
                throw err;
            } finally {
                if (isMounted.current) setIsLoading(false);
            }
        },
        [stopReminderCycle]
    );

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
            
            if (token) {
                // PLACE YOUR ACTUAL LOGOUT ROUTE HERE (To blacklist token server-side)
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }).catch(() => {
                    // Gracefully silence server failures on logging out out-of-date sessions
                });
            }
        } finally {
            try {
                sessionStorage.removeItem(AUTH_TOKEN_KEY);
            } catch {}
            
            if (isMounted.current) {
                setIsAuthenticated(false);
                setRemindAlertActive(true);
                setIsLoading(false);
                startReminderCycle();
            }
        }
    }, [startReminderCycle]);

    /* ================================
       PASSWORD FLOWS
    ================================= */

    const forgotPassword = useCallback(async (email: string) => {
        if (!email) {
            setAuthError("Please provide your email address.");
            return;
        }

        const sanitizedEmail = sanitizeInput(email);

        try {
            setIsLoading(true);
            // PLACE YOUR ACTUAL FORGOT PASSWORD ROUTE HERE
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: sanitizedEmail }),
            });

            if (!response.ok) {
                const errMsg = await parseResponseError(response);
                throw new Error(errMsg);
            }
            
            if (isMounted.current) {
                setAuthError(null); // Success clears out any older errors
            }
        } catch (err: any) {
            if (isMounted.current) {
                setAuthError(err.message || "Failed to process recovery request.");
            }
            throw err;
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (newPassword: string) => {
        if (!newPassword) {
            setAuthError("New password cannot be left blank.");
            return;
        }

        try {
            setIsLoading(true);
            // PLACE YOUR ACTUAL RESET PASSWORD ROUTE HERE
            // Note: Typically you will need to extract a token parameter via URL query parameters
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword }),
            });

            if (!response.ok) {
                const errMsg = await parseResponseError(response);
                throw new Error(errMsg);
            }

            if (isMounted.current) {
                setAuthError(null);
                changeAuthRoute("login");
            }
        } catch (err: any) {
            if (isMounted.current) {
                setAuthError(err.message || "Password resetting routine failed.");
            }
            throw err;
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    }, [changeAuthRoute]);

    /* ================================
       LIFECYCLE
    ================================= */

    useEffect(() => {
        initializeAuth();

        return () => {
            stopReminderCycle();
        };
    }, [initializeAuth, stopReminderCycle]);

    /* ================================
       CONTEXT VALUE
    ================================= */

    const value: AuthContextType = {
        isAuthenticated,
        isLoading,
        remindAlertActive,
        authRoute,
        setAuthRoute,
        changeAuthRoute,
        login,
        signUp,
        logout,
        resetPassword,
        forgotPassword,
        initializeAuth,
        remindToLogin,
        dismissReminder,
        authError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* =========================================================================
   HOOK
   ========================================================================= */

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider setup structure.");
    }

    return context;
};

export default AuthContext;