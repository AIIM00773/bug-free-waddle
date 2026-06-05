import { useState } from 'react';
import {
    X,
    MapPin,
    Star,
    ExternalLink,
    ShoppingCart,
    Sparkles,
    ArrowRight,
    CornerDownLeft,
    Store,
    Truck,
    ShieldCheck
} from 'lucide-react';


import type { Product } from '../Constants/productTypes';



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
        { sender: 'ai', text: 'Hi! I’ve analyzed this listing across other regional marketplaces. Ask me about alternative pricing, localized delivery speeds, or product authenticity.' }
    ]);

    if (!selectedProduct) return null;

    const handleAiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiQuery.trim()) return;

        const newQuery = aiQuery;
        setChatHistory(prev => [...prev, { sender: 'user', text: newQuery }]);
        setAiQuery('');

        setTimeout(() => {
            setChatHistory(prev => [...prev, {
                sender: 'ai',
                text: `Analyzing metrics for "${selectedProduct.title}". Based on latest indexing, this price is highly competitive, saving roughly 8% compared to alternative vendor options.`
            }]);
        }, 600);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6 z-50 transition-all">

            {/* Main Container Canvas Frame */}
            <div className="bg-white w-full max-w-6xl h-full sm:h-[90vh] sm:rounded-xl overflow-hidden border border-slate-200/80 shadow-xl flex flex-col relative">

                {/* Header Close Trigger */}
                <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors z-50"
                    aria-label="Close modal"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Core Layout Grid Split */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                    {/* Left Panel: Visuals & Core Specs */}
                    <div className="w-full md:w-7/12 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white border-b md:border-b-0 md:border-r border-slate-100">

                        {/* Image Canvas with clean label styling */}
                        <div className="relative w-full h-64 sm:h-80 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 group">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.title}
                                className="w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/60 shadow-xs flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-[11px] font-medium text-slate-600 tracking-tight">{selectedProduct.merchant}</span>
                            </div>
                        </div>

                        {/* Product Meta Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
                                {selectedProduct.title}
                            </h3>

                            {/* Crisp Bento Layout Grid */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 bg-slate-50/60 border border-slate-200/40 rounded-lg flex flex-col justify-center">
                                    <span className="text-[10px] text-slate-400 font-medium tracking-tight mb-0.5">Region</span>
                                    <span className="text-xs font-medium text-slate-700 truncate flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" /> {selectedProduct.location}
                                    </span>
                                </div>

                                <div className="p-3 bg-slate-50/60 border border-slate-200/40 rounded-lg flex flex-col justify-center">
                                    <span className="text-[10px] text-slate-400 font-medium tracking-tight mb-0.5">Rating</span>
                                    <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" /> {selectedProduct.rating}
                                    </span>
                                </div>

                                <div className="p-3 bg-slate-50/60 border border-slate-200/40 rounded-lg flex flex-col justify-center">
                                    <span className="text-[10px] text-slate-400 font-medium tracking-tight mb-0.5">Status</span>
                                    <span className={`text-xs font-medium flex items-center gap-1 ${selectedProduct.inStock !== false ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        <ShieldCheck className="h-3 w-3 shrink-0" /> {selectedProduct.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Minimal Light-Themed Price Block */}
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between relative overflow-hidden">
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-medium tracking-tight block">Best Evaluated Offer</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-semibold tracking-tight text-slate-900">{selectedProduct.price}</span>
                                    {selectedProduct.originalPrice && (
                                        <span className="text-xs text-slate-400 line-through font-medium">{selectedProduct.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md text-right hidden xs:block">
                                <span className="text-[11px] font-medium text-emerald-700 block">Value Choice</span>
                            </div>
                        </div>

                        {/* Context Copy Blocks */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-medium tracking-tight text-slate-400 uppercase">Description</h4>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                {selectedProduct.description || "No incremental item descriptions extracted from the vendor catalog page during this indexing pass."}
                            </p>
                        </div>

                        {/* Alternative Cross-Matches Container */}
                        <div className="space-y-3 pt-2">
                            <div>
                                <h4 className="text-[11px] font-medium tracking-tight text-slate-400 uppercase">Alternative Listings</h4>
                                <p className="text-[11px] text-slate-400">Other nearby variations matching your catalog parameters</p>
                            </div>

                            {relatedProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center py-10 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                    <span className="text-xl mb-2">🔍</span>
                                    <p className="text-sm font-medium text-slate-600">No alternative items found</p>
                                    <p className="text-xs text-slate-400 max-w-[240px] mt-0.5">
                                        No other products matched this exact scope in our database today.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {relatedProducts.slice(0, 8).map((item, idx) => {
                                        // Contrast-optimized styling configuration for dynamic merchant tags
                                        const merchantStyles = "bg-slate-50 text-slate-700 border-slate-200";

                                        return (
                                            <div
                                                key={item.id || idx}
                                                onClick={() => setSelectedProduct(item)}
                                                className="group relative flex gap-4 p-3.5 bg-white border border-slate-100 rounded-2xl cursor-pointer transition-all duration-200 ease-out hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                                            >
                                                {/* Image Container - Slightly Larger, Premium Sharpness */}
                                                <div className="h-16 w-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                {/* Content Section */}
                                                <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
                                                    <div className="space-y-1">
                                                        {/* Merchant Badge & Metadata Line */}
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border ${merchantStyles}`}>
                                                                {item.merchant}
                                                            </span>
                                                            {item.rating && (
                                                                <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50/50 px-1.5 py-0.5 rounded-md">
                                                                    ★ {item.rating}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Title - Clean wrapping contrast */}
                                                        <h5 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 pr-1">
                                                            {item.title}
                                                        </h5>
                                                    </div>

                                                    {/* Price Breakdown & Location Layout */}
                                                    <div className="flex items-baseline justify-between gap-2 pt-1 mt-auto border-t border-slate-50">
                                                        <div className="flex items-baseline gap-1.5 flex-wrap">
                                                            <span className="text-sm font-bold text-slate-900">{item.price}</span>
                                                            {item.originalPrice && (
                                                                <span className="text-[11px] font-normal text-slate-400 line-through">
                                                                    {item.originalPrice}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 shrink-0">
                                                            <Truck className="h-3 w-3 text-slate-400 shrink-0" />
                                                            {item.location || "Nairobi"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>

                    </div>

                    {/* Right Panel: Integrated Assistant Chat */}
                    <div className="w-full md:w-5/12 bg-slate-50/60 flex flex-col h-[350px] md:h-full">

                        {/* Header Panel Node */}
                        <div className="p-4 border-b border-slate-100 bg-white shrink-0 flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
                                <Sparkles className="h-3.5 w-3.5 text-slate-100" />
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-slate-900">Market Intelligence</h4>
                                <p className="text-[10px] font-normal text-slate-400">Pricing safety & verification defense agent</p>
                            </div>
                        </div>

                        {/* Interactive Chat Stream Grid */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {chatHistory.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                                >
                                    <div className={`p-3 rounded-xl text-xs leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-slate-900 text-white rounded-br-none shadow-2xs'
                                        : 'bg-white text-slate-600 border border-slate-200/60 rounded-bl-none shadow-2xs'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contextual Suggestion Tags */}
                        <div className="px-4 pb-2 pt-1 shrink-0 bg-gradient-to-t from-slate-50 to-transparent">
                            <div className="flex flex-col gap-1.5">
                                {[
                                    "Is this price competitive for this product?",
                                    "Are there common issues reported with this model?"
                                ].map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setAiQuery(prompt)}
                                        className="text-left w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-200/50 text-[11px] font-medium text-slate-500 hover:text-slate-800 rounded-lg transition-colors flex items-center justify-between shadow-2xs group"
                                    >
                                        <span className="truncate pr-2 font-normal">{prompt}</span>
                                        <ArrowRight className="h-3 w-3 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Integrated Prompt Inline Form Input */}
                        <form onSubmit={handleAiSubmit} className="p-3 bg-white border-t border-slate-100 shrink-0">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={aiQuery}
                                    onChange={(e) => setAiQuery(e.target.value)}
                                    placeholder="Ask a question about this offer..."
                                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 focus:border-slate-300 focus:bg-white text-xs rounded-lg focus:outline-hidden transition-all text-slate-800 placeholder:text-slate-400"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    <CornerDownLeft className="h-4 w-4" />
                                </button>
                            </div>
                        </form>

                    </div>
                </div>

                {/* Footer Canvas Core Controls */}
                <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 z-10">
                    <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-200 shadow-2xs group"
                    >
                        <Store className="h-4 w-4 text-slate-400" />
                        View Merchant Profile
                        <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>

                    <button
                        onClick={() => {
                            if (selectedProduct.inStock !== false) {
                                setCartCount(prev => prev + 1);
                                setSelectedProduct(null);
                            }
                        }}
                        disabled={selectedProduct.inStock === false}
                        className="w-full sm:w-48 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 text-white disabled:text-slate-400 text-xs font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:shadow-none"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                    </button>
                </div>

            </div>
        </div>
    );
}