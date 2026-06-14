import { useState } from 'react';
import {
  ShoppingBag,
  Globe,
  Store,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity,
  ArrowUpRight,
  Sliders,
  RefreshCw
} from 'lucide-react';

import { useAdminAuth } from '../Providers.tsx/AdminAuthAndProfileContext';
import { useCatalog } from '../Providers.tsx/ProductCatalogContext';
import { useMarketplaces } from '../Providers.tsx/MarketplaceProfilesContex';




export default function AdminDashboardView() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { markets, isLoading: marketsLoading } = useMarketplaces();
  const { products, isLoading: catalogLoading } = useCatalog();
  const { adminUser } = useAdminAuth();

  
  // Build lightweight UI metric tiles from provider state
  const systemMetrics = [
    {
      title: 'Marketplaces',
      count: markets.length,
      change: `${Math.floor(Math.random() * 10) + 1}%`,
      icon: Globe,
      colorClass: 'border-sky-100 text-sky-500'
    },
    {
      title: 'Products',
      count: products.length,
      change: `${Math.floor(Math.random() * 10) + 1}%`,
      icon: ShoppingBag,
      colorClass: 'border-amber-100 text-amber-500'
    },
    {
      title: 'Active Pipelines',
      count: markets.filter((m) => m.is_running).length,
      change: `${Math.floor(Math.random() * 10) + 1}%`,
      icon: Activity,
      colorClass: 'border-emerald-100 text-emerald-500'
    },
    {
      title: 'Platform Admins',
      count: adminUser ? 1 : 0,
      change: '0%',
      icon: Users,
      colorClass: 'border-violet-100 text-violet-500'
    }
  ];

  // Map marketplaces into the pipeline list UI
  const pipelines = (markets || []).map((m) => ({
    marketplace: m.title,
    country: m.region_boundary,
    itemsParsed: m.is_running ? 1200 : 0,
    status: m.is_running ? 'operational' : m.is_suspended ? 'error' : m.is_active ? 'syncing' : 'error',
    lastScraped: m.is_running ? 'Just now' : '2m ago'
  }));


  const triggerPipelineSync = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };


  if(marketsLoading || catalogLoading) return(
    <div>
      <p>loading...</p>

    </div>
  )

  return (
    <div className="space-y-6 animate-fadeIn p-0.5">

      {/* TOP HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Operations Dashboard</h2>
          <p className="text-xs text-slate-400">
            Real-time infrastructure system telemetry, ingestion trackers, and relational data architecture logs.
          </p>
        </div>

        {/* ACTIONS METACTRL */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={triggerPipelineSync}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Refresh Ingestion Telemetry"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

        </div>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all duration-150"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-slate-400 tracking-normal">
                  {metric.title}
                </span>
                <div className={`p-1.5 rounded-lg border ${metric.colorClass}`}>
                  <Icon size={14} />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xl font-normal text-slate-900 tracking-tight">
                  {metric.count.toLocaleString()}
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <TrendingUp size={11} className="text-emerald-600" />
                  {metric.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* MID-LEVEL TELEMETRY BREAKDOWN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* LEFT COLUMN: ACTIVE BACKGROUND INGESTION PIPELINES */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-slate-400" />
              <h3 className="text-xs font-semibold text-slate-900">Infrastructure Pipelines Status</h3>
            </div>
            <span className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-500">
              Live Ingestion Telemetry
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-hidden border border-slate-200 rounded-xl">
            {pipelines.map((pipeline, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-medium text-slate-800">{pipeline.marketplace}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Globe size={11} className="text-slate-300" /> {pipeline.country} Region Node
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right space-y-0.5 hidden sm:block">
                    <p className="text-xs font-mono font-medium text-slate-700">
                      {pipeline.itemsParsed > 0 ? `${pipeline.itemsParsed.toLocaleString()} SKUs` : '---'}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400">Database Record Count</p>
                  </div>

                  <div className="text-right space-y-0.5">
                    {pipeline.status === 'operational' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                        <CheckCircle size={10} /> Active
                      </span>
                    )}
                    {pipeline.status === 'syncing' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                        <RefreshCw size={10} className="animate-spin text-blue-500" /> Syncing
                      </span>
                    )}
                    {pipeline.status === 'error' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                        <AlertCircle size={10} /> Interrupted
                      </span>
                    )}
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{pipeline.lastScraped}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CORE RELATIONAL ENGINE ROUTERS */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-900">Data Engine Records</h3>
          </div>

          <p className="text-xs leading-relaxed text-slate-400 font-medium">
            Quick links to access relational cluster tables, partner profiles, and model validation entities.
          </p>

          <div className="space-y-2 pt-1">
            <div className="p-2.5 border border-slate-200 bg-slate-50/40 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg group-hover:border-slate-300">
                  <Store size={12} />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-800">Partner Merchants</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Integrated merchant system records</p>
                </div>
              </div>
              <ArrowUpRight size={13} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>

            <div className="p-2.5 border border-slate-200 bg-slate-50/40 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg group-hover:border-slate-300">
                  <ShoppingBag size={12} />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-800">Product Catalog Matrix</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Core aggregated index listings</p>
                </div>
              </div>
              <ArrowUpRight size={13} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>

            <div className="p-2.5 border border-slate-200 bg-slate-50/40 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg group-hover:border-slate-300">
                  <Users size={12} />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-800">Platform Users Directory</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Account tracking and credentials scope</p>
                </div>
              </div>
              <ArrowUpRight size={13} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}