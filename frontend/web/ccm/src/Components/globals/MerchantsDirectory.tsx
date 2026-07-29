import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
  Star,
  ArrowRight,
  LayoutGrid,
  List as ListIcon,
  Store,
  Compass,
  Tag,
} from 'lucide-react';
import {useShoppingMode } from '../../Providers/ui/ShoppingModeManager';
import { motion, AnimatePresence } from 'framer-motion';
import {FloatingMerchantShop} from "./FloatingMerchnatShop"

// ============================================================================
// DUMMY STATIC DATA (Replace with actual data/props as needed)
// ============================================================================

interface Shop {
  id: string | number;
  name: string;
  category: string;
  country: string;
  county: string;
  subcounty: string;
  description: string;
  image: string;
  rating: number;
}

const SHOPS: Shop[] = [
  {
    id: 'shp-1',
    name: 'Nairobi Nexus Tech',
    category: 'Electronics',
    country: 'Kenya',
    county: 'Nairobi',
    subcounty: 'Westlands',
    description:
      'Authorized dealer for Apple, Samsung, and computing peripherals with same-day delivery across the CBD and Westlands.',
    image:
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
  },
  {
    id: 'shp-2',
    name: 'Urban Luxe Apparel',
    category: 'Fashion & Apparel',
    country: 'Kenya',
    county: 'Nairobi',
    subcounty: 'Kilimani',
    description:
      'Curated streetwear and luxury minimalist outerwear designed by emerging East African and international designers.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
  },
  {
    id: 'shp-3',
    name: 'Rift Valley Bean Roasters',
    category: 'Food & Beverage',
    country: 'Kenya',
    county: 'Nairobi',
    subcounty: 'Karen',
    description:
      'Artisanal coffee roastery sourcing single-origin AA beans directly from Nyeri and Kiambu smallholder cooperatives.',
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
  },
  {
    id: 'shp-4',
    name: 'Sanctuary Interior Labs',
    category: 'Home & Living',
    country: 'Kenya',
    county: 'Nairobi',
    subcounty: 'Lavington',
    description:
      'Handcrafted hardwood furniture, modern ceramics, and tailored architectural lighting fixtures for contemporary spaces.',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
  },
  {
    id: 'shp-5',
    name: 'Apex Audio & Soundworks',
    category: 'Electronics',
    country: 'Kenya',
    county: 'Nairobi',
    subcounty: 'Parklands',
    description:
      'High-fidelity studio monitors, acoustic room treatment, and premium audiophile headphones for producers and creators.',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
  },
  {
    id: 'shp-6',
    name: 'Savanna Organic Remedies',
    category: 'Beauty & Wellness',
    country: 'Kenya',
    county: 'Nairobi',
    subcounty: 'Langata',
    description:
      'Cold-pressed botanical oils, organic skincare formulations, and natural fragrances sustainably harvested across East Africa.',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
  },
  {
    id: 'shp-7',
    name: 'Velo-City Cycles & Gear',
    category: 'Sports & Outdoors',
    country: 'Kenya',
    county: 'Nairobi',
    subcounty: 'Upper Hill',
    description:
      'Premium gravel bikes, mountain cycling accessories, and performance apparel built for urban commutes and highland trails.',
    image:
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
  },
];










export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}


export interface ExtendedShop extends Shop {
  products: Product[];
  deliveryTime: string;
}

// Example extended shop data
const ACTIVE_MERCHANT: ExtendedShop = {
  id: 'shp-1',
  name: 'Nairobi Nexus Tech',
  category: 'Electronics',
  country: 'Kenya',
  county: 'Nairobi',
  subcounty: 'Westlands',
  description:
    'Authorized dealer for Apple, Samsung, and computing peripherals with same-day delivery across the CBD and Westlands.',
  image:
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
  rating: 4.8,
  deliveryTime: '30–45 mins',
  products: [
    {
      id: 'p-1',
      name: 'MacBook Air M3 (16GB/512GB)',
      price: 185000,
      category: 'Laptops',
      inStock: true,
      image:
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p-2',
      name: 'AirPods Pro (2nd Gen, USB-C)',
      price: 32500,
      category: 'Audio',
      inStock: true,
      image:
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p-3',
      name: 'Anker 737 Power Bank (24,000mAh)',
      price: 14500,
      category: 'Accessories',
      inStock: true,
      image:
        'https://images.unsplash.com/photo-1609592424201-7d52d0d5b4a9?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p-4',
      name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
      price: 78000,
      category: 'Monitors',
      inStock: false,
      image:
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
    },
  ],
};





const SHOP_CATEGORIES = [
  { name: 'All Categories', icon: Compass, active: true },
  { name: 'Electronics', icon: Tag, active: false },
  { name: 'Fashion & Apparel', icon: Tag, active: false },
];

// ============================================================================
// UI COMPONENTS (Stateless & Minimal)
// ============================================================================

