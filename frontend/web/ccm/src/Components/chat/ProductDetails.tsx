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
  Heart,
  ChevronDown,
  ChevronUp,
  Clock,
  Award
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

  // Reset local state when page opens or product changes
  useEffect(() => {
    if (isOpen && product) {
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
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, product]);

  // Smooth-scroll mini Q&A feed
  useEffect(() => {
    qaEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qaHistory, isTyping]);

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

  if (!isOpen || !product) return null;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToBasketWithQty = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToBasket(product);
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
        `${product.name} - KES ${product.price.toLocaleString()} from ${
          product.shop || 'Soko'
        }`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mock AI Response Generator
  const generateMockResponse = (userInput: string) => {
    const query = userInput.toLowerCase();
    const prodName = product.name;
    const shopName = product.shop || 'the merchant';

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
      return `Priced at KES ${product.price.toLocaleString()} directly set by ${shopName} with no hidden fees.`;
    }
    if (
      query.includes('deliver') ||
      query.includes('fast') ||
      query.includes('time')
    ) {
      return `Estimated dispatch time is ${
        product.distance || '15 minutes'
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

  // Thumbnail fallback list to match the multi-image gallery feel of the design
  const galleryThumbnails = [
    product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-full min-h-screen bg-white text-slate-800 font-sans overflow-y-auto">
      {/* Top Header Bar - Edge to Edge */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 w-full">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {product.shop || 'Verified Neighborhood Vendor'}
          </span>
        </div>

        <div className="flex items-center gap-2">
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
            title="Close window (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content Body - Full Screen Flex Growth */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10 w-full">
        
        {/* LEFT COLUMN: Gallery & Thumbnails (5 cols) */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 items-start">
          {/* Thumbnails Column */}
          <div className="flex sm:flex-col gap-3 w-full sm:w-20 shrink-0 overflow-x-auto sm:overflow-visible">
            {galleryThumbnails.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square w-16 sm:w-20 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-[#3C3147] shadow-sm'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} thumb ${idx}`}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Showcase Image */}
          <div className="relative w-full aspect-square rounded-2xl bg-[#F8FAFC] border border-slate-100 overflow-hidden flex items-center justify-center">
            <span className="absolute top-4 left-4 z-10 rounded-full border border-slate-200 bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm">
              {product.category || 'Best Seller'}
            </span>

            <img
              src={galleryThumbnails[activeImageIndex]}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Product Details & Controls (7 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Category / Shop Subtitle */}
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {product.shop || 'LOCAL MARKET SUPPLIER'}
            </p>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl font-normal text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating & Distance */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <span className="font-medium text-slate-700 ml-1">
                  {product.rating || '4.9'}
                </span>
                <span>(24 reviews)</span>
              </div>

              <span className="text-slate-300">•</span>

              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                <span>{product.distance || '15 mins delivery'}</span>
              </div>
            </div>

            {/* Price & Tag */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl md:text-3xl font-semibold text-slate-900">
                KES {Number(product.price).toLocaleString()}
              </span>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 text-xs font-medium">
                Verified Price
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-slate-600 pt-2">
              {product.description ||
                'Freshly sourced, high-quality stock supplied directly by neighborhood merchants. Carefully checked for quality, portion standard, and immediate dispatch readiness.'}
            </p>

            {/* Merchant Info Card */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border border-slate-200/60 text-slate-700">
                  <Store size={16} />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Supplied By
                  </span>
                  <span className="font-semibold text-slate-800">
                    {product.shop || 'Neighborhood Store'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Dispatch Time
                </span>
                <span className="font-semibold text-slate-800">
                  {product.distance || '15–20 Mins'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Section: Quantity & CTA */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              {/* Quantity Control Pill */}
              <div className="flex items-center justify-between border border-slate-300 rounded-full px-3 py-2 bg-white w-28 shrink-0 shadow-sm">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="text-slate-500 hover:text-slate-900 transition-colors p-1"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-semibold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="text-slate-500 hover:text-slate-900 transition-colors p-1"
                >
                  <Plus size={16} />
                </button>
              </div>


              {/* Main Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToBasketWithQty}
                className="flex-1 max-w-fit  flex items-center justify-center gap-2 rounded-full bg-[#3C3147] hover:bg-[#2C2434] text-white px-6 py-3 text-sm font-medium transition-all shadow-sm active:scale-[0.99]"
              >
                <ShoppingCart size={16} />
                
                <span className="hidden md:block">
                  Add ksh ( {(product.price * quantity).toLocaleString()} )
                </span>


                <span className="inline-block md:hidden">
                  ksh ( {(product.price * quantity).toLocaleString()} )
                </span>

                
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400">
              Direct merchant settlement • Local neighborhood runner fulfillment
            </p>

            {/* 4-Column Trust Indicators Banner */}
            <div className="grid grid-cols-4 gap-2 py-4 border-y border-slate-100 text-center">
              <div className="flex flex-col items-center gap-1.5 px-2">
                <ShieldCheck size={20} className="text-slate-700" strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-slate-600 leading-tight">
                  Quality Checked
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 px-2">
                <Store size={20} className="text-slate-700" strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-slate-600 leading-tight">
                  Local Merchant
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 px-2">
                <Truck size={20} className="text-slate-700" strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-slate-600 leading-tight">
                  Fast Courier
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 px-2">
                <Award size={20} className="text-slate-700" strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-slate-600 leading-tight">
                  Direct Pricing
                </span>
              </div>
            </div>

            {/* Expandable Section: Soko AI Q&A Assistant */}
            <div className="border-b border-slate-100 pb-3 bg-gray-950 p-4 rounded-2xl ">
              <button
                type="button"
                onClick={() => setIsAiSectionOpen(!isAiSectionOpen)}
                className="w-full flex items-center justify-between py-2 text-left group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#3C3147]" />
                  <span className="text-sm font-semibold text-slate-50 group-hover:text-[#3C3147] transition-colors">
                    AI Product Verification & Q&A
                  </span>
                </div>
                {isAiSectionOpen ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
              </button>

              {isAiSectionOpen && (
                <div className="pt-3 space-y-3  ">
                  {/* Chat Feed */}
                  <div className="space-y-2 rounded-2xl bg-slate-50 border border-slate-200/70 p-3.5 max-h-48 overflow-y-auto text-xs">
                    {qaHistory.map((qa) => (
                      <div
                        key={qa.id}
                        className={`flex flex-col ${
                          qa.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[90%] rounded-xl px-3 py-2 leading-relaxed ${
                            qa.sender === 'user'
                              ? 'bg-[#3C3147] text-white'
                              : 'bg-white text-slate-700 border border-slate-200/80 shadow-sm'
                          }`}
                        >
                          {qa.text}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-center gap-1.5 py-1 text-slate-400 text-[11px]">
                        <Sparkles size={12} className="animate-spin text-[#3C3147]" />
                        <span>Verifying with vendor data...</span>
                      </div>
                    )}
                    <div ref={qaEndRef} />
                  </div>

                  {/* Suggested Queries */}
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedFollowUps.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={isTyping}
                        onClick={() => handleSendQuestion(chip.query)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 hover:border-[#3C3147] hover:text-[#3C3147] transition-all disabled:opacity-50"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Input Field */}
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
                      className="w-full rounded-full border border-slate-200 bg-white py-2 pl-4 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:border-[#3C3147] focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      className={`absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                        inputValue.trim()
                          ? 'bg-[#3C3147] text-white hover:bg-[#2C2434]'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <ArrowUp size={14} strokeWidth={2.5} />
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
