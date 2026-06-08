import {  
    TrendingDown, 
    Sliders, 
    Trash2, 
    ArrowDownRight, 
    ShoppingBag,
    CheckCircle2,
    Tag
} from 'lucide-react';

export default function PersonalizedAlertsView() {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-slate-100 shadow-xs text-slate-800">
            
            {/* --- HEADER BLOCK --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">Alerts & Notifications</h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Manage active item watch targets and view your real-time pricing updates.
                    </p>
                </div>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 transition-colors rounded-xl text-xs font-bold text-white self-start sm:self-center shadow-xs">
                    <Sliders className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* --- SPLIT GRID SYSTEM --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT SIDE: ACTIVE PRICE WATCH TARGETS (7 COLS) */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Watch Targets</h3>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">2 Monitored</span>
                    </div>

                    {/* WATCH ITEM 1 */}
                    <div className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 bg-white hover:border-slate-300 transition-all">
                        <div className="flex gap-3 items-start min-w-0">
                            <div className="h-9 w-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                                <TrendingDown className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                                <h4 className="text-sm font-black text-slate-900 truncate">Vitron Smart TV 32"</h4>
                                <p className="text-xs text-slate-500">
                                    Target: <span className="font-bold text-emerald-600">Below KSh 13,000</span> <span className="text-slate-300">•</span> Current: KSh 13,849
                                </p>
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shrink-0">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>

                    {/* WATCH ITEM 2 */}
                    <div className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 bg-white hover:border-slate-300 transition-all">
                        <div className="flex gap-3 items-start min-w-0">
                            <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                                <TrendingDown className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                                <h4 className="text-sm font-black text-slate-900 truncate">Sony Home Theatre System</h4>
                                <p className="text-xs text-slate-500">
                                    Target: <span className="font-bold text-emerald-600">Below KSh 22,500</span> <span className="text-slate-300">•</span> Current: KSh 24,000
                                </p>
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shrink-0">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE: NOTIFICATION STREAM FEED (5 COLS) */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Updates Feed</h3>
                        <span className="h-2 w-2 bg-rose-500 rounded-full animate-pulse" title="Live connection active"></span>
                    </div>

                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                        
                        {/* NOTIFICATION 1: PRICE MATCH DROPPED CRITICAL */}
                        <div className="border border-emerald-100 rounded-2xl p-4 bg-emerald-50/20 space-y-3 relative overflow-hidden">
                            <div className="flex gap-3 items-start">
                                <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <ArrowDownRight className="h-4 w-4" />
                                </div>
                                <div className="space-y-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                                            Price Match
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">12m ago</span>
                                    </div>
                                    <h4 className="text-xs font-black text-slate-900 leading-snug">
                                        Wireless Headphones dropped to KSh 3,250!
                                    </h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Your target criteria of KSh 3,300 was hit on linked retail channels.
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end pt-1">
                                <button className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1 transition-colors">
                                    <ShoppingBag className="h-3 w-3" />
                                    <span>Grab Deal</span>
                                </button>
                            </div>
                        </div>

                        {/* NOTIFICATION 2: ORDER STATUS FULFILLED UPDATE */}
                        <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                            <div className="flex gap-3 items-start">
                                <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                </div>
                                <div className="space-y-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-bold text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                                            Order Status
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">2h ago</span>
                                    </div>
                                    <h4 className="text-xs font-black text-slate-900 leading-snug">
                                        Order #SOKO-4110 Dispatched
                                    </h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Your package containing Wireless Headphones Pack has been securely processed and picked up by courier.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* NOTIFICATION 3: SYSTEM FLAGGED COUPON */}
                        <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                            <div className="flex gap-3 items-start">
                                <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                                    <Tag className="h-4 w-4" />
                                </div>
                                <div className="space-y-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                                            Promo Alert
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">Yesterday</span>
                                    </div>
                                    <h4 className="text-xs font-black text-slate-900 leading-snug">
                                        Flash Discount found on Tech Categories
                                    </h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        An extra 5% voucher code is active for local smart appliances inside your watched category clusters.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}