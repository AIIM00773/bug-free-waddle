import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MessageSquare,
    PanelLeftClose,
    PanelLeftOpen,
    Plus,
    ShoppingCart,
    LogIn,
    User2,
    UserPlus2,
    Trash2
} from 'lucide-react';
import { useAuth } from "../Providers/AuthContex";
import { useConversations } from "../Providers/ConversationContext";

export default function HomeSider() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { isAuthenticated, setAuthRoute, isLoading } = useAuth();

    // Context Integration Layer Bindings
    const {
        conversationList,
        activeId,
        switchConversation,
        startNewChatFrame,
        deleteConversation
    } = useConversations();

    return (
        <>
            {/* FLOATING OPEN BUTTON OVERLAY */}
            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="fixed top-4 left-4 z-40 p-2.5 bg-white border border-slate-200 shadow-md rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                    title="Open Sidebar"
                >
                    <PanelLeftOpen className="h-4 w-4" />
                </button>
            )}

            {/* SIDEBAR CONTAINER FRAME */}
            <aside
                className={`h-full flex flex-col bg-white border-r border-slate-200/80 text-slate-700 transition-all duration-300 ease-in-out shrink-0 overflow-hidden relative z-30
                    ${sidebarOpen ? 'w-[260px]' : 'w-0 border-r-0'}
                `}
            >
                {/* HEADER ACTIONS BLOCK */}
                <div className="p-4 flex items-center justify-between gap-3 shrink-0 border-b border-slate-100/60">
                    <button
                        onClick={startNewChatFrame}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-3 py-2.5 text-xs font-bold w-full text-center transition-all shadow-sm shadow-emerald-600/10 active:scale-[0.98] cursor-pointer"
                    >
                        <Plus className="h-4 w-4 stroke-[2.5]" />
                        <span>New Search</span>
                    </button>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition shrink-0 cursor-pointer"
                        title="Close Sidebar"
                    >
                        <PanelLeftClose className="h-4 w-4" />
                    </button>
                </div>

                {/* DYNAMIC CONVERSATIONS SCROLL ENGINE */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
                    <span className="px-2.5 text-[10px] font-bold text-slate-400 uppercase block mb-3 tracking-wider select-none">
                        Recent Searches
                    </span>

                    <div className="space-y-0.5">
                        {conversationList.length > 0 ? (
                            conversationList.map((chat) => (
                                <div key={chat.id} className="group relative">
                                    <button
                                        onClick={() => switchConversation(chat.id)}
                                        className={`w-full text-left px-2.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition truncate pr-10 cursor-pointer
                                            ${activeId === chat.id
                                                ? 'bg-slate-100 text-slate-900 font-semibold'
                                                : 'text-slate-600 hover:bg-slate-50/80 hover:text-slate-900'
                                            }
                                        `}
                                    >
                                        <MessageSquare className={`h-3.5 w-3.5 shrink-0 transition
                                            ${activeId === chat.id ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-500'}
                                        `} />
                                        <span className="truncate">{chat.title}</span>
                                    </button>

                                    {/* DELETE TRIGGER DELEGATE */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Shield routing execution bubbling
                                            deleteConversation(chat.id);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                                        title="Delete chat log"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-8 text-center select-none">
                                <p className="text-[11px] text-slate-400 italic">No search metrics processed yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER INTERACTIVE ANCHOR ZONE */}
                <div className="p-3 border-t border-slate-200/60 bg-slate-50/50 shrink-0">

                    {/* RENDERS FOR REGISTERED ACTIVE ACCOUNT WORKSPACES */}
                    {isAuthenticated && !isLoading && (
                        <div className="space-y-0.5">
                            <Link to="/profile/?tab=cart"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition group"
                            >
                                <ShoppingCart className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition shrink-0" />
                                <span className="truncate">Shopping Cart</span>
                            </Link>

                            <Link to="/profile"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition group"
                            >
                                <User2 className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition shrink-0" />
                                <span className="truncate">Account Profile</span>
                            </Link>
                        </div>
                    )}

                    {/* RENDERS FOR ANONYMOUS VISITOR SESSIONS */}
                    {!isAuthenticated && !isLoading && (
                        <div className="grid grid-cols-2 gap-2">
                            <Link to="/auth"
                                onClick={() => setAuthRoute("login")}
                                className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 shadow-sm rounded-xl active:scale-[0.97] transition-all"
                            >
                                <LogIn className="h-3.5 w-3.5 text-slate-500" />
                                <span>Sign In</span>
                            </Link>

                            <Link to="/auth"
                                onClick={() => setAuthRoute("signup")}
                                className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm rounded-xl active:scale-[0.97] transition-all"
                            >
                                <UserPlus2 className="h-3.5 w-3.5 text-slate-300" />
                                <span>Sign Up</span>
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}