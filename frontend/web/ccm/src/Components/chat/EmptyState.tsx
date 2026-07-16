import React from 'react';
import { Sparkles, Compass } from 'lucide-react';

// Local fallback suggestions to ensure the screen is never empty
const GLOBAL_SUGGESTIONS = [];
const FALLBACK_SUGGESTIONS =[]; 

export function EmptyState({ activeEstate, onSendSuggested }) {
  // Use global database suggestions if populated, otherwise fall back to our local curated list
  const suggestionsList = GLOBAL_SUGGESTIONS && GLOBAL_SUGGESTIONS.length > 0 
    ? GLOBAL_SUGGESTIONS 
    : FALLBACK_SUGGESTIONS;

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center items-center text-center space-y-8 py-16">

      <div className="relative group">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 blur-md opacity-25 group-hover:opacity-40 transition duration-1000 animate-pulse" />
        <div className="relative w-16 h-16 rounded-full  bg-stone-900 border border-stone-850 text-emerald-400 flex items-center justify-center shadow-2xl">
          <Sparkles size={28} className="animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-stone-100">
          Soko AI
        </h2>
        <p className="text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
          Your ultimate companion for the best neighborhood and country-wide products discovery and shopping experience.
          </p> 
      </div>

      <div className="w-full space-y-3 pt-4">

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
          {suggestionsList.map((s, idx) => (
            <button 
              key={idx} 
              onClick={() => onSendSuggested?.(s.query)} 
              className="text-left p-4 rounded-xl bg-stone-950 border border-stone-800/80 hover:border-emerald-500/40 hover:bg-stone-900/50 transition-all text-xs text-stone-300 hover:text-white flex items-start gap-3 shadow-sm group cursor-pointer" 
            >
              <Compass 
                size={16} 
                className="text-amber-500 shrink-0 mt-0.5 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" 
              />
              <div className="space-y-1">
                <span className="font-semibold block text-stone-200 group-hover:text-stone-100 transition-colors">
                  {s.label}
                </span>
                <span className="text-[10px] text-stone-500 font-medium block">
                  Auto-scout within 500m
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
}
