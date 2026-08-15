import React from 'react';
import {
  SlidersHorizontal,
  PanelLeft,
  Sparkles,
} from 'lucide-react';
import { useSidebar } from '../../Providers/ui/sidebar';
import ccmlogo1 from "../../assets/ccmlogo3.png";

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
   localStorage.removeItem('showWelcomeBanner');
   
    window.location.reload();
  };

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-14 w-full items-center justify-between
        border-b border-slate-200/60
        bg-white/95
        px-3
        backdrop-blur-sm
        sm:px-2 
        sm:pl-0
        lg:px-3 
        lg:pl-0 
      "
    >
      {/* ─────────────────────────────────────────────
          Left: Mobile Navigation + Brand
      ───────────────────────────────────────────── */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {/* Mobile Sidebar Trigger */}
        {onMobile && (
          <button
            type="button"
            onClick={() => onMobile.toggleOpen()}
            aria-label="Open navigation"
            className="
              shrink-0 rounded-lg p-2 
              text-slate-500
              transition-colors duration-150
              hover:bg-slate-50
              hover:text-slate-800
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-slate-300
              md:hidden
            "
          >
            <PanelLeft className="h-4 w-4 shrink-0" />
          </button>
        ) }
        
    

        <nav className="flex min-w-0 items-center">
          <button
            type="button"
            onClick={handleReload}
            aria-label="Go to Soko AI home"
            className="
              group
              flex min-w-0 items-Left
              bg-[transparent] ,
              rounded-full 
              
            "
          >
            <span className="flex min-w-0 items-center ">
        

               <img src={ccmlogo1}  height={90}  width={70}  
                  className="
                   shrink-0
                  text-indigo-500
                  transition-colors duration-150
                  group-hover:text-indigo-600
                  
                "
                strokeWidth={2}/> 
    
            </span>
          </button>
        </nav>
       
             
      </div>

      {/* ─────────────────────────────────────────────
          Right: Header Actions
      ───────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {setFiltersOpen && (
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-label={filtersOpen ? 'Close filters' : 'Open filters'}
            aria-pressed={filtersOpen}
            title={filtersOpen ? 'Close Search Filters' : 'Open Search Filters'}
            className={`
              flex shrink-0 items-center gap-1.5
              rounded-full
              border
              px-3 py-1.5
              text-xs font-medium
              transition-all duration-150
              active:scale-[0.98]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-slate-300

              ${
                filtersOpen
                  ? `
                    border-slate-800
                    bg-slate-800
                    text-white
                    shadow-sm
                  `
                  : `
                    border-slate-200
                    bg-white
                    text-slate-600
                    hover:border-slate-300
                    hover:bg-slate-50
                    hover:text-slate-900
                  `
              }
            `}
          >
            <SlidersHorizontal
              className="h-3.5 w-3.5 shrink-0"
              strokeWidth={1.8}
            />

            <span className="whitespace-nowrap">
              Filters
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
