import React, { useEffect, useState } from "react";
import { useAdminAuth } from "../Providers.tsx/AdminAuthContext";
import {
    Shield,
    Lock,
    User,
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
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

    useEffect(() => {
        clearAuthError();
    }, []);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            return;
        }

        await login(username.trim(), password);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

                {/* Header */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                        <Shield
                            size={22}
                            className={
                                isMfaRequired
                                    ? "text-emerald-600"
                                    : "text-slate-700"
                            }
                        />
                    </div>

                    <h1 className="text-lg font-bold text-slate-900">
                        Soko AI Management Portal
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Sign in to access the administration workspace
                    </p>
                </div>

                {/* Error */}
                {authError && (
                    <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3">
                        <AlertCircle
                            size={16}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-700">
                                {authError}
                            </p>
                        </div>
                    </div>
                )}

                {/* MFA Placeholder */}
                {isMfaRequired ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <p className="text-sm font-medium text-emerald-700">
                            Multi-factor authentication is required.
                        </p>

                        <p className="mt-1 text-xs text-emerald-600">
                            MFA verification flow has not yet been connected.
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Username */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Username
                            </label>

                            <div className="relative">
                                <User
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }
                                    disabled={isLoading}
                                    autoFocus
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-slate-400 focus:bg-white"
                                    placeholder="Administrator username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    disabled={isLoading}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm outline-none transition-all focus:border-slate-400 focus:bg-white"
                                    placeholder="••••••••••••"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Authenticating...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="mt-8 border-t border-slate-100 pt-5">
                    <p className="text-center text-[11px] font-medium uppercase tracking-widest text-slate-400">
                        Authorized Personnel Only
                    </p>
                </div>
            </div>
        </div>
    );
}