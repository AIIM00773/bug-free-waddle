import React, { useEffect, useState } from "react";
import {
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { useAuth } from "./Providers/AuthContex"; // Ensure your spelling matches file path
import type {  AuthRoute } from "./Providers/AuthContex"; // Ensure your spelling matches file path

import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const {
        user,
        isAuthenticated,
        authRoute,
        setAuthRoute,
        login,
        signUp,
        forgotPassword,
        resetPassword,
        isLoading,
        authError,
        clearAuthError
    } = useAuth();

    const navigate = useNavigate();

    /* ================= LOCAL STATE ================= */
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        newPassword: "",
        agreeToTerms: false,
    });

    /* ================= AUTHENTICATION GUARDS ================= */
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate("/shop");
        }
    }, [isAuthenticated, user, navigate]);

    /* ================= REGEX HELPER ================= */
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* ================= EVENT HANDLERS ================= */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (localError) setLocalError(null);
        if (authError) clearAuthError();
    };

    const handleRouteSwitch = (route: AuthRoute) => {
        setLocalError(null);
        setSuccessMessage(null);
        clearAuthError();

        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            password: "",
            newPassword: "",
            agreeToTerms: false,
        });

        setAuthRoute(route);
    };

    /* ================= FORM SUBMISSION PROCESSOR ================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setLocalError(null);
        setSuccessMessage(null);

        try {
            switch (authRoute) {
                case "login": {
                    if (!formData.phone || !formData.password) {
                        setLocalError("Please fill in both your phone number and password.");
                        return;
                    }
                    await login(formData.phone.trim(), formData.password);
                    break;
                }

                case "signup": {
                    if (
                        !formData.first_name.trim() ||
                        !formData.last_name.trim() ||
                        !formData.email.trim() ||
                        !formData.phone.trim() ||
                        !formData.password.trim()
                    ) {
                        setLocalError("All registration fields are required.");
                        return;
                    }

                    if (!EMAIL_REGEX.test(formData.email)) {
                        setLocalError("Please enter a structurally valid email address.");
                        return;
                    }

                    if (formData.password.length < 8) {
                        setLocalError("Password must be at least 8 characters long.");
                        return;
                    }

                    if (!formData.agreeToTerms) {
                        setLocalError("You must read and accept the Terms & Conditions to proceed.");
                        return;
                    }

                    await signUp(
                        formData.email.trim().toLowerCase(),
                        formData.password.trim(),
                        formData.first_name.trim(),
                        formData.last_name.trim(),
                        formData.phone.trim()
                    );
                    break;
                }

                case "forgot-password": {
                    if (!formData.email) {
                        setLocalError("Please input your recovery email address.");
                        return;
                    }

                    if (!EMAIL_REGEX.test(formData.email)) {
                        setLocalError("Please input a valid recovery email target structure.");
                        return;
                    }

                    await forgotPassword(formData.email.trim().toLowerCase());
                    setSuccessMessage("A password reset link has been dispatched to your email.");
                    setFormData((p) => ({ ...p, email: "" }));
                    break;
                }

                case "reset-password": {
                    if (!formData.newPassword) {
                        setLocalError("Please provide your new selection password.");
                        return;
                    }

                    if (formData.newPassword.length < 8) {
                        setLocalError("New password choices must meet the 8-character ceiling minimum.");
                        return;
                    }

                    await resetPassword(formData.newPassword.trim());
                    setSuccessMessage("Password altered cleanly. Routing back to lockscreen portal...");
                    setFormData((p) => ({ ...p, newPassword: "" }));
                    break;
                }
            }
        } catch (err: any) {
            setLocalError(err?.message || "An unhandled authentication event fault triggered.");
        }
    };

    /* ================= INTERFACE CONFIG FLAGS ================= */
    const isLogin = authRoute === "login";
    const isSignUp = authRoute === "signup";
    const isForgot = authRoute === "forgot-password";
    const isReset = authRoute === "reset-password";

    const activeError = localError || authError;

    // Early layout skip loop if security flags verified
    if (isAuthenticated && user) return null;

    return (
        <div className="min-h-screen w-screen flex bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500/20">
            
            {/* LEFT PANEL: MARKETEERING BRAND DISPLAY */}
            <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-emerald-50 to-slate-100 p-12 border-r border-slate-200">
                <div className="flex flex-col justify-between h-full w-full max-w-md mx-auto">
                    <div className="font-black text-2xl tracking-tight text-emerald-600">SokoAI</div>

                    <div>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight mb-4">
                            Smarter shopping <br />starts right here.
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Access live AI-powered product deep-scrapers, cross-marketplace price variance analysis, and instant discovery engines throughout Kenyan digital storefronts.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-sm w-fit">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        Next-Gen Marketplace Intelligence Encryption
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: CORE ACTION INTERACTIVE CONTENT LAYER */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-[440px] bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl shadow-slate-100/50">
                    
                    {/* ROUTE SPECIFIC CONTENT TITLE META */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {isLogin && "Welcome back"}
                            {isSignUp && "Create your account"}
                            {isForgot && "Recover credentials"}
                            {isReset && "Set secure password"}
                        </h2>
                        <p className="text-xs font-medium text-slate-400 mt-1.5">
                            {isLogin && "Access your personalized Soko workspace platform dashboard."}
                            {isSignUp && "Begin comparing pricing across localized digital vendors."}
                            {isForgot && "Provide structural target email routing metrics below."}
                            {isReset && "Update token parameter payload safely via backend engine."}
                        </p>
                    </div>

                    {/* DYNAMIC VALIDATION NOTIFICATION BANNERS */}
                    {activeError && (
                        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex gap-2.5 items-start animate-fadeIn">
                            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                            <span>{activeError}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-xl flex gap-2.5 items-start animate-fadeIn">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* INPUT FORM SCHEMATICS */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* FIRST & LAST NAME FIELDS */}
                        {isSignUp && (
                            <div className="grid grid-cols-2 gap-3.5 duration-200 ease-in-out">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600">First Name</label>
                                    <input
                                        name="first_name"
                                        type="text"
                                        required
                                        placeholder="e.g., John"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600">Last Name</label>
                                    <input
                                        name="last_name"
                                        type="text"
                                        required
                                        placeholder="e.g., Doe"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ACCOUNT PARAMETERS SECTION */}
                        {!isReset && (
                            <div className="space-y-4">
                                {/* Conditional Email (Omit from direct Login processing route) */}
                                {!isLogin && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-600">Email Address</label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="you@domain.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
                                        />
                                    </div>
                                )}

                                {/* Phone Field Configuration */}
                                {!isForgot && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-600">Phone Number</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            required
                                            placeholder="e.g., 0712345678"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PASSWORDS LAYER HANDLING */}
                        {(isLogin || isSignUp) && (
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-slate-600">Password</label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={() => handleRouteSwitch("forgot-password")}
                                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative flex items-center">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-3.5 pr-11 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* RESET MUTATION FIELD OVERLAY */}
                        {isReset && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600">New Password</label>
                                <input
                                    name="newPassword"
                                    type="password"
                                    required
                                    placeholder="Set new string token"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
                                />
                            </div>
                        )}

                        {/* LEGAL COMPLIANCE TIER SELECTOR */}
                        {isSignUp && (
                            <label className="flex items-start gap-2.5 cursor-pointer py-1 select-none group">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 accent-emerald-600"
                                />
                                <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                                    I certify that I accept the Soko AI platform data parsing <span className="text-emerald-600 underline font-semibold">Terms & Privacy Policies</span>.
                                </span>
                            </label>
                        )}

                        {/* EXECUTION FORWARD BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-600/50 text-white text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 group transition-all duration-150 shadow-sm shadow-emerald-600/10 active:scale-[0.985] disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                                <>
                                    {isLogin && "Sign in to workspace"}
                                    {isSignUp && "Create access profile"}
                                    {isForgot && "Transmit recovery link"}
                                    {isReset && "Save changes"}
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* DYNAMIC ALTERNATIVE PATH LINKS */}
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-center text-slate-500">
                        {isLogin && (
                            <p>
                                New to our marketplace context?{" "}
                                <button onClick={() => handleRouteSwitch("signup")} className="text-emerald-600 font-bold hover:underline">
                                    Register free account
                                </button>
                            </p>
                        )}
                        {isSignUp && (
                            <p>
                                Already possess an allocation space?{" "}
                                <button onClick={() => handleRouteSwitch("login")} className="text-emerald-600 font-bold hover:underline">
                                    Sign in instead
                                </button>
                            </p>
                        )}
                        {(isForgot || isReset) && (
                            <button onClick={() => handleRouteSwitch("login")} className="text-emerald-600 font-bold hover:underline">
                                Terminate attempt and return to login screen
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}