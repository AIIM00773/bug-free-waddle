


import React, { useState, useEffect } from 'react';
import { Sparkles, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, X } from 'lucide-react';

export function SmartProductOnboardForm({ isOpen = true, onCancel, onSubmit }) {
  const [currentStage, setCurrentStage] = useState('idle'); // 'idle' | 'scanning' | 'review'
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Structured form state specifically populated by the AI model
  const [aiExtractedData, setAiExtractedData] = useState({
    title: '',
    category: '',
    brand: '',
    description: '',
    color: '',
    isPhysical: true,
    confidenceScore: 0 // Mock confidence index for UI fidelity
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert("Please upload a valid image file.");
      return;
    }
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

  // Simulated AI analysis sequence for the "Coming Soon" preview architecture
  const simulateAIScan = () => {
    setCurrentStage('scanning');
    
    setTimeout(() => {
      setAiExtractedData({
        title: "Nike Air Max 270 Running Shoes",
        category: "Apparel & Footwear > Sneakers",
        brand: "Nike",
        description: "High-performance lifestyle sneaker featuring a prominent Max Air unit for maximum cushioning, knit upper composite construct, and asymmetric lacing metrics.",
        color: "Black / Anthracite-White",
        isPhysical: true,
        confidenceScore: 94
      });
      setCurrentStage('review');
    }, 3200); // Radar animation duration
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAiExtractedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCommit = () => {
    if (onSubmit) onSubmit(aiExtractedData);
    alert("Smart Onboarding Synchronized with Catalog!");
  };

  if (!isOpen) return null;

  const labelStyle = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";
  const inputStyle = "w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 antialiased">
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal Viewbox Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-200/60 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Sticky Modular Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md animate-pulse">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">Smart AI Onboarding</h1>
                <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">Beta Preview</span>
              </div>
              <p className="text-xs text-slate-500">Zero-typing catalog management powered by computer vision.</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Scrollable Workspace */}
        <div className="overflow-y-auto p-8 flex-1 bg-[#FAFBFD]">
          
          {/* STAGE 1: IDLE / DROPZONE STAGE */}
          {currentStage === 'idle' && (
            <div 
              onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
              className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-white min-h-[40vh] ${
                dragActive ? 'border-purple-500 bg-purple-50/30' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <UploadCloud className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Drop your product photo here</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">Our system extracts dimensions, brand markings, specifications, and categorical taxonomy instantly.</p>
              
              <label className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-800 shadow transition cursor-pointer">
                Select Photo Asset
                <input type="file" accept="image/*" className="hidden" onChange={(e) => processFile(e.target.files[0])} />
              </label>
            </div>
          )}




          {/* STAGE 2: RADAR RADIAL SCANNING ACTIVE ANIMATION */}
          {currentStage === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-12 text-center min-h-[40vh]">
              <div className="relative mb-6">
                {/* Simulated Radar Target Frame */}
                {previewUrl && (
                  <img src={previewUrl} alt="Scanning source" className="h-36 w-36 object-cover rounded-xl border border-slate-200 shadow" />
                )}
                {/* Horizontal Sweeping Laser Line */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-bounce" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-0 bg-purple-500/10 rounded-xl animate-pulse" />
              </div>
              
              <div className="flex items-center gap-2 justify-center text-slate-800 font-bold text-sm">
                <RefreshCw className="h-4 w-4 animate-spin text-purple-600" /> 
                Running Visual Cognitive Extraction...
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">Isolating geometric parameters, checking brand vectors, and compiling schema fields.</p>
            </div>
          )}

          

          {/* STAGE 3: HYDRATED DATA PREVIEW & EDIT REVIEW GRID */}
          {currentStage === 'review' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start animate-in fade-in duration-300">
              
              {/* Left Column: Image Asset Reference */}
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm p-2">
                  <img src={previewUrl} alt="Extracted resource" className="w-full aspect-square object-cover rounded-lg" />
                </div>
                
                {/* Confidence Metrics Component Block */}
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800">High Confidence Extract ({aiExtractedData.confidenceScore}%)</h4>
                    <p className="text-[11px] text-emerald-700/80 mt-0.5">The engine parsed this data directly from clear product labels and contours.</p>
                  </div>
                </div>

                <button 
                  type="button" onClick={() => setCurrentStage('idle')}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-white text-slate-600 shadow-sm transition"
                >
                  <RefreshCw className="h-3 w-3" /> Rescan Alternate Angle
                </button>
              </div>

              {/* Right Column: Dynamic Form Fields Hydration */}
              <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Layers className="h-4 w-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Extracted Matrix Review</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelStyle}>AI Product Title Suggestion</label>
                    <input type="text" name="title" value={aiExtractedData.title} onChange={handleFieldChange} className={inputStyle} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Identified Brand</label>
                      <input type="text" name="brand" value={aiExtractedData.brand} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Color Profile Snapshot</label>
                      <input type="text" name="color" value={aiExtractedData.color} onChange={handleFieldChange} className={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label className={labelStyle}>Taxonomy Classification Category</label>
                    <input type="text" name="category" value={aiExtractedData.category} onChange={handleFieldChange} className={inputStyle} />
                  </div>

                  <div>
                    <label className={labelStyle}>Rich Generated Description</label>
                    <textarea name="description" rows={3} value={aiExtractedData.description} onChange={handleFieldChange} className={`${inputStyle} resize-none`} />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" name="isPhysical" id="smart-phys" checked={aiExtractedData.isPhysical} onChange={handleFieldChange} className="h-4 w-4 rounded border-slate-300 accent-slate-950" />
                    <label htmlFor="smart-phys" className="text-xs font-semibold text-slate-700 select-none cursor-pointer">Confirm this requires physical shipping logistics</label>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Sticky Control Hub Footer */}
        <div className="flex items-center justify-between px-8 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <p className="text-[11px] text-slate-400 font-medium">
            {currentStage === 'review' ? "💡 Edit any text field above if the AI made a mistake before saving." : "Ready Process ."}
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:bg-slate-50 transition">
              Close Preview
            </button>
            {currentStage === 'review' && (
              <button onClick={handleCommit} className="bg-slate-900 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow hover:bg-slate-800 transition">
                Confirm & Push to Inventory
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
