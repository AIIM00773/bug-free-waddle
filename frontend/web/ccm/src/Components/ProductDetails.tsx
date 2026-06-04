import { useState } from 'react';
import {
    X,
    MapPin,
    Star,
    CheckCircle,
    ExternalLink,
    ShoppingCart,
    Sparkles,
    ArrowRight,
    CornerDownLeft,
    Store,
    BadgePercent,
    Truck,
    ShieldCheck
} from 'lucide-react';

interface Product {
    id: string;
    title: string;
    price: string;
    originalPrice?: string;
    image: string;
    merchant: string;
    location: string;
    rating: string | number;
    inStock?: boolean;
    description?: string;
}

interface ProductModalProps {
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
    setCartCount: React.Dispatch<React.SetStateAction<number>>;
    relatedProducts?: Product[];
}

export default function ProductDetailsModal({
    selectedProduct,
    setSelectedProduct,
    setCartCount,
    relatedProducts = [],
}: ProductModalProps) {

    const [aiQuery, setAiQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai', text: string }>>([
        { sender: 'ai', text: 'Hi! I’ve analyzed this listing across other Kenyan marketplaces. Ask me about alternative pricing, localized delivery speeds, or product authenticity.' }
    ]);

    if (!selectedProduct) return null;

    const handleAiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiQuery.trim()) return;

        const newQuery = aiQuery;
        setChatHistory(prev => [...prev, { sender: 'user', text: newQuery }]);
        setAiQuery('');

        // Simulate interactive pipeline stream response
        setTimeout(() => {
            setChatHistory(prev => [...prev, {
                sender: 'ai',
                text: `Analyzing metrics for "${selectedProduct.title}". Based on latest web scrapers, this price is highly competitive for the regional market, saving roughly 8% compared to alternative vendor items.`
            }]);
        }, 600);
    };

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 z-50 animate-fadeIn">

            {/* Full-bleed responsive Canvas Frame */}
            <div className="bg-white w-full max-w-8xl h-full sm:h-[98vh] sm:rounded-[4px] overflow-hidden border border-slate-200/80 shadow-2xl flex flex-col relative">

                {/* FLOATING DISMISS BUTTON */}
                <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 p-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full transition-all z-50 shadow-md active:scale-95"
                    aria-label="Close sheet"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* MAIN SPLIT GRID CORE */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                    {/* LEFT WORKSPACE: VISUAL SHOWCASE & PRODUCT BENTO SPECS */}
                    <div className="w-full md:w-7/12 overflow-y-auto p-5 sm:p-8 space-y-8 custom-scrollbar bg-linear-to-b from-white to-slate-50/50">

                        {/* Immersive Image Display Frame with Drop-shadow badge overlay */}
                        <div className="relative w-full h-72 sm:h-96 bg-slate-100 rounded-2xl overflow-hidden shadow-xs border border-slate-200/50 group">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                            />

                            {/* Merchant branding chip directly in visual context */}
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-md border border-slate-100 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                <span className="text-xs font-bold text-slate-800 tracking-wide font-mono uppercase">{selectedProduct.merchant}</span>
                            </div>
                        </div>

                        {/* Title & Core Metadata Layout */}
                        <div className="space-y-3">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                {selectedProduct.title}
                            </h3>

                            {/* Structured Asymmetrical Bento Meta Spec Matrix */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                                <div className="p-3 bg-white border border-slate-200/60 rounded-xl flex items-center gap-2.5 shadow-2xs">
                                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Region</span>
                                        <span className="text-xs font-bold text-slate-700 block truncate">{selectedProduct.location}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-white border border-slate-200/60 rounded-xl flex items-center gap-2.5 shadow-2xs">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Score</span>
                                        <span className="text-xs font-bold text-slate-700 block">{selectedProduct.rating} / 5.0</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-white border border-slate-200/60 rounded-xl flex items-center gap-2.5 shadow-2xs col-span-2 sm:col-span-1">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Stock Status</span>
                                        <span className={`text-xs font-bold block ${selectedProduct.inStock !== false ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {selectedProduct.inStock !== false ? 'Available' : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Immersive Premium Price Matrix Block */}
                        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group">
                            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none transition-transform group-hover:scale-110">
                                <BadgePercent className="h-32 w-32" />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Best Scraped Offer</span>
                                <div className="flex items-baseline gap-2.5">
                                    <span className="text-2xl font-black tracking-tight text-emerald-400 font-mono">{selectedProduct.price}</span>
                                    {selectedProduct.originalPrice && (
                                        <span className="text-sm text-slate-400 line-through font-mono font-medium">{selectedProduct.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-right hidden xs:block">
                                <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider block">Deal Rating</span>
                                <span className="text-xs font-bold text-white block">Value Choice</span>
                            </div>
                        </div>

                        {/* Clean Copy Block */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Merchant Item Context</h4>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal bg-white p-4 rounded-xl border border-slate-200/40 shadow-2xs">
                                {selectedProduct.description || "No incremental item descriptions extracted from the vendor catalog page during this pipeline indexing pass."}
                            </p>
                        </div>

                        {/* "CLOSE CALLS" SECTION (DYNAMIC CARD MATRIX WITH METRIC HIGHLIGHTS) */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Close Calls</h4>
                                    <p className="text-[11px] text-slate-500">Alternative catalog cross-matches identified nearby</p>
                                </div>
                            </div>

                            {relatedProducts.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-xs font-medium text-slate-400 bg-white">
                                    No alternative catalog items matched this exact pricing spectrum today.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {relatedProducts.slice(0, 2).map((item, idx) => (
                                        <div
                                            key={item.id || idx}
                                            onClick={() => setSelectedProduct(item)}
                                            className="p-3 border border-slate-200/70 bg-white rounded-xl flex gap-3.5 cursor-pointer transition-all hover:border-slate-400 hover:shadow-sm group relative overflow-hidden"
                                        >
                                            {/* Micro visual indicator badge for cross-market comparisons */}
                                            <span className="absolute top-2 right-2 bg-slate-100 text-[9px] font-bold text-slate-500 px-1.5 py-0.5 rounded-md uppercase font-mono">
                                                {item.merchant}
                                            </span>

                                            <div className="h-16 w-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                            </div>

                                            <div className="flex flex-col justify-center min-w-0 flex-1 space-y-1">
                                                <h5 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors pr-10">{item.title}</h5>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xs font-black font-mono text-slate-900">{item.price}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                    <Truck className="h-3 w-3 shrink-0" /> {item.location || "Nairobi"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT WORKSPACE: DYNAMIC CONVERSATION CHAT PLATFORM */}
                    <div className="w-full md:w-5/12 bg-slate-50 border-t md:border-t-0 border-slate-200/60 flex flex-col h-[400px] md:h-full">

                        {/* Elegant Minimal Header Node */}
                        <div className="p-4 sm:p-5 border-b border-slate-200/50 bg-white shrink-0 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs">
                                <Sparkles className="h-4 w-4 fill-emerald-100/20" />
                            </div>
                            <div>
                                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Ask AI About It</h4>
                                <p className="text-[10px] font-medium text-slate-400">Contextual listing insights & price defense agent</p>
                            </div>
                        </div>

                        {/* Stateful Interactive Chat History Stream */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                            {chatHistory.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                                >
                                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-slate-900 text-white rounded-br-none shadow-xs'
                                        : 'bg-white text-slate-700 border border-slate-200/60 rounded-bl-none shadow-2xs'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Fixed Floating Suggestion Query Bank Container */}
                        <div className="px-4 pb-2 pt-1 shrink-0 bg-linear-to-t from-slate-50 to-transparent">
                            <div className="flex flex-col gap-1.5">
                                {[
                                    "Is this price competitive for this product?",
                                    "Are there common issues reported with this model?"
                                ].map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setAiQuery(prompt)}
                                        className="text-left w-full p-2 bg-white hover:bg-slate-100 border border-slate-200/60 text-[11px] font-medium text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center justify-between shadow-2xs group"
                                    >
                                        <span className="truncate pr-2">{prompt}</span>
                                        <ArrowRight className="h-3 w-3 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Integrated Chat Form Input Anchor */}
                        <form onSubmit={handleAiSubmit} className="p-3 bg-white border-t border-slate-200/60 shrink-0">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={aiQuery}
                                    onChange={(e) => setAiQuery(e.target.value)}
                                    placeholder="Ask a question about this offer..."
                                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white text-xs rounded-xl focus:outline-hidden transition-all text-slate-800 placeholder:text-slate-400 shadow-2xs"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all shadow-xs"
                                >
                                    <CornerDownLeft className="h-3.5 w-3.5 stroke-[2.5]" />
                                </button>
                            </div>
                        </form>

                    </div>
                </div>

                {/* BOTTOM COMPACT FOOTER ACTION ROW */}
                <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4  gap-3 shrink-0 z-10 shadow-xl">
                    <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 border border-slate-200 shadow-2xs group active:scale-99"
                    >
                        <Store className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        View Merchant Profile
                        <ExternalLink className="h-3.5 w-3.5 stroke-[1.5]" />
                    </a>


                    <div></div>
                    <div></div>


                    <button
                        onClick={() => {
                            if (selectedProduct.inStock !== false) {
                                setCartCount(prev => prev + 1);
                                setSelectedProduct(null);
                            }
                        }}
                        disabled={selectedProduct.inStock === false}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 text-white disabled:text-slate-400 text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:shadow-none active:scale-99"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                    </button>
                </div>

            </div>
        </div>
    );
}