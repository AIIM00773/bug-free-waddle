import React, { useEffect, useState } from 'react';
import { useAuth } from '../Providers/AuthProvider';

import {
    ChartBarDecreasing,
    Check,
    MessageCircle,
    Package,
    PlusSquare,
    RefreshCw,
    SquareStackIcon,
    Star,
    Store,
    DollarSign,
    ShoppingCart,
    PackageOpen,
    TrendingUp,
    ListChecks,
    LayoutGrid,
    MapPin,
    Truck,
    AlertCircle,
    Plus
} from 'lucide-react';

import AddBranchForm from './onboarding/MerchnatStoreBranchAddForm';

const DASHBOARD_TABS = [
    { label: "Alerts", icon: MessageCircle },
    { label: "New Orders", icon: Package },
    { label: "Low Stock", icon: ChartBarDecreasing },
    { label: "Inventory", icon: SquareStackIcon },
    { label: "Reviews", icon: Star },
] as const;



type ShopDashboardSummaryType = typeof DASHBOARD_TABS[number]["label"];
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



const getStatusColor = (status: string) => {
    return ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.DEFAULT;
};



// Type guard for session storage validation
const isDashboardTab = (val: string | null): val is ShopDashboardSummaryType => {
    return DASHBOARD_TABS.some(t => t.label === val);
};


// --- COMPONENTS ---

interface StatCardProps {
    title: string;
    value: string | number | null | undefined;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
}



const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColor, iconBg }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">{title}</span>
            <div className={`p-2 rounded-lg ${iconBg}`}>
                <Icon size={18} className={iconColor} />
            </div>
        </div>
        <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                {value ?? '-'}
            </h3>
        </div>
    </div>
);










