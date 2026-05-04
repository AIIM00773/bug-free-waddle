


import type { AuthContextType, LoginResponse, SignupResponse, User } from "@/types/auth";
import { apiClient, ApiError, APIRoutes } from "@/utils/api";
import { sanitizeEmail, sanitizeInput, validateEmail, validatePassword } from "@/utils/validation";
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from "react";



const AuthContext = createContext<AuthContextType | undefined>(undefined);

console.log(APIRoutes);





export function AuthProvider({ children }: { children: React.ReactNode }) {


    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [signupError, setSignupError] = useState<string | null>(null);





    // 1. Initialize Auth - Runs once on app start

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = await SecureStore.getItemAsync('access');
                const savedUser = await SecureStore.getItemAsync('user');

                // ....
                if (token && savedUser) {
                    try {
                        const auth_check_response = await fetch(`${APIRoutes.ROOT.toString().trim()}auth/user-profile/`, {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (auth_check_response.ok) {
                            const freshUserData = await auth_check_response.json();
                            await SecureStore.setItemAsync('user', JSON.stringify(freshUserData));


                            setUser(freshUserData);
                            setIsAuthenticated(true);
                            console.log("Session verified with backend.");
                            await SecureStore.setItemAsync('DropAI_Signature', JSON.stringify(freshUserData));


                        } else {
                            console.log("Token expired or invalid.");
                            await logout();
                        }
                    } catch (networkError) {
                        console.error("Network error during auth check:", networkError);
                        setUser(JSON.parse(savedUser));
                        setIsAuthenticated(true);
                    }
                }
            } catch (e) {
                console.log("Auth Initialization Error:", e);

                await logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);










    // Helper to persist session
    const saveSession = async (accessToken: string, refreshToken: string, userData: User) => {
        try {
            await SecureStore.setItemAsync("access", accessToken);
            await SecureStore.setItemAsync("refresh", refreshToken);
            await SecureStore.setItemAsync("user", JSON.stringify(userData));
            await SecureStore.setItemAsync('DropAI_Signature', accessToken);

            setUser(userData);
            setIsAuthenticated(true);

        } catch (error) {
            console.error('Failed to save session:', error);
            throw new Error('Failed to save authentication state');
        }
    };




    const login = async (email: string, password: string) => {

        // Validate inputs
        if (!validateEmail(email)) {
            setLoginError('Please enter a valid email address');
            return;
        }

        if (!password) {
            setLoginError('Password is required');
            return;
        }

        await logout();
        setLoading(true);
        setLoginError(null);
        setSignupError(null);


        try {


            const sanitizedEmail = sanitizeEmail(email);
            const data = await apiClient.post<LoginResponse | any>(APIRoutes.LOGIN.toString().trim(), {
                email: sanitizedEmail,
                password,
            });


            await saveSession(data.tokens.access, data.tokens.refresh, data.user);

        } catch (error: unknown) {
            const apiError = error as ApiError;
            console.error(apiError);

            const errorMessage = 'An error occurred during login. Please try again.';
            setLoginError(errorMessage);

            // Auto-clear error after 4 seconds
            setTimeout(() => {
                setLoginError(null);
            }, 4000);
        } finally {
            setLoading(false);
        }
    };







    const signup = async (email: string, password: string, firstName: string, lastName: string) => {

        // Validate inputs
        if (!validateEmail(email)) {
            setSignupError('Please enter a valid email address');
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            setSignupError(passwordValidation.error || 'Password is invalid');
            return;
        }

        if (!sanitizeInput(firstName).trim() || !sanitizeInput(lastName).trim()) {
            setSignupError('First and last names are required');
            return;
        }

        await logout();
        setLoading(true);
        setSignupError(null);
        setLoginError(null);

        try {
            const sanitizedEmail = sanitizeEmail(email);
            const data = await apiClient.post<SignupResponse>(APIRoutes.SIGNUP.toString().trim(), {
                email: sanitizedEmail,
                password,
                first_name: sanitizeInput(firstName),
                last_name: sanitizeInput(lastName),
            });

            await saveSession(data.tokens.access, data.tokens.refresh, data.user);


        } catch (error: unknown) {
            const apiError = error as ApiError;
            const errorMessage = apiError.message || 'Signup failed. Please try again later.';
            setSignupError(errorMessage);

            // Auto-clear error after 4 seconds
            setTimeout(() => {
                setSignupError(null);
            }, 4000);
        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync("access");
            await SecureStore.deleteItemAsync("refresh");
            await SecureStore.deleteItemAsync("user");
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, signup, logout, loginError, signupError, }}>
            {children}
        </AuthContext.Provider>
    );
}




export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
