


import { 
    CreditCard, 
    Plus, 
    ShieldCheck, 
    Trash2, 
} from 'lucide-react';

export default function PaymentMethodsView() {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-slate-100 shadow-xs text-slate-800">
            
            {/* --- HEADER BLOCK --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">Payment Methods & Wallet</h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Manage your preferred checkout channels, linked mobile money accounts, and secure card transactions.
                    </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-lg text-xs font-bold text-emerald-700 self-start sm:self-center">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Bank-Grade Security</span>
                </div>
            </div>

            {/* --- PAYMENT METHODS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* METHOD 1: M-PESA PREMIUM INTEGRATION CARD */}
                <div className="border-2 border-emerald-500/30 rounded-2xl p-5 bg-emerald-50/10 relative overflow-hidden flex flex-col justify-between h-44 shadow-2xs">
                    {/* Background branding accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8 pointer-events-none"></div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            {/* Replaced 'API Integration' feel with clean local branding identity */}
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm tracking-tight">
                                    M
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">M-Pesa Express</h3>
                                    <p className="text-[11px] text-slate-400 font-medium">Default Checkout Mode</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200/40">
                                Linked
                            </span>
                        </div>
                        
                        <p className="text-sm font-mono text-slate-800 tracking-wide pt-2">
                            079* *** 254
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span className="text-slate-400 font-medium">Instant STK Push Active</span>
                        <button className="text-slate-400 hover:text-rose-600 font-bold transition-colors">
                            Disconnect
                        </button>
                    </div>
                </div>

                {/* METHOD 2: DEBIT/CREDIT CARD HOLDER */}
                <div className="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col justify-between h-44 hover:border-slate-300 transition-all">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Visa Card</h3>
                                    <p className="text-[11px] text-slate-400 font-medium">Personal Debit</p>
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-sm font-mono text-slate-800 tracking-wide pt-2">
                            •••• •••• •••• 4892
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span className="text-slate-400 font-medium">Expires 11/28</span>
                        <button className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors" title="Remove Card">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* METHOD 3: ADD NEW INTERACTION TRIGGER */}
                <button className="border border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-5 bg-slate-50/40 hover:bg-slate-50 flex flex-col items-center justify-center gap-2 text-center h-44 transition-all group">
                    <div className="h-9 w-9 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform">
                        <Plus className="h-4 w-4 text-slate-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Add Payment Method</span>
                    <p className="text-[11px] text-slate-400 max-w-[180px]">
                        Link another secure payment profile for instant store routing.
                    </p>
                </button>

            </div>
        </div>
    );
}