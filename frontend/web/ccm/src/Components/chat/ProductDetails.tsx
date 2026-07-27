import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Minus, ShoppingCart, MapPin, Store, Clock, 
  ShieldCheck, Send, Sparkles, MessageSquareText, Star 
} from 'lucide-react';

export function ProductDetails({ 
  product, 
  isOpen, 
  onClose, 
  onAddToBasket 
}) {
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Local Q&A history initialized with a contextual welcome message
  const [qaHistory, setQaHistory] = useState([]);
  const qaEndRef = useRef(null);

  // Initialize and reset local states when drawer opens/changes products
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setInputValue('');
      setIsTyping(false);
      setQaHistory([
        {
          id: 'welcome-qa',
          sender: 'ai',
          text: `Ask me anything about these fresh ${product.name} from ${product.shop || 'our vendor'}! I can verify availability, size, or harvest details.`
        }
      ]);
      // Prevent background scrolling when sider is active
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, product]);

  // Smooth-scroll the mini Q&A feed to the bottom when history changes
  useEffect(() => {
    qaEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qaHistory, isTyping]);

  // Handle Escape key to close details slider
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToBasketWithQty = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToBasket(product);
    }
    onClose();
  };

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
  };

  // Context-aware AI Mock Response Generator
  const generateMockResponse = (userInput) => {
    const query = userInput.toLowerCase();
    const prodName = product.name;
    const shopName = product.shop || "kiosk ya mtaa";

    if (query.includes('fresh') || query.includes('leo') || query.includes('mbichi')) {
      return `Zimefika asubuhi ya leo direct kutoka soko kuu! ${shopName} keeps their ${prodName} covered in cool shade to stay crisp. Certified fresh! 🥬`;
    }
    if (query.includes('size') || query.includes('kiwango') || query.includes('kubwa') || query.includes('weight')) {
      return `Standard size ya hii portion ni ya kutosha mboga ya familia ya watu watatu hadi wanne. Kama unataka bulk orders, unaweza kuongeza quantity hapa chini.`;
    }
    if (query.includes('bei') || query.includes('discount') || query.includes('price')) {
      return `Hii price ya KES ${product.price} ndio ya chini kabisa mtaani kwa sasa kwa ajili ya deal tulizopata na ${shopName}. Hakuna hidden charges!`;
    }
    if (query.includes('deliver') || query.includes('fika') || query.includes('time')) {
      return `Tutaipea runner wetu mwenye baiskeli/pikipiki, atakuwa kwako hapo ${product.distance || 'within 15 minutes'}. Atakuletea ikiwa fresh sana!`;
    }
    return `Soko AI Assistant: Confirming that ${prodName} from ${shopName} matches our strict quality standard. Let me know if you want me to add it directly to your cart!`;
  };

  const handleSendQuestion = (questionText) => {
    if (!questionText.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: questionText
    };
    setQaHistory(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: generateMockResponse(questionText)
      };
      setIsTyping(false);
      setQaHistory(prev => [...prev, aiReply]);
    }, 900);
  };

  const suggestedFollowUps = [
    { label: "Is it fresh today?", query: "Is this product fresh today?" },
    { label: "What portion size is this?", query: "What size or portion is this package?" },
    { label: "How fast is delivery?", query: "How fast will this get to my location?" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end overflow-hidden font-sans">
      
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-over Sider Container */}
      <div className="relative w-full md:w-[540px] max-h-[92vh] md:max-h-screen bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800/80 text-slate-100 flex flex-col overflow-hidden z-10 transition-all duration-300 ease-out animate-in slide-in-from-bottom-10 md:slide-in-from-right rounded-t-2xl md:rounded-t-none shadow-2xl">
        
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mt-3 mb-1 md:hidden shrink-0" />

        {/* Floating Header Actions */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <span className="text-[10px] bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
              {product.category || "Fresh Produce"}
            </span>
          </div>
          
          <button 
            onClick={onClose}
            className="pointer-events-auto p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full border border-slate-700/80 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            title="Close panel"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Frame Content */}
        <div className="overflow-y-auto flex-1 pb-28 subtle-scrollbar">
          
          {/* Hero Banner Image */}
          <div className="relative w-full h-64 md:h-72 bg-slate-900 shrink-0">
            <img 
              src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"} 
              alt={product.name} 
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            <div className="absolute bottom-3 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-amber-400 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md">
              <Star size={12} className="fill-amber-400" />
              <span>{product.rating || "4.8"}</span>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="px-6 pt-2 space-y-6">
            
            {/* Title & Price Section */}
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{product.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-400">KES {Number(product.price).toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-medium">/ unit</span>
              </div>
            </div>

            {/* Vendor & Location Metrics */}
            <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700/60 text-emerald-400 shrink-0">
                  <Store size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Merchant</span>
                  <span className="font-semibold text-slate-200 truncate block">{product.shop || "Verified Merchant"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700/60 text-emerald-400 shrink-0">
                  <MapPin size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Distance</span>
                  <span className="font-semibold text-slate-200 truncate block">{product.distance || "Nearby Local Shop"}</span>
                </div>
              </div>
            </div>

            {/* Product Overview */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product Overview</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
                {product.description || "Freshly sourced high-quality item directly retrieved from our partner catalog in your local neighborhood. Inspected for premium quality."}
              </p>
            </div>

            {/* Delivery Status Tag */}
            <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-xs text-slate-300">
              <Clock size={14} className="text-emerald-400 shrink-0" />
              <span>Direct dispatch: estimated delivery <strong className="text-white font-semibold">within 15 mins</strong>.</span>
            </div>

            {/* Quality Guarantee Shield */}
            <div className="flex items-center gap-3 bg-emerald-950/30 border border-emerald-500/20 p-3.5 rounded-xl text-xs text-emerald-300">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <span className="font-medium">Backed by Soko Freshness & Quality Assurance.</span>
            </div>

            {/* AI Assistant Chat Section */}
            <div className="border-t border-slate-800/80 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <MessageSquareText size={14} className="text-emerald-400" />
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Item AI Assistant
                  </h4>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Chat
                </span>
              </div>

              {/* Chat Feed */}
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-3 max-h-52 overflow-y-auto shadow-inner">
                {qaHistory.map((qa) => (
                  <div 
                    key={qa.id} 
                    className={`flex gap-2 max-w-[88%] ${qa.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
                  >
                    {qa.sender === 'ai' && (
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={12} />
                      </div>
                    )}
                    <div 
                      className={`rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                        qa.sender === 'user' 
                          ? 'bg-emerald-600 text-white font-medium rounded-tr-none' 
                          : 'bg-slate-800 border border-slate-700/70 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {qa.text}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2 items-center text-[11px] text-slate-400 font-medium animate-pulse">
                    <Sparkles size={12} className="text-emerald-400 shrink-0" />
                    <span>Checking product details...</span>
                  </div>
                )}
                <div ref={qaEndRef} />
              </div>

              {/* Follow-up Chips */}
              <div className="flex flex-wrap gap-1.5">
                {suggestedFollowUps.map((chip, idx) => (
                  <button
                    key={idx}
                    disabled={isTyping}
                    onClick={() => handleSendQuestion(chip.query)}
                    className="text-[11px] font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:text-white transition-all px-2.5 py-1 rounded-lg cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuestion(inputValue);
                }}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 focus-within:border-emerald-500/50 transition-all"
              >
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                  placeholder="Ask about portion, quality, origin..."
                  className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:bg-slate-800 disabled:text-slate-600 font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="absolute bottom-0 inset-x-0 bg-slate-950/95 border-t border-slate-800/80 p-4 flex items-center justify-between gap-3 z-20 backdrop-blur-md">
          
          {/* Quantity Controls */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-1 rounded-xl shrink-0">
            <button 
              onClick={handleDecrement}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white active:scale-90 transition-all cursor-pointer"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="text-xs font-bold text-white px-2.5 w-7 text-center">{quantity}</span>
            <button 
              onClick={handleIncrement}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white active:scale-90 transition-all cursor-pointer"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          {/* Add to Basket Action Trigger */}
          <button 
            onClick={handleAddToBasketWithQty}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] transition-all text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer tracking-wide"
          >
            <ShoppingCart size={14} strokeWidth={2.5} />
            <span>Add to Basket • KES {(product.price * quantity).toLocaleString()}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
