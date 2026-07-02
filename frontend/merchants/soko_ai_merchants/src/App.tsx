import { useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "./Providers/AuthProvider";
import { DashboardOverview } from "./Views/DashboardOverview";
import MerchantAuthPage from "./Views/onboarding/BaseAuth";
import MerchantOnboarding from "./Views/onboarding/MerchantOnboardingWizard";
import { PendingVerification } from "./Components/PendingVerification";

import {
  Menu,
  Store,
  Bell,
  Loader2,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Settings,
  LogOut,
  LifeBuoy
} from "lucide-react";

const NAV_LINKS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "My Products", path: "/products", icon: Package },
  { label: "Orders", path: "/orders", icon: ShoppingCart },
  { label: "Finances", path: "/finances", icon: Wallet },
  { label: "Store Settings", path: "/settings", icon: Settings },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { user, isMerchant, isAuthenticated, isLoading, userLogout, isMerchantVerified } = useAuth();

  // 1. Prevent UI flashing while checking session status
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // 2. Auth & Onboarding Guards
  if (!isAuthenticated) return <MerchantAuthPage />;
  if (isAuthenticated && !isMerchant) return <MerchantOnboarding />;
  if (isMerchant && !isMerchantVerified) return <PendingVerification />;

  // Safely extract user initials for the avatar
  const userInitials = `${user?.first_name?.charAt(0) || ""}${user?.last_name?.charAt(0) || ""}`.toUpperCase();

  // 3. Main Dashboard Layout
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500/20">

      {/* SIDEBAR */}
      <aside
        className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out z-20 shrink-0 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          {sidebarOpen && (
            <div className="flex items-center overflow-hidden">
              <Store className="h-6 w-6 text-emerald-600 mr-2 shrink-0" />
              <span className="font-black tracking-tight text-xl text-slate-900 whitespace-nowrap">
                Soko<span className="text-emerald-600 font-light">Sellers</span>
              </span>
            </div>
          )}
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors ${!sidebarOpen && "mx-auto"}`}
            aria-label="Toggle Sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5 shrink-0" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 overflow-x-hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              title={!sidebarOpen ? link.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                } ${!sidebarOpen && "justify-center px-0"}`
              }
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <button 
            title={!sidebarOpen ? "Merchant Support" : undefined}
            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors ${!sidebarOpen && "justify-center px-0"}`}
          >
            <LifeBuoy className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="whitespace-nowrap">Merchant Support</span>}
          </button>
          <button
            title={!sidebarOpen ? "Sign Out" : undefined}
            onClick={() => userLogout()}
            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-300 border border-transparent transition-colors ${!sidebarOpen && "justify-center px-0"}`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <section className="flex flex-col flex-1 h-full min-w-0">
        
        {/* TOP HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800 truncate">
              {user?.first_name ? `Welcome, ${user.first_name}` : "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 relative transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
            </button>

            <div 
              className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200 cursor-pointer hover:bg-emerald-200 transition-colors"
              title={`${user?.first_name || ""} ${user?.last_name || ""}`}
            >
              {userInitials || "?"}
            </div>
          </div>
        </header>

        {/* SCROLLABLE VIEWPORT WITH ROUTING */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              {/* Add your other routes here, e.g.: */}
              {/* <Route path="/products" element={<ProductsView />} /> */}
              {/* <Route path="/orders" element={<OrdersView />} /> */}
              
              {/* Fallback route to redirect unknown paths back to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </section>
      
    </div>
  );
}

export default App;