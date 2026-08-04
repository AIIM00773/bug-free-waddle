import React, { useRef, useEffect, useState } from 'react';
import {
  Eye,
  Compass,
  Store,
  MapPin,
  Star,
  Plus,
  Mic,
  ArrowUp,
  ChevronDown,
  ShoppingCart,
  ChevronRight,
  Sparkles,
  Check,
  Paperclip,
  ShieldCheck,
  User,
} from 'lucide-react';

import { SUGGESTIONS } from '../../Constants/fakedb';
import { useSearch } from '../../Providers/SearchContext';
import { SourcesPanel } from './sources';

// ==========================================
// Types & Interfaces
// ==========================================

export type SearchType = string;

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number | string;
  shop?: string;
  distance?: string;
  isDirectMerchant?: boolean;
  readyInMinutes?: number;
  [key: string]: unknown;
}

export interface SuggestionItem {
  label?: string;
  query?: string;
}

export interface MerchantCard {
  name?: string;
  location?: string;
  verified?: boolean;
  category?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  merchantsCount?: number;
  suggestions?: (string | SuggestionItem)[];
  products?: Product[];
}

export interface ChatFeedProps {
  messages?: Message[];
  onAddToBasket?: (product: Product) => void;
  onSendSuggested?: (query: string) => void;
  onViewDetails?: (product: Product) => void;
  onSendMessage?: (text: string) => void;
}

export interface SearchTypesDropdownProps {
  searchTypes?: SearchType[];
  activeSearchType?: SearchType;
  setActiveSearchType?: (type: SearchType) => void;
  onSelectType?: (type: SearchType) => void;
}

const DEFAULT_SEARCH_TYPES: SearchType[] = [
  'All Local Stores',
  'Mama Mboga & Fresh',
  'Butchery & Meats',
  'Neighborhood Services',
  'Express Runner (15m)',
];

// ==========================================
// Sub-Components
// ==========================================

export function SearchTypesDropdown({
  searchTypes = DEFAULT_SEARCH_TYPES,
  activeSearchType = 'All Local Stores',
  setActiveSearchType,
  onSelectType,
}: SearchTypesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type: SearchType) => {
    setActiveSearchType?.(type);
    onSelectType?.(type);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left font-sans">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-95 shadow-xs"
      >
        <Store size={14} className="text-[#3C3147]" />
        <span>{activeSearchType !== 'All Local Stores' ? activeSearchType : 'Focus Store'}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-800' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[200px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl backdrop-blur-xl transition-all duration-150 ease-out">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Neighborhood Focus
          </div>

          <div className="flex flex-col gap-0.5">
            {searchTypes.map((st) => {
              const isSelected = activeSearchType === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSelect(st)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#3C3147] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{st}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onViewDetails,
  onAddToBasket,
}: {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToBasket?: (product: Product) => void;
}) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
  };

  return (
    <div className="group flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-emerald-600 hover:shadow-lg">
      {/* Image & Badges */}
      <div className="relative overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
        <img
          src={
            product.image ||
            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
          }
          alt={product.name || 'Product'}
          onError={handleImageError}
          className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full border border-white/40 bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-800 backdrop-blur-md shadow-xs">
          {product.category || 'Local Goods'}
        </span>
        <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          {product.rating || '4.8'}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <Store size={12} className="shrink-0 text-slate-400" />
          <span className="truncate text-slate-700 font-semibold">
            {product.shop || 'Verified Neighborhood Store'}
          </span>
          {product.distance && (
            <>
              <span className="text-slate-300">•</span>
              <MapPin size={11} className="shrink-0 text-slate-400" />
              <span>{product.distance}</span>
            </>
          )}
        </div>

        <h4 className="line-clamp-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#3C3147]">
          {product.name}
        </h4>

        {/* Price & Direct Merchant Assurance */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">KES</span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              {Number(product.price).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <ShieldCheck size={11} />
            <span>Direct Price</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-1 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onViewDetails?.(product);
          }}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95"
        >
          <Eye size={14} />
          <span>View</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onAddToBasket?.(product);
          }}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#3C3147] px-2.5 py-2 text-xs font-semibold text-white transition-all hover:bg-[#2C2434] active:scale-95 shadow-xs"
        >
          <ShoppingCart size={14} strokeWidth={2.2} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// Conversational Input Component
// ==========================================

interface SokoInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  searchTypes: SearchType[];
  activeSearchType: SearchType;
  setActiveSearchType: (type: SearchType) => void;
}

