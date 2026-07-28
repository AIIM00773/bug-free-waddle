import React from 'react';
import {
  MoreHorizontal,
  Share2,
  SlidersHorizontal,
  PanelLeft,
} from 'lucide-react';
import { useSidebar } from '../../Providers/ui/sidebar';

export function Header({
  activeTab = 'Search',
  setActiveTab = () => {},
  setFiltersOpen,
  filtersOpen = false,
}) {
  // Access sidebar context for mobile menu trigger if needed
  const sidebarContext = useSidebar?.();
  const onMobile = sidebarContext?.onMobile;

  const tabs = ['AI mode', "catalog", 'shops'];

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#262626] bg-[#191919]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left Navigation: Mobile Sidebar Toggle + Navigation Tabs */}
      <div className="flex items-center gap-2 sm:gap-6">
        {/* Mobile Sidebar Trigger (Visible on < md screens) */}
        {onMobile && (
          <button
            type="button"
            onClick={() => onMobile.toggleOpen()}
            aria-label="Toggle Mobile Sidebar"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#222222] hover:text-white md:hidden"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-4 text-xs sm:gap-6 sm:text-sm">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} aria-current={isActive ? 'page' : undefined}
                className={`relative py-4 font-medium transition-colors ${isActive? 'text-white font-semibold': 'text-gray-400 hover:text-gray-200'}`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-teal-400 transition-all duration-200" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Optional Filter Toggle Toggle Button */}
        {setFiltersOpen && (
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-label="Toggle Filters"
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              filtersOpen
                ? 'border-teal-500/50 bg-teal-500/10 text-teal-400'
                : 'border-[#333333] bg-[#222222] text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
