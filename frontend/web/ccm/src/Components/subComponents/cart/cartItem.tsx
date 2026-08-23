

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



/* ================ CART ITEM ROW================================================================ */

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (
    id: string,
    delta: number
  ) => void;
  onSave: (item: CartItem) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQty,
  onSave,
  onRemove,
}: CartItemRowProps) {
  return (
    <motion.div
      layout
      className="group p-4 transition-colors hover:bg-slate-50/60 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Product information */}
        <div className="flex min-w-0 items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition group-hover:border-orange-100 group-hover:bg-orange-50 group-hover:text-orange-500">
            <ShoppingBag size={19} />
          </div>

          <div className="min-w-0">
            <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-400">
              {item.category}
            </span>

            <h4 className="mt-1.5 truncate text-xs font-bold text-slate-900">
              {item.name}
            </h4>

            <p className="mt-1 text-[10px] text-slate-400">
              {item.price}{" "}
              <span className="text-slate-300">
                per unit
              </span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 sm:justify-end">

          <QuantityControl
            qty={item.qty}
            onDecrease={() =>
              onUpdateQty(
                item.id,
                -1
              )
            }
            onIncrease={() =>
              onUpdateQty(
                item.id,
                1
              )
            }
          />

          <div className="w-[92px] text-right">
            <p className="font-mono text-xs font-black text-slate-900">
              {
                item.price * item.qty
              }
            </p>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() =>
                onSave(item)
              }
              aria-label="Save item for later"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-orange-50 hover:text-orange-500"
            >
              <Bookmark size={15} />
            </button>

            <button
              type="button"
              onClick={() =>
                onRemove(item.id)
              }
              aria-label="Remove item"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}







/* ===============================================================
   QUANTITY CONTROL
================================================================ */

interface QuantityControlProps {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

function QuantityControl({
  qty,
  onDecrease,
  onIncrease,
}: QuantityControlProps) {
  return (
    <div className="flex h-9 items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        aria-label={
          qty === 1
            ? "Remove item"
            : "Decrease quantity"
        }
        className={[
          "flex h-7 w-7 items-center justify-center rounded-lg transition",
          qty === 1
            ? "text-rose-400 hover:bg-rose-50 hover:text-rose-600"
            : "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
        ].join(" ")}
      >
        {qty === 1 ? (
          <Trash2 size={13} />
        ) : (
          <Minus size={13} />
        )}
      </button>

      <span className="min-w-[28px] text-center font-mono text-[11px] font-bold text-slate-900">
        {qty}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}



