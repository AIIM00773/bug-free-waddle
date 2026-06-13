import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Plus, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Sliders, 
  ToggleLeft, 
  ToggleRight,
  X,
  Radio,
  Trash2
} from 'lucide-react';
import { useMarketplaces } from '../Providers.tsx/MarketplacesContex';
import type { Marketplace } from '../Providers.tsx/MarketplacesContex';
export default function MarketplaceProfilesView() {
  const {
    filteredMarkets,
    isLoading,
    error,
    searchByTitle,
    addNew,
    removeMarket,
    editMarket,
    refreshMarkets
  } = useMarketplaces();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form Initial Payload Architecture State
  const [formMarket, setFormMarket] = useState<Marketplace>({
    title: '',
    sku: '',
    base_url: '',
    base_search_url: '',
    categoised_search_url: '',
    region_boundary: 'Kenya',
    currency: 'KES',
    index_output: '',
    is_active: true,
    is_suspended: false,
    is_running: false,
    logo_url: null
  });

  // Track search changes and bridge dynamically into upstream filter engine
  useEffect(() => {
    searchByTitle(searchQuery);
  }, [searchQuery]);

  const handleToggleActive = async (market: Marketplace) => {
    await editMarket({
      ...market,
      is_active: !market.is_active,
      // If manually deactivated, also ensure it isn't flag-cached as executing
      is_running: !market.is_active ? false : market.is_running
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMarket.title || !formMarket.sku) return;

    await addNew({
      ...formMarket,
      categoised_search_url: formMarket.base_url // Set matching base mirror string
    });

    // Reset layout fields
    setFormMarket({
      title: '',
      sku: '',
      base_url: '',
      base_search_url: '',
      categoised_search_url: '',
      region_boundary: 'Kenya',
      currency: 'KES',
      index_output: '',
      is_active: true,
      is_suspended: false,
      is_running: false,
      logo_url: null
    });
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-0.5 relative">
      
      {/* HEADER CONTROLS VIEW */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Marketplace Profiles</h2>
          <p className="text-xs text-slate-400">
            Configure regional cluster domains, parsing limits, and structure parameters for core ingestion microservices.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refreshMarkets()}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
            title="Poll Engine State Records"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-3.5 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Plus size={14} /> New Profile Schema
          </button>
        </div>
      </div>

      {/* SEARCH SYSTEM SUBROUTINES FILTER */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter marketplace nodes or schema matrices..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-xs font-medium text-rose-700">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* PROFILES GRID MATRIX GRAPH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMarkets.length > 0 ? (
          filteredMarkets.map((market) => (
            <div 
              key={market.sku}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all duration-150"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
                    <Globe size={15} className="text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900 truncate">{market.title}</h3>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-tight">{market.sku}</p>
                  </div>
                </div>

                {/* Microservice Operational Telemetry Status Flag Check */}
                <div>
                  {market.is_suspended ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                      <AlertCircle size={10} /> Suspended
                    </span>
                  ) : market.is_running ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md animate-pulse">
                      <Radio size={10} className="text-emerald-500" /> Ingestion Active
                    </span>
                  ) : market.is_active ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      <CheckCircle size={10} /> Operational Idle
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      <Sliders size={10} /> Disabled Node
                    </span>
                  )}
                </div>
              </div>

              {/* Data Telemetry Frame Cluster */}
              <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 bg-slate-50/40 rounded-lg px-2 text-xs font-medium">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">Boundary</span>
                  <span className="text-slate-700 truncate block">{market.region_boundary}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">Currency</span>
                  <span className="text-slate-700 block">{market.currency}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">Target Domain</span>
                  <a href={market.base_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block max-w-full">
                    Link Source
                  </a>
                </div>
              </div>

              {/* Dynamic Serialization Footprint Engine Track */}
              <div className="flex items-center justify-between text-[11px] font-medium pt-0.5">
                <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[65%]">
                  <Layers size={12} className="text-slate-300 shrink-0" />
                  <span className="truncate font-mono text-slate-400 text-[10px]" title={market.index_output}>
                    {market.index_output || "No explicit parser configured"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(market)}
                    disabled={market.is_suspended}
                    className={`p-1 rounded-md transition-colors inline-flex items-center ${
                      market.is_suspended ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer text-slate-400 hover:text-slate-700'
                    }`}
                    title={market.is_active ? "Deactivate target index pipeline" : "Activate target index pipeline"}
                  >
                    {market.is_active ? <ToggleRight size={20} className="text-blue-600" /> : <ToggleLeft size={20} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeMarket(market.sku)}
                    className="p-1.5 border border-slate-100 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-lg shadow-2xs transition-colors cursor-pointer inline-flex items-center"
                    title="Purge Profile Matrix"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 font-medium flex flex-col items-center justify-center gap-2 shadow-2xs">
            <AlertCircle size={20} className="text-slate-300" />
            <span>No matching marketplace boundaries verified in local cache cluster.</span>
          </div>
        )}
      </div>

      {/* DRAWER FORM SECTION MATRIX PANEL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-end animate-fadeIn" onClick={() => setIsDrawerOpen(false)}>
          <div 
            className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900">
                  <Globe size={16} className="text-blue-600" />
                  <h3 className="text-sm font-semibold">Provision Target Scraper Node</h3>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium text-slate-700">
                <div className="space-y-1">
                  <label className="block text-slate-500">Marketplace Identity Title</label>
                  <input
                    type="text" required
                    value={formMarket.title}
                    onChange={(e) => setFormMarket({...formMarket, title: e.target.value})}
                    placeholder="e.g., Jumia Tanzania"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-500">System SKU Index Code</label>
                    <input
                      type="text" required
                      value={formMarket.sku}
                      onChange={(e) => setFormMarket({...formMarket, sku: e.target.value})}
                      placeholder="MKT-JM-TZ"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-500">Geographic Boundary</label>
                    <input
                      type="text" required
                      value={formMarket.region_boundary}
                      onChange={(e) => setFormMarket({...formMarket, region_boundary: e.target.value})}
                      placeholder="Tanzania"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500">Target Base Domain URL Route</label>
                  <input
                    type="url" required
                    value={formMarket.base_url}
                    onChange={(e) => setFormMarket({...formMarket, base_url: e.target.value})}
                    placeholder="https://www.jumia.co.tz"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500">Query Parsing API / Base Search URL Path</label>
                  <input
                    type="url" required
                    value={formMarket.base_search_url}
                    onChange={(e) => setFormMarket({...formMarket, base_search_url: e.target.value})}
                    placeholder="https://www.jumia.co.tz/catalog/?q="
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-500">Base Trading Currency</label>
                    <input
                      type="text" required
                      value={formMarket.currency}
                      onChange={(e) => setFormMarket({...formMarket, currency: e.target.value})}
                      placeholder="TZS"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-500">Django Execution Pipeline Slug</label>
                    <input
                      type="text" required
                      value={formMarket.index_output}
                      onChange={(e) => setFormMarket({...formMarket, index_output: e.target.value})}
                      placeholder="soko_ai_backend.pipelines.JumiaTzPipeline"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="activeCheck"
                      checked={formMarket.is_active}
                      onChange={(e) => setFormMarket({...formMarket, is_active: e.target.checked})}
                      className="h-4 w-4 accent-slate-950 rounded-sm cursor-pointer"
                    />
                    <label htmlFor="activeCheck" className="text-slate-600 select-none cursor-pointer">
                      Initialize Operational
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-1/2 text-center p-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 text-center p-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Commit Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}