export function SokoAIInput({
  inputText,
  setInputText,
  handleSend,
  handleKeyDown,
  searchTypes,
  activeSearchType,
  setActiveSearchType,
}: SokoInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height up to a max limit
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  const isInputEmpty = !inputText.trim();

  return (
    <div className="fixed bottom-0 left-0 z-30 w-full bg-gradient-to-t from-white via-white/95 to-transparent pt-6 pb-4 md:pb-6">
      <div className="mx-auto w-full max-w-3xl px-4 md:px-0">
        <div className="group relative rounded-2xl border border-[#3C3147]/20 bg-white/80 p-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-all duration-200 focus-within:border-[#3C3147]/50 focus-within:bg-white focus-within:shadow-[0_8px_30px_rgb(60,49,71,0.08)] focus-within:ring-4 focus-within:ring-[#3C3147]/5">
          {/* Input Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Soko AI for groceries, butcheries, or local services around you..."
            className="max-h-40 min-h-[44px] w-full resize-none bg-transparent px-1 py-1 text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none"
          />

          {/* Controls Bar */}
          <div className="mt-2 flex items-center justify-between border-t border-slate-100/80 pt-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Attach photo or shopping list"
                title="Attach photo or shopping list"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3C3147]/20"
              >
                <Paperclip size={16} />
              </button>

              <SearchTypesDropdown
                searchTypes={searchTypes}
                activeSearchType={activeSearchType}
                setActiveSearchType={setActiveSearchType}
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Voice order"
                title="Voice order"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3C3147]/20"
              >
                <Mic size={16} />
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={isInputEmpty}
                aria-label="Send message"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3C3147]/30 ${
                  !isInputEmpty
                    ? 'bg-[#3C3147] text-white shadow-sm hover:bg-[#2C2434] hover:scale-105 active:scale-95'
                    : 'cursor-not-allowed bg-slate-100 text-slate-300'
                }`}
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Main Chat Feed Component
// ==========================================

export function ChatFeed({
  messages = [],
  onAddToBasket,
  onSendSuggested,
  onViewDetails,
  onSendMessage,
}: ChatFeedProps) {
  const {
    inputText,
    setInputText,
    handleSendMessage: providerSendMessage,
    activeSearchType = 'All Local Stores',
    searchTypes = DEFAULT_SEARCH_TYPES,
    setActiveSearchType = () => {},
  } = useSearch();

  const feedEndRef = useRef<HTMLDivElement>(null);
  const [openSources, setOpenSources] = useState<boolean>(false);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      if (onSendMessage) {
        onSendMessage(inputText.trim());
      } else {
        providerSendMessage(inputText.trim());
      }
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedClick = (query: string) => {
    if (onSendSuggested) {
      onSendSuggested(query);
    } else {
      providerSendMessage(query);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4 pb-44 pt-8 font-sans text-slate-800 sm:px-6">
      {/* Main Container */}
      <div
        className={`grid grid-cols-1 gap-8 transition-all duration-300 ${
          openSources ? 'lg:grid-cols-[1fr_320px]' : 'lg:grid-cols-1'
        }`}
      >
        {/* Messages Column */}
        <div className="w-full space-y-10">
          {messages.map((message) => {
            const isUser = message.sender === 'user';
            const suggestionsList = Array.isArray(message.suggestions)
              ? message.suggestions
              : Array.isArray(SUGGESTIONS)
              ? SUGGESTIONS
              : [];

            if (isUser) {
              return (
                <div key={message.id} className="pt-4">
                  {/* Topic / Search Preview Header */}
                  <h1 className="text-2xl md:text-3xl font-normal text-slate-900 tracking-tight leading-snug mb-4">
                    {message.text.length > 80 ? `${message.text.slice(0, 80)}...` : message.text}
                  </h1>

                  {/* User Search Query */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3C3147]/10 text-[#3C3147]">
                      <User size={14} />
                    </div>

                    <p className="text-sm font-normal text-slate-600 tracking-tight leading-snug">
                      {message.text}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className="space-y-4 border-t border-slate-200/80 pt-6">
                {/* Status & Verified Merchants Header */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3C3147]/10 text-[#3C3147]">
                      <Sparkles size={14} />
                    </div>
                    <span className="font-semibold text-slate-700">{activeSearchType}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenSources((prev) => !prev)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:border-slate-300 hover:text-slate-900 shadow-xs"
                  >
                    <Store size={13} className="text-slate-500" />
                    <span>Verified Merchants</span>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-800 font-mono font-bold">
                      {message.merchantsCount || 3}
                    </span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                {/* Response Text */}
                <div className="prose max-w-none text-sm leading-relaxed text-slate-700">
                  <p className="whitespace-pre-wrap font-sans">{message.text}</p>
                </div>

                {/* Suggested Follow-up Chips */}
                {message.suggestions && suggestionsList.length > 0 && (
                  <div className="space-y-2.5 pt-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <Compass size={13} className="text-[#3C3147]" />
                      <span>Related Neighborhood Searches</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {suggestionsList.map((s, idx) => {
                        const queryText =
                          typeof s === 'string'
                            ? s
                            : s.query || s.label || '';
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSuggestedClick(queryText);
                            }}
                            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-left text-xs font-medium text-slate-700 transition-all hover:border-[#3C3147]/30 hover:bg-white hover:text-[#3C3147] hover:shadow-xs"
                          >
                            <span>{queryText}</span>
                            <Plus size={14} className="text-slate-400 transition-transform group-hover:rotate-90 group-hover:text-[#3C3147]" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Products Grid */}
                {message.products && message.products.length > 0 && (
                  <div
                    className={`grid grid-cols-1 gap-4 pt-4 ${
                      openSources
                        ? 'sm:grid-cols-2'
                        : 'sm:grid-cols-2 lg:grid-cols-3'
                    }`}
                  >
                    {message.products.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onViewDetails={onViewDetails}
                        onAddToBasket={onAddToBasket}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div ref={feedEndRef} />
        </div>

        {/* Verified Neighborhood Vendors Sidebar */}
        <SourcesPanel openSources={openSources} setOpenSources={setOpenSources} />
      </div>

      {/* Floating Soko AI Conversational Input Bar */}
      <SokoAIInput
        inputText={inputText}
        setInputText={setInputText}
        handleSend={handleSend}
        handleKeyDown={handleKeyDown}
        searchTypes={searchTypes}
        activeSearchType={activeSearchType}
        setActiveSearchType={setActiveSearchType}
      />
    </div>
  );
}
