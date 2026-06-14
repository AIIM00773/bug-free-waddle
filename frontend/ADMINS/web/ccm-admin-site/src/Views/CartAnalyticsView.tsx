import { 
  ShoppingCart, 
  RefreshCw, 
  TrendingUp, 
  PackageX, 
  Globe, 
  Clock, 
  ArrowUpRight, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useCartAnalytics } from '../Providers.tsx/CartAnalyicsContext';

export default function CartAnalyticsView() {
  const {
    summary,
    isLoading,
    error,
    categoryFilter,
    setCategoryFilter,
    filteredTopItems,
    recalculateSessionPipelines,
    dispatchTargetedScraperPipeline,
    missingIntentAlerts,
    
  } = useCartAnalytics();

  const handleScraperTriggerClick = async (categoryKeyword: string) => {
    await dispatchTargetedScraperPipeline(categoryKeyword);
    alert(`Administrative Pipeline Dispatched: Targeted headless spider worker queued for "${categoryKeyword}".`);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-1 text-slate-800 antialiased">
      
      {/* TERMINAL RUNTIME HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingCart size={18} className="text-slate-800 shrink-0" />
            Cart Telemetry & Business Intent Hub
          </h2>
          <p className="text-xs text-slate-500 max-w-3xl">
            Anonymized macro transaction index tracking platform intent metrics. Evaluates buyer velocity vectors, product cluster demands, and missing catalog index pipelines safely without exposing consumer PII.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            disabled={isLoading}
            onClick={recalculateSessionPipelines}
            className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 bg-white border border-slate-200 rounded-xl transition-all shadow-3xs hover:shadow-2xs cursor-pointer flex items-center justify-center"
            title="Force run calculation map reduce pipeline execution metrics"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* REACTION SYSTEM TELEMETRY WARNINGS OVERRIDES */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-start gap-3 shadow-3xs">
          <AlertCircle size={16} className="shrink-0 text-rose-500 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Telemetry Processing Interruption</span>
            <p className="text-rose-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* MACRO COMPUTE INTENT OVERVIEW TRACKING GRID */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Carts Session Matrix</span>
            <p className="text-xl font-bold text-slate-900 font-mono tracking-tight">{summary.totalActiveCartsCount.toLocaleString()}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gross Intent Value Stream</span>
            <p className="text-xl font-bold text-slate-900 font-mono tracking-tight">
              {summary.grossIntentValueKes.toLocaleString()} <span className="text-xs text-slate-400 font-normal font-sans">KES</span>
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mean Basket Density</span>
            <p className="text-xl font-bold text-slate-900 font-mono tracking-tight">{summary.averageCartSizeItems} <span className="text-xs text-slate-400 font-normal font-sans">Items / Cart</span></p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Abandonment Factor Constant</span>
            <p className="text-xl font-bold text-amber-600 font-mono tracking-tight">{summary.globalAbandonmentRatePercent}%</p>
          </div>
        </div>
      )}

      {/* ANALYTICS WORKSPACE DATA TABLE SPLIT BLOCKS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* VELOCITY METRIC SELECTION - COMPUTE DISPLAY TABLE */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-3xs flex flex-col sm:flex-row items-center gap-3 justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 px-1">
              <TrendingUp size={14} className="text-blue-500 shrink-0" />
              High Conversion Velocity Inventory
            </h3>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-slate-400 focus:bg-white cursor-pointer transition-all w-full sm:w-auto"
            >
              <option value="all">All Category Vectors</option>
              <option value="Shoes">Footwear / Shoes</option>
              <option value="Gym Equipments">Gym Equipments</option>
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Entity Information</th>
                    <th className="py-3 px-4">Market Origin Target</th>
                    <th className="py-3 px-4">Instance Depth</th>
                    <th className="py-3 px-4">Aggregated Value</th>
                    <th className="py-3 px-4 text-right">Velocity Vector</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {filteredTopItems.length > 0 ? filteredTopItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-[240px]">
                          <p className="text-slate-800 font-bold truncate" title={item.title}>{item.title}</p>
                          <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-tight">{item.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Globe size={12} className="text-slate-300 shrink-0" />
                          <span>{item.primaryMarketplace}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 font-semibold">
                        {item.activeCartCount} items
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {item.aggregatedValueKes.toLocaleString()} <span className="text-[10px] text-slate-400 font-sans font-normal">KES</span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {item.velocityTrend === 'surging' ? (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Surging</span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">Stable</span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 font-semibold">No catalog items match current category vector parameters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL SUMMARY PROFILE DROPPED CONSOLE INTERFACE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
          <div className="border-b border-slate-100 pb-3.5 flex items-center gap-2">
            <PackageX size={16} className="text-amber-500 shrink-0" />
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Smart Deal Tracker Warnings</h3>
              <p className="text-[10px] text-slate-400 font-normal">Sought-after user parameters currently unmapped inside platform tables.</p>
            </div>
          </div>

          <div className="space-y-3">
            {missingIntentAlerts.length > 0 ? missingIntentAlerts.map((alert, index) => (
              <div 
                key={index}
                className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-3.5 space-y-3 hover:border-slate-300 transition-colors shadow-3xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800 tracking-tight leading-snug">{alert.categoryKeyword}</span>
                  <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap shrink-0 font-semibold">{alert.lastTriggeredTimestamp}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <div className="flex items-center gap-1 text-slate-400 font-medium">
                    <Clock size={11} className="shrink-0" />
                    <span>{alert.totalSearchTriggersCount} failed logs</span>
                  </div>
                  <span className="font-mono text-rose-600 font-bold">
                    ~{alert.estimatedLostValueKes.toLocaleString()} <span className="text-[9px] font-sans font-normal text-rose-400">KES</span>
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleScraperTriggerClick(alert.categoryKeyword)}
                  className="w-full bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-slate-900 transition-all font-bold text-[10px] py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                  title="Fire targeted async scraper script engine parameters"
                >
                  Spawn Scraper Workers <ArrowUpRight size={11} className="shrink-0" />
                </button>
              </div>
            )) : (
              <div className="p-6 text-center text-slate-400 font-semibold border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5">
                <HelpCircle size={20} className="text-slate-200 stroke-[1.5]" />
                <p className="text-xs">All intent streams fully mapped.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}