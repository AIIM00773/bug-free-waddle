import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. Use Router Hooks for state management
import { useAdminAuth } from './Providers.tsx/AdminAuthAndProfileContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Globe,
  Coins,
  Layers,
  ShieldCheck,
  Users,
  ShoppingBagIcon,
  ShoppingCart,
  Settings,
  ChevronRight,
  MenuIcon,
  HelpCircleIcon,
  Store,
  X,
  Menu,
  LogOut,
  MessageSquare
} from 'lucide-react';

import AdminAuthGate from './Views/AdminAuth';
import AdminDashboardView from './Views/AdminDashboardView';
import ProductCatalogView from './Views/ProductCatalogView';
import MarketplaceProfilesView from './Views/MarketplaceProfilesView';
import TaxonomyMatricesView from './Views/TaxonomyMatricesView';
import CurrencyLedgerView from './Views/CurrencyLedgerView';
import PartnerMerchantsView from './Views/PartnerMerchantsView';
import OrderRecordsView from './Views/OrderRecordsView';
import CartAnalyticsView from './Views/CartAnalyticsView';
import PlatformUsersView from './Views/PlatformUsersView';
import CustomerServiceConsoleView from './Views/CustomerServiceConsoleView';
import AdminUserProfile from './Views/AminProfileView';
import AdminChatWorkspaceView from './Views/AdminCommsView';

type ActiveView =
  | 'dashboard'
  | 'products'
  | 'marketplaces'
  | 'currencies'
  | 'taxonomy'
  | 'merchants'
  | 'users'
  | 'orders'
  | 'carts'
  | 'ConsolidatedServiceConsole'
  | "chat"
  | 'profile';

interface NavItem {
  id: Exclude<ActiveView, 'profile'>;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export default function App() {
  const { isAuthenticated, adminUser, logout, isLoading } = useAdminAuth();

  // 2. Initialize search parameter sync tracking
  const [searchParams, setSearchParams] = useSearchParams();

  // 3. SINGLE SOURCE OF TRUTH: Derive active state directly from "?tab=" query param
  const currentView = (searchParams.get('tab') as ActiveView) || 'dashboard';

  // Keep sidebar layout state in sessionStorage since layout configuration isn't a route location
  const [toggleMenuView, setToggleMenuView] = useState<boolean>(() => {
    const savedToggle = sessionStorage.getItem('soko_menu_toggle');
    return savedToggle ? savedToggle === 'true' : true;
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Nav Groups definitions
  const coreOperationsGroup: NavItem[] = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'marketplaces', label: 'Marketplace Profiles', icon: Globe },
    { id: 'taxonomy', label: 'Taxonomy Matrices', icon: Layers },
    { id: 'currencies', label: 'Currency Ledger', icon: Coins },
  ];

  const businessDataGroup: NavItem[] = [
    { id: 'merchants', label: 'Partner Merchants', icon: Store },
    { id: 'products', label: 'Product Catalog', icon: ShoppingBag },
    { id: 'orders', label: 'Order Records', icon: ShoppingBagIcon },
    { id: 'carts', label: 'Unified Carts View', icon: ShoppingCart },
    { id: 'users', label: 'Platform Users', icon: Users },
  ];

  const customerServicingGroup: NavItem[] = [
    { id: 'ConsolidatedServiceConsole', label: 'Service Console', icon: HelpCircleIcon },
  ];



  const adminComunicationGroup: NavItem[] = [
    { id: 'chat', label: 'Operations Chat', icon: MessageSquare },
  ];




  // 4. View controller updates the URL parameters instead of tracking local hooks
  const handleViewChange = (view: ActiveView) => {
    setSearchParams({ tab: view });
    setMobileSidebarOpen(false);
  };

  const handleToggleMenu = () => {
    const nextState = !toggleMenuView;
    setToggleMenuView(nextState);
    sessionStorage.setItem('soko_menu_toggle', String(nextState));
  };

  if (!isAuthenticated) {
    return <AdminAuthGate />;
  }

  if (isLoading && !adminUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 text-xs font-medium text-slate-500">
        <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <span>Running Hardware Cryptographic Diagnostics...</span>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard': return <AdminDashboardView />;
      case 'products': return <ProductCatalogView />;
      case 'taxonomy': return <TaxonomyMatricesView />;
      case 'marketplaces': return <MarketplaceProfilesView />;
      case 'currencies': return <CurrencyLedgerView />;
      case 'merchants': return <PartnerMerchantsView />;
      case 'users': return <PlatformUsersView />;
      case 'orders': return <OrderRecordsView />;
      case 'carts': return <CartAnalyticsView />;
      case 'ConsolidatedServiceConsole': return <CustomerServiceConsoleView />;
      case 'chat': return <AdminChatWorkspaceView />;
      case 'profile': return <AdminUserProfile />;
      default: return <AdminDashboardView />;
    }
  };

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleViewChange(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group border cursor-pointer ${isActive
          ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
          : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 border-transparent'
          }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon size={14} className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors shrink-0`} />
          <span>{item.label}</span>
        </div>
        {isActive && <ChevronRight size={12} className="text-slate-400" />}
      </button>
    );
  };

  return (
    <div className="min-h-screen h-screen overflow-hidden flex bg-slate-50 text-slate-800 font-sans antialiased relative">

      {/* DESKTOP SIDEBAR */}
      {toggleMenuView && (
        <aside className="hidden lg:flex flex-col w-64 bg-slate-100 border-r border-slate-200 shrink-0 p-5 justify-between h-full">
          <div className="space-y-6 overflow-y-auto pr-1 -mr-1">

            {/* Identity Header */}
            <div className="flex items-center gap-3 px-1 pb-4 border-b border-slate-200/80 justify-between">
              <div className="flex flex-row gap-3 items-center justify-start">
                <div className="h-9 w-9 bg-slate-900 rounded-full flex items-center justify-center text-white font-medium text-xs tracking-tight shadow-sm">
                  ska
                </div>
                <div className="leading-tight">
                  <h1 className="text-xs font-semibold text-slate-900 tracking-wide uppercase">Soko AI</h1>
                  <span className="text-[10px] text-slate-400 font-medium block">System Node</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleMenu}
                className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Navigation Groups */}


            <div className="space-y-1.5">
              <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-3">Internal Comms</h4>
              <nav className="space-y-0.5">{adminComunicationGroup.map(renderNavButton)}</nav>
            </div>


            <div className="space-y-1.5">
              <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-3">Infrastructure</h4>
              <nav className="space-y-0.5">{coreOperationsGroup.map(renderNavButton)}</nav>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-3">Data Engine</h4>
              <nav className="space-y-0.5">{businessDataGroup.map(renderNavButton)}</nav>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-3">Customer Service</h4>
              <nav className="space-y-0.5">{customerServicingGroup.map(renderNavButton)}</nav>
            </div>
          </div>

          {/* Sidebar Footer Profile & Disconnect action */}
          <div className="pt-1 border-t border-slate-200/80 space-y-2 mt-4 shrink-0">
            <div
              onClick={() => handleViewChange('profile')}
              className={`p-2 rounded-xl border flex items-center justify-between shadow-xs cursor-pointer transition-all ${currentView === 'profile'
                ? 'bg-white border-blue-200 text-slate-900'
                : 'bg-white border-slate-200/80 hover:bg-slate-200/60'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span className="absolute top-0 right-0 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="leading-tight truncate">
                  <p className="text-[11px] font-medium text-slate-800 truncate">
                    {adminUser?.email || 'operator'}
                  </p>
                  <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block truncate max-w-[120px]">
                    Access Node
                  </span>
                </div>
              </div>
              <div className="p-1 text-slate-400">
                <Settings size={13} />
              </div>
            </div>

          </div>
        </aside>
      )}

