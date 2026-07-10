import React, { useState, useEffect } from 'react';
import { X, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import type { InventoryProductFilter } from '../Providers/AuthProvider'; // Adjust import path as needed

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: InventoryProductFilter | null;
  onApply: (filters: InventoryProductFilter) => void;
}

export function InventoryFilterDrawer({ isOpen, onClose, currentFilters, onApply }: FilterDrawerProps) {
  const [filters, setFilters] = useState<InventoryProductFilter>({});

  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters || {});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentFilters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters(prev => ({ ...prev, [name]: checked }));
      return;
    }

    setFilters(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : undefined) : value || undefined
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
  };

  if (!isOpen) return null;

  // Reusable strict input styling
  const inputClass = "w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm";
  const sectionHeaderClass = "text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4";

  return (
    <div className="fixed inset-0 z-[100] flex justify-end antialiased">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div 
        className="relative w-full max-w-md h-full bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)] border-l border-gray-200 flex flex-col animate-slide-in-right"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
              <SlidersHorizontal className="h-4 w-4 text-gray-700" />
            </div>
            <h2 className="text-base font-semibold tracking-tight text-gray-900">Filter Inventory</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#FAFAFA]">
          
          {/* Status & Availability */}
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className={sectionHeaderClass}>Status & Availability</h3>
            <div className="space-y-4">
              <select name="status" value={filters.status || ""} onChange={handleChange} className={inputClass}>
                <option value="">Any Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft / Unlisted</option>
                <option value="archived">Archived</option>
              </select>
              
              <div className="grid grid-cols-2 gap-3 pt-1">
                <CheckboxToggle label="In Stock" name="in_stock" checked={filters.in_stock} onChange={handleChange} />
                <CheckboxToggle label="Low Stock" name="low_stock" checked={filters.low_stock} onChange={handleChange} />
                <CheckboxToggle label="Has Discount" name="has_discount" checked={filters.has_discount} onChange={handleChange} />
                <CheckboxToggle label="Featured" name="featured" checked={filters.featured} onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* Categorization */}
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className={sectionHeaderClass}>Categorization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Category</label>
                <input type="text" name="category" value={filters.category || ""} onChange={handleChange} placeholder="e.g., Electronics" className={inputClass} />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Brand</label>
                <input type="text" name="brand" value={filters.brand || ""} onChange={handleChange} placeholder="e.g., Sony" className={inputClass} />
              </div>
            </div>
          </section>

          {/* Metrics Filters */}
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className={sectionHeaderClass}>Metrics</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Price Range (KES)</label>
                <div className="flex items-center gap-3">
                  <input type="number" name="min_price" value={filters.min_price || ""} onChange={handleChange} placeholder="Min" className={inputClass} />
                  <span className="text-gray-300">-</span>
                  <input type="number" name="max_price" value={filters.max_price || ""} onChange={handleChange} placeholder="Max" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Stock Volume</label>
                <div className="flex items-center gap-3">
                  <input type="number" name="min_stock" value={filters.min_stock || ""} onChange={handleChange} placeholder="Min Qty" className={inputClass} />
                  <span className="text-gray-300">-</span>
                  <input type="number" name="max_stock" value={filters.max_stock || ""} onChange={handleChange} placeholder="Max Qty" className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          {/* Sorting */}
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className={sectionHeaderClass}>Sorting</h3>
            <div className="grid grid-cols-2 gap-3">
              <select name="sort_by" value={filters.sort_by || ""} onChange={handleChange} className={inputClass}>
                <option value="">Sort By...</option>
                <option value="created_at">Date Added</option>
                <option value="price">Price</option>
                <option value="stock">Stock Level</option>
                <option value="name">Name (A-Z)</option>
              </select>
              
              <select name="sort_order" value={filters.sort_order || "desc"} onChange={handleChange} className={inputClass}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </section>

        </div>

        {/* Drawer Footer */}
        <div className="border-t border-gray-100 bg-white px-6 py-4 flex gap-3 shrink-0">
          <button 
            onClick={handleReset}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button 
            onClick={handleApply}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
          >
            <Check className="h-4 w-4" /> Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
}

// --- High-Contrast Checkbox Toggle Component ---

interface CheckboxToggleProps {
  label: string;
  name: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function CheckboxToggle({ label, name, checked = false, onChange }: CheckboxToggleProps) {
  return (
    <label className={`
      relative flex items-center justify-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-all duration-150 text-[13px] font-medium select-none
      ${checked 
        ? 'border-gray-900 bg-gray-900 text-white shadow-sm' 
        : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300 hover:bg-white hover:text-gray-900'
      }
    `}>
      <input 
        type="checkbox" 
        name={name} 
        checked={checked} 
        onChange={onChange} 
        className="sr-only" 
      />
      {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
      {label}
    </label>
  );
}
