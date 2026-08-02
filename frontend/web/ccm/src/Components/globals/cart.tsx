import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  Bookmark,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UserCart({ onBackToChat }) {
  const [activeTab, setActiveTab] = useState('active');
  const [isNavMinimized, setIsNavMinimized] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Cart items grouped by neighborhood micro-vendors (Soko AI context)
  const [cartItems, setCartItems] = useState([
    {
      id: 'item-1',
      vendor: 'Mama Mboga Fresh Produce',
      name: 'Fresh Sukuma Wiki (1 Bundle)',
      price: 50,
      qty: 3,
      category: 'Vegetables'
    },
    {
      id: 'item-2',
      vendor: 'Mama Mboga Fresh Produce',
      name: 'Red Tomatoes (1kg)',
      price: 180,
      qty: 2,
      category: 'Vegetables'
    },
    {
      id: 'item-3',
      vendor: 'Kibichu Cereals Store',
      name: 'Unga wa Dola (2kg)',
      price: 220,
      qty: 1,
      category: 'Mill & Grain'
    }
  ]);

  const [savedItems, setSavedItems] = useState([]);

  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id, fromSaved = false) => {
    if (fromSaved) {
      setSavedItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const moveToSaved = (item) => {
    setCartItems((prev) => prev.filter((i) => i.id !== item.id));
    setSavedItems((prev) => [...prev, item]);
  };

  const moveToCart = (item) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== item.id));
    setCartItems((prev) => [...prev, item]);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = subtotal > 0 ? 100 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderPlaced(true);
      setCartItems([]);
    }, 1200);
  };

  const tabs = [
    { id: 'active', label: 'Active Cart', icon: ShoppingCart, count: cartItems.length },
    { id: 'saved', label: 'Saved for Later', icon: Bookmark, count: savedItems.length }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      <div className="w-full h-full md:max-w-full md:h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col md:flex-row relative shadow-2xl overflow-hidden">
        
        {/* LEFT NAV SIDEBAR */}
        <div
          className={`flex flex-col justify-between border-r border-slate-800 bg-slate-900 p-3 md:px-0 select-none transition-all duration-300 ease-in-out w-full md:static ${
            isNavMinimized ? 'md:w-20' : 'md:w-64'
          }`}
        >
          <div>
            {/* Header with Toggle */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl shrink-0">
                  <ShoppingCart size={18} className="text-indigo-400" />
                </div>
                {!isNavMinimized && (
                  <span className="font-semibold text-white tracking-wide text-sm whitespace-nowrap">
                    Soko Basket
                  </span>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setIsNavMinimized(!isNavMinimized)}
                className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isNavMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
              >
                {isNavMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            {/* Navigation Menu */}
            <div className="p-3 space-y-6 hidden md:block w-full">
              <div>
                {!isNavMinimized && (
                  <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Baskets
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
                        } rounded-xl text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? 'text-white bg-slate-800 shadow-sm font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className={isActive ? 'text-indigo-400 shrink-0' : 'text-slate-400 shrink-0'}
                          />
                          {!isNavMinimized && <span className="whitespace-nowrap">{tab.label}</span>}
                        </div>
                        {!isNavMinimized && tab.count > 0 && (
                          <span className="px-2 py-0.5 text-[10px] bg-slate-700 text-slate-200 font-mono rounded-full">
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
          <div className="p-3 border-t border-slate-800">
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
          <div className="h-16 px-6 md:px-8 bg-white flex items-center justify-between shrink-0 border-b border-slate-200">
            <div>
              <h1 className="text-base font-semibold text-slate-900">
                {activeTab === 'active' ? 'Active Cart' : 'Saved for Later'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 font-mono">
                {activeTab === 'active'
                  ? `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} selected`
                  : `${savedItems.length} ${savedItems.length === 1 ? 'item' : 'items'} saved`}
              </span>

              <button
                type="button"
                onClick={onBackToChat}
                className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Navigation Tabs (Mobile Only) */}
          <div className="bg-white px-6 border-b border-slate-200 flex items-center gap-6 overflow-x-auto shrink-0 md:hidden">
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
                  {tab.count > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-700 rounded-full font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dashboard Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              
              {orderPlaced ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      Order Dispatched Successfully!
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Your micro-vendor cart has been routed to nearby runners. Expect an M-Pesa prompt and runner confirmation shortly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderPlaced(false);
                      onBackToChat();
                    }}
                    className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all"
                  >
                    Return to Chat Assistant
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT: Items List */}
                  <div className="lg:col-span-8 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {activeTab === 'active' ? (
                        cartItems.length > 0 ? (
                          <div className="space-y-3">
                            {cartItems.map((item) => (
                              <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 font-mono font-semibold shrink-0">
                                    <ShoppingBag size={20} />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                      {item.vendor}
                                    </span>
                                    <h4 className="font-medium text-xs text-slate-900 pt-1">
                                      {item.name}
                                    </h4>
                                    <p className="font-mono font-semibold text-xs text-slate-700">
                                      KES {item.price.toLocaleString()}{' '}
                                      <span className="text-[10px] text-slate-400 font-normal">
                                        per unit
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                {/* Controls & Total */}
                                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-1">
                                    <button
                                      type="button"
                                      onClick={() => updateQty(item.id, -1)}
                                      className="p-1 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 transition-colors"
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className="font-mono text-xs font-semibold px-2 text-slate-800">
                                      {item.qty}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => updateQty(item.id, 1)}
                                      className="p-1 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 transition-colors"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>

                                  <div className="text-right min-w-[80px]">
                                    <span className="font-mono font-semibold text-xs text-slate-900">
                                      KES {(item.price * item.qty).toLocaleString()}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => moveToSaved(item)}
                                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                      title="Save for later"
                                    >
                                      <Bookmark size={16} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeItem(item.id)}
                                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                      title="Remove item"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 bg-white rounded-2xl border border-slate-200/80">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                              <ShoppingCart size={24} className="text-slate-400" />
                            </div>
                            <p className="text-xs font-medium text-slate-500">
                              Your active cart is empty
                            </p>
                            <button
                              type="button"
                              onClick={onBackToChat}
                              className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-xl hover:bg-slate-800 transition-all"
                            >
                              Explore Vendors & Items
                            </button>
                          </div>
                        )
                      ) : savedItems.length > 0 ? (
                        <div className="space-y-3">
                          {savedItems.map((item) => (
                            <motion.div
                              key={item.id}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-mono font-semibold shrink-0">
                                  <Bookmark size={20} />
                                </div>
                                <div className="space-y-1">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                    {item.vendor}
                                  </span>
                                  <h4 className="font-medium text-xs text-slate-900 pt-1">
                                    {item.name}
                                  </h4>
                                  <p className="font-mono font-semibold text-xs text-slate-700">
                                    KES {item.price.toLocaleString()}{' '}
                                    <span className="text-[10px] text-slate-400 font-normal">
                                      per unit
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => moveToCart(item)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-medium transition-colors"
                                >
                                  <span>Move to Cart</span>
                                  <ArrowUpRight size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id, true)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 bg-white rounded-2xl border border-slate-200/80">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                            <Bookmark size={24} className="text-slate-400" />
                          </div>
                          <p className="text-xs font-medium text-slate-500">
                            No items saved for later
                          </p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* RIGHT: Summary & Checkout Card */}
                  <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-600">
                        <Truck size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                          Order Summary
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Micro-logistics & Dispatch
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs pb-4 border-b border-slate-100">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal</span>
                        <span className="font-mono font-medium text-slate-900">
                          KES {subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Runner Delivery Fee</span>
                        <span className="font-mono font-medium text-slate-900">
                          KES {deliveryFee.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                        <MapPin size={12} /> Delivery to Kilimani, Greenfields Apt 4B
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                        Total
                      </span>
                      <span className="font-mono font-bold text-base text-slate-900">
                        KES {total.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={cartItems.length === 0 || isCheckingOut}
                      onClick={handleCheckout}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-medium rounded-xl shadow-sm transition-all active:scale-95"
                    >
                      {isCheckingOut ? (
                        <>
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          <span>Processing M-Pesa...</span>
                        </>
                      ) : (
                        <>
                          <span>Proceed to M-Pesa Checkout</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-2">
                      <ShieldCheck size={14} className="text-emerald-600" /> Secure local vendor
                      transaction
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
