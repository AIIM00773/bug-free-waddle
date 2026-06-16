import { useState, useEffect, useRef } from 'react';
import {
    ArrowUp,
    User,
    Star,
    MapPin,
    Sparkles,
    Loader2,
    AlertCircle
} from 'lucide-react';
import ProductDetailsModal from './Components/ProductDetails';
import { useAuth } from './Providers/AuthContex';
import { useConversations } from './Providers/ConversationContext';
import { EXTENSIVE_MOCK_DATABASE } from './Constants/fakedb';
import type { Product } from './Constants/productTypes';
import HomeSider from './Components/HomeAside';
import AuthAlertComponent from './Components/HomeAuthAlert';
import HomeHeader from './Components/HomeHeader';

// --- PREMIUM TYPING AND CASCADING PRODUCTS CONTROLLER ---
function TypingResponseBlock({
    messageId,
    text,
    products,
    isStreamed,
    markStreamed,
    onCardClick,
    getMerchantStyles,
    onLayoutResize
}: {
    messageId: string;
    text: string;
    products?: Product[];
    isStreamed?: boolean;
    markStreamed: (id: string) => void;
    onCardClick: (p: Product) => void;
    getMerchantStyles: (m: Product['merchant']) => string;
    onLayoutResize: () => void;
}) {
    // If it's already recorded as streamed, fill text instantly and show all items immediately
    const [displayedText, setDisplayedText] = useState(isStreamed ? text : "");
    const [showProducts, setShowProducts] = useState(!!isStreamed);
    const [visibleCardsCount, setVisibleCardsCount] = useState(isStreamed ? (products?.length || 0) : 0);

    // 1. Text Typing Engine
    useEffect(() => {
        if (isStreamed) {
            setDisplayedText(text);
            setShowProducts(true);
            return;
        }

        let index = 0;
        const speed = text.length > 200 ? 10 : 25; 
        setDisplayedText("");
        setShowProducts(false);
        setVisibleCardsCount(0);

        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(index));
            index++;
            onLayoutResize(); 

            if (index >= text.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setShowProducts(true);
                }, 300);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, isStreamed]);


    // 2. Card Cascading Stagger Engine
    useEffect(() => {
        if (isStreamed) {
            setVisibleCardsCount(products?.length || 0);
            return;
        }

        if (!showProducts || !products || products.length === 0) return;

        const cardInterval = setInterval(() => {
            setVisibleCardsCount((prev) => {
                if (prev >= products.length) {
                    clearInterval(cardInterval);
                    // Critical: Notify context database layer that streaming actions are wrapped up cleanly
                    markStreamed(messageId);
                    return prev;
                }
                setTimeout(onLayoutResize, 400); 
                return prev + 1;
            });
        }, 150); // 150ms delay between consecutive card mount entries

        return () => clearInterval(cardInterval);
    }, [showProducts, products, isStreamed, messageId, markStreamed]);

    return (
        <div className="space-y-2 flex-1 min-w-0">
            <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                Soko AI
            </div>
            <div className="text-sm md:text-base leading-relaxed text-slate-800 min-h-[24px]">
                {/* Only animate the blinking cursor tail while streaming is uncompleted */}
                <p className={!isStreamed ? "after:content-['|'] after:ml-0.5 after:text-emerald-600 after:animate-pulse after:font-light" : ""}>
                    {displayedText}
                </p>
            </div>

            {products && products.length > 0 && showProducts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-3">
                    {products.slice(0, visibleCardsCount).map((product: Product) => (
                        <div
                            key={product.id}
                            onClick={() => onCardClick(product)}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 transform animate-fadeIn translate-y-2 group flex flex-col justify-between cursor-pointer"
                        >
                            <div className="relative aspect-video w-full bg-slate-50 overflow-hidden border-b border-slate-100">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 ease-out"
                                    loading="lazy"
                                />
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

// --- MAIN APPLICATION INTERFACE ---
export default function GPTMarketplace() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [input, setInput] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [ShowauthAlertBox, setShowauthAlertBox] = useState(false);

    // Highlight: Grab the markStreamed action from hook context
    const { activeId, currentMessages, status, error, sendMessage, markStreamed } = useConversations();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            setShowauthAlertBox(true);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        setSidebarOpen(true);
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            const shuffled = [...EXTENSIVE_MOCK_DATABASE].sort(() => 0.5 - Math.random());
            setRelatedProducts(shuffled.filter(p => p.id !== selectedProduct.id).slice(0, 4));
        }
    }, [selectedProduct]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'auto' }); 
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages, status]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || status === 'WORKING') return;

        const dynamicPromptValue = input;
        setInput("");

        await sendMessage(dynamicPromptValue);
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
                                Shop intelligently with Soko AI
                            </h1>
                            <p className="mt-2 text-xs md:text-sm text-slate-500 max-w-sm leading-relaxed">
                                Find the best deals across Kenya, shop smarter with intelligent insights, and aggregate cross-platform search loops inside a single context panel.
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
                                        // Highlight: Connect values cleanly to the tracking engine props
                                        <TypingResponseBlock
                                            messageId={msg.id}
                                            text={msg.text}
                                            products={msg.products}
                                            isStreamed={msg.streamed}
                                            markStreamed={markStreamed}
                                            onCardClick={setSelectedProduct}
                                            getMerchantStyles={getMerchantStyles}
                                            onLayoutResize={scrollToBottom}
                                        />
                                    )}
                                </div>
                            ))}

                            {status === 'WORKING' && (
                                <div className="flex gap-4 items-center text-slate-400 animate-pulse py-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                                    <span className="text-xs font-semibold tracking-wide">Querying cross-marketplace scrapers...</span>
                                </div>
                            )}

                            {status === 'RETRYING' && (
                                <div className="flex gap-4 items-center text-amber-500 animate-pulse py-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-xs font-semibold tracking-wide">Connection unstable. Retrying regional marketplace nodes...</span>
                                </div>
                            )}

                            {error && (
                                <div className="flex gap-3 items-center p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold shadow-xs">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                                    <span>{error}</span>
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
                            className="bg-white border border-orange-400 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 rounded-2xl p-1.5 pl-4 flex items-center gap-3 transition-all duration-200 shadow-sm"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={status === 'WORKING' || status === 'RETRYING'}
                                placeholder={status === 'WORKING' ? "Soko AI is compiling listings..." : "Ask Soko AI... e.g., 'Find MacBook Pro M1 in Nairobi'"}
                                className="flex-1 bg-transparent border-none text-sm font-normal text-slate-800 placeholder-slate-400 focus:outline-none py-2 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || status === 'WORKING' || status === 'RETRYING'}
                                className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-100 text-white disabled:text-slate-300 flex items-center justify-center transition-all duration-200 shrink-0 font-bold active:scale-[0.95]"
                            >
                                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                            </button>
                        </form>
                    </div>
                </div>

                {ShowauthAlertBox && <AuthAlertComponent />}
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