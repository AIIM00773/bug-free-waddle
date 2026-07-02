import { useState, useEffect, useRef } from 'react';
import {
    ArrowUp,
    User,
    Sparkles,
    Star,
    MapPin,
    CornerDownLeft,
} from 'lucide-react';

import ProductDetailsModal from './Components/ProductDetails';
import { useAuth } from './Providers/AuthContex';
import { useConversations } from './Providers/ConversationContext';
import { EXTENSIVE_MOCK_DATABASE } from './Constants/fakedb';
import type { Product } from './Constants/productTypes';
import HomeSider from './Components/HomeAside';
import AuthAlertComponent from './Components/HomeAuthAlert';
import HomeHeader from './Components/HomeHeader';



// ==========================================================
// 1. AI MESSAGE & PRODUCT DISPLAY COMPONENT
// ==========================================================
function AiMessageBlock({
    text, products, onCardClick, getMerchantStyles,
}: {
    text: string; products?: Product[];
    onCardClick: (p: Product) => void; getMerchantStyles: (m: Product['merchant']) => string;
}) {
    return (
        <div className="space-y-2 flex-1 min-w-0">
            <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                Soko AI
            </div>

            <div className="text-sm md:text-base leading-relaxed text-slate-800 min-h-[24px]">
                <p>{text}</p>
            </div>

            {products && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-3">
                    {products.map((product: Product) => (
                        <div
                            key={product.id}
                            onClick={() => onCardClick(product)}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 transform group flex flex-col justify-between cursor-pointer"
                        >
                            <div className="relative aspect-video w-full bg-slate-50 overflow-hidden border-b border-slate-100">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 ease-out" loading="lazy" />

                                <span className={`absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded shadow-xs tracking-wide uppercase ${getMerchantStyles(product.merchant)}`}>
                                    {product.merchant}
                                </span>
                            </div>

                            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-xs line-clamp-2 leading-snug text-slate-900 group-hover:text-emerald-600 transition">
                                        {product.title}
                                    </h4>
                                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                        <span className="truncate">{product.location}</span>
                                    </div>
                                </div>

                                <div className="pt-1 flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900 font-mono tracking-tight">{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-[10px] text-slate-400 line-through font-mono">{product.originalPrice}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-amber-500 font-bold text-[11px]">
                                        <Star className="h-3 w-3 fill-amber-500 shrink-0" />
                                        <span>{product.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 pt-0 text-center text-[10px] font-bold text-emerald-600 group-hover:underline pb-3 border-t border-slate-50 mt-1">
                                View details & comparison
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==========================================================
// 2. MAIN APPLICATION INTERFACE CONTAINER
// ==========================================================
export default function GPTMarketplace() {
    const sidebarOpen = true;
    const [input, setInput] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [showAuthAlertBox, setShowAuthAlertBox] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const { activeId, currentMessages, status, sendMessage, clearConversationErrorMessage, searchType } = useConversations();
    const { isAuthenticated, isLoading } = useAuth();

    // Consolidated Auth Routing
    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                setShowAuthAlertBox(true);
            } else {
                window.location.replace("/auth");
            }
        }
    }, [isAuthenticated, isLoading]);

    // Mock Related Products Generator
    useEffect(() => {
        if (selectedProduct) {
            const shuffled = [...EXTENSIVE_MOCK_DATABASE].sort(() => 0.5 - Math.random());
            setRelatedProducts(shuffled.filter(p => p.id !== selectedProduct.id).slice(0, 4));
        }
    }, [selectedProduct]);

    // Smooth scroll to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages, status]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedPayload = input.trim();
        if (!cleanedPayload || status === 'WORKING' || status === 'LOADING' || status === 'RETRYING') return;
        
        setInput("");
        clearConversationErrorMessage();
        await sendMessage(cleanedPayload);
    };

    const getMerchantStyles = (merchant: Product['merchant']) => {
        switch (merchant) {
            case 'Jumia': return 'bg-orange-500 text-white';
            case 'Kilimall': return 'bg-blue-600 text-white';
            case 'SkyGarden': return 'bg-pink-600 text-white';
            default: return 'bg-slate-600 text-white';
        }
    };

    return (
        <div className="h-screen w-screen flex bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden relative">
            {sidebarOpen && <HomeSider />}

            <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
                <HomeHeader />

                <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                    {!activeId && currentMessages.length === 0 ? (
                        <div className="max-w-xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center animate-fadeIn select-none h-full">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-slate-700 mb-6 shadow-xs">
                                <Sparkles className="h-6 w-6 stroke-[1.75] text-emerald-600" />
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950">
                                Shop intelligently {searchType === "intelligent_search" ? ("with Soko AI") : ""}
                            </h1>
                            <p className="mt-2 text-xs md:text-sm text-slate-500 max-w-sm leading-relaxed">
                                Find the best deals across Kenya, shop smarter with intelligent insights, in a single panel.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-24 space-y-8 pb-36">
                            {currentMessages.map((msg) => (
                                <div key={msg.id} className="flex gap-4 items-start text-xs md:text-sm animate-fadeIn">
                                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-xs font-bold ${msg.sender === 'user' ? 'bg-slate-200 text-slate-700' : 'bg-emerald-600 text-white'}`}>
                                        {msg.sender === 'user' ? <User className="h-4 w-4" /> : 'AI'}
                                    </div>

                                    {msg.sender === 'user' ? (
                                        <div className="space-y-2 flex-1 min-w-0">
                                            <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">You</div>
                                            <div className="text-sm md:text-base leading-relaxed text-slate-800">
                                                <p>{msg.text}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <AiMessageBlock
                                            text={msg.text}
                                            products={msg.products}
                                            onCardClick={setSelectedProduct}
                                            getMerchantStyles={getMerchantStyles}
                                        />
                                    )}
                                </div>
                            ))}

                            {(status === 'WORKING' || status === 'RETRYING') && (
                                <div className="flex gap-4 items-start text-xs md:text-sm animate-fadeIn">
                                    <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold">
                                        AI
                                    </div>
                                    <div className="space-y-1 flex-1 min-w-0 pt-0.5">
                                        <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                                            {searchType === "intelligent_search" ? ("soko AI") : ("Soko System ")}
                                        </div>
                                        <div className="flex items-center gap-2 min-h-[24px]">
                                            <span className="text-sm font-medium text-slate-500 antialiased">
                                                {status === 'RETRYING' ? 'Working on it ' : 'Processing .. '}
                                            </span>
                                            <div className="flex items-center gap-1 py-1 mt-2">
                                                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full opacity-80 animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full opacity-80 animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full opacity-80 animate-bounce" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent pt-6 pb-4 px-4 shrink-0 z-10 pointer-events-none">
                    <div className="max-w-2xl mx-auto w-full pointer-events-auto">
                        <form
                            onSubmit={handleSend}
                            className="bg-white border border-orange-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 rounded-2xl p-1.5 pl-4 flex items-center gap-3 transition-all duration-200 shadow-xs relative"
                        >
                            <div className='absolute top-[-10px] md:top-[10px] p-2 left-[15px] md:left-[-140px] text-xs px-4 py-1 bg-green-400 rounded-3xl text-[aliceblue] capitalize' >
                                {searchType.replace("_", " ")}
                            </div>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={status === 'WORKING' || status === 'LOADING' || status === 'RETRYING'}
                                placeholder={["intelligent_search", "intelligent_filter", "intelligent_followup"].includes(searchType) ? "Ask Soko AI... e.g., 'Find MacBook Pro M1 in Nairobi'" : "Make a direct product search... e.g. 'Sports Shoes'"}
                                className="flex-1 bg-transparent border-none text-sm font-normal text-slate-800 placeholder-slate-400 focus:outline-none py-2 disabled:opacity-50 pl-2"
                            />

                            <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg select-none shrink-0 font-mono tracking-wide">
                                <span>Enter</span>
                                <CornerDownLeft className="h-2.5 w-2.5 shrink-0" />
                            </div>

                            <button
                                type="submit"
                                disabled={!input.trim() || status === 'WORKING' || status === 'LOADING' || status === 'RETRYING'}
                                className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-100 text-white disabled:text-slate-300 flex items-center justify-center transition-all duration-200 shrink-0 font-bold active:scale-[0.95] cursor-pointer"
                            >
                                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                            </button>
                        </form>
                    </div>
                </div>

                {showAuthAlertBox && <AuthAlertComponent />}
            </div>

            {selectedProduct && (
                <ProductDetailsModal
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    relatedProducts={relatedProducts}
                />
            )}
        </div>
    );
}