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
  X,
  Database
} from 'lucide-react';
import { useCurrencyLedger } from '../Providers.tsx/CurrencyLedgerContext';
import type {CurrencyRate } from '../Providers.tsx/CurrencyLedgerContext';

export default function CurrencyLedgerView() {
  const { 
    rates, 
    isLoading, 
    error, 
    triggerLiveRatesPoll, 
    addCurrencyNode, 
    updateCurrencyMultiplier 
  } = useCurrencyLedger();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  
  // Local active target editing element references
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('');
  const [overrideRateValue, setOverrideRateValue] = useState('');

  // Form initialization structures
  const [newNode, setNewNode] = useState({
    code: '',
    name: '',
    symbol: '',
    exchangeRateToKes: '',
    precisionDigits: '2'
  });

  const handleCreateNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CurrencyRate = {
      code: newNode.code.toUpperCase().trim(),
      name: newNode.name.trim(),
      symbol: newNode.symbol.trim() || '$',
      exchangeRateToKes: Number(newNode.exchangeRateToKes) || 1.0,
      isBaseCurrency: false,
      precisionDigits: Number(newNode.precisionDigits) || 2,
      lastUpdatedSource: "System Local Allocation Setup"
    };

    addCurrencyNode(payload);
    setIsDrawerOpen(false);
    setNewNode({ code: '', name: '', symbol: '', exchangeRateToKes: '', precisionDigits: '2' });
  };

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCurrencyCode && overrideRateValue) {
      updateCurrencyMultiplier(selectedCurrencyCode, Number(overrideRateValue));
      setIsOverrideModalOpen(false);
      setSelectedCurrencyCode('');
      setOverrideRateValue('');
    }
  };

  const openOverrideModal = (rate: CurrencyRate) => {
    setSelectedCurrencyCode(rate.code);
    setOverrideRateValue(rate.exchangeRateToKes.toString());
    setIsOverrideModalOpen(true);
  };

  const filteredRates = rates.filter(rate => 
    rate.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    rate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn p-0.5 relative">
      
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
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50"
            title="Poll Financial Exchange Gateways"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-3.5 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus size={14} /> Add Currency Node
          </button>
        </div>
      </div>

      {/* ERROR FEEDBACK STATE */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-center gap-2 font-medium">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* QUICK SYSTEM INSIGHT BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">System Pivot Anchor</span>
            <span className="text-sm font-bold text-slate-800">KES (Kenyan Shilling)</span>
          </div>
          <Globe size={16} className="text-slate-300" />
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Active FX Multipliers</span>
            <span className="text-sm font-bold text-slate-800">{rates.length} Mapped Regions</span>
          </div>
          <Coins size={16} className="text-slate-300" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Sync Status Layer</span>
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1 text-emerald-600">
              <CheckCircle2 size={12} /> {isLoading ? 'Syncing...' : 'Live Feeds Stable'}
            </span>
          </div>
          <TrendingUp size={16} className={isLoading ? 'text-blue-500 animate-pulse' : 'text-emerald-500/60'} />
        </div>
      </div>

      {/* DATA FILTER CONTROL */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ISO tokens or token identities..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* LEDGER DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
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
                  <tr key={rate.code} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* Token code */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 font-semibold">
                        {rate.code}
                      </span>
                    </td>

                    {/* Token identity descriptive */}
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono text-[11px] w-4 inline-block">{rate.symbol}</span>
                        <span>{rate.name}</span>
                      </div>
                    </td>

                    {/* Multiplier base calculation node */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {rate.isBaseCurrency ? (
                        <span className="text-slate-400 italic font-medium text-[11px]">System Base Model Value (1.0000)</span>
                      ) : (
                        <span>{rate.exchangeRateToKes.toFixed(4)} KES</span>
                      )}
                    </td>

                    {/* Rendering presentation precision parameters */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {rate.precisionDigits} decimal places
                    </td>

                    {/* Origin engine lookup validation source trace */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-medium">
                      {rate.lastUpdatedSource}
                    </td>

                    {/* Configuration actions row */}
                    <td className="py-3.5 px-4 text-right">
                      {!rate.isBaseCurrency && (
                        <button
                          type="button"
                          onClick={() => openOverrideModal(rate)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all cursor-pointer inline-flex items-center"
                          title="Override Conversion Multiplier"
                        >
                          <Edit3 size={12} />
                        </button>
                      )}
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

      {/* COMPOSITION ADD NODE SLIDE OVER PANEL DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-end animate-fadeIn" onClick={() => setIsDrawerOpen(false)}>
          <div 
            className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900">
                  <Database size={16} className="text-blue-600" />
                  <h3 className="text-sm font-semibold">Provision Currency Node</h3>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateNodeSubmit} className="space-y-4 text-xs font-medium text-slate-700">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-500">ISO Token Code</label>
                    <input type="text" required placeholder="e.g., EUR" maxLength={3} value={newNode.code} onChange={e => setNewNode({...newNode, code: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500">Symbol</label>
                    <input type="text" required placeholder="e.g., €" value={newNode.symbol} onChange={e => setNewNode({...newNode, symbol: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Token Label Description</label>
                  <input type="text" required placeholder="e.g., Euro Zone" value={newNode.name} onChange={e => setNewNode({...newNode, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">System Exchange Rate Baseline (1 Unit to KES)</label>
                  <input type="number" step="0.0001" required placeholder="e.g., 142.12" value={newNode.exchangeRateToKes} onChange={e => setNewNode({...newNode, exchangeRateToKes: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono" />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Decimal Render Precision Length</label>
                  <select value={newNode.precisionDigits} onChange={e => setNewNode({...newNode, precisionDigits: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer">
                    <option value="0">0 places (e.g. UGX/TZS)</option>
                    <option value="2">2 places (e.g. USD/EUR)</option>
                    <option value="4">4 places (High Precision Forex)</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="w-1/2 p-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer">Cancel</button>
                  <button type="submit" className="w-1/2 p-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-xs cursor-pointer">Commit Node</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* OVERRIDE CONVERSION MULTIPLIER MODAL FRAME */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setIsOverrideModalOpen(false)}>
          <div 
            className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-xs font-bold text-slate-900">Manual FX Anchor Override: {selectedCurrencyCode}</h4>
              <button onClick={() => setIsOverrideModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleOverrideSubmit} className="space-y-3 text-xs font-medium text-slate-700">
              <div className="space-y-1">
                <label className="text-slate-500">Forced Multiplier Conversion Value (to KES)</label>
                <input 
                  type="number" 
                  step="0.0001" 
                  required 
                  value={overrideRateValue} 
                  onChange={e => setOverrideRateValue(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 font-bold focus:bg-white" 
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button type="button" onClick={() => setIsOverrideModalOpen(false)} className="w-1/2 p-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="w-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer">Apply Baseline</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}