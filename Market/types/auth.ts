/**
 * Authentication and User related types
 */

export interface User {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any; // Allow additional fields from API
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  tokens: TokenResponse;
  user: User;
  message?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface SignupResponse {
  tokens: TokenResponse;
  user: User;
  message?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  loginError: string | null;
  signupError: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}
