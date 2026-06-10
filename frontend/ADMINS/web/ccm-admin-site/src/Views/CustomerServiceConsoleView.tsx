import React, { useState } from 'react';
import { 
  User, 
  Search, 
  Phone, 
  ShieldCheck, 
  ShoppingCart, 
  ShoppingBag, 
  Bell, 
  CornerDownRight, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  Send,
  Ticket,
  HelpCircle,
  Eye,
  Undo2,
  Play
} from 'lucide-react';

// Unified interfaces representing a complete 360 customer profile pull
interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  countryNode: 'KE' | 'UG' | 'TZ';
  status: 'active' | 'flagged' | 'suspended';
  joinedDate: string;
}

interface CustomerActiveCartItem {
  id: string;
  title: string;
  marketplace: string;
  priceLocal: number;
  currency: string;
  isAvailableInCache: boolean;
}

interface CustomerOrderHistory {
  id: string;
  itemTitle: string;
  totalCost: number;
  currency: string;
  status: 'verified_payout' | 'pending_network_callback' | 'disputed_by_partner' | 'conversion_failed';
  trackingToken: string;
  timestamp: string;
}

interface CustomerDealAlert {
  keyword: string;
  category: string;
  frequency: string;
  isTriggered: boolean;
}

export default function CustomerServiceConsoleView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isPiiRevealed, setIsPiiRevealed] = useState(false);
  const [ticketMemo, setTicketMemo] = useState('');

  // Loaded Active Session Target Context State (Simulated live lookup match)
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [cartItems, setCartItems] = useState<CustomerActiveCartItem[]>([]);
  const [orders, setOrders] = useState<CustomerOrderHistory[]>([]);
  const [alerts, setAlerts] = useState<CustomerDealAlert[]>([]);

  // Simulate a live unified search pipeline matching phone or email strings
  const handleExecuteSupportLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setIsPiiRevealed(false); // Reset reveal flag for safety on new lookup

      // Populate mock unified customer record payload
      setCustomer({
        id: "USR-9912-KE",
        fullName: "John Kamau Mwangi",
        email: "kamau.j.mwangi@outlook.com",
        phone: "+254 712 345 678",
        countryNode: "KE",
        status: "active",
        joinedDate: "2026-01-14"
      });

      setCartItems([
        { id: "SKU-JM-7741", title: "Air Max Alpha Trainer 5 - Black/White", marketplace: "Jumia Kenya", priceLocal: 6200, currency: "KES", isAvailableInCache: true },
        { id: "SKU-KM-9012", title: "Ergonomic Dumbbell Set 20KG", marketplace: "Kilimall", priceLocal: 4200, currency: "KES", isAvailableInCache: false }
      ]);

      setOrders([
        { id: "ORD-2026-3391", itemTitle: "Resistance Band Multi-Pack High Tension", totalCost: 1450, currency: "KES", status: "pending_network_callback", trackingToken: "st_tok_774112_aff_kli", timestamp: "2026-06-10 08:45" },
        { id: "ORD-2026-0104", itemTitle: "Ultraboost Light Running Shoes", totalCost: 18500, currency: "KES", status: "verified_payout", trackingToken: "st_tok_110492_aff_jum", timestamp: "2026-05-18 14:22" }
      ]);

      setAlerts([
        { keyword: "Adjustable Bench Press Units", category: "Gym Equipments", frequency: "Immediate", isTriggered: true }
      ]);
    }, 600);
  };

  // Immediate Action Overrides
  const triggerManualScraperReRun = (itemId: string) => {
    alert(`Administrative Command Sent: Triggering high-priority spider worker instance target parsing for ${itemId}.`);
  };

  const forceVerifyOrderStatus = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'verified_payout' } : o));
    alert(`Administrative Overrides: Order tracking status updated to Verified Payout context.`);
  };

  const handleCommitSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMemo.trim()) return;
    alert(`Incident Note Appended Successfully: "${ticketMemo}" committed to account system history logs.`);
    setTicketMemo('');
  };

  return (
    <div className="space-y-6 animate-fadeIn p-0.5">
      
      {/* DIRECT INCOMING CALL LOOKUP PANEL */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <Phone size={16} className="text-blue-600 animate-pulse" />
            Live Customer Support Workspace
          </h2>
          <p className="text-xs text-slate-400">
            Verify identity keys instantly upon incoming calls. Pull items, fix tracking token drops, and trigger back-end scrapers on the fly.
          </p>
        </div>

        <form onSubmit={handleExecuteSupportLookup} className="flex gap-2 max-w-2xl">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter customer's phone line, account email, or profile identifier..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {isSearching ? <RefreshCw size={13} className="animate-spin" /> : "Fetch Unified Profile"}
          </button>
        </form>
      </div>

      {customer ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* COLUMN ONE: 360 PROFILE SUMMARY & QUICK SYSTEM SETTINGS CONTROLS */}
          <div className="space-y-6">
            
            {/* Customer Core Details Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-semibold text-xs">
                    {customer.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">{customer.fullName}</h3>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{customer.id}</span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                  <CheckCircle2 size={10} /> Profile Clear
                </span>
              </div>

              {/* Masked Sensitive Identity Field Matrix */}
              <div className="space-y-2 text-xs font-medium text-slate-700">
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Communication Email</span>
                    <span className="font-mono text-slate-800 text-[11px]">
                      {isPiiRevealed ? customer.email : "kamau.********@outlook.com"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPiiRevealed(!isPiiRevealed)}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Audit Traceable Reveal Tool"
                  >
                    <Eye size={12} />
                  </button>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Mobile Registry Line</span>
                    <span className="font-mono text-slate-800 text-[11px]">
                      {isPiiRevealed ? customer.phone : "+254 71* *** *78"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Regional Cluster</span>
                    <span className="text-slate-800">{customer.countryNode} Environment</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Registration Mark</span>
                    <span className="text-slate-800">{customer.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Support Core Interventions Override Button Actions */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomer(prev => prev ? { ...prev, status: 'suspended' } : null)}
                  className="w-full py-1.5 border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-[11px] rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Ban size={11} /> Freeze Account
                </button>
              </div>
            </div>

            {/* Smart Deal Alert Tracking Profiles */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Bell size={13} className="text-blue-500" /> Active Tracking Price Alerts
              </h4>
              <div className="divide-y divide-slate-100">
                {alerts.map((alert, i) => (
                  <div key={i} className="py-2 first:pt-0 last:pb-0 flex items-start justify-between text-xs font-medium">
                    <div>
                      <p className="text-slate-800 tracking-tight">{alert.keyword}</p>
                      <span className="text-[10px] text-slate-400">{alert.category} • Checking {alert.frequency}</span>
                    </div>
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-sm">
                      Triggered
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLUMN TWO & THREE: CENTRAL ACTIVITY TILES (LIVE SHOPPING CARTS & INTERVENTION LOGS) */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Real-time Abandoned Cart Content Verification Tool */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <ShoppingCart size={14} className="text-slate-700" /> 
                Live Abandoned Shopping Cart Content Items
              </h4>
              
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 text-xs font-medium"
                  >
                    <div className="space-y-0.5">
                      <p className="text-slate-800 font-semibold">{item.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="font-mono uppercase">{item.id}</span>
                        <span>•</span>
                        <span>Source Marketplace: {item.marketplace}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                      <span className="font-mono text-slate-900 font-semibold">{item.priceLocal.toLocaleString()} {item.currency}</span>
                      
                      {/* Critical Action: If client claims deal is missing or expired, support can push a worker reload */}
                      <button
                        type="button"
                        onClick={() => triggerManualScraperReRun(item.id)}
                        className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white rounded-lg shadow-2xs transition-all text-[11px] flex items-center gap-1 cursor-pointer"
                        title="Force high priority re-parse validation step"
                      >
                        <Play size={10} /> Force Re-Scrape
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Conversions Ledger History Tracking */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <ShoppingBag size={14} className="text-slate-700" /> Affiliate Purchases & Conversion Status
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-medium text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4">Order Node</th>
                      <th className="py-2.5 px-4">Target Item Descriptive</th>
                      <th className="py-2.5 px-4">Network State</th>
                      <th className="py-2.5 px-4 text-right">Operational Commands</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <span className="text-slate-900 block">{order.id}</span>
                          <span className="text-[10px] text-slate-400 font-normal block">{order.timestamp}</span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-slate-800 font-semibold truncate max-w-[180px]" title={order.itemTitle}>
                            {order.itemTitle}
                          </p>
                          <span className="text-[10px] text-slate-400 block font-mono truncate max-w-[150px]">{order.trackingToken}</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {order.status === 'verified_payout' && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-sm font-medium">Verified</span>
                          )}
                          {order.status === 'pending_network_callback' && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-sm font-medium animate-pulse">Callback Loop Drop</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {order.status !== 'verified_payout' && (
                            <button
                              type="button"
                              onClick={() => forceVerifyOrderStatus(order.id)}
                              className="text-[11px] text-blue-600 hover:text-blue-800 bg-slate-50 hover:bg-blue-50 px-2 py-0.5 rounded-md border border-slate-200 transition-colors cursor-pointer"
                            >
                              Force Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Ticket Resolution Logging Memo Pad */}
            <form onSubmit={handleCommitSupportTicket} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Ticket size={14} className="text-slate-700" /> Call Resolution Memo Pad
              </h4>
              <textarea
                value={ticketMemo}
                onChange={(e) => setTicketMemo(e.target.value)}
                placeholder="Log internal summary items regarding this caller's query profile parameters (e.g., 'Resolved Jumia cache tracking pixel drop issue during call')..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all h-20 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-1.5 rounded-xl transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={11} /> Commit Call Incident Log
                </button>
              </div>
            </form>

          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400 font-medium flex flex-col items-center justify-center gap-2 shadow-2xs">
          <HelpCircle size={28} className="text-slate-200" />
          <p className="text-sm">Workspace Standing Idle.</p>
          <p className="text-xs text-slate-400 max-w-md font-normal">
            Input an authenticated customer phone line identifier or database record tag above to launch the unified real-time support console framework.
          </p>
        </div>
      )}

    </div>
  );
}