import { useState } from 'react';
import {
    User,
    Mail,
    Package,
    Wallet,
    MapPin,
    Heart,
    CreditCard,
    ShieldCheck,
    KeyRound,
    LogOut,
    ArrowLeft,
    Eye,
    EyeOff,
    ChevronRight,
    ShoppingCart,
    Search,
    FileText,
    ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
    const [showSecretCode, setShowSecretCode] = useState(false);
    const [secretCode] = useState("SK-99X2-LK71");
    // Change this mock state to test Authenticated vs Guest view layouts
    const [isAuthenticated] = useState(true);

    // Mock cart count state
    const [cartCount] = useState(3);


    const recentOrders = [
        { id: "ORD-2026-8941", item: "AeroMesh Onyx Running Shoes", date: "June 02, 2026", status: "In Transit", total: "KSh 9,500" },
        { id: "ORD-2026-7712", item: "Ergonomic Office High-Back Chair", date: "May 24, 2026", status: "Delivered", total: "KSh 18,500" },
    ];

    return (
        <div className="min-h-screen w-screen bg-slate-50/50 text-slate-800 font-sans antialiased overflow-y-auto">

            {/* Minimal Header Navigation */}
            <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-6 sticky top-0 z-50 select-none">
                <div className="max-w-4xl w-full mx-auto flex items-center justify-between">

                    {/* LEFT: Clean Consumer Brand Anchor */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white transition-transform group-hover:scale-[1.02]">
                            <ShoppingBag className="h-4.5 w-4.5 stroke-[2]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-slate-900 leading-none">SokoAI</span>
                            <span className="text-[10px] hidden xs:inline text-slate-400 font-normal mt-0.5">Smart Shopping</span>
                        </div>
                    </Link>

                    {/* RIGHT: Straightforward Shopper Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* Order History Deep Link */}
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                            <FileText className="h-3.5 w-3.5" />
                            <span className=" xs:inline">Orders</span>
                        </button>

                        <span className="h-4 w-px bg-slate-200/60 my-auto mx-1"></span>

                        {/* Clean Shopping Cart Anchor */}
                        <Link to="/cart" className="relative">
                            <button className="h-9 w-9 rounded-xl border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all group">
                                <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-105" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </Link>

                        {/* Simple Customer Profile Dropdown Target */}
                        <div className="h-9 w-9 hidden xs:inline  rounded-xl bg-slate-100 border border-slate-200/40 flex items-center justify-center text-slate-700 font-medium text-xs shadow-2xs cursor-pointer hover:border-slate-300 transition-colors">
                            AK
                        </div>

                    </div>
                </div>
            </header>


            {/* Main Profile Context */}
            <main className="max-w-4xl mx-auto px-6 py-12 space-y-6">

                {/* 1. CUSTOMER SUMMARY BANNER */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                            <User className="h-4 w-4 stroke-[1.5]" />
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="text-sm font-semibold text-slate-900 tracking-tight">Alex Kamau</h1>
                            <p className="text-xs text-slate-400 font-normal flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 opacity-70" /> alex.kamau@soko.ai
                            </p>
                        </div>
                    </div>

                    {/* Balanced E-commerce Parameters */}
                    <div className="grid grid-cols-2 gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 min-w-[130px]">
                            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider block">Soko Wallet</span>
                            <span className="text-sm font-semibold font-mono text-slate-900 mt-0.5 block">KSh 3,450</span>
                        </div>
                        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 min-w-[130px]">
                            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider block">Tracked Items</span>
                            <span className="text-sm font-semibold font-mono text-slate-900 mt-0.5 block">14 Products</span>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN HUB GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                    {/* LEFT PANEL: Core Workspace Node Streams */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Order History Frame */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-slate-400" />
                                    <h3 className="text-xs font-semibold text-slate-900 tracking-tight">Recent Orders</h3>
                                </div>
                                <button className="text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors">View all logs</button>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group">
                                        <div className="min-w-0 space-y-0.5">
                                            <span className="text-xs font-medium text-slate-800 block truncate group-hover:text-slate-900 transition-colors">{order.item}</span>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                                <span>{order.id}</span>
                                                <span className="text-slate-200">•</span>
                                                <span>{order.date}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 space-y-1">
                                            <span className="text-xs font-medium font-mono text-slate-900 block">{order.total}</span>
                                            <span className={`text-[9px] font-medium px-2 py-0.5 rounded-md inline-block tracking-wide ${order.status === 'In Transit'
                                                    ? 'bg-amber-50/70 text-amber-700 border border-amber-200/30'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200/30'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Traditional Infrastructure Actions */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                            <h3 className="text-xs font-semibold text-slate-900 tracking-tight mb-3">System Preferences</h3>

                            {[
                                { icon: MapPin, label: "Shipping Addresses", desc: "Manage destination configurations across regional distribution hubs." },
                                { icon: CreditCard, label: "Payment Integrations", desc: "Configure primary M-Pesa accounts and billing infrastructure." },
                                { icon: Heart, label: "Automated Price Watchlist", desc: "Review indexed items currently monitored for market shifts." },
                            ].map((row, idx) => (
                                <button key={idx} className="w-full flex items-center justify-between py-3 hover:bg-slate-50/60 rounded-xl px-2.5 -mx-2.5 transition-all group text-left">
                                    <div className="flex gap-3.5 items-start min-w-0">
                                        <row.icon className="h-4 w-4 text-slate-400 mt-0.5 group-hover:text-slate-600 transition-colors shrink-0" />
                                        <div className="space-y-0.5">
                                            <span className="text-xs font-medium text-slate-800 block group-hover:text-slate-900 transition-colors">{row.label}</span>
                                            <span className="text-[11px] text-slate-400 block font-normal leading-normal">{row.desc}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* RIGHT PANEL: Credentials, Encryption Security & Session States */}
                    <div className="space-y-6">

                        {/* Security Architecture Component */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-slate-400" />
                                <h3 className="text-xs font-semibold text-slate-900 tracking-tight">Security Credentials</h3>
                            </div>

                            {/* Account Isolation Code Field */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-wider block">
                                    Account Secret Authorization Code
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 flex items-center justify-between font-mono text-xs transition-colors focus-within:bg-white">
                                        <span className={showSecretCode ? "text-slate-800 font-medium tracking-normal" : "text-slate-300 font-black tracking-widest"}>
                                            {showSecretCode ? secretCode : "••••••••••••"}
                                        </span>
                                        <button
                                            onClick={() => setShowSecretCode(!showSecretCode)}
                                            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded"
                                        >
                                            {showSecretCode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-normal font-normal">
                                    Used to verify checkout execution actions when committing cross-marketplace purchase tasks.
                                </p>
                            </div>

                            <hr className="border-slate-100 my-1" />

                            <div className="flex items-center justify-between pt-1">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                                        <KeyRound className="h-3.5 w-3.5 text-slate-400" /> Password
                                    </span>
                                    <span className="text-[10px] text-slate-400 block font-normal">Updated 30 days ago</span>
                                </div>
                                <button className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs active:scale-[0.98]">
                                    Change
                                </button>
                            </div>
                        </div>

                        {/* Interactive Session Access Control Action (Log Out or Sign In) */}
                        {isAuthenticated ? (
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50/30 text-slate-500 hover:text-rose-600 rounded-xl text-xs font-medium transition-all shadow-2xs active:scale-[0.99] group">
                                <LogOut className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-500 transition-colors shrink-0" />
                                <span>Terminate current session</span>
                            </button>
                        ) : (
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-all shadow-sm active:scale-[0.99]">
                                <span>Sign In to SokoAI</span>
                            </button>
                        )}

                    </div>
                </div>

            </main>
        </div>
    );
}