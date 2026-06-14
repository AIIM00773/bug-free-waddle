import React, { useState } from 'react';
import {
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  ShieldAlert,
  Send,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';
import { useOrderRecords } from '../Providers.tsx/OrderRecordsContext';
// import type { OrderRecord } from '../context/OrderRecordsContext';

export default function OrderRecordsView() {
  const {
    orders,
    isLoading,
    error,
    syncOrderPipelines,
    updateAffiliateStatus,
    appendResolutionMemo
  } = useOrderRecords();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [adminConflictMemo, setAdminConflictMemo] = useState('');

  // Find currently chosen record reference reactively to keep parameters sync'd across updates
  const activeSelectedOrder = orders.find(o => o.id === selectedOrderId) || null;

  // Search filter matching algorithms (Addresses conversion targets, tokens, and buyer paths)
  const filteredOrders = orders.filter(order => {
    const targetQuery = searchQuery.toLowerCase();
    const matchesSearch = order.id.toLowerCase().includes(targetQuery) ||
      order.userEmail.toLowerCase().includes(targetQuery) ||
      order.trackingToken.toLowerCase().includes(targetQuery) ||
      order.itemTitle.toLowerCase().includes(targetQuery);
    const matchesStatus = statusFilter === 'all' || order.affiliateStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAppendConflictMemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !adminConflictMemo.trim()) return;

    try {
      await appendResolutionMemo(selectedOrderId, adminConflictMemo);
      setAdminConflictMemo('');
    } catch (err) {
      // Error is gracefully caught and surfaced by context boundary hooks
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn p-1 text-slate-800 antialiased">

      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingBag size={20} className="text-slate-700" /> Order & Affiliate Records Manager
          </h2>
          <p className="text-xs text-slate-500 max-w-3xl">
            Track transactional conversions, patch broken cross-origin affiliate pixels, debug Jumia/Kilimall scraper exceptions, and log validation overrides.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={syncOrderPipelines}
            disabled={isLoading}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-40"
            title="Poll Ingestion Aggregator Pipes"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ERROR SCOPE BOUNDARY */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-start gap-3 shadow-2xs">
          <ShieldAlert size={16} className="shrink-0 text-rose-500 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Aggregator Ingestion Anomaly Blocked</span>
            <p className="text-rose-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* CONTROLS MATRICES BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID reference keys, buyer routing emails, or transaction cookies..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <SlidersHorizontal size={12} className="text-slate-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pipeline Filter</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-slate-400 cursor-pointer transition-all shadow-2xs"
          >
            <option value="all">All Affiliate States</option>
            <option value="verified_payout">Verified Conversion Payout</option>
            <option value="pending_network_callback">Pending Network Callbacks</option>
            <option value="disputed_by_partner">Disputed By Partner</option>
            <option value="conversion_failed">Failed Pixel Session Drops</option>
          </select>
        </div>
      </div>

      {/* WORKING DESKTOP CORE PANELS SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* CONVERSIONS RECORES TABULAR MATRIX */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order Node Token</th>
                  <th className="py-3.5 px-4">User & Item Parameters</th>
                  <th className="py-3.5 px-4">Affiliate Conversion State</th>
                  <th className="py-3.5 px-4">Calculated Gross</th>
                  <th className="py-3.5 px-4 text-right">Scope Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const isSelected = selectedOrderId === order.id;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => { setSelectedOrderId(order.id); setAdminConflictMemo(''); }}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/40 hover:bg-blue-50/50' : 'hover:bg-slate-50/30'
                          }`}
                      >
                        {/* Column 1: Core System Identities */}
                        <td className="py-4 px-4 font-mono">
                          <span className="text-slate-900 block text-[11px] font-bold">{order.id}</span>
                          <span className="text-[10px] text-slate-400 font-normal block mt-0.5">{order.timestamp}</span>
                        </td>

                        {/* Column 2: Context Details */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5 max-w-[200px]">
                            <p className="text-slate-800 font-bold truncate" title={order.userEmail}>{order.userEmail}</p>
                            <p className="text-[10px] text-slate-400 font-normal truncate" title={order.itemTitle}>{order.itemTitle}</p>
                          </div>
                        </td>

                        {/* Column 3: Badge Status Enums */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {order.affiliateStatus === 'verified_payout' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md">
                              <CheckCircle2 size={11} /> Verified
                            </span>
                          )}
                          {order.affiliateStatus === 'pending_network_callback' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-md">
                              <Clock size={11} /> Callback Loop
                            </span>
                          )}
                          {order.affiliateStatus === 'disputed_by_partner' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-md animate-pulse">
                              <AlertTriangle size={11} /> Partner Disputed
                            </span>
                          )}
                          {order.affiliateStatus === 'conversion_failed' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
                              <XCircle size={11} /> Dropped Session
                            </span>
                          )}
                        </td>

                        {/* Column 4: Gross Accounting Presentation */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          {order.orderTotal.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{order.currency}</span>
                        </td>

                        {/* Column 5: Explicit Component Trigger Action */}
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${isSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-50 text-blue-600 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
                              }`}
                          >
                            Inspect
                          </button>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400 font-semibold">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle size={24} className="text-slate-300 stroke-[1.5]" />
                        <span className="text-xs">No historical conversions intersect current filtering matrix.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* COMPLIANCE AUDIT DEBUG INTERVENTION CONSOLE PANEL */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldAlert size={15} className="text-slate-900 shrink-0" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Conflict Resolution Terminal</h3>
          </div>

          {activeSelectedOrder ? (
            <div className="space-y-4 text-xs font-semibold text-slate-700">

              {/* Context Summary Blocks */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2.5">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Node Key ID</span>
                  <span className="font-mono text-slate-900 text-[11px] font-bold">{activeSelectedOrder.id}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Origin Portal</span>
                  <span className="text-slate-700 text-[11px] font-bold flex items-center gap-1">
                    {activeSelectedOrder.marketplaceOrigin}
                    <span className="text-[10px] text-slate-400 font-mono font-medium">({activeSelectedOrder.merchantRef})</span>
                  </span>
                </div>
                <div className="space-y-1 border-t border-slate-200/50 pt-2">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Tracking Cookie Signature Token</span>
                  <span className="font-mono text-slate-600 text-[10px] block truncate bg-white border border-slate-200 px-2 py-1 rounded-md shadow-2xs font-medium" title={activeSelectedOrder.trackingToken}>
                    {activeSelectedOrder.trackingToken}
                  </span>
                </div>
              </div>

              {/* Functional Pipeline Trigger Handlers */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Manual Pipeline Control Overrides</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => updateAffiliateStatus(activeSelectedOrder.id, 'verified_payout')}
                    className="p-2 text-center font-bold border border-slate-200 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors cursor-pointer text-[11px] shadow-2xs disabled:opacity-40"
                  >
                    Force Verify Payout
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => updateAffiliateStatus(activeSelectedOrder.id, 'conversion_failed')}
                    className="p-2 text-center font-bold border border-slate-200 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors cursor-pointer text-[11px] shadow-2xs disabled:opacity-40"
                  >
                    Mark Failed Drop
                  </button>
                </div>
              </div>

              {/* Dynamic Incident Logging Feed */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">System Trace Verification Logs</label>
                <div className="p-3 bg-slate-900 text-slate-300 font-mono text-[11px] rounded-xl leading-relaxed border border-slate-950 shadow-inner">
                  {activeSelectedOrder.resolutionNotes ? activeSelectedOrder.resolutionNotes : "No pipeline parsing exceptions, tracking failures, or verification anomalies mapped to this record model index."}
                </div>
              </div>

              {/* Append Memo Logging Actions Form */}
              <form onSubmit={handleAppendConflictMemoSubmit} className="space-y-2.5 pt-3 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Append Administrative Conflict Notes</label>
                <textarea
                  value={adminConflictMemo}
                  onChange={(e) => setAdminConflictMemo(e.target.value)}
                  placeholder="Input incoming affiliate payload data adjustments, payment reference validations, or verification mismatch reports here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all h-24 resize-none shadow-xs"
                />
                <button
                  type="submit"
                  disabled={isLoading || !adminConflictMemo.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:hover:bg-slate-900"
                >
                  <Send size={12} /> Commit Log Parameters
                </button>
              </form>

            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 font-semibold flex flex-col items-center justify-center gap-2 border border-dashed border-slate-200 rounded-xl">
              <HelpCircle size={24} className="text-slate-200" />
              <p className="text-xs max-w-[200px] leading-relaxed mx-auto">Select an asynchronous conversion node vector from the tracking matrix directory to unlock direct conflict interventions.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}