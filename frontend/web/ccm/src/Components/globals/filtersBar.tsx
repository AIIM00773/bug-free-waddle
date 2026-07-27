import React, { useState, useEffect } from 'react';
import { 
  X, SlidersHorizontal, RotateCcw, Check, Sparkles, 
  Leaf, Cpu, ShieldCheck, Tag, DollarSign 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components for better maintainability ---

const Section = ({ title, icon: Icon, children }) => (
  <div className="space-y-3 mt-4 border  border-[1px] border-[aliceblue] p-4 rounded-2xl ">
    <div className="flex items-center gap-1.5 text-zinc-400">
      <Icon size={13} className="text-zinc-400" />
      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{title}</h4>
    </div>
    {children}
  </div>
);







const ToggleButton = ({ label, subLabel, icon: Icon, isActive, onToggle, activeGlowClass, toggleColorClass }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={isActive}
    className={`w-full flex items-center justify-between p-3 bg-zinc-900/40 hover:bg-zinc-900/80 border transition-all duration-200 rounded-xl text-left group ${
      isActive ? `border-zinc-700/80 bg-zinc-900/60 ${activeGlowClass}` : 'border-zinc-800/50'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg shrink-0 transition-colors ${
        isActive ? 'bg-zinc-800 text-white' : 'bg-zinc-900/80 text-zinc-500 group-hover:text-zinc-300'
      }`}>
        <Icon size={14} />
      </div>
      <div>
        <span className="text-xs font-medium text-zinc-200 block">{label}</span>
        <span className="text-[10px] text-zinc-400 block mt-0.5">{subLabel}</span>
      </div>
    </div>
    
    <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
      isActive ? toggleColorClass : 'bg-zinc-800'
    }`}>
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-4 h-4 rounded-full bg-white shadow-sm"
        style={{ translateX: isActive ? '16px' : '0px' }}
      />
    </div>
  </button>
);



// --- Main Component ---

export function FilterSidebar({ isOpen, onClose, initialFilters = {}, onApply }) {
  const getDefaultFilters = () => ({
    category: 'all',
    sortBy: 'ai_match',
    maxPrice: 1500,
    minAiScore: 80,
    hyperPersonalized: true,
    ecoFriendlyShipping: false,
    certifiedRefurbished: false,
    ...initialFilters
  });

  const [filters, setFilters] = useState(getDefaultFilters);

  // Sync state & handle scroll lock when opening
  useEffect(() => {
    if (isOpen) {
      setFilters(getDefaultFilters());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const update = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose} 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
          />

          {/* Drawer Panel */}
          <motion.div 
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: "100%", x: 0 }}
            breakpoints={{
              "(min-width: 768px)": {
                initial: { x: "100%", y: 0 },
                animate: { x: 0, y: 0 },
                exit: { x: "100%", y: 0 }
              }
            }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full md:w-[420px] h-[85vh] md:h-full bg-[#0b0f14] text-zinc-200 shadow-2xl flex flex-col z-10 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl border-t md:border-t-0 md:border-l border-zinc-800/80 overflow-hidden"
          >
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between shrink-0">
              <button className="flex items-center gap-2" onClick={onClose} >
                <div className="p-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                  <X size={16} />
                </div>
              </button>

              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => setFilters(getDefaultFilters())} 
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800/50"
                >
                  <RotateCcw size={12} /> Reset
                </button>
           
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 scrollbar-thin scrollbar-thumb-zinc-800">


              {/* Toggles */}
              <Section title="Preferences" icon={Cpu}>
                <div className="space-y-2.5">
                  <ToggleButton 
                    label="Style Persona" 
                    subLabel="Personalize feeds via neural preference models" 
                    icon={Cpu} 
                    isActive={filters.hyperPersonalized} 
                    onToggle={() => update('hyperPersonalized', !filters.hyperPersonalized)}
                    toggleColorClass="bg-violet-600"
                    activeGlowClass="shadow-sm shadow-violet-950/50"
                  />
                  <ToggleButton 
                    label="Green Fleet" 
                    subLabel="Priority carbon-offset shipping options" 
                    icon={Leaf} 
                    isActive={filters.ecoFriendlyShipping} 
                    onToggle={() => update('ecoFriendlyShipping', !filters.ecoFriendlyShipping)}
                    toggleColorClass="bg-emerald-600"
                    activeGlowClass="shadow-sm shadow-emerald-950/50"
                  />
                  <ToggleButton 
                    label="Certified Circular" 
                    subLabel="Verified inspected open-box and refurbished items" 
                    icon={ShieldCheck} 
                    isActive={filters.certifiedRefurbished} 
                    onToggle={() => update('certifiedRefurbished', !filters.certifiedRefurbished)}
                    toggleColorClass="bg-cyan-600"
                    activeGlowClass="shadow-sm shadow-cyan-950/50"
                  />
                </div>
              </Section>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-zinc-800/80 bg-zinc-900/40 shrink-0">
              <button 
                type="button"
                onClick={() => { onApply(filters); onClose(); }}
                className="w-full bg-white hover:bg-zinc-200 active:bg-zinc-300 text-zinc-950 font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-zinc-950/50"
              >
                <Check size={14} className="stroke-[2.5]" /> Apply Filters
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
