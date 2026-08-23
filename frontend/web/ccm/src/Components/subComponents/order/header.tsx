

import React from "react";
import { ArrowLeft, Check, Search  } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ccmLogo from "../../../assets/ccmlogo1.png";



export function OrdersHeader({
  onBackToChat,
  handleReload,
  notification,
  searchQuery,
  setSearchQuery
}:any) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between bg-orange-950/90 px-3 md:bg-white sm:px-2 lg:px-3">
      {/* Left side: Mobile back button, logo / app name, and title */}
      <div className="flex min-w-full md:min-w-0 justify-between  items-center gap-3">
        {/* Mobile Back / Exit Button */}
        <button
          type="button"
          onClick={onBackToChat}
          aria-label="Back to chat"
          className="flex h-8 w-fit shrink-0 items-center justify-center rounded-full border border-orange-500/50 bg-white/5 px-3 pr-4 text-orange-500/95 transition hover:bg-white/10 hover:text-white md:hidden"
        >
          <nav className="flex flex-row items-center gap-1">
            <ArrowLeft size={17} />
            <span className="text-xs">Exit Orders</span>
          </nav>
        </button>

        {/* Brand / Logo */}
        <h1 className="font-extrabold text-white md:text-slate-900">Soko AI</h1>

        <button
          type="button"
          onClick={handleReload}
          aria-label="Go to Soko AI home"
          className="flex items-center rounded-full bg-transparent md:hidden"
        >
          <img src={ccmLogo} alt="CCM Logo" className="text-white" height={50} width={50} />
        </button>

        {/* Desktop Header Title */}
        <p className="hidden font-bold text-orange-500/90 md:inline text-sm">
          Orders Management
        </p>
      </div>


      {/* Right side: Notifications & Close Action */}
      <div className="relative flex items-center gap-2">
        <AnimatePresence mode="wait">
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.96 }}
              className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[11px] font-medium text-white shadow-xl backdrop-blur-xl sm:flex"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20">
                <Check size={10} className="text-emerald-400" />
              </span>
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Close Button */}
        <button
          type="button"
          onClick={onBackToChat}
          className="hidden items-center gap-2 rounded-3xl border border-white/10 bg-gray-950/90 px-3.5 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:flex md:border-slate-200 md:bg-slate-100 md:text-slate-700 md:hover:bg-slate-200"
        >
          Close
        </button>
      </div>
    </header>
  );
}