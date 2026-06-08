

import { 
    Star, 
    ThumbsUp, 
    Award 
} from 'lucide-react';

export default function ReviewsSubmissionsView() {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-slate-100 shadow-xs text-slate-800">
            
            {/* --- HEADER BLOCK --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">My Reviews & Feedback</h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Manage your product feedback, merchant ratings, and shopping experiences.
                    </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-lg text-xs font-bold text-blue-600 self-start sm:self-center">
                    <Award className="h-3.5 w-3.5 text-blue-500" />
                    <span>Level 2 Contributor</span>
                </div>
            </div>

            {/* --- LAYOUT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* COLUMN 1 & 2: RECENT REVIEWS FEED */}
                <div className="lg:col-span-2 space-y-4">
                    
                    {/* HARDCODED REVIEW 1 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 hover:shadow-xs transition-all">
                        {/* Target Product Association Header */}
                        <div className="flex items-start justify-between gap-4 border-b border-slate-50 pb-3">
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 border border-orange-100 rounded-md">
                                    Jumia Store
                                </span>
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 line-clamp-1">
                                    Vitron HTC3268 32-Inch Smart Android TV
                                </h3>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">2 weeks ago</span>
                        </div>

                        {/* Star Rating Strip */}
                        <div className="flex items-center gap-1 text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <Star className="h-3.5 w-3.5 text-slate-200" />
                            <span className="text-xs font-bold text-slate-700 ml-1">4.0 / 5.0</span>
                        </div>

                        {/* User Review Body Text */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            The display clarity is incredible for the price point. Smart Android features sync perfectly with Netflix and local streaming apps. Knocked off one star because the remote feels a bit lightweight, but overall it's a solid bargain in Nairobi right now.
                        </p>

                        {/* Feedback Interaction Metrics */}
                        <div className="flex items-center justify-between pt-2 text-xs">
                            <button className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-600 font-bold transition-colors">
                                <ThumbsUp className="h-3.5 w-3.5" />
                                <span>Helpful (12)</span>
                            </button>
                            <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-100">
                                Verified Purchase
                            </span>
                        </div>
                    </div>

                </div>

                {/* COLUMN 3: SIDEBAR RATINGS SUMMARY ANALYSIS */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Review Breakdown</h4>
                    
                    {/* Visual Meter Bar Framework */}
                    <div className="space-y-2">
                        {/* 5 Star Row */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <span className="w-3">5</span>
                            <Star className="h-3 w-3 text-amber-400 fill-current shrink-0" />
                            <div className="flex-1 h-2 bg-slate-200/70 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-900 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                            <span className="w-7 font-mono text-right text-slate-400">40%</span>
                        </div>

                        {/* 4 Star Row */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <span className="w-3">4</span>
                            <Star className="h-3 w-3 text-amber-400 fill-current shrink-0" />
                            <div className="flex-1 h-2 bg-slate-200/70 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-900 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <span className="w-7 font-mono text-right text-slate-400">60%</span>
                        </div>

                        {/* 3 Star to 1 Star collapsed default layout placeholders */}
                        {['3', '2', '1'].map((stars) => (
                            <div key={stars} className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                <span className="w-3">{stars}</span>
                                <Star className="h-3 w-3 text-slate-200 fill-current shrink-0" />
                                <div className="flex-1 h-2 bg-slate-100 rounded-full"></div>
                                <span className="w-7 font-mono text-right">0%</span>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-slate-200 my-1"></div>

                    <p className="text-[11px] text-slate-400 leading-relaxed text-center">
                        Your reviews are processed to help other shoppers secure accurate pricing insights across aggregate retail stores.
                    </p>
                </div>

            </div>
        </div>
    );
}