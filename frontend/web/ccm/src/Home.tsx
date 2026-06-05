import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MessageSquare,
    PanelLeftClose,
    PanelLeft,
    ArrowUp,
    Plus,
    ShoppingBag,
    User,
    Star,
    MapPin,
    ShoppingCart,
    LogIn,
    MoreVertical,
    User2,
    Settings,
    HelpCircle,
    Sparkles,
    X,
    CheckCircle2,
    UserPlus2
} from 'lucide-react';
import ProductDetailsModal from './Components/ProductDetails';
import { useAuth } from './Providers/AuthContex';
import { EXTENSIVE_MOCK_DATABASE } from './Constants/fakedb';
import type { Product } from './Constants/productTypes';

// --- Static / Mock Data ---
const RECENT_SEARCHES = [
    "Sneakers under KSh 10k",
    "MacBook Pro M1 Nairobi",
    "Ergonomic office chair",
    "Gaming monitors Jumia"
];

export default function GPTMarketplace() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [actionsOpen, setActionsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [sampleProducts, setSampleProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [cartCount, setCartCount] = useState(0);

    // Pulled structural tracking flags out of your refactored provider context hook

    const {
        isAuthenticated, remindAlertActive,
        changeAuthRoute,
        isLoading,
    } = useAuth();


    const [localHideReminder, setLocalHideReminder] = useState(false);

    // Synchronize local manual dismiss tracking state whenever the context timer cycles
    useEffect(() => {
        if (remindAlertActive) {
            setLocalHideReminder(false);
        }
    }, [remindAlertActive]);

    useEffect(() => {
        if (selectedProduct) {
            const shuffled = EXTENSIVE_MOCK_DATABASE.sort(() => 0.5 - Math.random());
            setRelatedProducts(shuffled.filter(p => p.id !== selectedProduct.id).slice(0, 4));
        }
    }, [selectedProduct]);

    const [messages, setMessages] = useState<any[]>([
        {
            id: '1',
            sender: 'assistant',
            text: "How can I help you find products across Kenyan marketplaces today?"
        }
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSampleProducts(EXTENSIVE_MOCK_DATABASE);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: any = {
            id: Date.now().toString(),
            sender: 'user',
            text: input
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");

        setTimeout(() => {
            const assistantMsg: any = {
                id: (Date.now() + 1).toString(),
                sender: 'assistant',
                text: "Here are the top live product listings aggregated matching your request parameters:",
                products: sampleProducts
            };
            setMessages(prev => [...prev, assistantMsg]);
        }, 800);
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

            {/* LEFT SIDEBAR: History & Profile Panel */}
            <aside className={`${sidebarOpen ? 'w-[260px]' : 'w-0'} bg-white h-full flex flex-col transition-all duration-200 ease-in-out border-r border-slate-200/80 overflow-hidden shrink-0 text-slate-700`}>
                <div className="p-4 flex items-center justify-between gap-2 shrink-0">
                    <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl px-3 py-2 text-xs font-semibold w-full text-center transition text-white shadow-xs active:scale-[0.98]">
                        <Plus className="h-3.5 w-3.5 stroke-[2.5]" /> New Search
                    </button>
                    <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-700 transition shrink-0">
                        <PanelLeftClose className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-0.5">
                    <span className="px-2 text-[10px] font-medium text-slate-400 uppercase block mb-2.5 tracking-wide">
                        Recent Searches
                    </span>
                    {RECENT_SEARCHES.map((item, idx) => (
                        <button
                            key={idx}
                            className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-200/40 hover:text-slate-900 flex items-center gap-2.5 transition group truncate"
                        >
                            <MessageSquare className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition shrink-0" />
                            <span className="truncate">{item}</span>
                        </button>
                    ))}
                </div>


                <div className="p-3 border-t border-slate-200/60 bg-slate-50/50 shrink-0">

                    {isAuthenticated ? (
                        <div className="space-y-1">

                            {/* CART */}
                            <Link
                                to="/cart"
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition group"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <ShoppingCart className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition shrink-0" />
                                    <span className="truncate">Shopping Cart</span>
                                </div>

                                {cartCount > 0 && (
                                    <span className="bg-slate-200 group-hover:bg-emerald-600 group-hover:text-white transition text-slate-700 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* PROFILE */}
                            <Link
                                to="/profile"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition group"
                            >
                                <User2 className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition shrink-0" />
                                <span className="truncate">Account Profile</span>
                            </Link>

                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">

                            {/* SIGN IN */}
                            <Link
                                to="/auth"
                                onClick={() => changeAuthRoute("login")}
                                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] transition"
                            >
                                <LogIn className="h-3.5 w-3.5 text-slate-300" />
                                <span>Sign In</span>
                            </Link>

                            {/* SIGN UP */}
                            <Link
                                to="/auth"
                                onClick={() => changeAuthRoute("signup")}
                                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98] transition"
                            >
                                <UserPlus2 className="h-3.5 w-3.5 text-white/80" />
                                <span>Sign Up</span>
                            </Link>

                        </div>
                    )}

                </div>



            </aside>


            {/* RIGHT MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">

                {/* Floating Top Nav Bar Controls */}
                <header className="absolute top-0 left-0 right-0 h-14 bg-transparent flex items-center px-6 justify-between shrink-0 z-20 select-none">
                    <div className="flex items-center gap-3">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 hover:bg-slate-200 active:bg-slate-200 rounded-full transition text-slate-500 hover:text-slate-800"
                            >
                                <PanelLeft className="h-4 w-4" />
                            </button>
                        )}
                        <span className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-2">
                            CCM
                        </span>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setActionsOpen(!actionsOpen)}
                            className={`p-2 hover:bg-slate-200 active:bg-slate-200 rounded-full transition active:scale-[0.97] ${actionsOpen ? 'bg-slate-900 border-slate-300 shadow-inner text-white' : 'bg-slate-200 border-slate-200 hover:border-slate-300 shadow-xs'}`}
                            title="More Actions"
                        >
                            <MoreVertical className="h-4 w-4 stroke-[2.2]" />
                        </button>

                        {actionsOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setActionsOpen(false)} />
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-20 animate-fadeIn flex flex-col divide-y divide-slate-100">
                                    <div className="px-2 pb-1.5 space-y-0.5">
                                        {!isAuthenticated && (
                                            <Link to="/auth" onClick={() => { setActionsOpen(false); changeAuthRoute("login") }} className="w-full">
                                                <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                                    <LogIn className="h-4 w-4 text-slate-400" />
                                                    <span>Sign In</span>
                                                </button>
                                            </Link>
                                        )}

                                        {
                                            !isAuthenticated && (
                                                <Link to="/auth" onClick={() => { setActionsOpen(false); changeAuthRoute("signup") }} className="w-full">
                                                    <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                                        <UserPlus2 className="h-4 w-4 text-slate-400" />
                                                        <span>Sign Up</span>
                                                    </button>
                                                </Link>

                                            )
                                        }

                                        {isAuthenticated && (
                                            <Link to="/cart" onClick={() => setActionsOpen(false)} className="w-full">
                                                <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center justify-between group">
                                                    <div className="flex items-center gap-2.5">
                                                        <ShoppingBag className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition" />
                                                        <span>View Shopping Cart</span>
                                                    </div>
                                                    {cartCount > 0 && (
                                                        <span className="bg-emerald-600 text-white font-bold font-mono text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                                                            {cartCount}
                                                        </span>
                                                    )}
                                                </button>
                                            </Link>

                                        )}

                                    </div>

                                    <div className="px-2 pt-1.5 space-y-0.5">

                                        {isAuthenticated && (
                                            <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                                <Settings className="h-4 w-4 text-slate-400" />
                                                <span>Preferences</span>
                                            </button>
                                        )}

                                        <Link to={"/support"}>
                                            <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                                <HelpCircle className="h-4 w-4 text-slate-400" />
                                                <span>Help & Support</span>
                                            </button>
                                        </Link>

                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Conversation Viewport Container */}
                <div className="flex-1 overflow-y-auto w-full">
                    {messages.length <= 1 ? (
                        <div className="max-w-xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center animate-fadeIn select-none h-full">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-slate-700 mb-6">
                                <Sparkles className="h-7.5 w-7.5 stroke-[1.75] text-emerald-500" />
                            </div>
                            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
                                Shop intelligently with ccm-ai,
                            </h1>
                            <p className="mt-2 text-[10px] md:text-sm text-slate-400 max-w-xs leading-relaxed">
                                Find the best deals across Kenya, shop smarter with intelligent guidance, and save time and money with ccm-ai's powerful shopping assistant.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-8 pb-30">
                            {messages.map((msg) => (
                                <div key={msg.id} className="flex gap-4 items-start text-xs md:text-sm">
                                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-sm ${msg.sender === 'user' ? 'bg-slate-200 text-slate-700' : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold'}`}>
                                        {msg.sender === 'user' ? <User className="h-4 w-4" /> : 'S'}
                                    </div>

                                    <div className="space-y-2.5 flex-1">
                                        <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mt-2">
                                            {msg.sender === 'user' ? 'You' : 'ccm-ai'}
                                        </div>
                                        <div className="text-sm md:text-base leading-relaxed font-normal text-slate-800">
                                            <p>{msg.text}</p>
                                        </div>

                                        {msg.products && msg.products.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                                                {msg.products.map((product: Product) => (
                                                    <div
                                                        key={product.id}
                                                        onClick={() => setSelectedProduct(product)}
                                                        className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 transition-all duration-200 group flex flex-col justify-between cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                                                    >
                                                        <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                                                            <img
                                                                src={product.image}
                                                                alt={product.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                                                            />
                                                            <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide ${getMerchantStyles(product.merchant)}`}>
                                                                {product.merchant}
                                                            </span>
                                                        </div>

                                                        <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                                                            <div className="space-y-1">
                                                                <h4 className="font-bold text-xs line-clamp-2 leading-snug text-slate-900 group-hover:text-emerald-600 transition">{product.title}</h4>
                                                                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                                                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                                                    <span className="truncate">{product.location}</span>
                                                                </div>
                                                            </div>

                                                            <div className="pt-1 flex items-end justify-between">
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-extrabold text-slate-900 font-mono tracking-tight">{product.price}</span>
                                                                    {product.originalPrice && (
                                                                        <span className="text-[10px] text-slate-400 line-through font-mono">{product.originalPrice}</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-amber-500 font-bold text-[11px]">
                                                                    <Star className="h-3 w-3 fill-amber-500 shrink-0" />
                                                                    <span>{product.rating}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="p-3 pt-0 text-center text-[10px] font-semibold text-emerald-600 group-hover:underline pb-3 border-t border-slate-50 mt-1">
                                                            View details & purchase options
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOTTOM FIXED CHAT CONTAINER */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent pt-1 pb-1 px-4 shrink-0 z-10 pointer-events-none">
                    <div className="max-w-2xl mx-auto w-full pointer-events-auto">
                        <form
                            onSubmit={handleSend}
                            className="bg-white/80 backdrop-blur-md border border-emerald-400 mb-4 focus-within:mb-1 focus-within:border-emerald-500 focus-within:bg-white ring-emerald-400/5 focus-within:ring-4 focus-within:ring-emerald-500/5 rounded-2xl p-2 pl-4 flex items-center gap-3 transition-all duration-300 shadow-sm"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask SokoAI... e.g., 'Find running shoes on Kilimall'"
                                className="flex-1 bg-transparent border-none text-sm font-normal text-slate-800 placeholder-slate-400 focus:outline-none py-2 focus:py-2.5 transition-all duration-200"
                            />
                            {input.trim() && (
                                <button
                                    type="submit"
                                    className="h-8 w-8 rounded-full bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-100 text-white disabled:text-slate-300 flex items-center justify-center transition-all duration-200 shrink-0 font-bold active:scale-[0.95]"
                                >
                                    <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                                </button>
                            )}
                        </form>
                    </div>
                </div>






                {/* ==========================================================FLOATING SHOPPER BENEFITS CARD ========================================================== */}
                {remindAlertActive && !localHideReminder && !isAuthenticated && (
                    <div className="absolute bottom-30 right-6 w-full max-w-lg z-50 animate-slideUp border border-emerald-300 rounded-3xl shadow-lg bg-white p-4 ">
                        <div
                            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-orange-100
                bg-gradient-to-br
                from-orange-50
                via-white
                to-amber-50
                shadow-[0_20px_70px_rgba(251,146,60,0.12)]
                backdrop-blur-xl
            "
                        >
                            {/* Ambient glow */}
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl" />
                            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

                            <div className="relative p-7">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <span
                                            className="
                                inline-flex
                                items-center
                                rounded-full
                                border
                                border-orange-200
                                bg-orange-50
                                px-3
                                py-1
                                text-[11px]
                                font-medium
                                text-orange-700
                            "
                                        >
                                            Shopping gets smarter with an account
                                        </span>

                                        <h3 className="mt-4 text-2xl font-semibold text-slate-900 tracking-tight">
                                            Continue browsing freely.
                                        </h3>

                                        <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                                            Sign in whenever you're ready to save products,
                                            track price drops, and access direct marketplace
                                            checkout links from one place.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setLocalHideReminder(true)}
                                        className="
                            h-9
                            w-9
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            text-slate-400
                            hover:text-slate-700
                            hover:bg-white
                            transition
                        "
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Benefits */}
                                <div className="mt-6 grid gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-orange-600" />
                                        </div>

                                        <span className="text-sm text-slate-700">
                                            Save products across marketplaces
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-orange-600" />
                                        </div>

                                        <span className="text-sm text-slate-700">
                                            Get notified when prices drop
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-orange-600" />
                                        </div>

                                        <span className="text-sm text-slate-700">
                                            Faster access to marketplace checkout pages
                                        </span>
                                    </div>
                                </div>

                                {/* Soft footer */}
                                <div className="mt-6 pt-5 border-t border-orange-100">
                                    <p className="text-sm text-slate-500">
                                        Already have an account?
                                        <Link
                                            to="/auth"
                                            className=" ml-2 font-medium text-orange-600 hover:text-orange-700 underline-offset-4 hover:underline"
                                            onClick={() => changeAuthRoute("login")} >
                                            Sign in
                                        </Link>

                                        <span className="mx-2 text-slate-300">•</span>

                                        <Link
                                            to="/auth"
                                            className=" font-medium text-orange-600 hover:text-orange-700 underline-offset-4 hover:underline"
                                            onClick={() => changeAuthRoute("signup")}>
                                            Create one free
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* PRODUCT DETAILS DRAWER MODAL OVERLAY */}
            {selectedProduct && (
                <ProductDetailsModal
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    setCartCount={setCartCount}
                    relatedProducts={relatedProducts}
                />
            )}

        </div>
    );
}