import React, { useState } from 'react';
import { 
  Layers, 
  ShoppingBag, 
  Globe, 
  Coins, 
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

interface SystemMetric {
  title: string;
  count: number;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  colorClass: string;
}

interface PipelineStatus {
  marketplace: string;
  country: string;
  status: 'operational' | 'error' | 'syncing';
  lastScraped: string;
  itemsParsed: number;
}

export default function AdminDashboardView() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Metrics categorized exactly matching your layout hierarchy
  const systemMetrics: SystemMetric[] = [
    { 
      title: 'Marketplace Profiles', 
      count: 6, 
      change: '2 Regions Active', 
      isPositive: true, 
      icon: Globe, 
      colorClass: 'bg-slate-50 text-slate-600 border-slate-200' 
    },
    { 
      title: 'Taxonomy Matrices', 
      count: 184, 
      change: '+8 new classifications', 
      isPositive: true, 
      icon: Layers, 
      colorClass: 'bg-slate-50 text-slate-600 border-slate-200' 
    },
    { 
      title: 'Currency Ledger', 
      count: 3, 
      change: 'Anchor: KES', 
      isPositive: true, 
      icon: Coins, 
      colorClass: 'bg-slate-50 text-slate-600 border-slate-200' 
    },
    { 
      title: 'Product Catalog', 
      count: 14280, 
      change: '+12.4% parsed tracking', 
      isPositive: true, 
      icon: ShoppingBag, 
      colorClass: 'bg-slate-50 text-slate-600 border-slate-200' 
    }
  ];

  const pipelines: PipelineStatus[] = [
    { marketplace: 'Jumia Kenya', country: 'Kenya', status: 'operational', lastScraped: '4 mins ago', itemsParsed: 4120 },
    { marketplace: 'Kilimall', country: 'Kenya', status: 'operational', lastScraped: '18 mins ago', itemsParsed: 2890 },
    { marketplace: 'Jumia Uganda', country: 'Uganda', status: 'syncing', lastScraped: 'In Progress', itemsParsed: 1105 },
    { marketplace: 'Copia', country: 'Kenya', status: 'error', lastScraped: '2 hours ago', itemsParsed: 0 },
  ];

  const triggerPipelineSync = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

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