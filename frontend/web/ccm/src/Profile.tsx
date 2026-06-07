import { useState } from 'react';
import {
    User,
    Mail,
    Package,
    MapPin,
    Heart,
    CreditCard,
    ShieldCheck,
    KeyRound,
    LogOut,
    Eye,
    EyeOff,
    ChevronRight,
    FileText,
    ShoppingBag,
    ChevronLeft,
    X,
    Loader2,
    Plus,
    Bell,
    Smartphone,
    ArrowUpRight,
    TrendingDown
} from 'lucide-react';



import { useAuth } from './Providers/AuthContex';
import { Link } from 'react-router-dom';
import SokoLogo from './Constants/Logo';



// Production Mock Data structures for regional Kenyan marketplace contexts
const MOCK_ORDERS = [
    { id: 'SOKO-8921-NBO', item: 'Sony WH-1000XM4 Noise Cancelling Headphones', price: 'KSh 32,500', date: 'June 04, 2026', platform: 'Jumia', status: 'Delivered' },
    { id: 'SOKO-4412-MSA', item: 'Logitech MX Master 3S Wireless Mouse', price: 'KSh 14,200', date: 'May 28, 2026', platform: 'SkyGarden', status: 'In Transit' },
];

const MOCK_ADDRESSES = [
    { id: 'addr-1', tag: 'Primary Office', location: 'Mintel Business Suites, Room 4B', region: 'Kilimani, Nairobi' },
    { id: 'addr-2', tag: 'Residential Pickup', location: 'Juja Modern Apartments, Block C', region: 'Juja, Kiambu' }
];

