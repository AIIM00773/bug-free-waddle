import { useAuth } from "@/Providers/AuthProvider";

/**
 * Custom hook for accessing and managing authentication
 * Provides type-safe access to auth context
 */
export function useAuthManagement() {
  const auth = useAuth();

  const isLoggedIn = auth.isAuthenticated && auth.user !== null;

  const getFullName = (): string => {
    if (!auth.user) return '';
    return `${auth.user.first_name} ${auth.user.last_name}`.trim();
  };

  const getUserEmail = (): string => {
    return auth.user?.email || '';
  };

  const clearErrors = () => {
    // Note: This would require exposing a method in AuthProvider
    // For now, errors clear automatically after 4 seconds
  };

  return {
    ...auth,
    isLoggedIn,
    getFullName,
    getUserEmail,
    clearErrors,
  };
}
