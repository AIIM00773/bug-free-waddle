import React, { useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Monitor,
  Grid,
  Box,
  SlidersHorizontal,
  History,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  Compass,
  ShoppingCart,
  Settings,
  Wallet
} from 'lucide-react';

import { useCart } from '../../Providers/CartContext';
import { useAuth } from '../../Providers/profileContext';
import { useSidebar } from '../../Providers/ui/sidebar';

export interface SidebarProps {
  sessions?: Array<{ id: string; title: string }>;
  activeSessionId?: string | null;
  setActiveSessionId: (id: string | null) => void;
  handleDeleteSession?: (id: string) => void;
  setIsProfileOpen: (open: boolean) => void;
  settingOpen?: boolean;
  setSettingOpen?: (open: boolean) => void;
  setIsOrdersOpen?:(open:boolean) => void; 
  isOrdersOpen?:boolean;
  isCartOpen?:boolean;
  setIsCartOpen?:(open:boolean) => void;
  isCheckoutOpen?:boolean;
  setIsCheckoutOpen?:(open:boolean) => void; 
};




export function Sidebar({
  sessions = [],
  activeSessionId,
  setActiveSessionId,
  handleDeleteSession,
  setIsProfileOpen,
  settingOpen,
  setSettingOpen,
  setIsOrdersOpen,
  isOrdersOpen,
  isCartOpen,
  setIsCartOpen,
  isCheckoutOpen,
  setIsCheckoutOpen,
  
  
}: SidebarProps) {
  const { cart, openCart, setOpenCart } = useCart();
  const { user, isAuthenticated, setProceedWithoutAuth } = useAuth();

  // Consume mobile & desktop states/actions from sidebarContext
  const { onMobile, onDesktop } = useSidebar();

  // Unified state for whether the sidebar is currently open/expanded
  const isExpanded = onMobile.open || !onDesktop.minimized;

  // Safe navigation helper for responsive mobile viewports
  const handleNavigation = (action: () => void) => {
    action();
    if (window.innerWidth < 768 && onMobile.open) {
      onMobile.toggleOpen();
    }
  };

  const handleNewChat = () => {
    handleNavigation(() => setActiveSessionId(null));
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      onMobile.toggleOpen();
    } else {
      onDesktop.toggleMinimize();
    }
  };

  const handleProtectedAction = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      setProceedWithoutAuth(false);
    }
  };

  // Keyboard Shortcut: CMD+K / CTRL+K to trigger New Chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {onMobile.open && (
        <div
          onClick={() => onMobile.toggleOpen()}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-[#2e3030] bg-[#191a1a] p-3 select-none transition-all duration-300 ease-in-out md:static ${
          isExpanded ? 'w-50' : 'w-15'
        } ${
          onMobile.open
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col space-y-4 overflow-y-auto overflow-x-hidden no-scrollbar">
          
          {/* Top Logo & Toggle Header */}
          <div
            className={`flex items-center ${
              isExpanded ? 'justify-between px-1.5 py-1' : 'justify-center py-1'
            }`}
          >
            <div
              onClick={handleNewChat}
              className="flex cursor-pointer items-center gap-2 rounded-lg transition-opacity hover:opacity-80"
              title="Soko AI"
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 ${isExpanded ? '' : 'hidden'} `}>
                <Sparkles className="h-4 w-4" />
              </div>

              {isExpanded && (
                <span className="font-serif text-base font-medium tracking-tight text-white">
                  Soko AI
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleSidebar}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#202222] hover:text-white"
              title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isExpanded ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* New Thread Perplexity-Style CTA Button */}
          <button
            type="button"
            onClick={handleNewChat}
            className={`group flex items-center rounded-full border border-[#2e3030] bg-[#202222] font-medium text-xs text-gray-200 transition-all hover:border-teal-500/30 hover:bg-[#252727] active:scale-[0.98] ${
              isExpanded
                ? 'w-full justify-between px-3.5 py-2'
                : 'h-9 w-9 justify-center mx-auto'
            }`}
            title="New Thread (Ctrl+K)"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-teal-400 transition-transform group-hover:rotate-90" />
              {isExpanded && <span>New Thread</span>}
            </div>
            {isExpanded && (
              <kbd className="hidden rounded-md border border-[#3e4040] bg-[#141515] px-1.5 py-0.5 text-[10px] font-mono text-gray-400 sm:inline-block">
                ⌘K
              </kbd>
            )}
          </button>

          {/* Core Navigation Links */}
          <nav className="space-y-1 text-xs text-gray-400">
          
            <button
              type="button"
              onClick={()=>setIsCartOpen(!isCartOpen)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-[#202222] hover:text-white ${
                !isExpanded && 'justify-center px-0'
              }`}
              title="Shopping Cart">
              <ShoppingCart className="h-4 w-4 shrink-0 text-gray-400" />
              {isExpanded && <span>Cart  </span>}
            </button>

            
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-[#202222] hover:text-white ${
                !isExpanded && 'justify-center px-0'
              }`}
              title="my Orders "

              onClick={()=>setIsOrdersOpen(!isOrdersOpen)}
            >
              <Box className="h-4 w-4 shrink-0 text-gray-400" />
              {isExpanded && <span>Orders </span>}
            </button>



            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-[#202222] hover:text-white ${
                !isExpanded && 'justify-center px-0'
              }`}
              title="Checkouts... "

              onClick={()=>setIsCheckoutOpen(!isCheckoutOpen)}
            >
              <Wallet className="h-4 w-4 shrink-0 text-gray-400" />
              {isExpanded && <span>Checkouts </span>}
            </button>


            
            <button
              type="button"
              onClick={() => setSettingOpen?.(!settingOpen)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-[#202222] hover:text-white ${
                !isExpanded && 'justify-center px-0'
              }`}
              title="Settings"
            >
              <Settings className="h-4 w-4 shrink-0 text-gray-400" />
              {isExpanded && <span>Settings</span>}
            </button>
          </nav>




          <div className="my-1 border-t border-[#2e3030]" />
          

          {/* Session History Stream */}
          <div className="flex-1 space-y-1">
            {isExpanded ? (
              <div className="mb-2 flex items-center justify-between px-2 text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
                <span className="flex items-center gap-1.5">
                  <History className="h-3 w-3" />
                  Library
                </span>
                {sessions.length > 0 && (
                  <span className="rounded-full bg-[#202222] px-1.5 py-0.2 text-[10px] text-gray-400">
                    {sessions.length}
                  </span>
                )}
              </div>
            ) : (
              <div
                className="flex justify-center py-2 text-gray-500"
                title="Library History"
              >
                <History className="h-4 w-4" />
              </div>
            )}

            <div className="space-y-0.5">
              {sessions.map((session) => {
                const isActive = activeSessionId === session.id;
                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() =>
                      handleNavigation(() => setActiveSessionId(session.id))
                    }
                    title={session.title}
                    className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-all ${
                      !isExpanded && 'justify-center px-0'
                    } ${
                      isActive
                        ? 'bg-[#202222] font-medium text-white border-l-2 border-teal-400 pl-2.5'
                        : 'text-gray-400 hover:bg-[#1f2020] hover:text-gray-200'
                    }`}
                  >
                    {isExpanded ? (
                      <>
                        <span className="truncate pr-2">{session.title}</span>
                        {handleDeleteSession && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(session.id);
                            }}
                            className="rounded-lg p-1 text-gray-500 opacity-0 transition-opacity hover:bg-[#2e3030] hover:text-red-400 group-hover:opacity-100"
                            title="Delete Thread"
                          >
                            <Trash2 className="h-3 w-3" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? 'bg-teal-400' : 'bg-gray-600'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        

        {/* User Account / Profile Footer */}
        <div className="pt-2 border-t border-[#2e3030]">
          <button
            type="button"
            onClick={() => handleProtectedAction(() => setIsProfileOpen(true))}
            className={`flex w-full items-center gap-2.5 rounded-2xl p-2 text-xs font-medium text-gray-300 transition-colors hover:bg-[#202222] hover:text-white ${
              !isExpanded && 'justify-center'
            }`}
            title={isAuthenticated ? user?.name || 'Profile' : 'Sign In'}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-medium">
              {isAuthenticated && user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User className="h-3.5 w-3.5" />
              )}
            </div>
            {isExpanded && (
              <div className="flex flex-col text-left truncate">
                <span className="truncate font-medium text-gray-200">
                  {isAuthenticated ? user?.name || 'Account' : 'Sign In'}
                </span>
                {isAuthenticated && user?.email && (
                  <span className="truncate text-[10px] text-gray-500">
                    {user.email}
                  </span>
                )}
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
