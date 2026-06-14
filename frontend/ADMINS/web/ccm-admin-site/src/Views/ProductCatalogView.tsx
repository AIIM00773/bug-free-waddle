import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  Layers,
  Globe,
  ArrowUpRight,
  Trash2,
  AlertCircle,
  ChevronDown,
  Plus,
  X,
  PackagePlus
} from 'lucide-react';
import { useCatalog } from '../Providers.tsx/ProductCatalogContext';
import type { Product } from '../Providers.tsx/ProductCatalogContext';

export default function ProductCatalogView() {
  const {
    products,
    isLoading,
    error,
    searchByTitle,
    filterByCategory,
    addToCatalog,
    removeFromCatalog,
    getCatalog
  } = useCatalog();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form State Nodes
  const [newProduct, setNewProduct] = useState<Omit<Product, 'prevPrice'>>({
    title: '',
    sku: '',
    description: '',
    category: '',
    brand: '',
    merchant: '',
    marketplace: '',
    currentPrice: 0,
    currency: 'KES',
    inStock: true
  });

  // Handle live incremental text query matching
  useEffect(() => {
    searchByTitle(searchQuery);
  }, [searchQuery]);

  // Handle marketplace taxonomy filtering transitions 
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    filterByCategory(cat === 'all' ? null : cat);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.sku) return;

    await addToCatalog({
      ...newProduct,
      prevPrice: null
    });

    // Reset workflow allocations
    setNewProduct({
      title: '',
      sku: '',
      description: '',
      category: '',
      brand: '',
      merchant: '',
      marketplace: '',
      currentPrice: 0,
      currency: 'KES',
      inStock: true
    });
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-0.5 relative">

      {/* HEADER BLOCK SEPARATOR CONTAINER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Product Catalog Management</h2>
          <p className="text-xs text-slate-400">
            Unified index of all normalized items mapped across regional e-commerce scrapers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => getCatalog()}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
            title="Refresh Registry Engine Data"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS HUB */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by catalog title item index..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-48">
            <Globe size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:border-slate-300 focus:bg-white cursor-pointer transition-all"
            >
              <option value="all">All Classifications</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Data Engine">Data Engine</option>
              <option value="Gym Equipments">Gym Equipments</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ERROR CONTEXT INFRASTRUCTURE NODE MESSAGE */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-xs font-medium text-rose-700">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* MATRIX ENTRIES MAIN CANVAS CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Product Attributes</th>
                <th className="py-3 px-4">Merchant Node</th>
                <th className="py-3 px-4">Classification Matrix</th>
                <th className="py-3 px-4">Calculated Cost</th>
                <th className="py-3 px-4">Telemetry Trace</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.sku} className="hover:bg-slate-50/40 transition-colors">

                    {/* Primary Identifier Mapping Node Block */}
                    <td className="py-3.5 px-4 max-w-xs md:max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 object-cover rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 font-mono text-[9px]">
                          CORE
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-tight">{product.sku}</span>
                          <p className="text-slate-800 text-xs font-semibold truncate" title={product.title}>
                            {product.title}
                          </p>
                          <span className="text-[10px] text-slate-400 block truncate font-normal">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Globe size={12} className="text-slate-400" />
                        <span>{product.merchant || "System Kernel"}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Layers size={12} className="text-slate-300" />
                        <span className="truncate max-w-[150px] font-medium">{product.category || "Unassigned"}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="text-slate-900 font-semibold">
                        {product.currentPrice.toLocaleString()}{' '}
                        <span className="text-[10px] text-slate-400 font-medium">{product.currency || 'USD'}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4延 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-semibold tracking-wide ${product.inStock
                            ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                            : 'bg-rose-50 border border-rose-100 text-rose-700'
                          }`}>
                          {product.inStock ? 'Active' : 'Depleted'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-700 rounded-lg shadow-xs hover:border-slate-300 transition-all inline-flex items-center cursor-pointer"
                        >
                          <ArrowUpRight size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCatalog(product.sku)}
                          className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-lg shadow-xs hover:border-rose-200 transition-all cursor-pointer inline-flex items-center"
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
                      <span>No active configuration entries indexed within this filtered scope.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDEOUT COMPOSITION MODAL WORKSPACE OVERLAY */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-end animate-fadeIn" onClick={() => setIsDrawerOpen(false)}>
          <div
            className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900">
                  <PackagePlus size={16} className="text-blue-600" />
                  <h3 className="text-sm font-semibold">Ingest Custom Node Item</h3>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium text-slate-700">
                <div className="space-y-1">
                  <label className="block text-slate-500">Product Title</label>
                  <input
                    type="text" required
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    placeholder="e.g., Core Compute Module Array"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-500">Hardware SKU Block</label>
                    <input
                      type="text" required
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      placeholder="SKU-BASE-01"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-500">Brand Module</label>
                    <input
                      type="text"
                      value={newProduct.brand || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      placeholder="Soko AI Core"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-500">Classification Category</label>
                    <input
                      type="text"
                      value={newProduct.category || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      placeholder="Infrastructure"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-500">Market Domain</label>
                    <input
                      type="text"
                      value={newProduct.merchant || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, merchant: e.target.value })}
                      placeholder="Alpha Region Hub"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-500">Price Points</label>
                    <input
                      type="number" required
                      value={newProduct.currentPrice || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, currentPrice: Number(e.target.value) })}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-500">Asset Currency</label>
                    <input
                      type="text"
                      value={newProduct.currency || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                      placeholder="KES"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500">System Functional Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter granular operational telemetry description block specs..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="inStockCheck"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                    className="h-4 w-4 accent-slate-950 rounded-sm cursor-pointer"
                  />
                  <label htmlFor="inStockCheck" className="text-slate-600 select-none cursor-pointer">
                    Item verified active inside pipeline tracking node scope.
                  </label>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-1/2 text-center p-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 text-center p-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Commit Block
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}