import React, { useState } from 'react';
import { Send, MapPin } from 'lucide-react';
import { useSearch,SEARCH_TYPES } from '../../Providers/SearchContext';

export interface ChatInputProps {
  onSendMessage?: (text: string, searchType?: string) => void;
  activeEstate?: string;
}






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






export function ChatInput({ onSendMessage, activeEstate }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  
  // Extract search context state
  const {
    searchTypes = [],
    activeSearchType = 'all',
    setActiveSearchType = () => {},
  } = useSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (onSendMessage) {
      onSendMessage(inputValue.trim(), activeSearchType);
    }
    setInputValue('');
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#141b24] via-[#141b24]/95 to-transparent px-4 pb-2 pt-6 md:px-8">
      <div className="relative mx-auto max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col gap-2 rounded-2xl border border-stone-800/80 bg-stone-950 p-2 shadow-2xl transition-all focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30"
        >
          {/* Top Row: Input & Geolocation */}
          <div className="flex items-center gap-2">
            <div className="shrink-0 p-1.5 text-stone-500" title={activeEstate ? `Location: ${activeEstate}` : 'Geofenced Location'}>
              <MapPin size={18} className="animate-pulse text-emerald-400" />
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                activeEstate
                  ? `Search near ${activeEstate}...`
                  : 'Hello! What would you like to find?...'
              }
              className="w-full bg-transparent py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none"
            />
          </div>

          {/* Bottom Row: Controls & Actions */}
          <div className="flex items-center justify-between border-t border-stone-900 pt-2">
            {/* Search Types Selector */}
            <div className="flex items-center gap-2">
              <SearchTypesDropdown
                searchTypes={searchTypes}
                activeSearchType={activeSearchType}
                setActiveSearchType={setActiveSearchType}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!inputValue.trim()}
              aria-label="Send message"
              className={`flex shrink-0 items-center justify-center rounded-xl p-2.5 transition-all ${
                inputValue.trim()
                  ? 'cursor-pointer bg-emerald-500 text-stone-950 shadow-md hover:bg-emerald-400 active:scale-95'
                  : 'cursor-not-allowed bg-stone-900 text-stone-600'
              }`}
            >
              <Send size={15} />
            </button>
          </div>
        </form>

        {/* Disclaimer Footer */}
        <p className="mt-2 text-center text-[10px] font-medium text-stone-500">
          Soko AI is geofenced and might be inaccurate — confirm important details.
        </p>
      </div>
    </div>
  );
}
