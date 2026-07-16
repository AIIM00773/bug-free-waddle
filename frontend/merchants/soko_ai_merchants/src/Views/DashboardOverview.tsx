import React, { useEffect, useState } from 'react';
import { useAuth } from '../Providers/AuthProvider';

// Icons
import {
  MessageCircle,
  Package,
  ChartBarDecreasing,
  SquareStack,
  Star,
  RefreshCw,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  PackageOpen,
  TrendingUp,
  ListChecks,
  Store,
  PlusSquare,
  Check,
  ArrowRight,
  MapPin
} from 'lucide-react';

// Components
import { DashboardOverViewAlerts } from "../components/DashboardViewComponents/DynamicViewDataPanels/Alerts"; 
import { DashboardOverviewOrders } from "../components/DashboardViewComponents/DynamicViewDataPanels/Orders";
import { DashboardOverViewInventory } from "../components/DashboardViewComponents/DynamicViewDataPanels/Inventory";
import { DashboardOverViewReviews } from "../components/DashboardViewComponents/DynamicViewDataPanels/Reviews";

// --- TYPES & INTERFACES ---
const DASHBOARD_TABS = [
  { label: "Alerts", icon: MessageCircle },
  { label: "New Orders", icon: Package },
  { label: "Inventory", icon: SquareStack },
  { label: "Reviews", icon: Star },
] as const;

type ShopDashboardSummaryType = typeof DASHBOARD_TABS[number]["label"];

interface Branch {
  unique_id: string;
  branchName: string;
  cityTown: string;
  isPrimary?: boolean;
}

interface Order {
  unique_id: string;
  order_id: string;
  shippingCustomerName: string;
  branch: string;
  gross_sales_amount: string | number;
  status: string;
}

interface Alert {
  unique_id: string;
  Type: string;
  Message: string;
  Priority: 'HIGH' | 'MEDIUM' | 'LOW';
  created_at: string;
}

interface StockItem {
  unique_id: string;
  title: string;
  sku: string;
  category: string;
  price: number;
  currentStock: number;
  minimumStockThreshhold: number;
}

interface Review {
  unique_id: string;
  customer: string;
  ratting: string; // Kept as string to match exact backend scheme
  comment: string;
  date: string;
}

