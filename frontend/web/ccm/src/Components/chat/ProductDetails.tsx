import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Minus, ShoppingBag, MapPin, Store, Clock, 
  ShieldCheck, Send, Sparkles, MessageSquareText 
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

  // Initialize and reset local states when modal opens/changes products
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
    }
  }, [isOpen, product]);

  // Smooth-scroll the mini Q&A feed to the bottom when history changes
  useEffect(() => {
    qaEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qaHistory, isTyping]);

  // Handle Escape key to close details modal
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

    // Append user's question
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: questionText
    };
    setQaHistory(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Soko AI engine thinking
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

  // Contextual follow-up suggestions based on product category
  const suggestedFollowUps = [
    { label: "Is it fresh today?", query: "Is this product fresh today?" },
    { label: "What portion size is this?", query: "What size or portion is this package?" },
    { label: "How fast is the delivery?", query: "How fast will this get to my location?" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      
      {/* Premium Dark Backdrop Blur */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Product Card Container */}
      <div 
        className="relative w-full mx-1 max-h-[98vh] md:max-w-xl  md:h-[90vh] bg-stone-900 md:border-t md:border border-stone-850 md:rounded-2xl rounded-t-sm  shadow-2xl flex flex-col overflow-hidden z-10 transition-all duration-300 animate-in slide-in-from-bottom-10"
      >
        
        {/* Mobile Swipe-indicator bar */}
        <div className="w-12 h-1.5 bg-stone-800 rounded-full mx-auto mt-3 mb-1 md:hidden shrink-0" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 md:top-4 z-20 p-2 bg-stone-950/80 hover:bg-stone-900 rounded-full border border-stone-800/80 text-stone-300 hover:text-white transition-all active:scale-90"
          title="Close details"
        >
          <X size={16} />
        </button>

        {/* Scrollable Frame */}
        <div className="overflow-y-auto flex-1 pb-28 md:pb-32">
          
          {/* Hero Banner Image */}
          <div className="relative w-full h-56 md:h-48 bg-stone-950 shrink-0">
            <img 
              src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"} 
              alt={product.name} 
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/10 to-transparent" />
            
            {/* Overlay Category Tag */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {product.category || "Fresh Produce"}
              </span>
              <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/25 font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <Clock size={10} />
                <span>15 mins delivery</span>
              </span>
            </div>
          </div>

          {/* Core Specs Information */}
          <div className="px-5 pt-4 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-stone-50 leading-tight">{product.name}</h3>
              <p className="text-xl font-black text-amber-400 mt-1">KES {product.price}</p>
            </div>

            {/* Micro Metadata Metrics */}
            <div className="grid grid-cols-2 gap-2 bg-stone-950/40 p-3 rounded-xl border border-stone-850/60 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <Store size={14} className="text-stone-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-stone-500 block">Vendor Shop</span>
                  <span className="font-semibold truncate block">{product.shop}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-300">
                <MapPin size={14} className="text-stone-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-stone-500 block">Distance</span>
                  <span className="font-semibold truncate block">{product.distance || "Kiosk nearby"}</span>
                </div>
              </div>
            </div>

            {/* Description Paragraph */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Product Info</h4>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/20 p-3 rounded-lg border border-stone-850/40">
                {product.description || "Freshly sourced high-quality item directly retrieved from our catalog partners in your local neighborhood kiosk. Hand-selected for premium quality."}
              </p>
            </div>

            {/* Quality Check Banner */}
            <div className="flex items-center gap-2.5 bg-emerald-950/10 border border-emerald-900/35 p-2.5 rounded-lg text-[10px] text-emerald-400">
              <ShieldCheck size={16} className="shrink-0" />
              <span>Sourced from verified merchants, covered by our fresh guarantee.</span>
            </div>

            {/* --- PREMIUM AI INTERACTION AREA --- */}
            <div className="border-t border-stone-800/80 pt-4 space-y-3">
              <div className="flex items-center gap-1.5">
                <MessageSquareText size={15} className="text-amber-500" />
                <h4 className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Inquire More (Soko AI Assistant)
                </h4>
              </div>

              {/* Dynamic Scrollable Inline Chat Feed */}
              <div className="bg-stone-950/50 border border-stone-850 p-3 rounded-xl space-y-3 max-h-48 overflow-y-auto">
                {qaHistory.map((qa) => (
                  <div 
                    key={qa.id} 
                    className={`flex gap-2 max-w-[90%] ${qa.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
                  >
                    {qa.sender === 'ai' && (
                      <div className="w-5 h-5 rounded bg-emerald-950/80 border border-emerald-850/50 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={10} />
                      </div>
                    )}
                    <div 
                      className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        qa.sender === 'user' 
                          ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300' 
                          : 'bg-stone-900 text-stone-200'
                      }`}
                    >
                      {qa.text}
                    </div>
                  </div>
                ))}
                
                {/* Simulated AI Typing Loader */}
                {isTyping && (
                  <div className="flex gap-2 items-center text-[10px] text-stone-500 animate-pulse">
                    <Sparkles size={11} className="text-emerald-400 shrink-0" />
                    <span>Soko AI is verifying kiosk stock...</span>
                  </div>
                )}
                <div ref={qaEndRef} />
              </div>

              {/* Quick Prompt Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5">
                {suggestedFollowUps.map((chip, idx) => (
                  <button
                    key={idx}
                    disabled={isTyping}
                    onClick={() => handleSendQuestion(chip.query)}
                    className="text-[10px] text-stone-400 bg-stone-955 border border-stone-800 hover:border-amber-500/40 hover:text-stone-200 hover:bg-stone-950 transition-all px-2.5 py-1.5 rounded-lg cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Inline Questions Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuestion(inputValue);
                }}
                className="flex items-center gap-1.5 bg-stone-950 border border-stone-850 rounded-xl p-1 focus-within:border-amber-500/40 transition-all"
              >
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                  placeholder="Ask if fresh, portion size..."
                  className="flex-1 bg-transparent px-2.5 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2 bg-stone-900 hover:bg-stone-850 hover:text-amber-400 text-stone-400 rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                >
                  <Send size={13} />
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Checkout Bottom Action Bar (Sticky at bottom) */}
        <div className="absolute bottom-0 inset-x-0 bg-stone-900 border-t border-stone-850 p-4 flex items-center justify-between gap-4 z-10 shadow-2xl">
          
          {/* Custom Styled Quantity Controls */}
          <div className="flex items-center justify-between bg-stone-950 border border-stone-850 p-1 rounded-xl shrink-0">
            <button 
              onClick={handleDecrement}
              className="p-1.5 hover:bg-stone-900 rounded-lg text-stone-400 hover:text-white active:scale-95 transition-all cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs font-bold text-stone-100 px-3 w-8 text-center">{quantity}</span>
            <button 
              onClick={handleIncrement}
              className="p-1.5 hover:bg-stone-900 rounded-lg text-stone-400 hover:text-white active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Basket Action */}
          <button 
            onClick={handleAddToBasketWithQty}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all text-stone-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <ShoppingBag size={14} strokeWidth={2.5} />
            <span>Add • KES {product.price * quantity}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
