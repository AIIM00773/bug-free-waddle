


import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    useContext,
} from "react";






/* =========================================================================
   AUTH ROUTES
   ========================================================================= */

export type AuthRoute =
    | "login"
    | "signup"
    | "forgot-password"
    | "reset-password";






/* =========================================================================
   CONTEXT TYPE
   ========================================================================= */

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    remindAlertActive: boolean;

    authRoute: AuthRoute;
    setAuthRoute: (route: AuthRoute) => void;

    changeAuthRoute: (route: AuthRoute) => void;

    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, firstName: string) => Promise<void>;
    logout: () => void;

    resetPassword: (newPassword: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;

    initializeAuth: () => Promise<void>;

    remindToLogin: () => void;
    dismissReminder: () => void;
}






/* =========================================================================
   CONSTANTS
   ========================================================================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "authToken";
const REMINDER_INTERVAL = 3 * 60 * 1000; // 3 minutes






/* =========================================================================
   PROVIDER
   ========================================================================= */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [remindAlertActive, setRemindAlertActive] = useState(false);

    const [authRoute, setAuthRoute] = useState<AuthRoute>(() => {
        const authroute = sessionStorage.getItem("authRoute") as AuthRoute || "login";
        return authroute;
    });


    const reminderIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
        null
    );







    /* ================================
       ROUTE CONTROL
    ================================= */

    const changeAuthRoute = useCallback((route: AuthRoute) => {
        try {
            sessionStorage.setItem("authRoute", route);
            setAuthRoute(route);
        } catch {
            setAuthRoute(route);
        }
    }, []);






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

        setRemindAlertActive(true);

        reminderIntervalRef.current = setInterval(() => {
            const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

            if (!token) {
                setRemindAlertActive(true);
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
            const authenticated = Boolean(token);

            setIsAuthenticated(authenticated);

            if (!authenticated) {
                startReminderCycle();
            } else {
                stopReminderCycle();
            }
        } catch (err) {
            console.error("Auth initialization failed:", err);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [startReminderCycle, stopReminderCycle]);







    /* ================================
       AUTH ACTIONS
    ================================= */

    const login = useCallback(
        async (email: string, password: string) => {
            // TODO: replace with real API call
            if (!email || !password) {
                throw new Error("Email and password are required");
            }

            sessionStorage.setItem(AUTH_TOKEN_KEY, "auth-user-token");

            setIsAuthenticated(true);
            setRemindAlertActive(false);
            stopReminderCycle();
        },
        [stopReminderCycle]
    );

    const signUp = useCallback(
        async (email: string, password: string, firstName: string) => {

            if (!email || !password || !firstName) {
                throw new Error("Email, password, and first name are required");
            }

            // TODO: replace with real API call
            sessionStorage.setItem(AUTH_TOKEN_KEY, "auth-user-token");

            setIsAuthenticated(true);
            setRemindAlertActive(false);
            stopReminderCycle();
        },
        [stopReminderCycle]
    );

    const logout = useCallback(() => {
        sessionStorage.removeItem(AUTH_TOKEN_KEY);

        setIsAuthenticated(false);
        setRemindAlertActive(true);

        startReminderCycle();
    }, [startReminderCycle]);









    /* ================================
       PASSWORD FLOWS (STUBS)
    ================================= */

    const resetPassword = useCallback(async (newPassword: string) => {
        console.log("Reset password:", newPassword);
    }, []);

    const forgotPassword = useCallback(async (email: string) => {
        console.log("Forgot password:", email);
    }, []);





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
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};



/* =========================================================================
   HOOK
   ========================================================================= */

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};

export default AuthContext;