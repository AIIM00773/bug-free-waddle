

import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Lock, 
  ShieldCheck, 
  Truck, 
  Loader2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UserCheckout({ onBackToChat }) {
  const [activeTab, setActiveTab] = useState('payment');
  const [isNavMinimized, setIsNavMinimized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    phoneNumber: '+254 712 345 678',
    paymentMethod: 'mpesa',
    deliveryAddress: 'Kilimani, Greenfields Apt 4B, Nairobi',
    deliveryInstructions: 'Call upon arrival at the main gate security.',
    saveDetails: true
  });

  const cartSummary = {
    itemsCount: 3,
    subtotal: 910,
    deliveryFee: 100,
    total: 1010
  };

  const handleInputChange = (field, value) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
    }, 1500);
  };

  const tabs = [
    { id: 'payment', label: 'Payment & M-Pesa', icon: Smartphone },
    { id: 'delivery', label: 'Delivery Location', icon: MapPin },
    { id: 'review', label: 'Final Review', icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-0 animate-in fade-in duration-200">
      <div className="w-full h-full md:max-w-full md:h-[100vh] bg-[#F8FAFC] text-slate-800 font-sans flex flex-col md:flex-row relative rounded-none shadow-2xl overflow-hidden">
        
        {/* LEFT NAV SIDEBAR */}
        <div 
          className={`bg-[#0B131D] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 transition-all duration-300 ease-in-out ${
            isNavMinimized ? 'md:w-15' : 'md:w-64'
          } w-full`}
        >
          <div>
            {/* Header with Toggle */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg shrink-0">
                  <CreditCard size={18} className="text-indigo-400" />
                </div>
                {!isNavMinimized && (
                  <span className="font-semibold text-white tracking-wide text-sm whitespace-nowrap">
                    Checkout
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
            <div className="p-3 space-y-6 hidden md:inline-block w-full">
              <div>
                {!isNavMinimized && (
                  <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Steps
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
          <div className="h-16 px-8 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Checkout</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-emerald-600 font-mono font-medium flex items-center gap-1">
                <Lock size={12} /> Encrypted Gateway
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

          {/* Horizontal Navigation Tabs (Mobile & Overflow) */}
          <div className="bg-white px-8 border-b border-slate-200/80 flex items-center gap-6 overflow-x-auto shrink-0 md:hidden">
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
                </button>
              );
            })}
          </div>

          {/* Dashboard Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              
              {orderComplete ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-200/80 p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900">Payment Confirmed & Order Placed!</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      M-Pesa STK push completed successfully. Neighborhood micro-vendors and dispatch runners have received your packing slip.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onBackToChat}
                    className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all"
                  >
                    Return to Chat Assistant
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT: Checkout Form Steps */}
                  <div className="lg:col-span-8 space-y-6">
                    <form onSubmit={handleCompleteOrder}>
                      <AnimatePresence mode="wait">
                        
                        {/* STEP 1: PAYMENT & M-PESA */}
                        {activeTab === 'payment' && (
                          <motion.div 
                            key="payment"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6"
                          >
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                              <div>
                                <h3 className="text-sm font-semibold text-slate-900">Payment Method</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Select your preferred micro-commerce settlement channel</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div 
                                onClick={() => handleInputChange('paymentMethod', 'mpesa')}
                                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                                  checkoutData.paymentMethod === 'mpesa' 
                                    ? 'border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/10' 
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                                  <Smartphone size={18} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-slate-900">M-Pesa Express</h4>
                                  <p className="text-[11px] text-slate-500">Instant STK Push</p>
                                </div>
                              </div>

                              <div 
                                onClick={() => handleInputChange('paymentMethod', 'cash')}
                                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                                  checkoutData.paymentMethod === 'cash' 
                                    ? 'border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/10' 
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                                  <Truck size={18} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-slate-900">Pay on Delivery</h4>
                                  <p className="text-[11px] text-slate-500">Runner collection</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                M-Pesa Phone Number
                              </label>
                              <div className="flex items-center px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus-within:border-slate-400 transition-all">
                                <Smartphone size={16} className="text-slate-400 mr-2.5 shrink-0" />
                                <input 
                                  type="text" 
                                  value={checkoutData.phoneNumber}
                                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                  className="w-full bg-transparent text-xs font-mono font-medium text-slate-900 outline-none"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 2: DELIVERY LOCATION */}
                        {activeTab === 'delivery' && (
                          <motion.div 
                            key="delivery"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6"
                          >
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                              <div>
                                <h3 className="text-sm font-semibold text-slate-900">Delivery Address</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Hyper-local runner coordinate destination</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                  Address / Apartment
                                </label>
                                <div className="flex items-center px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus-within:border-slate-400 transition-all">
                                  <MapPin size={16} className="text-slate-400 mr-2.5 shrink-0" />
                                  <input 
                                    type="text" 
                                    value={checkoutData.deliveryAddress}
                                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                                    className="w-full bg-transparent text-xs font-medium text-slate-900 outline-none"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                  Runner Instructions
                                </label>
                                <textarea 
                                  rows={3}
                                  value={checkoutData.deliveryInstructions}
                                  onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                                  className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-slate-400 transition-all resize-none"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 3: FINAL REVIEW */}
                        {activeTab === 'review' && (
                          <motion.div 
                            key="review"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6"
                          >
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                              <div>
                                <h3 className="text-sm font-semibold text-slate-900">Review & Authorize</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Verify your checkout preferences before dispatch</p>
                              </div>
                            </div>

                            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Payment Method:</span>
                                <span className="font-semibold text-slate-800 uppercase">{checkoutData.paymentMethod} ({checkoutData.phoneNumber})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Delivery Point:</span>
                                <span className="font-semibold text-slate-800">{checkoutData.deliveryAddress}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Total Settlement:</span>
                                <span className="font-mono font-bold text-slate-900">KES {cartSummary.total.toLocaleString()}</span>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={isProcessing}
                              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-medium rounded-xl shadow-sm transition-all active:scale-95"
                            >
                              {isProcessing ? (
                                <>
                                  <Loader2 size={16} className="animate-spin" />
                                  <span>Authorizing STK Push...</span>
                                </>
                              ) : (
                                <>
                                  <Check size={16} />
                                  <span>Confirm & Pay KES {cartSummary.total.toLocaleString()}</span>
                                </>
                              )}
                            </button>
                          </motion.div>
                        )}

                      </AnimatePresence>
                    </form>
                  </div>

                  {/* RIGHT: Summary Sidebar */}
                  <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-600">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Cart Overview</h3>
                        <p className="text-[11px] text-slate-500">{cartSummary.itemsCount} items bundled</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs pb-4 border-b border-slate-100">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-mono font-medium text-slate-900">KES {cartSummary.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Runner Fee</span>
                        <span className="font-mono font-medium text-slate-900">KES {cartSummary.deliveryFee.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Total Due</span>
                      <span className="font-mono font-bold text-base text-slate-900">KES {cartSummary.total.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-2">
                      <ShieldCheck size={14} className="text-emerald-600" /> Fully secured transaction
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
