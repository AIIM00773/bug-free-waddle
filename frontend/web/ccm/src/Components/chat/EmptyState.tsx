import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  Mic,
  Check,
  Store,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Sparkles,
} from 'lucide-react';

import { useSearch, SEARCH_TYPES } from '../../Providers/SearchContext';

// ==========================================
// Types & Interfaces
// ==========================================

export interface CardItem {
  id: string;
  icon: any;
  title: string;
  badge?: string;
  description: string;
  query: string;
  gradient: string;
  accentColor: string;
  badgeColor?: string;
}

export interface SearchTypesDropdownProps {
  searchTypes?: readonly string[];
  activeSearchType?: string;
  setActiveSearchType?: (type: any) => void;
  onSelectType?: (type: any) => void;
}

export interface EmptyStateProps {
  onSendSuggested?: (query: string) => void;
  onSendMessage?: (text: string) => void;
}

// ==========================================
// Search Types Dropdown Component
// ==========================================

export function SearchTypesDropdown({
  searchTypes = SEARCH_TYPES,
  activeSearchType = 'Direct Search',
  setActiveSearchType,
  onSelectType,
}: SearchTypesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type: any) => {
    setActiveSearchType?.(type);
    onSelectType?.(type);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left font-sans">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-95"
      >
        <Search className="h-3.5 w-3.5 text-slate-500" />
        <span>
          {activeSearchType !== 'Direct Search'
            ? activeSearchType
            : 'Search Types'}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-700' : ''
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[200px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Filter Results
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
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
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

// ==========================================
// Empty State Component
// ==========================================

export function EmptyState({ onSendSuggested, onSendMessage }: EmptyStateProps) {
  const {
    inputText,
    setInputText,
    handleSendMessage: providerSendMessage,
    searchTypes = SEARCH_TYPES,
    activeSearchType = 'Direct Search',
    setActiveSearchType,
  } = useSearch();

  const DEFAULT_CARDS: CardItem[] = [
    {
      id: 'groceries',
      icon: ShoppingBag,
      title: 'Mama Mboga & Fresh',
      badge: '15m Delivery',
      description: 'Find fresh organic vegetables, fruits, and greens from nearby stalls.',
      query: 'Show me fresh vegetables and fruits available near me right now',
      gradient: 'from-orange-600 via-orange-500 to-amber-700',
      accentColor: 'text-orange-600',
      badgeColor: 'bg-emerald-100/90 text-emerald-900 border border-emerald-200',
    },
    {
      id: 'butchery',
      icon: Store,
      title: 'Butchery & Meats',
      badge: 'Verified',
      description: 'Get prime beef, goat meat, and fresh chicken from local butcheries.',
      query: 'Find butcheries near me with fresh beef and chicken today',
      gradient: 'from-emerald-700 via-emerald-600 to-teal-800',
      accentColor: 'text-emerald-700',
      badgeColor: 'bg-amber-100/90 text-amber-900 border border-amber-200',
    },
  ];

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  const dispatchSendMessage = (text: string) => {
    if (onSendMessage) {
      onSendMessage(text);
    } else {
      providerSendMessage(text);
    }
  };

  const dispatchSendSuggested = (query: string) => {
    if (onSendSuggested) {
      onSendSuggested(query);
    } else {
      providerSendMessage(query);
    }
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      dispatchSendMessage(inputText.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isInputEmpty = !inputText.trim();

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col justify-center px-4 py-12 font-sans text-slate-900 sm:px-6">
      {/* Header Area */}
      <div className="mb-8 space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Where should we start?
        </h1>
        <p className="text-sm font-normal text-slate-500 max-w-2xl">
          Discover authentic products from merchants and shops right in your neighborhood and country-wide. Shop, bargain, and find any product intelligently.
        </p>
      </div>

      {/* Primary Input Card */}
      <div className="group relative mb-8 rounded-2xl border border-slate-300/80 bg-white p-3.5 shadow-sm transition-all duration-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100">
        <textarea
          ref={textareaRef}
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for products, compare prices, or find local shops..."
          className="max-h-40 min-h-[56px] w-full resize-none bg-transparent px-1 py-1 text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none sm:text-base"
        />

        {/* Action Toolbar */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
          {/* Left Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              title="Attach Image or List"
            >
              <Plus className="h-4 w-4" />
            </button>

            <SearchTypesDropdown
              searchTypes={searchTypes}
              activeSearchType={activeSearchType}
              setActiveSearchType={setActiveSearchType}
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <MapPin className="h-3 w-3 text-slate-500" />
              <span>Local Catalog</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            <button
              type="button"
              className="hidden h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 sm:flex"
              title="Voice Search"
            >
              <Mic className="h-4 w-4" />
            </button>

            {/* Submit Action Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isInputEmpty}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 ${
                !isInputEmpty
                  ? 'bg-slate-900 text-white shadow-sm hover:scale-105 hover:bg-black active:scale-95'
                  : 'cursor-not-allowed bg-slate-100 text-slate-300'
              }`}
              title="Send Search"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion Cards Grid */}
      {DEFAULT_CARDS && DEFAULT_CARDS.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DEFAULT_CARDS.map((card) => {
            const Icon = card.icon || Store;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => dispatchSendSuggested(card.query)}
                className={`group relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/60 bg-gradient-to-br ${card.gradient} p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400`}
              >
                {/* Header Row: Icon, Title & Badge */}
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/90 shadow-sm backdrop-blur-md transition-transform duration-200 group-hover:scale-105">
                      <Icon className={`h-4 w-4 ${card.accentColor}`} />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {card.title}
                    </span>
                  </div>

                  {card.badge && (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide shadow-xs ${
                        card.badgeColor || 'bg-white/90 text-slate-900'
                      }`}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Description Text with clear contrast */}
                <p className="line-clamp-2 text-xs leading-relaxed text-white/90 font-medium">
                  {card.description}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
