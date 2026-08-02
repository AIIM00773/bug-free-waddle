import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  Monitor,
  Mic,
  AudioLines,
  Check,
  Store,
  ShoppingBag,
  ArrowRight,
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
// Default Data (Updated for Local Commerce)
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
  badgeColor?: string; // Added for cohesive badge styling
}

const DEFAULT_CARDS: CardItem[] = [
  {
    id: 'groceries',
    icon: ShoppingBag,
    title: 'Mama Mboga & Fresh',
    badge: '15m Delivery',
    description: 'Find fresh organic vegetables, fruits, and greens from nearby stalls.',
    query: 'Show me fresh vegetables and fruits available near me right now',
    // Smooth sage-green wash that complements deep plum
    gradient: 'from-emerald-50/80 via-white to-slate-50/50',
    accentColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/60',
  },
  {
    id: 'butchery',
    icon: Store,
    title: 'Butchery & Meats',
    badge: 'Verified',
    description: 'Get prime beef, goat meat, and fresh chicken from local butcheries.',
    query: 'Find butcheries near me with fresh beef and chicken today',
    // Warm amber-terracotta wash (much more natural for food/butchery than pink/rose)
    gradient: 'from-amber-50/80 via-white to-slate-50/50',
    accentColor: 'text-amber-700',
    badgeColor: 'bg-amber-100/80 text-amber-900 border border-amber-200/60',
  },
];

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

  // Close dropdown on click outside
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
        className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-95"
      >
        <Search className="h-3.5 w-3.5 text-[#3C3147]" />
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
        <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[200px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl backdrop-blur-xl transition-all duration-150 ease-out">
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
                      ? 'bg-[#3C3147] text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{st}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
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

export function EmptyState({
  onSendSuggested,
  onSendMessage,
}: EmptyStateProps) {
  const {
    inputText,
    setInputText,
    handleSendMessage: providerSendMessage,
    activeEstate,
    searchTypes = SEARCH_TYPES,
    activeSearchType = 'Direct Search',
    setActiveSearchType,
    defaultCards = DEFAULT_CARDS,
  } = useSearch();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height up to a ceiling of 160px
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  // Send handler with fallback to context action
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
      <div className="mb-8 space-y-2 text-left">
      
        <h1 className="font-serif text-3xl font-normal tracking-tight text-slate-900 sm:text-4xl">
          What are you looking for today?
        </h1>
        <p className="text-sm text-slate-500">
          Discover authentic products from merchants and shops right in your neighborhood.
        </p>
      </div>

      {/* Primary Input Card (Matches Floating SokoAIInput styling) */}
      <div className="group relative mb-8 rounded-2xl border border-slate-600/80 bg-white p-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-200 focus-within:border-[#3C3147]/30 focus-within:shadow-[0_8px_30px_rgb(60,49,71,0.08)] focus-within:ring-4 focus-within:ring-[#3C3147]/5">
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
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100/80 pt-2.5">
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
                  ? 'bg-[#3C3147] text-white shadow-sm hover:scale-105 hover:bg-[#2c2434] active:scale-95'
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
 {/* Suggestion Cards Grid */}
{defaultCards && defaultCards.length > 0 && (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {defaultCards.map((card) => {
      const Icon = card.icon || Store;
      return (
        <button
          key={card.id}
          type="button"
          onClick={() => dispatchSendSuggested(card.query)}
          className={`group relative flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-br ${card.gradient} p-4 text-left shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3C3147]/30 hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3C3147]/30 sm:p-5`}
        >
          {/* Header Row: Icon, Title & Badge */}
          <div className="flex w-full items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-2xs backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
                <Icon className={`h-4 w-4 ${card.accentColor}`} />
              </div>
              <span className="text-sm font-semibold text-slate-50 transition-colors group-hover:text-[aliceblue]">
                {card.title}
              </span>
            </div>

            {card.badge && (
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide  ${
                  card.badgeColor ||
                  'border border-[#3C3147]/20 bg-gray-50 text-[#3C3147]'
                }`}
              >
                {card.badge}
              </span>
            )}
          </div>

          {/* Description Text */}
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-200">
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
