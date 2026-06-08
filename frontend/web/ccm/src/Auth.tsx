import React, { useEffect, useState } from "react";
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";

import { useAuth } from "./Providers/AuthContex";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const {
        user,
        isAuthenticated,
        authRoute,
        changeAuthRoute,
        login,
        signUp,
        forgotPassword,
        resetPassword,
        isLoading,
        authError,
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

    /* ================= GUARDS ================= */

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate("/shop");
        }
    }, [isAuthenticated, user, navigate]);

    /* ================= HELPERS ================= */

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (localError) setLocalError(null);
    };

    const handleRouteSwitch = (route: typeof authRoute) => {
        setLocalError(null);
        setSuccessMessage(null);

        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            password: "",
            newPassword: "",
            agreeToTerms: false,
        });

        changeAuthRoute(route);
    };

    /* ================= SUBMIT ================= */

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLoading) return;

        setLocalError(null);
        setSuccessMessage(null);

        try {
            switch (authRoute) {
                /* ================= LOGIN ================= */
                case "login": {
                    if (!formData.phone || !formData.password) {
                        setLocalError("Please enter your credentials.");
                        return;
                    }

                    await login(
                        formData.phone.trim(),
                        formData.password
                    );

                    break;
                }

                /* ================= SIGNUP ================= */
                case "signup": {
                    if (
                        !formData.first_name.trim() ||
                        !formData.last_name.trim() ||
                        !formData.email.trim() ||
                        !formData.password.trim()
                    ) {
                        setLocalError("All fields are required.");
                        return;
                    }

                    if (!EMAIL_REGEX.test(formData.email)) {
                        setLocalError("Enter a valid email address.");
                        return;
                    }

                    if (formData.password.length < 8) {
                        setLocalError("Password must be at least 8 characters.");
                        return;
                    }

                    if (!formData.agreeToTerms) {
                        setLocalError("You must accept Terms & Conditions.");
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

                /* ================= FORGOT PASSWORD ================= */
                case "forgot-password": {
                    if (!formData.email) {
                        setLocalError("Enter your email.");
                        return;
                    }

                    if (!EMAIL_REGEX.test(formData.email)) {
                        setLocalError("Enter a valid email.");
                        return;
                    }

                    await forgotPassword(formData.email.trim().toLowerCase());

                    setSuccessMessage(
                        "Reset link sent to your email."
                    );

                    setFormData((p) => ({ ...p, email: "" }));

                    break;
                }

                /* ================= RESET PASSWORD ================= */
                case "reset-password": {
                    if (!formData.newPassword) {
                        setLocalError("Enter a new password.");
                        return;
                    }

                    if (formData.newPassword.length < 8) {
                        setLocalError("Password must be at least 8 characters.");
                        return;
                    }

                    await resetPassword(formData.newPassword.trim());

                    setSuccessMessage(
                        "Password updated successfully. Redirecting..."
                    );

                    setFormData((p) => ({ ...p, newPassword: "" }));

                    break;
                }
            }
        } catch (err: any) {
            setLocalError(err?.message || "Something went wrong.");
        }
    };

    /* ================= ROUTE FLAGS ================= */

    const isLogin = authRoute === "login";
    const isSignUp = authRoute === "signup";
    const isForgot = authRoute === "forgot-password";
    const isReset = authRoute === "reset-password";

    const activeError = localError || authError;

    /* ================= UI ================= */

    return (
        <div className="min-h-screen w-screen flex bg-slate-50 text-slate-800">

            {/* LEFT PANEL */}
            <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-emerald-100 to-slate-50 p-12 border-r border-slate-200">
                <div className="flex flex-col justify-between">
                    <div className="font-bold text-lg">SokoAI</div>

                    <div>
                        <h1 className="text-3xl font-black mb-3">
                            Smarter shopping starts here
                        </h1>
                        <p className="text-sm text-slate-500">
                            AI-powered marketplace discovery and deals.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Secure authentication system
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-[420px] bg-white rounded-2xl border p-6 shadow-xl">

                    {/* HEADER */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">
                            {isLogin && "Welcome back"}
                            {isSignUp && "Create account"}
                            {isForgot && "Recover account"}
                            {isReset && "Reset password"}
                        </h2>

                        <p className="text-xs text-slate-500 mt-1">
                            {isLogin && "Login to continue"}
                            {isSignUp && "Join SokoAI today"}
                            {isForgot && "Recover your account"}
                            {isReset && "Set a new password"}
                        </p>
                    </div>

                    {/* ERROR */}
                    {activeError && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {activeError}
                        </div>
                    )}

                    {/* SUCCESS */}
                    {successMessage && (
                        <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg flex gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            {successMessage}
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto p-1">

                        {/* NAME FIELDS */}
                        {isSignUp && (
                            <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                                <div className="relative">
                                    <input
                                        name="first_name"
                                        type="text"
                                        placeholder="First name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        name="last_name"
                                        type="text"
                                        placeholder="Last name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        )}

                        {/* EMAIL & PHONE FIELDS */}
                        {!isReset && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {!isLogin && (
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
                                    />
                                )}


                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
                                />
                            </div>
                        )}

                        {/* PASSWORD FIELD */}
                        {(isLogin || isSignUp) && (
                            <div className="relative flex items-center">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-11 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        )}

                        {/* RESET PASSWORD FIELD */}
                        {isReset && (
                            <input
                                name="newPassword"
                                type="password"
                                placeholder="New password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
                            />
                        )}

                        {/* TERMS CHECKBOX */}
                        {isSignUp && (
                            <label className="flex items-start gap-2.5 cursor-pointer py-1 group select-none">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500/30 accent-emerald-600 dark:bg-slate-900"
                                />
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-150">
                                    I agree to the <span className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-700">Terms & Conditions</span>
                                </span>
                            </label>
                        )}

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/10 hover:shadow-md hover:shadow-emerald-500/20 active:scale-[0.99] transition-all duration-150"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                                <>
                                    Submit
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* ROUTES */}
                    <div className="mt-4 text-xs text-center space-y-2">
                        {isLogin && (
                            <button onClick={() => handleRouteSwitch("signup")}>
                                Create account
                            </button>
                        )}
                        {isSignUp && (
                            <button onClick={() => handleRouteSwitch("login")}>
                                Already have account?
                            </button>
                        )}
                        {(isForgot || isReset) && (
                            <button onClick={() => handleRouteSwitch("login")}>
                                Back to login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}