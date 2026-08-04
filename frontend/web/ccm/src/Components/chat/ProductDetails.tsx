import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  MapPin,
  Store,
  ArrowUp,
  Sparkles,
  Star,
  Share2,
  Check,
  ShieldCheck,
  Truck,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

export interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
    rating?: number | string;
    shop?: string;
    distance?: string;
    description?: string;
    [key: string]: any;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToBasket: (product: any) => void;
}

export function ProductDetails({
  product,
  isOpen,
  onClose,
  onAddToBasket,
}: ProductDetailsProps) {
  const [visible, setVisible] = useState(false);
  const [activeProduct, setActiveProduct] = useState(product);

  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAiSectionOpen, setIsAiSectionOpen] = useState(false);

  // Local Q&A history
  const [qaHistory, setQaHistory] = useState<
    Array<{ id: string; sender: 'user' | 'ai'; text: string }>
  >([]);
  const qaEndRef = useRef<HTMLDivElement>(null);

  // Smooth entrance / exit orchestration
  useEffect(() => {
    if (isOpen && product) {
      setActiveProduct(product);
      // Small tick delay to trigger transition classes after mount
      const timer = setTimeout(() => setVisible(true), 10);
      
      setQuantity(1);
      setInputValue('');
      setIsTyping(false);
      setCopied(false);
      setActiveImageIndex(0);
      setQaHistory([
        {
          id: 'welcome-qa',
          sender: 'ai',
          text: `Ask anything about ${product.name} from ${
            product.shop || 'this vendor'
          }. I can verify freshness, portion size, or delivery times.`,
        },
      ]);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        setActiveProduct(null);
      }, 300); // Matches transition duration
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  // Smooth-scroll mini Q&A feed
  useEffect(() => {
    if (isAiSectionOpen) {
      qaEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [qaHistory, isTyping, isAiSectionOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen && !visible) return null;
  if (!activeProduct) return null;

  const currentProd = activeProduct;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToBasketWithQty = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToBasket(currentProd);
    }
    onClose();
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
  };

  const handleCopyShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${currentProd.name} - KES ${currentProd.price.toLocaleString()} from ${
          currentProd.shop || 'Soko'
        }`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mock AI Response Generator
  const generateMockResponse = (userInput: string) => {
    const query = userInput.toLowerCase();
    const prodName = currentProd.name;
    const shopName = currentProd.shop || 'the merchant';

    if (
      query.includes('fresh') ||
      query.includes('leo') ||
      query.includes('mbichi')
    ) {
      return `Restocked early this morning. ${shopName} keeps their ${prodName} shaded to maintain peak quality. Verified fresh.`;
    }
    if (
      query.includes('size') ||
      query.includes('kiwango') ||
      query.includes('portion') ||
      query.includes('weight')
    ) {
      return `Standard portion size suitable for 3–4 meals. Adjust quantity below for larger orders.`;
    }
    if (
      query.includes('price') ||
      query.includes('bei') ||
      query.includes('cost')
    ) {
      return `Priced at KES ${currentProd.price.toLocaleString()} directly set by ${shopName} with no hidden fees.`;
    }
    if (
      query.includes('deliver') ||
      query.includes('fast') ||
      query.includes('time')
    ) {
      return `Estimated dispatch time is ${
        currentProd.distance || '15 minutes'
      } via direct runner courier.`;
    }
    return `Verified: ${prodName} from ${shopName} meets standard merchant quality checks. Ready to add to your order.`;
  };

  const handleSendQuestion = (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: questionText,
    };
    setQaHistory((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: 'ai' as const,
        text: generateMockResponse(questionText),
      };
      setIsTyping(false);
      setQaHistory((prev) => [...prev, aiReply]);
    }, 700);
  };

  const suggestedFollowUps = [
    { label: 'Fresh today?', query: 'Is this product fresh today?' },
    { label: 'Portion size?', query: 'What size or portion is this package?' },
    { label: 'Delivery speed?', query: 'How fast will this get to my location?' },
  ];

  const galleryThumbnails = [
    currentProd.image ||
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>

      {/* Full Page View Container */}
      <div
        className={`fixed inset-0 z-50 flex flex-col w-full h-full bg-white text-slate-800 font-sans overflow-hidden transition-all duration-300 ease-out transform ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-98 pointer-events-none'
        }`}
      >
        {/* Top Sticky Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {currentProd.shop || 'Verified Neighborhood Vendor'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyShare}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Share item link"
            >
              {copied ? (
                <Check size={18} className="text-emerald-600" />
              ) : (
                <Share2 size={18} />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Gallery & Thumbnails */}
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 items-start">
              {/* Thumbnails */}
              <div className="flex sm:flex-col gap-3 w-full sm:w-20 shrink-0 overflow-x-auto sm:overflow-visible">
                {galleryThumbnails.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square w-16 sm:w-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#3C3147] shadow-xs'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${currentProd.name} thumb ${idx}`}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image Container */}
              <div className="relative w-full aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                <span className="absolute top-4 left-4 z-10 rounded-full border border-slate-200/80 bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-2xs">
                  {currentProd.category || 'Best Seller'}
                </span>

                <img
                  src={galleryThumbnails[activeImageIndex]}
                  alt={currentProd.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Product Details & Controls */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {currentProd.shop || 'LOCAL MARKET SUPPLIER'}
                </p>

                <h1 className="font-serif text-2xl md:text-3xl font-medium text-slate-900 tracking-tight leading-tight">
                  {currentProd.name}
                </h1>

                {/* Rating & Distance */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-slate-700 ml-1">
                      {currentProd.rating || '4.9'}
                    </span>
                    <span className="text-slate-400">(24 reviews)</span>
                  </div>

                  <span className="text-slate-200">•</span>

                  <div className="flex items-center gap-1 font-medium text-slate-600">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{currentProd.distance || '15 mins delivery'}</span>
                  </div>
                </div>

                {/* Price Banner */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl md:text-3xl font-bold text-slate-900">
                    KES {Number(currentProd.price).toLocaleString()}
                  </span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 text-[11px] font-bold">
                    Verified Price
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-slate-600 pt-1">
                  {currentProd.description ||
                    'Freshly sourced, high-quality stock supplied directly by neighborhood merchants. Carefully checked for quality, portion standard, and immediate dispatch readiness.'}
                </p>

                {/* Merchant Info Card */}
                <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60 text-slate-700 shadow-2xs">
                      <Store size={15} />
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                        Supplied By
                      </span>
                      <span className="font-bold text-slate-800">
                        {currentProd.shop || 'Neighborhood Store'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      Dispatch Time
                    </span>
                    <span className="font-bold text-slate-800">
                      {currentProd.distance || '15–20 Mins'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity & CTA */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-between border border-slate-300 rounded-full px-3 py-2 bg-white w-28 shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className="text-slate-500 hover:text-slate-900 transition-colors p-0.5"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="text-slate-500 hover:text-slate-900 transition-colors p-0.5"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToBasketWithQty}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#3C3147] hover:bg-[#2C2434] text-white px-6 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-[0.99]"
                  >
                    <ShoppingCart size={15} />
                    <span>
                      Add KES {(currentProd.price * quantity).toLocaleString()}
                    </span>
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-4 gap-1 py-3 border-y border-slate-100 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck size={18} className="text-slate-700" strokeWidth={1.5} />
                    <span className="text-[10px] font-medium text-slate-600 leading-tight">
                      Quality Checked
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Store size={18} className="text-slate-700" strokeWidth={1.5} />
                    <span className="text-[10px] font-medium text-slate-600 leading-tight">
                      Local Merchant
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck size={18} className="text-slate-700" strokeWidth={1.5} />
                    <span className="text-[10px] font-medium text-slate-600 leading-tight">
                      Fast Courier
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Award size={18} className="text-slate-700" strokeWidth={1.5} />
                    <span className="text-[10px] font-medium text-slate-600 leading-tight">
                      Direct Pricing
                    </span>
                  </div>
                </div>

                {/* Expandable Soko AI Assistant */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 transition-all">
                  <button
                    type="button"
                    onClick={() => setIsAiSectionOpen(!isAiSectionOpen)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-[#3C3147]" />
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#3C3147] transition-colors">
                        AI Product Verification & Q&A
                      </span>
                    </div>
                    {isAiSectionOpen ? (
                      <ChevronUp size={15} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={15} className="text-slate-400" />
                    )}
                  </button>

                  {isAiSectionOpen && (
                    <div className="pt-3 space-y-3 animate-fade-in">
                      {/* Mini Feed */}
                      <div className="space-y-2 rounded-xl bg-white border border-slate-200/80 p-3 max-h-44 overflow-y-auto text-xs custom-scrollbar">
                        {qaHistory.map((qa) => (
                          <div
                            key={qa.id}
                            className={`flex flex-col ${
                              qa.sender === 'user' ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div
                              className={`max-w-[90%] rounded-xl px-3 py-1.5 leading-relaxed text-[11px] ${
                                qa.sender === 'user'
                                  ? 'bg-[#3C3147] text-white font-medium'
                                  : 'bg-slate-50 text-slate-700 border border-slate-200/70 shadow-2xs'
                              }`}
                            >
                              {qa.text}
                            </div>
                          </div>
                        ))}

                        {isTyping && (
                          <div className="flex items-center gap-1.5 py-1 text-slate-400 text-[10px]">
                            <Sparkles size={11} className="animate-spin text-[#3C3147]" />
                            <span>Checking merchant data...</span>
                          </div>
                        )}
                        <div ref={qaEndRef} />
                      </div>

                      {/* Quick Prompt Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {suggestedFollowUps.map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={isTyping}
                            onClick={() => handleSendQuestion(chip.query)}
                            className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:border-[#3C3147] hover:text-[#3C3147] transition-all disabled:opacity-50"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>

                      {/* Input Box */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendQuestion(inputValue);
                        }}
                        className="relative flex items-center"
                      >
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          disabled={isTyping}
                          placeholder="Ask about freshness, weight, or delivery..."
                          className="w-full rounded-full border border-slate-200 bg-white py-1.5 pl-3.5 pr-9 text-xs text-slate-800 placeholder-slate-400 focus:border-[#3C3147] focus:outline-none disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim() || isTyping}
                          className={`absolute right-1 flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                            inputValue.trim()
                              ? 'bg-[#3C3147] text-white hover:bg-[#2C2434]'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <ArrowUp size={13} strokeWidth={2.5} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
