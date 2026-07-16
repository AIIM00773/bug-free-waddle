import React from 'react';
import { X, Smartphone, AlertCircle, Check } from 'lucide-react';

export function MpesaModal({
  cart,
  setCart,
  mpesaPhone,
  setMpesaPhone,
  mpesaStatus,
  setMpesaStatus,
  deliveryNote,
  closeModal,
  showToast,
  onSuccessPayment
}) {
  const getBasketTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const executeSTKPush = () => {
    setMpesaStatus('sending');
    setTimeout(() => {
      setMpesaStatus('pin_prompted');
    }, 2000);
  };

  const confirmSimulatedPayment = () => {
    setMpesaStatus('success');
    setTimeout(() => {
      closeModal();
      setCart([]);
      setMpesaStatus('idle');

      // Build out dynamic dispatch message back to main thread
      const mockTx = `SGR${Math.floor(100000 + Math.random() * 900000)}`;
      const paymentMsg = {
        id: Date.now().toString(),
        sender: 'ai',
        text: `M-Pesa payment of KES ${getBasketTotal()} processed! TXID: ${mockTx}. Your designated runner is carrying your supplies to the door of: ${deliveryNote}. Expected eta is 12 mins.`
      };

      onSuccessPayment(paymentMsg);
      showToast("Order Placed Successfully!", "success");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-950 text-white border border-zinc-800/80 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
        
        <button onClick={closeModal} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300">
          <X size={18} />
        </button>

        <div className="text-center mt-2">
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-emerald-500/25">
            <Smartphone size={28} className="animate-pulse" />
          </div>
          
          <h3 className="text-base font-bold text-white">Safaricom Pay Link</h3>
          <p className="text-[9px] text-emerald-400 uppercase font-black tracking-wider mt-0.5">STK Push Gateway</p>

          <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3.5 my-5 text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Till Name:</span>
              <span className="font-semibold text-emerald-400 font-mono">SOKO_AI_PAY</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Customer Mobile:</span>
              <input 
                type="text" 
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                className="font-mono font-bold bg-transparent text-right outline-none focus:text-emerald-400 max-w-[120px]"
              />
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-zinc-800">
              <span className="text-zinc-500">Bill Total:</span>
              <span className="font-mono font-black text-white">KES {getBasketTotal()}</span>
            </div>
          </div>

          {mpesaStatus === 'idle' && (
            <button 
              onClick={executeSTKPush}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl transition-all"
            >
              Initiate Pay Push
            </button>
          )}

          {mpesaStatus === 'sending' && (
            <div className="space-y-2 py-2">
              <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-emerald-400 animate-pulse font-medium">Executing secure handshake transaction...</p>
            </div>
          )}

          {mpesaStatus === 'pin_prompted' && (
            <div className="space-y-4 py-1">
              <div className="p-3 bg-zinc-900 border border-amber-500/20 rounded-xl text-xs text-amber-300/90 flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 text-amber-400 mt-0.5" />
                <span className="text-left font-medium">Please authorize payment via the prompt sent to your screen.</span>
              </div>
              <button 
                onClick={confirmSimulatedPayment}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-xl transition-all"
              >
                Approve (Pin Input Sandbox)
              </button>
            </div>
          )}

          {mpesaStatus === 'success' && (
            <div className="py-4 text-center space-y-2.5 animate-in zoom-in-95 duration-200">
              <div className="w-10 h-10 bg-emerald-500 text-zinc-950 rounded-full flex items-center justify-center mx-auto">
                <Check size={18} strokeWidth={3} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-400">Transaction Complete</h4>
                <p className="text-[10px] text-zinc-500 mt-1">Order assigned to nearest courier runner node.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
