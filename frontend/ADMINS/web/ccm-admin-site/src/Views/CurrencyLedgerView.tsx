import { useState } from 'react';
import { 
  Coins, 
  Search, 
  Plus, 
  RefreshCw, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Globe, 
} from 'lucide-react';

// Models matching the soko_ai_backend regional valuation layers
interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  exchangeRateToKes: number; // KES serves as system base baseline context
  isBaseCurrency: boolean;
  precisionDigits: number;
  lastUpdatedSource: string;
}

export default function CurrencyLedgerView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);

  const [rates, setRates] = useState<CurrencyRate[]>([
    {
      code: "KES",
      name: "Kenyan Shilling",
      symbol: "KSh",
      exchangeRateToKes: 1.0000,
      isBaseCurrency: true,
      precisionDigits: 0,
      lastUpdatedSource: "System Baseline Node"
    },
    {
      code: "UGX",
      name: "Ugandan Shilling",
      symbol: "USh",
      exchangeRateToKes: 0.0345, // 1 UGX = ~0.0345 KES
      isBaseCurrency: false,
      precisionDigits: 0,
      lastUpdatedSource: "Central Bank of Kenya API"
    },
    {
      code: "TZS",
      name: "Tanzanian Shilling",
      symbol: "TSh",
      exchangeRateToKes: 0.0481, // 1 TZS = ~0.0481 KES
      isBaseCurrency: false,
      precisionDigits: 0,
      lastUpdatedSource: "Central Bank of Kenya API"
    },
    {
      code: "USD",
      name: "United States Dollar",
      symbol: "$",
      exchangeRateToKes: 131.2500, // 1 USD = 131.25 KES baseline tracking proxy
      isBaseCurrency: false,
      precisionDigits: 2,
      lastUpdatedSource: "OpenExchangeRates Live Feed"
    }
  ]);

  const triggerLiveRatesPoll = () => {
    setIsUpdatingRates(true);
    setTimeout(() => {
      setIsUpdatingRates(false);
    }, 1000);
  };

  const filteredRates = rates.filter(rate => 
    rate.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    rate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn p-0.5">
      
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Regional Currency Ledger</h2>
          <p className="text-xs text-slate-400">
            Configure FX multiplier anchors and localization rendering variables to scale affiliate comparison tracking across East Africa.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={triggerLiveRatesPoll}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Poll Financial Exchange Gateways"
          >
            <RefreshCw size={14} className={isUpdatingRates ? 'animate-spin' : ''} />
          </button>
          
          <button
            type="button"
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus size={13} /> Add Currency Node
          </button>
        </div>
      </div>

      {/* QUICK SYSTEM INSIGHT BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">System Pivot Anchor</span>
            <span className="text-sm font-semibold text-slate-800">KES (Kenyan Shilling)</span>
          </div>
          <Globe size={16} className="text-slate-300" />
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Active FX Multipliers</span>
            <span className="text-sm font-semibold text-slate-800">{rates.length} Regional Mappings</span>
          </div>
          <Coins size={16} className="text-slate-300" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Sync Status Layer</span>
            <span className="text-sm font-semibold text-slate-800 flex items-center gap-1 text-emerald-600">
              <CheckCircle2 size={12} /> Live Feeds Stable
            </span>
          </div>
          <TrendingUp size={16} className="text-emerald-500/60" />
        </div>
      </div>

      {/* DATA FILTER CONTROL */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ISO tokens or token identities..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* LEDGER DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">ISO Token</th>
                <th className="py-3 px-4">Token Label Identity</th>
                <th className="py-3 px-4">System Conversion Pivot Rate (1 Units to KES)</th>
                <th className="py-3 px-4">Floating Point Precision Limit</th>
                <th className="py-3 px-4">Upstream Reference Pipeline</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredRates.length > 0 ? (
                filteredRates.map((rate) => (
                  <tr key={rate.code} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Token code */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                        {rate.code}
                      </span>
                    </td>

                    {/* Token identity descriptive */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono text-[11px] w-4 inline-block">{rate.symbol}</span>
                        <span>{rate.name}</span>
                      </div>
                    </td>

                    {/* Multiplier base calculation node */}
                    <td className="py-3.5 px-4 font-mono text-slate-800">
                      {rate.isBaseCurrency ? (
                        <span className="text-slate-400 italic text-[11px]">System Base Model Value (1.0000)</span>
                      ) : (
                        <span>{rate.exchangeRateToKes.toFixed(4)} KES</span>
                      )}
                    </td>

                    {/* Rendering presentation precision parameters */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {rate.precisionDigits} decimal places
                    </td>

                    {/* Origin engine lookup validation source trace */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {rate.lastUpdatedSource}
                    </td>

                    {/* Configuration actions row */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg transition-all cursor-pointer inline-flex items-center"
                        title="Override Conversion Multiplier"
                      >
                        <Edit3 size={12} />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle size={20} className="text-slate-300" />
                      <span>No targeted currency records localized in memory boundaries.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}