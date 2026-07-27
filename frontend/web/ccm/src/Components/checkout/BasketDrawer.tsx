import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Store, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export function BasketDrawer({ 
  isOpen, 
  onClose, 
  items = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  activeEstate = "Juja / Kiambu"
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  // Price calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const deliveryFee = items.length > 0 ? 100 : 0; // Standard local runner flat fee
  const grandTotal = subtotal + deliveryFee;

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
  };

  const handleCheckoutSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      setTimeout(() => {
        onCheckout?.(items);
        setOrderSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden font-sans">
      
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Cart Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-800/90 text-slate-100 flex flex-col z-10 shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-right">
        
        {/* Drawer Header */}
        <div className="p-4 md:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white leading-none">Your Basket</h3>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <MapPin size={10} className="text-emerald-400" />
                <span>Delivering to <strong className="text-slate-200 font-semibold">{activeEstate}</strong></span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full border border-slate-800 transition-all cursor-pointer"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Success State Overlay */}
        {orderSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-xl font-bold text-white">Order Placed!</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Local runners have been dispatched. Your fresh items are on the way!
            </p>
          </div>
        ) : (
          <>
            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 subtle-scrollbar">
              {items.length === 0 ? (
                /* Empty Cart View */
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-300 text-sm">Your basket is empty</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                      Ask Soko AI or browse nearby catalog items to add fresh produce!
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                /* Active Items List */
                items.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex gap-3 items-center hover:border-slate-700/80 transition-all"
                  >
                    {/* Item Image */}
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"} 
                      alt={item.name} 
                      onError={handleImageError}
                      className="w-16 h-16 object-cover rounded-lg bg-slate-950 border border-slate-800/80 shrink-0" 
                    />

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Store size={10} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{item.shop || "Verified Merchant"}</span>
                      </div>
                      <h4 className="font-semibold text-xs text-white truncate">{item.name}</h4>
                      <p className="text-xs font-extrabold text-emerald-400">
                        KES {Number(item.price).toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex flex-col items-end justify-between h-full gap-2 shrink-0">
                      <button 
                        onClick={() => onRemoveItem?.(item.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                        <button 
                          onClick={() => onUpdateQuantity?.(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-bold px-2 text-white">{item.quantity || 1}</span>
                        <button 
                          onClick={() => onUpdateQuantity?.(item.id, (item.quantity || 1) + 1)}
                          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-4 border-t border-slate-800/80 bg-slate-950 space-y-4 shadow-2xl">
                
                {/* Cost Summary Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="text-slate-200 font-semibold">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Runner Delivery</span>
                    <span className="text-slate-200 font-semibold">KES {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-800/80 pt-2 flex justify-between items-baseline text-sm">
                    <span className="font-bold text-white">Total Amount</span>
                    <span className="font-extrabold text-base text-emerald-400">KES {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Soko Guarantee Notice */}
                <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl text-[11px] text-slate-400">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span>Protected by Soko Fresh Guarantee & Fast Dispatch</span>
                </div>

                {/* Primary Checkout Button */}
                <button 
                  disabled={isSubmitting}
                  onClick={handleCheckoutSubmit}
                  className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="animate-spin text-slate-950" />
                      <span>Dispatching Runner...</span>
                    </div>
                  ) : (
                    <>
                      <span>Checkout • KES {grandTotal.toLocaleString()}</span>
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