      {/* FIXED FLOATING MENU DESKTOP TOGGLE */}
      {!toggleMenuView && (
        <button
          onClick={handleToggleMenu}
          className="hidden lg:flex fixed top-4 left-4 p-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm hover:bg-slate-800 transition-colors z-50 cursor-pointer items-center justify-center"
          title="Open Navigation Workspace"
        >
          <MenuIcon size={14} />
        </button>
      )}

      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 bg-slate-900 rounded-lg text-white font-medium text-xs flex items-center justify-center shadow-xs">S</div>
          <span className="text-xs font-medium text-slate-900 uppercase tracking-wider">Soko Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 transition-colors"
        >
          {mobileSidebarOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>






      {/* MOBILE DRAWER WINDOW */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 top-14 bg-slate-900/20 backdrop-blur-xs z-40" onClick={() => setMobileSidebarOpen(false)}>
          <nav className="w-64 h-full bg-slate-100 p-4 border-r border-slate-200 flex flex-col justify-between overflow-y-auto" onClick={(e) => e.stopPropagation()}>

            <div className="space-y-5">

              {/* Mobile view insertion point */}
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-medium text-slate-400 uppercase tracking-widest px-3">Internal Comms</h4>
                {adminComunicationGroup.map(renderNavButton)}
              </div>


              <div className="space-y-1.5">
                <h4 className="text-[9px] font-medium text-slate-400 uppercase tracking-widest px-3">Infrastructure</h4>
                {coreOperationsGroup.map(renderNavButton)}
              </div>
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-medium text-slate-400 uppercase tracking-widest px-3">Data Engine</h4>
                {businessDataGroup.map(renderNavButton)}
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[9px] font-medium text-slate-400 uppercase tracking-widest px-3">Customer Service</h4>
                {customerServicingGroup.map(renderNavButton)}
              </div>
            </div>



            <div className="space-y-3 mt-8">
              <div
                onClick={() => handleViewChange('profile')}
                className={`p-3 rounded-xl border text-xs text-slate-500 flex items-center gap-2 cursor-pointer ${currentView === 'profile' ? 'bg-white border-blue-200' : 'bg-white border-slate-200'
                  }`}
              >
                <ShieldCheck size={14} className="text-emerald-600" />
                <div className="leading-none">
                  <span className="block font-medium text-slate-800 text-[10px]">@{adminUser?.first_name || 'operator'}</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-tight">Access Node</span>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <LogOut size={13} /> Disconnect
              </button>
            </div>
          </nav>
        </div>
      )}



      {/* MAIN DATA RENDERING CANVAS */}
      <main className={`flex-1 flex flex-col pt-14 lg:pt-0 overflow-hidden transition-all duration-200 ${!toggleMenuView ? 'lg:pl-16' : ''}`}>
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </div>
      </main>

    </div>
  );
}