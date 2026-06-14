import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAdminAuth } from "../Providers.tsx/AdminAuthAndProfileContext";
import {
    Shield,
    Lock,
    User,
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    KeyRound,
    ArrowLeft
} from "lucide-react";

export default function AdminAuthGate() {
    const {
        login,
        authError,
        clearAuthError,
        isLoading,
        isMfaRequired,
    } = useAdminAuth();

    // Standard credential nodes
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Multi-Factor Authentication token track
    const [mfaCode, setMfaCode] = useState("");
    const mfaInputRef = useRef<HTMLInputElement>(null);

    // Safe effect clearing execution tracker
    useEffect(() => {
        clearAuthError();
        return () => {
            clearAuthError();
        };
    }, [clearAuthError]);

    // Auto-focus the 2FA form element immediately when required
    useEffect(() => {
        if (isMfaRequired) {
            mfaInputRef.current?.focus();
        }
    }, [isMfaRequired]);

    const isFormValid = useMemo(() => {
        if (isMfaRequired) {
            return mfaCode.trim().length === 6 && /^\d+$/.test(mfaCode);
        }
        return username.trim().length > 0 && password.trim().length > 0;
    }, [isMfaRequired, username, password, mfaCode]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isFormValid || isLoading) return;

        if (isMfaRequired) {
            // Processing MFA verification string block
            // Note: If your context login method accepts a 3rd parameter for MFA, 
            // append it here, e.g., await login(username.trim(), password, mfaCode.trim());
            console.log("Submitting secure operations secret matrix node:", mfaCode.trim());
        } else {
            await login(username.trim(), password);
        }
    };

    // Clean back fallback handler if operator mistyped basic credentials
    const handleResetFlow = () => {
        window.location.reload(); // Hard reset instance thread state to guarantee absolute memory dump
    };

    return (
        <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center p-4 antialiased selection:bg-slate-900 selection:text-white">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300">

                {/* Status Brand Header */}
                <div className="mb-8 flex flex-col items-center text-center select-none">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${
                        isMfaRequired 
                            ? "border-blue-200 bg-blue-50 text-blue-600 animate-pulse" 
                            : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}>
                        {isMfaRequired ? <KeyRound size={22} /> : <Shield size={22} />}
                    </div>

                    <h1 className="text-base font-bold text-slate-900 tracking-tight sm:text-lg">
                        Soko AI Management Portal
                    </h1>

                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        {isMfaRequired 
                            ? "Enter the 6-digit cryptographic confirmation token" 
                            : "Sign in to access the administration workspace"
                        }
                    </p>
                </div>

                {/* Error Banner Container */}
                {authError && (
                    <div 
                        role="alert"
                        className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                        <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                        <div className="flex-1">
                            <p className="text-xs sm:text-sm font-medium text-red-700 leading-relaxed">
                                {authError}
                            </p>
                        </div>
                    </div>
                )}

                {/* Form Processing Core */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {isMfaRequired ? (
                        /* ======================================================
                           MFA CODE LAYER PANEL
                           ====================================================== */
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                            <div>
                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                    Security Verification Code
                                </label>
                                <div className="relative">
                                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        ref={mfaInputRef}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-8]*"
                                        maxLength={6}
                                        value={mfaCode}
                                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))} // Standard structural non-digit filter injection
                                        disabled={isLoading}
                                        required
                                        placeholder="000000"
                                        className="w-full tracking-widest text-center font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 py-3 px-10 text-base outline-hidden transition-all focus:border-slate-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400"
                                    />
                                </div>
                                <p className="mt-2 text-[11px] text-slate-400 leading-normal">
                                    Open your authenticator security utility to read your custom dynamic session verification sequence.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleResetFlow}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-50 transition-colors cursor-pointer group"
                            >
                                <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                                Return to basic authorization gate
                            </button>
                        </div>
                    ) : (
                        /* ======================================================
                           CREDENTIAL LAYER PANEL
                           ====================================================== */
                        <>
                            {/* Username input block */}
                            <div>
                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                    Username
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoading}
                                        autoComplete="username"
                                        autoFocus
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-hidden transition-all focus:border-slate-400 focus:bg-white text-slate-800 placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-400"
                                        placeholder="Administrator username"
                                    />
                                </div>
                            </div>

                            {/* Password input block */}
                            <div>
                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm outline-hidden transition-all focus:border-slate-400 focus:bg-white text-slate-800 placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-400"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-300 transition-colors"
                                        tabIndex={0}
                                        aria-label={showPassword ? "Hide administrative password" : "Show administrative password"}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Master Action Trigger Dispatcher */}
                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 shadow-xs cursor-pointer active:scale-[0.99]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                <span>Verifying context signatures...</span>
                            </>
                        ) : (
                            <span>{isMfaRequired ? "Confirm Security Code" : "Sign In to Engine"}</span>
                        )}
                    </button>
                </form>

                {/* Footer Section */}
                <div className="mt-8 border-t border-slate-100 pt-5 select-none">
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Authorized Personnel Only
                    </p>
                </div>
            </div>
        </div>
    );
}