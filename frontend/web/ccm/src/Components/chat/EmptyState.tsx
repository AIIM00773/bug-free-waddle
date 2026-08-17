import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  MapPin,
  Mic,
  Plus,
  Search,
  ShoppingBag,
  Store,
  ChevronRight
} from 'lucide-react';

import { useSearch, SEARCH_TYPES } from '../../Providers/SearchContext';
import bannerImage1 from '../../assets/mainbanner1.png';

// ============================================================
// Types
// ============================================================

type SearchType = string;

interface CardItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  query: string;
  gradient: string;
  accentColor: string;
  badge?: string;
  badgeColor?: string;
}

interface SearchTypesDropdownProps {
  searchTypes?: readonly SearchType[];
  activeSearchType?: SearchType;
  setActiveSearchType?: (type: SearchType) => void;
  onSelectType?: (type: SearchType) => void;
}

interface EmptyStateProps {
  onSendSuggested?: (query: string) => void;
  onSendMessage?: (text: string) => void;
}

// ============================================================
// Constants
// ============================================================

const DEFAULT_SEARCH_TYPE = 'Direct Search';

const DEFAULT_CARDS: CardItem[] = [
  {
    id: 'groceries',
    icon: ShoppingBag,
    title: 'Mama Mboga & Fresh',
    badge: '15m Delivery',
    description:
      'Find fresh organic vegetables, fruits, and greens from nearby stalls.',
    query:
      'Show me fresh vegetables and fruits available near me right now',
    gradient: 'from-orange-600 via-orange-500 to-amber-700',
    accentColor: 'text-orange-600',
    badgeColor:
      'border border-emerald-200 bg-emerald-100/90 text-emerald-900',
  },
  {
    id: 'butchery',
    icon: Store,
    title: 'Butchery & Meats',
    badge: 'Verified',
    description:
      'Get prime beef, goat meat, and fresh chicken from local butcheries.',
    query:
      'Find butcheries near me with fresh beef and chicken today',
    gradient: 'from-emerald-700 via-emerald-600 to-teal-800',
    accentColor: 'text-emerald-700',
    badgeColor:
      'border border-amber-200 bg-amber-100/90 text-amber-900',
  },
];

// ============================================================
// Search Types Dropdown
// ============================================================



