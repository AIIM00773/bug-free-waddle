import React from 'react';
import {
  SlidersHorizontal,
  PanelLeft,
  Store,
  Sparkles,
} from 'lucide-react';
import { useSidebar } from '../../Providers/ui/sidebar';

// ==========================================
// Types & Interfaces
// ==========================================
export interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  filtersOpen?: boolean;
  setFiltersOpen?: (open: boolean) => void;
}

// ==========================================
// Main Header Component
// ==========================================
export function Header({
  activeTab = 'AI mode',
  setActiveTab = () => {},
  filtersOpen = false,
  setFiltersOpen,
}: HeaderProps) {
  // Access sidebar context for mobile menu trigger
  const sidebarContext = useSidebar?.();
  const onMobile = sidebarContext?.onMobile;

  const tabs = ['AI mode'];

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left Navigation: Mobile Sidebar Toggle + Navigation Tabs */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mobile Sidebar Trigger (Visible on < md screens) */}
        {onMobile && (
          <button
            type="button"
            onClick={() => onMobile.toggleOpen()}
            aria-label="Toggle Mobile Sidebar"
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 md:hidden"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-6 text-xs sm:text-sm">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex items-center gap-2 py-4 font-medium transition-colors ${
                  isActive
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles
                    className={`h-3.5 w-3.5 ${
                      isActive ? 'text-[#3C3147]' : 'text-slate-400'
                    }`}
                  />
                  {tab}
                </span>

                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#3C3147] transition-all duration-200" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Optional Filter Toggle Button */}
        {setFiltersOpen && (
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-label="Toggle Filters"
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              filtersOpen
                ? 'border-[#3C3147]/30 bg-[#3C3147]/10 text-[#3C3147] font-semibold shadow-2xs'
                : 'border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
            }`}
            title="Toggle Search Filters"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        )}
      </div>
    </header>
  );
}
