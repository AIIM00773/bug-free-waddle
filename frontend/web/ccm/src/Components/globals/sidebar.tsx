import React, { useEffect } from 'react';
import {
  Plus,
  Box,
  History,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  ShoppingCart,
  Settings,
  Wallet,
  Store,
} from 'lucide-react';

import { useCart } from '../../Providers/CartContext';
import { useAuth } from '../../Providers/profileContext';
import { useSidebar } from '../../Providers/ui/sidebar';

// ==========================================
// Types & Interfaces
// ==========================================
export interface SidebarProps {
  sessions?: Array<{ id: string; title: string }>;
  activeSessionId?: string | null;
  setActiveSessionId: (id: string | null) => void;
  handleDeleteSession?: (id: string) => void;
  setIsProfileOpen: (open: boolean) => void;
  settingOpen?: boolean;
  setSettingOpen?: (open: boolean) => void;
  setIsOrdersOpen?: (open: boolean) => void;
  isOrdersOpen?: boolean;
  isCartOpen?: boolean;
  setIsCartOpen?: (open: boolean) => void;
  isCheckoutOpen?: boolean;
  setIsCheckoutOpen?: (open: boolean) => void;
}

// ==========================================
// Main Sidebar Component
// ==========================================
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
  const { cart } = useCart();
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
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs transition-opacity md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Shell: Clean background with light slate border */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-slate-200/80 bg-white p-3 select-none transition-all duration-300 ease-in-out md:static ${
          isExpanded ? 'w-60' : 'w-16 items-center'
        } ${
          onMobile.open
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex w-full flex-col space-y-4 overflow-y-auto overflow-x-hidden no-scrollbar">
          {/* Top Logo & Toggle Header */}
          <div
            className={`flex items-center ${
              isExpanded ? 'justify-between px-1 py-1' : 'justify-center py-1'
            }`}
          >
            <div
              onClick={handleNewChat}
              className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80"
              title="Soko AI"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-900 ${!isExpanded ?'hidden':''}`}>
                <Store className="h-4 w-4" />
              </div>

              {isExpanded && (
                <span className="text-base font-semibold tracking-tight text-slate-900">
                  Soko AI
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleSidebar}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800"
              title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isExpanded ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* New Thread / Local Search CTA Button */}
          <button
            type="button"
            onClick={handleNewChat}
            className={`group flex items-center rounded-full border border-slate-200 bg-slate-50 font-medium text-xs text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-[0.98] ${
              isExpanded
                ? 'w-full justify-between px-3.5 py-2.5'
                : 'h-9 w-9 justify-center'
            }`}
            title="New Local Search (Ctrl+K)"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-slate-700 transition-transform group-hover:rotate-90" />
              {isExpanded && <span className="font-semibold">New Local Search</span>}
            </div>
            {isExpanded && (
              <kbd className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 sm:inline-block">
                ⌘K
              </kbd>
            )}
          </button>

          {/* Core Navigation Links */}
          <nav className="space-y-1 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setIsCartOpen?.(!isCartOpen)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-slate-100 hover:text-slate-900 ${
                isCartOpen ? 'bg-slate-100 text-slate-900 font-semibold' : ''
              } ${!isExpanded && 'justify-center px-0'}`}
              title="Shopping Cart"
            >
              <ShoppingCart className="h-4 w-4 shrink-0 text-slate-500" />
              {isExpanded && <span>Cart</span>}
            </button>

            <button
              type="button"
              onClick={() => setIsOrdersOpen?.(!isOrdersOpen)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-slate-100 hover:text-slate-900 ${
                isOrdersOpen ? 'bg-slate-100 text-slate-900 font-semibold' : ''
              } ${!isExpanded && 'justify-center px-0'}`}
              title="My Orders"
            >
              <Box className="h-4 w-4 shrink-0 text-slate-500" />
              {isExpanded && <span>Orders</span>}
            </button>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen?.(!isCheckoutOpen)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-slate-100 hover:text-slate-900 ${
                isCheckoutOpen ? 'bg-slate-100 text-slate-900 font-semibold' : ''
              } ${!isExpanded && 'justify-center px-0'}`}
              title="Checkouts"
            >
              <Wallet className="h-4 w-4 shrink-0 text-slate-500" />
              {isExpanded && <span>Checkouts</span>}
            </button>

            <button
              type="button"
              onClick={() => setSettingOpen?.(!settingOpen)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-slate-100 hover:text-slate-900 ${
                settingOpen ? 'bg-slate-100 text-slate-900 font-semibold' : ''
              } ${!isExpanded && 'justify-center px-0'}`}
              title="Settings"
            >
              <Settings className="h-4 w-4 shrink-0 text-slate-500" />
              {isExpanded && <span>Settings</span>}
            </button>
          </nav>

          <div className="my-1 border-t border-slate-100" />

          {/* Session History Stream */}
          <div className="flex-1 space-y-1">
            {isExpanded ? (
              <div className="mb-2 flex items-center justify-between px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                <span className="flex items-center gap-1.5">
                  <History className="h-3 w-3 text-slate-400" />
                  Recent Searches
                </span>
                {sessions.length > 0 && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 font-mono">
                    {sessions.length}
                  </span>
                )}
              </div>
            ) : (
              <div
                className="flex justify-center py-2 text-slate-400"
                title="Recent Searches"
              >
                <History className="h-4 w-4" />
              </div>
            )}

            <div className="space-y-1">
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
                    className={`group relative flex w-full items-center justify-between text-xs transition-all ${
                      isExpanded
                        ? 'rounded-xl px-3 py-2'
                        : 'justify-center rounded-lg p-2'
                    } ${
                      isActive
                        ? 'bg-slate-900 font-medium text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
                            className={`rounded-lg p-1 transition-opacity ${
                              isActive
                                ? 'text-white/70 hover:bg-slate-800 hover:text-white'
                                : 'text-slate-400 opacity-0 hover:bg-slate-200 hover:text-red-500 group-hover:opacity-100'
                            }`}
                            title="Delete Thread"
                          >
                            <Trash2 className="h-3 w-3" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? 'bg-slate-900' : 'bg-slate-300'
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
        <div className="w-full pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleProtectedAction(() => setIsProfileOpen(true))}
            className={`flex w-full items-center gap-2.5 rounded-xl p-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 ${
              !isExpanded && 'justify-center'
            }`}
            title={isAuthenticated ? user?.name || 'Profile' : 'Sign In'}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-semibold">
              {isAuthenticated && user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            {isExpanded && (
              <div className="flex flex-col text-left truncate">
                <span className="truncate font-semibold text-slate-900">
                  {isAuthenticated ? user?.name || 'Account' : 'Sign In'}
                </span>
                {isAuthenticated && user?.email && (
                  <span className="truncate text-[10px] text-slate-400">
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
