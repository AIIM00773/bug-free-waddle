import React from 'react';
import {
  SlidersHorizontal,
  PanelLeft,
  Sparkles,
} from 'lucide-react';
import { useSidebar } from '../../Providers/ui/sidebar';

export interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  filtersOpen?: boolean;
  setFiltersOpen?: (open: boolean) => void;
}

export function Header({
  activeTab = 'AI mode',
  setActiveTab = () => {},
  filtersOpen = false,
  setFiltersOpen,
}: HeaderProps) {
  // Access sidebar context for mobile menu trigger
  const sidebarContext = useSidebar?.();
  const onMobile = sidebarContext?.onMobile;

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-3 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left Navigation: Mobile Sidebar Toggle + Navigation / Logo */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {/* Mobile Sidebar Trigger (Visible on < md screens) */}
        {onMobile && (
          <button
            type="button"
            onClick={() => onMobile.toggleOpen()}
            aria-label="Toggle Mobile Sidebar"
            className="shrink-0 rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 md:hidden"
          >
            <PanelLeft className="h-4 w-4 shrink-0" />
          </button>
        )}

        {/* Brand / Logo Section */}
        <nav className="flex min-w-0 items-center text-xs sm:text-sm">
          <button
            type="button"
            onClick={handleReload}
            aria-label="Reload Page"
            className="group flex min-w-0 items-center gap-2 rounded-lg py-1.5 text-sm font-semibold text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <span className="flex min-w-0 items-center gap-1.5 truncate">
              <Sparkles className="h-4 w-4 shrink-0 text-slate-900" />
              <span className="truncate">Soko AI</span>
            </span>
          </button>
        </nav>
      </div>

      {/* Right Action Controls */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Optional Filter Toggle Button */}
        {setFiltersOpen && (
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-label="Toggle Filters"
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
              filtersOpen
                ? 'border-slate-900 bg-slate-900 font-semibold text-white shadow-xs'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Toggle Search Filters"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">Filters</span>
          </button>
        )}
      </div>
    </header>
  );
}
