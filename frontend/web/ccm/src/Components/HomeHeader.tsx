import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    PanelLeft,
    ShoppingBag,
    LogIn,
    MoreVertical,
    Settings,
    HelpCircle,
    UserPlus2
} from 'lucide-react';
import { useAuth } from '../Providers/AuthContex';
import SokoLogo from '../Constants/Logo';

export default function HomeHeader() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [actionsOpen, setActionsOpen] = useState(false);
    const [cartCount, setcartCount] = useState(0);
    useEffect(()=>{setcartCount(0)},[])

    const {
        isAuthenticated,
        changeAuthRoute,
    } = useAuth();



    return (
        <header className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent flex items-center px-6 justify-between shrink-0 z-20 select-none pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto">
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 bg-white/80 border border-slate-200/60 backdrop-blur-md hover:bg-slate-100 active:bg-slate-200 rounded-xl transition text-slate-500 hover:text-slate-800 shadow-xs"
                    >
                        <PanelLeft className="h-4 w-4" />
                    </button>
                )}
                {/* <span className="font-black text-xs tracking-wider text-slate-900 bg-white/80 border border-slate-200/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-xs uppercase">
                </span> */}
                <SokoLogo />
            </div>

            <div className="relative pointer-events-auto">
                <button
                    onClick={() => setActionsOpen(!actionsOpen)}
                    className={`p-2 rounded-xl transition-all duration-200 active:scale-[0.97] border ${actionsOpen
                        ? 'bg-slate-900 border-slate-950 text-white shadow-sm'
                        : 'bg-white border-slate-200/60 hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-xs'
                        }`}
                    title="More Actions"
                >
                    <MoreVertical className="h-4 w-4 stroke-[2.2]" />
                </button>

                {actionsOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setActionsOpen(false)} />
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-20 animate-fadeIn flex flex-col divide-y divide-slate-100">
                            <div className="px-2 pb-1.5 space-y-0.5">
                                {!isAuthenticated && (
                                    <>
                                        <Link to="/auth" onClick={() => { setActionsOpen(false); changeAuthRoute("login") }} className="w-full">
                                            <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                                <LogIn className="h-4 w-4 text-slate-400" />
                                                <span>Sign In</span>
                                            </button>
                                        </Link>
                                        <Link to="/auth" onClick={() => { setActionsOpen(false); changeAuthRoute("signup") }} className="w-full">
                                            <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                                <UserPlus2 className="h-4 w-4 text-slate-400" />
                                                <span>Sign Up</span>
                                            </button>
                                        </Link>
                                    </>
                                )}

                                {isAuthenticated && (
                                    <Link to="/cart" onClick={() => setActionsOpen(false)} className="w-full">
                                        <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center justify-between group">
                                            <div className="flex items-center gap-2.5">
                                                <ShoppingBag className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition" />
                                                <span>View Shopping Cart</span>
                                            </div>
                                            {cartCount > 0 && (
                                                <span className="bg-emerald-600 text-white font-bold font-mono text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </button>
                                    </Link>
                                )}
                            </div>

                            <div className="px-2 pt-1.5 space-y-0.5">
                                {isAuthenticated && (
                                    <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                        <Settings className="h-4 w-4 text-slate-400" />
                                        <span>Preferences</span>
                                    </button>
                                )}
                                <Link to="/support" onClick={() => setActionsOpen(false)} className="w-full">
                                    <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                        <HelpCircle className="h-4 w-4 text-slate-400" />
                                        <span>Help & Support</span>
                                    </button>
                                </Link>
                                <Link to="/about" onClick={() => setActionsOpen(false)} className="w-full">
                                    <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                        <HelpCircle className="h-4 w-4 text-slate-400" />
                                        <span>About Soko AI</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>

    )
}