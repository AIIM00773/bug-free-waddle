import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  Layers,

  ToggleLeft,
  ToggleRight,
  X,
  Trash2,
  Store
} from 'lucide-react';
import { useMarketplaces } from '../Providers.tsx/MarketplaceProfilesContex';
import type { Marketplace } from '../Providers.tsx/MarketplaceProfilesContex';
import { useTaxonomyMatrices } from '../Providers.tsx/TaxonomyMatricesContext';
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
    unique_id: null,
    title: '',
    sku: '',
    base_url: '',
    base_search_url: '',
    categorised_search_url: '',
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
  }, [searchQuery, searchByTitle]);

  const handleToggleActive = async (market: Marketplace) => {
    await editMarket({
      ...market,
      is_active: !market.is_active,
      // If manually deactivated, ensure it isn't flag-cached as executing
      is_running: !market.is_active ? false : market.is_running
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMarket.title || !formMarket.sku) return;

    await addNew({
      ...formMarket,
      categorised_search_url: formMarket.base_url // Set matching base mirror string
    });

    // Reset layout fields
    setFormMarket({
      unique_id: null,
      title: '',
      sku: '',
      base_url: '',
      base_search_url: '',
      categorised_search_url: '',
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

  const { countries, currencies } = useTaxonomyMatrices();

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">

      {/* HEADER CONTROLS VIEW */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">MArketplace  Profiles</h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            Configure regional partner marketplace  domains, API boundaries, and structure parameters for direct catalog synchronization.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refreshMarkets()}
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-50"
            title="Poll Engine State Records"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Marketplace
          </button>
        </div>
      </div>

      {/* SEARCH SYSTEM SUBROUTINES FILTER */}
      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search merchant networks or schema matrices..."
          className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50/50 border border-red-100 rounded-lg flex items-center gap-3 text-sm text-red-800">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* PROFILES GRID MATRIX GRAPH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMarkets.length > 0 ? (
          filteredMarkets.map((market) => (
            <div
              key={market.sku}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                    <Store size={18} className="text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{market.title}</h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5 uppercase tracking-wider">{market.sku}</p>
                  </div>
                </div>

                {/* Microservice Operational Telemetry Status Flag Check */}
                <div>
                  {market.is_suspended ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Suspended
                    </span>
                  ) : market.is_running ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>Active and  Syncing
                    </span>
                  ) : market.is_active ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Active & Ready 
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Disabled
                    </span>
                  )}
                </div>
              </div>

              {/* Data Telemetry Frame Cluster */}
              <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4 text-sm">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Boundary</span>
                  <span className="text-slate-800 font-medium truncate block"> {countries.filter((c)=> c.unique_id === market.region_boundary)[0]?.name || "---"} </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Target Domain</span>
                  <a href={market.base_url} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 hover:underline truncate block max-w-full transition-colors">
                    View Storefront ↗
                  </a>
                </div>
              </div>

              {/* Dynamic Serialization Footprint Engine Track */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-slate-500 truncate max-w-[65%]">
                  <Layers size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate font-mono text-slate-500 text-[11px]" title={market.index_output}>
                    {market.index_output || "No adapter configured"}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(market)}
                    disabled={market.is_suspended}
                    className={`p-1.5 rounded-md transition-colors inline-flex items-center ${market.is_suspended ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    title={market.is_active ? "Deactivate integration pipeline" : "Activate integration pipeline"}
                  >
                    {market.is_active ? <ToggleRight size={22} className="text-slate-900" /> : <ToggleLeft size={22} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeMarket(market.sku)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer inline-flex items-center"
                    title="Delete Integration Matrix"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-slate-50/50 border border-dashed border-slate-300 rounded-xl p-16 text-center flex flex-col items-center justify-center gap-3">
            <Globe size={28} className="text-slate-300" />
            <h3 className="text-sm font-medium text-slate-900">No Integrations Found</h3>
            <p className="text-sm text-slate-500">No matching merchant boundaries verified in the local cluster.</p>
          </div>
        )}
      </div>



      {/* DRAWER FORM SECTION MATRIX PANEL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex justify-end animate-fadeIn" onClick={() => setIsDrawerOpen(false)}>
          <div
            className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Store size={18} className="text-slate-900" />
                <h3 className="text-base font-semibold">New Merchant Integration</h3>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                <X size={18} />
              </button>
            </div>


            {error && (
              <div className="p-4 bg-red-50/50 border border-red-100 rounded-lg flex items-center gap-3 text-sm text-red-800">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}



            <div className="p-6 overflow-y-auto flex-1">
              <form id="merchant-form" onSubmit={handleFormSubmit} className="space-y-5 text-sm font-medium text-slate-700">

                <div className="space-y-1.5">
                  <label className="block text-slate-600">Merchant Identity Title</label>
                  <input
                    type="text" required
                    value={formMarket.title}
                    onChange={(e) => setFormMarket({ ...formMarket, title: e.target.value })}
                    placeholder="e.g., Jumia Tanzania"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-slate-600">System SKU Prefix</label>
                    <input
                      type="text" required
                      value={formMarket.sku}
                      onChange={(e) => setFormMarket({ ...formMarket, sku: e.target.value })}
                      placeholder="MKT-JM-TZ"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-600">Geographic Boundary</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm"
                      value={formMarket.region_boundary} onChange={(e) => setFormMarket({ ...formMarket, region_boundary: e.target.value })}>
                      <option key="" value="">Select the marketplace </option>

                      {countries.filter((c) => c.is_setup_for_operation).map((c) => (
                        <option key={c.unique_id} value={c.unique_id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-600">Merchant Base URL</label>
                  <input type="url" required value={formMarket.base_url} onChange={(e) => setFormMarket({ ...formMarket, base_url: e.target.value })} placeholder="https://www.jumia.co.tz"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-600">Catalog API / Search Path</label>
                  <input type="url" required value={formMarket.base_search_url} onChange={(e) => setFormMarket({ ...formMarket, base_search_url: e.target.value })} placeholder="https://www.jumia.co.tz/catalog/?q="
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-1.5">
                    <label className="block text-slate-600">Trading Currency </label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm"
                      value={formMarket.region_boundary} onChange={(e) => setFormMarket({ ...formMarket, region_boundary: e.target.value })}>

                      <option key={null} value={""}> {"The default is the  reginal currency "}</option>
                      {currencies.filter((c) => c.is_allowed).map((c) => (
                        <option key={c.unique_id} value={c.unique_id}>{c.name}</option>
                      ))}
                    </select>
                  </div>



                  <div className="space-y-1.5">
                    <label className="block text-slate-600">Sync Adapter Slug</label>
                    <input type="text" required value={formMarket.index_output} onChange={(e) => setFormMarket({ ...formMarket, index_output: e.target.value })} placeholder="backend.adapters.JumiaTz"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={formMarket.is_active} onChange={(e) => setFormMarket({ ...formMarket, is_active: e.target.checked })} className="peer sr-only" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Initialize as Active</span>
                  </label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <button
                type="button"
                onClick={() => !error?setIsDrawerOpen(false):setIsDrawerOpen(true)}
                className="w-1/2 text-center py-2.5 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-all cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="merchant-form"
                className="w-1/2 text-center py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all shadow-sm cursor-pointer"
              >
                Commit
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}