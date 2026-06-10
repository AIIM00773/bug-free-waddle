


import React, { useState } from 'react';
import { 
  ShoppingBagIcon, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Send,
  User
} from 'lucide-react';

// Comprehensive administrative order schema built for aggregator telemetry conflict tracking
interface OrderRecord {
  id: string;
  userEmail: string;
  itemTitle: string;
  marketplaceOrigin: string;
  merchantRef: string;
  orderTotal: number;
  currency: string;
  affiliateStatus: 'verified_payout' | 'pending_network_callback' | 'disputed_by_partner' | 'conversion_failed';
  trackingToken: string; // The specific pipeline tracking cookie slug
  timestamp: string;
  resolutionNotes?: string;
}

export default function OrderRecordsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [adminConflictMemo, setAdminConflictMemo] = useState('');

  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      id: "ORD-2026-8841",
      userEmail: "mwangi.dev@gmail.com",
      itemTitle: "Air Max Alpha Trainer 5 - Black/White",
      marketplaceOrigin: "Jumia Kenya",
      merchantRef: "MCH-JUM-OFF",
      orderTotal: 6200,
      currency: "KES",
      affiliateStatus: "verified_payout",
      trackingToken: "st_tok_991204_aff_ke",
      timestamp: "2026-06-10 09:12 EAT"
    },
    {
      id: "ORD-2026-3391",
      userEmail: "kamau.j@outlook.com",
      itemTitle: "Ergonomic Dumbbell Set 20KG",
      marketplaceOrigin: "Kilimall",
      merchantRef: "MCH-KLI-FIT",
      orderTotal: 4200,
      currency: "KES",
      affiliateStatus: "pending_network_callback",
      trackingToken: "st_tok_774112_aff_kli",
      timestamp: "2026-06-10 08:45 EAT"
    },
    {
      id: "ORD-2026-1102",
      userEmail: "atieno_fit@yahoo.com",
      itemTitle: "Ultraboost Light Running Shoes",
      marketplaceOrigin: "Jumia Uganda",
      merchantRef: "MCH-JUM-SPS",
      orderTotal: 215000,
      currency: "UGX",
      affiliateStatus: "disputed_by_partner",
      trackingToken: "st_tok_441092_aff_ug",
      timestamp: "2026-06-09 16:22 EAT",
      resolutionNotes: "Partner network flag: Cookie mismatch parameter detected at checkout conversion window."
    },
    {
      id: "ORD-2026-0941",
      userEmail: "omondi.fitness@gmail.com",
      itemTitle: "Resistance Band Multi-Pack High Tension",
      marketplaceOrigin: "Copia",
      merchantRef: "MCH-COP-GLB",
      orderTotal: 1450,
      currency: "KES",
      affiliateStatus: "conversion_failed",
      trackingToken: "st_tok_110293_aff_cop",
      timestamp: "2026-06-08 11:04 EAT",
      resolutionNotes: "User terminated external session before cart pixel firing trigger sequence completed."
    }
  ]);

  const triggerPipelineRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Administrative Resolution Actions
  const handleUpdateAffiliateStatus = (orderId: string, nextStatus: OrderRecord['affiliateStatus']) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { ...o, affiliateStatus: nextStatus, resolutionNotes: `Manual admin intervention override applied to state.` };
      }
      return o;
    }));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, affiliateStatus: nextStatus } : null);
    }
  };

  const handleAppendConflictMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !adminConflictMemo.trim()) return;

    setOrders(orders.map(o => {
      if (o.id === selectedOrder.id) {
        return { ...o, resolutionNotes: adminConflictMemo };
      }
      return o;
    }));
    setSelectedOrder(prev => prev ? { ...prev, resolutionNotes: adminConflictMemo } : null);
    setAdminConflictMemo('');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.trackingToken.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.affiliateStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn p-0.5">
      
      {/* HEADER SEGMENT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Order & Affiliate Records Manager</h2>
          <p className="text-xs text-slate-400">
            Audit conversions, resolve partner network data conflicts, override stuck pixels, and manage buyer transactional dispute nodes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={triggerPipelineRefresh}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Poll Ingestion Order Ledgers"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* FILTER PANEL GRID */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, user account email, or tracking token..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-slate-300 focus:bg-white cursor-pointer transition-all"
          >
            <option value="all">All Affiliate States</option>
            <option value="verified_payout">Verified Conversion Payout</option>
            <option value="pending_network_callback">Pending Callback loop</option>
            <option value="disputed_by_partner">Partner Disputed</option>
            <option value="conversion_failed">Conversion Failures</option>
          </select>
        </div>
      </div>

      {/* MAIN CONTENT BLOCK - SPLIT SCREEN WORKSPACE FOR CONFLICT RESOLUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: CONVERSIONS DATA DIRECTORY TABLE */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Order Identity</th>
                  <th className="py-3 px-4">User / Conversion Context</th>
                  <th className="py-3 px-4">Affiliate Pipeline State</th>
                  <th className="py-3 px-4">Calculated Cost</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => { setSelectedOrder(order); setAdminConflictMemo(''); }}
                      className={`cursor-pointer transition-colors ${
                        selectedOrder?.id === order.id ? 'bg-blue-50/40 hover:bg-blue-50/50' : 'hover:bg-slate-50/40'
                      }`}
                    >
                      {/* Cell 1: Identities */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-slate-900 block text-[11px]">{order.id}</span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-tight block">{order.timestamp}</span>
                      </td>

                      {/* Cell 2: Target Mapping */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-[180px]">
                          <p className="text-slate-800 font-medium truncate" title={order.userEmail}>{order.userEmail}</p>
                          <p className="text-[10px] text-slate-400 truncate" title={order.itemTitle}>{order.itemTitle}</p>
                        </div>
                      </td>

                      {/* Cell 3: Affiliate Pipeline Status Flags */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {order.affiliateStatus === 'verified_payout' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        )}
                        {order.affiliateStatus === 'pending_network_callback' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                            <Clock size={10} /> Callback Loop
                          </span>
                        )}
                        {order.affiliateStatus === 'disputed_by_partner' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md animate-pulse">
                            <AlertTriangle size={10} /> Disputed
                          </span>
                        )}
                        {order.affiliateStatus === 'conversion_failed' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                            <XCircle size={10} /> Dropped
                          </span>
                        )}
                      </td>

                      {/* Cell 4: Cost */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                        {order.orderTotal.toLocaleString()} <span className="text-[10px] text-slate-400">{order.currency}</span>
                      </td>

                      {/* Cell 5: Select Quick Trigger */}
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          type="button"
                          className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors font-medium bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded-md border border-slate-200"
                        >
                          Inspect
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle size={20} className="text-slate-300" />
                        <span>No historical transactions matched parameters.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: ADMINISTRATIVE CONFLICT INTERVENTION CONSOLE */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldAlert size={15} className="text-slate-900" />
            <h3 className="text-xs font-semibold text-slate-900">Conflict Resolution Panel</h3>
          </div>

          {selectedOrder ? (
            <div className="space-y-4 text-xs font-medium text-slate-700">
              
              {/* Context Summary Blocks */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">Active Node Token:</span>
                  <span className="font-mono text-slate-800 text-[11px]">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">Tracking Token Hook:</span>
                  <span className="font-mono text-slate-400 text-[10px] truncate max-w-[150px]" title={selectedOrder.trackingToken}>
                    {selectedOrder.trackingToken}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">Platform Baseline Origin:</span>
                  <span className="text-slate-600 text-[11px]">{selectedOrder.marketplaceOrigin}</span>
                </div>
              </div>

              {/* Conflict System Overrides */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Pipeline Control Interventions</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpdateAffiliateStatus(selectedOrder.id, 'verified_payout')}
                    className="p-2 text-center border border-slate-200 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors cursor-pointer text-[11px]"
                  >
                    Force Verify Payout
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateAffiliateStatus(selectedOrder.id, 'conversion_failed')}
                    className="p-2 text-center border border-slate-200 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors cursor-pointer text-[11px]"
                  >
                    Mark Failed Drop
                  </button>
                </div>
              </div>

              {/* Dynamic Resolution Logging Feed */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">System Trace & Incident Notes</label>
                <div className="p-3 bg-slate-900 text-slate-300 font-mono text-[11px] rounded-xl leading-relaxed">
                  {selectedOrder.resolutionNotes ? selectedOrder.resolutionNotes : "No validation failures logged for this lifecycle instance index."}
                </div>
              </div>

              {/* Append Memo Form */}
              <form onSubmit={handleAppendConflictMemo} className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Append Administrative Incident Logs</label>
                <textarea
                  value={adminConflictMemo}
                  onChange={(e) => setAdminConflictMemo(e.target.value)}
                  placeholder="Input specific partner tracking response reference details or validation log errors here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all h-20 resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium p-2 rounded-xl transition-colors text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send size={11} /> Commit Log Parameters
                </button>
              </form>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 font-medium flex flex-col items-center justify-center gap-2">
              <HelpCircle size={24} className="text-slate-200" />
              <p className="text-xs">Select a specific transaction node instance from the tracking directory to open conflict debugging controls.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}