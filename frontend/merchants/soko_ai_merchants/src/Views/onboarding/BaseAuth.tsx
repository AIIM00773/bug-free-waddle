import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Store
} from "lucide-react";

import { useAuth } from "../../Providers/AuthProvider";
import type { AuthRoute } from "../../Providers/AuthProvider";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MerchantAuthPage() {
    const {
        user,
        isAuthenticated,
        authRoute,
        setAuthRoute,
        userLogin,
        userSignup,
        forgotPassword,
        resetPassword,
        isLoading,
        authError,
        clearAuthError,
    } = useAuth();

    const navigate = useNavigate();

    /* LOCAL STATE */
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
        authCode: "", 
        agreeToTerms: false,
    });


    /* AUTHENTICATION GUARDS */
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.is_merchant) {
                navigate("/admin/dashboard");
            } else {
                navigate("/onboarding");
            }
        }
    }, [isAuthenticated, user, navigate]);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

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
            authCode: "",
            agreeToTerms: false,
        });

        setAuthRoute(route);
    };




    /* FORM SUBMISSION PROCESSOR */
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

                    // Fixed: Passing exact payload interface expected by userLogin
                    await userLogin({
                        phone: formData.phone.trim(),
                        password: formData.password
                    });
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
                        setLocalError("Please enter a valid email address.");
                        return;
                    }

                    if (formData.password.length < 8) {
                        setLocalError("Password must be at least 8 characters long.");
                        return;
                    }

                    if (!formData.agreeToTerms) {
                        setLocalError("You must accept the Merchant Terms & Conditions to proceed.");
                        return;
                    }

                    // Fixed: Passing exact payload interface expected by userSignup
                    await userSignup({
                        email: formData.email.trim().toLowerCase(),
                        password: formData.password.trim(),
                        first_name: formData.first_name.trim(),
                        last_name: formData.last_name.trim(),
                        phone: formData.phone.trim()
                    });
                    break;
                }

                case "forgot-password": {
                    if (!formData.email) {
                        setLocalError("Please enter your registered email address.");
                        return;
                    }

                    if (!EMAIL_REGEX.test(formData.email)) {
                        setLocalError("Please enter a valid email address.");
                        return;
                    }

                    await forgotPassword(formData.email.trim().toLowerCase());
                    setSuccessMessage("A password reset code has been sent to your email.");
                    setAuthRoute("reset-password"); // Auto-transition to reset screen
                    break;
                }

                case "reset-password": {
                    if (!formData.authCode || !formData.newPassword) {
                        setLocalError("Please provide your authentication code and new password.");
                        return;
                    }

                    if (formData.newPassword.length < 8) {
                        setLocalError("New password must be at least 8 characters long.");
                        return;
                    }

                    // Fixed: Passing exactly what the resetPassword method requires
                    await resetPassword(formData.authCode.trim(), formData.newPassword.trim());
                    setSuccessMessage("Password changed successfully. Redirecting to login...");

                    setTimeout(() => {
                        handleRouteSwitch("login");
                    }, 2000);
                    break;
                }
            }
        } catch (err: any) {
            setLocalError(err?.message || "An unexpected error occurred during authentication.");
        }
    };



    
    /* INTERFACE FLAGS */
    const isLogin = authRoute === "login";
    const isSignUp = authRoute === "signup";
    const isForgot = authRoute === "forgot-password";
    const isReset = authRoute === "reset-password";

    const activeError = localError || authError;

    if (isAuthenticated && user) return null;

    return (
        <div className="min-h-screen w-screen flex bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500/20">

            {/* LEFT PANEL: MERCHANT BRANDING */}
            <div className="hidden lg:flex lg:w-[45%] bg-slate-900 p-12 border-r border-slate-800 text-white relative overflow-hidden">
                {/* Background flourish */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col justify-between h-full w-full max-w-md mx-auto relative z-10">
                    <div className="flex items-center gap-2 font-black text-2xl tracking-tight text-white">
                        <Store className="h-7 w-7 text-emerald-500" />
                        SokoAI <span className="text-emerald-500 font-light">Sellers</span>
                    </div>

                    <div>
                        <h1 className="text-4xl font-black leading-tight mb-4">
                            Control your catalog. <br />Reach more buyers.
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            Supply your product catalog directly to Kenya's most intelligent deal-finding network. Manage pricing, track analytics, and handle orders all from your custom merchant portal.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                Direct integration and swift payouts
                            </div>
                        </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 border-t border-slate-800 pt-6">
                        Secure Access Portal:  sokoAI Merchants • V1.0 Alpha
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: FORM AREA */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-slate-50">
                <div className="w-full max-w-[440px] bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl shadow-slate-100/50">

                    {/* MOBILE BRANDING */}
                    <div className="lg:hidden flex items-center gap-2 font-black text-xl tracking-tight text-slate-900 mb-8">
                        <Store className="h-6 w-6 text-emerald-600" />
                        SokoAI <span className="text-emerald-600 font-light">Sellers</span>
                    </div>

                    {/* ROUTE HEADER TEXT */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {isLogin && "Merchant login"}
                            {isSignUp && "Register as a seller"}
                            {isForgot && "Recover store access"}
                            {isReset && "Set secure password"}
                        </h2>
                        <p className="text-xs font-medium text-slate-400 mt-1.5">
                            {isLogin && "Access your administrative dashboard and inventory."}
                            {isSignUp && "Create your profile to start listing products on the network."}
                            {isForgot && "Enter your email address to receive recovery instructions."}
                            {isReset && "Check your email for the authentication code to reset your password."}
                        </p>
                    </div>

                    {/* NOTIFICATIONS */}
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

                    {/* CORE DATA FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* SIGNUP SPECIFIC FIELDS */}
                        {isSignUp && (
                            <div className="grid grid-cols-2 gap-3.5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600">First Name</label>
                                    <input
                                        name="first_name"
                                        type="text"
                                        required
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
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
                                    />
                                </div>
                            </div>
                        )}

                        {/* EMAIL FIELD */}
                        {(!isLogin && !isReset) && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="vendor@business.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
                                />
                            </div>
                        )}

                        {/* PHONE FIELD (Used for Login & Signup) */}
                        {(isLogin || isSignUp) && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600">Registered Phone Number</label>
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

                        {/* PASSWORD FIELD */}
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

                        {/* RESET PASSWORD FIELDS */}
                        {isReset && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600">Auth Code (Check Email)</label>
                                    <input
                                        name="authCode"
                                        type="text"
                                        required
                                        placeholder="Enter the code sent to you"
                                        value={formData.authCode}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600">New Password</label>
                                    <input
                                        name="newPassword"
                                        type="password"
                                        required
                                        placeholder="Enter new secure password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
                                    />
                                </div>
                            </>
                        )}

                        {/* TERMS LEGAL COMPLIANCE */}
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
                                    I accept the <span className="text-emerald-600 underline font-semibold">Merchant Agreement</span> and Data Processing Policies.
                                </span>
                            </label>
                        )}

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-900/50 text-white text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 group transition-all duration-150 shadow-sm shadow-slate-900/10 active:scale-[0.985] disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-4 w-4 text-emerald-500" />
                            ) : (
                                <>
                                    {isLogin && "Enter Dashboard"}
                                    {isSignUp && "Create Seller Account"}
                                    {isForgot && "Request Reset Code"}
                                    {isReset && "Confirm New Password"}
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 text-emerald-500" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* NAVIGATION LINKS */}
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-center text-slate-500">
                        {isLogin && (
                            <p>
                                Want to sell on SokoAI?{" "}
                                <button type="button" onClick={() => handleRouteSwitch("signup")} className="text-emerald-600 font-bold hover:underline">
                                    Register your business
                                </button>
                            </p>
                        )}
                        {isSignUp && (
                            <p>
                                Already a registered merchant?{" "}
                                <button type="button" onClick={() => handleRouteSwitch("login")} className="text-emerald-600 font-bold hover:underline">
                                    Sign in instead
                                </button>
                            </p>
                        )}
                        {(isForgot || isReset) && (
                            <button type="button" onClick={() => handleRouteSwitch("login")} className="text-emerald-600 font-bold hover:underline">
                                Return to merchant login
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}