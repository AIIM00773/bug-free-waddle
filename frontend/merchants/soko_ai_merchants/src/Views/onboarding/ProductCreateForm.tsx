import React, { useState, useEffect } from 'react';
import { 
  Package, DollarSign, Image as ImageIcon, Info, Truck, 
  Save, ChevronRight, ChevronLeft, ArrowUpRight, X, AlertCircle 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function ProductCreateForm({ active_inventory, onSubmit, onCancel, isOpen = true }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    parrentInventory: active_inventory?.unique_id || '',
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

  // Media state management hooks relocated safely inside component scope
  const [mediaFiles, setMediaFiles] = useState([]); 
  const [mediaPreviews, setMediaPreviews] = useState([]); 

  // Automatically match parent inventory context if active changes
  useEffect(() => {
    if (active_inventory?.unique_id) {
      setFormData(prev => ({ ...prev, parrentInventory: active_inventory.unique_id }));
    }
  }, [active_inventory]);

  // Handle modal background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Dynamic SKU Generator
  useEffect(() => {
    if (!formData.category || !formData.title) return;

    const catCode = formData.category
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 3);

    const words = formData.title.trim().toUpperCase().split(/\s+/);
    let titleCode = words
      .map(word => word.replace(/[^A-Z0-9]/g, ''))
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .slice(0, 3);

    if (titleCode.length < 3) {
      titleCode = formData.title.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
    }

    const now = new Date();
    const dateSnap = now.toISOString().slice(2, 10).replace(/-/g, '');
    const uniqueSuffix = uuidv4().split('-').pop().slice(-4).toUpperCase();

    setFormData(prev => ({
      ...prev,
      sku: `${catCode}-${titleCode}-${dateSnap}-${uniqueSuffix}`
    }));
  }, [formData.category, formData.title]);

  // Clean up Object URLs on unmount to prevent performance leaks
  useEffect(() => {
    return () => {
      mediaPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mediaPreviews]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError(''); // Clear errors on typing
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const remainingSlots = 3 - mediaFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));

    setMediaFiles(prev => [...prev, ...filesToAdd]);
    setMediaPreviews(prev => [...prev, ...newPreviews]);
    
    setFormData(prev => ({
      ...prev,
      productImages: [...(prev.productImages || []), ...filesToAdd]
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(mediaPreviews[indexToRemove]);

    setMediaPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setMediaFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    
    setFormData(prev => ({
      ...prev,
      productImages: (prev.productImages || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.title) {
        setError("Product Title is required.");
        return false;
      }
      if (!formData.category) {
        setError("Product Category is required to build inventory architecture.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.originalPrice || !formData.dealPrice) {
        setError("Pricing values are required configuration configurations.");
        return false;
      }
      if (Number(formData.dealPrice) > Number(formData.originalPrice)) {
        setError("Active deal price cannot look higher than the original base valuation.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setError('');
    
    if (currentStep === 2 && !formData.isPhysical) {
      setCurrentStep(4);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep === 4 && !formData.isPhysical) {
      setCurrentStep(2);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateStep()) return;
    
    if (onSubmit) {
      onSubmit({
        ...formData,
        images: mediaFiles // Injects file objects explicitly for API multipart/form-data upload
      });
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-950 placeholder-slate-400 focus:bg-white focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 transition-all shadow-sm disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed";
  const labelClass = "block text-[13px] font-semibold text-slate-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 antialiased">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" onClick={onCancel} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300" role="dialog" aria-modal="true">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
              <Package className="h-5 w-5 text-slate-800" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-950">Add New Product</h1>
              <p className="text-xs text-slate-500 font-medium">Step {currentStep} of {totalSteps} — {['General Info', 'Pricing & Assets', 'Logistics Context', 'Media Slots'][currentStep - 1]}</p>
            </div>
          </div>
          
          {/* Progress Steps Indicators */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            {[
              { step: 1, icon: Info, label: 'Info' },
              { step: 2, icon: DollarSign, label: 'Pricing' },
              { step: 3, icon: Truck, label: 'Logistics' },
              { step: 4, icon: ImageIcon, label: 'Media' }
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-2">
                <item.icon className={`h-4 w-4 ${currentStep === item.step ? 'text-slate-950 font-bold' : 'text-slate-400'}`} />
                <span className={`text-xs font-medium ${currentStep === item.step ? 'text-slate-950 font-bold' : 'text-slate-400'}`}>{item.label}</span>
                {item.step !== 4 && <div className={`w-1.5 h-1.5 rounded-full ${currentStep > item.step ? 'bg-slate-900' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          <button onClick={onCancel} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-xs font-semibold text-red-700 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Workspace Grid Area */}
        <div className="overflow-y-auto p-6 md:p-8 flex-1 bg-slate-50/50">
          <div className="max-w-3xl mx-auto">
            
            {/* STEP 1: GENERAL INFO */}
            {currentStep === 1 && (
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Product Title <span className="text-red-500">*</span></label>
                    <input required type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g., Sony WH-1000XM4 Wireless Headphones" />
                  </div>
                  <div>
                    <label className={labelClass}>Active Working Category <span className="text-red-500">*</span></label>
                    <input required type="text" name="category" value={formData.category} onChange={handleChange} className={inputClass} placeholder="e.g., Electronics, Fitness, Apparel" />
                  </div>
                  <div>
                    <label className={labelClass}>Brand <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputClass} placeholder="e.g., Sony (Leave blank for generic)" />
                  </div>
                  <div>
                    <label className={labelClass}>Target Destination Inventory</label>
                    <select disabled name="parrentInventory" className={`${inputClass} font-medium`}>
                      <option value={active_inventory?.unique_id}>{active_inventory?.inventoryTitle || 'Global Inventory Scope'}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Generated System SKU</label>
                    <input type="text" name="sku" disabled value={formData.sku || 'Awaiting Title & Category...'} className={`${inputClass} font-mono text-xs text-slate-500 tracking-wider`} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Description Summary</label>
                    <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Describe core merchant value metrics..." />
                  </div>
                </div>
              </section>
            )}

            {/* STEP 2: PRICING CONFIGURATION */}
            {currentStep === 2 && (
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Financial Thresholds</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" name="isTaxExempt" checked={formData.isTaxExempt} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 accent-slate-950" />
                      <span className="text-xs font-semibold text-slate-700">Tax Exempt</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" name="isPhysical" checked={formData.isPhysical} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 accent-slate-950" />
                      <span className="text-xs font-semibold text-slate-700">Physical Fulfillment</span>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Original Price (KES) <span className="text-red-500">*</span></label>
                    <input required type="number" min="0" step="0.01" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className={inputClass} placeholder="0.00" />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Active Deal Markdown (KES) <span className="text-red-500">*</span></label>
                    <input required type="number" min="0" step="0.01" name="dealPrice" value={formData.dealPrice} onChange={handleChange} className={inputClass} placeholder="0.00" />
                  </div>
                  <div>
                    <label className={labelClass}>Initial Stock Count</label>
                    <input type="number" min="0" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Low Stock Cap</label>
                    <input type="number" min="0" name="minimumStockThreshold" value={formData.minimumStockThreshold} onChange={handleChange} className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Physical Warehouse Location Tag</label>
                    <input type="text" name="shelfLocationSnapshot" value={formData.shelfLocationSnapshot} onChange={handleChange} className={inputClass} placeholder="Aisle 3, Row B" />
                  </div>
                </div>
              </section>
            )}

            {/* STEP 3: SHIPPING LOGISTICS */}
            {currentStep === 3 && (
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metrics and Parameters</h3>
                  <button type="button" onClick={() => setCurrentStep(4)} className="text-xs font-bold text-slate-500 hover:text-slate-950 flex items-center gap-0.5 tracking-wide transition-colors">
                    Skip Step <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClass}>Weight (Kg)</label>
                    <input type="number" step="0.01" name="weightKg" value={formData.weightKg} onChange={handleChange} className={inputClass} placeholder="0.0" />
                  </div>
                  <div>
                    <label className={labelClass}>Length (cm)</label>
                    <input type="number" name="length" value={formData.length} onChange={handleChange} className={inputClass} placeholder="0" />
                  </div>
                  <div>
                    <label className={labelClass}>Width (cm)</label>
                    <input type="number" name="width" value={formData.width} onChange={handleChange} className={inputClass} placeholder="0" />
                  </div>
                  <div>
                    <label className={labelClass}>Height (cm)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputClass} placeholder="0" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Color Profiles (Comma separated)</label>
                    <input type="text" name="color" value={formData.color} onChange={handleChange} className={inputClass} placeholder="Black, Space Gray" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Sizes Configured</label>
                    <input type="text" name="size" value={formData.size} onChange={handleChange} className={inputClass} placeholder="XL, L, 42, 40" />
                  </div>
                </div>
              </section>
            )}

            {/* STEP 4: GENUINE CATALOG MEDIA UPLOADER */}
            {currentStep === 4 && (
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Product Media Gallery</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Add up to 3 visual media files. First image defaults to Cover.</p>
                  </div>
                  
                  {mediaFiles.length > 0 && (
                    <button type="button" onClick={handleSubmit} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5 tracking-wide transition-colors">
                      Deploy Catalog <Save className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* 1. Map Render Selected Previews */}
                  {mediaPreviews.map((previewUrl, index) => (
                    <div key={previewUrl} className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                      <img 
                        src={previewUrl} 
                        alt={`Product preview ${index + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      
                      {/* Cover Label Overlay */}
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold text-white px-2 py-0.5 rounded-md tracking-wider uppercase">
                          Main Cover
                        </span>
                      )}

                      {/* Destructive Action Overlay Button on Hover */}
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-2 rounded-lg bg-white/95 text-red-600 hover:bg-white transition-all shadow-md flex items-center gap-1 text-xs font-bold uppercase tracking-wider scale-95 group-hover:scale-100 duration-200"
                        >
                          <X className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* 2. Interactive Dropzone Trigger Element */}
                  {mediaFiles.length < 3 && (
                    <label className={`cursor-pointer group relative flex flex-col items-center justify-center aspect-[16/10] rounded-xl border-2 border-dashed transition-all duration-200 shadow-inner
                      ${mediaFiles.length === 0 
                        ? 'sm:col-span-2 border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400' 
                        : 'border-slate-200 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-400'
                      }`}
                    >
                      <input 
                        type="file" 
                        multiple 
                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                      
                      <ImageIcon className="h-6 w-6 mb-1.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      
                      <span className="text-xs font-bold text-slate-700 text-center">
                        {mediaFiles.length === 0 ? "Upload Product Cover Asset" : "Add Additional Image"}
                      </span>
                      
                      <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        PNG, JPEG, WebP (Max remaining: {3 - mediaFiles.length})
                      </span>
                    </label>
                  )}

                  {/* 3. Empty Slot Placeholders */}
                  {mediaFiles.length === 0 && (
                    <div className="hidden sm:flex flex-col items-center justify-center aspect-[16/10] rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/10 opacity-40">
                      <span className="text-[11px] font-bold text-slate-400">Slot +02</span>
                    </div>
                  )}

                </div>
              </section>
            )}

          </div>
        </div>

        {/* Footer Navigation Panel */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <div>
            {currentStep > 1 ? (
              <button type="button" onClick={handleBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors uppercase tracking-wider">
                <ChevronLeft className="h-4 w-4" /> Previous Step
              </button>
            ) : (
              <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider">
                Cancel & Exit
              </button>
            )}
          </div>
          
          <div>
            {currentStep < totalSteps ? (
              <button type="button" onClick={handleNext} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800 transition-all uppercase tracking-wider">
                Next Parameter <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all uppercase tracking-wider">
                <Save className="h-4 w-4" /> Deploy Product
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
