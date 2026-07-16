import React, { useRef, useEffect } from 'react';
import { Sparkles, Plus, Compass, Eye } from 'lucide-react';
import { SUGGESTIONS } from "../../Constants/fakedb";

export function ChatFeed({ 
  messages = [], 
  onAddToBasket, 
  onSendSuggested, 
  onViewDetails 
}) {
  const feedEndRef = useRef(null);

  // Smooth scroll to the newest message
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Safe image fallback helper
  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10 px-4">
      {messages.map((message) => {
        const isUser = message.sender === 'user';
        const suggestionsList = Array.isArray(message.suggestions) 
          ? message.suggestions 
          : (Array.isArray(SUGGESTIONS) ? SUGGESTIONS : []);
        
        return (
          <div key={message.id} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start flex-col md:flex-row'}`} >
          
            {/* AI Avatar Icon */}
            {!isUser && (
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-850/50 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles size={15} />
              </div>
            )}

            {/* Chat Bubble Container */}
            <div 
              className={`max-w-[98%] md:max-w-[85%] rounded-2xl px-4 py-3.5 text-sm space-y-3 shadow-md transition-all ${
                isUser 
                  ? 'bg-none text-white rounded-tr-none' 
                  : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none'
              }`}
            >
              <p className={`leading-relaxed whitespace-pre-wrap ${isUser ? 'text-white' : 'text-stone-300'}`}>
                {message.text}
              </p>
              
              {/* Suggestion Prompts */}
              {message.suggestions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                  {suggestionsList.map((s, idx) => (
                    <button 
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        onSendSuggested?.(s.query);
                      }}
                      className="text-left p-2.5 rounded-xl bg-stone-950/50 border border-stone-800/80 hover:border-amber-500/40 hover:bg-stone-950 transition-all text-xs text-stone-400 hover:text-stone-200 flex items-start gap-2 group cursor-pointer"
                    >
                      <Compass 
                        size={14} 
                        className="text-amber-500 shrink-0 mt-0.5 transition-transform duration-300 group-hover:rotate-45" 
                      />
                      <span className="line-clamp-2 leading-tight">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Vendor Catalog Matches Grid */}
              {message.products && message.products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {message.products.map((p) => (
                    <div 
                      key={p.id} 
                      className="bg-stone-950 border border-stone-800/80 rounded-xl p-3 flex flex-col justify-between hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/2 transition-all gap-3.5"
                    >
                      {/* Product Image */}
                      <img 
                        src={p.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"} 
                        alt={p.name || "Product"} 
                        onError={handleImageError}
                        className="w-full h-28 object-cover rounded-lg bg-stone-900 border border-stone-800/60" 
                      /> 
                      
                      {/* Product Specs */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            {p.category}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">{p.distance}</span>
                        </div>
                        <h4 className="font-semibold text-xs text-stone-100 line-clamp-1">{p.name}</h4>
                        <p className="text-[10px] text-stone-400 mt-0.5">Vendor: {p.shop}</p>
                      </div>

                      {/* Card Action Bar */}
                      <div className="flex items-center justify-between border-t border-stone-800/80 pt-2 mt-1">
                        <span className="font-bold text-xs text-stone-100">KES {p.price}</span>
                        
                        <div className="flex gap-1.5">
                          {/* Basket Button */}
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onAddToBasket?.(p);
                            }}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-850 hover:border-emerald-500/30 text-emerald-400 hover:text-emerald-350 cursor-pointer text-[10px] rounded-md transition-all flex items-center gap-1 active:scale-95 font-semibold border border-stone-800/40"
                          >
                            <Plus size={11} strokeWidth={3} />
                            <span>Basket</span>
                          </button>

                          {/* View Details Button */}
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onViewDetails?.(p);
                            }}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-850 hover:border-amber-500/30 text-amber-550 hover:text-amber-400 cursor-pointer text-[10px] rounded-md transition-all flex items-center gap-1 active:scale-95 font-semibold border border-stone-800/40"
                          >
                            <Eye size={11} strokeWidth={2.5} />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            {isUser && (
              <div className="w-8 h-8 rounded-lg bg-emerald-500 border border-emerald-400 flex items-center justify-center font-bold text-xs text-stone-950 shrink-0 shadow-sm">
                C
              </div>
            )}
          </div>
        );
      })}
      <div ref={feedEndRef} />
    </div>
  );
}
