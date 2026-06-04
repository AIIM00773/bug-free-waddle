import { useState, useEffect } from 'react';
import {
  ArrowRight,
  X,
  Sparkles,
  Store,
  ShoppingBag,
  CheckCircle2,
  Layers,
  Maximize2,
  Eye,
  Cpu,
  ArrowUpRight
} from 'lucide-react';
import { Link, Links } from 'react-router-dom';

export default function LandingPage() {
  const [merchantStep, setMerchantStep] = useState<1 | 2 | 3>(1);
  const [userType, setUserType] = useState<'buyer' | 'merchant' | null>(null);
  const [isProcessingVision, setIsProcessingVision] = useState(false);

  // Keyboard shortcut handler to close modals on 'Escape'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserType(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerVisionPipeline = () => {
    setIsProcessingVision(true);
    setTimeout(() => {
      setIsProcessingVision(false);
      setMerchantStep(2);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">

      {/* 1. Header Navigation */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-sm tracking-tight shadow-xs">
              S
            </div>
            <span className="font-black text-base tracking-tight text-slate-900 uppercase">
              Soko<span className="text-emerald-600">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/shop">
              <button className="bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5">
                Explore Marketplace
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="relative bg-white border-b border-slate-200 min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-12">
        {/* Immersive mesh gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-100/40 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-950 leading-[1.05] max-w-4xl mx-auto">
            The local marketplace built on <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">pure intent.</span>
          </h1>

          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
            An automated platform matching conscious buyers with fast-moving local merchants using customized conversational intelligence and streamlined vision indexing tools.
          </p>

          {/* ASYMMETRICAL INTERACTIVE ACTION CARDS */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">

            <div
              onClick={() => setUserType('buyer')}
              className="bg-white hover:bg-slate-50 border border-slate-200 p-5 rounded-2xl text-left transition-all hover:border-emerald-500 cursor-pointer shadow-2xs hover:shadow-md group relative overflow-hidden"
            >
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                Buyer Interface <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">Deploy contextual filters instantly using natural prose queries.</p>
            </div>

            <div
              onClick={() => setUserType('merchant')}
              className="bg-white hover:bg-slate-50 border border-slate-200 p-5 rounded-2xl text-left transition-all hover:border-indigo-500 cursor-pointer shadow-2xs hover:shadow-md group relative overflow-hidden"
            >
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <Store className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                Merchant Pipeline <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">Upload inventory logs via visual parsing engines.</p>
            </div>


            <Link to="/shop">

            <div
              className="sm:col-span-2 lg:col-span-1 bg-slate-900 hover:bg-slate-800 text-white p-5 rounded-2xl text-left transition-all cursor-pointer shadow-md group relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-9 w-9 rounded-xl bg-white/10 text-white flex items-center justify-center mb-4">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm flex items-center gap-1">
                  Get Sarted 
                </h3>
                <p className="text-xs text-slate-400 mt-1">start smart shopping.</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Proceed </span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            </Link>

          </div>

        </div>
      </header>





      {/* 3. CORE MODAL PORTAL CONTROLLER */}
      {userType !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/40 backdrop-blur-md animate-fadeIn"
          onClick={() => setUserType(null)}
        >
          <div
            className={`w-full max-w-5xl bg-white sm:border rounded-t-3xl sm:rounded-[24px] shadow-2xl overflow-hidden grid lg:grid-cols-12 relative max-h-[100vh] sm:max-h-[90vh] overflow-y-auto ${userType === 'buyer' ? 'border-emerald-100' : 'border-indigo-100'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Native Close Box Action Button */}
            <button
              onClick={() => setUserType(null)}
              className="absolute top-4 right-4 z-50 h-9 w-9 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center transition shadow-md active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>

            {/* ================= BUYER MODAL VIEW ================= */}
            {userType === 'buyer' && (
              <>
                {/* Left Descriptive Column */}
                <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white border-b lg:border-b-0 border-slate-100">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md w-fit">
                    <ShoppingBag className="h-3 w-3" /> Buyer Interface
                  </div>

                  <h2 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                    Say goodbye to endless tabular grids.
                  </h2>

                  <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    Stop wasting hours fine-tuning search filters, switching between multiple e-commerce tabs, and verifying stock levels manually across individual store pages.
                  </p>

                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    State what you require in natural conversational text. SokoAI crawls active databases instantly, building a custom catalog for clean, immediate execution.
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-3.5 text-xs text-slate-700 font-bold">
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] border border-emerald-200">✓</div>
                      <span>Contextual natural text parameter parsing</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] border border-emerald-200">✓</div>
                      <span>Cross-marketplace localized price checking</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] border border-emerald-200">✓</div>
                      <span>Integrated merchant communication portal</span>
                    </div>
                  </div>
                </div>

                {/* Right Visual Simulation Column */}
                <div className="lg:col-span-7 bg-slate-50/60 p-6 lg:p-12 flex items-center justify-center lg:border-l border-slate-200/60">
                  <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xs p-4 space-y-4 text-xs">

                    {/* Simulated User Input */}
                    <div className="flex justify-end">
                      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-2xl rounded-tr-none max-w-[85%] text-xs shadow-xs leading-normal font-medium">
                        "Looking for minimalist running trainers, high breathability, under KSh 8,500. Dark colors if possible."
                      </div>
                    </div>

                    {/* Simulated System Response */}
                    <div className="flex justify-start animate-fadeIn">
                      <div className="bg-slate-50 border border-slate-200/80 text-slate-800 px-3.5 py-3 rounded-2xl rounded-tl-none max-w-[95%] space-y-3">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Cpu className="h-3 w-3 text-emerald-500" /> SokoAI Aggregator Active
                        </p>

                        <div className="border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs flex gap-3 items-center group transition-all hover:border-slate-300">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center text-lg shrink-0">👟</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-slate-900 truncate text-[11px]">AeroMesh Stealth Shadow</h4>
                              <span className="font-black text-emerald-600 font-mono text-[11px]">KSh 7,200</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">Kilimani Warehouse • 4.9 ★</p>

                            <div className="mt-2 flex justify-between items-center pt-1.5 border-t border-slate-100">
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-bold font-mono">Size 42, Navy</span>
                              <button className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-1 rounded shadow-2xs flex items-center gap-1">
                                View Deal
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive suggestions chips */}
                    <div className="flex gap-1.5 flex-wrap pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs">🔄 Shift to Size 43</span>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-2xs">📍 Filter near CBD</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ================= MERCHANT MODAL VIEW ================= */}
            {userType === 'merchant' && (
              <>
                {/* Left Visual Simulation Column */}
                <div className="lg:col-span-7 bg-slate-50/60 p-6 lg:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200/60 order-last lg:order-first">
                  <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-xs">

                    {/* Custom Nav Bar */}
                    <div className="flex border-b border-slate-200/80 bg-slate-50 text-[9px] font-black uppercase tracking-wider text-slate-400 text-center">
                      <div className={`flex-1 py-3 transition-colors ${merchantStep === 1 ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : ''}`}>1. Media Upload</div>
                      <div className={`flex-1 py-3 transition-colors ${merchantStep === 2 ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : ''}`}>2. Vision Parse</div>
                      <div className={`flex-1 py-3 transition-colors ${merchantStep === 3 ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : ''}`}>3. Index Sync</div>
                    </div>

                    {/* Step 1: Drag Drop Container */}
                    {merchantStep === 1 && (
                      <div className="p-6 text-center space-y-4">
                        <div className="h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 gap-1 relative overflow-hidden">
                          {isProcessingVision ? (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                              <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Analyzing Image Arrays...</span>
                            </div>
                          ) : null}
                          <span className="text-2xl">📷</span>
                          <span className="font-bold text-[11px] text-slate-600">Drop camera rolls or catalogs</span>
                          <span className="text-[9px] text-slate-400 font-medium">JPEG, PNG arrays up to 10MB</span>
                        </div>
                        <button
                          onClick={triggerVisionPipeline}
                          disabled={isProcessingVision}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 text-white font-bold py-2.5 rounded-xl transition-all text-center shadow-xs text-xs"
                        >
                          Run Extraction Model
                        </button>
                      </div>
                    )}

                    {/* Step 2: Computer Vision Spec Verification */}
                    {merchantStep === 2 && (
                      <div className="p-4 space-y-3.5 animate-fadeIn">
                        <div className="flex items-center gap-2.5 bg-slate-900 text-white p-2.5 rounded-xl shadow-xs">
                          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-base">🎒</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold font-mono text-[10px] text-indigo-400 uppercase tracking-widest">Metadata Sync</h4>
                            <p className="text-[11px] font-bold truncate text-white">Waterproof Terrain Rucksack</p>
                          </div>
                          <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">94% Match</span>
                        </div>

                        <div className="space-y-2.5 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Generated Catalog Title</span>
                            <span className="font-bold text-slate-800 block mt-0.5">Tactical All-Weather Waterproof Backpack</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Target Marketplace Price</span>
                              <span className="font-bold font-mono text-emerald-600 block mt-0.5">KSh 4,500</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Categorization Taxonomy</span>
                              <span className="font-bold text-slate-800 block mt-0.5">Luggage & Travel Bags</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setMerchantStep(3)}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-all text-center shadow-xs text-xs"
                        >
                          Verify & Publish to Feed
                        </button>
                      </div>
                    )}

                    {/* Step 3: Complete Block */}
                    {merchantStep === 3 && (
                      <div className="p-6 text-center space-y-4 animate-fadeIn">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-2xs">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">Storefront Index Finalized</h4>
                          <p className="text-slate-400 text-xs mt-1 font-medium leading-relaxed">
                            Attributes synced successfully. Active search queries meeting item criteria now fetch this card automatically.
                          </p>
                        </div>
                        <button
                          onClick={() => setMerchantStep(1)}
                          className="text-xs text-indigo-600 hover:text-indigo-700 underline font-bold transition-colors"
                        >
                          Process Next Batch Item
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Descriptive Column */}
                <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md w-fit">
                    <Store className="h-3 w-3" /> Merchant Interface
                  </div>

                  <h2 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                    Onboard local stocks via automated vision.
                  </h2>

                  <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    If your distribution relies on fast-moving channels like social feeds, WhatsApp groups, or direct messaging, typing out endless description parameters limits scale.
                  </p>

                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    Drop clear item camera captures directly into the engine. Our automated network interprets parameters, prices, and tax brackets with zero heavy layout setup.
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-3.5 text-xs text-slate-700 font-bold">
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] border border-indigo-200">✓</div>
                      <span>Zero manual copy pasting or form entry</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] border border-indigo-200">✓</div>
                      <span>Automated tags & description indexing</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] border border-indigo-200">✓</div>
                      <span>Instant sync straight to consumer comparison algorithms</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}