interface StatCardProps {
  title: string;
  value: string | number | null | undefined;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

// --- CONSTANTS & HELPERS ---
const ORDER_STATUS_COLORS: Record<string, string> = {
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  AWAITING_ALLOCATION: 'bg-amber-100 text-amber-800',
  PREPARING: 'bg-indigo-100 text-indigo-800',
  READY_FOR_PICKUP: 'bg-amber-100 text-amber-800',
  CANCELLED: 'bg-rose-100 text-rose-800',
  DISPATCHED: 'bg-blue-100 text-blue-800',
  DISPUTED: 'bg-red-100 text-red-800',
  DEFAULT: 'bg-slate-100 text-slate-800'
};

export const getStatusColor = (status: string) => ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.DEFAULT;

const isDashboardTab = (val: string | null): val is ShopDashboardSummaryType => {
  return DASHBOARD_TABS.some(t => t.label === val);
};

// --- SUB-COMPONENTS ---
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColor, iconBg }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-slate-500">{title}</span>
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
    </div>
    <div className="flex items-baseline justify-between">
      <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value ?? '-'}</h3>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export const DashboardOverview: React.FC = () => {
  const { user, merchantProfile, fetchMerchantProfile, isLoading } = useAuth();



  const [shopDashboardSummary, setShopDashboardSummary] = useState<ShopDashboardSummaryType>(() => {
    const saved = sessionStorage.getItem('activeShopDashboardSummaryView');
    return isDashboardTab(saved) ? saved : "Alerts";
  });

  useEffect(() => {
    if (shopDashboardSummary) {
      sessionStorage.setItem('activeShopDashboardSummaryView', shopDashboardSummary);
    } else {
      sessionStorage.removeItem('activeShopDashboardSummaryView');
    }
  }, [shopDashboardSummary]);

  const ordersList: Order[] = merchantProfile?._incoming_orders || [];
  const alertsList: Alert[] = merchantProfile?._merchant_alerts || [];
  const lowStockList: StockItem[] = merchantProfile?._catalog_low_stock_items || [];
  const fullStockList: StockItem[] = merchantProfile?._catalog_stock_items_overview || [];
  const reviewsList: Review[] = merchantProfile?._incoming_reviews || [];

  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-10 px-4 sm:px-1 lg:px-0">
    
      {/* 1. TOP WELCOME BAR */}
      <div className="relative overflow-hidden rounded-[3px] border border-slate-200/80 bg-green-200/10 shadow-lg">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
        
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT CONTENT */}
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {merchantProfile?.shopName || "My Shop"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your store, branches and customer orders.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {merchantProfile?.shopCategoryPersist || "General"}
              </span>

              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                user?.is_merchant_verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}>
                {user?.is_merchant_verified && <Check className="h-3.5 w-3.5" />}
                {user?.is_merchant_verified ? "Verified Merchant" : "Verification Pending"}
              </span>

              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                merchantProfile?.is_accepting_orders ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"
              }`}>
                {merchantProfile?.is_accepting_orders ? "Accepting Orders" : "Orders Paused"}
              </span>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex w-full gap-3 lg:w-auto">
            {branchesList.length > 0 ? (
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="h-11 min-w-[270px] rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              >
                {branchesList.map((branch) => (
                  <option key={branch.unique_id} value={branch.unique_id}>
                    {branch.branchName} • {branch.cityTown}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex flex-row items-center justify-center">
                <p className="text-red-500 text-[13px] font-bold"> !! NO BRANCH YET </p>
              </div>
            )}

            <button
              onClick={() => fetchMerchantProfile?.()}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 shadow-sm transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 active:scale-95"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS PERFORMANCE GRID */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title="Sales Today"
          value={merchantProfile?._gross_sales_today ? `KES ${merchantProfile._gross_sales_today.toLocaleString()}` : 'KES 0'}
          icon={DollarSign} iconColor="text-emerald-600" iconBg="bg-emerald-100"
        />
        <StatCard
          title="Waiting Orders"
          value={merchantProfile?._awaiting_orders_queue || 0}
          icon={ShoppingCart} iconColor="text-blue-600" iconBg="bg-blue-100"
        />
        <StatCard
          title="Low Stocks"
          value={lowStockList.length}
          icon={AlertCircle} iconColor="text-rose-600" iconBg="bg-rose-100"
        />
        <StatCard
          title="Gross Earnings"
          value={merchantProfile?._gross_net_payout ? `KES ${merchantProfile._gross_net_payout.toLocaleString()}` : 'KES 0'}
          icon={TrendingUp} iconColor="text-amber-600" iconBg="bg-amber-100"
        />
        <StatCard
          title="Inventory Size"
          value={fullStockList.length}
          icon={PackageOpen} iconColor="text-indigo-600" iconBg="bg-indigo-100"
        />
      </div>

      {/* 3. CORE ANALYTICS AND MONITORING BOARD */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* LEFT BLOCK: ACTIVE FEEDS & SUMMARY WORKSPACES */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <ListChecks size={18} className="text-indigo-600" />
              Shop Summary & Overview
            </h3>
          </div>

          {/* TAB TRACK BAR */}
          <div className="px-6 pt-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2 pb-4 md:grid md:grid-cols-4 md:gap-3">
              {DASHBOARD_TABS.map((tab) => {
                const isActive = shopDashboardSummary === tab.label;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setShopDashboardSummary(tab.label)}
                    className={`text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer hover:bg-slate-900/30  hover:text-[aliceblue]  transition-all duration-200 ${
                      isActive ? "bg-slate-900 text-white shadow-md" : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-indigo-400" : "text-slate-400"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC VIEW DATA PANELS */}
          <div className="p-0">
            {/* VIEW: ALERTS */}
            {shopDashboardSummary === "Alerts" && (
              <DashboardOverViewAlerts alertsList={alertsList} /> 
            )}

            {/* VIEW: NEW ORDERS */}
            {shopDashboardSummary === "New Orders" && (
              <DashboardOverviewOrders ordersList={ordersList}  getStatusColor={getStatusColor}/>
            )}

            {/* VIEW: INVENTORY INDEX */}
            {shopDashboardSummary === "Inventory" && (
              <DashboardOverViewInventory fullStockList={fullStockList} />
            )}

            {/* VIEW: REVIEWS */}
            {shopDashboardSummary === "Reviews" && (
              <DashboardOverViewReviews reviewsList={reviewsList} /> 
            )}
          </div>
        </div>

        {/* RIGHT BLOCK: BRANCH CARD MATRIX DISPLAY */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Store size={18} className="text-indigo-600" />
              Business Branches
            </h4>
            <button 
              onClick={() => setAddNewBranch(true)} 
              className="text-indigo-600 hover:text-indigo-800 transition-colors" 
              title="Add Branch"
            >
              <PlusSquare size={20} />
            </button>
          </div>

          <div className="p-6 flex-1 bg-slate-50/30 overflow-y-auto max-h-[500px]">
            {branchesList.length ? (
              <div className="space-y-3">
                {branchesList.map((branch) => (
                  <div key={branch.unique_id} className="group flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-200 hover:shadow transition-all">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-900 text-sm flex items-center gap-1.5">
                          {branch.branchName}
                          {branch.isPrimary && (
                            <span className="inline-flex items-center rounded bg-indigo-50 px-1.5 py-0.5 text-xxs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                              Primary
                            </span>
                          )}
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">{branch.cityTown}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 text-slate-500">
                <Store size={32} className="text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-900">No Branches Setup</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Add your physical locations or fulfillment centers to get started.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
