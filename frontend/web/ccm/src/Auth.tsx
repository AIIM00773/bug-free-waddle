





import { useState } from 'react';
import { 
  ShoppingBag, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isSignUp ? "Registering user..." : "Logging in user...", formData);
    // Wire up your API calls to your Django/Node auth endpoints here
  };

  return (
    <div className="min-h-screen w-screen flex bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* 1. LEFT SIDE: Value Proposition & Platform Showcase Hero (Hidden on Mobile) */}
 {/* 1. LEFT SIDE: Value Proposition & Platform Showcase Hero (Hidden on Mobile) */}
<div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-slate-50 to-emerald-50/30 relative overflow-hidden flex-col justify-between p-12 text-slate-800 border-r border-slate-200">
  {/* Soft background ambient glows instead of dark radial dark layers */}
  <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl z-0" />
  <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl z-0" />
  
  <div className="relative z-10">
    <div className="flex items-center gap-2.5">
      <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white shadow-md shadow-emerald-600/20">
        S
      </div>
      <span className="font-extrabold text-lg tracking-tight text-slate-900">SokoAI</span>
    </div>
  </div>

  {/* Core Value Stack */}
  <div className="relative z-10 max-w-md my-auto space-y-6">
 
    
    <h1 className="text-4xl font-black tracking-tight leading-tight text-slate-900">
      The smartest way to find <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">deals and Shop </span>.
    </h1>
    

    {/* Consumer-Focused Stats Grid */}
    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
  
      <div>
        <span className="text-3xl font-black font-mono text-emerald-600 block tracking-tight">Real-Time</span>
        <span className="text-xs text-slate-500 font-semibold leading-normal">Price Comparison & Matching</span>
      </div>

          <div>
        <span className="text-3xl font-black font-mono text-emerald-600 block tracking-tight">Inteligence </span>
        <span className="text-xs text-slate-500 font-semibold leading-normal">Smart Shopping Assistance and clarity</span>
      </div>
    </div>
  </div>

  {/* Footer Note */}
  <div className="relative z-10 text-xs text-slate-500 font-semibold flex items-center gap-2">
    <div className="h-5 w-5 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
      <CheckCircle2 className="h-3.5 w-3.5" />
    </div>
    <span>Free personal account. Unbiased price tracking.</span>
  </div>
</div>



      {/* 2. RIGHT SIDE: Single-Container Interactive Form (Swapped via State) */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 bg-slate-50 relative">
        
        {/* Mobile Logo Header */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-xs">
            S
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">SokoAI</span>
        </div>

        <div className="w-full max-w-[400px] space-y-6 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
          
          {/* Form Header Segment */}
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              {isSignUp ? 'Create your profile' : 'Welcome back'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {isSignUp 
                ? 'Sign up to unlock personalized marketplace deals.' 
                : 'Log in to continue tracking your items & searches.'
              }
            </p>
          </div>

          {/* Actual Active HTML Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Dynamic Sign-Up Name Attribute Input block */}
            {isSignUp && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 transition outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Email Address block */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 transition outline-hidden"
                />
              </div>
            </div>

            {/* Password block */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                {!isSignUp && (
                  <a href="#" className="text-[11px] font-bold text-emerald-600 hover:underline">
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 transition outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Conditional Checkbox Terms Filter block */}
            {isSignUp && (
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-0.5 h-3.5 w-3.5 text-emerald-600 border-slate-300 rounded-sm focus:ring-emerald-500/20 focus:ring-offset-0 transition cursor-pointer"
                />
                <label htmlFor="agreeToTerms" className="text-[11px] text-slate-500 font-medium leading-tight cursor-pointer select-none">
                  I agree to the <a href="#" className="text-emerald-600 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 font-bold hover:underline">Privacy Policy</a>.
                </label>
              </div>
            )}

            {/* Primary Action Form Submission Dispatcher */}
            <button
              type="submit"
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Social Authentication Splitter Divider Block */}
          <div className="relative flex py-1 items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="shrink-0 mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">or continue with</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Google Federated Quick Sign-On Trigger Button */}
          <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-xs">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google Connection
          </button>

          {/* Toggle Button Layer to Mutate States */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 font-medium">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setFormData({ name: '', email: '', password: '', agreeToTerms: false });
                }}
                className="text-emerald-600 font-bold hover:underline outline-hidden"
              >
                {isSignUp ? 'Sign In' : 'Sign Up Free'}
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}