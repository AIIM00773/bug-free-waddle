import React from 'react';
import { User, ChevronRight, ChevronLeft, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Define the shape of a single Tab object
interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

// Define the props required by this component
interface ProfileAsideProps {
  isNavMinimized: boolean;
  setIsNavMinimized: (val: boolean) => void;
  activeTab: string;
  handleTabChange: (tabId: string) => void;
  tabs: TabItem[];
  logout: () => void;
}

export  function ProfileAside({
  isNavMinimized,
  setIsNavMinimized,
  activeTab,
  handleTabChange,
  tabs,
  logout
}: ProfileAsideProps) {
  
  return (
    <aside className={`bg-slate-100/80 border-r border-slate-200 text-slate-700 flex-col justify-between shrink-0 transition-all duration-300 ease-in-out ${
        isNavMinimized ? "md:w-20" : "md:w-64"
      } hidden md:flex`}
      >
      <div>
      
        {/* Sidebar Header */}
        <div
          className={`h-14 ${
            isNavMinimized ? "px-3 justify-center" : "px-6 justify-between"
          } flex items-center border-b border-slate-200/60`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {!isNavMinimized && (
              <div className="p-2 bg-slate-800 border border-slate-700 rounded-full shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
            {!isNavMinimized && (
              <span className="font-serif text-slate-900 tracking-tight text-xs">
                Profile and Account
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsNavMinimized(!isNavMinimized)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title={isNavMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isNavMinimized ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Nav Items */}
        <div className="p-3 space-y-4 w-full flex flex-col items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                title={isNavMinimized ? tab.label : undefined}
                className={`w-[85%] flex items-center ${
                  isNavMinimized
                    ? "justify-center py-3 px-0 w-full"
                    : "justify-between px-3.5 py-3"
                } text-xs font-semibold transition-all relative cursor-pointer ${
                  isActive
                    ? "bg-orange-400/40 text-orange-800 shadow-sm rounded-3xl"
                    : "text-slate-600 hover:text-slate-900 bg-slate-200/30 border border-slate-200/60 hover:bg-slate-200/50 rounded-3xl"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-orange-800 shrink-0"
                        : "text-slate-400 shrink-0"
                    }
                  />
                  {!isNavMinimized && <span>{tab.label}</span>}
                </div>

                {!!tab.badge && tab.badge > 0 && (
                  <span
                    className={`${
                      isNavMinimized
                        ? "absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px]"
                        : "px-2 py-0.5 text-[10px]"
                    } bg-indigo-600 text-white font-mono font-bold rounded-full shadow-sm`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200/60 space-y-1.5">
        <button
          type="button"
          onClick={logout}
          title={isNavMinimized ? "Log Out" : undefined}
          className={`w-full flex items-center cursor-pointer ${
            isNavMinimized
              ? "justify-center py-3"
              : "justify-start gap-3 px-3.5 py-3"
          } rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors`}
        >
          <LogOut size={18} className="shrink-0" />
          {!isNavMinimized && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
