

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
interface settingsType {isOpen:boolean;toggleIsOpen:()=>void; }

const settingsContext = createContext<settingsType | undefined>(undefined);

// --- Provider Component ---
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleIsOpen = useCallback(() => {setIsOpen((prev) => !prev);}, []);
  const value: settingsType = {isOpen,toggleIsOpen};
  return <settingsContext.Provider value={value}>{children}</settingsContext.Provider>;
};



// --- Custom Hook ---
export const useSettings = (): sideBarType => {
  const context = useContext(sideBarContext);
  if (!context) {throw new Error("useSidebar must be used within a SidebarProvider");}
  return context;
};
