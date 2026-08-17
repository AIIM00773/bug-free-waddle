import React, { useState, useMemo } from 'react';
import { 
  Package, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  Phone, 
  RotateCcw, 
  User, 
  Store,
  X,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ccmLogo from '../../assets/ccmlogo1.png'

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export type OrderStatus = 'In Transit' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  vendor: string;
  deliveryAddress: string;
  items: OrderItem[];
  runner: string;
  runnerPhone?: string;
}

export interface UserOrdersProps {
  onBackToChat: () => void;
  onReorder?: (order: Order) => void;
}

export function UserOrders({ onBackToChat, onReorder }: UserOrdersProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('SOKO-8492');
  const [isNavMinimized, setIsNavMinimized] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

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
      runner: 'Juma K. (Runner #4)',
      runnerPhone: '+254 712 345 678'
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
      runner: 'Brian M. (Runner #2)',
      runnerPhone: '+254 722 987 654'
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
      runner: 'Unassigned'
    }
  ]);

  const tabs = useMemo(() => [
    { id: 'all', label: 'All Orders', icon: Package, count: orders.length },
    { id: 'transit', label: 'In Transit', icon: Truck, count: orders.filter(o => o.status === 'In Transit').length },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2, count: orders.filter(o => o.status === 'Delivered').length },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle, count: orders.filter(o => o.status === 'Cancelled').length }
  ], [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = 
        activeTab === 'all' ? true :
        activeTab === 'transit' ? order.status === 'In Transit' :
        activeTab === 'delivered' ? order.status === 'Delivered' :
        activeTab === 'cancelled' ? order.status === 'Cancelled' : true;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        order.id.toLowerCase().includes(query) ||
        order.vendor.toLowerCase().includes(query) ||
        order.items.some(i => i.name.toLowerCase().includes(query));

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2400);
  };

  const copyOrderId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    showToast(`Order ID ${id} copied`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            In Transit
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 size={12} />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
            <XCircle size={12} />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-0 animate-in fade-in duration-200">
      <div className="w-full h-full bg-gray-50 text-gray-900 font-sans relative shadow-2xl  flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-orange-500/20 bg-gradient-to-r from-orange-500 to-amber-500 px-4 sm:px-6 sm:pl-0  shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToChat}
              className="rounded-xl bg-white/10 border border-white/20 p-2 text-white/90 transition-colors hover:bg-white/20 hover:text-white active:scale-95 sm:hidden"
              title="Back"
              aria-label="Back to chat"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="gap-2.5 hidden md:flex items-center ">
             <div className="">
              <img src={ccmLogo} className="text-white"  height={70} width={70} />
            </div>
            
              <div className=" gap-2 flex items-center ">
            
                <span className="text-xs font-semibold text-white/95">
                 Orders
                </span>
                
              </div>
            </div>
          </div>

          {/* Top Right Actions & Search */}
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {notification && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gray-900/80 border border-gray-700/60 px-3 py-1 font-mono text-xs font-medium text-white shadow-md backdrop-blur-sm"
                >
                  <Check size={13} className="text-emerald-400" /> {notification}
                </motion.span>
              )}
            </AnimatePresence>

            <div className="relative flex items-center w-44 sm:w-64 md:w-72">
              <Search size={14} className="absolute left-3.5 text-gray-400 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search orders, vendors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-white/95 border border-white/40 rounded-xl text-xs text-gray-900 outline-none placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-white/30 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

          </div>
        </header>

        {/* Main Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-gray-50">
          
          {/* LEFT NAV SIDEBAR (Desktop) */}
          <aside 
            aria-label="Order filters"
            className={`hidden md:flex flex-col justify-between shrink-0 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${
              isNavMinimized ? 'w-16' : 'w-64'
            }`}
          >
            <div>
              <div className="h-16 px-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded-xl shrink-0">
                    <Package size={18} className="text-orange-600" />
                  </div>
                  {!isNavMinimized && (
                    <span className="font-bold text-gray-900 tracking-wide text-sm whitespace-nowrap">
                      Orders Portal
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsNavMinimized(!isNavMinimized)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                  title={isNavMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
                  aria-label={isNavMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
                >
                  {isNavMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              </div>

              {/* Desktop Filters */}
              <div className="p-3 space-y-6 w-full" role="tablist">
                <div>
                  {!isNavMinimized && (
                    <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Filter by Status
                    </p>
                  )}
                  <div className="space-y-1.5">
                    {tabs.map((tab) => {
                      const isActive = activeTab === tab.id;
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          role="tab"
                          aria-selected={isActive}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          title={isNavMinimized ? `${tab.label} (${tab.count})` : undefined}
                          className={`w-full flex items-center ${
                            isNavMinimized ? 'justify-center py-3' : 'justify-between px-3.5 py-3'
                          } rounded-xl text-xs font-medium transition-all duration-150 relative ${
                            isActive 
                              ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-2xs font-semibold' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} className={isActive ? 'text-orange-600 shrink-0' : 'text-gray-400 shrink-0'} />
                            {!isNavMinimized && <span className="whitespace-nowrap">{tab.label}</span>}
                          </div>
                          {!isNavMinimized && tab.count > 0 && (
                            <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${
                              isActive ? 'bg-orange-600 text-white font-bold' : 'bg-gray-100 text-gray-600'
                            }`}>
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
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Horizontal Swipeable Tabs (Mobile Only) */}
            <div 
              role="tablist"
              aria-label="Filter orders by status"
              className="bg-white px-4 border-b border-gray-200 flex items-center gap-6 overflow-x-auto shrink-0 md:hidden shadow-2xs scrollbar-none"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                      isActive 
                        ? 'border-orange-500 text-orange-600 font-semibold' 
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-700 font-mono rounded">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Orders List */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <div className="max-w-4xl mx-auto space-y-4">
                
                {filteredOrders.length > 0 ? (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => {
                      const isSelected = selectedOrderId === order.id;

                      return (
                        <article 
                          key={order.id}
                          aria-expanded={isSelected}
                          className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                            isSelected 
                              ? 'border-orange-500 ring-4 ring-orange-500/10 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300 shadow-xs'
                          }`}
                        >
                          {/* Card Header (Clickable Trigger) */}
                          <div 
                            onClick={() => setSelectedOrderId(isSelected ? null : order.id)}
                            className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                                <Store size={20} />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <span className="font-mono font-bold text-sm text-gray-900">{order.id}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => copyOrderId(e, order.id)}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                                    title="Copy Order ID"
                                  >
                                    <Copy size={12} />
                                  </button>
                                  {getStatusBadge(order.status)}
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">{order.vendor}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-0.5">
                                  <span className="flex items-center gap-1.5">
                                    <Calendar size={13} className="text-gray-400 shrink-0" /> 
                                    {order.date}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <MapPin size={13} className="text-gray-400 shrink-0" /> 
                                    {order.deliveryAddress}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Price & Expand Indicator */}
                            <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                              <div className="text-left md:text-right">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                  Settlement Total
                                </p>
                                <p className="font-mono font-bold text-sm text-gray-900 mt-0.5">
                                  KES {order.total.toLocaleString()}
                                </p>
                              </div>
                              <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-500">
                                <ChevronRight 
                                  size={16} 
                                  className={`transition-transform duration-200 ${isSelected ? 'rotate-90 text-orange-600' : ''}`} 
                                />
                              </div>
                            </div>
                          </div>

                          {/* Collapsible Order Details */}
                          <AnimatePresence initial={false}>
                            {isSelected && (
                              <motion.div 
                                key="order-items"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                              >
                                <div className="px-5 pb-5 pt-4 border-t border-gray-100 bg-gray-50/70 space-y-4">
                                  
                                  {/* Runner Banner */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-3.5 border border-gray-200 text-xs shadow-2xs">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                        <User size={15} />
                                      </div>
                                      <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                          Assigned Runner
                                        </p>
                                        <p className="font-semibold text-gray-800">{order.runner}</p>
                                      </div>
                                    </div>
                                    
                                    {order.runnerPhone && order.status === 'In Transit' && (
                                      <a
                                        href={`tel:${order.runnerPhone}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors shadow-xs"
                                      >
                                        <Phone size={13} />
                                        Call Runner
                                      </a>
                                    )}
                                  </div>

                                  {/* Items Breakdown */}
                                  <div className="space-y-2">
                                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">
                                      Bundle Contents
                                    </h4>
                                    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-2xs">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 text-xs">
                                          <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded bg-gray-100 font-mono text-[11px] font-semibold text-gray-700 flex items-center justify-center">
                                              {item.qty}x
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                              {item.name}
                                            </span>
                                          </div>
                                          <span className="font-mono font-semibold text-gray-900">
                                            KES {(item.price * item.qty).toLocaleString()}
                                          </span>
                                        </div>
                                      ))}
                                      <div className="flex justify-between items-center p-3 bg-gray-50/80 text-xs font-bold text-gray-900">
                                        <span>Total Paid via M-Pesa</span>
                                        <span className="font-mono text-sm text-orange-600">
                                          KES {order.total.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Order Quick Actions */}
                                  <div className="flex items-center justify-end gap-2 pt-1">
                                    {onReorder && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onReorder(order);
                                          showToast(`Bundle ${order.id} added to cart`);
                                        }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 hover:border-gray-400 text-gray-800 font-semibold text-xs transition-colors shadow-2xs active:scale-95"
                                      >
                                        <RotateCcw size={13} />
                                        Reorder Bundle
                                      </button>
                                    )}
                                  </div>

                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty state with clear reset path */
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-200 p-8 space-y-4 shadow-xs">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                      <Package size={26} />
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h3 className="text-sm font-bold text-gray-900">No matching orders</h3>
                      <p className="text-xs text-gray-500">
                        We could not find any orders matching your selected status filter or keyword search.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors active:scale-95"
                    >
                      Reset Filters & Search
                    </button>
                  </div>
                )}

              </div>
            </main>
          </div>

        </div>
      </div>
    </div>
  );
}
