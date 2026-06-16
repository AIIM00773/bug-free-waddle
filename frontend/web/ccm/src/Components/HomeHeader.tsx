import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    PanelLeft,
    ShoppingBag,
    LogIn,
    MoreVertical,
    Settings,
    HelpCircle,
    UserPlus2,
    User2Icon,
    Sparkles,
    BrainCircuit
} from 'lucide-react';
import { useAuth } from '../Providers/AuthContex';
import { useConversations } from '../Providers/ConversationContext';
import SokoLogo from '../Constants/Logo';

export default function HomeHeader() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [actionsOpen, setActionsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Context Layer Bindings
    const { isAuthenticated, setAuthRoute } = useAuth();
    const { searchType, changeChatType } = useConversations();

    useEffect(() => {
        setCartCount(0);
    }, []);

    // Automatically closes dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActionsOpen(false);
            }
        }
        if (actionsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [actionsOpen]);

    return (
        <header className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 via-slate-50/85 to-transparent flex items-center px-6 justify-between z-20 select-none">
            {/* Left Section */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    {!sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 bg-white/80 border border-slate-200/60 backdrop-blur-md hover:bg-slate-100 active:bg-slate-200 rounded-xl transition text-slate-500 hover:text-slate-800 shadow-xs cursor-pointer"
                        >
                            <PanelLeft className="h-4 w-4" />
                        </button>
                    )}
                    <SokoLogo />
                </div>

                {/* Search Mode Toggle Engine - Leverages Production Provider State Mutators */}
                <div className="hidden md:inline-flex p-1 bg-slate-100/60 border border-slate-200/40 backdrop-blur-sm rounded-xl shadow-xs transition-all">
                    <button
                        type="button"
                        onClick={() => changeChatType('intelligent_search')}
                        className={`flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-200 cursor-pointer
                        ${searchType === 'intelligent_search'
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
                            }`}
                    >
                        <Sparkles className={`h-3.5 w-3.5 transition-colors ${searchType === 'intelligent_search' ? 'text-amber-500' : 'text-slate-400'}`} />
                        Intelligent
                    </button>

                    <button
                        type="button"
                        onClick={() => changeChatType('direct_search')}
                        className={`flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-200 cursor-pointer
                        ${searchType === 'direct_search'
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
                            }`}
                    >
                        <BrainCircuit className={`h-3.5 w-3.5 transition-colors ${searchType === 'direct_search' ? 'text-indigo-500' : 'text-slate-400'}`} />
                        Direct 
                    </button>
                </div>
            </div>

            {/* Right Section / Actions Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setActionsOpen(!actionsOpen)}
                    className={`p-2 rounded-xl transition-all duration-200 active:scale-[0.97] border cursor-pointer ${actionsOpen
                        ? 'bg-slate-900 border-slate-950 text-white shadow-sm'
                        : 'bg-white border-slate-200/60 hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-xs'
                        }`}
                    title="More Actions"
                >
                    <MoreVertical className="h-4 w-4 stroke-[2.2]" />
                </button>

                {actionsOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-30 animate-fadeIn flex flex-col divide-y divide-slate-100">
                        {/* Auth / Cart Section */}
                        <div className="px-2 pb-1.5 space-y-0.5">
                            {!isAuthenticated && (
                                <>
                                    <Link
                                        to="/auth"
                                        onClick={() => { setActionsOpen(false); setAuthRoute("login"); }}
                                        className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5"
                                    >
                                        <LogIn className="h-4 w-4 text-slate-400" />
                                        <span>Sign In</span>
                                    </Link>
                                    <Link
                                        to="/auth"
                                        onClick={() => { setActionsOpen(false); setAuthRoute("signup"); }}
                                        className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5"
                                    >
                                        <UserPlus2 className="h-4 w-4 text-slate-400" />
                                        <span>Sign Up</span>
                                    </Link>
                                </>
                            )}

                            {isAuthenticated && (
                                <Link
                                    to="/profile/?tab=cart"
                                    onClick={() => setActionsOpen(false)}
                                    className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <ShoppingBag className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition" />
                                        <span>View Shopping Cart</span>
                                    </div>
                                    {cartCount > 0 && (
                                        <span className="bg-emerald-600 text-white font-bold font-mono text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </div>

                        {/* Settings & App Information Info Section */}
                        <div className="px-2 pt-1.5 space-y-0.5">
                            {isAuthenticated && (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setActionsOpen(false)}
                                        className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5"
                                    >
                                        <User2Icon className="h-4 w-4 text-slate-400" />
                                        <span>Profile</span>
                                    </Link>

                                    <Link
                                        to="/profile?tab=Settings"
                                        onClick={() => setActionsOpen(false)}
                                        className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5"
                                    >
                                        <Settings className="h-4 w-4 text-slate-400" />
                                        <span>Preferences & Settings</span>
                                    </Link>
                                </>
                            )}
                            <Link
                                to="/support"
                                onClick={() => setActionsOpen(false)}
                                className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5"
                            >
                                <HelpCircle className="h-4 w-4 text-slate-400" />
                                <span>Help & Support</span>
                            </Link>
                            <Link
                                to="/about"
                                onClick={() => setActionsOpen(false)}
                                className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5"
                            >
                                <HelpCircle className="h-4 w-4 text-slate-400" />
                                <span>About Soko AI</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}