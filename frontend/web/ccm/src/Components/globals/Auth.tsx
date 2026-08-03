import React, { useState } from 'react';
import {
  AlertCircle,
  X,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Info,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../Providers/profileContext';
import displayuno from '../../assets/display02.jpg';

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

  // Clear context errors on route tab switch
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

  if (isAuthenticated || proceedWithoutAuth) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141414]/90 p-4 md:p-0 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Main Container */}
      <div className="relative flex w-full max-w-[1000px] md:min-w-full md:max-w-full md:h-full flex-col-reverse md:flex-row items-stretch md:rounded-none overflow-hidden shadow-xl font-sans">
        
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={() => setProceedWithoutAuth(true)}
          className="absolute top-5 right-5 z-20 text-gray-400 transition-colors hover:text-white border border-gray-500/50 p-1.5 rounded-full cursor-pointer hover:bg-gray-700/50"
          title="Close"
          aria-label="Close overlay"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Form Controls */}
        <div className="flex-1 bg-[#1A1D20] p-6 md:p-12 text-gray-100 relative flex flex-col justify-center">
          
          {/* Header & Logo */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-semibold text-xl tracking-wide text-white">
              SOKO AI
            </span>
          </div>

          {/* Route Navigation Tabs */}
          <div className="flex items-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => handleRouteChange('login')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                authRoute === 'login'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-[#3C4043] text-gray-300 hover:bg-[#4C5053]'
              }`}
            >
              <LogIn className="h-4 w-4" />
              Log In
            </button>
            <button
              type="button"
              onClick={() => handleRouteChange('signup')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                authRoute === 'signup'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-[#3C4043] text-gray-300 hover:bg-[#4C5053]'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </button>
          </div>

          {/* Title Banner */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1 tracking-tight">
              {authRoute === 'login' && 'Welcome back!'}
              {authRoute === 'signup' && 'Join us!'}
              {authRoute === 'forgot' && 'Reset Password!'}
            </h1>
            <p className="text-gray-400 text-sm">
              {authRoute === 'login' && 'Get into your dashboard'}
              {authRoute === 'signup' && 'Create your new account'}
              {authRoute === 'forgot' && 'Reset your account password'}
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-900/50 bg-rose-950/30 p-3 mb-6 text-left text-xs text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <span className="leading-relaxed">{authError}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-5 bg-[#25292D] p-6 rounded-2xl border border-gray-800 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name Input (Signup Only) */}
              {authRoute === 'signup' && (
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label htmlFor="fullName" className="text-xs font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="relative flex items-center rounded-xl border border-[#3C4043] bg-[#1A1D20] px-4 py-3 focus-within:border-gray-400 transition-colors">
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Phone Input (Login & Signup) */}
              {authRoute !== 'forgot' && (
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label htmlFor="phone" className="text-xs font-medium text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative flex items-center rounded-xl border border-[#3C4043] bg-[#1A1D20] px-4 py-3 focus-within:border-gray-400 transition-colors">
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 07XXXXXXXX"
                      className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email Input (Forgot Password Only) */}
              {authRoute === 'forgot' && (
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label htmlFor="email" className="text-xs font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative flex items-center rounded-xl border border-[#3C4043] bg-[#1A1D20] px-4 py-3 focus-within:border-gray-400 transition-colors">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Password Input (Login & Signup) */}
              {authRoute !== 'forgot' && (
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label htmlFor="password" className="text-xs font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative flex items-center rounded-xl border border-[#3C4043] bg-[#1A1D20] px-4 py-3 focus-within:border-gray-400 transition-colors">
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
                      className="text-gray-400 hover:text-gray-200 transition-colors"
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
            </div>

            {/* Action Buttons Container */}
            <div className="pt-2 flex flex-col md:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#F15A24] py-3 text-sm font-semibold text-white transition-all hover:bg-[#D94F1C] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <ArrowRight className="h-4 w-4" />
                {isLoading ? (
                  'Processing...'
                ) : authRoute === 'login' ? (
                  'Finish!'
                ) : authRoute === 'signup' ? (
                  'Create account'
                ) : (
                  'Send reset link'
                )}
              </button>

              {/* Forgot Password Link */}
              {authRoute === 'login' && (
                <button
                  type="button"
                  onClick={() => handleRouteChange('forgot')}
                  className="w-full md:w-auto text-xs text-gray-400 hover:text-white border border-gray-600/60 rounded-full py-3 px-4 transition-colors whitespace-nowrap text-center"
                >
                  Forgot Password?
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side Visual Side-Banner */}
        <div
          className="flex-1 min-h-[400px] md:min-h-0 bg-cover bg-center bg-no-repeat relative p-8 md:p-12 text-white hidden md:block"
          style={{ backgroundImage: `url(${displayuno})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 z-10 max-w-sm">
            <div className="space-y-4">

              <h2 className="text-xs font-semibold leading-relaxed bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                Everything is going more digital! Why not your online shopping experience?
              </h2>
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 text-gray-900 w-fit cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                <Info className="h-4 w-4" />
                <span className="text-sm font-semibold">Learn More</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
