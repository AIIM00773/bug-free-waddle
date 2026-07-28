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
  Compass
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

  // Local Q&A history
  const [qaHistory, setQaHistory] = useState<
    Array<{ id: string; sender: 'user' | 'ai'; text: string }>
  >([]);
  const qaEndRef = useRef<HTMLDivElement>(null);

  // Reset local state when drawer opens or product changes
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setInputValue('');
      setIsTyping(false);
      setCopied(false);
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
      } via direct courier.`;
    }
    return `Verified: ${prodName} from ${shopName} meets default quality checks. Ready to add to your order.`;
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
    { label: 'Is it fresh today?', query: 'Is this product fresh today?' },
    {
      label: 'What portion size is this?',
      query: 'What size or portion is this package?',
    },
    {
      label: 'How fast is delivery?',
      query: 'How fast will this get to my location?',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end font-sans md:items-stretch md:justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Perplexity-style Drawer Container */}
      <div className="relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl border-t border-[#2e3030] bg-[#191a1a] text-gray-100 shadow-2xl transition-all duration-300 md:max-h-screen md:w-[480px] md:rounded-t-none md:border-l md:border-t-0">
        
        {/* Mobile Drag Indicator */}
        <div className="mx-auto my-2.5 h-1 w-10 shrink-0 rounded-full bg-[#2e3030] md:hidden" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#2e3030] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-400">
              {product.category || 'Product Details'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyShare}
              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-[#252727] hover:text-white"
              title="Copy share link"
            >
              {copied ? (
                <Check size={15} className="text-teal-400" />
              ) : (
                <Share2 size={15} />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 rounded-full border border-[#2e3030] bg-[#202222] p-1.5 text-gray-400 transition-colors hover:border-[#3e4040] hover:text-white"
              title="Close panel (Esc)"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-32 pt-4">
          
          {/* Main Showcase Grid */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-[#2e3030] bg-[#141515]">
              <img
                src={
                  product.image ||
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
                }
                alt={product.name}
                onError={handleImageError}
                className="h-56 w-full object-cover"
              />
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-gray-800 bg-black/75 px-2.5 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md">
                <Star size={11} className="fill-amber-400" />
                <span>{product.rating || '4.8'}</span>
              </div>
            </div>

            {/* Title & Price Header */}
            <div>
              <h2 className="font-serif text-2xl font-normal text-white tracking-tight">
                {product.name}
              </h2>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-teal-400">KES</span>
                <span className="text-2xl font-bold tracking-tight text-white">
                  {Number(product.price).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Merchant & Distance info pill bar */}
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#2e3030] bg-[#202222] p-3 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Store size={14} className="shrink-0 text-gray-400" />
                <div className="truncate">
                  <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-medium">Merchant</span>
                  <span className="truncate font-medium text-gray-200">{product.shop || 'Verified Vendor'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={14} className="shrink-0 text-gray-400" />
                <div className="truncate">
                  <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-medium">Est. Delivery</span>
                  <span className="truncate font-medium text-gray-200">{product.distance || '15 mins away'}</span>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Overview
              </span>
              <p className="text-xs leading-relaxed text-gray-300">
                {product.description ||
                  'Freshly sourced high-quality item directly retrieved from partner catalog. Checked for standard grade quality.'}
              </p>
            </div>

            {/* Perplexity AI Assistant Inline Section */}
            <div className="border-t border-[#2e3030] pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-teal-400" />
                  <span className="font-medium text-gray-300">Item Focus Q&A</span>
                </div>
              </div>

              {/* Chat Log Feed */}
              <div className="space-y-2 rounded-2xl border border-[#2e3030] bg-[#141515] p-3 text-xs">
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
                          ? 'bg-[#252727] text-white'
                          : 'bg-transparent text-gray-300 border-l-2 border-teal-400 pl-3.5 py-1'
                      }`}
                    >
                      {qa.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 py-1 text-gray-500 text-[11px]">
                    <Sparkles size={11} className="animate-spin text-teal-400" />
                    <span>Searching details...</span>
                  </div>
                )}
                <div ref={qaEndRef} />
              </div>

              {/* Follow-up Chips */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Compass size={11} />
                  <span>Suggested queries</span>
                </div>
                <div className="flex flex-col gap-1">
                  {suggestedFollowUps.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isTyping}
                      onClick={() => handleSendQuestion(chip.query)}
                      className="group flex items-center justify-between rounded-xl border border-[#2e3030] bg-[#202222] px-3 py-1.5 text-left text-xs font-medium text-gray-300 transition-all hover:border-teal-500/30 hover:text-teal-400 disabled:opacity-50"
                    >
                      <span>{chip.label}</span>
                      <Plus size={12} className="text-gray-500 transition-transform group-hover:rotate-90 group-hover:text-teal-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Perplexity Styled Input Field */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuestion(inputValue);
                }}
                className="relative mt-2 flex items-center"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                  placeholder="Ask a follow-up..."
                  className="w-full rounded-2xl border border-[#2e3030] bg-[#202222] py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-gray-500 focus:border-[#3e4040] focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className={`absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                    inputValue.trim()
                      ? 'bg-teal-400 text-black hover:bg-teal-300'
                      : 'bg-[#282a2a] text-gray-600'
                  }`}
                >
                  <ArrowUp size={14} strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Floating Bottom Action Bar */}
        <div className="absolute bottom-0 inset-x-0 border-t border-[#2e3030] bg-[#191a1a]/95 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center rounded-xl border border-[#2e3030] bg-[#202222] p-1 shrink-0">
              <button
                type="button"
                onClick={handleDecrement}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-[#282a2a] hover:text-white transition-colors"
              >
                <Minus size={13} strokeWidth={2.5} />
              </button>
              <span className="w-8 text-center text-xs font-bold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-[#282a2a] hover:text-white transition-colors"
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </div>

            {/* Add to Basket Action */}
            <button
              type="button"
              onClick={handleAddToBasketWithQty}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-2.5 text-xs font-bold text-black transition-all hover:bg-teal-300 active:scale-[0.98]"
            >
              <ShoppingCart size={14} strokeWidth={2.5} />
              <span>
                Add to Basket • KES {(product.price * quantity).toLocaleString()}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
