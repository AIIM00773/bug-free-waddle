import React from "react";
import {
  Bookmark,
  Check,
  CheckCircle2,
  MapPin,
  ShoppingCart,
  Sparkles,
  Store,
  Trash2,
  Truck,
  ArrowRight,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../../Providers/CartContext";

import { CartHeader } from "../subComponents/cart/header"; 
import { CartSidebar } from "../subComponents/cart/sider";
import { MobileTabs } from "../subComponents/cart/mobiletabs"; 
import { VendorCard } from "../subComponents/cart/vendorCard"; 

export interface UserCartProps {
  onBackToChat: () => void;
}

const formatCurrency = (value: number) => `KES ${value.toLocaleString("en-KE")}`;

export function UserCart({ onBackToChat }: UserCartProps) {
  const {
    items,
    savedItems,
    activeTab,
    setActiveTab,
    isNavMinimized,
    setIsNavMinimized,
    tabs,
    isCheckingOut,
    orderPlaced,
    subtotal,
    totalItems,
    runnerFee,
    totalDue,
    groupedCartItems,
    updateQty,
    removeItemFromCart,
    removeItemFromSaved,
    moveToSaved,
    moveToCart,
    submitCheckout,
    legibleForCheckout,
    handleCheckout
  } = useCart();



  const vendorCount = groupedCartItems.length;



  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#FFFFFF] font-sans">

      {/* ========================================================= TOP BAR ========================================================= */}
      <CartHeader onBackToChat={onBackToChat} /> 

      {/* ========================================================= APP SHELL ========================================================= */}
      <div className="flex min-h-0 flex-1 bg-[#f6f7f9]">
      
       <CartSidebar 
          onBackToChat={onBackToChat} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isNavMinimized={isNavMinimized} 
          setIsNavMinimized={setIsNavMinimized} 
          tabs={tabs}  
        /> 

        {/* ======================================================= MAIN AREA ======================================================= */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* Mobile tabs */}
          <MobileTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} /> 
          
          {/* ==================================================== CONTENT ===================================================== */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1380px] p-4 sm:p-6 lg:p-8">

              {/* ================================================= ORDER SUCCESS ================================================= */}
              {orderPlaced ? ( 
                <OrderSuccess onReturn={onBackToChat} />
              ) : (
                <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

                  {/* ============================================= LEFT CONTENT ============================================= */}
                  <section className="min-w-0">
                    <AnimatePresence mode="popLayout">
                      {activeTab === "active" ? (
                        items.length > 0 ? (
                          <div className="space-y-5">
                            {groupedCartItems.map((group, index) => (
                              <VendorCard
                                key={group.merchant.merchant.id}
                                vendorName={group.merchant.merchant.name}
                                group={{
                                  location: group.merchant.merchant.location.streetAddress || group.merchant.merchant.location.city || "Kenya",
                                  items: group.products.map(prod => {
                                    // Map back to format expected by VendorCard if necessary
                                    const cartItem = items.find(i => i.product.id === prod.id);
                                    return {
                                      id: prod.id,
                                      vendor: group.merchant.merchant.name,
                                      vendorLocation: group.merchant.merchant.location.city || "",
                                      name: prod.title,
                                      price: prod.price,
                                      qty: cartItem ? cartItem.count : 1,
                                      category: prod.category
                                    };
                                  })
                                }}
                                index={index}
                                onUpdateQty={(id, delta) => {
                                  const target = items.find(i => i.product.id === id);
                                  if (target) {
                                    updateQty(id, target.count + delta);
                                  }
                                }}
                                onSave={(item) => {
                                  const found = items.find(i => i.product.id === item.id);
                                  if (found) moveToSaved(found);
                                }}
                                onRemove={(id) => removeItemFromCart(id)}
                              />
                            ))}
                          </div>
                        ) : (
                          <EmptyCart onExplore={onBackToChat} />
                        )
                      ) : savedItems.length > 0 ? (
                        <div className="space-y-3">
                          {savedItems.map((item) => (
                            <SavedItem
                              key={item.product.id}
                              item={{
                                id: item.product.id,
                                vendor: item.merchant.merchant.name,
                                vendorLocation: item.merchant.merchant.location.city || "",
                                name: item.product.title,
                                price: item.price,
                                qty: item.count,
                                category: item.product.category
                              }}
                              onMoveToCart={() => moveToCart(item)}
                              onRemove={() => removeItemFromSaved(item.product.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptySaved onSwitch={() => setActiveTab("active")} />
                      )}
                    </AnimatePresence>
                  </section>

                  {/* ============================================= ORDER SUMMARY ============================================= */}
                  {activeTab === "active" && (
                    <OrderSummary
                      subtotal={subtotal}
                      deliveryFee={items.length > 0 ? runnerFee : 0}
                      total={totalDue}
                      totalUnits={totalItems}
                      vendorCount={vendorCount}
                      disabled={items.length === 0}
                      isCheckingOut={isCheckingOut}
                      onCheckout={handleCheckout}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ===============================================================
   ORDER SUMMARY
================================================================ */

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalUnits: number;
  vendorCount: number;
  disabled: boolean;
  isCheckingOut: boolean;
  onCheckout: () => void;
}

function OrderSummary({
  subtotal,
  deliveryFee,
  total,
  totalUnits,
  vendorCount,
  disabled,
  isCheckingOut,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <aside className="xl:sticky xl:top-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Summary header */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-600">
              <Truck size={17} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-900">
                Order Summary
              </h3>
              <p className="mt-1 text-[10px] text-slate-400">
                {vendorCount} {vendorCount === 1 ? "vendor" : "vendors"} · {totalUnits} {totalUnits === 1 ? "unit" : "units"}
              </p>
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="space-y-4 p-5">
          <div className="space-y-3">
            <SummaryRow label="Items subtotal" value={formatCurrency(subtotal)} />
            <SummaryRow label="Runner delivery" value={formatCurrency(deliveryFee)} />
          </div>

          {/* Delivery */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-orange-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-700">Delivery destination</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-slate-400">Juja · Kenyatta Road / Gate C</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">Total amount</p>
                <p className="mt-1 text-[9px] text-slate-300">Includes delivery</p>
              </div>
              <span className="font-mono text-xl font-black tracking-tight text-slate-950">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Checkout */}
          <button
            type="button"
            disabled={disabled || isCheckingOut}
            onClick={onCheckout}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-[11px] font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isCheckingOut ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing M-Pesa...
              </>
            ) : (
              <>
                Proceed to Checkout
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          {/* Trust */}
          <div className="flex items-center justify-center gap-2 pt-1 text-[9px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Secure M-Pesa checkout
          </div>
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="font-mono text-[11px] font-bold text-slate-800">{value}</span>
    </div>
  );
}

/* ===============================================================
   SAVED ITEM
================================================================ */

interface SimpleCartItem {
  id: string;
  vendor: string;
  vendorLocation: string;
  name: string;
  price: number;
  qty: number;
  category: string;
}

function SavedItem({
  item,
  onMoveToCart,
  onRemove,
}: {
  item: SimpleCartItem;
  onMoveToCart: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
          <Bookmark size={17} />
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">{item.vendor}</p>
          <h3 className="truncate text-xs font-bold text-slate-900">{item.name}</h3>
          <p className="mt-1 font-mono text-[10px] font-semibold text-slate-600">{formatCurrency(item.price)}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
        <button
          type="button"
          onClick={onMoveToCart}
          className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-[10px] font-bold text-orange-700 transition hover:bg-orange-100"
        >
          Move to Cart
          <ArrowRight size={12} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove saved item"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.article>
  );
}

/* ===============================================================
   EMPTY CART
================================================================ */

function EmptyCart({ onExplore }: { onExplore: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
        <ShoppingCart size={25} />
      </div>
      <h3 className="text-sm font-bold text-slate-900">Your basket is empty</h3>
      <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-slate-400">
        Nothing here yet. Ask Soko AI to find products or explore nearby vendors and build your basket.
      </p>
      <button
        type="button"
        onClick={onExplore}
        className="mt-6 flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-slate-800"
      >
        <Sparkles size={13} />
        Explore with Soko AI
      </button>
    </motion.div>
  );
}

/* ===============================================================
   EMPTY SAVED
================================================================ */

function EmptySaved({ onSwitch }: { onSwitch: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
        <Bookmark size={22} />
      </div>
      <h3 className="text-sm font-bold text-slate-900">Nothing saved yet</h3>
      <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-slate-400">
        Save products from your active basket when you want to come back to them later.
      </p>
      <button
        type="button"
        onClick={onSwitch}
        className="mt-5 text-[10px] font-bold text-orange-600 hover:text-orange-700"
      >
        Return to Active Cart →
      </button>
    </motion.div>
  );
}

/* ===============================================================
   SUCCESS
================================================================ */

function OrderSuccess({ onReturn }: { onReturn: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex min-h-[560px] max-w-2xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm sm:px-12"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50 text-emerald-600"
      >
        <CheckCircle2 size={38} />
      </motion.div>

      <div className="mt-7">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-600">
            Order confirmed
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          Your basket is on its way.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-slate-400">
          Your order has been routed to nearby vendors and runners in Juja. Watch for the M-Pesa payment prompt and delivery updates on your phone.
        </p>
      </div>

      <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-2">
        <SuccessStep icon={<Store size={14} />} label="Vendors" />
        <SuccessStep icon={<Truck size={14} />} label="Runner" />
        <SuccessStep icon={<Check size={14} />} label="Delivery" />
      </div>

      <button
        type="button"
        onClick={onReturn}
        className="mt-8 flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-[10px] font-bold text-white transition hover:bg-slate-800"
      >
        <Sparkles size={13} />
        Return to Soko AI
      </button>
    </motion.div>
  );
}

function SuccessStep({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
      <span className="text-emerald-500">{icon}</span>
      <span className="text-[9px] font-semibold text-slate-500">{label}</span>
    </div>
  );
}