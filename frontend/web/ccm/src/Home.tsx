import { useState } from 'react';
import {
    Menu,
    MessageSquare,
    PanelLeftClose,
    PanelLeft,
    ArrowUp,
    Plus,
    ExternalLink,
    ShoppingBag,
    User,
    X,
    Star,
    MapPin,
    CheckCircle,
    ShoppingCart,
    LogIn,
    MoreVertical,
    User2,
    Settings,
    HelpCircle,
    Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
    id: number;
    title: string;
    price: string;
    originalPrice?: string;
    merchant: 'Jumia' | 'Kilimall' | 'SkyGarden';
    rating: string;
    image: string;
    location: string;
    description?: string;
    inStock?: boolean;
}

interface Message {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    products?: Product[];
}

export default function GPTMarketplace() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [actionsOpen, setActionsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cartCount, setCartCount] = useState(0);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'assistant',
            text: "How can I help you find products across Kenyan marketplaces today?"
        }
    ]);

    const historyItems = [
        "Sneakers under KSh 10k",
        "MacBook Pro M1 Nairobi",
        "Ergonomic office chair",
        "Gaming monitors Jumia"
    ];

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");

        setTimeout(() => {
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'assistant',
                text: "Here are the top live product listings aggregated matching your request parameters:",
                products: [
                    {
                        id: 1,
                        title: "AeroMesh Onyx Running Shoes - Sport Edition",
                        price: "KSh 9,500",
                        originalPrice: "KSh 12,000",
                        merchant: "Jumia",
                        rating: "4.8",
                        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60",
                        location: "Nairobi CBD",
                        description: "High-performance breathable running shoes featuring adaptive foam mid-soles and vulcanized rubber traction pads. Perfect for daily training and urban athletics.",
                        inStock: true
                    },
                    {
                        id: 2,
                        title: "Nimbus Breathable Trainer Cushion V2",
                        price: "KSh 11,200",
                        merchant: "Kilimall",
                        rating: "4.5",
                        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&auto=format&fit=crop&q=60",
                        location: "Mombasa Road",
                        description: "Engineered with multi-directional mesh materials and an advanced orthotic internal layout. Delivers complete support over extended long-distance road wear.",
                        inStock: true
                    },
                    {
                        id: 3,
                        title: "Apex Horizon Light Trail Racers",
                        price: "KSh 8,900",
                        merchant: "SkyGarden",
                        rating: "4.2",
                        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=60",
                        location: "Thika Road",
                        description: "Ultra-lightweight offroad shoes tailored with enhanced mud guards and high-friction tread depth layouts to confidently master technical terrain trails.",
                        inStock: false
                    }
                ]
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

    const [IsAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div className="h-screen w-screen flex bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">

            {/* LEFT SIDEBAR: History Panel */}
            <aside className={`${sidebarOpen ? 'w-[260px]' : 'w-0'} bg-slate-100/80 h-full flex flex-col transition-all duration-200 ease-in-out border-r border-slate-200 overflow-hidden shrink-0 text-slate-700`}>
                <div className="p-3.5 flex items-center justify-between gap-2">
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl px-3 py-2 text-xs font-bold w-[190px] text-left transition text-white shadow-sm shadow-emerald-600/10 active:scale-[0.98]">
                        <Plus className="h-4 w-4 stroke-[2.5]" /> New Search
                    </button>
                    <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition shrink-0">
                        <PanelLeftClose className="h-4 w-4" />
                    </button>
                </div>

                {/* History Stream List */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                    <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase block mb-2 tracking-wider">
                        Recent Searches
                    </span>
                    {historyItems.map((item, idx) => (
                        <button
                            key={idx}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-xs flex items-center gap-2.5 transition group truncate"
                        >
                            <MessageSquare className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500 transition" />
                            <span className="truncate">{item}</span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* RIGHT MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">

                {/* Floating Top Nav Bar Controls */}
                <header className="absolute top-0 left-0 right-0 h-14 bg-transparent flex items-center px-6 justify-between shrink-0 z-20 select-none">
                    {/* Left Side: Brand & Workspace Toggles */}
                    <div className="flex items-center gap-3">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 hover:bg-slate-200 active:bg-slate-200 rounded-[200px] transition text-slate-500 hover:text-slate-800"
                            >
                                <PanelLeft className="h-4 w-4" />
                            </button>
                        )}
                        <span className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-2">
                            CCM
                        </span>
                    </div>

                    {/* Right Side: Toggle Action Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setActionsOpen(!actionsOpen)}
                            className={`p-2 hover:bg-slate-200 active:bg-slate-200 rounded-[200px] transition text-slate-600 hover:text-slate-950 active:scale-[0.97] ${actionsOpen ? 'bg-slate-900 border-slate-300 shadow-inner text-white' : 'bg-slate-200 border-slate-200 hover:border-slate-300 shadow-xs'}`}
                            title="More Actions"
                        >
                            <MoreVertical className="h-4 w-4 stroke-[2.2]" />
                        </button>

                        {/* Floating Action Menu Card */}
                        {actionsOpen && (
                            <>
                                {/* Click-outside overlay layer */}
                                <div className="fixed inset-0 z-10" onClick={() => setActionsOpen(false)} />

                                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-20 animate-fadeIn flex flex-col divide-y divide-slate-100">
                                    <div className="px-2 pb-1.5 space-y-0.5">
                                        {!IsAuthenticated && (
                                            <Link to="/auth" onClick={() => setActionsOpen(false)} className="w-full">
                                                <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                                    <LogIn className="h-4 w-4 text-slate-400" />
                                                    <span>Sign In / Register</span>
                                                </button>
                                            </Link>
                                        )}

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
                                    </div>

                                    {/* Additional contextual utility links */}
                                    <div className="px-2 pt-1.5 space-y-0.5">
                                        <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                            <Settings className="h-4 w-4 text-slate-400" />
                                            <span>Preferences</span>
                                        </button>
                                        <button className="w-full px-3 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-xs font-semibold flex items-center gap-2.5">
                                            <HelpCircle className="h-4 w-4 text-slate-400" />
                                            <span>Help & Support</span>
                                        </button>
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

                            {/* Clean, un-gradiented icon anchor */}
                            <div className="h-12 w-12 rounded-[200px]  flex items-center justify-center text-slate-700 mb-6">
                                <Sparkles className="h-7.5 w-7.5  stroke-[1.75] text-emerald-500" />
                            </div>

                            {/* Subtle, tracking-tight typographic pairing */}
                            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
                                Shop intelligently with ccm-ai, 
                            </h1>

                            <p className="mt-2 text-[10px] md:text-sm text-slate-400 max-w-xs leading-relaxed">
                                Find the best deals across kenya, shop smarter with inteligent guidance, and save time and money with ccm-ai's powerful shopping assistant.
                            </p>

                        </div>
                    ) : (
                        /* STANDARD CONVERSATION STREAM: Rendered when a dialogue is actively happening */
                        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-8 pb-30 ">
                            {messages.map((msg) => (
                                <div key={msg.id} className="flex gap-4 items-start text-xs md:text-sm">

                                    {/* Identity Profiles */}
                                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-sm ${msg.sender === 'user' ? 'bg-slate-200 text-slate-700' : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold'}`}>
                                        {msg.sender === 'user' ? <User className="h-4 w-4" /> : 'S'}
                                    </div>

                                    {/* Content Stream Bubble Layer */}
                                    <div className="space-y-2.5 flex-1">
                                        <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mt-2 ">
                                            {msg.sender === 'user' ? 'You' : 'ccm-ai '}
                                        </div>

                                        <div className="text-sm md:text-base leading-relaxed font-normal text-slate-800">
                                            <p>{msg.text}</p>
                                        </div>

                                        {/* Real Vertical Marketplace Card Grid Structure Block */}
                                        {msg.products && msg.products.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 ">
                                                {msg.products.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        onClick={() => setSelectedProduct(product)}
                                                        className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 transition-all duration-200 group flex flex-col justify-between cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                                                    >
                                                        {/* Image Window Wrap with Aspect Lock */}
                                                        <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                                                            <img
                                                                src={product.image}
                                                                alt={product.title}
                                                                className="w-full h-full object-cover group-hover:scale-103 transition duration-500 ease-out"
                                                            />
                                                            <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide ${getMerchantStyles(product.merchant)}`}>
                                                                {product.merchant}
                                                            </span>
                                                        </div>

                                                        {/* Data Matrix */}
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
                            className="bg-white/80 backdrop-blur-md border border-emerald-400 mb-4 focus-within:mb-1  focus-within:border-emerald-500 focus-within:bg-white ring-emerald-400/5   focus-within:ring-4 focus-within:ring-emerald-500/5 rounded-2xl p-2 pl-4 flex items-center gap-3 transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)]"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask SokoAI... e.g., 'Find running shoes on Kilimall'"
                                className="flex-1 bg-transparent  border-none  text-sm font-normal  text-slate-800 placeholder-slate-600 focus:outline-hidden py-2 focus:py-2.5 transition-all duration-200"
                            />
                            {input.trim() && (
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="h-8 w-8 rounded-[400px] bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-100 text-white disabled:text-slate-300 flex items-center justify-center transition-all duration-200 shrink-0 font-bold active:scale-[0.95] transition-all duration-300"
                                >
                                    <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                                </button>
                            )}
                        </form>
                    </div>
                </div>



            </div>

            {/* PRODUCT DETAILS DRAWER MODAL OVERLAY */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col relative max-h-[90vh]">

                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 rounded-xl transition z-10 border border-slate-200 shadow-xs"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Immersive Image Frame */}
                        <div className="relative w-full h-56 bg-slate-50 overflow-hidden shrink-0 border-b border-slate-100">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.title}
                                className="w-full h-full object-cover"
                            />
                            <span className={`absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md tracking-wider uppercase ${getMerchantStyles(selectedProduct.merchant)}`}>
                                Live on {selectedProduct.merchant}
                            </span>
                        </div>

                        {/* Modal Specs Payload Content */}
                        <div className="p-5 flex-1 overflow-y-auto space-y-4">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900 leading-snug">selectedProduct.title</h3>
                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{selectedProduct.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-amber-600 font-bold">
                                        <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                                        <span>{selectedProduct.rating} Rating</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Cost Breakdowns */}
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wide">Aggregated Price</span>
                                    <div className="flex items-baseline gap-2 mt-0.5">
                                        <span className="text-xl font-black font-mono text-emerald-600">{selectedProduct.price}</span>
                                        {selectedProduct.originalPrice && (
                                            <span className="text-xs text-slate-400 line-through font-mono">{selectedProduct.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wide">Availability</span>
                                    <span className={`text-xs font-bold flex items-center gap-1 mt-1 justify-end ${selectedProduct.inStock !== false ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        <CheckCircle className="h-3 w-3" />
                                        {selectedProduct.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">Listing Context</span>
                                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                    {selectedProduct.description || "No supplemental item descriptions extracted from the vendor page during this search indexing pass."}
                                </p>
                            </div>
                        </div>

                        {/* Split Action Drawer CTAs Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-3 shrink-0">
                            <a
                                href="#"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200 shadow-xs"
                            >
                                Go to Vendor Listing
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <button
                                onClick={() => {
                                    if (selectedProduct.inStock !== false) {
                                        setCartCount(prev => prev + 1);
                                        setSelectedProduct(null);
                                    }
                                }}
                                disabled={selectedProduct.inStock === false}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                <ShoppingCart className="h-3.5 w-3.5" />
                                Add to Cart
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}