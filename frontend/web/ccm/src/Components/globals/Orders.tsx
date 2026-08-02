import React, { useState } from 'react';
import { 
  Package, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  X, 
  ChevronLeft, 
  Calendar, 
  MapPin 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: 'In Transit' | 'Delivered' | 'Cancelled';
  total: number;
  vendor: string;
  deliveryAddress: string;
  items: OrderItem[];
  runner: string;
}

interface UserOrdersProps {
  onBackToChat: () => void;
}

export function UserOrders({ onBackToChat }: UserOrdersProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isNavMinimized, setIsNavMinimized] = useState<boolean>(true);

  // Mock Orders Data aligned with Soko AI's micro-vendor commerce flow
  const [orders] = useState<Order[]>([
    {
      id: 'SOKO-8492',
      date: '2026-07-28 14:32',
      status: 'In Transit',
      total: 1450,
      vendor: 'Mama Mboga Fresh Produce',
      deliveryAddress: 'Kilimani, Greenfields Apt 4B',
      items: [
        { name: 'Fresh Sukuma Wiki (1 Bundle)', qty: 3, price: 50 },
        { name: 'Red Tomatoes (1kg)', qty: 2, price: 180 },
        { name: 'Grade A Eggs (Crate)', qty: 1, price: 480 },
        { name: 'Fresh Avocado', qty: 4, price: 50 }
      ],
      runner: 'Juma K. (Runner #4)'
    },
    {
      id: 'SOKO-8410',
      date: '2026-07-25 09:15',
      status: 'Delivered',
      total: 820,
      vendor: 'Kibichu Cereals Store',
      deliveryAddress: 'Kilimani, Greenfields Apt 4B',
      items: [
        { name: 'Unga wa Dola (2kg)', qty: 1, price: 220 },
        { name: 'Kabras Sugar (2kg)', qty: 1, price: 300 },
        { name: 'Blue Band Margarine (500g)', qty: 1, price: 300 }
      ],
      runner: 'Brian M. (Runner #2)'
    },
    {
      id: 'SOKO-8395',
      date: '2026-07-20 18:40',
      status: 'Cancelled',
      total: 350,
      vendor: 'Amina Spice Kiosk',
      deliveryAddress: 'Kilimani, Greenfields Apt 4B',
      items: [
        { name: 'Ndengu (1kg)', qty: 1, price: 250 },
        { name: 'Dhania Bunch', qty: 2, price: 50 }
      ],
      runner: 'None'
    }
  ]);

  const tabs = [
    { id: 'all', label: 'All Orders', icon: Package, count: orders.length },
    { id: 'transit', label: 'In Transit', icon: Truck, count: orders.filter(o => o.status === 'In Transit').length },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2, count: orders.filter(o => o.status === 'Delivered').length },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle, count: orders.filter(o => o.status === 'Cancelled').length }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'transit' ? order.status === 'In Transit' :
      activeTab === 'delivered' ? order.status === 'Delivered' :
      activeTab === 'cancelled' ? order.status === 'Cancelled' : true;

    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-0 animate-in fade-in duration-200">
      <div className="w-full h-full md:max-w-full md:h-[100vh] bg-[#F8FAFC] text-slate-800 font-sans flex flex-col md:flex-row relative rounded-none shadow-2xl overflow-hidden">
        
        {/* LEFT NAV SIDEBAR (Hidden on Mobile, Visible on Tablet/Desktop) */}
        <div 
          className={`hidden md:flex bg-[#191a1a] text-slate-300 flex-col justify-between shrink-0 border-r border-slate-800 transition-all duration-300 ease-in-out ${
            isNavMinimized ? 'md:w-16' : 'md:w-64'
          }`}
        >
          <div>
            {/* Header with Toggle */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg shrink-0">
                  <Package size={18} className="text-indigo-400" />
                </div>
                {!isNavMinimized && (
                  <span className="font-semibold text-white tracking-wide text-sm whitespace-nowrap">
                    Orders 
                  </span>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setIsNavMinimized(!isNavMinimized)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isNavMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
              >
                {isNavMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            {/* Navigation Menu */}
            <div className="p-3 space-y-6 w-full">
              <div>
                {!isNavMinimized && (
                  <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Filters
                  </p>
                )}
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        title={isNavMinimized ? tab.label : undefined}
                        className={`w-full flex items-center ${
                          isNavMinimized ? 'justify-center py-3' : 'justify-between px-3 py-2.5'
                        } rounded-xl text-xs font-medium transition-all duration-150 relative ${
                          isActive 
                            ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/50' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? 'text-indigo-400 shrink-0' : 'text-slate-400 shrink-0'} />
                          {!isNavMinimized && <span className="whitespace-nowrap">{tab.label}</span>}
                        </div>
                        {!isNavMinimized && tab.count > 0 && (
                          <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 font-mono rounded-full">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer / Back Action */}
          <div className="p-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onBackToChat}
              title={isNavMinimized ? "Back to Chat" : undefined}
              className={`w-full flex items-center ${
                isNavMinimized ? 'justify-center py-2.5' : 'justify-center gap-2 px-4 py-2.5'
              } rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-all`}
            >
              <ArrowLeft size={16} className="shrink-0" />
              {!isNavMinimized && <span className="whitespace-nowrap">Back to Chat</span>}
            </button>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
          
          {/* Top Header Bar */}
          <div className="h-16 px-4 sm:px-8 bg-[#191a1a] border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToChat}
                className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 border border-slate-700/60"
                title="Back"
              >
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-lg font-semibold text-slate-50 hidden md:inline ">Orders</h1>
            </div>

            {/* Search Box & Mobile Close */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg w-40 sm:w-48 md:w-64 focus-within:border-slate-400 transition-all">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Horizontal Navigation Tabs (Mobile Only) */}
          <div className="bg-white px-4 sm:px-8 border-b border-slate-200/80 flex items-center gap-6 overflow-x-auto shrink-0 md:hidden no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive 
                      ? 'border-slate-900 text-slate-900 font-semibold' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-700 font-mono rounded">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dashboard Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto space-y-4">
              
              {filteredOrders.length > 0 ? (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    const statusColor = 
                      order.status === 'In Transit' ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' :
                      order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' :
                      'bg-rose-500/10 text-rose-700 border-rose-500/20';

                    return (
                      <div 
                        key={order.id}
                        onClick={() => setSelectedOrder(isSelected ? null : order)}
                        className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm transition-all cursor-pointer ${
                          isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          {/* Order Metadata */}
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-mono font-semibold shrink-0">
                              <Package size={20} className="text-slate-500" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-semibold text-sm text-slate-900">{order.id}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor}`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-slate-700">{order.vendor}</p>
                              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-slate-400 pt-1">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {order.date}</span>
                                <span className="flex items-center gap-1"><MapPin size={12} /> {order.deliveryAddress}</span>
                              </div>
                            </div>
                          </div>

                          {/* Total & Action */}
                          <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                            <div className="text-left md:text-right">
                              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Total Amount</p>
                              <p className="font-mono font-semibold text-sm text-slate-900 mt-0.5">KES {order.total.toLocaleString()}</p>
                            </div>
                            <button 
                              type="button"
                              className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <ChevronRight size={16} className={`transition-transform duration-200 ${isSelected ? 'rotate-90' : ''}`} />
                            </button>
                          </div>

                        </div>

                        {/* Expanded Order Items view */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div 
                              key="order-items"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-slate-100 space-y-3 overflow-hidden"
                            >
                              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Items in this Order</h4>
                              <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-200/60">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs">
                                    <span className="text-slate-700 font-medium">
                                      {item.name} <span className="text-slate-400 font-mono">x{item.qty}</span>
                                    </span>
                                    <span className="font-mono text-slate-900">
                                      KES {(item.price * item.qty).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-center text-xs px-1 text-slate-500">
                                <span>Assigned Runner: <strong className="text-slate-800">{order.runner}</strong></span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 bg-white rounded-2xl border border-slate-200/80">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <Package size={24} className="text-slate-400" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">No orders match your current filter</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
