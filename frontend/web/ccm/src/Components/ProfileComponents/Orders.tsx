import { 
    RefreshCw, 
    CheckCircle2, 
    Clock, 
    Truck, 
    Box 
} from 'lucide-react';

export default function OrderPipelinesView() {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-slate-100 shadow-xs text-slate-800">
            
            {/* --- HEADER BLOCK --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">Active Orders</h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Real-time tracking for items routed and secured from your linked shops.
                    </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-lg text-xs font-bold text-emerald-600 self-start sm:self-center">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>2 Orders Processing</span>
                </div>
            </div>

            {/* --- ORDERS TRACKING LIST --- */}
            <div className="space-y-6">
                
                {/* RECORD 1: IN TRANSIT / ROUTING */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-xs transition-all">
                    {/* Top Meta Header Bar */}
                    <div className="bg-slate-50/70 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold text-slate-600">
                            <div>
                                <span className="text-slate-400 font-normal">Order Ref:</span>{' '}
                                <span className="font-mono text-slate-900">SOKO-9082-NBO</span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-normal">Placed:</span>{' '}
                                <span className="text-slate-900">Today, 02:14 PM</span>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                            <RefreshCw className="h-3 w-3 animate-spin text-amber-500" />
                            <span>Processing Payment</span>
                        </div>
                    </div>

                    {/* Content Section Split */}
                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        {/* Target Package Specs */}
                        <div className="md:col-span-1 flex gap-3 items-start">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 shrink-0">
                                <Box className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items Summary</h4>
                                <p className="text-sm font-black text-slate-900 truncate">Vitron Smart TV & Accessories</p>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <span>1 Item</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="font-bold text-slate-700">KSh 13,849</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Checkout Milestone Train */}
                        <div className="md:col-span-2 grid grid-cols-3 w-full relative z-0">
                            {/* Connector Line Track */}
                            <div className="absolute top-3.5 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10">
                                <div className="h-full w-1/2 bg-slate-900 transition-all"></div>
                            </div>

                            {/* Node 1: Settled */}
                            <div className="flex flex-col items-center text-center space-y-1.5">
                                <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs shadow-xs">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-900">Order Placed</span>
                            </div>

                            {/* Node 2: Current Active Step */}
                            <div className="flex flex-col items-center text-center space-y-1.5">
                                <div className="h-7 w-7 rounded-full bg-white border-2 border-slate-900 text-slate-900 flex items-center justify-center text-xs font-bold shadow-2xs">
                                    <Clock className="h-3.5 w-3.5 animate-pulse text-amber-500" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-900">Processing </span>
                            </div>

                            {/* Node 3: Unreached */}
                            <div className="flex flex-col items-center text-center space-y-1.5">
                                <div className="h-7 w-7 rounded-full bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center text-xs">
                                    <Truck className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-400">Order Dispatched</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECORD 2: DELIVERED / SETTLED */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-xs transition-all">
                    {/* Top Meta Header Bar */}
                    <div className="bg-slate-50/70 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold text-slate-600">
                            <div>
                                <span className="text-slate-400 font-normal">Order Ref:</span>{' '}
                                <span className="font-mono text-slate-900">SOKO-4110-MSA</span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-normal">Completed:</span>{' '}
                                <span className="text-slate-900">Yesterday, 11:40 AM</span>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span>Delivered</span>
                        </div>
                    </div>

                    {/* Content Section Split */}
                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        {/* Target Package Specs */}
                        <div className="md:col-span-1 flex gap-3 items-start">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 shrink-0">
                                <Box className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items Summary</h4>
                                <p className="text-sm font-black text-slate-900 truncate">Wireless Headphones Mesh Pack</p>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <span>2 Items</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="font-bold text-slate-700">KSh 3,700</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Checkout Milestone Train */}
                        <div className="md:col-span-2 grid grid-cols-3 w-full relative z-0">
                            {/* Connector Line Track */}
                            <div className="absolute top-3.5 left-[16%] right-[16%] h-0.5 bg-slate-900 -z-10"></div>

                            {/* Node 1: Settled */}
                            <div className="flex flex-col items-center text-center space-y-1.5">
                                <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs shadow-xs">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-900">Order Placed</span>
                            </div>

                            {/* Node 2: Settled */}
                            <div className="flex flex-col items-center text-center space-y-1.5">
                                <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs shadow-xs">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-900">Processed </span>
                            </div>

                            {/* Node 3: Settled */}
                            <div className="flex flex-col items-center text-center space-y-1.5">
                                <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs shadow-xs">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-900">Order Dispatched</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}