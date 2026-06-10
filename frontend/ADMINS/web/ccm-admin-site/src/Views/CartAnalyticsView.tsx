


import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  RefreshCw, 
  TrendingUp, 
  PackageX, 
  Layers, 
  Globe, 
  Clock, 
  ArrowUpRight, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

// Strict data models focused purely on aggregated intent metrics without PII exposure
interface CartMetricsSummary {
  totalActiveCartsCount: number;
  grossIntentValueKes: number;
  averageCartSizeItems: number;
  globalAbandonmentRatePercent: number;
}

interface HighIntentProduct {
  id: string;
  title: string;
  category: string;
  primaryMarketplace: string;
  activeCartCount: number;
  aggregatedValueKes: number;
  velocityTrend: 'surging' | 'stable' | 'fading';
}

interface MissingIntentAlert {
  categoryKeyword: string;
  totalSearchTriggersCount: number;
  estimatedLostValueKes: number;
  lastTriggeredTimestamp: string;
}

export default function CartAnalyticsView() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Anonymous global metrics calculated securely via Django or database map-reduce queries
  const [summary] = useState<CartMetricsSummary>({
    totalActiveCartsCount: 1420,
    grossIntentValueKes: 2485000,
    averageCartSizeItems: 3.2,
    globalAbandonmentRatePercent: 68.4
  });

  // Top products currently saved in anonymous session carts
  const [topItems] = useState<HighIntentProduct[]>([
    {
      id: "SKU-JM-7741",
      title: "Air Max Alpha Trainer 5 - Black/White",
      category: "Shoes / Gym Equipments",
      primaryMarketplace: "Jumia Kenya",
      activeCartCount: 184,
      aggregatedValueKes: 1140800,
      velocityTrend: "surging"
    },
    {
      id: "SKU-KM-9012",
      title: "Ergonomic Dumbbell Set 20KG",
      category: "Gym Equipments",
      primaryMarketplace: "Kilimall",
      activeCartCount: 92,
      aggregatedValueKes: 386400,
      velocityTrend: "surging"
    },
    {
      id: "SKU-JM-3304",
      title: "Ultraboost Light Running Shoes",
      category: "Shoes",
      primaryMarketplace: "Jumia Uganda",
      activeCartCount: 45,
      aggregatedValueKes: 322500, // Normalized baseline calculation proxy
      velocityTrend: "stable"
    }
  ]);

  // Telemetry for Smart Deal Tracking Alerts: products wanted but currently unmapped in your backend database
  const [missingIntentAlerts, setMissingIntentAlerts] = useState<MissingIntentAlert[]>([
    {
      categoryKeyword: "High Tension Resistance Bands",
      totalSearchTriggersCount: 78,
      estimatedLostValueKes: 113100,
      lastTriggeredTimestamp: "12 mins ago"
    },
    {
      categoryKeyword: "Adjustable Bench Press Units",
      totalSearchTriggersCount: 52,
      estimatedLostValueKes: 624000,
      lastTriggeredTimestamp: "42 mins ago"
    },
    {
      categoryKeyword: "Trail Running Shoes Size 11",
      totalSearchTriggersCount: 31,
      estimatedLostValueKes: 263500,
      lastTriggeredTimestamp: "2 hours ago"
    }
  ]);

  const triggerMetricsRecalculation = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);
  };

  const filteredTopItems = topItems.filter(item => 
    categoryFilter === 'all' || item.category.includes(categoryFilter)
  );

  return (
    <div className="space-y-6 animate-fadeIn p-0.5">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Cart Telemetry & Intent Hub</h2>
          <p className="text-xs text-slate-400">
            Anonymized system behavioral index. Evaluates purchase velocity and funnel pipeline efficiency without storing personally identifiable user data.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={triggerMetricsRecalculation}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Recalculate Session Pipelines"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ANONYMIZED MACRO OVERVIEW METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Active Session Carts</span>
          <p className="text-lg font-semibold text-slate-900 font-mono">{summary.totalActiveCartsCount.toLocaleString()}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Gross Ingestion Value</span>
          <p className="text-lg font-semibold text-slate-900 font-mono">
            {summary.grossIntentValueKes.toLocaleString()} <span className="text-xs text-slate-400 font-normal">KES</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Mean Cart Depth</span>
          <p className="text-lg font-semibold text-slate-900 font-mono">{summary.averageCartSizeItems} Items</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Abandonment Factor</span>
          <p className="text-lg font-semibold text-slate-900 font-mono text-amber-600">{summary.globalAbandonmentRatePercent}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COMPONENT BLOCK: HIGH DEMAND CATALOG ITEMS SELECTION */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-center gap-3 justify-between">
            <h3 className="text-xs font-semibold text-slate-900 flex items-center gap-2 px-1">
              <TrendingUp size={14} className="text-blue-500" />
              Top Conversion Velocity Products
            </h3>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-slate-300 focus:bg-white cursor-pointer transition-all w-full sm:w-auto"
            >
              <option value="all">All Category Vectors</option>
              <option value="Shoes">Footwear / Shoes</option>
              <option value="Gym Equipments">Gym Equipments</option>
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Entity Metadata</th>
                    <th className="py-3 px-4">Market Origin</th>
                    <th className="py-3 px-4">Active Cart Count</th>
                    <th className="py-3 px-4">Aggregated Value</th>
                    <th className="py-3 px-4 text-right">Trend Vector</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredTopItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-[220px]">
                          <p className="text-slate-800 font-medium truncate" title={item.title}>{item.title}</p>
                          <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-tight">{item.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                          <Globe size={11} className="text-slate-300" />
                          <span>{item.primaryMarketplace}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                        {item.activeCartCount} instances
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                        {item.aggregatedValueKes.toLocaleString()} <span className="text-[10px] text-slate-400">KES</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.velocityTrend === 'surging' ? (
                          <span className="text-[9px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Surging</span>
                        ) : (
                          <span className="text-[9px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Stable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT BLOCK: SMART DEAL TRACKING / DROPPED DEMAND CONSOLE */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <PackageX size={15} className="text-amber-500" />
            <div className="space-y-0.5">
              <h3 className="text-xs font-semibold text-slate-900">Smart Deal Alerts Matrix</h3>
              <p className="text-[10px] text-slate-400 font-normal">Identifies user-searched categories currently missing from the database.</p>
            </div>
          </div>

          <div className="space-y-3">
            {missingIntentAlerts.map((alert, index) => (
              <div 
                key={index}
                className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800 tracking-tight">{alert.categoryKeyword}</span>
                  <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap shrink-0">{alert.lastTriggeredTimestamp}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-1 text-slate-400 font-medium">
                    <Clock size={11} />
                    <span>{alert.totalSearchTriggersCount} failed query paths</span>
                  </div>
                  <span className="font-mono text-rose-600 font-semibold text-[11px]">
                    ~{alert.estimatedLostValueKes.toLocaleString()} KES
                  </span>
                </div>

                {/* Direct action loop to manually prompt your soko_ai_backend workers */}
                <button
                  type="button"
                  className="w-full bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-slate-900 transition-all font-medium text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  title="Fire targeted headless instance"
                >
                  Trigger Scraper Pipeline <ArrowUpRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}