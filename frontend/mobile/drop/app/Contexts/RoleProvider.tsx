import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";


// import  { deleteValue, getValueFor, save } from "../Functions/SecureStoreFunctions"



/* =========================
   TYPES
========================= */

type UserMode = "merchant" | "customer" | null;

interface RoleContextType {
  mode: UserMode;

  switchToMerchantMode: () => Promise<void>;

  switchToCustomerMode: () => Promise<void>;
}



/* =========================
   CONTEXT
========================= */


const UserModeContext = createContext<RoleContextType | undefined >(undefined);


/* =========================
   PROVIDER PROPS
========================= */


interface UserModeProviderProps {
  children: ReactNode;
}


/* =========================
   PROVIDER
========================= */

export const UserModeProvider = ({
  children,
}: UserModeProviderProps) => {
  const [mode, setMode] =
    useState<UserMode>("customer");

  /* =========================
     SWITCH TO MERCHANT
  ========================= */

  const switchToMerchantMode =
    async (): Promise<void> => {
      setMode("merchant");

      // future:
      // persist state
      // validate merchant profile
      // sync backend
    };

  /* =========================
     SWITCH TO CUSTOMER
  ========================= */

  const switchToCustomerMode =
    async (): Promise<void> => {
      setMode("customer");
    };

  return (
    <UserModeContext.Provider
      value={{
        mode,
        switchToMerchantMode,
        switchToCustomerMode,
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useUserMode = () => {
  const context = useContext(UserModeContext);

  if (!context) {
    throw new Error(
      "useUserMode must be used inside UserModeProvider"
    );
  }

  return context;
};