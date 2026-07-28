import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  Monitor,
  Mic,
  AudioLines,
  Check,
} from 'lucide-react';

import { useSearch, SEARCH_TYPES } from '../../Providers/SearchContext';

// ==========================================
// Types & Interfaces
// ==========================================

export interface CardItem {
  id: string;
  icon:any;
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
  setActiveSearchType?: (type: SearchType) => void;
  onSelectType?: (type: SearchType) => void;
}

export interface EmptyStateProps {
  onSendSuggested?: (query: string) => void;
  onSendMessage?: (text: string) => void;
}

// ==========================================
// Default Data
// ==========================================

const DEFAULT_CARDS: CardItem[] = [
  {
    id: 'search',
    icon: Search,
    title: 'Search and find Products',
    description: 'Get fast and accurate answers from the most trusted sources.',
    query: 'Search products and local deals',
    gradient: 'from-[#0d4f54] to-[#0c383c]',
    accentColor: 'text-teal-400',
  },
  {
    id: 'computer',
    icon: Monitor,
    title: 'Get budgeting and Shopping assistance',
    badge: 'NEW',
    description:
      'Get intelligent and guided experience while Shopping or looking for a Product',
    query: 'Help me find the best deals near me',
    gradient: 'from-[#0d343a] to-[#0a2328]',
    accentColor: 'text-teal-400',
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
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg border border-[#333333] bg-[#242424] px-2.5 py-1.5 text-xs font-medium text-gray-200 transition-all hover:border-[#444444] hover:bg-[#2c2c2c] active:scale-95"
      >
        <Search className="h-3.5 w-3.5 text-teal-400" />
        <span>{activeSearchType !== 'Direct Search' ? activeSearchType : 'Search Types'}</span>
        <ChevronDown
          className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[160px] overflow-hidden rounded-xl border border-[#333333] bg-[#1a1a1a]/95 p-1.5 shadow-2xl backdrop-blur-md transition-all duration-150 ease-out">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Filter Results
          </div>

          <div className="flex flex-col gap-0.5">
            {searchTypes.map((st) => {
              const isSelected = activeSearchType === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSelect(st as SearchType)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-teal-500/10 text-teal-400'
                      : 'text-gray-300 hover:bg-[#282828] hover:text-white'
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



// ==========================================
// Empty State Component
// ==========================================

export function EmptyState({ onSendSuggested, onSendMessage }: EmptyStateProps) {
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
    <div className="mx-auto flex h-full max-w-3xl flex-col justify-center px-4 py-12 text-slate-100">
      {/* Header */}
      <div className="mb-6 space-y-2 text-left">
        <span className="text-sm font-medium text-gray-400">
          SokoAI • {activeEstate?.name || 'Local Search'}
        </span>
        <h1 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
          What would you like to find?
        </h1>
      </div>





      {/* Text Area Input */}
      <div className="group relative mb-8 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 shadow-xl transition-all focus-within:border-[#383838]">
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="...type anything"
          className="w-full resize-none bg-transparent text-base text-white placeholder-gray-400 focus:outline-none"
        />

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#262626] hover:text-white"
              title="Attach File"
            >
              <Plus className="h-5 w-5" />
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
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-[#262626] hover:text-white"
            >
              <span>Base Model</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            <button
              type="button"
              className="hidden rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#262626] hover:text-white"
              title="Voice Input"
            >
              <Mic className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="hidden h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-black transition-transform hover:bg-white active:scale-95"
            >
              <AudioLines className="h-4 w-4" />
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
              className={`group relative flex flex-col items-start gap-2.5 rounded-2xl border border-[#1e3b3e] bg-gradient-to-br ${card.gradient} p-4 text-left transition-all duration-200 hover:border-[#2a5559] hover:shadow-lg active:scale-[0.98]`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${card.accentColor}`} />
                <span className="text-sm font-semibold text-white">
                  {card.title}
                </span>
                {card.badge && (
                  <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-bold text-teal-300">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-gray-300">
                {card.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
