import React, { useState } from 'react';
import {
  AlertCircle,
  X,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  LogIn,
  Info,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../Providers/profileContext';
import  displayuno from  '../../assets/display02.jpg'; // image 

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

  // Local form input states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Username placeholder to match image's 'Welcome back! User'
  const userNamePlaceholder = isAuthenticated ? 'Your Account' : 'User';

  // Clear context errors when switching sub-forms
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
      {/* Main Overlay Content Box with Split Screen Layout */}
      <div className="relative flex w-full max-w-[1000px] md:min-w-full md:max-w-full md:h-full flex-col-reverse md:flex-row items-stretch md:rounded-none overflow-hidden shadow-xl font-sans">
        
        {/* Top Right Inner Close Button */}
        <button
          type="button"
          onClick={() => setProceedWithoutAuth(true)}
          className="absolute top-5 right-5 z-20 text-gray-400 transition-colors hover:text-white border border-gray-500/50 p-1 rounded-full cursor-pointer hover:bg-gray-500"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side (Dark, solid): Form and Control Area */}
        <div className="flex-1 bg-[#1A1D20] p-8 px-4 md:p-12 text-gray-100 relative">
          
          {/* Header (.Logo, Navigation) */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-semibold text-lg">SOKO AI </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-gray-400 hover:text-white p-1 rounded-full bg-[#3C4043] hidden md:inline-flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-white p-1 rounded-full bg-[#3C4043] hidden md:inline-flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Route Switching Tabs */}
          <div className="flex items-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => handleRouteChange('login')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                authRoute === 'login'
                  ? 'bg-[#000000] text-white'
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
                  ? 'bg-[#3C4043] text-white hover:bg-[#4C5053]'
                  : 'bg-[#3C4043] text-gray-300 hover:bg-[#4C5053]'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-1">
              {authRoute === 'login'
                ? `Welcome !  `
                : authRoute === 'signup'
                ? `Join us !`
                : `Reset Password !`}
            </h1>
            <p className="text-gray-400 text-sm">
              {authRoute === 'login'
                ? 'Get into your dashboard'
                : authRoute === 'signup'
                ? 'Create your new account'
                : 'Reset your account password'}
            </p>
          </div>

          {/* Context Error Alert */}
          {authError && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-rose-900/50 bg-rose-950/20 p-3 mb-6 text-left text-xs text-rose-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="leading-relaxed">{authError}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* FULL NAME (Signup) */}
            {authRoute === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="relative flex items-center rounded-2xl border border-[#2d2d2d] bg-[#3C4043] px-4 py-3 focus-within:border-gray-500">
                  <input
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

            {/* PHONE NUMBER (Login & Signup) */}
            {authRoute !== 'forgot' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <div className="relative flex items-center rounded-2xl border border-[#2d2d2d] bg-[#3C4043] px-4 py-3 focus-within:border-gray-500">
                  <input
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

            {/* EMAIL ADDRESS (Forgot Password) */}
            {authRoute === 'forgot' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-2xl border border-[#2d2d2d] bg-[#3C4043] px-4 py-3 focus-within:border-gray-500">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. example@productionscroll.com"
                    className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* PASSWORD FIELD */}
            {authRoute !== 'forgot' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative flex items-center rounded-2xl border border-[#2d2d2d] bg-[#3C4043] px-4 py-3 focus-within:border-gray-500">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="************"
                    className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-300"
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

            {/* Main Submit Action Button */}
            <div className="flex items-center justify-between gap-4 mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-grow flex w-full items-center justify-center gap-2 rounded-full border border-[#2d2d2d] bg-[#F15A24] py-3 text-sm font-semibold transition-all active:scale-[0.99] disabled:opacity-50 ${
                  isLoading
                    ? 'text-white/70 text-xs hover:none'
                    : 'text-white hover:bg-[#D94F1C]'
                }`}
              >
                <ArrowRight className="h-4 w-4" />
                {isLoading
                  ? 'Processing...'
                  : authRoute === 'login'
                  ? 'Finish ! '
                  : authRoute === 'signup'
                  ? 'Create account'
                  : 'Send reset link'}
              </button>

              {/* Reset Password Link */}
              {authRoute === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => handleRouteChange('forgot')}
                    className="text-xs text-gray-400 hover:text-white min-w-[150px] border border-[1px] border-gray-400 rounded-3xl py-3 px-2 "
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>



        {/* Right Side (Image and Feature Area): Visual Context and Updates */}
        <div
          className="flex-1 min-h-[400px] md:min-h-0 bg-cover bg-center bg-no-repeat relative p-8 md:p-12 text-white hidden md:block"
          style={{
            backgroundImage: `url(${displayuno})`,}}
        >
          {/* Main Content Area */}
          <div className="absolute bottom-12 left-12 right-12 z-10 max-w-sm">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white text-gray-900 text-xs font-semibold">
                Feature Update
              </span>
              <h2 className="text-xl font-semibold leading-tight bg-gray-950/50 p-3 rounded-3xl">
                Everything is going more digital! Why not your online shopping experience?
              </h2>
              <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-white text-gray-900 w-fit">
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
