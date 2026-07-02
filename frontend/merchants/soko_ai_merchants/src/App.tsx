import { useState } from "react";
import {
  Menu, Store, Loader2, LayoutDashboard, Package,
  ShoppingCart, Wallet, Settings, LogOut, MapPin,
  User2, HelpCircle, BookOpenCheck, NewspaperIcon,
  BellCheckIcon
} from "lucide-react";

// Providers
import { useAuth } from "./Providers/AuthProvider";

// Views
import { DashboardOverview } from "./Views/DashboardOverview";
import MerchantAuthPage from "./Views/onboarding/BaseAuth";
import MerchantOnboarding from "./Views/onboarding/MerchantOnboardingWizard";
import { PendingVerification } from "./Components/PendingVerification";
import BranchesView from "./Views/BranchesView";
import { ProductsView } from "./Views/ProductsView";
import { OrdersView } from "./Views/OrdersView";
import { FinancesView } from "./Views/FinancesView";
import { ProfileView } from "./Views/ProfileView";
import { MerchantSettingsView } from "./Views/StoreSettingsView";
import { MerchantSupportView } from "./Views/Support";
import { LearningCenterView } from "./Views/LearningCenterView";
import { MerchantIntelligenceHub } from "./Views/MarketsINsider";
import { MerchantNotificationsView } from "./Views/MerchantNotificationsView";
// --- Types & Config ---

type ViewId = 
  | "dashboard" | "products" | "orders" | "finances" 
  | "branches" | "settings" | "profile" | "support" 
  | "learn" | "biznews"| "alerts";

interface NavLink {
  id: ViewId;
  label: string;
  icon: React.ElementType;
}

const NAV_LINKS: NavLink[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "My Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "finances", label: "Finances", icon: Wallet },
  { id: "branches", label: "Branches", icon: MapPin },
  { id: "settings", label: "Store Settings", icon: Settings },
  { id: "profile", label: "Business Profile", icon: User2 },
  { id: "alerts", label: "Vendor Alerts", icon: BellCheckIcon },
  
  { id: "support", label: "Merchant Support", icon: HelpCircle },
  { id: "learn", label: "Learning Center", icon: BookOpenCheck },
  { id: "biznews", label: "Markets Insider", icon: NewspaperIcon }
];

// --- Main Component ---

function App() {
  const {isMerchant, isAuthenticated, isLoading, userLogout, isMerchantVerified, merchantProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ViewId>(() => 
    (sessionStorage.getItem("sokoActiveView") as ViewId) || "dashboard"
  );


  const handleViewChange = (viewId: ViewId) => {
    setActiveView(viewId);
    sessionStorage.setItem("sokoActiveView", viewId);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard": return <DashboardOverview />;
      case "branches": return <BranchesView />;
      case "products": return <ProductsView />;
      case "orders": return <OrdersView />;
      case "finances": return <FinancesView />;
      case "profile": return <ProfileView merchantData={merchantProfile} />;
      case "alerts" : return <MerchantNotificationsView />;
      case "settings": return <MerchantSettingsView merchant={merchantProfile} />;
      case "support": return <MerchantSupportView />;
      case "learn": return <LearningCenterView />;
      case "biznews": return <MerchantIntelligenceHub />;
      default: return <DashboardOverview />;
    }
  };

  // --- Auth Guards ---
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

  // --- App Layout ---
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 antialiased">
      
      {/* SIDEBAR */}
      <aside className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-300 shrink-0 ${sidebarOpen ? "w-64" : "w-20"}`}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          {sidebarOpen && (
            <div className="flex items-center">
              <Store className="h-6 w-6 text-emerald-600 mr-2" />
              <span className="font-black text-xl tracking-tight text-slate-900">Soko<span className="text-emerald-600 font-light">Sellers</span></span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors mx-auto">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleViewChange(link.id)}
              className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeView === link.id ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              } ${!sidebarOpen && "justify-center"}`}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{link.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => userLogout()}
            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors ${!sidebarOpen && "justify-center"}`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="flex flex-col flex-1 h-full min-w-0">
        <header className="flex h-3 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-1 "/>
        <main className="flex-1 overflow-y-auto px-3 pb-8   lg:pt-2  bg-slate-50/50">
        <div className="mx-auto max-w-7xl">{renderActiveView()} </div>
        </main>
      </section>
    </div>
  );
}

export default App;