import React, { useRef, useEffect, useState } from 'react';
import {
  Eye,
  Compass,
  Store,
  MapPin,
  Star,
  Plus,
  Search,
  Mic,
  ArrowUp,
  ChevronDown,
  ShoppingCart,
  ChevronRight,
  Sparkles,
  Check,
  Globe,
  Paperclip,
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
  [key: string]: any;
}

export interface SuggestionItem {
  label?: string;
  query?: string;
}

export interface LinkCard {
  title?: string;
  domain?: string;
  heading?: string;
  description?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  linkCard?: LinkCard;
  sourcesCount?: number;
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
  'Direct Search',
  'Marketplace',
  'Services',
  'Estates',
];

// ==========================================
// Sub-Components
// ==========================================

export function SearchTypesDropdown({
  searchTypes = DEFAULT_SEARCH_TYPES,
  activeSearchType = 'Direct Search',
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
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full border border-[#2e3030] bg-[#222424] px-3 py-1 text-xs font-medium text-gray-300 transition-all hover:border-[#3e4040] hover:bg-[#282a2a] active:scale-95"
      >
        <Globe className="h-3.5 w-3.5 text-teal-400" />
        <span>{activeSearchType !== 'Direct Search' ? activeSearchType : 'Focus'}</span>
        <ChevronDown
          className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[170px] overflow-hidden rounded-2xl border border-[#2e3030] bg-[#191a1a]/95 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-150 ease-out">
          <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Search Focus
          </div>

          <div className="flex flex-col gap-0.5">
            {searchTypes.map((st) => {
              const isSelected = activeSearchType === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSelect(st)}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-teal-500/10 text-teal-400'
                      : 'text-gray-300 hover:bg-[#222424] hover:text-white'
                  }`}
                >
                  <span>{st}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-teal-400" />}
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
    <div className="group flex flex-col justify-between gap-3 rounded-2xl border border-[#2e3030] bg-[#202222] p-3 transition-all duration-200 hover:border-[#3e4040] hover:bg-[#242626]">
      {/* Image & Badges */}
      <div className="relative overflow-hidden rounded-xl border border-[#2e3030] bg-[#141515]">
        <img
          src={
            product.image ||
            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
          }
          alt={product.name || 'Product'}
          onError={handleImageError}
          className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full border border-teal-500/20 bg-black/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-400 backdrop-blur-md">
          {product.category || 'General'}
        </span>
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-gray-800 bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-amber-400 backdrop-blur-md">
          <Star size={10} className="fill-amber-400" />
          {product.rating || '4.8'}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <Store size={11} className="shrink-0 text-gray-500" />
          <span className="truncate">{product.shop || 'Verified Merchant'}</span>
          {product.distance && (
            <>
              <span className="text-gray-600">•</span>
              <MapPin size={10} className="shrink-0 text-gray-500" />
              <span>{product.distance}</span>
            </>
          )}
        </div>

        <h4 className="line-clamp-1 text-xs font-semibold text-gray-100 transition-colors group-hover:text-teal-400">
          {product.name}
        </h4>

        <div className="flex items-baseline gap-1 pt-0.5">
          <span className="text-[11px] font-bold text-teal-400">KES</span>
          <span className="text-base font-bold tracking-tight text-white">
            {Number(product.price).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-1 grid grid-cols-2 gap-2 border-t border-[#2e3030] pt-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onViewDetails?.(product);
          }}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#2e3030] bg-[#191a1a] px-2 py-1.5 text-[11px] font-medium text-gray-300 transition-all hover:bg-[#282a2a] hover:text-white active:scale-95"
        >
          <Eye size={12} />
          <span>View</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onAddToBasket?.(product);
          }}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-400 px-2 py-1.5 text-[11px] font-bold text-black transition-all hover:bg-teal-300 active:scale-95"
        >
          <ShoppingCart size={12} strokeWidth={2.5} />
          <span>Add</span>
        </button>
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
    activeSearchType = 'Direct Search',
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
    <div className="relative mx-auto w-full max-w-4xl px-4 pb-40 pt-8 font-sans text-slate-100 sm:px-6">
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
                  <h1 className="text-2xl font-serif font-normal text-white tracking-tight sm:text-3xl">
                    {message.text}
                  </h1>
                </div>
              );
            }

            return (
              <div key={message.id} className="space-y-4 border-t border-[#2e3030] pt-6">
                {/* Perplexity Style Status Header */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
                      <Sparkles size={12} />
                    </div>
                    <span className="font-medium text-gray-300">{activeSearchType}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenSources((prev) => !prev)}
                    className="flex items-center gap-1.5 rounded-full border border-[#2e3030] bg-[#202222] px-3 py-1 text-xs font-medium text-gray-400 transition-all hover:border-[#3e4040] hover:text-white"
                  >
                    <span>Sources</span>
                    <span className="rounded-full bg-[#191a1a] px-1.5 py-0.2 text-[10px] text-teal-400 font-mono">
                      {message.sourcesCount || 3}
                    </span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                {/* Response Text */}
                <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-200">
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>

                {/* Suggested Chips / Follow-ups */}
                {message.suggestions && suggestionsList.length > 0 && (
                  <div className="space-y-2 pt-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                      <Compass size={13} className="text-teal-400" />
                      <span>Related follow-ups</span>
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
                            className="group flex items-center justify-between rounded-xl border border-[#2e3030] bg-[#191a1a] px-3 py-2 text-left text-xs font-medium text-gray-300 transition-all hover:border-teal-500/30 hover:bg-[#202222] hover:text-teal-400"
                          >
                            <span>{queryText}</span>
                            <Plus size={13} className="text-gray-500 transition-transform group-hover:rotate-90 group-hover:text-teal-400" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Products Grid */}
                {message.products && message.products.length > 0 && (
                  <div
                    className={`grid grid-cols-1 gap-3.5 pt-4 ${
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

        {/* Knowledge & Sources Sidebar */}
        <SourcesPanel openSources={openSources} setOpenSources={setOpenSources} />
      </div>

      {/* Perplexity Floating Bar */}
 <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-2xl -translate-x-1/2 px-4 pb-4 md:pb-7 md:px-0 bg-[#191a1a]/90 backdrop-blur-md rounded-t-2xl">
        <div className="relative rounded-2xl border border-[#2e3030] bg-[#191a1a]/90 p-3 shadow-2xl backdrop-blur-2xl transition-all focus-within:border-[#3e4040]">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up..."
            className="w-full resize-none bg-transparent px-1 text-sm text-white placeholder-gray-500 focus:outline-none"
          />

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Attach file"
                className="flex items-center justify-center rounded-full p-1.5 text-gray-400 transition-colors hover:bg-[#252727] hover:text-white"
              >
                <Paperclip size={15} />
              </button>

              <SearchTypesDropdown
                searchTypes={searchTypes}
                activeSearchType={activeSearchType}
                setActiveSearchType={setActiveSearchType}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-[#252727] hover:text-white"
              >
                <Mic size={15} />
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                  inputText.trim()
                    ? 'bg-teal-400 text-black hover:bg-teal-300'
                    : 'bg-[#282a2a] text-gray-600'
                }`}
              >
                <ArrowUp size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
