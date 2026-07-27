


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
  unique_id?: string;
  phone: string;
  national_id_number?: string;
  account_validation_code?: string;
  email?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  full_name?: string;
  dob?: string;
  gender?: string;
  country?: string;
  county?: string;
  sub_county?: string;
  street?: string;
  estate_area_neighborhood?: string;
  apartment_door_id?: string;
  location_explanation?:string; 
  is_merchant?: boolean;
  is_merchant_account_verified?: string;
  eligible?: boolean;
  is_verified?: boolean;
}

export type AuthRoute = "login" | "signup" | "forgot";

interface AuthContextType {
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
  forgotPassword: (email: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearAuthError: () => void;
  proceedWithoutAuth: boolean;
  setProceedWithoutAuth: (value?: boolean) => void;
  editIdentity: (identity: Record<string, any>) => Promise<void>;
  editLogistics: (logistics: Record<string, any>) => Promise<void>;
}

/* ========= Constants & Config ========= */

const API_BASE_URL = "http://127.0.0.1:8000";
const ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/public/api/v1/users/register/`,
  LOGIN: `${API_BASE_URL}/public/api/v1/users/login/`,
  PROFILE: `${API_BASE_URL}/public/api/v1/users/profile/`,
  LOGOUT: `${API_BASE_URL}/public/api/v1/users/logout/`,
  REFRESH: `${API_BASE_URL}/public/api/v1/auth/token/refresh/`,
  FORGOT_PASSWORD: `${API_BASE_URL}/public/api/v1/users/forgot-password/`,
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
  const [proceedWithoutAuth, setProceedWithoutAuth] = useState<boolean>(() => sessionStorage.getItem(AUTH_KEYS.QUIT_AUTH) === "true");
  const [authRoute, _setAuthRoute] = useState<AuthRoute>(() => (sessionStorage.getItem(AUTH_KEYS.AUTH_ROUTE) as AuthRoute) || "login");

  // Auto-clear messages
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
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    let response = await fetch(url, { ...options, headers });

    // Handle Token Refresh on 401
    if (response.status === 401) {
      const refreshToken = sessionStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const refreshRes = await fetch(ENDPOINTS.REFRESH, {
            method: "POST", // Usually POST for refresh
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            sessionStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, data.access);
            headers["Authorization"] = `Bearer ${data.access}`;
            response = await fetch(url, { ...options, headers });
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
          console.log(data.user); 
        } else {
          await fetchUserProfile();
        }
      }
    } catch (err) {
      console.error("Auth init failure:", err);
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
      if (!response.ok) throw new Error(data.detail || "Login failed");

      sessionStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, data.tokens.access);
      sessionStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.tokens.refresh);

      setUser(data.user);
      setIsAuthenticated(true);
      setAuthSuccess("Login successful!");
    } catch (e: any) {
      setAuthError(e.message || "An error occurred.");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);





  const signUp = useCallback(async (full_name: string, phone: string | null, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, phone, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed.");

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
      console.error("Logout error", e);
    } finally {
      sessionStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
      setUser(null);
      setIsAuthenticated(false);
      setAuthRoute("login");
      setIsLoading(false);
    }
  }, [apiFetch, setAuthRoute]);





  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Failed to recover password.");
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);








  //=============================================================================================================================== API Wrapper for specialized updates
  const editIdentity = useCallback(async (identity: Record<string, any>) => {
    const response = await apiFetch(ENDPOINTS.UPDATE_IDENTITY, {
      method: "PATCH",
      body: JSON.stringify(identity),
    });
    if (!response.ok) throw new Error("Failed to update identity");
    return response.json();
  }, [apiFetch]);





  const editLogistics = useCallback(async (logistics: Record<string, any>) => {
    const response = await apiFetch(ENDPOINTS.UPDATE_LOGISTICS, {
      method: "PATCH",
      body: JSON.stringify(logistics),
    });
    if (!response.ok) throw new Error("Failed to update logistics");
    return response.json();
  }, [apiFetch]);



  

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);




  const contextValue = useMemo(() => ({
    user, isAuthenticated, isLoading, authError, authSuccess, authRoute,
    setAuthRoute, login, signUp, logout, forgotPassword, initializeAuth,
    clearAuthError, proceedWithoutAuth, setProceedWithoutAuth: handleSetProceedWithoutAuth,
    editIdentity, editLogistics
  }), [
    user, isAuthenticated, isLoading, authError, authSuccess, authRoute,
    setAuthRoute, login, signUp, logout, forgotPassword, initializeAuth,
    clearAuthError, proceedWithoutAuth, handleSetProceedWithoutAuth,
    editIdentity, editLogistics
  ]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};



export const useProfile = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useProfile  must be used within an AuthProvider");
  return context;
};





export default AuthProvider;