const MOCK_WATCHLIST = [
    { id: 'watch-1', title: 'Apple MacBook Pro M1 8GB/256GB', currentPrice: 'KSh 115,000', drop: '-12%', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&auto=format&fit=crop&q=60' },
    { id: 'watch-2', title: 'Samsung Galaxy S23 Ultra 5G', currentPrice: 'KSh 134,000', drop: '-5%', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150&auto=format&fit=crop&q=60' }
];


export default function ProfilePage() {
    const [showSecretCode, setShowSecretCode] = useState(false);
    const [secretCode] = useState("SK-99X2-LK71");
    const [cartCount] = useState(3);
    
    // Core State hooks managing modal data loops
    const [activeModal, setActiveModal] = useState<'address' | 'payment' | 'watchlist' | 'password' | null>(null);
    const [mpesaNumber, setMpesaNumber] = useState("0712345678");
    const [isSaving, setIsSaving] = useState(false);

    const { isAuthenticated, isLoading, logout } = useAuth();

    // Authentication Guard Frameworks
    if (isLoading) {
        return (
            <div className='min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-3'>
                <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                <span className="text-xs font-semibold text-slate-500 tracking-wide">Resolving secure user tokens...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className='min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center'>
                <div className="bg-white border border-slate-200 p-8 rounded-2xl max-w-sm shadow-sm space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900">Authentication Required</h2>
                    <p className="text-xs text-slate-500 leading-relaxed">You must be logged in for you to be able to access Your Profile.</p>
                    <Link to="/auth" className="block w-full text-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition">
                        Proceed  Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setActiveModal(null);
        }, 1000);
    };

    return (
        <div className="min-h-screen w-screen bg-slate-50/50 text-slate-800 font-sans antialiased overflow-y-auto relative">

            {/* HEADER NAVIGATION */}
            <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-6 sticky top-0 z-40 select-none">
                <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-0.5 group">
                        <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors mr-1" />
                        <SokoLogo showText={true} size={28} />
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                            <FileText className="h-3.5 w-3.5" />
                            <span>Orders</span>
                        </button>
                        <span className="h-4 w-px bg-slate-200/60 my-auto mx-1"></span>
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
                    </div>
                </div>
            </header>

            {/* MAIN PROFILE CONTEXT */}
            <main className="max-w-4xl mx-auto px-6 py-12 space-y-6">

                {/* 1. CUSTOMER SUMMARY BANNER */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm">
                            <User className="h-5 w-5 stroke-[1.75]" />
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="text-base font-bold text-slate-900 tracking-tight">Alex Kamau</h1>
                            <p className="text-xs text-slate-500 font-normal flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-slate-400" /> alex.kamau@soko.ai
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                        <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3 min-w-[155px]">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Watchlist</span>
                            <span className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                                <Bell className="h-3.5 w-3.5 text-emerald-600" /> {MOCK_WATCHLIST.length} Items Monitored
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN HUB GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="md:col-span-2 space-y-6">

                        {/* Recent Orders Frame */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-slate-400" />
                                    <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase opacity-80">Recent Cross-Marketplace Log</h3>
                                </div>
                                <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">View all pipelines</button>
                            </div>

                            <div className="divide-y divide-slate-100/80">
                                {MOCK_ORDERS.map((order) => (
                                    <div key={order.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-900 truncate block">{order.item}</span>
                                                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 font-sans tracking-wide
                                                    ${order.platform === 'Jumia' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-pink-50 text-pink-600 border border-pink-100'}
                                                `}>
                                                    {order.platform}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                <span className="font-mono">{order.id}</span>
                                                <span>•</span>
                                                <span>{order.date}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 space-y-1">
                                            <span className="text-xs font-bold text-slate-900 font-mono block">{order.price}</span>
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5
                                                ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
                                            `}>
                                                <span className={`h-1 w-1 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preferences / Toggles Matrix Linkages */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                            <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase opacity-80 mb-3">System Preferences</h3>

                            <button onClick={() => setActiveModal('address')} className="w-full flex items-center justify-between py-3 hover:bg-slate-50/60 rounded-xl px-2.5 -mx-2.5 transition-all group text-left">
                                <div className="flex gap-3.5 items-start min-w-0">
                                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5 group-hover:text-emerald-600 transition-colors shrink-0" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-semibold text-slate-800 block group-hover:text-slate-900 transition-colors">Shipping Addresses</span>
                                        <span className="text-[11px] text-slate-400 block font-normal leading-normal">Manage destination configurations across regional distribution hubs ({MOCK_ADDRESSES.length} listed).</span>
                                    </div>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                            </button>

                            <button onClick={() => setActiveModal('payment')} className="w-full flex items-center justify-between py-3 hover:bg-slate-50/60 rounded-xl px-2.5 -mx-2.5 transition-all group text-left">
                                <div className="flex gap-3.5 items-start min-w-0">
                                    <CreditCard className="h-4 w-4 text-slate-400 mt-0.5 group-hover:text-emerald-600 transition-colors shrink-0" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-semibold text-slate-800 block group-hover:text-slate-900 transition-colors">Payment Integrations</span>
                                        <span className="text-[11px] text-slate-400 block font-normal leading-normal">Configure primary M-Pesa accounts and automated billing checkout mechanics.</span>
                                    </div>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                            </button>

                            <button onClick={() => setActiveModal('watchlist')} className="w-full flex items-center justify-between py-3 hover:bg-slate-50/60 rounded-xl px-2.5 -mx-2.5 transition-all group text-left">
                                <div className="flex gap-3.5 items-start min-w-0">
                                    <Heart className="h-4 w-4 text-slate-400 mt-0.5 group-hover:text-emerald-600 transition-colors shrink-0" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-semibold text-slate-800 block group-hover:text-slate-900 transition-colors">Automated Price Watchlist</span>
                                        <span className="text-[11px] text-slate-400 block font-normal leading-normal">Review indexed items currently monitored for macro market shifts and automated deals.</span>
                                    </div>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT PANEL: SECURITY & SEED CREDENTIALS */}
                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-slate-400" />
                                <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase opacity-80">Security Layer</h3>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Account Secret Token Key</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 flex items-center justify-between font-mono text-xs transition-colors focus-within:bg-white focus-within:border-slate-300">
                                        <span className={showSecretCode ? "text-slate-800 font-medium tracking-normal" : "text-slate-300 font-black tracking-widest"}>
                                            {showSecretCode ? secretCode : "••••••••••••"}
                                        </span>
                                        <button onClick={() => setShowSecretCode(!showSecretCode)} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded">
                                            {showSecretCode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-normal font-normal">Used to authorize automatic atomic checkout orders when matching search parameters via Soko AI.</p>
                            </div>

                            <hr className="border-slate-100 my-1" />

                            <div className="flex items-center justify-between pt-1">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                                        <KeyRound className="h-3.5 w-3.5 text-slate-400" /> Crypt Password
                                    </span>
                                    <span className="text-[10px] text-slate-400 block font-normal">Updated 30 days ago</span>
                                </div>
                                <button onClick={() => setActiveModal('password')} className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-all shadow-3xs active:scale-[0.98]">
                                    Change
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50/30 text-slate-500 hover:text-rose-600 rounded-xl text-xs font-semibold transition-all shadow-3xs active:scale-[0.99] group"
                        >
                            <LogOut className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-500 transition-colors shrink-0" />
                            <span>Terminate current session</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* DYNAMIC MODAL OVERLAY INJECTIONS */}
            {activeModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 relative animate-scaleUp">

                        {/* Modal Heading Control */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                                {activeModal === 'address' && 'Shipping Destination Registry'}
                                {activeModal === 'payment' && 'M-Pesa Checkout Integrations'}
                                {activeModal === 'watchlist' && 'Live Price Watchlist Metrics'}
                                {activeModal === 'password' && 'Security Crypt Layer Reset'}
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* MODAL VIEW 1: ADDRESS MANAGEMENT */}
                        {activeModal === 'address' && (
                            <div className="space-y-4">
                                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                                    {MOCK_ADDRESSES.map((addr) => (
                                        <div key={addr.id} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-start gap-3 relative group">
                                            <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                            <div className="space-y-0.5 min-w-0">
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 uppercase tracking-wide inline-block mb-1">{addr.tag}</span>
                                                <h5 className="text-xs font-bold text-slate-800 truncate">{addr.location}</h5>
                                                <p className="text-[11px] text-slate-400">{addr.region}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-300 hover:border-emerald-500 hover:text-emerald-600 rounded-xl text-xs font-semibold text-slate-500 transition-colors">
                                    <Plus className="h-3.5 w-3.5" /> Add New Node Destination
                                </button>
                            </div>
                        )}

                        {/* MODAL VIEW 2: PAYMENT METHOD CONFIG */}
                        {activeModal === 'payment' && (
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                                    <Smartphone className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <h5 className="text-xs font-bold text-slate-900">Safaricom M-Pesa Express Gateways</h5>
                                        <p className="text-[11px] text-slate-500 leading-normal">STK Push parameters will trigger prompt confirmations to this wallet during execution cycles.</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Safaricom Mobile Line Number</label>
                                    <input 
                                        type="text" 
                                        value={mpesaNumber}
                                        onChange={(e) => setMpesaNumber(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3 py-2.5 font-mono text-xs focus:outline-none transition-all" 
                                        placeholder="e.g., 0712345678"
                                    />
                                </div>
                                <button type="submit" disabled={isSaving} className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                                    {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save Gateway Configuration'}
                                </button>
                            </form>
                        )}

                        {/* MODAL VIEW 3: AUTOMATED WATCHLIST DEEP DIVE */}
                        {activeModal === 'watchlist' && (
                            <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                                {MOCK_WATCHLIST.map((product) => (
                                    <div key={product.id} className="p-2 border border-slate-100 rounded-xl flex items-center justify-between gap-3 bg-white hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img src={product.image} alt={product.title} className="h-10 w-10 object-cover rounded-lg bg-slate-50 shrink-0 border border-slate-100" />
                                            <div className="min-w-0 space-y-0.5">
                                                <h4 className="text-xs font-bold text-slate-900 truncate">{product.title}</h4>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-mono font-bold text-slate-800">{product.currentPrice}</span>
                                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded px-1 flex items-center gap-0.5">
                                                        <TrendingDown className="h-2.5 w-2.5" /> {product.drop}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0" title="Inspect Listing">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* MODAL VIEW 4: SYSTEM CRYPTRESET */}
                        {activeModal === 'password' && (
                            <form onSubmit={handleFormSubmit} className="space-y-3.5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Key Phase</label>
                                    <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">New Secure Private Crypt</label>
                                    <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors" />
                                </div>
                                <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition mt-2 shadow-sm flex items-center justify-center gap-2">
                                    {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Commit Crypt Layer Update'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}