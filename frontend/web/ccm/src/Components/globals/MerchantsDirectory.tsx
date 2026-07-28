


import React, { useMemo, useState } from 'react';
import {
  Search,
  Grid,
  List,
  Store,
  MapPin,
  BadgeCheck,
  Star,
  SlidersHorizontal,
  X,
  Check,
  ArrowUpRight,
  ShieldCheck,
  MessageSquare,
  Package,
  ExternalLink,
  Clock,
  Truck,
  Phone,
  Bookmark,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SAMPLE_SHOPS = [
  {
    id: 's-101',
    name: 'Nairobi Tech Hub',
    tagline: 'Premium audio gear and flagship smart electronics.',
    rating: 4.9,
    reviewsCount: 342,
    category: 'Audio & Gadgets',
    location: 'Nairobi CBD',
    building: 'Kimathi House, 3rd Floor',
    verified: true,
    activeProductsCount: 48,
    joinedYear: 2022,
    responseTime: '< 15 mins',
    fulfillment: 'Same-day Delivery',
    phone: '+254 712 345 678',
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
    topCategories: ['Headphones', 'Speakers', 'DACs'],
    featuredProducts: [
      { name: 'Sony WH-1000XM5', price: 42000 },
      { name: 'Sennheiser HD 600', price: 38500 },
    ],
  },
  {
    id: 's-102',
    name: 'Digital Express Kenya',
    tagline: 'Authorized desktop peripherals and workstation gear.',
    rating: 4.8,
    reviewsCount: 215,
    category: 'Computer Peripherals',
    location: 'Juja Hub',
    building: 'Gate A Commercial Centre',
    verified: true,
    activeProductsCount: 112,
    joinedYear: 2023,
    responseTime: '< 30 mins',
    fulfillment: 'Pickup & Rider Express',
    phone: '+254 723 987 654',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
    topCategories: ['Mice', 'Monitors', 'Docking Stations'],
    featuredProducts: [
      { name: 'Logitech MX Master 3S', price: 13500 },
      { name: 'Dell UltraSharp 27"', price: 68000 },
    ],
  },
  {
    id: 's-103',
    name: 'Keyset Studio',
    tagline: 'Boutique mechanical keyboards, switches, and keycaps.',
    rating: 4.7,
    reviewsCount: 89,
    category: 'Mechanical Keyboards',
    location: 'Westlands',
    building: 'Sarit Centre Arcade',
    verified: false,
    activeProductsCount: 24,
    joinedYear: 2024,
    responseTime: '< 1 hour',
    fulfillment: 'Standard Courier',
    phone: '+254 701 112 233',
    logo: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    topCategories: ['Custom Decks', 'Lubed Switches', 'Keycaps'],
    featuredProducts: [{ name: 'Keychron K2 V2', price: 11200 }],
  },
  {
    id: 's-104',
    name: 'Visions Kenya',
    tagline: 'Pro display monitors, color grading setups, and accessories.',
    rating: 4.9,
    reviewsCount: 156,
    category: 'Displays & Studio',
    location: 'Kilimani',
    building: 'Yaya Centre Office Wing',
    verified: true,
    activeProductsCount: 34,
    joinedYear: 2021,
    responseTime: '< 10 mins',
    fulfillment: 'Same-day Delivery',
    phone: '+254 733 445 566',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    topCategories: ['4K Monitors', 'Color Calibrators', 'Arms'],
    featuredProducts: [{ name: 'Dell UltraSharp 27" 4K', price: 68000 }],
  },
];

const LOCATIONS = ['All Locations', 'Nairobi CBD', 'Westlands', 'Juja Hub', 'Kilimani'];
const CATEGORIES = [
  'All Categories',
  'Audio & Gadgets',
  'Computer Peripherals',
  'Mechanical Keyboards',
  'Displays & Studio',
];

export function Merchants({ onSelectShop, onContactMerchant }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<typeof SAMPLE_SHOPS[0] | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [savedShops, setSavedShops] = useState<string[]>([]);

  const filteredShops = useMemo(() => {
    return SAMPLE_SHOPS.filter((shop) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        shop.name.toLowerCase().includes(q) ||
        shop.tagline.toLowerCase().includes(q) ||
        shop.category.toLowerCase().includes(q) ||
        shop.location.toLowerCase().includes(q);

      const matchesLocation =
        selectedLocation === 'All Locations' || shop.location === selectedLocation;
      const matchesCategory =
        selectedCategory === 'All Categories' || shop.category === selectedCategory;
      const matchesVerified = !onlyVerified || shop.verified;

      return matchesSearch && matchesLocation && matchesCategory && matchesVerified;
    });
  }, [searchQuery, selectedLocation, selectedCategory, onlyVerified]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedShops((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen w-full bg-[#0c0d0e] text-neutral-200 font-sans antialiased selection:bg-neutral-800 selection:text-neutral-100 border-t border-neutral-800/40">
      
      {/* --------------------------------------------------------------------- */}
      {/* HEADER: Sharp Minimal Omnibar Header                                  */}
      {/* --------------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 bg-[#0c0d0e]/90 backdrop-blur-md border-b border-neutral-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Brand Title & Mobile Drawer Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition lg:hidden"
                title="Toggle Filters"
              >
                <SlidersHorizontal size={16} />
              </button>

              <div className="flex items-center gap-2 cursor-pointer">
                <span className="font-mono text-xs font-semibold tracking-wider text-neutral-100 uppercase px-2 py-1 rounded border border-neutral-800 bg-neutral-900">
                  SHOPS<span className="text-teal-400">/</span>DIRECTORY
                </span>
              </div>
            </div>

            {/* Perplexity-style Omnibar */}
            <div className="relative hidden max-w-lg flex-1 md:block">
              <div className="relative flex items-center">
                <Search size={15} className="absolute left-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Find merchants, buildings, locations, or specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800/80 bg-neutral-900/40 py-2 pl-9 pr-16 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none transition focus:border-neutral-700 focus:bg-neutral-900/80 focus:ring-1 focus:ring-neutral-700"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-[10px] font-mono uppercase text-neutral-500 hover:text-neutral-300"
                  >
                    Clear
                  </button>
                ) : (
                  <span className="absolute right-3 text-[10px] font-mono text-neutral-600 border border-neutral-800 px-1.5 py-0.5 rounded">
                    /
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-neutral-400 border border-neutral-800 bg-neutral-900/40 px-3 py-1.5 rounded-lg">
                <Store size={14} className="text-teal-400" />
                <span>{SAMPLE_SHOPS.length} Active Stores</span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                        */}
      {/* --------------------------------------------------------------------- */}
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------------- */}
        {/* SIDEBAR FILTERS                                                     */}
        {/* ------------------------------------------------------------------- */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-800/80 bg-[#0c0d0e] p-5 transition-transform duration-200 lg:static lg:z-auto lg:w-56 lg:translate-x-0 lg:border-none lg:bg-transparent lg:p-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col justify-between text-xs space-y-6">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 lg:hidden">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Filter size={13} /> Filters
                </span>
                <button onClick={() => setSidebarOpen(false)} className="text-neutral-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Location Hub Filter */}
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                  Market Location
                </div>
                <div className="space-y-0.5">
                  {LOCATIONS.map((loc) => {
                    const active = selectedLocation === loc;
                    return (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocation(loc)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md transition flex items-center justify-between ${
                          active
                            ? 'bg-neutral-800/80 text-neutral-100 font-medium'
                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <MapPin size={12} className={active ? 'text-teal-400' : 'text-neutral-600'} />
                          {loc}
                        </span>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specialty Category */}
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                  Merchant Specialty
                </div>
                <div className="space-y-0.5">
                  {CATEGORIES.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md transition flex items-center justify-between ${
                          active
                            ? 'bg-neutral-800/80 text-neutral-100 font-medium'
                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                        }`}
                      >
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verification Toggle */}
              <div className="pt-3 border-t border-neutral-800/60">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-neutral-400 text-xs flex items-center gap-1.5">
                    <BadgeCheck size={14} className="text-teal-400" />
                    Verified Vendors
                  </span>
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="rounded border-neutral-800 bg-neutral-900 text-teal-400 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>

            </div>

            {/* Footer Trust Note */}
            <div className="pt-4 border-t border-neutral-800/60 text-[11px] text-neutral-500 leading-relaxed font-mono">
              [VETTING] All verified merchants complete physical location verification and trade license checks.
            </div>
          </div>
        </aside>

        {/* ------------------------------------------------------------------- */}
        {/* SHOPS LISTING AREA                                                  */}
        {/* ------------------------------------------------------------------- */}
        <main className="flex-1 space-y-4">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800/60">
            <div className="font-mono text-neutral-400">
              Found <span className="text-neutral-100 font-semibold">{filteredShops.length}</span> merchants
            </div>

            <div className="flex items-center gap-1 bg-neutral-900/80 p-0.5 rounded border border-neutral-800/80">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded transition ${
                  viewMode === 'grid' ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="Grid view"
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded transition ${
                  viewMode === 'list' ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="List view"
              >
                <List size={14} />
              </button>
            </div>
          </div>

          {/* Empty State */}
          {filteredShops.length === 0 && (
            <div className="py-20 text-center border border-dashed border-neutral-800 rounded-xl">
              <p className="text-xs text-neutral-400 font-mono">No merchants found matching parameters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('All Locations');
                  setSelectedCategory('All Categories');
                  setOnlyVerified(false);
                }}
                className="mt-3 text-xs text-teal-400 hover:underline font-mono"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Grid Layout */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2"
              >
                {filteredShops.map((shop) => {
                  const isSaved = savedShops.includes(shop.id);

                  return (
                    <div
                      key={shop.id}
                      onClick={() => {
                        setSelectedShop(shop);
                        onSelectShop?.(shop);
                      }}
                      className="group relative flex flex-col justify-between rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-4 hover:border-neutral-700/80 hover:bg-neutral-900/70 transition-all cursor-pointer"
                    >
                      <div>
                        {/* Header Banner & Logo */}
                        <div className="relative h-24 w-full overflow-hidden rounded-lg bg-neutral-950 border border-neutral-800/60 mb-3">
                          <img
                            src={shop.coverImage}
                            alt={shop.name}
                            className="h-full w-full object-cover opacity-60 transition-transform duration-300 group-hover:scale-102"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                          {/* Location Badge */}
                          <div className="absolute top-2 left-2 flex gap-1">
                            <span className="font-mono text-[10px] text-neutral-300 bg-neutral-950/80 border border-neutral-800 px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                              <MapPin size={10} className="text-teal-400" />
                              {shop.location}
                            </span>
                          </div>

                          {/* Bookmark */}
                          <button
                            onClick={(e) => toggleBookmark(shop.id, e)}
                            className="absolute top-2 right-2 p-1.5 rounded bg-neutral-950/80 border border-neutral-800 text-neutral-400 hover:text-rose-400 transition"
                          >
                            <Bookmark size={13} className={isSaved ? 'fill-rose-500 text-rose-500' : ''} />
                          </button>

                          {/* Logo Avatar */}
                          <div className="absolute -bottom-2 left-3 h-10 w-10 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 p-0.5 shadow-md">
                            <img src={shop.logo} alt={shop.name} className="h-full w-full object-cover rounded" />
                          </div>
                        </div>

                        {/* Store Info */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-teal-400 transition-colors">
                                {shop.name}
                              </h3>
                              {shop.verified && <BadgeCheck size={14} className="text-teal-400 shrink-0" />}
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                              <Star size={11} className="fill-amber-400" /> {shop.rating}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                            {shop.tagline}
                          </p>
                        </div>

                        {/* Top Category Tags */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {shop.topCategories.map((cat) => (
                            <span
                              key={cat}
                              className="font-mono text-[10px] text-neutral-500 bg-neutral-950 border border-neutral-800 px-1.5 py-0.5 rounded"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-1 text-neutral-400">
                          <Package size={13} className="text-neutral-500" />
                          <span>{shop.activeProductsCount} Items</span>
                        </div>

                        <div className="flex items-center gap-1 text-teal-400 group-hover:translate-x-0.5 transition-transform">
                          <span>Explore Store</span>
                          <ChevronRight size={13} />
                        </div>
                      </div>

                    </div>
                  );
                })}
              </motion.div>
            ) : (
              /* List Mode */
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {filteredShops.map((shop) => {
                  return (
                    <div
                      key={shop.id}
                      onClick={() => {
                        setSelectedShop(shop);
                        onSelectShop?.(shop);
                      }}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-3 hover:border-neutral-700/80 hover:bg-neutral-900/60 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={shop.logo}
                          alt={shop.name}
                          className="h-12 w-12 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-medium text-neutral-100 group-hover:text-teal-400 transition truncate">
                              {shop.name}
                            </h4>
                            {shop.verified && <BadgeCheck size={13} className="text-teal-400 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5">{shop.tagline}</p>
                          <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin size={10} className="text-teal-400" /> {shop.location}
                            </span>
                            <span>•</span>
                            <span>{shop.activeProductsCount} active listings</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-none border-neutral-800/60 pt-2 sm:pt-0">
                        <span className="flex items-center gap-1 font-mono text-xs text-amber-400">
                          <Star size={12} className="fill-amber-400" /> {shop.rating} ({shop.reviewsCount})
                        </span>

                        <button className="flex items-center gap-1 rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-mono text-neutral-300 hover:text-white hover:border-neutral-700 transition">
                          Storefront <ArrowUpRight size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* SHOP DETAIL MODAL                                                     */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedShop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedShop(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-xl overflow-hidden rounded-xl border border-neutral-800 bg-[#0c0d0e] p-5 shadow-2xl z-10"
            >
              <button
                onClick={() => setSelectedShop(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-200 z-10"
              >
                <X size={16} />
              </button>

              <div className="space-y-4">
                {/* Modal Header */}
                <div className="relative h-28 -mx-5 -mt-5 bg-neutral-950 border-b border-neutral-800/80 overflow-hidden">
                  <img
                    src={selectedShop.coverImage}
                    alt={selectedShop.name}
                    className="h-full w-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0e] via-transparent to-transparent" />
                </div>

                <div className="flex items-start gap-3 -mt-8 relative z-10">
                  <img
                    src={selectedShop.logo}
                    alt={selectedShop.name}
                    className="h-14 w-14 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shadow-xl"
                  />
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-semibold text-neutral-100">{selectedShop.name}</h3>
                      {selectedShop.verified && <BadgeCheck size={16} className="text-teal-400" />}
                    </div>
                    <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 mt-0.5">
                      <span>{selectedShop.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star size={11} className="fill-amber-400" /> {selectedShop.rating} ({selectedShop.reviewsCount} ratings)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">{selectedShop.tagline}</p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 border-y border-neutral-800/80 text-neutral-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-teal-400 shrink-0" />
                    <span className="truncate">{selectedShop.building}, {selectedShop.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={13} className="text-teal-400 shrink-0" />
                    <span>{selectedShop.fulfillment}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-teal-400 shrink-0" />
                    <span>Avg response: {selectedShop.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} className="text-teal-400 shrink-0" />
                    <span>Member since {selectedShop.joinedYear}</span>
                  </div>
                </div>

                {/* Featured Products Snippet */}
                {selectedShop.featuredProducts?.length > 0 && (
                  <div>
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                      Featured Stock Preview
                    </div>
                    <div className="space-y-1.5">
                      {selectedShop.featuredProducts.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded bg-neutral-900/60 border border-neutral-800/60 px-3 py-2 text-xs font-mono"
                        >
                          <span className="text-neutral-200">{p.name}</span>
                          <span className="text-neutral-400">KES {p.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onContactMerchant?.(selectedShop)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-mono text-neutral-200 hover:bg-neutral-800 transition"
                  >
                    <MessageSquare size={14} /> Direct Inquiry
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded border border-teal-500/30 bg-teal-500/10 py-2.5 text-xs font-mono text-teal-400 hover:bg-teal-500/20 transition">
                    Visit Full Storefront <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
