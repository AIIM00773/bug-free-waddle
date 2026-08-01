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

const DEFAULT_CARDS: CardItem[] = [
 
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
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
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
        <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[170px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl transition-all duration-150 ease-out">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#3C3147]/10 font-semibold text-[#3C3147]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{st}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-[#3C3147]" />
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
    searchTypes,
    activeSearchType,
    setActiveSearchType,
    defaultCards = DEFAULT_CARDS,
  } = useSearch();

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

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col justify-center px-4 py-12 text-slate-900">
      {/* Header Area */}
      <div className="mb-6 space-y-1 text-left">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-slate-900 sm:text-4xl">
          What are you looking for today?
        </h1>
        <p className="text-sm text-slate-500">
          Discover authentic products from merchants and shops right in your neighborhood.
        </p>
      </div>

      {/* Primary Input Card */}
      <div className="group relative mb-8 rounded-3xl  bg-emerald-600/20  border border-[1px] border-[#3C3147]/40  p-4 shadow-sm transition-all focus-within:border-[#3C3147]/40 focus-within:shadow-md">
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for products, compare prices, or find local shops..."
          className="w-full resize-none bg-transparent text-base text-slate-900 placeholder-slate-400 focus:outline-hidden"
        />

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              <span>Local Catalog</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            <button
              type="button"
              className="hidden rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 sm:inline-block"
              title="Voice Search"
            >
              <Mic className="h-4 w-4" />
            </button>

            {/* Submit Action Pill */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!inputText.trim()}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                inputText.trim()
                  ? 'bg-[#3C3147] text-white shadow-sm hover:bg-[#2c2434] active:scale-95'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
              title="Send Search"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>


      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {defaultCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => dispatchSendSuggested(card.query)}
              className={`group relative flex flex-col items-start gap-2.5 rounded-2xl border border-slate-200/80 bg-gradient-to-br ${card.gradient} p-5 text-left transition-all duration-200 hover:border-[#3C3147]/30 hover:shadow-md active:scale-[0.99]`}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-2xs border border-slate-100">
                    <Icon className={`h-4 w-4 ${card.accentColor}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-[#3C3147] transition-colors">
                    {card.title}
                  </span>
                </div>

                {card.badge && (
                  <span className="rounded-full bg-[#3C3147]/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#3C3147]">
                    {card.badge}
                  </span>
                )}
              </div>

              <p className="text-xs leading-relaxed text-slate-600">
                {card.description}
              </p>
            </button>
          );
        })}
      </div>
      
    </div>
  );
}