interface HeaderProps {
  onToggleSidebar: () => void;
  currentMode: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, currentMode,bagCount }) => (
  <header className="sticky top-0 z-30 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]">
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
  <span>Bag [{bagCount }]</span>
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

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  setShoppingMode,
  activeMode,
}) => (
  <aside
    className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#09090b] border-r border-white/[0.06] p-6 transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
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
      <div>
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
          Modes
        </h3>
        <ul className="space-y-1">
          {(['AI mode', 'catalog', 'shops'] as MarketModesType[]).map((mode) => (
            <li key={mode}>
              <button
                onClick={() => {
                  setShoppingMode(mode);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                  activeMode === mode
                    ? 'bg-white/[0.08] text-emerald-400 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                }`}
              >
                {mode}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
          Categories
        </h3>
        <ul className="space-y-1">
          {SHOP_CATEGORIES.map((cat) => (
            <li key={cat.name}>
              <button
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs transition-all ${
                  cat.active
                    ? 'bg-white/[0.08] text-neutral-200'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                }`}
              >
                <cat.icon size={14} className="shrink-0" />
                <span className="truncate">{cat.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  </aside>
);

interface ShopCardProps {
  shop: Shop;
  viewMode: 'grid' | 'list';
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="group flex gap-5 p-4 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] transition-all cursor-pointer">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-white/[0.06]">
          <img
            src={shop.image}
            alt={shop.name}
            className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between py-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 mb-1.5 truncate">
              <span className="text-neutral-400">{shop.category}</span>
              <span>/</span>
              <span className="truncate">
                {shop.country} · {shop.county} · {shop.subcounty}
              </span>
            </div>
            <h3 className="text-sm font-medium text-neutral-200 group-hover:text-emerald-400 transition-colors leading-snug truncate">
              {shop.name}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
              {shop.description}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 mt-2">
            <Star size={12} className="fill-emerald-500 text-emerald-500" />
            <span>{shop.rating}</span>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group flex flex-col p-3 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] transition-all cursor-pointer">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-900 border border-white/[0.06] mb-3">
        <img
          src={shop.image}
          alt={shop.name}
          className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-1 px-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-1.5">
          <span className="truncate max-w-[70%]">{shop.category}</span>
          <span className="flex items-center gap-1 shrink-0 text-neutral-300">
            <Star size={10} className="fill-emerald-500 text-emerald-500" />
            {shop.rating}
          </span>
        </div>
        <h3 className="text-sm font-medium text-neutral-200 group-hover:text-emerald-400 transition-colors truncate">
          {shop.name}
        </h3>
        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
          {shop.description}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN PAGE LAYOUT
// ============================================================================

export function Merchants() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { ShoppingMode, setShoppingMode } = useShoppingMode();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const [selectedShop, setSelectedShop] = useState<ExtendedShop | null>(null);
  const [bagCount, setBagCount] = useState(0);
  const handleAddToCart = (product: Product) => {
    setBagCount((prev) => prev + 1);
  };


  
  return (
    <div className="min-h-screen w-full bg-[#09090b] text-neutral-300 font-sans antialiased selection:bg-neutral-800 selection:text-neutral-100 flex flex-col">

      {!selectedShop &&(
      <Header
        onToggleSidebar={() => setSidebarOpen(true)}
        currentMode={ShoppingMode} 
        bagCount ={bagCount}
      />
      )}

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

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
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
                placeholder="Ask anything or search merchants..."
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
                <h2 className="text-base font-medium text-neutral-100 tracking-tight">
                  Discover Merchants
                </h2>

                <button
                  onClick={() => setSearchBarOpen(!searchBarOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors border ${
                    searchBarOpen
                      ? 'bg-white/[0.1] text-neutral-100 border-white/[0.15]'
                      : 'bg-white/[0.02] text-neutral-400 border-white/[0.06] hover:text-neutral-200 hover:bg-white/[0.04]'
                  }`}
                  aria-label="Toggle Search"
                >
                  <Search size={12} />
                  <span>Search</span>
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
            {SHOPS.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden'
                    : 'flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden'
                }
              >
            {SHOPS.map((shop) => (
  <div 
    key={shop.id} 
    onClick={() => setSelectedShop(ACTIVE_MERCHANT)} // Pass clicked shop data
  >
    <ShopCard shop={shop} viewMode={viewMode} />
  </div>
))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/[0.06] rounded-2xl bg-white/[0.01]">
                <Store size={28} className="text-neutral-600 mb-3" />
                <p className="text-sm font-medium text-neutral-300">
                  No merchants found
                </p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  There are currently no shops listed under this category or
                  area.
                </p>
              </div>
            )}
          </div>
        </main>



      </div>

                <FloatingMerchantShop
        shop={selectedShop}
        isOpen={!!selectedShop}
        onClose={() => setSelectedShop(null)}
        onAddToCart={handleAddToCart}
      />
    </div>

  );
}
