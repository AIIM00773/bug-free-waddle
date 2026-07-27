import React, { useState } from 'react';
import { Send, MapPin } from 'lucide-react';

export function ChatInput({ onSendMessage, activeEstate }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#141b24] via-[#141b24]/95 to-transparent pt-6 pb-1 px-4 md:px-8 z-20">
      <div className="max-w-3xl mx-auto relative">
        <form 
          onSubmit={handleSubmit} 
          className="relative bg-stone-950 border border-stone-800/80 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all rounded-2xl flex items-center gap-2 p-1.5 shadow-2xl"
        >
          {/* Geolocation Indicator */}
          <div className="p-2 text-stone-500 shrink-0">
            <MapPin size={18} className="text-emerald-400 animate-pulse" />
          </div>
          
          {/* Main Input Field */}
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none placeholder-stone-500 text-stone-100 px-1 py-3"
            placeholder={`Hello ! , What would you like to find ? ... `}
          />

          {/* Action Submit Button */}
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className={`p-3 rounded-xl transition-all shrink-0 flex items-center justify-center ${
              inputValue.trim() 
                ? 'bg-emerald-500 text-stone-950 hover:bg-emerald-400 cursor-pointer shadow-md active:scale-95' 
                : 'bg-stone-900 text-stone-600 cursor-not-allowed'
            }`}
          >
            <Send size={14} />
          </button>
        </form>
        <p className="text-[10px] text-stone-500 text-center mt-2.5 font-medium flex-row items-center justify-center   align-center  ">
          Soko AI is geofenced and might be inaccurate  confirm important details 
        </p>
        
      </div>
    </div>
  );
}
