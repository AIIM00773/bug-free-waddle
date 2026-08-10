import React, { useState } from 'react';
import {
  AlertCircle,
  X,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../Providers/profileContext';

type AuthRoute = 'login' | 'signup' | 'forgot';

export function AuthOverlay() {
  const {
    authRoute,
    setAuthRoute,
    login,
    signUp,
    forgotPassword,
    authError,
    clearAuthError,
    isLoading,
    isAuthenticated,
    proceedWithoutAuth,
    setProceedWithoutAuth,
  } = useAuth();

  // Local form state
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Clear context errors on route switch
  const handleRouteChange = (newRoute: AuthRoute) => {
    clearAuthError();
    setAuthRoute(newRoute);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (authRoute === 'login') {
        await login(phone, password);
      } else if (authRoute === 'signup') {
        await signUp(fullName, phone, password);
      } else if (authRoute === 'forgot') {
        await forgotPassword(email);
        alert('If an account exists, a recovery link has been issued.');
        handleRouteChange('login');
      }
    } catch (err) {
      console.error('Auth processing exception caught:', err);
    }
  };

  if (isAuthenticated || proceedWithoutAuth || isLoading ) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Centered  Modal Card */}
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#171717] p-8 text-white shadow-2xl sm:p-10 font-sans">
        
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={() => setProceedWithoutAuth(true)}
          className="absolute top-5 right-5 z-20 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          title="Close"
          aria-label="Close overlay"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Centered Brand / Logo Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center">
            <span className="text-sm font-semibold tracking-[0.2em] text-gray-400 uppercase">
              SOKO AI
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {authRoute === 'login' && 'Sign-In'}
            {authRoute === 'signup' && 'Sign-Up'}
            {authRoute === 'forgot' && 'Reset your password'}
          </h1>
        </div>

        {/* Error Banner */}
        {authError && (
          <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <span className="leading-relaxed">{authError}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name Input (Signup Only) */}
          {authRoute === 'signup' && (
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="block text-xs font-medium text-gray-300"
              >
                Full name
              </label>
              <div className="relative flex items-center rounded-xl border border-white/15 bg-[#212121] px-4 py-3 transition-colors focus-within:border-white/40 focus-within:bg-[#1A1A1A]">
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Phone Input (Login & Signup) */}
          {authRoute !== 'forgot' && (
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="block text-xs font-medium text-gray-300"
              >
                Phone number
              </label>
              <div className="relative flex items-center rounded-xl border border-white/15 bg-[#212121] px-4 py-3 transition-colors focus-within:border-white/40 focus-within:bg-[#1A1A1A]">
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Email Input (Forgot Password Only) */}
          {authRoute === 'forgot' && (
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-300"
              >
                Email address
              </label>
              <div className="relative flex items-center rounded-xl border border-white/15 bg-[#212121] px-4 py-3 transition-colors focus-within:border-white/40 focus-within:bg-[#1A1A1A]">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Password Input (Login & Signup) */}
          {authRoute !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-300"
                >
                  Password
                </label>
                {authRoute === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleRouteChange('forgot')}
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center rounded-xl border border-white/15 bg-[#212121] px-4 py-3 transition-colors focus-within:border-white/40 focus-within:bg-[#1A1A1A]">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 transition-colors hover:text-gray-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F15A24] py-3.5 text-sm font-medium text-white transition-all duration-150 hover:bg-[#E04810] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>
                {isLoading
                  ? 'Processing...'
                  : authRoute === 'login'
                  ? 'Continue'
                  : authRoute === 'signup'
                  ? 'Create account'
                  : 'Send reset link'}
              </span>
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </form>

        {/* ChatGPT-Style Bottom Mode Switcher */}
        <div className="mt-6 border-t border-white/10 pt-6 text-center text-xs text-gray-400">
          {authRoute === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleRouteChange('signup')}
                className="font-medium text-white underline underline-offset-4 hover:text-[#F15A24] transition-colors"
              >
                Sign up
              </button>
            </p>
          )}
          {authRoute === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleRouteChange('login')}
                className="font-medium text-white underline underline-offset-4 hover:text-[#F15A24] transition-colors"
              >
                Log in
              </button>
            </p>
          )}
          {authRoute === 'forgot' && (
            <p>
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => handleRouteChange('login')}
                className="font-medium text-white underline underline-offset-4 hover:text-[#F15A24] transition-colors"
              >
                Back to log in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
