import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAdminAuth } from "../Providers.tsx/AdminAuthAndProfileContext";
import {
    Shield,
    Lock,
    User,
    AlertCircle,
    CheckCircle2,
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

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [mfaCode, setMfaCode] = useState("");
    const mfaInputRef = useRef<HTMLInputElement>(null);
    


    // New local state for positive feedback before unmount/redirect
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => { clearAuthError(); return () => clearAuthError();}, [clearAuthError]);

    useEffect(() => {
        if (isMfaRequired) { mfaInputRef.current?.focus();
            setSuccessMessage("Credentials verified. Enter security code.");
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
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

        setSuccessMessage(null);

        if (isMfaRequired) {
            const success = await login(username.trim(), password);
            if (success) {
                setSuccessMessage("Verification complete. Initializing workspace...");
            }
        } else {
            const success = await login(username.trim(), password);
            if (success && !isMfaRequired) {
                setSuccessMessage("Authentication successful. Redirecting...");
            }
        }
    };

    const handleResetFlow = () => {window.location.reload(); };


    
    return (
        <div className="min-h-[100dvh] bg-white flex items-center justify-center p-4 antialiased selection:bg-slate-900 selection:text-white">
            <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                
                {/* Header */}
                <div className="mb-8 flex flex-col items-center text-center select-none">
                    <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                        isMfaRequired 
                            ? "bg-blue-50 text-blue-600" 
                            : "bg-slate-50 text-slate-900"
                    }`}>
                        {isMfaRequired ? <KeyRound size={18} /> : <Shield size={18} strokeWidth={2.5} />}
                    </div>
                    <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                        Soko Workspace
                    </h1>
                </div>

                {/* Unified Feedback Banner */}
                {(authError || successMessage) && (
                    <div 
                        role="alert"
                        className={`mb-6 flex gap-3 rounded-lg border p-3 animate-in fade-in slide-in-from-top-1 duration-200 ${
                            authError 
                                ? "border-red-100 bg-red-50 text-red-700" 
                                : "border-emerald-100 bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {authError ? (
                            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                        ) : (
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                        )}
                        <p className="text-sm font-medium leading-relaxed">
                            {authError || successMessage}
                        </p>
                    </div>
                )}

                {/* Form Core */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isMfaRequired ? (
                        <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
                            <div className="relative">
                                <input
                                    ref={mfaInputRef}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={mfaCode}
                                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                                    disabled={isLoading || !!successMessage}
                                    required
                                    placeholder="000000"
                                    className="w-full tracking-[0.5em] text-center font-mono font-medium rounded-xl border border-slate-200 bg-slate-50/50 py-3 text-lg outline-hidden transition-all focus:border-slate-400 focus:bg-white disabled:opacity-50"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleResetFlow}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer group"
                            >
                                <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                                Return to login
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="relative group">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-700" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="username"
                                    autoFocus
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-hidden transition-all focus:border-slate-400 focus:bg-white text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
                                    placeholder="Username"
                                />
                            </div>

                            <div className="relative group">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-700" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm outline-hidden transition-all focus:border-slate-400 focus:bg-white text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors outline-hidden"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid || !!successMessage}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <span>{isMfaRequired ? "Verify Code" : "Sign In"}</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}