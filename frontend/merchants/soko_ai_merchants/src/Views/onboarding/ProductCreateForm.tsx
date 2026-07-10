import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Image as ImageIcon, Info, Truck, Tag, Save, X, UploadCloud } from 'lucide-react';

export function ProductCreateForm({ inventories = [], onSubmit, onCancel, isOpen = true }) {
  const [formData, setFormData] = useState({
    parrentInventory: '',
    title: '',
    sku: '',
    category: '',
    brand: '',
    description: '',
    originalPrice: '',
    dealPrice: '',
    isTaxExempt: false,
    stockQuantity: 0,
    minimumStockThreshold: 4,
    shelfLocationSnapshot: '',
    isPhysical: true,
    weightKg: '',
    length: '',
    width: '',
    height: '',
    color: '',
    size: '',
    condition: 'isNew',
    manufacturer: '',
    madeIn: '',
    locallyMade: false,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(formData.dealPrice) > Number(formData.originalPrice)) {
      alert("Deal price cannot be higher than the original price.");
      return;
    }
    if (onSubmit) onSubmit(formData);
  };

  if (!isOpen) return null;

  // Reusable input styling for consistency
  const inputClass = "w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm";
  const labelClass = "block text-[13px] font-medium text-gray-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 antialiased">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-5xl bg-white rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-gray-200 flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
              <Package className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-500">Create a new listing in your merchant catalog.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onCancel}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
            >
              <Save className="h-4 w-4" /> Save Product
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-8 flex-1 bg-[#FAFAFA]">
          <form id="product-create-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            
            {/* SECTION: BASIC INFO */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <Info className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Basic Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Product Title *</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g., Sony WH-1000XM4 Wireless Headphones" />
                </div>

                <div>
                  <label className={labelClass}>Target Inventory *</label>
                  <select required name="parrentInventory" value={formData.parrentInventory} onChange={handleChange} className={inputClass}>
                    <option value="">Select Inventory</option>
                    <option value="inv-1">Main Store Warehouse</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>SKU (Stock Keeping Unit)</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={`${inputClass} font-mono`} placeholder="e.g., SNY-WH1000-BLK" />
                </div>

                <div>
                  <label className={labelClass}>Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} className={inputClass} placeholder="Electronics > Audio" />
                </div>

                <div>
                  <label className={labelClass}>Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputClass} placeholder="e.g., Sony" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className={`${inputClass} resize-y`} placeholder="Detailed product description..." />
                </div>
              </div>
            </section>

            {/* SECTION: PRICING & INVENTORY */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <h2 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Pricing & Stock</h2>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isTaxExempt" checked={formData.isTaxExempt} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                  <span className="text-sm font-medium text-gray-700">Tax Exempt</span>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Original Price (KES) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">KES</span>
                    <input required type="number" min="0" step="0.01" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="0.00" />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className={labelClass}>Deal Price (KES) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">KES</span>
                    <input required type="number" min="0" step="0.01" name="dealPrice" value={formData.dealPrice} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="0.00" />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className={labelClass}>Initial Stock</label>
                  <input type="number" min="0" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className={inputClass} />
                </div>

                <div className="md:col-span-1">
                  <label className={labelClass}>Low Stock Alert</label>
                  <input type="number" min="0" name="minimumStockThreshold" value={formData.minimumStockThreshold} onChange={handleChange} className={inputClass} />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Shelf Location</label>
                  <input type="text" name="shelfLocationSnapshot" value={formData.shelfLocationSnapshot} onChange={handleChange} className={inputClass} placeholder="e.g., Aisle 4, Bin B" />
                </div>
              </div>
            </section>

            {/* SECTION: SHIPPING & DIMENSIONS */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <h2 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Shipping & Variants</h2>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isPhysical" checked={formData.isPhysical} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                  <span className="text-sm font-medium text-gray-700">Physical Product</span>
                </label>
              </div>
              
              {formData.isPhysical && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className={labelClass}>Weight (Kg)</label>
                    <input type="number" step="0.01" name="weightKg" value={formData.weightKg} onChange={handleChange} className={inputClass} placeholder="0.00" />
                  </div>
                  <div>
                    <label className={labelClass}>Length (cm)</label>
                    <input type="number" step="0.1" name="length" value={formData.length} onChange={handleChange} className={inputClass} placeholder="0.0" />
                  </div>
                  <div>
                    <label className={labelClass}>Width (cm)</label>
                    <input type="number" step="0.1" name="width" value={formData.width} onChange={handleChange} className={inputClass} placeholder="0.0" />
                  </div>
                  <div>
                    <label className={labelClass}>Height (cm)</label>
                    <input type="number" step="0.1" name="height" value={formData.height} onChange={handleChange} className={inputClass} placeholder="0.0" />
                  </div>
                  
                  <div className="col-span-2">
                    <label className={labelClass}>Color Variants</label>
                    <input type="text" name="color" value={formData.color} onChange={handleChange} className={inputClass} placeholder="e.g., Red, Blue, Black" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Size Variants</label>
                    <input type="text" name="size" value={formData.size} onChange={handleChange} className={inputClass} placeholder="e.g., S, M, L, XL" />
                  </div>
                </div>
              )}
            </section>

            {/* SECTION: MEDIA */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <ImageIcon className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Product Media</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Primary Upload */}
                <div className="col-span-2 aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-900 transition-colors cursor-pointer group">
                  <UploadCloud className="h-8 w-8 mb-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <span className="text-sm font-medium">Upload Primary</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                  <input type="file" className="hidden" accept="image/*" />
                </div>

                {/* Secondary Slots */}
                {[1, 2, 3].map((num) => (
                  <div key={num} className="aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer hover:border-gray-300">
                    <span className="text-2xl mb-1 font-light text-gray-300">+</span>
                    <span className="text-[11px] font-medium uppercase tracking-wider">Slot {num}</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                ))}
              </div>
            </section>
            
          </form>
        </div>
      </div>
    </div>
  );
}
