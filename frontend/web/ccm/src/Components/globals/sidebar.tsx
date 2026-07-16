import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings, 
  CreditCard,
  User,
  PanelLeftClose,
  Menu
} from 'lucide-react';

export function Sidebar({ 
  sessions = [],
  activeSessionId,
  setActiveSessionId,
  handleDeleteSession
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Safe navigation helper for responsive viewports
  const handleNavigation = (action) => {
    action();
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    handleNavigation(() => setActiveSessionId(null));
  };

  return (
    <>
      {/* Mobile Floating Toggle Button (Visible only when sidebar is completely closed) */}
      {!sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-45 p-2 bg-[#384959] hover:bg-[#2e3b48] rounded-lg text-stone-200 border border-stone-600/30 md:hidden transition-all shadow-md"
          title="Open sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      <aside 
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#384959] border-r border-stone-700/40 transition-all duration-300 ease-in-out px-3 py-3.5 h-screen select-none
          ${sidebarOpen ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full md:w-[68px] md:translate-x-0 md:px-2'}
        `}
      >
        {!sidebarOpen ? (
          /* COLLAPSED STATE (Saves desktop space, displays icon-only actions) */
          <div className="hidden md:flex flex-col items-center gap-4 h-full justify-between">
            <div className="flex flex-col items-center gap-4 w-full">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-stone-700/50 rounded-lg text-stone-300 hover:text-white transition-all"
                title="Open sidebar"
              >
                <Menu size={18} />
              </button>
              <button 
                onClick={handleNewChat}
                className="p-2 bg-stone-700/35 hover:bg-stone-700/60 rounded-lg text-stone-200 hover:text-white transition-all border border-stone-600/30"
                title="New Chat"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-3 w-full">
              <button className="p-2 hover:bg-stone-700/50 rounded-lg text-stone-300 hover:text-white transition-all" title="Upgrade Plan">
                <CreditCard size={18} />
              </button>
              <button className="p-2 hover:bg-stone-700/50 rounded-lg text-stone-300 hover:text-white transition-all" title="Settings">
                <Settings size={18} />
              </button>
              <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center text-stone-200 border border-stone-600/55 cursor-pointer" title="User Account">
                <User size={16} />
              </div>
            </div>
          </div>
        ) : (
          /* EXPANDED STATE */
          <div className="flex flex-col h-full justify-between w-full overflow-hidden">
            {/* Main Header & Session History List */}
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between gap-2">
                <button 
                  onClick={handleNewChat}
                  className="flex-1 flex items-center justify-between py-2 px-3 bg-stone-700/30 hover:bg-stone-700/50 active:scale-95 rounded-lg border border-stone-600/40 text-xs font-semibold text-stone-200 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Plus size={16} className="text-stone-300" />
                    <span>New chat</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">⌘K</span>
                </button>

                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="p-2 hover:bg-stone-700/50 rounded-lg text-stone-300 hover:text-white transition-all shrink-0"
                  title="Close sidebar"
                >
                  <PanelLeftClose size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
                <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider px-2 py-1">
                  Chat History
                </div>
                
                <div className="space-y-0.5">
                  {sessions.length > 0 ? (
                    sessions.map((session) => {
                      const isActive = activeSessionId === session.id;
                      return (
                        <div 
                          key={session.id}
                          onClick={() => handleNavigation(() => setActiveSessionId(session.id))}
                          className={`group w-full py-2 px-2.5 rounded-lg text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            isActive 
                              ? 'bg-stone-700/60 text-white font-medium border border-stone-600/30' 
                              : 'text-stone-300 hover:bg-stone-700/30 hover:text-white' 
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate flex-1">
                            <MessageSquare size={14} className={`shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                            <span className="truncate">{session.title}</span>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents clicking delete from selecting the tab
                              handleDeleteSession(session.id, e);
                            }} 
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-stone-600/55 rounded text-stone-400 hover:text-rose-400 transition-all shrink-0" 
                            title="Delete Chat"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-stone-400 text-xs italic">
                      No active conversations
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Account & Navigation Footer */}
            <div className="border-t border-stone-700/50 pt-2 mt-auto space-y-1">
              <button className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-xs text-stone-300 hover:bg-stone-700/40 hover:text-white transition-all">
                <CreditCard size={15} className="text-stone-400" />
                <span className="font-medium">Upgrade Plan</span>
              </button>

              <button className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-xs text-stone-300 hover:bg-stone-700/40 hover:text-white transition-all">
                <Settings size={15} className="text-stone-400" />
                <span className="font-medium">Settings</span>
              </button>

              <div className="flex items-center justify-between bg-transparent p-1.5 rounded-lg hover:bg-stone-700/40 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center text-stone-200 shrink-0 border border-stone-600/40">
                    <User size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-200 truncate font-medium">User Account</p>
                    <p className="text-[10px] text-stone-400 truncate">user@sokoai.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
