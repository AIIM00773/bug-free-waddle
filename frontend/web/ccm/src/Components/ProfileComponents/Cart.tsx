import { 
    Trash2, 
    Plus, 
    Minus, 
    ArrowRight, 
    ExternalLink, 
    Layers 
} from 'lucide-react';

export default function ShoppingCartView() {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-slate-100 shadow-xs text-slate-800">
            
            {/* --- HEADER BLOCK --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">My Shopping Cart</h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Review staged items across aggregate platforms prior to processing your checkout order.
                    </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-lg text-xs font-bold text-slate-500 self-start sm:self-center">
                    <Layers className="h-3.5 w-3.5 text-slate-400" />
                    <span>2 Aggregate Nodes Active</span>
                </div>
            </div>

            {/* --- MAIN INTERFACE GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* COLUMN 1 & 2: STAGED ITEM CARDS */}
                <div className="lg:col-span-2 space-y-4">
                    
                    {/* HARDCODED ITEM 1: JUMIA PRODUCT */}
                    <div className="group relative bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 transition-all hover:border-slate-300 hover:shadow-xs">
                        {/* Static Thumbnail */}
                        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                            <img 
                                src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=150&auto=format&fit=crop&q=60" 
                                alt="Smart TV Preview" 
                                className="h-full w-full object-cover transition-transform group-hover:scale-103" 
                            />
                        </div>

                        {/* Specifications Metadata Box */}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div className="space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 pr-4">
                                        Vitron HTC3268 32-Inch Smart Android TV - Black
                                    </h3>
                                    <button className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Dynamic Platform Tag Trace */}
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border bg-orange-50 text-orange-600 border-orange-100">
                                        Jumia
                                    </span>
                                    <a href="#" className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
                                        <span>Source Link</span>
                                        <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                </div>
                            </div>

                            {/* Footer: Pricing and Hardcoded Volume Steppers */}
                            <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-slate-50">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xs sm:text-sm font-black text-slate-900">KSh 13,499</span>
                                    <span className="text-[11px] text-slate-400 line-through">KSh 18,500</span>
                                </div>

                                {/* Hardcoded Numeric Stepper Frame */}
                                <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-lg p-0.5">
                                    <button className="p-1 text-slate-400 hover:bg-white hover:text-slate-900 rounded-md transition-colors" disabled>
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="w-7 font-mono text-xs font-bold text-center text-slate-800">1</span>
                                    <button className="p-1 text-slate-500 hover:bg-white hover:text-slate-900 rounded-md transition-colors">
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HARDCODED ITEM 2: KILIMALL PRODUCT */}
                    <div className="group relative bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 transition-all hover:border-slate-300 hover:shadow-xs">
                        {/* Static Thumbnail */}
                        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                            <img 
                                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60" 
                                alt="Headphones Preview" 
                                className="h-full w-full object-cover transition-transform group-hover:scale-103" 
                            />
                        </div>

                        {/* Specifications Metadata Box */}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div className="space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 pr-4">
                                        Generic Wireless Bluetooth Extra Bass Headphones
                                    </h3>
                                    <button className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Dynamic Platform Tag Trace */}
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border bg-blue-50 text-blue-600 border-blue-100">
                                        Kilimall
                                    </span>
                                    <a href="#" className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
                                        <span>Source Link</span>
                                        <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                </div>
                            </div>

                            {/* Footer: Pricing and Hardcoded Volume Steppers */}
                            <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-slate-50">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xs sm:text-sm font-black text-slate-900">KSh 1,850</span>
                                </div>

                                {/* Hardcoded Numeric Stepper Frame */}
                                <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-lg p-0.5">
                                    <button className="p-1 text-slate-500 hover:bg-white hover:text-slate-900 rounded-md transition-colors">
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="w-7 font-mono text-xs font-bold text-center text-slate-800">2</span>
                                    <button className="p-1 text-slate-500 hover:bg-white hover:text-slate-900 rounded-md transition-colors">
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* COLUMN 3: SUMMARY ANALYSIS BREAKDOWN (SIDEBAR BOX) */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 lg:sticky lg:top-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Verification Matrix</h3>
                    
                    <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Staged Volume</span>
                            <span className="font-mono text-slate-900">3 items</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Aggregate Subtotal</span>
                            <span className="font-mono text-slate-900">KSh 17,199</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Estimated Delivery Matrix</span>
                            <span className="font-mono text-slate-900">KSh 350</span>
                        </div>
                        
                        <div className="h-px bg-slate-200 my-2"></div>
                        
                        <div className="flex justify-between text-sm font-black">
                            <span className="text-slate-900">Target Total Vector</span>
                            <span className="text-slate-950 font-mono">KSh 17,549</span>
                        </div>
                    </div>

                    {/* Submission Action Trigger */}
                    <button className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl py-3 px-4 text-xs font-bold shadow-sm transition-all cursor-pointer">
                        <span>Proceed to Automated Routing</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                        Cross-platform checkout pipelines automatically route requests securely using integration parameters.
                    </p>
                </div>

            </div>
        </div>
    );
}