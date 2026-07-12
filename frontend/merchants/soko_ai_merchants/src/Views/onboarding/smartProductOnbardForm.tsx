import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, UploadCloud, AlertCircle, RefreshCw, Layers, ShieldCheck, X } from 'lucide-react';

export function SmartProductOnboardForm({ isOpen = true, onCancel, onSubmit }) {
  const [currentStage, setCurrentStage] = useState('idle'); // 'idle' | 'scanning' | 'review'
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Fully balanced initial form context
  const getInitialFormState = () => ({
    title: '',
    sku: '',
    category: '',
    brand: '',
    description: '',
    originalPrice: '',
    dealPrice: '',
    isTaxExempt: false,
    stockQuantity: 1,
    minimumStockThreshold: 1,
    shelfLocationSnapshot: '',
    isPhysical: true,
    weightKg: '',
    length: '',
    width: '',
    height: '',
    color: '',
    size: '',
    condition: 'isNew', // Strictly locked enum tracking pattern
    manufacturer: '',
    madeIn: '',
    locallyMade: false,
    confidenceScore: 0
  });

  const [aiExtractedData, setAiExtractedData] = useState(getInitialFormState());

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setErrorMessage("Please upload a valid image file to trigger vision classification nodes.");
      return;
    }
    setErrorMessage('');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    setPreviewUrl(URL.createObjectURL(file));
    simulateAIScan();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Simulated vision response structure utilizing clean schema defaults
  const simulateAIScan = () => {
    setCurrentStage('scanning');
    
    setTimeout(() => {
      setAiExtractedData({
        title: "Nike Air Max 270 Running Shoes",
        sku: `FTW-NIK-${Math.floor(1000 + Math.random() * 9000)}`,
        category: "Footwear",
        brand: "Nike",
        description: "High-performance lifestyle sneaker featuring a prominent Max Air unit for maximum cushioning.",
        originalPrice: "14500",
        dealPrice: "12999",
        isTaxExempt: false,
        stockQuantity: 12,
        minimumStockThreshold: 3,
        shelfLocationSnapshot: "Aisle 4, Shelf C",
        isPhysical: true,
        weightKg: "0.85",
        length: "32",
        width: "20",
        height: "12",
        color: "Black / Anthracite",
        size: "42",
        condition: "isNew",
        manufacturer: "Nike Operations",
        madeIn: "Vietnam",
        locallyMade: false,
        confidenceScore: 96
      });
      setCurrentStage('review');
    }, 3200);
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAiExtractedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Data Sanitize Engine: Stops broken data formats from corrupting DB metrics
  const validateAndCommit = () => {
    setErrorMessage('');
    
    if (!aiExtractedData.title.trim()) {
      setErrorMessage("Inventory asset requires a valid identifier string.");
      return;
    }

    // Parse values safely to protect numeric inventory records
    const cleanOriginalPrice = Math.max(0, parseFloat(aiExtractedData.originalPrice) || 0);
    const cleanDealPrice = Math.max(0, parseFloat(aiExtractedData.dealPrice) || 0);
    const cleanStock = Math.max(0, parseInt(aiExtractedData.stockQuantity, 10) || 0);
    const cleanThreshold = Math.max(0, parseInt(aiExtractedData.minimumStockThreshold, 10) || 1);

    // Guard fallback patterns for logistics arrays
    const sanitizedPayload = {
      ...aiExtractedData,
      title: aiExtractedData.title.trim(),
      sku: aiExtractedData.sku.trim() || `SKU-AUTO-${Date.now()}`,
      brand: aiExtractedData.brand.trim() || 'Generic',
      category: aiExtractedData.category.trim() || 'Uncategorized',
      originalPrice: cleanOriginalPrice,
      dealPrice: cleanDealPrice > cleanOriginalPrice ? cleanOriginalPrice : cleanDealPrice, // Prevent deal metrics exceeding base
      stockQuantity: cleanStock,
      minimumStockThreshold: cleanThreshold,
      weightKg: Math.max(0, parseFloat(aiExtractedData.weightKg) || 0),
      length: Math.max(0, parseFloat(aiExtractedData.length) || 0),
      width: Math.max(0, parseFloat(aiExtractedData.width) || 0),
      height: Math.max(0, parseFloat(aiExtractedData.height) || 0),
      condition: ['isNew', 'isRefurbished', 'isUsed'].includes(aiExtractedData.condition) ? aiExtractedData.condition : 'isNew'
    };

    if (onSubmit) {
      onSubmit(sanitizedPayload);
    }
  };

  if (!isOpen) return null;

  const labelStyle = "block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1";
  const inputStyle = "w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-950 placeholder-slate-400 focus:bg-white focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 transition-all shadow-sm";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 antialiased">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" onClick={onCancel} />

      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300" role="dialog" aria-modal="true">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-950">Smart AI Onboarding</h1>
                <span className="bg-slate-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase">Vision Guard Active</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Automatic system generation with clean input sanitation arrays.</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Error Status Banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-semibold text-amber-800 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content Workspace */}
        <div className="overflow-y-auto p-6 md:p-8 flex-1 bg-slate-50/50">
          
          {currentStage === 'idle' && (
            <div 
              onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-white min-h-[42vh] shadow-sm group ${
                dragActive ? 'border-purple-500 bg-purple-50/30 ring-4 ring-purple-500/10' : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => processFile(e.target.files[0])} />
              <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center mb-4">
                <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Drop your product photo here, or <span className="text-indigo-600">browse</span></h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed font-medium">Extract system parameters securely into validation schemas.</p>
            </div>
          )}

          {currentStage === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-12 text-center min-h-[42vh]">
              <div className="relative mb-6">
                {previewUrl && <img src={previewUrl} alt="Scanning source" className="h-40 w-40 object-cover rounded-xl border border-slate-200 shadow-md" />}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_12px_rgba(168,85,247,1)] animate-bounce top-0 bottom-0" style={{ animationDuration: '2.4s' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent rounded-xl animate-pulse" />
              </div>
              <div className="flex items-center gap-2 justify-center text-slate-900 font-bold text-sm tracking-wide">
                <RefreshCw className="h-4 w-4 animate-spin text-purple-600" /> Running Sanitized Extraction Pipeline...
              </div>
            </div>
          )}

          {currentStage === 'review' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in duration-300">
              
              {/* Left Column Controls */}
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm p-2">
                  <img src={previewUrl} alt="Extracted asset" className="w-full aspect-square object-cover rounded-lg" />
                </div>
                
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800">Type Integrity Guards Active</h4>
                    <p className="text-[11px] text-emerald-700/80 mt-0.5 leading-relaxed font-medium">All numbers, prices, and classification enums are run through type sanitizers before sync hooks fire.</p>
                  </div>
                </div>

                <button type="button" onClick={() => { setAiExtractedData(getInitialFormState()); setCurrentStage('idle'); }} className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold border border-slate-200 rounded-xl hover:bg-white bg-slate-50 text-slate-700 shadow-sm transition-all uppercase tracking-wide">
                  <RefreshCw className="h-3.5 w-3.5" /> Reset Image Asset
                </button>
              </div>

              {/* Right Column Fields */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
                
                {/* Identity Block */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                    <Layers className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">1. Core Identity & Enums</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelStyle}>Product Title *</label>
                      <input type="text" name="title" value={aiExtractedData.title} onChange={handleFieldChange} className={inputStyle} required />
                    </div>
                    <div>
                      <label className={labelStyle}>Category Schema</label>
                      <input type="text" name="category" value={aiExtractedData.category} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Brand Vector</label>
                      <input type="text" name="brand" value={aiExtractedData.brand} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>SKU Identification Tracker</label>
                      <input type="text" name="sku" value={aiExtractedData.sku} onChange={handleFieldChange} className={`${inputStyle} font-mono text-xs`} />
                    </div>
                    <div>
                      <label className={labelStyle}>Product Condition Matrix</label>
                      <select name="condition" value={aiExtractedData.condition} onChange={handleFieldChange} className={inputStyle}>
                        <option value="isNew">Brand New Stock (isNew)</option>
                        <option value="isRefurbished">Refurbished Matrix (isRefurbished)</option>
                        <option value="isUsed">Used Stock Layer (isUsed)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelStyle}>Narrative Description Summary</label>
                      <textarea name="description" rows={2} value={aiExtractedData.description} onChange={handleFieldChange} className={`${inputStyle} resize-none leading-relaxed`} />
                    </div>
                  </div>
                </div>

                {/* Financial Safety Block */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">2. Financial Layers & Sanitation Check</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Base Price (KES)</label>
                      <input type="number" min="0" name="originalPrice" value={aiExtractedData.originalPrice} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Markdown Offer Price (KES)</label>
                      <input type="number" min="0" name="dealPrice" value={aiExtractedData.dealPrice} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Storage Controls */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">3. Inventory Count Limits</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelStyle}>Stock Quantity</label>
                      <input type="number" min="0" name="stockQuantity" value={aiExtractedData.stockQuantity} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Safety Alert Threshold</label>
                      <input type="number" min="0" name="minimumStockThreshold" value={aiExtractedData.minimumStockThreshold} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Storage Section Tag</label>
                      <input type="text" name="shelfLocationSnapshot" value={aiExtractedData.shelfLocationSnapshot} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Physical Integrity Specs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">4. Dimension Variables</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className={labelStyle}>Weight (Kg)</label>
                      <input type="number" step="0.01" min="0" name="weightKg" value={aiExtractedData.weightKg} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Length (cm)</label>
                      <input type="number" min="0" name="length" value={aiExtractedData.length} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Width (cm)</label>
                      <input type="number" min="0" name="width" value={aiExtractedData.width} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Height (cm)</label>
                      <input type="number" min="0" name="height" value={aiExtractedData.height} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelStyle}>Colors</label>
                      <input type="text" name="color" value={aiExtractedData.color} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelStyle}>Sizes</label>
                      <input type="text" name="size" value={aiExtractedData.size} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <p className="text-[11px] text-slate-400 font-semibold">
            {currentStage === 'review' ? "🛡️ Sanitation active: numeric inputs are stripped of negative metrics instantly." : "Awaiting visual merchant array asset payload..."}
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 transition-all uppercase tracking-wide">
              Close Panel
            </button>
            {currentStage === 'review' && (
              <button type="button" onClick={validateAndCommit} className="bg-slate-950 text-white px-5 py-2 rounded-xl text-xs font-bold shadow hover:bg-slate-800 transition-all uppercase tracking-wide">
                Confirm & Sync Clean Catalog
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
