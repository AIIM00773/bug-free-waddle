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
import { useDirectMerchants } from '../Providers.tsx/PartnerMerchantsContext';
import { useTaxonomyMatrices } from '../Providers.tsx/TaxonomyMatricesContext';

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

  // Integrated context matrices
  const { merchants } = useDirectMerchants();
  const { brands, categories } = useTaxonomyMatrices();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form State Nodes mapped exactly to your database structure
  const [newProduct, setNewProduct] = useState<Omit<Product, 'unique_id' | 'discount_percentage' | 'created_at'>>({
    title: '',
    sku: '',
    description: '',
    category: '', // Baseline string for smooth select dropdown tracking
    brand: '',    // Baseline string for smooth select dropdown tracking
    merchant: '',  // Tracks the target ForeignKey ID as a string state string
    original_price: 0,
    color:'',
    size:'',
    deal_price: 0,
    primary_image_url: 'https://images.sokoai.internal/placeholder.png',
    is_available: true
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
    if (!newProduct.title || !newProduct.sku || !newProduct.merchant) return;

    // Build processing block converting non-selected values cleanly into null targets
    const processedPayload = {
      ...newProduct,
      merchant: Number(newProduct.merchant),
      category: newProduct.category === '' ? null : newProduct.category,
      brand: newProduct.brand === '' ? null : newProduct.brand,
    };

    // Transmit sanitized operational block structure to context layer
    await addToCatalog(processedPayload);

    // Reset workflow allocations back to empty baseline states
    setNewProduct({
      title: '',
      sku: '',
      description: '',
      category: '',
      brand: '',
      merchant: '',
      original_price: 0,
      deal_price: 0,
      primary_image_url: 'https://images.sokoai.internal/placeholder.png',
      is_available: true,
      color:'',
      size:'',
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
              {categories?.map((cat: any) => (
                <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
              ))}
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
                  <tr key={product.unique_id} className="hover:bg-slate-50/40 transition-colors">

                    {/* Primary Identifier Mapping Node Block */}
                    <td className="py-3.5 px-4 max-w-xs md:max-w-sm">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.primary_image_url} 
                          alt="core" 
                          className="h-10 w-10 object-cover rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 font-mono text-[9px]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.sokoai.internal/placeholder.png';
                          }}
                        />
                        <div className="min-w-0 space-y-0.5">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-tight">{product.sku || "NO-SKU"}</span>
                          <p className="text-slate-800 text-xs font-semibold truncate" title={product.title}>
                            {product.title}
                          </p>
                          <span className="text-[10px] text-slate-400 block truncate font-normal">
                            {product.description || "No description provided."}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Globe size={12} className="text-slate-400" />
                        <span>
                          {typeof product.merchant === 'object' 
                            ? (product.merchant as any)?.name 
                            : merchants?.find(m => m.unique_id === String(product.merchant))?.unique_id || `Merchant Node ID: ${product.merchant}`}
                        </span>
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
                        {product.deal_price.toLocaleString()}{' '}
                        <span className="text-[10px] text-slate-400 font-medium">KES</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-semibold tracking-wide ${product.is_available
                            ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                            : 'bg-rose-50 border border-rose-100 text-rose-700'
                          }`}>
                          {product.is_available ? 'Active' : 'Depleted'}
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
                          onClick={() => product.unique_id && removeFromCatalog(product.unique_id)}
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
                      value={newProduct.sku || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      placeholder="SKU-BASE-01"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <label className="block text-slate-500">Brand Module</label>
                    <select
                      value={newProduct.brand || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 appearance-none focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">-- Null (Not Set) --</option>
                      {brands?.map((brand: any) => (
                        <option key={brand.id || brand.name} value={brand.name}>{brand.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 bottom-2.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 relative">
                    <label className="block text-slate-500">Classification Category</label>
                    <select
                      value={newProduct.category || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 appearance-none focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">-- Null (Not Set) --</option>
                      {categories?.map((cat: any) => (
                        <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 bottom-2.5 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="space-y-1 relative">
                    <label className="block text-slate-500">Merchant Node Matrix</label>
                    <select
                      required
                      value={newProduct.merchant}
                      onChange={(e) => setNewProduct({ ...newProduct, merchant: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 appearance-none focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="" disabled>Select Merchant Hub</option>
                      {merchants?.map((m: any) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 bottom-2.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-500">Original Price</label>
                    <input
                      type="number" required
                      value={newProduct.original_price || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, original_price: Number(e.target.value) })}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-500">Active Deal Price</label>
                    <input
                      type="number" required
                      value={newProduct.deal_price || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, deal_price: Number(e.target.value) })}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500">System Functional Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter granular operational telemetry description block specs..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isAvailableCheck"
                    checked={newProduct.is_available}
                    onChange={(e) => setNewProduct({ ...newProduct, is_available: e.target.checked })}
                    className="h-4 w-4 accent-slate-950 rounded-sm cursor-pointer"
                  />
                  <label htmlFor="isAvailableCheck" className="text-slate-600 select-none cursor-pointer">
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