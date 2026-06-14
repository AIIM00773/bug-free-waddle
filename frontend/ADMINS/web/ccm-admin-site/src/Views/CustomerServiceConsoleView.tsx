import React, { useState } from 'react';
import {
  Search,
  Phone,
  ShoppingCart,
  ShoppingBag,
  Bell,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Ban,
  Send,
  Ticket,
  HelpCircle,
  Eye,
  EyeOff,
  Play,
  UserX
} from 'lucide-react';
import { useCustomerSupport } from '../Providers.tsx/CustomerServiceContext';

export default function CustomerServiceConsoleView() {
  const {
    customer,
    cartItems,
    orders,
    alerts,
    isLoading,
    error,
    lookupCustomerProfile,
    freezeCustomerAccount,
    dispatchWorkerScraperJob,
    forceApproveOrderStatus,
    appendCallIncidentMemo,
    clearActiveSession
  } = useCustomerSupport();

  const [searchQuery, setSearchQuery] = useState('');
  const [isPiiRevealed, setIsPiiRevealed] = useState(false);
  const [ticketMemo, setTicketMemo] = useState('');

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsPiiRevealed(false); // Strict procedural reset for incoming profile audits
    await lookupCustomerProfile(searchQuery);
  };

  const handleScraperReRunClick = async (itemId: string) => {
    await dispatchWorkerScraperJob(itemId);
    alert(`Administrative Command Sent: Triggering high-priority spider worker instance target parsing for ${itemId}.`);
  };

  const handleForceApproveClick = async (orderId: string) => {
    await forceApproveOrderStatus(orderId);
    alert(`Administrative Overrides: Order tracking status updated to Verified Payout context.`);
  };

  const handleTicketFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMemo.trim()) return;
    await appendCallIncidentMemo(ticketMemo);
    alert(`Incident Note Appended Successfully: "${ticketMemo}" committed to account system history logs.`);
    setTicketMemo('');
  };

  return (
    <div className="space-y-6 animate-fadeIn p-1 text-slate-800 antialiased">

      {/* GLOBAL TELEMETRY LOOKUP INPUT GATEWAY */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Phone size={16} className="text-blue-600 animate-pulse shrink-0" />
            Live Customer Support Workspace Terminal
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Verify identity access signatures instantly upon incoming buyer queries. Inspect live abandoned baskets, fix missing payouts, and override scraper caching drops.
          </p>
        </div>

        <form onSubmit={handleLookupSubmit} className="flex gap-2.5 max-w-3xl">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search via customer phone number registry, profile ID hash string, or email address..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs disabled:opacity-40"
          >
            {isLoading ? <RefreshCw size={13} className="animate-spin" /> : "Fetch Unified Profile"}
          </button>
          {customer && (
            <button
              type="button"
              onClick={clearActiveSession}
              className="px-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-medium cursor-pointer transition-colors"
            >
              Clear Session
            </button>
          )}
        </form>
      </div>

      {/* ERROR HANDLER CONTEXT MATRIX BOARD */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-start gap-3 shadow-2xs">
          <AlertTriangle size={16} className="shrink-0 text-rose-500 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Internal API Lifecycle Failure</span>
            <p className="text-rose-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      {customer ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

          {/* LEFT-SIDEBAR COLUMN: 360 WORKSPACE METRICS PROFILE COMPLIANCE CONTROL PANEL */}
          <div className="space-y-6">

            {/* Profile Information View Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 font-bold text-xs shadow-3xs">
                    {customer.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{customer.fullName}</h3>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block mt-0.5">{customer.id}</span>
                  </div>
                </div>

                {customer.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                    <CheckCircle2 size={11} /> Profile Clear
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                    <UserX size={11} /> Locked Out
                  </span>
                )}
              </div>

              {/* Data Field Mask Matrix Block */}
              <div className="space-y-2.5 text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-center bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl shadow-3xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Verified Communication Email</span>
                    <span className="font-mono text-slate-800 text-[11px]">
                      {isPiiRevealed ? customer.email : "kamau.********@outlook.com"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPiiRevealed(!isPiiRevealed)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/40 transition-all cursor-pointer"
                    title="Audit Traceable Privacy Shield Guard Toggle"
                  >
                    {isPiiRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>

                <div className="flex justify-between items-center bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl shadow-3xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Mobile Handset Registry Line</span>
                    <span className="font-mono text-slate-800 text-[11px]">
                      {isPiiRevealed ? customer.phone : "+254 71* *** *78"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-semibold">
                  <div className="bg-slate-50/50 border border-slate-200/40 rounded-lg p-2">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Regional Node</span>
                    <span className="text-slate-700 font-bold block mt-0.5">{customer.countryNode} Environment</span>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-200/40 rounded-lg p-2">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Registration Timestamp</span>
                    <span className="text-slate-700 font-bold block mt-0.5">{customer.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Administrative Status Modification Action Overrides */}
              {customer.status === 'active' && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={freezeCustomerAccount}
                    className="w-full py-2 border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-[11px] rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Ban size={11} /> Force Account Freeze Override
                  </button>
                </div>
              )}
            </div>

            {/* Smart Deal Intent Tracker Profiles */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-2">
                <Bell size={13} className="text-blue-500 shrink-0" /> Real-time Price Alerts Telemetry
              </h4>
              <div className="divide-y divide-slate-100">
                {alerts.length > 0 ? alerts.map((alert, i) => (
                  <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between text-xs font-semibold">
                    <div className="space-y-0.5">
                      <p className="text-slate-800 font-bold tracking-tight">{alert.keyword}</p>
                      <span className="text-[10px] text-slate-400 block font-medium">{alert.category} • Polling Mode: {alert.frequency}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md shrink-0">
                      State Active
                    </span>
                  </div>
                )) : (
                  <p className="text-[11px] text-slate-400 font-medium py-2">No keywords registered under notification rules indicators.</p>
                )}
              </div>
            </div>

          </div>

          {/* MAIN DYNAMIC FEED COLUMNS SECTION WORKSPACE PANELS */}
          <div className="xl:col-span-2 space-y-6">

            {/* LIVE ABANDONED BASKET PARSING AGGREGATOR PANEL */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart size={14} className="text-slate-700 shrink-0" />
                Live Abandoned Shopping Cart Content Parameters
              </h4>

              <div className="space-y-2.5">
                {cartItems.length > 0 ? cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 text-xs font-semibold shadow-3xs"
                  >
                    <div className="space-y-1">
                      <p className="text-slate-800 font-bold">{item.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                        <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">{item.id}</span>
                        <span>•</span>
                        <span>Source Marketplace: <strong className="text-slate-600 font-bold">{item.marketplace}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="font-mono text-slate-900 font-bold text-[13px]">{item.priceLocal.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{item.currency}</span></span>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleScraperReRunClick(item.id)}
                        className="px-3 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white rounded-lg shadow-2xs transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                        title="Evict cached parameters and schedule real time crawling block"
                      >
                        <Play size={10} className="fill-current" /> Force Re-Scrape
                      </button>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 font-medium text-center py-6">No tracked checkout state parameters currently active inside local database.</p>
                )}
              </div>
            </div>

            {/* PURCHASES AFFILIATE CONVERSIONS DIRECTORY LEDGER */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-slate-700 shrink-0" /> Complete Purchase Tracking & Payout Ledger
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Order Entity Identity</th>
                      <th className="py-3 px-4">Conversion Target Item</th>
                      <th className="py-3 px-4">Network Node Status</th>
                      <th className="py-3 px-4 text-right">Workspace Direct Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {orders.length > 0 ? orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="text-slate-900 block font-bold text-[11px]">{order.id}</span>
                          <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{order.timestamp}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-slate-800 font-bold truncate max-w-[200px]" title={order.itemTitle}>
                            {order.itemTitle}
                          </p>
                          <span className="text-[10px] text-slate-400 block font-mono font-medium truncate max-w-[165px] mt-0.5">{order.trackingToken}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {order.status === 'verified_payout' ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">Verified</span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md animate-pulse">Callback Loop Drop</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {order.status !== 'verified_payout' && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleForceApproveClick(order.id)}
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-all cursor-pointer shadow-3xs disabled:opacity-40"
                            >
                              Force Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 font-semibold">No commercial transaction data recorded to this profile node index.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CALL RESOLUTION SYSTEM INCIDENT MEMO WRITER BOX */}
            <form onSubmit={handleTicketFormSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3.5">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Ticket size={14} className="text-slate-700 shrink-0" /> Account History Incident Log Entry Pad
              </h4>
              <textarea
                value={ticketMemo}
                onChange={(e) => setTicketMemo(e.target.value)}
                placeholder="Log definitive summaries for internal profiling parameters (e.g., 'Validated broken Kilimall affiliate cookies hook over phone line interaction. Manually flushed scraper queue caches...')"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all h-24 resize-none shadow-inner"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !ticketMemo.trim()}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-40"
                >
                  <Send size={12} /> Commit Call Incident Log
                </button>
              </div>
            </form>

          </div>

        </div>
      ) : (
        /* IDLE CONSOLE EMPTY FRAME LAYOUT */
        <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center text-slate-400 font-semibold flex flex-col items-center justify-center gap-2.5 shadow-2xs border-dashed">
          <HelpCircle size={32} className="text-slate-200 stroke-[1.5]" />
          <p className="text-sm text-slate-700 font-bold">Console Matrix Workspace Disconnected</p>
          <p className="text-xs text-slate-400 max-w-sm font-normal leading-relaxed mx-auto">
            Input a customer's verified platform line subscription identifier, account query email signature, or profile ID hash code inside the lookup node above to mount target variables.
          </p>
        </div>
      )}

    </div>
  );
}