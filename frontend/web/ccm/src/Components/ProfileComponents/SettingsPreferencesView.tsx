



import { 
    Settings, 
    Bell, 
    Globe, 
    Shield, 
  
} from 'lucide-react';

export default function SettingsPreferencesView() {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-slate-100 shadow-xs text-slate-800">
            
            {/* --- HEADER BLOCK --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">Settings & Preferences</h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Customize your browsing experience, marketplace update sync frequency, and account security.
                    </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 self-start sm:self-center">
                    <Settings className="h-3.5 w-3.5 text-slate-500 animate-spin-slow" />
                    <span>Account Profile Stable</span>
                </div>
            </div>

            {/* --- SETTINGS GROUPS STACK --- */}
            <div className="space-y-4">
                
                {/* GROUP 1: REGIONAL & MARKETING TARGETS */}
                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white overflow-hidden">
                    <div className="p-4 bg-slate-50/60 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-500" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Regional Adjustments</h3>
                    </div>
                    
                    {/* Preference Row 1 */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-slate-900">Primary Marketplace Target</h4>
                            <p className="text-xs text-slate-400">Filter price matching and deals exclusively around domestic retail channels.</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 transition-all max-w-[160px] cursor-pointer">
                            <option>Kenya (KSh)</option>
                            <option>East Africa (EAC)</option>
                            <option>Global Markets</option>
                        </select>
                    </div>

                    {/* Preference Row 2 */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-slate-900">Price Target Sync Interval</h4>
                            <p className="text-xs text-slate-400">Determine how frequently background streams query linked shops for updates.</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 transition-all max-w-[160px] cursor-pointer">
                            <option>Real-Time (Fast)</option>
                            <option>Every 6 Hours</option>
                            <option>Daily Digest</option>
                        </select>
                    </div>
                </div>

                {/* GROUP 2: NOTIFICATIONS CHANNELS */}
                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white overflow-hidden">
                    <div className="p-4 bg-slate-50/60 flex items-center gap-2">
                        <Bell className="h-4 w-4 text-slate-500" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Communication Channels</h3>
                    </div>

                    {/* Switch Toggle Row 1 */}
                    <div className="p-4 flex items-center justify-between gap-4">
                        <div className="space-y-0.5 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900">M-Pesa Checkout Prompts</h4>
                            <p className="text-xs text-slate-400 truncate sm:whitespace-normal">Trigger instant STK push alerts directly to your device during deals match.</p>
                        </div>
                        {/* Custom Pure CSS Toggle Switch */}
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                        </label>
                    </div>

                    {/* Switch Toggle Row 2 */}
                    <div className="p-4 flex items-center justify-between gap-4">
                        <div className="space-y-0.5 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900">In-App Live Stream Alerts</h4>
                            <p className="text-xs text-slate-400 truncate sm:whitespace-normal">Receive immediate dropdown badges for flash price drops inside this window.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                        </label>
                    </div>
                </div>

                {/* GROUP 3: PRIVACY & SYSTEM ENHANCEMENTS */}
                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white overflow-hidden">
                    <div className="p-4 bg-slate-50/60 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-slate-500" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Privacy & Security</h3>
                    </div>

                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-slate-900">Two-Factor Security Keys</h4>
                            <p className="text-xs text-slate-400">Require automated SMS codes before altering connected wallet settings.</p>
                        </div>
                        <button className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl bg-white shadow-2xs transition-colors self-start sm:self-center">
                            Setup Authentication
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}