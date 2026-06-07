import React, { useState } from "react";
import { 
    Mail, 
    Lock, 
    User, 
    ArrowRight, 
    Eye, 
    EyeOff, 
    CheckCircle2, 
    AlertCircle,
    Loader2
} from "lucide-react";

import { useAuth } from "./Providers/AuthContex";
export default function AuthPage() {
    const { 
        authRoute, 
        changeAuthRoute, 
        login, 
        signUp, 
        forgotPassword, 
        resetPassword, 
        isLoading,
        authError 
    } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        newPassword: "", 
        agreeToTerms: false 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev, 
            [name]: type === "checkbox" ? checked : value
        }));
        // Clear local validation error notice once typing resumes
        if (localError) setLocalError(null);
    };

    const handleRouteSwitch = (route: typeof authRoute) => {
        setSuccessMessage(null);
        setLocalError(null);
        changeAuthRoute(route);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setSuccessMessage(null);

        try {
            switch (authRoute) {
                case "login":
                    if (!formData.email || !formData.password) {
                        setLocalError("Please enter your credentials.");
                        return;
                    }
                    await login(formData.email, formData.password);
                    break;

                case "signup":
                    if (!formData.name || !formData.email || !formData.password) {
                        setLocalError("All registration fields are required.");
                        return;
                    }
                    if (!formData.agreeToTerms) {
                        setLocalError("You must accept our Terms and Conditions to proceed.");
                        return;
                    }
                    await signUp(
                        formData.email.trim().toLowerCase(),
                        formData.password.trim(),
                        formData.name.trim()
                    );
                    break;

                case "forgot-password":
                    if (!formData.email) {
                        setLocalError("Please fill in your registered email account.");
                        return;
                    }
                    await forgotPassword(formData.email.trim().toLowerCase());
                    setSuccessMessage("A password reset link was successfully dispatched to your email address.");
                    break;

                case "reset-password":
                    if (!formData.newPassword) {
                        setLocalError("Please type a new secure password profile.");
                        return;
                    }
                    await resetPassword(formData.newPassword.trim());
                    setSuccessMessage("Your password was updated! Redirecting to login shortly...");
                    break;
            }
        } catch (err) {
            // Context provider logs errors to central hub, component manages fallback display states
            console.error("Authentication action intercept failure:", err);
        }
    };

    const isLogin = authRoute === "login";
    const isSignUp = authRoute === "signup";
    const isForgot = authRoute === "forgot-password";
    const isReset = authRoute === "reset-password";

    // Computed display alerts logic
    const activeError = localError || authError;

    return (
        <div className="min-h-screen w-screen flex bg-slate-50 font-sans text-slate-800">

            {/* ================= LEFT HERO ================= */}
            <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-emerald-100 to-slate-50 relative overflow-hidden flex-col justify-between p-12 text-slate-800 border-r border-slate-200/60">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                        S
                    </div>
                    <span className="font-bold text-slate-900">SokoAI</span>
                </div>

                <div className="max-w-sm space-y-6">
                    <h1 className="text-3xl font-black tracking-tight leading-tight">
                        Smarter shopping starts here
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        AI-powered discovery, comparison, and deals unified in one dashboard workspace.
                    </p>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Secure, enterprise-grade identity layer
                </div>
            </div>

            {/* ================= RIGHT FORM ================= */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-[400px] bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl transition-all duration-200">

                    {/* HEADER */}
                    <div className="mb-5">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">
                            {isLogin && "Welcome back"}
                            {isSignUp && "Create account"}
                            {isForgot && "Recover account"}
                            {isReset && "Reset password"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {isLogin && "Login to continue to your dashboard"}
                            {isSignUp && "Join SokoAI today"}
                            {isForgot && "Enter your email address to recover your access"}
                            {isReset && "Set a new secure password profile"}
                        </p>
                    </div>

                    {/* DYNAMIC ERROR BOX SYSTEM */}
                    {activeError && (
                        <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-800 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                            <span className="font-medium leading-relaxed">{activeError}</span>
                        </div>
                    )}

                    {/* DYNAMIC SUCCESS BOX SYSTEM */}
                    {successMessage && (
                        <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                            <span className="font-medium leading-relaxed">{successMessage}</span>
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* ================= NAME ================= */}
                        {isSignUp && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Full Name
                                </label>
                                <div className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-slate-300">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-500 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600 transition">
                                        <User className="h-3.5 w-3.5" />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        disabled={isLoading}
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none disabled:opacity-60"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ================= EMAIL ================= */}
                        {!isReset && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <div className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-slate-300">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-500 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600 transition">
                                        <Mail className="h-3.5 w-3.5" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                        className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none disabled:opacity-60"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ================= PASSWORD ================= */}
                        {(isLogin || isSignUp) && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Password
                                    </label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() => handleRouteSwitch("forgot-password")}
                                            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition disabled:opacity-50"
                                        >
                                            Forgot?
                                        </button>
                                    )}
                                </div>
                                <div className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-slate-300">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-500 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600 transition">
                                        <Lock className="h-3.5 w-3.5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        disabled={isLoading}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none disabled:opacity-60"
                                    />
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="text-slate-400 hover:text-slate-600 transition p-0.5"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ================= RESET PASSWORD ================= */}
                        {isReset && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    New Password
                                </label>
                                <div className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-slate-300">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-500 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600 transition">
                                        <Lock className="h-3.5 w-3.5" />
                                    </div>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        required
                                        disabled={isLoading}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new secure password"
                                        className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none disabled:opacity-60"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ================= TERMS AND CONDITIONS CHECKBOX ================= */}
                        {isSignUp && (
                            <div className="flex items-start gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    disabled={isLoading}
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="mt-0.5 accent-emerald-600 h-3.5 w-3.5 rounded border-slate-300 focus:ring-emerald-500"
                                />
                                <label htmlFor="agreeToTerms" className="text-xs text-slate-500 select-none">
                                    I accept the{" "}
                                    <a href="#terms" className="text-emerald-600 font-medium hover:underline">Terms of Service</a>{" "}
                                    and{" "}
                                    <a href="#privacy" className="text-emerald-600 font-medium hover:underline">Privacy Policy</a>.
                                </label>
                            </div>
                        )}

                        {/* ================= SUBMIT BUTTON ================= */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>
                                        {isLogin && "Login"}
                                        {isSignUp && "Create account"}
                                        {isForgot && "Send reset link"}
                                        {isReset && "Update password"}
                                    </span>
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* NAVIGATION BETWEEN CONFIGURATIONS */}
                    <div className="mt-5 pt-4 text-xs text-center border-t border-slate-100 text-slate-500 space-y-2.5">
                        {isLogin && (
                            <>
                                <div className="text-slate-400">
                                    Don't have an account?{" "}
                                    <button 
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => handleRouteSwitch("signup")} 
                                        className="text-emerald-600 font-semibold hover:underline"
                                    >
                                        Create one here
                                    </button>
                                </div>
                            </>
                        )}

                        {isSignUp && (
                            <div className="text-slate-400">
                                Already have an account?{" "}
                                <button 
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => handleRouteSwitch("login")} 
                                    className="text-emerald-600 font-semibold hover:underline"
                                >
                                    Log In
                                </button>
                            </div>
                        )}

                        {(isForgot || isReset) && (
                            <button 
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleRouteSwitch("login")} 
                                className="text-emerald-600 font-medium hover:underline"
                            >
                                Back to sign in portal
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}