export const DashboardOverview: React.FC = () => {
    const { user, merchantProfile, fetchMerchantProfile } = useAuth();
    const [MainBranchSetupResuest, setMainBranchSetupResuest] = useState<boolean>(false);
    const [addNewBranch, setAddNewBranch] = useState<boolean>(false)

    const [shopDashboardSummary, setShopDashboardSummary] = React.useState<ShopDashboardSummaryType>(() => {
        const saved = sessionStorage.getItem('activeShopDashboardSummaryView');
        return isDashboardTab(saved) ? saved : "Alerts";
    });


    useEffect(() => {
        const branches = merchantProfile?._business_branches?.length as number;
        if (branches < 1) {
            setMainBranchSetupResuest(true);

        }



    }, [merchantProfile])

    useEffect(() => {
        if (shopDashboardSummary) {
            sessionStorage.setItem('activeShopDashboardSummaryView', shopDashboardSummary);
        } else {
            sessionStorage.removeItem('activeShopDashboardSummaryView');
        }
    }, [shopDashboardSummary]);



    if (addNewBranch) return (
        <AddBranchForm  onCancel={()=>setAddNewBranch(false)}/>
    )

    return (


        <div className="space-y-6 max-w-7xl mx-auto pb-10">



            {MainBranchSetupResuest && (
                <div className="fixed inset-0   absolute  flex items-center justify-center bg-emerald-950/85 backdrop-blur-sm p-0 t-0 l-0 b-0 r-0  animate-fade-in min-h-[100vh] max-h-[100vh] overflow-y-auto">
                    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-emerald-800/20 overflow-hidden transform transition-all scale-100 flex flex-col max-h-[97vh] overflow-auto">

                        {/* Visual Header Banner */}
                        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 text-white text-center relative">
                            <div className="absolute top-3 right-4 flex items-center space-x-1 bg-red-500/20 text-red-200 text-xs uppercase px-2 py-0.5 rounded-full border border-red-400/30">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                <span>Setup Required</span>
                            </div>
                            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                                <LayoutGrid className="w-7 h-7 text-emerald-100" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Activate Your Merchant Profile</h2>
                            <p className="text-emerald-100/80 text-sm mt-1">Before you can start trading, you need to configure your first business branch hub.</p>
                        </div>

                        {/* Content Body explaining the system */}
                        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh]">

                            {/* Section 1: What is it? */}
                            <div className="flex gap-4 items-start">
                                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl dark:bg-emerald-900/20 dark:text-emerald-400 shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">What is a Store Branch?</h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                                        A branch represents a physical shop, distribution center, or regional warehouse where your inventory is housed. Even if you operate entirely online out of a single room, this setup serves as your foundational digital operational hub.
                                    </p>
                                </div>
                            </div>

                            {/* Section 2: What does it do? */}
                            <div className="flex gap-4 items-start">
                                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl dark:bg-emerald-900/20 dark:text-emerald-400 shrink-0">
                                    <LayoutGrid className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">What functions does it serve?</h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                                        It allows you to assign store managers, set custom operations schedules (opening/closing hours), log precise GPS markers for automated delivery dispatch coordinates, and organize localized stock points.
                                    </p>
                                </div>
                            </div>

                            {/* Section 3: Why is it needed? */}
                            <div className="flex gap-4 items-start">
                                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl dark:bg-emerald-900/20 dark:text-emerald-400 shrink-0">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Why is it strictly required?</h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                                        Our automated system relies on a <strong className="text-emerald-700 dark:text-emerald-400 font-medium">Primary Fulfillment Center</strong> to route customer orders accurately. Without geotagged latitude/longitude records and verified operation metrics, delivery mapping APIs cannot quote shipping costs or assign courier dispatch tracks.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Interactive Action Footer */}
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
                                Takes less than 2 minutes to fill out location, hours, and contacts.
                            </p>
                            <button
                                onClick={() => {
                                    // Trigger your navigation route or open your branch-creation sub-form here
                                    // e.g., router.push('/dashboard/branches/create') or setOpenCreateModal(true)
                                    setAddNewBranch(true);
                                    setMainBranchSetupResuest(false);
                                }}
                                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create Primary Branch Now</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}


            {/* 1. TOP WELCOME OVERLAY BAR */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            {merchantProfile?.shopName || 'My Shop'}
                        </h2>
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                            {merchantProfile?.shopCategoryPersist || 'General'}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <p>{merchantProfile?.shopDescription || 'Manage your store analytics and operations.'}</p>
                        <span className="text-slate-300">•</span>

                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${user?.is_merchant_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                            {user?.is_merchant_verified && <Check className="h-3 w-3" />}
                            {user?.is_merchant_verified ? 'Verified' : 'Not Verified'}
                        </span>

                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${merchantProfile?.is_accepting_orders ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'}`}>
                            {merchantProfile?.is_accepting_orders ? 'Accepting Orders' : 'Not Accepting Orders'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select className="flex-1 sm:flex-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer">
                        <option value="">Select Branch</option>
                        {merchantProfile?._business_branches?.map((branch) => (
                            <option key={branch.unique_id} value={branch.unique_id}>
                                {branch.branchName} ({branch.cityTown})
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => fetchMerchantProfile()}
                        className="rounded-lg bg-white border border-slate-200 p-2.5 text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* 2. STATS PERFORMANCE GRID */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3  lg:grid-cols-5">
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
                    value={merchantProfile?._catalog_low_stock_items?.length || 0}
                    icon={AlertCircle} iconColor="text-rose-600" iconBg="bg-rose-100"
                />
                <StatCard
                    title="Gross Earnings"
                    value={merchantProfile?._gross_net_payout ? `KES ${merchantProfile._gross_net_payout.toLocaleString()}` : 'KES 0'}
                    icon={TrendingUp} iconColor="text-amber-600" iconBg="bg-amber-100"
                />
                <StatCard
                    title="Inventory Size"
                    value={merchantProfile?._catalog_stock_items_overview?.length || 0}
                    icon={PackageOpen} iconColor="text-indigo-600" iconBg="bg-indigo-100"
                />
            </div>


            {/* 3. CORE ANALYTICS AND MONITORING BOARD */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* LEFT COLUMN: ACTIVE INCOMING ORDER FEED */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
                    <div className="border-b border-slate-100 px-6 py-5">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <ListChecks size={18} className="text-indigo-600" />
                            Shop Summary & Overview
                        </h3>
                    </div>

                    {/* TABS */}
                    <div className="px-6 pt-4 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-2 pb-4">
                            {DASHBOARD_TABS.map((tab) => {
                                const isActive = shopDashboardSummary === tab.label;
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.label}
                                        onClick={() => setShopDashboardSummary(tab.label)}
                                        className={`text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${isActive
                                            ? "bg-slate-900 text-white shadow-md"
                                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            }`}
                                    >
                                        <Icon size={16} className={isActive ? "text-indigo-400" : "text-slate-400"} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>



                    {/* TAB CONTENT */}
                    <div className="p-0">
                        {shopDashboardSummary === "New Orders" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            <th className="px-6 py-4">Order ID</th>
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Branch</th>
                                            <th className="px-6 py-4 text-right">Amount</th>
                                            <th className="px-6 py-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {merchantProfile?._incoming_orders?.length ? (
                                            merchantProfile._incoming_orders.map((order) => (
                                                <tr key={order.unique_id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{order.order_id}</td>
                                                    <td className="px-6 py-4 text-slate-600">{order.shippingCustomerName}</td>
                                                    <td className="px-6 py-4 text-slate-600">{order.branch}</td>
                                                    <td className="px-6 py-4 font-medium text-slate-900 text-right">{order.gross_sales_amount}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                                                    <h3 className="text-sm font-medium text-slate-900 mb-1">No Incoming Orders</h3>
                                                    <p className="text-sm text-slate-500">You currently have no new orders. Once a customer places an order, it will appear here for processing.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {shopDashboardSummary === "Alerts" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4 w-full">Message</th>
                                            <th className="px-6 py-4">Priority</th>
                                            <th className="px-6 py-4 text-right">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {merchantProfile?._merchant_alerts?.length ? (
                                            merchantProfile._merchant_alerts.map((alert) => (
                                                <tr key={alert.unique_id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{alert.Type}</td>
                                                    <td className="px-6 py-4 text-slate-600 whitespace-normal">{alert.Message}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${alert.Priority === 'HIGH' ? 'bg-rose-100 text-rose-800' :
                                                            alert.Priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                                                                'bg-slate-100 text-slate-800'
                                                            }`}>
                                                            {alert.Priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-slate-500 text-right">{alert.created_at}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="px-6 py-4 text-center text-slate-500" colSpan={4}>
                                                    <p className="text-sm font-medium text-slate-900 mb-1">No Alerts</p>
                                                    <p className="text-sm text-slate-500">
                                                        Hello! You currently have no alerts or notifications.
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {shopDashboardSummary === "Low Stock" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4 text-right">Current</th>
                                            <th className="px-6 py-4 text-right">Threshold</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {merchantProfile?._catalog_low_stock_items?.length ? (
                                            merchantProfile._catalog_low_stock_items.map((item) => (
                                                <tr key={item.unique_id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                                                    <td className="px-6 py-4 text-slate-600">{item.category}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-md">{item.currentStock}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 text-right">{item.minimumStockThreshhold}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                                                            Restock
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (merchantProfile?._catalog_stock_items_overview?.length ?? 0) === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                                                    <h3 className="text-sm font-medium text-slate-900 mb-1">You have an Empty Catalog</h3>
                                                    <p className="text-sm text-slate-500">You currently have no items added!</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                                                    <h3 className="text-sm font-medium text-slate-900 mb-1">No items below the limit</h3>
                                                    <p className="text-sm text-slate-500">Your catalog is relatively stable!</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {shopDashboardSummary === "Inventory" && (
                            <div>
                                {(merchantProfile?._catalog_stock_items_overview?.length ?? 0) > 0 && (
                                    <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                                        <p className="text-sm text-slate-600">You have <span className="font-semibold text-slate-900">{merchantProfile?._catalog_stock_items_overview?.length} +</span> items currently in your catalog.</p>
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                <th className="px-6 py-4">Product Name</th>
                                                <th className="px-6 py-4">SKU</th>
                                                <th className="px-6 py-4 text-right">Price</th>
                                                <th className="px-6 py-4 text-right">Stock</th>
                                                <th className="px-6 py-4 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {merchantProfile?._catalog_stock_items_overview?.length ? (
                                                merchantProfile._catalog_stock_items_overview.map((item) => (
                                                    <tr key={item.unique_id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.sku}</td>
                                                        <td className="px-6 py-4 text-right text-slate-600">${item.price.toFixed(2)}</td>
                                                        <td className="px-6 py-4 text-right font-medium text-slate-900">{item.currentStock}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${item.currentStock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                                {item.currentStock > 10 ? 'In Stock' : 'Low'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                                                        <h3 className="text-sm font-medium text-slate-900 mb-1">You have an Empty Catalog</h3>
                                                        <p className="text-sm text-slate-500">You currently have no items added!</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {shopDashboardSummary === "Reviews" && (
                            <div>
                                {(merchantProfile?._incoming_reviews?.length ?? 0) > 0 && (
                                    <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                                        <p className="text-sm text-slate-600">You have <span className="font-semibold text-slate-900">{merchantProfile?._incoming_reviews?.length}</span> new customer reviews to attend to.</p>
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                                                <th className="px-6 py-4 whitespace-nowrap">Rating</th>
                                                <th className="px-6 py-4 w-full">Comment</th>
                                                <th className="px-6 py-4 text-right whitespace-nowrap">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {merchantProfile?._incoming_reviews?.length ? (
                                                merchantProfile._incoming_reviews.map((review) => (
                                                    <tr key={review.unique_id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{review.customer}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex text-amber-400 text-lg">
                                                                {"★".repeat(parseInt(review.ratting, 10))}{"☆".repeat(5 - parseInt(review.ratting, 10))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 italic">"{review.comment}"</td>
                                                        <td className="px-6 py-4 text-right text-xs text-slate-500 whitespace-nowrap">{review.date}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-4 text-center text-slate-500">
                                                        <h3 className="text-sm font-medium text-slate-900 mb-1">No Reviews from Customers Yet</h3>
                                                        <p className="text-sm text-slate-500">Reviews for you will be listed here!</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>


                </div>



                {/* RIGHT COLUMN: BRANCH MATRIX */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <Store size={18} className="text-indigo-600" />
                            Business Branches
                        </h4>

                        {merchantProfile?._business_branches && merchantProfile._business_branches.length > 0 && (
                            <button className="text-indigo-600 hover:text-indigo-800 transition-colors" title="Add Branch">
                                <PlusSquare size={20} />
                            </button>
                        )}
                    </div>

                    <div className="p-6 flex-1 bg-slate-50/30">
                        {merchantProfile?._business_branches?.length ? (
                            <div className="space-y-3">
                                {merchantProfile._business_branches.map((branch) => (
                                    <div key={branch.unique_id} className="group flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-200 hover:shadow transition-all">
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 rounded-full bg-slate-100 p-2 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <MapPin size={16} />
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-slate-900">{branch.branchName}</h5>
                                                <p className="text-sm text-slate-500 mt-1">{branch.country}-{branch.county}-{branch.cityTown}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${branch.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                            {branch.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-12 px-6 text-center transition-all hover:border-indigo-200 hover:bg-slate-50/50">

                                {/* Optional: A subdued icon container adds a lot of professional polish to empty states */}
                                <div className="mb-4 rounded-full bg-slate-100 p-3 text-slate-400">
                                    <Store size={24} />
                                </div>

                                <p className="text-sm font-medium text-slate-900">
                                    No branches added yet.
                                </p>
                                <p className="mt-1 mb-6 text-sm text-slate-500">
                                    Get started by creating your first business location.
                                </p>

                                <button onClick={()=>setAddNewBranch(true)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    {/* Removed color='yellow' so it inherits the white text color automatically */}
                                    <PlusSquare size={16} />
                                    <span>New Branch</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};