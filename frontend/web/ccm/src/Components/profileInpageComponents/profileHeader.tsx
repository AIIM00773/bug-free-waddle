import React from 'react';
import { X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ccmLogo from '../../assets/ccmlogo1.png';

export  function ProfileHeader({
  onBackToChat,
  handleReload
}: {
  onBackToChat: () => void;
  handleReload: () => void;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-orange-500/20 bg-gradient-to-r from-orange-500 to-amber-500 px-4 sm:px-6 sm:pl-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <nav className="flex min-w-0 items-center">
            <button
              type="button"
              onClick={handleReload}
              aria-label="Go to Soko AI home"
              className="group flex min-w-0 items-center bg-transparent rounded-full"
            >
              <span className="flex min-w-0 items-center">
                <img
                  src={ccmLogo}
                  height={90}
                  width={70}
                  alt="Soko AI Logo"
                  className="shrink-0 text-indigo-500 transition-colors duration-150 group-hover:text-indigo-600"
                />
              </span>
            </button>
          </nav>
          <div>
            <p className="text-[11px] font-medium text-orange-100 leading-none mt-0.5">
              Profile & Account Settings
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
  );
}
