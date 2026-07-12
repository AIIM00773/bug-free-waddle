import { useState, useMemo } from "react";
import {
  Menu, Store, Loader2, LayoutDashboard, Package, ShoppingCart, 
  Wallet, Settings, LogOut, MapPin, User2, HelpCircle, 
  BookOpenCheck, NewspaperIcon, BellCheckIcon
} from "lucide-react";

import { useAuth } from "./Providers/AuthProvider";
import { DashboardOverview } from "./Views/DashboardOverview";
import MerchantAuthPage from "./Views/onboarding/BaseAuth";
import MerchantOnboarding from "./Views/onboarding/MerchantOnboardingWizard";
import { PendingVerification } from "./Components/PendingVerification";
import BranchesView from "./Views/BranchesView";
import { InventoryView } from "./Views/InventoriesView";
import { OrdersView } from "./Views/OrdersView";
import { FinancesView } from "./Views/FinancesView";
import { ProfileView } from "./Views/ProfileView";
import { MerchantSettingsView } from "./Views/StoreSettingsView";
import { MerchantSupportView } from "./Views/Support";
import { LearningCenterView } from "./Views/LearningCenterView";
import { MerchantIntelligenceHub } from "./Views/MarketsINsider";
import { MerchantNotificationsView } from "./Views/MerchantNotificationsView";

// --- Types ---
type ViewId = "dashboard" | "inventory" | "orders" | "finances" | "branches" | "settings" | "profile" | "support" | "learn" | "biznews" | "alerts";

const NAV_LINKS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "branches", label: "Branches", icon: MapPin },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "finances", label: "Finances", icon: Wallet },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile", label: "Profile", icon: User2 },
  { id: "alerts", label: "Alerts", icon: BellCheckIcon },
  { id: "support", label: "Support", icon: HelpCircle },
  { id: "learn", label: "Learning", icon: BookOpenCheck },
  { id: "biznews", label: "Market Insider", icon: NewspaperIcon }
] as const;

export default function App() {
  const { isMerchant, isAuthenticated, isLoading, userLogout, isMerchantVerified, merchantProfile } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(() => sessionStorage.getItem("sidebarOpen") === "true");
  const [activeView, setActiveView] = useState<ViewId>(() => (sessionStorage.getItem("sokoActiveView") as ViewId) || "dashboard");

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      sessionStorage.setItem("sidebarOpen", String(!prev));
      return !prev;
    });
  };

  const handleViewChange = (id: ViewId) => {
    setActiveView(id);
    sessionStorage.setItem("sokoActiveView", id);
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) return <MerchantAuthPage />;
  if (!isMerchant) return <MerchantOnboarding />;
  if (!isMerchantVerified) return <PendingVerification />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      <aside className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6 text-emerald-600" />
              <span className="font-bold text-lg">Soko<span className="text-emerald-600 font-light">Sellers</span></span>
            </div>
          )}
          <button onClick={toggleSidebar} className="p-2 ml-auto rounded-xl hover:bg-slate-100">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_LINKS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleViewChange(id as ViewId)}
              className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeView === id ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"
              } ${!sidebarOpen && "justify-center"}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button onClick={userLogout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl">
          {activeView === "dashboard" && <DashboardOverview />}
          {activeView === "branches" && <BranchesView />}
          {activeView === "inventory" && <InventoryView />}
          {activeView === "orders" && <OrdersView />}
          {activeView === "finances" && <FinancesView />}
          {activeView === "profile" && <ProfileView merchantData={merchantProfile} />}
          {activeView === "alerts" && <MerchantNotificationsView />}
          {activeView === "settings" && <MerchantSettingsView merchant={merchantProfile} />}
          {activeView === "support" && <MerchantSupportView />}
          {activeView === "learn" && <LearningCenterView />}
          {activeView === "biznews" && <MerchantIntelligenceHub />}
        </div>
      </main>
    </div>
  );
}
