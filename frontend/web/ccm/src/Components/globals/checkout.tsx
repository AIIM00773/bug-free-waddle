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
  Check,
  ArrowRight,
  AlertCircle,
  Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UserCheckout({ onBackToChat }) {
  const [activeTab, setActiveTab] = useState('payment');
  const [isNavMinimized, setIsNavMinimized] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

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

  const tabs = [
    { id: 'payment', label: 'Payment & M-Pesa', icon: Smartphone, index: 0 },
    { id: 'delivery', label: 'Delivery Location', icon: MapPin, index: 1 },
    { id: 'review', label: 'Final Review', icon: ShieldCheck, index: 2 }
  ];

  const handleInputChange = (field, value) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (stepId) => {
    const newErrors = {};
    if (stepId === 'payment' && checkoutData.paymentMethod === 'mpesa') {
      const phoneRegex = /^(\+?254|0)?7\d{8}$|^(\+?254|0)?1\d{8}$/;
      const cleanedPhone = checkoutData.phoneNumber.replace(/\s+/g, '');
      if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
        newErrors.phoneNumber = 'Enter a valid Kenyan M-Pesa number (e.g., +254 712 345 678)';
      }
    }
    if (stepId === 'delivery') {
      if (!checkoutData.deliveryAddress.trim()) {
        newErrors.deliveryAddress = 'Delivery address is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigateToStep = (targetTabId) => {
    const currentTabObj = tabs.find(t => t.id === activeTab);
    const targetTabObj = tabs.find(t => t.id === targetTabId);

    if (targetTabObj.index > currentTabObj.index) {
      if (!validateStep(activeTab)) return;
      if (!completedSteps.includes(activeTab)) {
        setCompletedSteps(prev => [...prev, activeTab]);
      }
    }

    setDirection(targetTabObj.index > currentTabObj.index ? 1 : -1);
    setActiveTab(targetTabId);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'payment') {
      navigateToStep('delivery');
      return;
    }
    if (activeTab === 'delivery') {
      navigateToStep('review');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
    }, 1500);
  };

  const stepVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 16 : -16,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir < 0 ? 16 : -16,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-0 animate-in fade-in duration-200">
      <div className="w-full h-full bg-gray-50 text-gray-900 font-sans relative shadow-2xl  flex flex-col overflow-hidden">

      {/* UNIFIED TOP HEADER BAR */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-orange-500/20 bg-gradient-to-r from-orange-500 to-amber-500 px-4 sm:px-6 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg leading-tight">
                Soko AI
              </h1>
              <p className="text-[11px] font-medium text-orange-100 leading-none mt-0.5">
               Checkout and Transactions  
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-3">
          <AnimatePresence>
            <div className="text-xs font-medium text-white/90">
              {/* Optional Right Action Content */}
            </div>
          </AnimatePresence>
          <button
            type="button"
            onClick={onBackToChat}
            className="p-2 text-orange-100 hover:text-white rounded-xl hover:bg-white/10 transition-colors md:hidden"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </header>



      
        {/* Main Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* LEFT NAV SIDEBAR */}
          <aside className={`hidden shrink-0 flex-col justify-between border-r border-gray-200 bg-white transition-all duration-300 ease-in-out md:flex ${
            isNavMinimized ? 'w-16' : 'w-64'
          }`}>
            <div>
              <div className="h-16 px-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded-xl shrink-0">
                    <CreditCard size={18} className="text-orange-600" />
                  </div>
                  {!isNavMinimized && (
                    <span className="font-bold text-gray-900 tracking-wide text-sm whitespace-nowrap">
                      Checkout Portal
                    </span>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsNavMinimized(!isNavMinimized)}
                  className="hidden md:flex p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title={isNavMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
                >
                  {isNavMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              </div>

              <div className="p-3 space-y-6 hidden md:block w-full">
                <div>
                  {!isNavMinimized && (
                    <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Checkout Steps
                    </p>
                  )}
                  <div className="space-y-1.5">
                    {tabs.map((tab) => {
                      const isActive = activeTab === tab.id;
                      const isCompleted = completedSteps.includes(tab.id);
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => navigateToStep(tab.id)}
                          title={isNavMinimized ? tab.label : undefined}
                          aria-current={isActive ? 'step' : undefined}
                          className={`w-full flex items-center ${
                            isNavMinimized ? 'justify-center py-3' : 'justify-between px-3.5 py-3'
                          } rounded-xl text-xs font-medium transition-all duration-150 relative ${
                            isActive 
                              ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm font-semibold' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} className={isActive ? 'text-orange-600 shrink-0' : 'text-gray-400 shrink-0'} />
                            {!isNavMinimized && <span className="whitespace-nowrap">{tab.label}</span>}
                          </div>
                          {!isNavMinimized && isCompleted && !isActive && (
                            <Check size={14} className="text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-gray-100 hidden md:block">
              <button
                type="button"
                onClick={onBackToChat}
                title={isNavMinimized ? "Back to Chat" : undefined}
                className={`w-full flex items-center ${
                  isNavMinimized ? 'justify-center py-3' : 'justify-center gap-2 px-4 py-3'
                } rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 hover:text-gray-900 text-xs font-medium transition-all`}
              >
                <ArrowLeft size={16} className="shrink-0" />
                {!isNavMinimized && <span className="whitespace-nowrap">Back to Chat</span>}
              </button>
            </div>
          </aside>
          
          {/* RIGHT MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
            
            {/* Horizontal Navigation Tabs (Mobile) */}
            <div className="bg-white px-4 border-b border-gray-200 flex items-center gap-6 overflow-x-auto shrink-0 md:hidden shadow-sm">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isCompleted = completedSteps.includes(tab.id);
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => navigateToStep(tab.id)}
                    className={`py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                      isActive 
                        ? 'border-orange-500 text-orange-600 font-semibold' 
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isCompleted && !isActive && <Check size={13} className="text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {/* Dashboard Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <div className="max-w-5xl mx-auto">
                
                {orderComplete ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-200 p-8 space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-gray-900">Payment Confirmed & Order Placed!</h3>
                      <p className="text-xs text-gray-500 max-w-sm">
                        M-Pesa STK push completed successfully. Neighborhood micro-vendors and dispatch runners have received your packing slip.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onBackToChat}
                      className="mt-4 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20"
                    >
                      Return to Chat Assistant
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT: Checkout Form Steps */}
                    <div className="lg:col-span-8 space-y-6">
                      <form onSubmit={handleFormSubmit}>
                        <AnimatePresence mode="wait" custom={direction}>
                          
                          {/* STEP 1: PAYMENT & M-PESA */}
                          {activeTab === 'payment' && (
                            <motion.div 
                              key="payment"
                              custom={direction}
                              variants={stepVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.18, ease: "easeInOut" }}
                              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6"
                            >
                              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">Payment Method</h3>
                                  <p className="text-xs text-gray-500 mt-0.5">Select your preferred micro-commerce settlement channel</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div 
                                  onClick={() => handleInputChange('paymentMethod', 'mpesa')}
                                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                                    checkoutData.paymentMethod === 'mpesa' 
                                      ? 'border-orange-500 bg-orange-50/60 shadow-sm' 
                                      : 'border-gray-200 bg-white hover:border-gray-300'
                                  }`}
                                >
                                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <Smartphone size={18} />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-semibold text-gray-900">M-Pesa Express</h4>
                                    <p className="text-[11px] text-gray-500">Instant STK Push</p>
                                  </div>
                                </div>

                                <div 
                                  onClick={() => handleInputChange('paymentMethod', 'cash')}
                                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                                    checkoutData.paymentMethod === 'cash' 
                                      ? 'border-orange-500 bg-orange-50/60 shadow-sm' 
                                      : 'border-gray-200 bg-white hover:border-gray-300'
                                  }`}
                                >
                                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <Truck size={18} />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-semibold text-gray-900">Pay on Delivery</h4>
                                    <p className="text-[11px] text-gray-500">Runner collection</p>
                                  </div>
                                </div>
                              </div>

                              {checkoutData.paymentMethod === 'mpesa' && (
                                <div className="space-y-1.5 pt-2">
                                  <label 
                                    htmlFor="phoneNumber"
                                    className="text-[11px] font-bold text-gray-600 uppercase tracking-wider"
                                  >
                                    M-Pesa Phone Number
                                  </label>
                                  <div className={`flex items-center px-3.5 py-3 bg-white border rounded-xl transition-all ${
                                    errors.phoneNumber 
                                      ? 'border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20' 
                                      : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
                                  }`}>
                                    <Smartphone size={16} className="text-gray-400 mr-2.5 shrink-0" />
                                    <input 
                                      id="phoneNumber"
                                      type="tel"
                                      inputMode="tel"
                                      value={checkoutData.phoneNumber}
                                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                      className="w-full bg-transparent text-xs font-mono font-medium text-gray-900 outline-none placeholder-gray-400"
                                      placeholder="+254 7XX XXX XXX"
                                    />
                                  </div>
                                  {errors.phoneNumber && (
                                    <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                                      <AlertCircle size={12} /> {errors.phoneNumber}
                                    </p>
                                  )}
                                </div>
                              )}

                              <div className="pt-4 border-t border-gray-100 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => navigateToStep('delivery')}
                                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 active:scale-95"
                                >
                                  <span>Continue to Delivery</span>
                                  <ArrowRight size={14} />
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {/* STEP 2: DELIVERY LOCATION */}
                          {activeTab === 'delivery' && (
                            <motion.div 
                              key="delivery"
                              custom={direction}
                              variants={stepVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.18, ease: "easeInOut" }}
                              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6"
                            >
                              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">Delivery Address</h3>
                                  <p className="text-xs text-gray-500 mt-0.5">Hyper-local runner coordinate destination</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="space-y-1.5">
                                  <label 
                                    htmlFor="deliveryAddress"
                                    className="text-[11px] font-bold text-gray-600 uppercase tracking-wider"
                                  >
                                    Address / Apartment
                                  </label>
                                  <div className={`flex items-center px-3.5 py-3 bg-white border rounded-xl transition-all ${
                                    errors.deliveryAddress 
                                      ? 'border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20' 
                                      : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
                                  }`}>
                                    <MapPin size={16} className="text-gray-400 mr-2.5 shrink-0" />
                                    <input 
                                      id="deliveryAddress"
                                      type="text" 
                                      value={checkoutData.deliveryAddress}
                                      onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                                      className="w-full bg-transparent text-xs font-medium text-gray-900 outline-none placeholder-gray-400"
                                      placeholder="Enter street, apartment, or landmark"
                                    />
                                  </div>
                                  {errors.deliveryAddress && (
                                    <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                                      <AlertCircle size={12} /> {errors.deliveryAddress}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-1.5">
                                  <label 
                                    htmlFor="deliveryInstructions"
                                    className="text-[11px] font-bold text-gray-600 uppercase tracking-wider"
                                  >
                                    Runner Instructions <span className="text-gray-400 normal-case font-normal">(Optional)</span>
                                  </label>
                                  <textarea 
                                    id="deliveryInstructions"
                                    rows={3}
                                    value={checkoutData.deliveryInstructions}
                                    onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                                    className="w-full p-3.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none placeholder-gray-400"
                                    placeholder="e.g., Gate code, building floor, call on arrival"
                                  />
                                </div>
                              </div>

                              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <button
                                  type="button"
                                  onClick={() => navigateToStep('payment')}
                                  className="text-xs text-gray-500 hover:text-gray-800 font-medium px-2 py-1"
                                >
                                  Back to Payment
                                </button>
                                <button
                                  type="button"
                                  onClick={() => navigateToStep('review')}
                                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 active:scale-95"
                                >
                                  <span>Continue to Review</span>
                                  <ArrowRight size={14} />
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {/* STEP 3: FINAL REVIEW */}
                          {activeTab === 'review' && (
                            <motion.div 
                              key="review"
                              custom={direction}
                              variants={stepVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.18, ease: "easeInOut" }}
                              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6"
                            >
                              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">Review & Authorize</h3>
                                  <p className="text-xs text-gray-500 mt-0.5">Verify your checkout preferences before dispatch</p>
                                </div>
                              </div>

                              <div className="space-y-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Payment Method:</span>
                                  <span className="font-semibold text-gray-800 uppercase">
                                    {checkoutData.paymentMethod} {checkoutData.paymentMethod === 'mpesa' && `(${checkoutData.phoneNumber})`}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Delivery Point:</span>
                                  <span className="font-semibold text-gray-800 text-right max-w-[60%] truncate">
                                    {checkoutData.deliveryAddress}
                                  </span>
                                </div>
                                <div className="flex justify-between pt-2.5 border-t border-gray-200">
                                  <span className="text-gray-500">Total Settlement:</span>
                                  <span className="font-mono font-bold text-gray-900">
                                    KES {cartSummary.total.toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 pt-2">
                                <button
                                  type="button"
                                  onClick={() => navigateToStep('delivery')}
                                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-xl transition-all"
                                >
                                  Back
                                </button>
                                <button
                                  type="submit"
                                  disabled={isProcessing}
                                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all active:scale-95"
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
                              </div>
                            </motion.div>
                          )}

                        </AnimatePresence>
                      </form>
                    </div>

                    {/* RIGHT: Summary Sidebar */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-orange-50 border border-orange-200 rounded-xl text-orange-600">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Cart Overview</h3>
                          <p className="text-[11px] text-gray-500">{cartSummary.itemsCount} items bundled</p>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs pb-4 border-b border-gray-100">
                        <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span>
                          <span className="font-mono font-medium text-gray-800">KES {cartSummary.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Runner Fee</span>
                          <span className="font-mono font-medium text-gray-800">KES {cartSummary.deliveryFee.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Total Due</span>
                        <span className="font-mono font-bold text-base text-gray-900">KES {cartSummary.total.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 pt-2">
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
    </div>
  );
}
