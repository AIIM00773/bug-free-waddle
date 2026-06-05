import React from 'react';
import { Link } from 'react-router-dom';

// --- Embedded Robust Lucide SVG Icons ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

const ScaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="m16 16 3-8 3 8c-.87.43-1.92.43-2.8 0a4 4 0 0 1-3.2 0ZM3 16l3-8 3 8c-.87.43-1.92.43-2.8 0a4 4 0 0 1-3.2 0M12 3v18M3 21h18" /></svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
);

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">

            {/* ================= HERO SECTION ================= */}
            <section className="relative overflow-hidden bg-white border-b border-slate-100 py-20 lg:py-28">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6">
                        About SokoAI
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                        Helping people shop with <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            absolute confidence
                        </span>
                    </h1>
                    <p className="mt-6 text-base sm:text-lg text-slate-600/90 leading-relaxed max-w-2xl mx-auto">
                        We built SokoAI to make online shopping easier to understand, effortless to compare, and less overwhelming. Find the exact product you need without wasting valuable time.
                    </p>
                </div>
            </section>

            {/* ================= VALUE PILLARS ================= */}
            <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group">
                        <div className="p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-emerald-50 transition-colors duration-200">
                            <SearchIcon />
                        </div>
                        <h3 className="font-bold text-slate-900 mt-4 text-lg">
                            Clear product search
                        </h3>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            Instead of scrolling through endless, messy listings, we curate and surface options that perfectly match your intent.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group">
                        <div className="p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-emerald-50 transition-colors duration-200">
                            <ScaleIcon />
                        </div>
                        <h3 className="font-bold text-slate-900 mt-4 text-lg">
                            Easier comparisons
                        </h3>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            We cleanly aggregate variables, options, and live pricing data so you can assess choices without jumping between tabs.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group">
                        <div className="p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-emerald-50 transition-colors duration-200">
                            <SparklesIcon />
                        </div>
                        <h3 className="font-bold text-slate-900 mt-4 text-lg">
                            Zero confusion
                        </h3>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            Shopping digital marketplaces should feel simple and empowering—never stressful, cluttered, or misleading.
                        </p>
                    </div>

                </div>
            </section>

            {/* ================= STORY SECTION ================= */}
            <section className="max-w-5xl mx-auto px-6 mt-24">
                <div className="bg-white border border-slate-200/60 rounded-3xl p-8 lg:p-12 shadow-sm grid md:grid-cols-5 gap-8 items-start">

                    <div className="md:col-span-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            Why we created <br />SokoAI
                        </h2>
                        <div className="h-1 w-12 bg-emerald-500 rounded-full mt-4"></div>
                    </div>

                    <div className="md:col-span-3 space-y-5 text-slate-600/95 text-sm sm:text-base leading-relaxed">
                        <p>
                            Shopping online today is broken. Consumers are constantly forced into a maze of endless algorithmic options, fluctuating price drops, and artificial scarcity signals. It’s hard to tell what’s actually a good deal.
                        </p>
                        <p>
                            SokoAI was built to cut through that noise. Rather than opening dozens of tabs across disparate platforms, we seamlessly stitch information together into a centralized interface so you can confidently focus on what works best for you.
                        </p>
                        <p className="font-medium text-slate-900">
                            Our ultimate vision is straightforward: democratize intelligent shopping variables so anyone can make expert decisions instantly.
                        </p>
                    </div>

                </div>
            </section>

            {/* ================= BEFORE vs AFTER EXPANDED ================= */}
            <section className="max-w-5xl mx-auto px-6 mt-16">
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Before Card */}
                    <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-6 lg:p-8">
                        <h3 className="font-bold text-rose-900 text-lg flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 height-5 rounded-full bg-rose-100 text-rose-600 font-extrabold text-xs">✕</span>
                            Before SokoAI
                        </h3>
                        <ul className="mt-4 space-y-3.5">
                            {[
                                "Drowning in dozens of unorganized open browser tabs",
                                "Confusing, hidden, or manipulative dynamic pricing",
                                "Analysis paralysis wondering if a product is high-quality"
                            ].map((text, i) => (
                                <li key={i} className="text-sm text-rose-800/80 flex items-start gap-2.5">
                                    <span className="text-rose-400 mt-1 select-none">•</span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* After Card */}
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 lg:p-8">
                        <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 height-5 rounded-full bg-emerald-100 text-emerald-600 font-extrabold text-xs">✓</span>
                            With SokoAI
                        </h3>
                        <ul className="mt-4 space-y-3.5">
                            {[
                                "Everything integrated beautifully into one unified dashboard",
                                "Transparent, real-time specifications and price trends",
                                "Rapid, simplified decisions engineered by clean data"
                            ].map((text, i) => (
                                <li key={i} className="text-sm text-emerald-800/90 flex items-start gap-2.5">
                                    <span className="text-emerald-500 mt-1 select-none">•</span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </section>

            {/* ================= CALL TO ACTION (CTA) ================= */}
            <section className="max-w-4xl mx-auto px-6 mt-20 mb-28 text-center">
                <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 lg:p-12 text-white shadow-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

                    <div className="relative z-10 max-w-xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Ready to change how you shop?
                        </h2>
                        <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
                            Experience the clarity of data-driven searching. Find products engineered perfectly to fit your budget and intent.
                        </p>
                        <Link to={"/shop"}>
                            <button className="mt-6 px-6 py-3 bg-emerald-500 text-slate-950 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                                Start Shopping Now
                            </button>
                        </Link>

                    </div>
                </div>
            </section>

        </div>
    );
}