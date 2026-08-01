import React, { useState } from 'react';
import {
  Phone,
  Lock,
  User,
  Mail,
  ArrowLeft,
  AlertCircle,
  X,
  Eye,
  EyeOff,
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

  // Local form input states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validating,setValidating] = useState(false)

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

  if ( isAuthenticated || proceedWithoutAuth) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141414]/90 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Top Right Quick Close Button */}
      <button
        type="button"
        onClick={() => setProceedWithoutAuth(true)}
        className="fixed top-5 right-5 text-gray-400 transition-colors hover:text-white border border-[1px] border-gay-50/50  p-1 rounded-full  cursor-pointer hover:bg-gray-500  "
        title="Close"
      >
        <X className="h-5 w-5"  />
      </button>

      {/* Main Overlay Content Box */}
      <div className="relative flex w-full max-w-md flex-col items-center text-center font-sans">
  
        {/* Hero Header */}
        <div className="mb-6 space-y-2">
          <h1 className="font-serif text-3xl text-gray-100 sm:text-4xl tracking-tight">
            Focus your Online Shopping  experience
          </h1>
          <p className="text-sm text-emerald-600 ">
            {authRoute === 'login' && 'Sign in to continue'}
            {authRoute === 'signup' && 'Create your account to continue'}
            {authRoute === 'forgot' && 'Reset your password'}
          </p>
        </div>

        {/* Auth Card Form Wrapper */}
        <div className="w-full space-y-4">
        
          {/* Context Error Alert */}
          {authError && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-rose-900/50 bg-rose-950/20 p-3 text-left text-xs text-rose-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="leading-relaxed">{authError}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-2 text-left">
            {/* FULL NAME (Signup) */}
            {authRoute === 'signup' && (
              <div className="relative flex items-center rounded-2xl border border-[#2d2d2d] bg-[#1a1a1a] px-3.5 py-2.5 focus-within:border-gray-500">
                <User className="mr-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            )}

            {/* PHONE NUMBER (Login & Signup) */}
            {authRoute !== 'forgot' && (
              <div className="relative flex items-center rounded-2xl border border-[#2d2d2d] bg-[#1a1a1a] px-3.5 py-2.5 focus-within:border-gray-500">
                <Phone className="mr-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number (e.g. 07XXXXXXXX)"
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            )}

            {/* EMAIL ADDRESS (Forgot Password) */}
            {authRoute === 'forgot' && (
              <div className="relative flex items-center rounded-2xl border border-[#2d2d2d] bg-[#1a1a1a] px-3.5 py-2.5 focus-within:border-gray-500">
                <Mail className="mr-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            )}

            {/* PASSWORD FIELD */}
            {authRoute !== 'forgot' && (
              <div className="relative flex items-center rounded-2xl border border-[#2d2d2d] bg-[#1a1a1a] px-3.5 py-2.5 focus-within:border-gray-500">
                <Lock className="mr-2.5 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
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
            )}

            {/* Forgot Password Link */}
            {authRoute === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => handleRouteChange('forgot')}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Forgot Password?
                </button>
              </div>
            )}




            {/* Main Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 flex w-full items-center justify-center rounded-full border border-[#2d2d2d] bg-[#1f1f1f] py-2.5 text-sm font-semibold  ${isLoading? 'text-emerald-600 text-xs hover:none':'text-gray-200 hover:bg-[#282828] hover:text-white ' } transition-all  active:scale-[0.99] disabled:opacity-50`}
            >
              {isLoading
                ? 'Processing...'
                : authRoute === 'login'
                ? 'Continue with credentials'
                : authRoute === 'signup'
                ? 'Create account'
                : 'Send reset link'}
            </button>
          </form>

          {/* Route Switcher Footer */}
          <div className="pt-3 text-center text-xs text-gray-500">
            {authRoute === 'login' ? (
              <span>
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleRouteChange('signup')}
                  className="font-medium text-gray-300 hover:text-white underline underline-offset-4"
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleRouteChange('login')}
                  className="font-medium text-gray-300 hover:text-white underline underline-offset-4"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
