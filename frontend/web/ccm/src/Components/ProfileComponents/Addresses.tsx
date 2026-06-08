


import { 
    MapPin, 
    Plus, 
    Home, 
    Briefcase, 
    Trash2, 
    CheckCircle2 
} from 'lucide-react';

export default function ShippingAddressesView() {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-slate-100 shadow-xs text-slate-800">
            
            {/* --- HEADER BLOCK --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">Delivery Addresses</h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Manage your primary delivery locations, doorstep details, and regional pickup preferences.
                    </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 self-start sm:self-center">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    <span>Kenya Delivery Active</span>
                </div>
            </div>

            {/* --- ADDRESSES CARDS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* ADDRESS 1: PRIMARY RESIDENCE */}
                <div className="border-2 border-slate-900 rounded-2xl p-5 bg-white relative flex flex-col justify-between h-48 shadow-2xs">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 uppercase tracking-wider">
                                <Home className="h-3.5 w-3.5 text-slate-700" />
                                <span>Home (Primary)</span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/40">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                Selected
                            </span>
                        </div>
                        
                        {/* Realistic domestic breakdown over technical "vectors" */}
                        <div className="space-y-0.5 pt-2">
                            <p className="text-sm font-black text-slate-900">Greenwood Apartments, Block B</p>
                            <p className="text-xs text-slate-600 font-medium">Suite 4, Kilimanjaro Avenue</p>
                            <p className="text-xs text-slate-500">Kilimani, Nairobi</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span className="text-[11px] text-slate-400 font-medium">Doorstep Delivery</span>
                        <button className="text-slate-400 hover:text-rose-600 font-bold transition-colors">
                            Edit
                        </button>
                    </div>
                </div>

                {/* ADDRESS 2: WORK PLACE */}
                <div className="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col justify-between h-48 hover:border-slate-300 transition-all">
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                            <span>Office</span>
                        </div>
                        
                        <div className="space-y-0.5 pt-2">
                            <p className="text-sm font-black text-slate-900">The Delta Corner, Tower A</p>
                            <p className="text-xs text-slate-600 font-medium">Floor 4, Waiyaki Way</p>
                            <p className="text-xs text-slate-500">Westlands, Nairobi</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span className="text-[11px] text-slate-400 font-medium">Office Hours Reception</span>
                        <div className="flex items-center gap-3">
                            <button className="text-slate-500 hover:text-slate-900 font-bold transition-colors">
                                Edit
                            </button>
                            <button className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors" title="Delete Address">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ADDRESS 3: ADD NEW INTERACTION TRIGGER */}
                <button className="border border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-5 bg-slate-50/40 hover:bg-slate-50 flex flex-col items-center justify-center gap-2 text-center h-48 transition-all group">
                    <div className="h-9 w-9 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform">
                        <Plus className="h-4 w-4 text-slate-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Add New Address</span>
                    <p className="text-[11px] text-slate-400 max-w-[180px]">
                        Register a new location or custom package collection hub.
                    </p>
                </button>

            </div>
        </div>
    );
}