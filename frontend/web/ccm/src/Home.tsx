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
    ChevronDown
} from 'lucide-react';

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

    // Mock search history items
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

        // Simulate direct marketplace data dump injection 
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

    // Helper mapping helper to anchor brand identity
    const getMerchantStyles = (merchant: Product['merchant']) => {
        switch (merchant) {
            case 'Jumia': return 'bg-orange-500 text-white';
            case 'Kilimall': return 'bg-blue-600 text-white';
            case 'SkyGarden': return 'bg-pink-600 text-white';
            default: return 'bg-zinc-600 text-white';
        }
    };

    return (
        <div className="h-screen w-screen flex bg-[#0f172a] text-[#f1f5f9] font-sans antialiased overflow-hidden">

            {/* LEFT SIDEBAR: History Panel */}
            <aside className={`${sidebarOpen ? 'w-[260px]' : 'w-0'} bg-[#020617] h-full flex flex-col transition-all duration-200 ease-in-out border-r border-slate-800/60 overflow-hidden shrink-0`}>
                <div className="p-3.5 flex items-center justify-between gap-2 border-b border-slate-800/60 shrink-0">

                    <span className="font-bold text-4  tracking-tight text-slate-100 flex items-center gap-2 border border-slate-800/60 px-2 py-1 rounded-md text-[11px] uppercase shadow-sm px-3 py-0.5 bg-slate-800/50">
                        ccm
                    </span>

                    <button className="flex items-center gap-2 border border-slate-800 hover:bg-slate-900 rounded-xl px-3 py-2 text-xs font-semibold  text-left transition text-slate-200 hover:border-slate-700">
                        <Plus className="h-4 w-4 text-emerald-500" /> New
                    </button>

                    <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 transition">
                        <PanelLeftClose className="h-4 w-4" />
                    </button>

                </div>

                {/* History Stream List */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                    <span className="px-3 text-[11px] font-bold text-slate-500 uppercase block mb-2 tracking-wider flex flex-col items-start">Your Recent Searches</span>
                    {historyItems.map((item, idx) => (
                        <button key={idx} className="w-full text-left px-3 py-2 hover:border   gap-4 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-100 flex items-center transition truncate mb-4 ">
                            <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                            <span className="truncate">{item}</span>
                        </button>
                    ))}
                </div>
            </aside>







            {/* RIGHT MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col h-full bg-[#0f172a] relative overflow-hidden">

                {/* Floating Top Nav Bar Controls */}
                <header className="h-14 border-b border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-md flex items-center px-4 justify-between shrink-0 z-10">
                    <div className="flex items-center gap-2">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-900 rounded-lg transition text-slate-400">
                                <PanelLeft className="h-4 w-4" />
                            </button>
                        )}
                        <span className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="font-bold text-white text-3 " title="CCM">
                                CCM
                            </span>
                            <ChevronDown className="h-3 w-3 text-slate-400" size={16} color="currentColor" />
                        </span>
                    </div>

                    {/* Persistent Mini Cart Indicator */}
                    <div className="flex items-center gap-4">
                        <div className="relative p-2 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer">
                            <ShoppingBag className="h-4 w-4" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 font-bold font-mono text-[9px] h-4 w-4 rounded-full flex items-center justify-center shadow-md">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </div>
                </header>







                {/* Conversation Viewport Container */}
                <div className="flex-1 overflow-y-auto w-full">
                    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-8">
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex gap-4 items-start text-xs md:text-sm">

                                {/* Identity Profiles */}
                                <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-slate-800 text-slate-300' : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-black'}`}>
                                    {msg.sender === 'user' ? <User className="h-4 w-4" /> : 'S'}
                                </div>

                                {/* Content Stream Bubble Layer */}
                                <div className="space-y-3 flex-1">
                                    <div className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">
                                        {msg.sender === 'user' ? 'You' : 'SokoAI Agent'}
                                    </div>

                                    <div className="text-sm md:text-base leading-relaxed font-normal text-slate-200">
                                        <p>{msg.text}</p>
                                    </div>

                                    {/* Real Vertical Marketplace Card Grid Structure Block */}
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                                            {msg.products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => setSelectedProduct(product)}
                                                    className="bg-[#1e293b] rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700/80 transition-all duration-200 group flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
                                                >
                                                    {/* Image Window Wrap with Aspect Lock */}
                                                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden border-b border-slate-800">
                                                        <img
                                                            src={product.image}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                                                        />
                                                        {/* Native Channel Affiliate Flag Tag */}
                                                        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md tracking-wide ${getMerchantStyles(product.merchant)}`}>
                                                            {product.merchant}
                                                        </span>
                                                    </div>

                                                    {/* Data Matrix */}
                                                    <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                                                        <div className="space-y-1">
                                                            <h4 className="font-bold text-xs line-clamp-2 leading-snug text-slate-100 group-hover:text-emerald-400 transition">{product.title}</h4>
                                                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                                                <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                                                                <span className="truncate">{product.location}</span>
                                                            </div>
                                                        </div>

                                                        <div className="pt-1 flex items-end justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black text-white font-mono tracking-tight">{product.price}</span>
                                                                {product.originalPrice && (
                                                                    <span className="text-[10px] text-slate-500 line-through font-mono font-medium">{product.originalPrice}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-0.5 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800 text-amber-400 font-bold text-[11px]">
                                                                <Star className="h-3 w-3 fill-amber-400 shrink-0" />
                                                                <span>{product.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Interactive Card Action Overlay Preview */}
                                                    <div className="p-3 pt-0 text-center text-[10px] font-semibold text-emerald-400 group-hover:underline pb-3">
                                                        Click to view dynamic details
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM FIXED CHAT CONTAINER */}
                <div className="bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent pt-2 pb-2 shrink-0 z-10">
                    <div className="max-w-2xl mx-auto px-4 w-full">
                        <form
                            onSubmit={handleSend}
                            className="bg-[#1e293b] border border-slate-800 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 rounded-2xl p-3 pl-4 flex items-center gap-3 transition shadow-xl"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask SokoAI... e.g., 'Find running shoes on Kilimall'"
                                className="flex-1 bg-transparent border-none text-sm font-normal text-slate-100 placeholder-slate-500 focus:outline-hidden"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="h-8 w-8 rounded-xl bg-emerald-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 flex items-center justify-center transition shrink-0 font-bold"
                            >
                                <ArrowUp className="h-4 w-4 stroke-[3]" />
                            </button>
                        </form>

                    </div>
                </div>

            </div>

            {/* PRODUCT DETAILS DRAWER MODAL OVERLAY */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col relative max-h-[90vh]">

                        {/* Close Top Action Anchor */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-3 right-3 p-2 bg-slate-950/40 hover:bg-slate-950/80 text-slate-400 hover:text-white rounded-xl transition z-10 border border-slate-800/40"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Immersive Image Frame */}
                        <div className="relative w-full h-56 bg-slate-950 overflow-hidden shrink-0">
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
                                <h3 className="text-base font-bold text-white leading-snug">{selectedProduct.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                                        <span>{selectedProduct.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded text-amber-400 font-bold">
                                        <Star className="h-3 w-3 fill-amber-400 shrink-0" />
                                        <span>{selectedProduct.rating} Rating</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Cost Breakdowns */}
                            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-slate-500 block font-medium">Aggregated Price</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-black font-mono text-emerald-400">{selectedProduct.price}</span>
                                        {selectedProduct.originalPrice && (
                                            <span className="text-xs text-slate-500 line-through font-mono">{selectedProduct.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 block font-medium">Availability</span>
                                    <span className={`text-xs font-bold flex items-center gap-1 ${selectedProduct.inStock !== false ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        <CheckCircle className="h-3 w-3" />
                                        {selectedProduct.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Dynamic Scraper Description Info */}
                            <div className="space-y-1.5">
                                <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">Listing Context</span>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    {selectedProduct.description || "No supplemental item descriptions extracted from the vendor page during this search indexing pass."}
                                </p>
                            </div>
                        </div>

                        {/* Split Action Drawer CTAs Footer */}
                        <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-2 gap-3 shrink-0">
                            <a
                                href="#"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700"
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
                                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 text-xs font-black py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
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