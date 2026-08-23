/* ===============================================================
   VENDOR CARD
================================================================ */
import { AnimatePresence, motion } from "framer-motion";


import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Trash2,
  Truck,
  X,
} from "lucide-react";


import {CartItemRow } from "./cartItem";

export interface VendorCardProps {
  vendorName: string;
  group: VendorGroup;
  index: number;
  onUpdateQty: (id: string, delta: number) => void;
  onSave: (item: CartItem) => void;
  onRemove: (id: string) => void;
  formatCurrency: any | null; 
}

export function VendorCard({
  vendorName,
  group,
  index,
  onUpdateQty,
  onSave,
  onRemove,
  formatCurrency
}: VendorCardProps) {
  const vendorSubtotal = group.items.reduce(
    (subtotal, item) => subtotal + item.price * item.qty,
    0
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        duration: 0.25,
        delay: index * 0.04,
      }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Vendor header */}
      <header className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-white text-orange-600 shadow-sm">
            <Store size={17} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-xs font-bold text-slate-900">
              {vendorName}
            </h3>

            <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[10px] text-slate-400">
              <MapPin
                size={11}
                strokeWidth={2}
                aria-hidden="true"
                className="shrink-0 text-orange-500"
              />

              <span className="truncate">{group.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            />
            <span>Ready in ~15 min</span>
          </div>

          <span className="hidden text-[10px] font-medium text-slate-400 sm:inline">
            {vendorSubtotal}
          </span>
        </div>
      </header>

      {/* Cart items */}
      <div className="divide-y divide-slate-100">
        {group.items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onUpdateQty={onUpdateQty}
            onSave={onSave}
            onRemove={onRemove}
          />
        ))}
      </div>
    </motion.article>
  );
}

