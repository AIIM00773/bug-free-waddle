import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
  Star,
  Plus,
  ArrowRight,
  Monitor,
  Headphones,
  Keyboard,
  LayoutGrid,
  List as ListIcon,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Store,
} from 'lucide-react';
import { useShoppingMode } from '../../Providers/ui/ShoppingModeManager';
import { motion, AnimatePresence } from 'framer-motion';

// Define mode icons for visual consistency when minimized
const MODE_ICONS: Record<MarketModesType, React.ElementType> = {
  'AI mode': Sparkles,
  'catalog': LayoutGrid,
  'shops': Store,
};

// ============================================================================
// STATIC DATA & TYPES
// ============================================================================

interface Product {
  id: string;
  name: string;
  price: string;
  brand: string;
  merchant: string;
  rating: number;
  tag: string;
  image: string;
  description: string;
}

const STATIC_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Sony WH-1000XM5 Noise-Canceling Headphones',
    price: '42,000',
    brand: 'Sony',
    merchant: 'Nairobi Tech Hub',
    rating: 4.9,
    tag: 'Flagship',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description:
      'Industry-leading noise canceling with dual processors and 8 microphones for ultra-pure audio fidelity.',
  },
  {
    id: 'p-2',
    name: 'Keychron K8 Pro Wireless Mechanical Keyboard',
    price: '15,500',
    brand: 'Keychron',
    merchant: 'TechSpace Ke',
    rating: 4.8,
    tag: 'Bestseller',
    image:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80',
    description:
      'QMK/VIA wireless mechanical keyboard with hot-swappable switches and aluminum frame.',
  },
  {
    id: 'p-3',
    name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
    price: '85,000',
    brand: 'Dell',
    merchant: 'Nairobi Tech Hub',
    rating: 4.9,
    tag: 'Flagship',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    description:
      'IPS Black technology with 2000:1 contrast ratio, 98% DCI-P3 color coverage, and 90W USB-C power delivery.',
  },
  {
    id: 'p-4',
    name: 'Logitech MX Master 3S Performance Mouse',
    price: '14,000',
    brand: 'Logitech',
    merchant: 'TechSpace Ke',
    rating: 4.9,
    tag: 'Bestseller',
    image:
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    description:
      'Ergonomic wireless mouse featuring an 8000 DPI optical sensor, quiet clicks, and MagSpeed electromagnetic scrolling.',
  },
  {
    id: 'p-5',
    name: 'Apple AirPods Pro (2nd Generation, USB-C)',
    price: '34,500',
    brand: 'Apple',
    merchant: 'iStore Westlands',
    rating: 4.8,
    tag: 'Popular',
    image:
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    description:
      'Powered by the H2 chip for up to 2x more Active Noise Cancellation and Adaptive Audio that intelligently controls noise.',
  },
  {
    id: 'p-6',
    name: 'LG UltraGear 34" Curved WQHD 160Hz Gaming Monitor',
    price: '110,000',
    brand: 'LG',
    merchant: 'Gamers Haven KE',
    rating: 4.7,
    tag: 'Ultrawide',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    description:
      '34-inch 21:9 curved display with AMD FreeSync Premium, 1ms MBR, and HDR10 support for immersive gaming.',
  },
  {
    id: 'p-7',
    name: 'Shure SM7B Vocal Dynamic Microphone',
    price: '62,000',
    brand: 'Shure',
    merchant: 'AudioPro East Africa',
    rating: 4.9,
    tag: 'Pro Audio',
    image:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    description:
      'Studio-grade dynamic microphone featuring a smooth, flat, wide-range frequency response for vocals and podcasting.',
  },
  {
    id: 'p-8',
    name: 'NuPhy Air75 V2 Low-Profile Mechanical Keyboard',
    price: '18,500',
    brand: 'NuPhy',
    merchant: 'TechSpace Ke',
    rating: 4.8,
    tag: 'New',
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    description:
      'Ultra-thin wireless mechanical keyboard featuring 1000Hz polling rate, QMK/VIA compatibility, and PBT keycaps.',
  },
  {
    id: 'p-9',
    name: 'Sennheiser MOMENTUM 4 Wireless Headphones',
    price: '46,000',
    brand: 'Sennheiser',
    merchant: 'AudioPro East Africa',
    rating: 4.7,
    tag: 'Audiophile',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    description:
      'Audiophile-inspired acoustics signature sound with an exceptional 60-hour battery life and adaptive noise cancellation.',
  },
  {
    id: 'p-10',
    name: 'BenQ ScreenBar Halo LED Monitor Light',
    price: '24,000',
    brand: 'BenQ',
    merchant: 'Nairobi Tech Hub',
    rating: 4.8,
    tag: 'Accessory',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    description:
      'Asymmetrical optical design with front and back illumination to eliminate screen glare and reduce eye strain.',
  },
  {
    id: 'p-11',
    name: 'CalDigit TS4 Thunderbolt 4 Dock',
    price: '58,000',
    brand: 'CalDigit',
    merchant: 'iStore Westlands',
    rating: 4.9,
    tag: 'Power User',
    image:
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    description:
      '18 ports of connectivity including 98W host charging, 2.5GbE LAN, and dual 6K display support for macOS and PC.',
  },
  {
    id: 'p-12',
    name: 'ASUS ProArt Display PA279CV 27" 4K Monitor',
    price: '76,000',
    brand: 'ASUS',
    merchant: 'Gamers Haven KE',
    rating: 4.7,
    tag: 'Creator',
    image:
      'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&auto=format&fit=crop&q=80',
    description:
      'Calman Verified 4K UHD IPS display featuring 100% sRGB, Delta E < 2 color accuracy, and USB-C connectivity.',
  },
];

