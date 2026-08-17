import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

/* ========= Types ========= */

export interface UserType {
  // Unique identification codes
  unique_id?: string;
  account_validation_code?: string;

  // Contact information
  phone: string;
  email?: string;

  // KYC information
  national_id_number?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  full_name?: string;
  dob?: string;
  gender?: string;

  // Location information
  continent?: string;
  country?: string;
  country_code?: string;
  postal_address?: string;
  state?: string;
  city: string;
  county?: string;
  sub_county?: string;
  street?: string;
  estate_area_neighborhood?: string;
  apartment_door_id?: string;
  location_explanation?: string;
  timezone_name?: string;

  // User account information and verifications
  is_customer: boolean;
  is_merchant: boolean;
  is_merchant_account_verified?: string;
  eligible: boolean;
  is_verified: boolean;
  is_suspended: boolean;
  is_flagged?: boolean;
  flag_reason?: string;
  is_eligible: boolean;

  // Verification
  is_email_verified: boolean;
  is_phone_verified: boolean;
  onboarding_completed: boolean;

  // Security & Compliance
  failed_login_attempts: number;
  last_password_change?: string;
  mfa_required: boolean;

  // Settings & Preferences
  allow_location_access: boolean;
  allow_messages_access: boolean;
  preferred_language: string;
  allow_push_notification: boolean;
  allow_phone_notification: boolean;
  allow_email_notification: boolean;
  allow_whatsApp_dispatch_alerts: boolean;
  allow_sms_tracking_pings: boolean;
  allow_payment_receipt_alert: boolean;
  allow_order_dispatch_checkpoints_alerts: boolean;

  // Timestamps
  created_at?: string;
  updated_at: string;
}

// User authentication routes
export type AuthRoute = "login" | "signup" | "forgot";

// Auth Context Type
export interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  authSuccess: string | null;
  authError: string | null;
  authRoute: AuthRoute;
  
  setAuthRoute: (route: AuthRoute) => void;
  login: (phone: string, password: string) => Promise<void>;
  signUp: (full_name: string, phone: string | null, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string, phone: string | null) => Promise<void>;

  initializeAuth: () => Promise<void>;
  clearAuthError: () => void;
  
  proceedWithoutAuth: boolean;
  setProceedWithoutAuth: (value?: boolean) => void;

  editIdentity: (identity: Record<string, any>) => Promise<any>;
  editLogistics: (logistics: Record<string, any>) => Promise<any>;
}

/* ========= Constants & Config ========= */

// Fallback to localhost if env var is missing (supports Create React App and Vite)
const API_BASE_URL = "http://127.0.0.1:8000";

const ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/public/api/v1/users/register/`,
  LOGIN: `${API_BASE_URL}/public/api/v1/users/login/`,
  PROFILE: `${API_BASE_URL}/public/api/v1/users/profile/`,
  LOGOUT: `${API_BASE_URL}/public/api/v1/users/logout/`,
  REFRESH: `${API_BASE_URL}/public/api/v1/auth/token/refresh/`,
  FORGOT_PASSWORD: `${API_BASE_URL}/public/api/v1/users/recover-password/`,
  VALIDATE_TOKEN: `${API_BASE_URL}/public/api/v1/users/validate-token/`,
  UPDATE_IDENTITY: `${API_BASE_URL}/public/api/v1/users/profile/update/identity/`,
  UPDATE_LOGISTICS: `${API_BASE_URL}/public/api/v1/users/profile/update/logistic/`,
};

const AUTH_KEYS = {
  ACCESS_TOKEN: "soko_user_access_token",
  REFRESH_TOKEN: "soko_user_refresh_token",
  AUTH_ROUTE: "soko_user_auth_route",
  QUIT_AUTH: "quitAuth",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ========= Provider Component ========= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [proceedWithoutAuth, setProceedWithoutAuth] = useState<boolean>(
    () => sessionStorage.getItem(AUTH_KEYS.QUIT_AUTH) === "true"
  );
  const [authRoute, _setAuthRoute] = useState<AuthRoute>(
    () => (sessionStorage.getItem(AUTH_KEYS.AUTH_ROUTE) as AuthRoute) || "login"
  );

  // Auto-clear messages after 4.5 seconds
  useEffect(() => {
    if (!authSuccess && !authError) return;
    const timer = setTimeout(() => {
      setAuthSuccess(null);
      setAuthError(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [authSuccess, authError]);

  /* --- Internal API Client --- */
  const apiFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    let response = await fetch(url, { ...options, headers });

    // Handle Token Refresh on 401 Unauthorized
    if (response.status === 401) {
      const refreshToken = sessionStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const refreshRes = await fetch(ENDPOINTS.REFRESH, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            sessionStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, data.access);
            
            // Retry original request with new token
            const retryHeaders = {
              ...headers,
              Authorization: `Bearer ${data.access}`,
            };
            response = await fetch(url, { ...options, headers: retryHeaders });
          }
        } catch {
          sessionStorage.clear();
        }
      }
    }
    return response;
  }, []);

  /* --- Handlers --- */
  const setAuthRoute = useCallback((route: AuthRoute) => {
    _setAuthRoute(route);
    sessionStorage.setItem(AUTH_KEYS.AUTH_ROUTE, route);
  }, []);

  const handleSetProceedWithoutAuth = useCallback((value: boolean = true) => {
    sessionStorage.setItem(AUTH_KEYS.QUIT_AUTH, JSON.stringify(value));
    setProceedWithoutAuth(value);
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const fetchUserProfile = useCallback(async (): Promise<UserType | null> => {
    const response = await apiFetch(ENDPOINTS.PROFILE);
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      setIsAuthenticated(true);
      return data;
    }
    setUser(null);
    setIsAuthenticated(false);
    return null;
  }, [apiFetch]);

  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        const validateRes = await apiFetch(ENDPOINTS.VALIDATE_TOKEN);
        if (validateRes.ok) {
          const data = await validateRes.json();
          setUser(data.user);
          setIsAuthenticated(true);
          setAuthSuccess("Session verified.");
        } else {
          await fetchUserProfile();
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setAuthError(`Auth init failure: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch, fetchUserProfile]);

  const login = useCallback(async (phone: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || data.message || "Invalid Login Details!");
      }

      sessionStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, data.tokens.access);
      sessionStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.tokens.refresh);
      setUser(data.user);
      setIsAuthenticated(true);
      setAuthSuccess("Login successful!");
    } catch (e: any) {
      setAuthError(e.message || e.error || e.detail || "An error occurred.");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (full_name: string, phone: string | null, password: string) => {
    setAuthError(null);
    setIsLoading(true);

    if (!phone || !phone.trim()) {
      setAuthError("Phone Number Required For Signup!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, phone, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      sessionStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, data.tokens.access);
      sessionStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.tokens.refresh);
      setUser(data.user);
      setIsAuthenticated(true);
      setAuthSuccess("Account created successfully!");
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiFetch(ENDPOINTS.LOGOUT, {
        method: "POST",
        body: JSON.stringify({ refresh: sessionStorage.getItem(AUTH_KEYS.REFRESH_TOKEN) }),
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setAuthError(`Logout error: ${errorMessage}`);
    } finally {
      sessionStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
      setUser(null);
      setIsAuthenticated(false);
      setAuthRoute("login");
      setIsLoading(false);
      window.location.reload();
    }
  }, [apiFetch, setAuthRoute]);

  const forgotPassword = useCallback(async (email: string, phone: string | null) => {
    setIsLoading(true);
    try {
      const response = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "There was an issue trying to recover your password. Please confirm your details and try again.");
      }
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // API Wrappers for specialized updates
  const editIdentity = useCallback(async (identity: Record<string, any>) => {
    const response = await apiFetch(ENDPOINTS.UPDATE_IDENTITY, {
      method: "PATCH",
      body: JSON.stringify(identity),
    });

    if (!response.ok) throw new Error("Failed to update identity");
    return await response.json();
  }, [apiFetch]);

  const editLogistics = useCallback(async (logistics: Record<string, any>) => {
    const response = await apiFetch(ENDPOINTS.UPDATE_LOGISTICS, {
      method: "PATCH",
      body: JSON.stringify(logistics),
    });
    
    if (!response.ok) throw new Error("Failed to update logistics");
    return await response.json();
  }, [apiFetch]);

  // Initial Load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Memoized Context Value
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    authError,
    authSuccess,
    authRoute,
    setAuthRoute,
    login,
    signUp,
    logout,
    forgotPassword,
    initializeAuth,
    clearAuthError,
    proceedWithoutAuth,
    setProceedWithoutAuth: handleSetProceedWithoutAuth,
    editIdentity,
    editLogistics,
  }), [
    user,
    isAuthenticated,
    isLoading,
    authError,
    authSuccess,
    authRoute,
    setAuthRoute,
    login,
    signUp,
    logout,
    forgotPassword,
    initializeAuth,
    clearAuthError,
    proceedWithoutAuth,
    handleSetProceedWithoutAuth,
    editIdentity,
    editLogistics,
  ]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/* ========= Hooks ========= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// Aliased hook for semantic preference in consumer components
export const useProfile = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useProfile must be used within an AuthProvider");
  return context;
};

export default AuthProvider;
