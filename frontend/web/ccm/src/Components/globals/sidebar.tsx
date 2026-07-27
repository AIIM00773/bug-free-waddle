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
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  X,
} from 'lucide-react';

import { useCart } from '../../Providers/CartContext';
import { useAuth } from '../../Providers/profileContext';
import { useSidebar } from '../../Providers/ui/sidebar';

export function Sidebar({
  sessions = [],
  activeSessionId,
  setActiveSessionId,
  handleDeleteSession,
  setIsProfileOpen,
  settingOpen,
  setSettingOpen,
}) {
  const { cart, openCart, setOpenCart } = useCart();
  const { user, isAuthenticated, setProceedWithoutAuth } = useAuth();

  // Consume mobile & desktop states/actions from sidebarContext
  const { onMobile, onDesktop } = useSidebar();

  // Unified state for whether the sidebar is currently open/expanded
  const isExpanded = onMobile.open || !onDesktop.minimized;

  // Safe navigation helper for responsive mobile viewports
  const handleNavigation = (action) => {
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

  const handleProtectedAction = (action) => {
    if (isAuthenticated) {
      action();
    } else {
      setProceedWithoutAuth(false);
    }
  };

  // Keyboard Shortcut: CMD+K / CTRL+K to trigger New Chat
  useEffect(() => {
    const handleKeyDown = (e) => {
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-[#262626] bg-[#141414] p-3 select-none transition-all
         duration-300 ease-in-out md:static ${isExpanded ? 'w-60' : 'w-16'} ${onMobile.open? 'translate-x-0': '-translate-x-full md:translate-x-0'}`}>
         
        <div className="flex flex-col space-y-4 overflow-y-auto overflow-x-hidden no-scrollbar">
          {/* Top Logo & Toggle Header */}
          <div className={`flex items-center ${ isExpanded ? 'justify-between px-1 py-1' : 'justify-center py-1'}`} >
            <div onClick={handleNewChat} className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1 transition-opacity hover:opacity-80" title="Home" >

             {isExpanded &&(
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400  ">
                <Sparkles className="h-4 w-4" />
              </div>
             )}

              {isExpanded && (<span className="text-sm font-bold tracking-wide text-white"> Soko AI</span>)}
            </div>
            <button type="button" onClick={handleToggleSidebar} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#222222] hover:text-white" title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}>
              {isExpanded ? (<PanelLeftClose className="h-4 w-4" />) : (<PanelLeftOpen className="h-4 w-4" />)}
            </button>
          </div>


          {/* New Thread CTA Button */}
          <button type="button" onClick={handleNewChat}
            className={`flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#1c1c1c] text-sm font-medium text-gray-200 transition-all hover:bg-[#262626] hover:text-white active:scale-95 ${isExpanded ? 'w-full justify-between px-3 py-2.5' : 'justify-center p-2.5' }`} title="New Chat (Ctrl+K)" >
            <div className="flex items-center gap-2.5">
              <Plus className="h-4 w-4 text-teal-400" />
              {isExpanded && <span>New Thread</span>}
            </div>
            {isExpanded && (
              <kbd className="hidden rounded bg-[#111111] px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 sm:inline-block">
                ⌘K
              </kbd>
            )}
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1 text-sm text-gray-400">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#222222] hover:text-white ${
                !isExpanded && 'justify-center px-0'
              }`}
              title="Computer"
            >
              <Monitor className="h-4 w-4 shrink-0 text-gray-400" />
              {isExpanded && <span>Computer</span>}
            </button>

            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#222222] hover:text-white ${
                !isExpanded && 'justify-center px-0'
              }`}
              title="Spaces"
            >
              <Grid className="h-4 w-4 shrink-0 text-gray-400" />
              {isExpanded && <span>Spaces</span>}
            </button>

            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#222222] hover:text-white ${
                !isExpanded && 'justify-center px-0'
              }`}
              title="Artifacts"
            >
              <Box className="h-4 w-4 shrink-0 text-gray-400" />
              {isExpanded && <span>Artifacts</span>}
            </button>

            <button
              type="button"
              onClick={() => setSettingOpen?.(!settingOpen)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#222222] hover:text-white ${
                !isExpanded && 'justify-center px-0'
              }`}
              title="Customize"
            >
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" />
              {isExpanded && <span>Customize</span>}
            </button>
          </nav>

          <div className="my-2 border-t border-[#262626]" />

          {/* Query Session History */}
          <div className="flex-1 space-y-1">
            {isExpanded ? (
              <div className="mb-2 flex items-center justify-between px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                <span className="flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" />
                  History
                </span>
                {sessions.length > 0 && (
                  <span className="text-[10px] text-gray-600">
                    {sessions.length}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex justify-center py-2 text-gray-500" title="History">
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
                    onClick={() => handleNavigation(() => setActiveSessionId(session.id))}
                    title={session.title}
                    className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-all ${
                      !isExpanded && 'justify-center px-0'
                    } ${
                      isActive
                        ? 'bg-[#222222] font-medium text-white border-l-2 border-teal-400'
                        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-200'
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
                            className="rounded p-1 text-gray-500 opacity-0 transition-opacity hover:bg-[#333333] hover:text-red-400 group-hover:opacity-100"
                            title="Delete Session"
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

        {/* User Auth Footer Button */}
        <div className="pt-2 border-t border-[#262626]">
          <button
            type="button"
            onClick={() => handleProtectedAction(() => setIsProfileOpen(true))}
            className={`flex w-full items-center gap-2.5 rounded-xl p-2 text-xs font-medium text-gray-300 transition-colors hover:bg-[#222222] hover:text-white ${
              !isExpanded && 'justify-center'
            }`}
            title={isAuthenticated ? user?.name || 'Profile' : 'Sign In'}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-900/50 border border-teal-500/30 text-teal-300 font-semibold">
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
