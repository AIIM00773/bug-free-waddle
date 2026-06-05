import { useState } from "react";
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle2,
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
    } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        newPassword: "",
        agreeToTerms: false,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            switch (authRoute) {
                case "login":
                    await login(formData.email, formData.password);
                    break;

                case "signup":
                    await signUp(
                        formData.email,
                        formData.password,
                        formData.name
                    );
                    break;

                case "forgot-password":
                    await forgotPassword(formData.email);
                    break;

                case "reset-password":
                    await resetPassword(formData.newPassword);
                    break;
            }
        } catch (err) {
            console.error("Auth error:", err);
        }
    };

    const isLogin = authRoute === "login";
    const isSignUp = authRoute === "signup";
    const isForgot = authRoute === "forgot-password";
    const isReset = authRoute === "reset-password";

    return (
        <div className="min-h-screen w-screen flex bg-slate-50 font-sans text-slate-800">


            {/* ================= LEFT HERO ================= */}
            <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-emerald-100  to-slate-50 relative overflow-hidden flex-col justify-between p-12 text-slate-800 border-r border-slate-200/60">

                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                        S
                    </div>
                    <span className="font-bold text-slate-900">SokoAI</span>
                </div>

                <div className="max-w-sm space-y-6">
                    <h1 className="text-3xl font-black">
                        Smarter shopping starts here
                    </h1>
                    <p className="text-sm text-slate-500">
                        AI-powered discovery, comparison, and deals in one place.
                    </p>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Secure, fast authentication system
                </div>
            </div>

            {/* ================= RIGHT FORM ================= */}
            <div className="flex-1 flex items-center justify-center p-6">

                <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">

                    {/* HEADER */}
                    <div className="mb-5">
                        <h2 className="text-lg font-bold">
                            {isLogin && "Welcome back"}
                            {isSignUp && "Create account"}
                            {isForgot && "Recover account"}
                            {isReset && "Reset password"}
                        </h2>

                        <p className="text-xs text-slate-500">
                            {isLogin && "Login to continue"}
                            {isSignUp && "Join SokoAI today"}
                            {isForgot && "Enter your email to continue"}
                            {isReset && "Set a new secure password"}
                        </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* ================= NAME ================= */}
                        {isSignUp && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    Full Name
                                </label>

                                <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-slate-300">

                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600 transition">
                                        <User className="h-4 w-4" />
                                    </div>

                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ================= EMAIL ================= */}
                        {!isReset && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    Email Address
                                </label>

                                <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-slate-300">

                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600 transition">
                                        <Mail className="h-4 w-4" />
                                    </div>

                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                        className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ================= PASSWORD ================= */}
                        {(isLogin || isSignUp) && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Password
                                    </label>

                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={() => changeAuthRoute("forgot-password")}
                                            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition"
                                        >
                                            Forgot?
                                        </button>
                                    )}
                                </div>

                                <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-slate-300">

                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600 transition">
                                        <Lock className="h-4 w-4" />
                                    </div>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="text-slate-400 hover:text-slate-600 transition"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ================= RESET PASSWORD ================= */}
                        {isReset && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    New Password
                                </label>

                                <div className="group flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-slate-300">

                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600 transition">
                                        <Lock className="h-4 w-4" />
                                    </div>

                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ================= SUBMIT ================= */}
                        <button
                            disabled={isLoading}
                            className="w-full relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                        >
                            <span className="relative z-10">
                                {isLogin && "Login"}
                                {isSignUp && "Create account"}
                                {isForgot && "Send reset link"}
                                {isReset && "Reset password"}
                            </span>

                            <ArrowRight className="h-4 w-4 relative z-10" />

                            {/* subtle glow effect */}
                            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-r from-emerald-500/0 via-white/10 to-emerald-500/0" />
                        </button>
                    </form>


                    {/* NAVIGATION BETWEEN STATES */}
                    <div className="mt-4 text-xs text-center text-slate-500 space-y-2">

                        {isLogin && (
                            <>
                                <button onClick={() => changeAuthRoute("signup")} className="text-emerald-600">
                                    Create account
                                </button>

                                <button onClick={() => changeAuthRoute("forgot-password")} className="block text-slate-500">
                                    Forgot password?
                                </button>
                            </>
                        )}

                        {isSignUp && (
                            <button onClick={() => changeAuthRoute("login")} className="text-emerald-600">
                                Already have an account? Login
                            </button>
                        )}

                        {isForgot && (
                            <button onClick={() => changeAuthRoute("login")} className="text-emerald-600">
                                Back to login
                            </button>
                        )}

                        {isReset && (
                            <button onClick={() => changeAuthRoute("login")} className="text-emerald-600">
                                Back to login
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}