import React, { useState } from 'react';
import { useAdminAuth } from '../Providers.tsx/AdminAuthContext';
import { Shield, Lock, User, KeyRound, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminAuthGate() {
  const { 
    isMfaRequired, 
    authError, 
    isProcessing, 
    initiateFirstStep, 
    verifyMfaToken 
  } = useAdminAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureToken, setSecureToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleStepOneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await initiateFirstStep(username, password);
  };

  const handleStepTwoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyMfaToken(secureToken);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        
        {/* ENTERPRISE BRAND HEADER */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-11 w-11 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center shadow-2xs">
            <Shield size={20} className={isMfaRequired ? 'text-emerald-600' : 'text-blue-600'} />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Soko AI Management Portal</h2>
            <p className="text-xs text-slate-500">
              {!isMfaRequired ? 'Sign in to access your administrative node' : 'Enter your secondary security token'}
            </p>
          </div>
        </div>

        {/* ERROR BOX */}
        {authError && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5">
            <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-rose-700 leading-normal">{authError}</p>
          </div>
        )}

        {/* WORKFLOW CONDITIONAL STEPS */}
        {!isMfaRequired ? (
          <form onSubmit={handleStepOneSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  disabled={isProcessing}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isProcessing}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing && <Loader2 size={14} className="animate-spin text-slate-500" />}
              {isProcessing ? 'Verifying Credentials...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleStepTwoSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Security Verification Code</label>
              <div className="relative">
                <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  maxLength={4}
                  required
                  autoFocus
                  disabled={isProcessing}
                  value={secureToken}
                  onChange={(e) => setSecureToken(e.target.value)}
                  placeholder="0000"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono tracking-widest focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-60"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Please enter the 4-digit code generated by your authenticated authenticator device.
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing && <Loader2 size={14} className="animate-spin text-emerald-200" />}
              {isProcessing ? 'Validating Token...' : 'Verify and Open Workspace'}
            </button>
          </form>
        )}

        {/* SYSTEM FOOTER */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Protected Environment — Authorized Operators Only
          </p>
        </div>

      </div>
    </div>
  );
}