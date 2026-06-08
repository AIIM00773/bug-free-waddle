import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../Providers/AuthContex'; // Check if it needs a 't' at the end: AuthContext

export default function AuthAlertComponent() {
    const [isVisible, setIsVisible] = useState(true);
    const { changeAuthRoute, isAuthenticated,isLoading } = useAuth();

    // Don't render anything if the user closed the reminder
    if (!isVisible || !isLoading || isAuthenticated) return null;

    return (
        <div className="absolute top-2 right-1 w-full max-w-md z-50 animate-slideUp pointer-events-auto border border-[0.5px] border-orange-500 rounded-[5px]  ">
            <div className="relative overflow-hidden rounded-[20px]  border border-orange-200/60 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40 shadow-xl backdrop-blur-xl p-6">
                
                {/* Ambient background accent glows */}
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-200/20 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amber-200/20 blur-2xl pointer-events-none" />

                <div className="relative">
                    {/* Header Section */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-700 uppercase tracking-wide">
                                Smart Shopping
                            </span>
                            <h3 className="mt-3 text-lg font-bold text-slate-900 tracking-tight">
                                You are not Authenticated !.  
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                Sign-In  <span className='text-orange italic'>  </span>  to unlock the best experience .
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-all shrink-0"
                            aria-label="Close reminder"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Value Proposition List */}
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                        {[
                            "Save products across local marketplaces",
                            "Get alerts when historical prices drop",
                            "Unified structural search dashboards"
                        ].map((benefit, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2.5">
                                <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-3 w-3 text-orange-600" />
                                </div>
                                <span className="text-xs font-medium text-slate-700">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* Action Links Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                        <span>Already have an account?</span>
                        <Link
                            to="/auth"
                            className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
                            onClick={() => changeAuthRoute("login")}
                        >
                            Sign In
                        </Link>
                        <span className="text-slate-300">•</span>
                        <Link
                            to="/auth"
                            className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
                            onClick={() => changeAuthRoute("signup")}
                        >
                            Create Free Account 
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}