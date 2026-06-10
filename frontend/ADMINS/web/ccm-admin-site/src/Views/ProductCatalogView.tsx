

import  { useState } from 'react';
import { 
  Search, 
  RefreshCw, 
  Layers, 
  Globe, 
  ArrowUpRight, 
  Trash2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

// Strict model matching your soko_ai_backend Django Product architecture
interface ProductSKU {
  id: string;
  title: string;
  marketplace: string;
  category: string;
  brand: string;
  originalPrice: number;
  discountedPrice: number | null;
  currency: string;
  url: string;
  imageUrl: string;
  lastSynced: string;
  inStock: boolean;
}

export default function ProductCatalogView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Mock live database pipeline sync from Django models
  const [products, setProducts] = useState<ProductSKU[]>([
    {
      id: "SKU-JM-7741",
      title: "Air Max Alpha Trainer 5 - Black/White",
      marketplace: "Jumia Kenya",
      category: "Shoes / Gym Equipments",
      brand: "Nike",
      originalPrice: 8500,
      discountedPrice: 6200,
      currency: "KES",
      url: "#",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=60",
      lastSynced: "4 mins ago",
      inStock: true
    },
    {
      id: "SKU-KM-9012",
      title: "Ergonomic Dumbbell Set 20KG",
      marketplace: "Kilimall",
      category: "Gym Equipments",
      brand: "Generic",
      originalPrice: 4200,
      discountedPrice: null,
      currency: "KES",
      url: "#",
      imageUrl: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=120&auto=format&fit=crop&q=60",
      lastSynced: "18 mins ago",
      inStock: true
    },
    {
      id: "SKU-JM-3304",
      title: "Ultraboost Light Running Shoes",
      marketplace: "Jumia Uganda",
      category: "Shoes",
      brand: "Adidas",
      originalPrice: 240000,
      discountedPrice: 215000,
      currency: "UGX",
      url: "#",
      imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=120&auto=format&fit=crop&q=60",
      lastSynced: "In Progress",
      inStock: true
    },
    {
      id: "SKU-CP-1192",
      title: "Resistance Band Multi-Pack High Tension",
      marketplace: "Copia",
      category: "Gym Equipments",
      brand: "Kika",
      originalPrice: 1800,
      discountedPrice: 1450,
      currency: "KES",
      url: "#",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=120&auto=format&fit=crop&q=60",
      lastSynced: "2 hours ago",
      inStock: false
    }
  ]);

  const triggerDataRefresh = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const handleDeleteRecord = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMarketplace = selectedMarketplace === 'all' || product.marketplace === selectedMarketplace;
    return matchesSearch && matchesMarketplace;
  });

  return (
    <div className="space-y-6 animate-fadeIn p-0.5">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Product Catalog Management</h2>
          <p className="text-xs text-slate-400">
            Unified index of all normalized items mapped across regional e-commerce scrapers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={triggerDataRefresh}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Re-fetch Catalog Instances"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, item title, or brand..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-48">
            <Globe size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedMarketplace}
              onChange={(e) => setSelectedMarketplace(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:border-slate-300 focus:bg-white cursor-pointer transition-all"
            >
              <option value="all">All Marketplaces</option>
              <option value="Jumia Kenya">Jumia Kenya</option>
              <option value="Jumia Uganda">Jumia Uganda</option>
              <option value="Kilimall">Kilimall</option>
              <option value="Copia">Copia</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* PRODUCTS DIRECTORY TABLE CANVAS */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Product Attributes</th>
                <th className="py-3 px-4">Market Node</th>
                <th className="py-3 px-4">Classification Matrix</th>
                <th className="py-3 px-4">Calculated Cost</th>
                <th className="py-3 px-4">Telemetry Trace</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Column 1: Info & Image */}
                    <td className="py-3.5 px-4 max-w-xs md:max-w-sm">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title} 
                          className="h-10 w-10 object-cover rounded-lg bg-slate-100 border border-slate-200/60 shrink-0"
                          onError={(e) => {
                            // Fallback if unsplash links fluctuate
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=120';
                          }}
                        />
                        <div className="min-w-0 space-y-0.5">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-tight">{product.id}</span>
                          <p className="text-slate-800 text-xs font-medium truncate" title={product.title}>
                            {product.title}
                          </p>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-sm font-medium text-slate-500 inline-block">
                            Brand: {product.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Marketplace Platform */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Globe size={12} className="text-slate-400" />
                        <span>{product.marketplace}</span>
                      </div>
                    </td>

                    {/* Column 3: Taxonomy */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Layers size={12} className="text-slate-300" />
                        <span className="truncate max-w-[150px]" title={product.category}>
                          {product.category}
                        </span>
                      </div>
                    </td>

                    {/* Column 4: Cost Analysis */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        {product.discountedPrice ? (
                          <>
                            <p className="text-slate-900 font-medium">
                              {product.discountedPrice.toLocaleString()} <span className="text-[10px] text-slate-400">{product.currency}</span>
                            </p>
                            <p className="text-[10px] text-slate-400 line-through font-mono">
                              {product.originalPrice.toLocaleString()}
                            </p>
                          </>
                        ) : (
                          <p className="text-slate-900 font-medium">
                            {product.originalPrice.toLocaleString()} <span className="text-[10px] text-slate-400">{product.currency}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Column 5: Stock / Telemetry Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div>
                          {product.inStock ? (
                            <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-sm">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-[9px] bg-rose-50 border border-rose-100 text-rose-700 px-1.5 py-0.5 rounded-sm">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Synced {product.lastSynced}</p>
                      </div>
                    </td>

                    {/* Column 6: Relational Pipeline Controls */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-700 rounded-lg shadow-2xs hover:border-slate-300 transition-all inline-flex items-center"
                          title="View Original Extracted Source URL"
                        >
                          <ArrowUpRight size={12} />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteRecord(product.id)}
                          className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-lg shadow-2xs hover:border-rose-200 transition-all cursor-pointer inline-flex items-center"
                          title="Purge Record Instance"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle size={20} className="text-slate-300" />
                      <span>No matching parsed catalog entities found in this scope.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}