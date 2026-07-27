import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";

export interface sidebarMobile {
  open: boolean;
  toggleOpen: () => void;
}

export interface sidebarDesktop {
  minimized: boolean;
  toggleMinimize: () => void;
}

interface sideBarType {
  onMobile: sidebarMobile;
  onDesktop: sidebarDesktop;
}


const sideBarContext = createContext<sideBarType | undefined>(undefined);



// --- Provider Component ---
export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [desktopMinimized, setDesktopMinimized] = useState<boolean>(true);

  const toggleMobileOpen = useCallback(() => {setMobileOpen((prev) => !prev);}, []);
  const toggleDesktopMinimize = useCallback(() => {setDesktopMinimized((prev) => !prev);}, []);


  // Optional: Automatically close mobile drawer on window resize to desktop sizes
  useEffect(() => {
    const handleResize = () => {if (window.innerWidth >= 768 && mobileOpen) {setMobileOpen(false);}};
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);


  const value: sideBarType = {
    onMobile: {open: mobileOpen,toggleOpen: toggleMobileOpen,},
    onDesktop: {minimized: desktopMinimized,toggleMinimize: toggleDesktopMinimize,},
  };
  

  return <sideBarContext.Provider value={value}>{children}</sideBarContext.Provider>;
};



// --- Custom Hook ---
export const useSidebar = (): sideBarType => {
  const context = useContext(sideBarContext);
  if (!context) {throw new Error("useSidebar must be used within a SidebarProvider");}
  return context;
};
