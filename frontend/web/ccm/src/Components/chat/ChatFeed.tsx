import React, { useRef, useEffect, useState } from 'react';
import {
  Eye,
  Compass,
  Store,
  MapPin,
  Star,
  Globe,
  Plus,
  Search,
  Mic,
  ArrowUp,
  ChevronDown,
  ShoppingCart,
  ChevronRight,
  X
} from 'lucide-react';

import { SUGGESTIONS } from '../../Constants/fakedb';
import { useSearch } from '../../Providers/SearchContext';
import { SourcesPanel } from './sources';

// Types
interface Product {
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

interface SuggestionItem {
  label?: string;
  query?: string;
}

interface LinkCard {
  title?: string;
  domain?: string;
  heading?: string;
  description?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  linkCard?: LinkCard;
  sourcesCount?: number;
  suggestions?: (string | SuggestionItem)[];
  products?: Product[];
}

interface ChatFeedProps {
  messages?: Message[];
  onAddToBasket?: (product: Product) => void;
  onSendSuggested?: (query: string) => void;
  onViewDetails?: (product: Product) => void;
  onSendMessage?: (text: string) => void;
}

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
  } = useSearch();

  const feedEndRef = useRef<HTMLDivElement>(null);
  const [openSources, setOpenSources] = useState<boolean>(true);

  // Smooth scroll to the newest message
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
  };

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

  const handleSuggestedClick = (query: string) => {
    if (onSendSuggested) {
      onSendSuggested(query);
    } else {
      providerSendMessage(query);
    }
  };

  return (
    /* FIXED: Changed max-w-6xl to max-w-7xl (or w-full px-6) to use available horizontal space */
    <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-3 pt-6 pb-36 font-sans text-slate-100">
      
      {/* FIXED: Fluid grid that lets the chat area expand while giving the sources panel a comfortable ~320px sidebar */}
      <div className={`grid grid-cols-1 gap-6 transition-all duration-300 ${openSources ? 'lg:grid-cols-[1fr_300px]' : 'lg:grid-cols-1'}`}>
        
        {/* Left Column: Messages Container (Takes up remaining flex space) */}
        <div className="w-full space-y-8">
          {messages.map((message) => {
            const isUser = message.sender === 'user';
            const suggestionsList = Array.isArray(message.suggestions)
              ? message.suggestions
              : Array.isArray(SUGGESTIONS)
              ? SUGGESTIONS
              : [];

            if (isUser) {
              /* --- USER MESSAGE BUBBLE --- */
              return (
                <div key={message.id} className="my-4 flex justify-end">
                  <div className="max-w-md rounded-2xl border border-transparent bg-[#222222] px-5 py-2.5 text-sm font-medium text-gray-100 transition-colors hover:bg-[#282828] sm:max-w-xl">
                    {message.text}
                  </div>
                </div>
              );
            }

            /* --- AI / ASSISTANT RESPONSE --- */
            return (
              <div key={message.id} className="space-y-4">
                {/* Link Preview & Mobile Sources Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Inline Mobile Sources Button */}
                  {message.sourcesCount && (
                    <button
                      type="button"
                      onClick={() => setOpenSources(!openSources)}
                      className="flex items-center gap-1.5 rounded-xl border border-[#2a2a2a] bg-[#1c1c1c] px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-[#252525] lg:hidden"
                    >
                      <span>Sources</span>
                      <span className="text-gray-400">
                        {message.sourcesCount}
                      </span>
                      <ChevronRight size={13} className="text-gray-400" />
                    </button>
                  )}
                </div>

                {/* Web Search Status Indicator */}
                <div className="flex items-center gap-2 py-1 text-xs font-medium text-gray-400">
                  <Globe size={14} className="text-gray-400" />
                  <span>Searching the web</span>
                  <ChevronRight size={12} className="text-gray-500" />
                </div>

                {/* Main AI Text Output */}
                <div className="text-sm leading-relaxed text-gray-200">
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>

                {/* Suggested Follow-up Chips */}
                {message.suggestions && suggestionsList.length > 0 && (
                  <div className="pt-2">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                      <Compass size={13} className="text-teal-400" /> If you want, I can also help with:
                    </div>
                    <div className="flex flex-col gap-1.5 pl-2">
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
                            className="flex items-center gap-2 text-left text-xs text-teal-400 hover:text-teal-300 hover:underline"
                          >
                            <span className="text-gray-500">•</span>
                            <span>{queryText}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Marketplace Products Showcase - Expands seamlessly into 2 or 3 responsive columns */}
                {message.products && message.products.length > 0 && (
                  <div className={`grid grid-cols-1 gap-3.5 pt-3  ${openSources ? 'sm:grid-cols-2 xl:grid-cols-2 ' : 'sm:grid-cols-2 xl:grid-cols-3' } `} >
                    {message.products.map((p) => (
                      <div
                        key={p.id}
                        className="group flex flex-col justify-between gap-3 rounded-xl border border-[#262626] bg-[#181818] p-3 transition-all duration-300 hover:border-[#3a3a3a]"
                      >
                        {/* Image & Badges */}
                        <div className="relative overflow-hidden rounded-lg border border-[#262626] bg-[#111111]">
                          <img
                            src={
                              p.image ||
                              'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
                            }
                            alt={p.name || 'Product'}
                            onError={handleImageError}
                            className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute top-2 left-2 rounded-full border border-teal-500/20 bg-black/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-400 backdrop-blur-md">
                            {p.category || 'General'}
                          </span>
                          <span className="absolute top-2 right-2 flex items-center gap-1 rounded border border-gray-800 bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 backdrop-blur-md">
                            <Star size={10} className="fill-amber-400" />
                            {p.rating || '4.8'}
                          </span>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Store size={11} className="shrink-0 text-gray-500" />
                            <span className="truncate">
                              {p.shop || 'Verified Merchant'}
                            </span>
                            {p.distance && (
                              <>
                                <span className="text-gray-600">•</span>
                                <MapPin size={10} className="shrink-0 text-gray-500" />
                                <span>{p.distance}</span>
                              </>
                            )}
                          </div>

                          <h4 className="line-clamp-1 text-xs font-semibold text-gray-100 transition-colors group-hover:text-teal-400">
                            {p.name}
                          </h4>

                          <div className="flex items-baseline gap-1 pt-1">
                            <span className="text-xs font-bold text-teal-400">
                              KES
                            </span>
                            <span className="text-base font-extrabold tracking-tight text-white">
                              {Number(p.price).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="mt-1 grid grid-cols-2 gap-2 border-t border-[#262626] pt-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              onViewDetails?.(p);
                            }}
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-[#333333] bg-[#222222] px-2 py-1.5 text-[11px] font-medium text-gray-300 transition-all hover:bg-[#2a2a2a] hover:text-white"
                          >
                            <Eye size={12} />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              onAddToBasket?.(p);
                            }}
                            className="flex items-center justify-center gap-1.5 rounded-lg bg-teal-500 px-2 py-1.5 text-[11px] font-bold text-black transition-all hover:bg-teal-400 active:scale-95"
                          >
                            <ShoppingCart size={12} strokeWidth={2.5} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div ref={feedEndRef} />
        </div>

        {/* Right Column: Knowledge / Sources Panel */}
        <SourcesPanel openSources={openSources} setOpenSources={setOpenSources} />
      </div>

      {/* --- FIXED BOTTOM INPUT BAR --- */}
      <div className="fixed bottom-4 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 px-4">
        <div className="space-y-3 rounded-2xl border border-[#2a2a2a] bg-[#1c1c1c] p-3 shadow-2xl transition-all focus-within:border-[#3a3a3a]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a follow-up..."
            className="w-full bg-transparent px-1 text-sm text-white placeholder-gray-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {/* Left Tools */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                aria-label="Add attachment"
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#262626] hover:text-white"
              >
                <Plus size={16} />
              </button>

              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-[#262626] px-2.5 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-[#303030]"
              >
                <Search size={13} />
                <span className="hidden sm:inline">Search Types</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
            </div>

            {/* Right Tools & Send */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-[#262626] hover:text-white"
              >
                <span>Model</span>
                <ChevronDown size={12} />
              </button>

              <button
                type="button"
                aria-label="Voice Input"
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#262626] hover:text-white"
              >
                <Mic size={15} />
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim()}
                aria-label="Send message"
                className={`rounded-full p-1.5 transition-colors ${
                  inputText.trim()
                    ? 'bg-teal-500 text-black hover:bg-teal-400'
                    : 'bg-[#333333] text-gray-500'
                }`}
              >
                <ArrowUp size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
