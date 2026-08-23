import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Package,
  type LucideIcon,
} from "lucide-react";

import ccmLogo from "../../../assets/ccmlogo2.png";

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

export interface OrdersSidebarProps {
  onBackToChat: () => void;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  isNavMinimized: boolean;
  setIsNavMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  tabs: TabItem[];
}

export function OrdersSidebar({
  activeTab,
  setActiveTab,
  isNavMinimized,
  setIsNavMinimized,
  tabs,
}: OrdersSidebarProps) {
  return (
    <aside
      aria-label="Order filters"
      className={[
        "hidden shrink-0 flex-col border-r border-slate-200 bg-white",
        "transition-all duration-300 md:flex",
        isNavMinimized ? "w-[76px]" : "w-[195px]",
      ].join(" ")}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Sidebar header */}
        <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-slate-100 px-4">
          {!isNavMinimized ? (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 p-1 text-orange-600">
                <img src={ccmLogo} alt="ccm logo" className="h-10 w-10 object-contain" />
              </div>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center">
              <img src={ccmLogo} alt="CCM Logo" className="h-8 w-8 object-contain" />
            </div>
          )}

          {!isNavMinimized && (
            <button
              type="button"
              onClick={() => setIsNavMinimized((current) => !current)}
              aria-label="Minimize sidebar"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Expand toggle when minimized */}
        {isNavMinimized && (
          <div className="flex justify-center border-b border-slate-100 py-3">
            <button
              type="button"
              onClick={() => setIsNavMinimized(false)}
              aria-label="Expand sidebar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Navigation / Filters */}
        <nav className="flex-1 p-3" aria-label="Order filters" role="tablist">
          {!isNavMinimized && (
            <p className="mb-2 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
              Orders Portal
            </p>
          )}

          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const hasCount = typeof tab.count === "number" && tab.count > 0;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  title={isNavMinimized ? tab.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "group flex w-full items-center rounded-xl transition-colors",
                    isNavMinimized
                      ? "justify-center p-3"
                      : "justify-between px-3 py-2.5",
                    isActive
                      ? "bg-orange-50 text-orange-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className={
                        isActive
                          ? "text-orange-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }
                    />

                    {!isNavMinimized && (
                      <span className="text-xs font-semibold">
                        {tab.label}
                      </span>
                    )}
                  </span>

                  {!isNavMinimized && hasCount && (
                    <span
                      className={[
                        "min-w-5 rounded-md px-1.5 py-0.5 text-center",
                        "font-mono text-[9px] font-bold",
                        isActive
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-500",
                      ].join(" ")}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Info card matching the cart sidebar style */}
        {!isNavMinimized && (
          <div className="m-3 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50/40 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-orange-600 shadow-sm">
                <Package size={13} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-bold text-orange-900">
                Live Tracking
              </span>
            </div>

            <p className="text-[10px] leading-relaxed text-orange-900/60">
              Monitor your regional fulfillments and live shipping updates in real-time.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}