export function SearchTypesDropdown({
  searchTypes = SEARCH_TYPES,
  activeSearchType = DEFAULT_SEARCH_TYPE,
  setActiveSearchType,
  onSelectType,
}: SearchTypesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (type: SearchType) => {
    setActiveSearchType?.(type);
    onSelectType?.(type);
    setIsOpen(false);
  };

  const label =
    activeSearchType !== DEFAULT_SEARCH_TYPE
      ? activeSearchType
      : 'Search Types';

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block font-sans"
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="
          flex items-center gap-1.5
          rounded-full
          border border-slate-200
          bg-slate-50
          px-3 py-1.5
          text-xs font-semibold text-slate-700
          transition-all
          hover:border-slate-300
          hover:bg-slate-100
          active:scale-95
        "
      >
        <Search className="h-3.5 w-3.5 text-slate-500" />

        <span>{label}</span>

        <ChevronDown
          className={`
            h-3 w-3 text-slate-400
            transition-transform duration-200
            ${isOpen ? 'rotate-180 text-slate-700' : ''}
          `}
        />
      </button>

      {/* Menu */}
      {isOpen && (
        <div
          className="
            absolute bottom-full left-0 z-50 mb-2
            min-w-[200px]
            overflow-hidden
            rounded-2xl
            border border-slate-200/80
            bg-white/95
            p-1.5
            shadow-xl
            backdrop-blur-xl
          "
        >
          <div
            className="
              px-3 py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            Filter Results
          </div>

          <div className="flex flex-col gap-0.5">
            {searchTypes.map((type) => {
              const selected = activeSearchType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelect(type)}
                  className={`
                    flex w-full
                    items-center justify-between
                    rounded-xl
                    px-3 py-2
                    text-xs
                    transition-colors
                    ${
                      selected
                        ? 'bg-slate-900 font-semibold text-white shadow-sm'
                        : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <span>{type}</span>

                  {selected && (
                    <Check className="h-3.5 w-3.5" />
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

// ============================================================
// Empty State
// ============================================================

export function EmptyState({
  onSendSuggested,
  onSendMessage,
}: EmptyStateProps) {
  const {
    inputText,
    setInputText,
    handleSendMessage,
    searchTypes = SEARCH_TYPES,
    activeSearchType = DEFAULT_SEARCH_TYPE,
    setActiveSearchType,
  } = useSearch();


const [showWelcomeBanner, setShowWelcomeBanner] = useState(() => {
  return localStorage.getItem('showWelcomeBanner') !== 'false';
});

const handleCloseWelcome = () => {
  localStorage.setItem('showWelcomeBanner', 'false');
  setShowWelcomeBanner(false);
};



  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ----------------------------------------------------------
  // Auto resize textarea
  // ----------------------------------------------------------

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [inputText]);

  // ----------------------------------------------------------
  // Send message
  // ----------------------------------------------------------

  const sendMessage = (text: string) => {
    const value = text.trim();

    if (!value) return;

    if (onSendMessage) {
      onSendMessage(value);
      return;
    }

    handleSendMessage(value);
  };

  const sendSuggested = (query: string) => {
    if (onSendSuggested) {
      onSendSuggested(query);
      return;
    }

    handleSendMessage(query);
  };

  // ----------------------------------------------------------
  // Submit
  // ----------------------------------------------------------

  const handleSubmit = () => {
    sendMessage(inputText);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key !== 'Enter' || event.shiftKey) return;

    event.preventDefault();
    handleSubmit();
  };

  const isInputEmpty = !inputText.trim();

  // ==========================================================
  // Welcome Banner
  // ==========================================================


if (showWelcomeBanner ) {
  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        overflow-hidden
        bg-white
        font-sans
        animate-in fade-in
        duration-300
      "
      onClick={() => handleCloseWelcome()}
    >
      {/* ─────────────────────────────────────────────
          Background
      ───────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#FCFBFE]" />

      {/* Soft ambient glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[80vh]
          w-[80vw]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-indigo-100/20
          blur-[120px]
        "
      />

      {/* ─────────────────────────────────────────────
          Main Welcome Surface
      ───────────────────────────────────────────── */}
      <div
        className="
          relative
          flex
          h-full
          w-full
          items-center
          justify-center
          px-2
          py-2
          sm:px-4
          sm:py-4
          lg:px-8
          lg:py-6
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* ─────────────────────────────────────────
            Welcome Artwork
        ───────────────────────────────────────── */}
        <div
          className="
            relative
            flex
            h-full
            w-full
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            sm:rounded-3xl
          "
        >
          <img
            src={bannerImage1}
            alt="AI-powered shopping assistant"
            className="
              h-full
              w-full
              object-contain
              object-center
              select-none
              animate-in
              fade-in
              zoom-in-[0.98]
              duration-500
            "
            draggable={false}
          />

          {/* ─────────────────────────────────────
              Invisible interaction layer
          ───────────────────────────────────── */}
          <button
            type="button"
            aria-label="Get started"
            onClick={() => setShowWelcomeBanner(false)}
            className="
              absolute
              left-[6%]
              top-[68%]
              h-14
              w-56
              cursor-pointer
              rounded-full
              bg-transparent
              outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-400
              focus-visible:ring-offset-2
            "
          />
        </div>

        {/* ─────────────────────────────────────────
            Close Button
        ───────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => handleCloseWelcome()}
          aria-label="Close welcome screen"
          className="
            absolute
            left-4
            top-4
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-slate-200/80
            bg-white/90
            text-slate-500
            shadow-sm
            backdrop-blur-md
            transition-all
            duration-200
            hover:scale-105
            hover:border-slate-300
            hover:bg-white
            hover:text-slate-900
            active:scale-95
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-slate-300
            sm:right-6
            sm:top-6
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* ─────────────────────────────────────────
            Skip / Continue
        ───────────────────────────────────────── */}
        <button 
            type="button"  
             onClick={() => handleCloseWelcome()}
         className="
            absolute
            right-0 
            top-4
            z-20
            h-fit 
            
            
            -translate-x-1/2
            rounded-full
            border
            border-slate-200/70
            bg-[dodgerblue]
            px-4
            py-2
            text-xs
            font-medium
            text-slate-50
            font-bold 
            shadow-sm
            backdrop-blur-md
            transition-all
            duration-200
            hover:bg-white
            hover:text-slate-800
            active:scale-95
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-slate-300
            sm:bottom-6
            flex flex-row items-center gap-1 
          ">
        <span
    
        >
          Continue 
        </span>
         <ChevronRight color={"white"} size={13}/> 
        </button>


      </div>
    </div>
  );
}


  // ==========================================================
  // Main Empty State
  // ==========================================================

  return (
    <div
      className="
        mx-auto flex h-full
        max-w-3xl
        flex-col justify-center
        px-4 py-12
        font-sans
        text-slate-900
        sm:px-6
      "
    >
      {/* Header */}
      <header className="mb-8 space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Where should we start?
        </h1>

        <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
          Discover authentic products from merchants and shops
          right in your neighborhood and country-wide. Shop,
          bargain, and find any product intelligently.
        </p>
      </header>

      {/* Search Box */}
      <div
        className="
          group relative mb-8
          rounded-2xl
          border border-slate-300/80
          bg-white
          p-3.5
          shadow-sm
          transition-all
          duration-200
          focus-within:border-slate-400
          focus-within:ring-4
          focus-within:ring-slate-100
        "
      >
        {/* Input */}
        <textarea
          ref={textareaRef}
          rows={2}
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for products, compare prices, or find local shops..."
          className="
            max-h-40 min-h-[56px]
            w-full resize-none
            bg-transparent
            px-1 py-1
            text-sm
            leading-relaxed
            text-slate-800
            placeholder:text-slate-400
            focus:outline-none
            sm:text-base
          "
        />

        {/* Toolbar */}
        <div
          className="
            mt-2 flex flex-wrap
            items-center justify-between
            gap-2
            border-t border-slate-100
            pt-2.5
          "
        >
          {/* Left Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              title="Attach Image or List"
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-full
                text-slate-400
                transition-colors
                hover:bg-slate-100
                hover:text-slate-700
              "
            >
              <Plus className="h-4 w-4" />
            </button>

            <SearchTypesDropdown
              searchTypes={searchTypes}
              activeSearchType={activeSearchType}
              setActiveSearchType={setActiveSearchType}
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="
                flex items-center gap-1
                rounded-full
                border border-slate-200
                bg-slate-50
                px-3 py-1.5
                text-xs font-medium
                text-slate-600
                transition-colors
                hover:bg-slate-100
                hover:text-slate-900
              "
            >
              <MapPin className="h-3 w-3 text-slate-500" />

              <span>Local Catalog</span>

              <ChevronDown className="h-3 w-3" />
            </button>

            {/* Voice */}
            <button
              type="button"
              title="Voice Search"
              className="
                hidden h-8 w-8
                items-center justify-center
                rounded-full
                text-slate-400
                transition-colors
                hover:bg-slate-100
                hover:text-slate-700
                sm:flex
              "
            >
              <Mic className="h-4 w-4" />
            </button>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isInputEmpty}
              title="Send Search"
              className={`
                flex h-8 w-8
                items-center justify-center
                rounded-full
                transition-all duration-150
                ${
                  isInputEmpty
                    ? 'cursor-not-allowed bg-slate-100 text-slate-300'
                    : 'bg-slate-900 text-white shadow-sm hover:scale-105 hover:bg-black active:scale-95'
                }
              `}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Searches */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DEFAULT_CARDS.map((card) => {
          const Icon = card.icon;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => sendSuggested(card.query)}
              className={`
                group relative
                flex flex-col
                justify-between
                gap-4
                rounded-2xl
                border border-slate-200/60
                bg-gradient-to-br ${card.gradient}
                p-5
                text-left
                shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                active:scale-[0.99]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-slate-400
              `}
            >
              {/* Card Header */}
              <div className="flex w-full items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-full
                      border border-white/40
                      bg-white/90
                      shadow-sm
                      backdrop-blur-md
                      transition-transform
                      duration-200
                      group-hover:scale-105
                    "
                  >
                    <Icon
                      className={`h-4 w-4 ${card.accentColor}`}
                    />
                  </div>

                  <span className="text-sm font-semibold text-white">
                    {card.title}
                  </span>
                </div>

                {card.badge && (
                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-2.5 py-0.5
                      text-[10px]
                      font-bold
                      tracking-wide
                      shadow-sm
                      ${card.badgeColor}
                    `}
                  >
                    {card.badge}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="line-clamp-2 text-xs font-medium leading-relaxed text-white/90">
                {card.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
