import React, { useState, useMemo } from 'react';
import {
  Star,
  ShieldCheck,
  Plus,
  Check,
  Sparkles,
  Search,
  Send,
  MapPin,
  Clock,
  ArrowLeft,
} from 'lucide-react';

// --- Interfaces ---
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
  description?: string;
}

export interface ExtendedShop {
  id: string;
  name: string;
  image: string;
  rating: number;
  subcounty: string;
  county: string;
  deliveryTime: string;
  products: Product[];
}

interface MerchantShopPageProps {
  shop: ExtendedShop | null;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export const FloatingMerchantShop: React.FC<MerchantShopPageProps> = ({
  shop,
  onBack,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'chat'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'merchant'; text: string }[]
  >([
    {
      sender: 'merchant',
      text: 'Hello! Let us know if you need help finding specs, comparing models, or checking same-day delivery slots in your area.',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [addedIds, setAddedIds] = useState<string[]>([]);

  // Dynamically extract unique categories
  const categories = useMemo(() => {
    if (!shop) return ['All'];
    const unique = Array.from(
      new Set(shop.products.map((p) => p.category))
    );
    return ['All', ...unique];
  }, [shop]);

  // Filter listings by category and search term
  const filteredProducts = useMemo(() => {
    if (!shop) return [];
    return shop.products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [shop, selectedCategory, searchQuery]);

  if (!shop) return null;

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: inputMessage },
    ]);
    setInputMessage('');

    // Simulated merchant AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'merchant',
          text: 'We have received your inquiry. An agent is checking current stock levels and will respond shortly.',
        },
      ]);
    }, 1000);
  };

  const handleBuy = (product: Product) => {
    onAddToCart(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-neutral-100 flex flex-col">
      {/* Hero Header Section */}
      <section className="relative w-full border-b border-white/[0.08] bg-neutral-900">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={shop.image}
            alt={shop.name}
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/70 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {/* Top Bar / Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs font-medium text-neutral-300 backdrop-blur-md transition-all hover:border-white/[0.2] hover:bg-black/60 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400">
                <ShieldCheck size={14} />
                <span>Verified Partner Merchant</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {shop.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-neutral-500" />
                  {shop.subcounty}, {shop.county}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-neutral-500" />
                  Delivery: {shop.deliveryTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-end">
              <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-black/60 px-3.5 py-2 text-sm font-mono text-neutral-200 backdrop-blur-md">
                <Star size={15} className="fill-emerald-500 text-emerald-500" />
                <span className="font-semibold">{shop.rating}</span>
                <span className="text-neutral-500">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Tab Switcher */}
      <div className="flex border-b border-white/[0.08] bg-[#09090b] lg:hidden">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex-1 py-3 text-xs font-medium transition-all border-b-2 ${
            activeTab === 'listings'
              ? 'border-emerald-500 text-white bg-white/[0.02]'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Listings ({shop.products.length})
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-xs font-medium transition-all border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'chat'
              ? 'border-emerald-500 text-white bg-white/[0.02]'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Sparkles size={14} className="text-emerald-400" />
          <span>Ask Merchant AI</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl w-full flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Storefront & Inventory */}
          <div
            className={`lg:col-span-8 space-y-6 ${
              activeTab !== 'listings' ? 'hidden lg:block' : ''
            }`}
          >
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === category
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'border border-white/[0.08] bg-white/[0.03] text-neutral-400 hover:border-white/[0.16] hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <div className="relative min-w-[220px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />
                <input
                  type="text"
                  placeholder="Search store inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-4 text-xs text-neutral-200 placeholder:text-neutral-500 focus:border-white/[0.2] focus:outline-none"
                />
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.01] p-12 text-center">
                <p className="text-sm text-neutral-400">
                  No items match your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-3 text-xs text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const isAdded = addedIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:border-white/[0.16] hover:bg-white/[0.04]"
                    >
                      <div>
                        {/* Image Showcase */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-800">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                              <span className="rounded-md border border-white/[0.1] bg-black/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="mt-4 space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                            {product.category}
                          </span>
                          <h4 className="text-sm font-medium text-neutral-100 line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-sm font-mono font-semibold text-emerald-400 pt-0.5">
                            KES {product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        disabled={!product.inStock}
                        onClick={() => handleBuy(product)}
                        className={`mt-4 w-full flex items-center justify-center h-10 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          !product.inStock
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-white/[0.04]'
                            : isAdded
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08]'
                        }`}
                      >
                        {!product.inStock ? (
                          'Sold Out'
                        ) : isAdded ? (
                          <span className="flex items-center gap-1.5">
                            <Check size={14} /> Added to Cart
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Plus size={14} /> Add to Cart
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Merchant AI Assistant */}
          <div
            className={`lg:col-span-4 ${
              activeTab !== 'chat' ? 'hidden lg:block' : ''
            }`}
          >
            <div className="sticky top-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden flex flex-col h-[580px]">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">
                      Merchant AI Assistant
                    </h3>
                    <p className="text-[10px] font-mono text-emerald-400">
                      Online • Instant answers
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded-br-none'
                          : 'bg-white/[0.05] text-neutral-300 border border-white/[0.08] rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-white/[0.08] bg-black/40 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about stock, specs, or shipping..."
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:border-white/[0.2] focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] text-neutral-200 transition-colors hover:bg-white/[0.15] shrink-0 border border-white/[0.08] cursor-pointer"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
