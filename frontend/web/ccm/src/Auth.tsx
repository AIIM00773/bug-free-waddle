import { useState } from 'react';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle2,
    Sparkles
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
    };

    return (
        <div className="min-h-screen w-screen flex bg-slate-50 font-sans antialiased text-slate-800 selection:bg-emerald-50 selection:text-emerald-900">

            {/* 1. LEFT SIDE: Value Proposition Hero (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-white to-slate-50 relative overflow-hidden flex-col justify-between p-12 text-slate-800 border-r border-slate-200/60">

                {/* Soft background ambient glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Brand Header */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-sm shadow-sm shadow-emerald-600/10">
                            S
                        </div>
                        <span className="font-extrabold text-base tracking-tight text-slate-900">SokoAI</span>
                    </div>
                </div>

                {/* Core Value Stack */}
                <div className="relative z-10 max-w-sm my-auto space-y-6">
                    <h1 className="text-3xl font-black tracking-tight leading-tight text-slate-900">
                        The smartest way  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">to find deals & shop online ...</span>
                    </h1>

                    {/* Consumer-Focused Stats Grid */}
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200/80">
                        <div>
                            <span className="text-2xl font-black font-mono text-emerald-600 block tracking-tight">Real-Time</span>
                            <span className="text-[11px] text-slate-500 font-medium leading-normal block mt-1">Price Comparison & Smart Matching</span>
                        </div>
                        <div>
                            <span className="text-2xl font-black font-mono text-emerald-600 block tracking-tight">Intelligence</span>
                            <span className="text-[11px] text-slate-500 font-medium leading-normal block mt-1">Shopping Assistance & Clarity</span>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="relative z-10 text-xs text-slate-500 font-medium flex items-center gap-2">
                    <div className="h-5 w-5 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span>Free personal account. Unbiased price tracking.</span>
                </div>
            </div>

            {/* 2. RIGHT SIDE: Form Container */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 bg-slate-50 relative">

                {/* Mobile Logo Header */}
                <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-xs">
                        S
                    </div>
                    <span className="font-bold text-sm tracking-tight text-slate-900">SokoAI</span>
                </div>

                {/* Interactive Form Card Wrapper */}
                <div className="w-full max-w-[380px] space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/40">

                    {/* Header Segment */}
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold tracking-tight text-slate-900">
                            {isSignUp ? 'Create your profile' : 'Hello ! Welcome '}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium leading-normal">
                            {isSignUp
                                ? 'Sign up to unlock full features.'
                                : 'Log in to continue .'
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3.5">

                        {/* Full Name Input (Sign-Up Only) */}
                        {isSignUp && (
                            <div className="space-y-1.5 transition-all">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                                <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                                    <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                                        <User className="h-4 w-4 stroke-[1.8]" />
                                    </span>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-2.5 bg-transparent text-xs font-medium text-slate-900 placeholder-slate-400 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                            <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                                    <Mail className="h-4 w-4 stroke-[1.8]" />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-transparent text-xs font-medium text-slate-900 placeholder-slate-400 outline-none"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                                {!isSignUp && (
                                    <a href="#" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 tracking-tight transition-colors">
                                        Forgot password?
                                    </a>
                                )}
                            </div>
                            <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                                    <Lock className="h-4 w-4 stroke-[1.8]" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 bg-transparent text-xs font-medium text-slate-900 placeholder-slate-400 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4 stroke-[1.8]" /> : <Eye className="h-4 w-4 stroke-[1.8]" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox (Sign-Up Only) */}
                        {isSignUp && (
                            <div className="flex items-start gap-2.5 pt-0.5">
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    required
                                    checked={formData.agreeToTerms}
                                    onChange={handleInputChange}
                                    className="mt-0.5 h-3.5 w-3.5 accent-emerald-600 border-slate-300 rounded focus:ring-emerald-500/20 focus:ring-offset-0 transition cursor-pointer"
                                />
                                <label htmlFor="agreeToTerms" className="text-[11px] text-slate-400 font-medium leading-tight cursor-pointer select-none">
                                    I agree to the <a href="#" className="text-slate-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-slate-600 font-semibold hover:underline">Privacy Policy</a>.
                                </label>
                            </div>
                        )}

                        {/* Action Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10"
                        >
                            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                            {isSignUp ? (
                                <Sparkles className="h-3.5 w-3.5 stroke-[2.2]" />
                            ) : (
                                <ArrowRight className="h-3.5 w-3.5 stroke-[2.2]" />
                            )}
                        </button>
                    </form>



                    {/* Toggle View Link */}
                    <div className="text-center pt-1">
                        <p className="text-xs text-slate-400 font-medium">
                            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setFormData({ name: '', email: '', password: '', agreeToTerms: false });
                                }}
                                className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline outline-none transition-colors"
                            >
                                {isSignUp ? 'Sign In' : 'Sign up for free'}
                            </button>
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}