const CATEGORIES = [
  { name: 'All Products', icon: LayoutGrid, active: true },
  { name: 'Audio', icon: Headphones, active: false },
  { name: 'Displays', icon: Monitor, active: false },
  { name: 'Peripherals', icon: Keyboard, active: false },
];

// ============================================================================
// UI COMPONENTS (Minimal & Stateless)
// ============================================================================

interface HeaderProps {
  onToggleSidebar: () => void;
  currentMode: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, currentMode }) => (
  <header className="sticky top-0 z-30 bg-[#3d3942] backdrop-blur-xl border-b border-white/[0.06]">
    <div className="flex h-14 items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-neutral-400 hover:text-neutral-100 lg:hidden transition-colors"
          aria-label="Toggle Sidebar"
        >
          <SlidersHorizontal size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-emerald-500/20 border border-emerald-500/40 rounded-sm flex items-center justify-center">
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
          </div>
          <span className="font-mono text-xs font-medium tracking-wider text-neutral-200 uppercase">
            {currentMode}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-all">
          <ShoppingBag size={14} />
          <span>Bag [1]</span>
        </button>
      </div>
    </div>
  </header>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  setShoppingMode: (mode: MarketModesType) => void;
  activeMode: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  setShoppingMode,
  activeMode,
}) => {
  // State for Desktop Minimize/Expand
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 bg-[#3b3840] border-r border-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        isMinimized ? 'w-64 lg:w-20 p-4' : 'w-64 p-6'
      }`}
    >
      {/* Desktop Collapse Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="hidden lg:flex absolute -right-3 top-7 z-10 h-6 w-6 items-center justify-center rounded-full bg-[#3b3840] border border-white/[0.1] text-neutral-400 hover:text-white hover:border-white/[0.2] hover:scale-110 active:scale-95 transition-all duration-300 shadow-md"
        aria-label={isMinimized ? 'Expand Sidebar' : 'Minimize Sidebar'}
      >
        {isMinimized ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Mobile Header */}
      <div className="flex items-center justify-between lg:hidden mb-8">
        <span className="font-mono text-xs uppercase tracking-wider text-neutral-500">
          Navigation
        </span>
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="space-y-8">
        {/* MODES SECTION */}
        <div>
          <h3
            className={`font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3 transition-opacity duration-300 pl-2 ${
              isMinimized ? 'lg:opacity-0 lg:h-0 lg:mb-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            Shopping Modes
          </h3>
          <ul className="space-y-1.5">
            {(['AI mode', 'catalog', 'shops'] as MarketModesType[]).map((mode) => {
              const Icon = MODE_ICONS[mode] || LayoutGrid;
              const isActive = activeMode === mode;

              return (
                <li key={mode} className="relative group/tooltip">
                  <button
                    onClick={() => {
                      setShoppingMode(mode);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 capitalize ${
                      isMinimized ? 'lg:justify-center lg:px-0 px-1.5' : 'px-1.5'
                    } ${
                      isActive
                        ? 'bg-none text-emerald-400 font-semibold'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03] hover:translate-x-0.5 lg:hover:translate-x-0'
                    }`}
                  >
                    <Icon
                      size={16}
                      className={`shrink-0 transition-transform duration-300 ${
                        isActive ? 'text-emerald-400 scale-110' : 'text-neutral-400 group-hover/tooltip:text-neutral-200'
                      }`}
                    />
                    <span
                      className={`truncate transition-all duration-300 ${
                        isMinimized ? 'lg:hidden' : 'block'
                      }`}
                    >
                      {mode}
                    </span>
                  </button>

                  {/* Floating Tooltip for Minimized State */}
                  {isMinimized && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden lg:group-hover/tooltip:flex items-center px-2.5 py-1.5 rounded-lg bg-[#2a282e] border border-white/[0.08] text-xs font-medium text-neutral-200 whitespace-nowrap shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                      {mode}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* CATEGORIES SECTION */}
        <div>
          <h3
            className={`font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3 transition-opacity duration-300 ${
              isMinimized ? 'lg:opacity-0 lg:h-0 lg:mb-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            Categories
          </h3>
          <ul className="space-y-1.5">
            {CATEGORIES.map((cat) => (
              <li key={cat.name} className="relative group/tooltip">
                <button
                  className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-xs transition-all duration-300 ${
                    isMinimized ? 'lg:justify-center lg:px-0 px-3' : 'px-3'
                  } ${
                    cat.active
                      ? 'bg-none text-neutral-200 font-medium'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03] hover:translate-x-0.5 lg:hover:translate-x-0'
                  }`}
                >
                  <cat.icon
                    size={16}
                    className={`shrink-0 transition-transform duration-300 ${
                      cat.active ? 'text-neutral-200 scale-110' : 'text-neutral-400 group-hover/tooltip:text-neutral-200'
                    }`}
                  />
                  <span
                    className={`truncate transition-all duration-300 ${
                      isMinimized ? 'lg:hidden' : 'block'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>

                {/* Floating Tooltip for Minimized State */}
                {isMinimized && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden lg:group-hover/tooltip:flex items-center px-2.5 py-1.5 rounded-lg bg-[#2a282e] border border-white/[0.08] text-xs font-medium text-neutral-200 whitespace-nowrap shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                    {cat.name}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="group relative flex gap-5 p-4 bg-[#2c2a30] rounded-2xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.03] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] cursor-pointer">
        {/* Subtle hover glow backdrop */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Image Container */}
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-900/80 border border-white/[0.06] shadow-inner">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between py-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 mb-1.5 truncate">
              <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                {product.brand}
              </span>
              <span className="opacity-40">/</span>
              <span className="truncate">{product.merchant}</span>
            </div>
            <h3 className="text-sm font-medium text-neutral-200 group-hover:text-emerald-400 transition-colors duration-300 leading-snug truncate">
              {product.name}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              {product.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-mono text-neutral-200 font-medium group-hover:translate-x-0.5 transition-transform duration-500 ease-out">
              KES {product.price}
            </span>
            <button
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-neutral-400 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/30 active:scale-95 transition-all duration-300 shadow-sm"
              aria-label={`Add ${product.name} to Bag`}
              onClick={(e) => {
                e.stopPropagation();
                // Add to bag logic
              }}
            >
              <span>Add</span>
              <Plus size={12} className="transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group relative flex flex-col p-3.5 rounded-2xl border border-white/[0.03] bg-[#2c2a30] hover:border-white/[0.1] hover:bg-[#111111]/[0.8] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] cursor-pointer">
      {/* Top Ambient Glow on Hover */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/[0.06] blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

      {/* Image Container */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-900/80 border border-white/[0.06] mb-3 shadow-inner">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-1.5">
          <span className="truncate max-w-[70%] group-hover:text-neutral-300 transition-colors duration-300">
            {product.brand}
          </span>
          <span className="flex items-center gap-1 shrink-0 text-neutral-300 font-medium">
            <Star size={10} className="fill-emerald-500 text-emerald-500" />
            {product.rating}
          </span>
        </div>

        <h3 className="text-sm font-medium text-neutral-200 group-hover:text-emerald-400 transition-colors duration-300 leading-snug line-clamp-2 mb-3">
          {product.name}
        </h3>

        {/* Action Row */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.06] group-hover:border-white/[0.1] transition-colors duration-500">
          <span className="text-xs font-mono text-neutral-300 font-medium group-hover:translate-x-0.5 transition-transform duration-500 ease-out">
            KES {product.price}
          </span>
          <button
            className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-neutral-400 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] active:scale-90 transition-all duration-300"
            aria-label={`Add ${product.name} to Bag`}
            onClick={(e) => {
              e.stopPropagation();
              // Add to bag logic
            }}
          >
            <Plus size={14} className="transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN PAGE LAYOUT
// ============================================================================

export function ProductCatalog() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { ShoppingMode, setShoppingMode } = useShoppingMode();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-neutral-300 font-sans antialiased selection:bg-neutral-800 selection:text-neutral-100 flex flex-col">
      <Header
        onToggleSidebar={() => setSidebarOpen(true)}
        currentMode={ShoppingMode}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
            />
          )}
        </AnimatePresence>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          setShoppingMode={setShoppingMode}
          activeMode={ShoppingMode}
        />

        <main className="flex-1 overflow-y-auto bg-[#3b3840]">
          <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8">
            {/* Command / Search Input */}
            <div
              className={`relative group mb-8 transition-all ${
                searchBarOpen ? 'block' : 'hidden'
              }`}
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-500 group-focus-within:text-neutral-300 transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Ask anything or search products..."
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-full py-3.5 pl-11 pr-12 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-hidden focus:border-white/[0.2] focus:bg-white/[0.05] transition-all"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button
                  className="p-2 text-neutral-500 hover:text-neutral-200 rounded-full hover:bg-white/[0.06] transition-colors"
                  aria-label="Submit Search"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* View & Header Controls */}
            <div className="flex items-center justify-between mb-6 border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSearchBarOpen(!searchBarOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-4xl ml-1 text-xs font-mono transition-colors border ${
                    searchBarOpen
                      ? 'bg-white/[0.1] text-neutral-100 border-white/[0.15]'
                      : 'bg-white/[0.02] text-neutral-400 border-white/[0.06] hover:text-neutral-200 hover:bg-white/[0.04]'
                  }`}
                  aria-label="Toggle Search"
                >
                  {!searchBarOpen ? (
                    <>
                      <Search size={12} />
                      <span>Search</span>
                    </>
                  ) : (
                    <>
                      <X size={12} />
                      <span>Close Search</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-1 border border-white/[0.08] rounded-lg p-0.5 bg-white/[0.02]">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white/[0.1] text-neutral-100'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  aria-label="List View"
                >
                  <ListIcon size={14} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white/[0.1] text-neutral-100'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  aria-label="Grid View"
                >
                  <LayoutGrid size={14} />
                </button>
              </div>
            </div>

            {/* Feed / Empty State */}
            {STATIC_PRODUCTS.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 max-h-[72vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden'
                    : 'flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden'
                }
              >
                {STATIC_PRODUCTS.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/[0.06] rounded-2xl bg-white/[0.01]">
                <PackageOpen size={28} className="text-neutral-600 mb-3" />
                <p className="text-sm font-medium text-neutral-300">
                  No products found
                </p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  There are currently no products listed under this category or
                  filter.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
