import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  Plus, 
  RefreshCw, 
  Link2, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';

// Models matching the soko_ai_backend relational merchant topology
interface MerchantProfile {
  id: string;
  businessName: string;
  parentMarketplace: string;
  affiliateTrackingId: string;
  totalMappedProducts: number;
  connectionStatus: 'synchronized' | 'rate_limited' | 'disconnected';
  commissionRate: number; // Percentage percentage cut on affiliate conversions
  primaryContact: string;
}

export default function PartnerMerchantsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [merchants, setMerchants] = useState<MerchantProfile[]>([
    {
      id: "MCH-JUM-OFF",
      businessName: "Official Nike Store EA",
      parentMarketplace: "Jumia Kenya",
      affiliateTrackingId: "sokoai-nike-254",
      totalMappedProducts: 412,
      connectionStatus: "synchronized",
      commissionRate: 8.5,
      primaryContact: "distribution@nike-ea.com"
    },
    {
      id: "MCH-KLI-FIT",
      businessName: "Amani Fitness Warehouse",
      parentMarketplace: "Kilimall",
      affiliateTrackingId: "sokoai-amani-fit",
      totalMappedProducts: 188,
      connectionStatus: "synchronized",
      commissionRate: 10.0,
      primaryContact: "sales@amanifitness.co.ke"
    },
    {
      id: "MCH-JUM-SPS",
      businessName: "Sports Planet Kenya",
      parentMarketplace: "Jumia Kenya",
      affiliateTrackingId: "sokoai-sportsplan-ke",
      totalMappedProducts: 94,
      connectionStatus: "rate_limited",
      commissionRate: 7.0,
      primaryContact: "ops@sportsplanet.com"
    },
    {
      id: "MCH-COP-GLB",
      businessName: "Global Tech & Gear Ltd",
      parentMarketplace: "Copia",
      affiliateTrackingId: "sokoai-globalgear",
      totalMappedProducts: 0,
      connectionStatus: "disconnected",
      commissionRate: 5.0,
      primaryContact: "b2b@globaltech.ae"
    }
  ]);

  const triggerMerchantPoll = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredMerchants = merchants.filter(merchant =>
    merchant.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.parentMarketplace.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn p-0.5">
      
      {/* HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Partner Merchants Directory</h2>
          <p className="text-xs text-slate-400">
            Monitor verified vendors, embedded affiliate network identifier tags, conversion variables, and active tracking endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={triggerMerchantPoll}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Poll Upstream Seller Metrics"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          
          <button
            type="button"
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus size={13} /> Onboard Merchant Node
          </button>
        </div>
      </div>

      {/* SEARCH AND CONTROL ROW */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchants, marketplaces or affiliate tags..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* MERCHANTS GRID MATRIX */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredMerchants.length > 0 ? (
          filteredMerchants.map((merchant) => (
            <div 
              key={merchant.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all duration-150"
            >
              {/* Profile Meta Segment */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 bg-slate-100 border border-slate-200/60 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
                    <Store size={15} className="text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900 truncate" title={merchant.businessName}>
                      {merchant.businessName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">{merchant.id}</span>
                      <span className="text-slate-300 text-[10px]">•</span>
                      <span className="text-[10px] text-slate-500 font-medium">{merchant.parentMarketplace}</span>
                    </div>
                  </div>
                </div>

                {/* Connection Pipeline Diagnostics */}
                <div className="shrink-0">
                  {merchant.connectionStatus === 'synchronized' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                      <CheckCircle2 size={10} /> Sync Stable
                    </span>
                  )}
                  {merchant.connectionStatus === 'rate_limited' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                      <AlertTriangle size={10} /> Backing Off
                    </span>
                  )}
                  {merchant.connectionStatus === 'disconnected' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      <XCircle size={10} /> Offline
                    </span>
                  )}
                </div>
              </div>

              {/* Affiliate and Catalog Telemetry Data Panel */}
              <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 bg-slate-50/40 rounded-lg px-2 text-xs font-medium">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Affiliate Tag</span>
                  <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
                    <Link2 size={10} className="text-slate-400 shrink-0" />
                    <span className="truncate max-w-[80px]" title={merchant.affiliateTrackingId}>
                      {merchant.affiliateTrackingId}
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Commission Matrix</span>
                  <span className="text-slate-700">{merchant.commissionRate.toFixed(1)}% Fixed</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Indexed Items</span>
                  <div className="flex items-center gap-1 text-slate-700 font-mono">
                    <Package size={11} className="text-slate-300" />
                    <span>{merchant.totalMappedProducts} items</span>
                  </div>
                </div>
              </div>

              {/* Footer System Meta Actions */}
              <div className="flex items-center justify-between text-[11px] font-medium pt-1">
                <span className="text-slate-400 font-mono text-[10px] truncate max-w-[60%]" title={merchant.primaryContact}>
                  {merchant.primaryContact}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="px-2 py-1 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg shadow-2xs hover:border-slate-300 transition-colors text-[11px] cursor-pointer inline-flex items-center gap-1"
                  >
                    Adjust Commission
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Open Merchant Rules Panel"
                  >
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-1 xl:col-span-2 bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 font-medium flex flex-col items-center justify-center gap-2 shadow-2xs">
            <Store size={20} className="text-slate-300" />
            <span>No merchant parameters matched your database criteria.</span>
          </div>
        )}
      </div>

    </div>
  );
}