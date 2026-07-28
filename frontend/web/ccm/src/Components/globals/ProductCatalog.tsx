import React, { useMemo, useState } from 'react';
import {
  Search,
  Grid,
  List,
  Sparkles,
  ShoppingBag,
  Heart,
  Star,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  X,
  Check,
  Eye,
  Plus,
  Minus,
  ArrowRight,
  BadgeCheck,
  Sliders,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SAMPLE_PRODUCTS = [
  {
    id: 'p-101',
    name: 'Sony WH-1000XM5 Noise-Canceling Headphones',
    price: 42000,
    rating: 4.9,
    reviewsCount: 128,
    category: 'Audio',
    brand: 'Sony',
    merchant: 'Nairobi Tech Hub',
    verified: true,
    location: 'Nairobi CBD',
    stock: 4,
    badge: 'Flagship',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description:
      'Industry-leading noise canceling with dual processors and 8 microphones for ultra-pure audio fidelity.',
  },
  {
    id: 'p-102',
    name: 'Logitech MX Master 3S Ergonomic Mouse',
    price: 13500,
    rating: 4.8,
    reviewsCount: 85,
    category: 'Peripherals',
    brand: 'Logitech',
    merchant: 'Digital Express',
    verified: true,
    location: 'Juja Hub',
    stock: 12,
    badge: 'Popular',
    image:
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    description:
      'Engineered tactile precision with 8,000 DPI track-on-glass sensor and 90% quieter switches.',
  },
  {
    id: 'p-103',
    name: 'Keychron K2 V2 Mechanical Keyboard',
    price: 11200,
    rating: 4.7,
    reviewsCount: 42,
    category: 'Peripherals',
    brand: 'Keychron',
    merchant: 'Keyset Studio',
    verified: false,
    location: 'Westlands',
    stock: 2,
    badge: 'Limited',
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    description:
      'Compact 75% mechanical deck with hot-swappable switches and dual Mac/Windows keycaps.',
  },
  {
    id: 'p-104',
    name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
    price: 68000,
    rating: 4.9,
    reviewsCount: 19,
    category: 'Displays',
    brand: 'Dell',
    merchant: 'Visions Kenya',
    verified: true,
    location: 'Kilimani',
    stock: 1,
    badge: 'Pro Tier',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    description:
      'Reference-grade 4K IPS panel with 2000:1 contrast, 98% DCI-P3 color depth, and 90W USB-C PD.',
  },
];

const BRANDS = ['All Brands', 'Sony', 'Logitech', 'Keychron', 'Dell'];
const CATEGORIES = ['All Products', 'Audio', 'Peripherals', 'Displays'];

export function ProductCatalog({ onSelectProduct, onPromptInquiry }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<typeof SAMPLE_PRODUCTS[0] | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [maxPrice, setMaxPrice] = useState(80000);
  const [onlyVerified, setOnlyVerified] = useState(false);

  const [cart, setCart] = useState<Array<typeof SAMPLE_PRODUCTS[0] & { qty: number }>>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.merchant.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'All Products' || item.category === selectedCategory;
      const matchesBrand =
        selectedBrand === 'All Brands' || item.brand === selectedBrand;
      const matchesPrice = item.price <= maxPrice;
      const matchesVerified = !onlyVerified || item.verified;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesVerified;
    });
  }, [searchQuery, selectedCategory, selectedBrand, maxPrice, onlyVerified]);

  const handleAddToCart = (product: typeof SAMPLE_PRODUCTS[0], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = item.qty + delta;
          return nextQty > 0 ? { ...item, qty: nextQty } : null;
        })
        .filter(Boolean) as Array<typeof SAMPLE_PRODUCTS[0] & { qty: number }>
    );
  };

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen w-full bg-[#0c0d0e] text-neutral-200 font-sans antialiased selection:bg-neutral-800 selection:text-neutral-100 border-t border-neutral-800/40">
      
      {/* --------------------------------------------------------------------- */}
      {/* HEADER: Sharp, Minimal Omnibar Header                                  */}
      {/* --------------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 bg-[#0c0d0e]/90 backdrop-blur-md border-b border-neutral-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Brand Logo & Mobile Toggle */}
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
                  SOKO<span className="text-teal-400">/</span>UX
                </span>
              </div>
            </div>

            {/* Perplexity-style Omnibar Input */}
            <div className="relative hidden max-w-lg flex-1 md:block">
              <div className="relative flex items-center">
                <Search size={15} className="absolute left-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Ask or search hardware, specs, or merchants..."
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

            {/* Top Bar Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onPromptInquiry?.('Show me audio gear under KES 50,000')}
                className="hidden items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/5 px-3 py-1.5 text-xs font-medium text-teal-400 hover:bg-teal-500/10 transition lg:flex"
              >
                <Sparkles size={13} />
                <span>AI Curator</span>
              </button>

              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-800/80 transition"
              >
                <ShoppingBag size={15} className="text-neutral-400" />
                <span className="hidden sm:inline">Bag</span>
                {cartCount > 0 && (
                  <span className="font-mono text-[10px] bg-teal-400 text-neutral-950 px-1.5 py-0.2 rounded font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                        */}
      {/* --------------------------------------------------------------------- */}
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Backdrop */}
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
        {/* SIDEBAR FILTERS: Crisp, Compact, Monochromatic                      */}
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
                  <Sliders size={13} /> Filters
                </span>
                <button onClick={() => setSidebarOpen(false)} className="text-neutral-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Category Options */}
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                  Category
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
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Options */}
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                  Brand
                </div>
                <div className="space-y-0.5">
                  {BRANDS.map((brand) => {
                    const active = selectedBrand === brand;
                    return (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md transition flex items-center justify-between ${
                          active
                            ? 'bg-neutral-800/80 text-neutral-100 font-medium'
                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                        }`}
                      >
                        <span>{brand}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Ceiling */}
              <div className="pt-3 border-t border-neutral-800/60">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                    Max Price
                  </span>
                  <span className="font-mono text-xs text-neutral-300">
                    KES {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="80000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-teal-400 bg-neutral-800 h-1 rounded cursor-pointer"
                />
              </div>

              {/* Verified Switch */}
              <div className="pt-3 border-t border-neutral-800/60">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-neutral-400 text-xs flex items-center gap-1.5">
                    <BadgeCheck size={14} className="text-teal-400" />
                    Verified only
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

            {/* Quiet Footer Note */}
            <div className="pt-4 border-t border-neutral-800/60 text-[11px] text-neutral-500 leading-relaxed font-mono">
              [INFO] Verified partners fulfill orders with direct delivery guarantee.
            </div>
          </div>
        </aside>

        {/* ------------------------------------------------------------------- */}
        {/* MAIN PRODUCT CATALOG                                                */}
        {/* ------------------------------------------------------------------- */}
        <main className="flex-1 space-y-4">
          
          {/* Top Bar Status */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800/60">
            <div className="font-mono text-neutral-400">
              Showing <span className="text-neutral-100 font-semibold">{filteredProducts.length}</span> items
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

          {/* Empty Search Result */}
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center border border-dashed border-neutral-800 rounded-xl">
              <p className="text-xs text-neutral-400 font-mono">No listings matched your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Products');
                  setSelectedBrand('All Brands');
                  setMaxPrice(80000);
                  setOnlyVerified(false);
                }}
                className="mt-3 text-xs text-teal-400 hover:underline font-mono"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Grid View Mode */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredProducts.map((product) => {
                  const isSaved = wishlist.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct?.(product)}
                      className="group relative flex flex-col justify-between rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-3.5 hover:border-neutral-700/80 hover:bg-neutral-900/70 transition-all cursor-pointer"
                    >
                      <div>
                        {/* Image Frame */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-950 border border-neutral-800/60 mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-2 left-2 flex gap-1">
                            {product.badge && (
                              <span className="font-mono text-[10px] tracking-tight text-neutral-300 bg-neutral-900/90 border border-neutral-700/60 px-2 py-0.5 rounded">
                                {product.badge}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => toggleWishlist(product.id, e)}
                            className="absolute top-2 right-2 p-1.5 rounded bg-neutral-950/80 border border-neutral-800 text-neutral-400 hover:text-rose-400 transition"
                          >
                            <Heart size={13} className={isSaved ? 'fill-rose-500 text-rose-500' : ''} />
                          </button>
                        </div>

                        {/* Text Metadata */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-1">
                          <span>{product.brand}</span>
                          <span className="flex items-center gap-1 text-amber-400/90">
                            <Star size={11} className="fill-amber-400/90" /> {product.rating}
                          </span>
                        </div>

                        <h3 className="text-xs font-medium text-neutral-100 group-hover:text-teal-400 transition-colors line-clamp-2 leading-snug">
                          {product.name}
                        </h3>

                        <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-400">
                          <span className="truncate">{product.merchant}</span>
                          {product.verified && <BadgeCheck size={13} className="text-teal-400 shrink-0" />}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-mono text-neutral-500 uppercase">Price</div>
                          <div className="text-xs font-mono font-semibold text-neutral-100">
                            KES {product.price.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="p-1.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-100 hover:border-neutral-700 transition"
                            title="Quick view"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="p-1.5 rounded border border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition"
                            title="Add to bag"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              /* List View Mode */
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {filteredProducts.map((product) => {
                  const isSaved = wishlist.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct?.(product)}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-3 hover:border-neutral-700/80 hover:bg-neutral-900/60 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                            <span className="text-teal-400">{product.brand}</span>
                            <span>•</span>
                            <span>{product.merchant}</span>
                          </div>
                          <h4 className="text-xs font-medium text-neutral-100 group-hover:text-teal-400 transition truncate">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-none border-neutral-800/60">
                        <div className="text-left sm:text-right font-mono">
                          <div className="text-xs font-semibold text-neutral-100">
                            KES {product.price.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-neutral-500">Stock: {product.stock}</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => toggleWishlist(product.id, e)}
                            className="p-1.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-rose-400 transition"
                          >
                            <Heart size={13} className={isSaved ? 'fill-rose-500 text-rose-500' : ''} />
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="flex items-center gap-1 rounded border border-teal-500/30 bg-teal-500/10 px-2.5 py-1.5 text-xs font-medium text-teal-400 hover:bg-teal-500/20 transition"
                          >
                            <Plus size={13} /> Add
                          </button>
                        </div>
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
      {/* QUICK VIEW MODAL: Minimalist Sharp Drawer Overlay                      */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-lg rounded-xl border border-neutral-800 bg-[#0c0d0e] p-5 shadow-2xl z-10"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-200"
              >
                <X size={16} />
              </button>

              <div className="space-y-4">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500">
                    <span>{quickViewProduct.brand}</span>
                    <span className="text-teal-400">{quickViewProduct.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-100 mt-1">
                    {quickViewProduct.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {quickViewProduct.description}
                  </p>
                </div>

                <div className="border-t border-neutral-800/80 pt-3 text-xs font-mono space-y-1.5 text-neutral-400">
                  <div className="flex justify-between">
                    <span>Merchant</span>
                    <span className="text-neutral-200">{quickViewProduct.merchant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location</span>
                    <span className="text-neutral-200">{quickViewProduct.location}</span>
                  </div>
                </div>

                <div className="border-t border-neutral-800/80 pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">Price</div>
                    <div className="text-sm font-mono font-bold text-neutral-100">
                      KES {quickViewProduct.price.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex items-center gap-1.5 rounded border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-xs font-medium text-teal-400 hover:bg-teal-500/20 transition"
                  >
                    <Plus size={14} /> Add to Bag
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* SHOPPING BAG DRAWER                                                   */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-screen max-w-sm border-l border-neutral-800 bg-[#0c0d0e] p-5 flex flex-col justify-between shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={16} className="text-teal-400" />
                      <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-200">
                        Selected Items ({cartCount})
                      </h2>
                    </div>
                    <button
                      onClick={() => setCartDrawerOpen(false)}
                      className="text-neutral-500 hover:text-neutral-200"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-20 text-center text-xs font-mono text-neutral-500">
                      Bag is empty.
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-lg border border-neutral-800/80 bg-neutral-900/40 p-2.5"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded object-cover bg-neutral-950 border border-neutral-800"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs text-neutral-200 truncate">{item.name}</h4>
                            <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                              KES {item.price.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <button
                                onClick={() => updateCartQty(item.id, -1)}
                                className="p-0.5 rounded text-neutral-500 hover:text-neutral-200"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-xs font-mono text-neutral-200">{item.qty}</span>
                              <button
                                onClick={() => updateCartQty(item.id, 1)}
                                className="p-0.5 rounded text-neutral-500 hover:text-neutral-200"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                          <div className="text-right font-mono text-xs font-semibold text-neutral-200">
                            KES {(item.price * item.qty).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-neutral-800/80 pt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-neutral-500">Total Amount</span>
                      <span className="text-sm font-bold text-neutral-100">
                        KES {cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <button className="w-full flex items-center justify-center gap-1.5 rounded border border-teal-500/40 bg-teal-500/15 py-2.5 text-xs font-mono text-teal-300 hover:bg-teal-500/25 transition">
                      Proceed to Checkout <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
