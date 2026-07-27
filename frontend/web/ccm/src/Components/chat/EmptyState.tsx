import React from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  Monitor,
  Mic,
  AudioLines,
} from 'lucide-react';
import { useSearch } from '../../Providers/SearchContext';

interface CardItem {
  id: string;
  icon: React.ElementType;
  title: string;
  badge?: string;
  description: string;
  query: string;
  gradient: string;
  accentColor: string;
}

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

interface EmptyStateProps {
  onSendSuggested?: (query: string) => void;
  onSendMessage?: (text: string) => void;
}

export function EmptyState({ onSendSuggested, onSendMessage }: EmptyStateProps) {
  const {
    inputText,
    setInputText,
    handleSendMessage: providerSendMessage,
    activeEstate,
  } = useSearch();

  // Prefer passed prop handler if provided, otherwise fallback to provider action
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
      {/* Title Header */}
      <div className="mb-6 space-y-2 text-left">
        <span className="text-sm font-medium text-gray-400">
          SokoAI • {activeEstate?.name || 'Local Search'}
        </span>
        <h1 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
          What would you like to find?
        </h1>
      </div>

      {/* Main Central Input Container */}
      <div className="group relative mb-8 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 shadow-xl transition-all focus-within:border-[#383838]">
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hello! what product would you like to find...?"
          className="w-full resize-none bg-transparent text-base text-white placeholder-gray-400 focus:outline-none"
        />

        {/* Input Bar Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#262626] hover:text-white"
              title="Attach File"
            >
              <Plus className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-[#2d2d2d] bg-[#222222] px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a]"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search Types</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-[#262626] hover:text-white"
            >
              <span>Model</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            <button
              type="button"
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#262626] hover:text-white"
              title="Voice Input"
            >
              <Mic className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-black transition-transform hover:bg-white active:scale-95"
            >
              <AudioLines className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Suggestion Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DEFAULT_CARDS.map((card) => {
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
