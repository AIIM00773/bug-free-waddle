import { useState, createContext, useContext, useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { getHeaders, useAuth } from "./AuthProvider";

// --- API Configuration ---
export const API_BASE_URL = "http://127.0.0.1:8000";
export const BASE_API_ROUTES = {
  ONBOARD: `${API_BASE_URL}/public/api/v1/merchants/branches/branch/onboard/`,
  GETBRANCHES: `${API_BASE_URL}/public/api/v1/merchants/branches/`,
  EDIT: `${API_BASE_URL}/public/api/v1/merchants/branches/branch/`,
  DELETE: `${API_BASE_URL}/public/api/v1/merchants/branches/branch/`,
  INDIVIDUAL: `${API_BASE_URL}/public/api/v1/merchants/branches/branch/`,
};

// --- TypeScript Interfaces ---
export interface BranchType {
  id: string;
  unique_id?: string;
  branchName: string;
  [key: string]: any;
}

export interface OnboardingFormBranchType {
  branchName: string;
  branchDescription: string;
  branchCategory: string;
  isPrimary: boolean;
  isOnline: boolean;
  isStocked: boolean;
  isAcceptingOrders: boolean;
  opens: string;
  closes: string;
  operatingHours: string;
  country: string;
  county: string;
  subCounty: string; 
  physicalAddress: string;
  buildingName: string;
  latitude: string;
  longitude: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
}

export interface BranchOnboardingErrorsType {
  branchName: string | null;
  branchDescription: string | null; 
  branchCategory: string | null; 
  isPrimary: string | null;
  isOnline: string | null; 
  isStocked: string | null;
  isAcceptingOrders: string | null;
  opens: string | null; 
  closes: string | null;
  operatingHours: string | null;
  country: string | null; 
  county: string | null; 
  subCounty: string | null; 
  physicalAddress: string | null; 
  buildingName: string | null; 
  latitude: string | null; 
  longitude: string | null; 
  managerName: string | null; 
  managerPhone: string | null; 
  managerEmail: string | null;
  onBoardingError: string | null; 
  runtime?: string | null; 
  server?: string | null; 
}

export interface BranchContextType {
  branches: BranchType[];
  selectedBranch: BranchType | null;
  isLoading: boolean;
  branchOnboardingForm: OnboardingFormBranchType;
  onboardingErrors: BranchOnboardingErrorsType;
  
  // Core Infrastructure Handles
  clearErrors: () => void;
  initialBranchesFetching: () => Promise<void>;
  onBoardingBranch: (payload: OnboardingFormBranchType) => Promise<boolean>;
  editingBranch: (id: string, payload: Partial<OnboardingFormBranchType>) => Promise<void>;
  deletingBranch: (id: string) => Promise<void>;
  getIndividualBranch: (id: string) => Promise<BranchType | undefined>;
}

// --- Initial States ---
const initialFormState: OnboardingFormBranchType = {
  branchName: "",
  branchDescription: '', 
  branchCategory: '', 
  isPrimary: false,
  isOnline: true, 
  isStocked: true, 
  isAcceptingOrders: true,
  opens: '08:00',
  closes: '18:00', 
  operatingHours: 'Mon-Sat: 8AM-6PM',
  country: 'Kenya',
  county: '', 
  subCounty: '', 
  physicalAddress: '', 
  buildingName: '', 
  latitude: '', 
  longitude: '', 
  managerName: '', 
  managerPhone: '', 
  managerEmail: ''
};

const initialErrorsState: BranchOnboardingErrorsType = {
  branchName: null, branchDescription: null, branchCategory: null, isPrimary: null,
  isOnline: null, isStocked: null, isAcceptingOrders: null, opens: null,
  closes: null, operatingHours: null, country: null, county: null,
  subCounty: null, physicalAddress: null, buildingName: null, latitude: null,
  longitude: null, managerName: null, managerPhone: null, managerEmail: null,
  onBoardingError: null, runtime: null, server: null
};

// --- Context Definition ---
const BranchContext = createContext<BranchContextType | undefined>(undefined);

// --- Provider Component ---
export function BranchContextProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, merchantProfile, user, fetchMerchantProfile } = useAuth();
  
  // State
  const [branches, setBranches] = useState<BranchType[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [branchOnboardingForm, setBranchOnboardingForm] = useState<OnboardingFormBranchType>(initialFormState);
  const [onboardingErrors, setOnboardingErrors] = useState<BranchOnboardingErrorsType>(initialErrorsState);

  useEffect(() => {
    if (merchantProfile?._business_branches) {
      setBranches(merchantProfile._business_branches);
    }
  }, [merchantProfile]);

  // Helpers
  const clearErrors = useCallback(() => setOnboardingErrors(initialErrorsState), []);

  // Identity Profiling Sync Rule
  useEffect(() => {
    if (!isAuthenticated || !merchantProfile || !user) return;
    
    setBranchOnboardingForm(prev => {
      if (prev.branchName !== "") return prev; 
      
      const isFirstBranch = merchantProfile._business_branches?.length === 0;
      const generatedName = isFirstBranch 
        ? `${merchantProfile.shopName}'s Main Branch` 
        : `${merchantProfile.shopName}'s New Branch`;
      
      return { 
        ...prev, 
        branchName: generatedName, 
        isPrimary: isFirstBranch, 
        managerEmail: user.email || "", 
        managerName: user.full_name || "", 
        managerPhone: merchantProfile.accountPhone || "" 
      };
    });
  }, [isAuthenticated, merchantProfile, user]);

  // --- API Engines ---

  // GET BRANCHES LIST  
  const initialBranchesFetching = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await fetch(BASE_API_ROUTES.GETBRANCHES, { headers: getHeaders() });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      setBranches(Array.isArray(data) ? data : (data.results || []));
    } catch (error) {
      setOnboardingErrors(prev => ({ ...prev, runtime: error instanceof Error ? error.message : "Error" }));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // ONBOARD AN INDIVIDUAL BRANCH
  const onBoardingBranch = useCallback(async (payload: OnboardingFormBranchType): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(BASE_API_ROUTES.ONBOARD, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      
      await fetchMerchantProfile();
      return true;
    } catch (error) {
      setOnboardingErrors(prev => ({ ...prev, onBoardingError: error instanceof Error ? error.message : "Error" }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchMerchantProfile]);

  // EDIT AN INDIVIDUAL BRANCH
  const editingBranch = useCallback(async (id: string, payload: Partial<OnboardingFormBranchType>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_API_ROUTES.EDIT}${id}/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      await initialBranchesFetching(); 
    } catch (error) {
      setOnboardingErrors(prev => ({ ...prev, server: error instanceof Error ? error.message : "Error" }));
    } finally {
      setIsLoading(false);
    }
  }, [initialBranchesFetching]);

  // DELETE AN INDIVIDUAL BRANCH
  const deletingBranch = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_API_ROUTES.DELETE}${id}/`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      
      // Instant UI update by filtering out the deleted branch
      setBranches(prev => prev.filter(b => b.unique_id !== id && b.id !== id));
    } catch (error) {
      setOnboardingErrors(prev => ({ ...prev, server: error instanceof Error ? error.message : "Error" }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // GET INDIVIDUAL BRANCH DETAILS
  const getIndividualBranch = useCallback(async (id: string): Promise<BranchType | undefined> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_API_ROUTES.INDIVIDUAL}details/${id}/`, { headers: getHeaders() });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      setSelectedBranch(data);
      console.log(data);
      return data;
    } catch (error) {
      setOnboardingErrors(prev => ({ ...prev, runtime: error instanceof Error ? error.message : "Error" }));
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []); // selectedBranch removed from dependency array to prevent infinite re-fetching

  const contextValue = useMemo(() => ({
    branches,
    selectedBranch,
    branchOnboardingForm,
    onboardingErrors,
    isLoading, 
    clearErrors,
    initialBranchesFetching, 
    onBoardingBranch,
    editingBranch,
    deletingBranch,
    getIndividualBranch,
  }), [
    branches,
    selectedBranch,
    branchOnboardingForm,
    onboardingErrors,
    isLoading, 
    clearErrors,
    initialBranchesFetching, 
    onBoardingBranch,
    editingBranch,
    deletingBranch,
    getIndividualBranch,
  ]);
  
  return <BranchContext.Provider value={contextValue}>{children}</BranchContext.Provider>;
}

// --- Hook Export Layout ---
export function useBranch() {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error("useBranch must be utilized explicitly within an established BranchContextProvider component tree layout.");
  }
  return context;
}
