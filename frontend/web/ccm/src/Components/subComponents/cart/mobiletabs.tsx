import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type MobileTab = {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
};

type MobileTabsProps = {
  tabs: MobileTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export function MobileTabs({
  tabs,
  activeTab,
  onTabChange,
}: MobileTabsProps) {
  return (
    <div className="shrink-0 border-b border-slate-200 bg-white px-4   md:hidden ">
      <nav
        className="flex h-12  items-center justify-between  gap-5 overflow-x-auto"
        aria-label="Mobile navigation"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const hasCount = (tab.count ?? 0) > 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={[
                "relative flex h-full shrink-0 items-center gap-2",
                "text-[11px] font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-orange-400 focus-visible:ring-offset-2",
                isActive
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-700",
              ].join(" ")}
            >
              <Icon
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className={
                  isActive ? "text-orange-500" : "text-slate-400"
                }
              />

              <span>{tab.label}</span>

              {hasCount && (
                <span
                  className={[
                    "rounded-md px-1.5 py-0.5 font-mono text-[9px]",
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {tab.count}
                </span>
              )}

              {isActive && (
                <motion.span
                  layoutId="mobile-tab-indicator"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-orange-500"
                />
              )}
            </button>
            
          );
        })}
      </nav>
    </div>
  );
}

