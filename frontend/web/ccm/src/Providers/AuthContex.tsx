import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    useContext,
} from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    remindAlertActive: boolean;

    login: () => void;
    logout: () => void;
    signUp: () => void;

    resetPassword: () => void;
    forgotPassword: () => void;

    initializeAuth: () => Promise<void>;

    remindToLogin: () => void;
    dismissReminder: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "authToken";
const REMINDER_INTERVAL = 3 * 60 * 1000; // 3 Minutes

export const AuthProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [remindAlertActive, setRemindAlertActive] = useState(false);

    const reminderIntervalRef = useRef<number | null>(null);

    /**
     * -----------------------------------------------------
     * Reminder Controls
     * -----------------------------------------------------
     */

    const dismissReminder = useCallback(() => {
        setRemindAlertActive(false);
    }, []);

    const remindToLogin = useCallback(() => {
        if (isAuthenticated) return;

        setRemindAlertActive(true);
    }, [isAuthenticated]);

    const stopReminderCycle = useCallback(() => {
        if (reminderIntervalRef.current) {
            window.clearInterval(reminderIntervalRef.current);
            reminderIntervalRef.current = null;
        }
    }, []);

    const startReminderCycle = useCallback(() => {
        stopReminderCycle();

        if (isAuthenticated) return;

        /**
         * Show immediately
         */
        setRemindAlertActive(true);

        /**
         * Re-show every 3 minutes
         */
        reminderIntervalRef.current = window.setInterval(() => {
            const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

            if (!token) {
                setRemindAlertActive(true);
            }
        }, REMINDER_INTERVAL);
    }, [isAuthenticated, stopReminderCycle]);

    /**
     * -----------------------------------------------------
     * Initialize Authentication
     * -----------------------------------------------------
     */

    const initializeAuth = useCallback(async () => {
        try {
            setIsLoading(true);

            const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

            const authenticated = !!token;

            setIsAuthenticated(authenticated);

            if (!authenticated) {
                startReminderCycle();
            }
        } catch (error) {
            console.error(
                "Failed to initialize authentication:",
                error
            );
        } finally {
            setIsLoading(false);
        }
    }, [startReminderCycle]);

    /**
     * -----------------------------------------------------
     * Authentication Actions
     * -----------------------------------------------------
     */

    const login = useCallback(() => {
        sessionStorage.setItem(
            AUTH_TOKEN_KEY,
            "authenticated-user"
        );

        setIsAuthenticated(true);
        setRemindAlertActive(false);

        stopReminderCycle();
    }, [stopReminderCycle]);

    const signUp = useCallback(() => {
        sessionStorage.setItem(
            AUTH_TOKEN_KEY,
            "authenticated-user"
        );

        setIsAuthenticated(true);
        setRemindAlertActive(false);

        stopReminderCycle();
    }, [stopReminderCycle]);

    const logout = useCallback(() => {
        sessionStorage.removeItem(AUTH_TOKEN_KEY);

        setIsAuthenticated(false);

        /**
         * Restart reminders immediately
         */
        setRemindAlertActive(true);

        startReminderCycle();
    }, [startReminderCycle]);

    /**
     * -----------------------------------------------------
     * Placeholder Auth Methods
     * -----------------------------------------------------
     */

    const resetPassword = useCallback(() => {
        console.log("Reset password");
    }, []);

    const forgotPassword = useCallback(() => {
        console.log("Forgot password");
    }, []);

    /**
     * -----------------------------------------------------
     * Lifecycle
     * -----------------------------------------------------
     */

    useEffect(() => {
        initializeAuth();

        return () => {
            stopReminderCycle();
        };
    }, [initializeAuth, stopReminderCycle]);

    /**
     * -----------------------------------------------------
     * Context
     * -----------------------------------------------------
     */

    const value: AuthContextType = {
        isAuthenticated,
        isLoading,
        remindAlertActive,

        login,
        logout,
        signUp,

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

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }

    return context;
};

export default AuthContext;