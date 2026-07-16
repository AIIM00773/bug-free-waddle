import React from 'react';
import { ShoppingBag, Trash2, Smartphone } from 'lucide-react';

export function BasketDrawer({ cart, setCart, updateCartQty, deliveryNote, triggerCheckout, showToast }) {
  const getBasketTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (cart.length === 0) return null;

  return (
    <aside className="fixed bottom-0 md:bottom-6 right-0 md:right-6 left-0 md:left-auto z-40 bg-zinc-950 border border-zinc-800/80 md:rounded-2xl shadow-2xl p-4 md:w-96 mx-0 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <ShoppingBag size={15} />
          </span>
          <div>
            <h4 className="font-bold text-xs text-white">Your Basket</h4>
            <p className="text-[10px] text-zinc-500 font-semibold">Geofenced Dispatch</p>
          </div>
        </div>
        <button 
          onClick={() => { setCart([]); showToast("Cleared your basket", "info"); }}
          className="text-[10px] font-bold text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={11} />
          <span>Empty</span>
        </button>
      </div>

      {/* Selected Items scrollable panel */}
      <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between text-xs py-1">
            <div className="flex-1 min-w-0 pr-3">
              <span className="font-bold text-zinc-200 block truncate">{item.product.name}</span>
              <span className="text-[10px] text-zinc-500 font-medium">KES {item.product.price} each</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => updateCartQty(item.product.id, -1)}
                className="w-6 h-6 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded text-zinc-400 hover:text-zinc-100"
              >
                -
              </button>
              <span className="font-bold text-zinc-300 text-xs px-1 w-4 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateCartQty(item.product.id, 1)}
                className="w-6 h-6 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded text-zinc-400 hover:text-zinc-100"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total panel */}
      <div className="bg-zinc-900 rounded-xl p-3 space-y-1.5 border border-zinc-800/80">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Delivery note:</span>
          <span className="font-bold text-zinc-300 truncate max-w-[150px]">{deliveryNote}</span>
        </div>
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Delivery Fee:</span>
          <span className="font-bold text-emerald-400">FREE</span>
        </div>
        <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-black text-white">
          <span>Total:</span>
          <span>KES {getBasketTotal()}</span>
        </div>
      </div>

      <button 
        onClick={triggerCheckout}
        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl transition-all tracking-wider flex items-center justify-center gap-1.5 shadow-md"
      >
        <Smartphone size={14} strokeWidth={2.5} />
        <span>Pay KES {getBasketTotal()} via M-Pesa</span>
      </button>
    </aside>
  );
}
