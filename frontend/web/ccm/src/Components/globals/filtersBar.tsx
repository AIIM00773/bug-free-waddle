import React, { useState, useEffect } from 'react';
import { 
  X, 
  RotateCcw, 
  Check, 
  Sparkles, 
  MapPin, 
  Store, 
  ShieldCheck, 
  Tag, 
  DollarSign,
  Clock,
  Award,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components for clean editorial layout ---

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
    <div className="flex items-center gap-1.5 text-slate-500">
      <Icon size={14} className="text-slate-500" />
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h4>
    </div>
    {children}
  </div>
);

const ToggleButton = ({ 
  label, 
  subLabel, 
  icon: Icon, 
  isActive, 
  onToggle 
}: { 
  label: string; 
  subLabel: string; 
  icon: any; 
  isActive: boolean; 
  onToggle: () => void; 
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={isActive}
    className={`w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 border transition-all duration-200 rounded-xl text-left group shadow-2xs ${
      isActive ? 'border-[#3C3147] ring-1 ring-[#3C3147]/20 bg-slate-50/80' : 'border-slate-200/80'
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-xl shrink-0 transition-colors ${
          isActive
            ? 'bg-[#3C3147] text-white shadow-xs'
            : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
        }`}
      >
        <Icon size={16} />
      </div>
      <div>
        <span className="text-xs font-semibold text-slate-800 block">{label}</span>
        <span className="text-[11px] text-slate-500 block mt-0.5 leading-tight">{subLabel}</span>
      </div>
    </div> 
    
    <div
      className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 flex items-center ${
        isActive ? 'bg-[#3C3147]' : 'bg-slate-200'
      }`}
    >
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white shadow-sm"
        style={{ translateX: isActive ? '16px' : '0px' }}
      />
    </div>
  </button>
);

const PillSelect = ({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (val: any) => void;
}) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map((opt) => {
      const selected = opt.value === value;
      return (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
            selected
              ? 'bg-[#3C3147] text-white shadow-xs'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
          }`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

// --- Main FilterSidebar Component ---

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters?: Record<string, any>;
  onApply: (filters: any) => void;
}

export function FilterSidebar({ 
  isOpen, 
  onClose, 
  initialFilters = {}, 
  onApply 
}: FilterSidebarProps) {
  
  const getDefaultFilters = () => ({
    category: 'all',
    sortBy: 'shortest_distance',
    maxPrice: 2000,
    maxDistanceKm: 3,
    verifiedFreshToday: true,
    instantRunnerReady: false,
    directMerchantPricing: true,
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

  const update = (key: string, val: any) => setFilters(prev => ({ ...prev, [key]: val }));

  const categories = [
    { label: 'All Items', value: 'all' },
    { label: 'Mama Mboga Produce', value: 'produce' },
    { label: 'Butcher & Meats', value: 'butchery' },
    { label: 'Groceries & Pantry', value: 'groceries' },
    { label: 'Household Essentials', value: 'household' },
  ];

  const sortOptions = [
    { label: 'Shortest Distance', value: 'shortest_distance' },
    { label: 'Lowest Price', value: 'lowest_price' },
    { label: 'Highest Rated', value: 'highest_rated' },
    { label: 'Fresh Restock Today', value: 'newest_restock' },
  ];

  const distanceOptions = [
    { label: 'Within 1 km', value: 1 },
    { label: 'Within 3 km', value: 3 },
    { label: 'Within 5 km', value: 5 },
    { label: 'Any Distance', value: 10 },
  ];

  const pricePresets = [
    { label: 'Under KES 200', value: 200 },
    { label: 'Under KES 500', value: 500 },
    { label: 'Under KES 1,000', value: 1000 },
    { label: 'Under KES 3,000', value: 3000 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end font-sans">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" 
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
            className="relative w-full md:w-[440px] h-[88vh] md:h-full bg-white text-slate-800 shadow-2xl flex flex-col z-10 rounded-t-3xl md:rounded-t-none md:rounded-sm border-t md:border-t-0 md:border-l border-slate-200/80 overflow-hidden"
          >
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
                  <SlidersHorizontal size={16} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-slate-900 leading-none">
                    Filter & Sort
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Neighborhood Merchant Offerings
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => setFilters(getDefaultFilters())} 
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
                >
                  <RotateCcw size={12} /> Reset
                </button>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  title="Close panel"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

              {/* Sort Preferences */}
              <Section title="Sort By" icon={Tag}>
                <PillSelect
                  options={sortOptions}
                  value={filters.sortBy}
                  onChange={(val) => update('sortBy', val)}
                />
              </Section>

              {/* Neighborhood Category Filter */}
              <Section title="Merchant Category" icon={Store}>
                <PillSelect
                  options={categories}
                  value={filters.category}
                  onChange={(val) => update('category', val)}
                />
              </Section>

              {/* Delivery Radius */}
              <Section title="Neighborhood Distance" icon={MapPin}>
                <PillSelect
                  options={distanceOptions}
                  value={filters.maxDistanceKm}
                  onChange={(val) => update('maxDistanceKm', val)}
                />
              </Section>

              {/* Maximum Price / Budget */}
              <Section title="Maximum Budget (KES)" icon={DollarSign}>
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Up to KES {Number(filters.maxPrice).toLocaleString()}</span>
                    <span className="text-slate-400 font-normal">Max Ceiling</span>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={filters.maxPrice}
                    onChange={(e) => update('maxPrice', Number(e.target.value))}
                    className="w-full accent-[#3C3147] cursor-pointer"
                  />

                  <PillSelect
                    options={pricePresets}
                    value={filters.maxPrice}
                    onChange={(val) => update('maxPrice', val)}
                  />
                </div>
              </Section>

              {/* Merchant Quality Toggles */}
              <Section title="Soko AI Verification & Delivery" icon={ShieldCheck}>
                <div className="space-y-2.5">
                  <ToggleButton 
                    label="Verified Fresh Today" 
                    subLabel="Only show stock restocked by merchants this morning" 
                    icon={Sparkles} 
                    isActive={filters.verifiedFreshToday} 
                    onToggle={() => update('verifiedFreshToday', !filters.verifiedFreshToday)}
                  />
                  <ToggleButton 
                    label="Instant Runner Ready" 
                    subLabel="Prioritize items available for dispatch under 15 minutes" 
                    icon={Clock} 
                    isActive={filters.instantRunnerReady} 
                    onToggle={() => update('instantRunnerReady', !filters.instantRunnerReady)}
                  />
                  <ToggleButton 
                    label="Direct Price Guarantee" 
                    subLabel="Items priced directly by local vendors with zero markup" 
                    icon={Award} 
                    isActive={filters.directMerchantPricing} 
                    onToggle={() => update('directMerchantPricing', !filters.directMerchantPricing)}
                  />
                </div>
              </Section>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 bg-white/90 backdrop-blur-md shrink-0">
              <button 
                type="button"
                onClick={() => { onApply(filters); onClose(); }}
                className="w-full bg-[#3C3147] hover:bg-[#2C2434] active:scale-[0.99] text-white font-medium py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Check size={16} strokeWidth={2.5} />
                <span>Apply Filters</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
