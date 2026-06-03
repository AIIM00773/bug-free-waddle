import { useState, useEffect } from 'react';
import { ArrowRightIcon, XIcon } from 'lucide-react';

export default function LandingPage() {
  const [merchantStep, setMerchantStep] = useState(1);
  const [userType, setUserType] = useState<'buyer' | 'merchant' | null>(null);

  // Keyboard shortcut handler to close modals on 'Escape'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserType(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">

      {/* 1. Header Navigation */}
      <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-sm">
              CC
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900">
              ccm<span className="text-indigo-600">.</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm flex items-center flex-shrink-0 flex-row gap-1">
              Get Started
              <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>




      {/* 2. Hero Background Context */}
      <header className="relative bg-white border-b border-zinc-200 h-[calc(text-sm,100vh-4rem)] min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/30 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-100/30 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
    
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-950 leading-[1.05] max-w-3xl mx-auto">
            The marketplace built on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600">pure intent.</span>
          </h1>

          <p className="text-base md:text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed">
            A frictionless platform matching conscious buyers with fast-moving local merchants using tailored AI conversation and automated vision tools.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">

            {/* 1. Buyer Flow Button - Deep Indigo Tint */}
            <button
              onClick={() => setUserType('buyer')}
              className="w-full sm:w-auto bg-[transparent] cursor-pointer  hover:bg-indigo-100/60 text-indigo-600 hover:text-indigo-700 text-xs font-semibold px-5 py-3 transition-all duration-200 "
            >
              🛍️ Buyer Flow
            </button>

            {/* 2. Merchant Flow Button - Vibrant Purple/Violet Tint */}
            <button
              onClick={() => setUserType('merchant')}
              className="w-full sm:w-auto bg-[transparent] cursor-pointer  hover:bg-indigo-100/60 text-indigo-600 hover:text-indigo-700 text-xs font-semibold px-5 py-3 transition-all duration-200 "
            >
              💼 Merchant Flow
            </button>

            {/* 3. Proceed / Product Flow Button - Minimalist Slate Tint */}
            <button
              onClick={() => setUserType('buyer')} // Adjust target state if this serves a third modal view
              className="w-full sm:w-auto bg-[transparent] cursor-pointer  hover:bg-indigo-100/60 text-indigo-600 hover:text-indigo-700 text-xs font-semibold px-5 py-3 transition-all duration-200 "
            >
              ⚡ Proceed 
            </button>

          </div>


        </div>
      </header>





      {/* 3. CORE MODAL PORTAL CONTROLLER */}
      {userType !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setUserType(null)} // Click outside window container layer to close layout
        >
          <div
            className={`w-full max-w-5xl bg-white border rounded-[28px] shadow-2xl overflow-hidden grid lg:grid-cols-12 relative animate-scale-up max-h-[90vh] overflow-y-auto ${userType === 'buyer' ? 'border-indigo-100 shadow-indigo-900/5' : 'border-violet-100 shadow-violet-900/5'
              }`}
            onClick={(e) => e.stopPropagation()} // Stop event leakage out to backdrop dismissal
          >
            {/* Native Close Box Action Button */}
            <button
              onClick={() => setUserType(null)}
              className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition shadow-xs"
            >
              <XIcon className="h-4 w-4" />
            </button>

            {/* ================= BUYER MODAL VIEW ================= */}
            {userType === 'buyer' && (
              <>
                {/* Left Descriptive Column */}
                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center bg-white">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-md w-fit">
                    <span>🛍️</span> Buyer Interface
                  </div>

                  <h2 className="mt-5 text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                    Say goodbye to infinite product grids.
                  </h2>

                  <p className="mt-3.5 text-xs md:text-sm text-zinc-500 leading-relaxed">
                    Don't spend your weekends tinkering with sorting menus, jumping through product tabs, and managing 20 open browser windows.
                  </p>

                  <p className="mt-2 text-xs md:text-sm text-zinc-500 leading-relaxed">
                    Simply express what you need in your natural voice. CCM builds a tailored micro-catalog instantly for you to finalize and purchase natively.
                  </p>

                  <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3 text-xs text-zinc-700 font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px]">✓</div>
                      <span>Intuitive natural language processing</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px]">✓</div>
                      <span>Direct parameters built contextually</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px]">✓</div>
                      <span>In-timeline unified checkout flow</span>
                    </div>
                  </div>
                </div>

                {/* Right Visual Simulation Column */}
                <div className="lg:col-span-7 bg-zinc-50/50 p-6 lg:p-12 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-zinc-100">
                  <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl shadow-sm p-4 space-y-4 text-xs font-sans">
                    <div className="flex justify-end">
                      <div className="bg-indigo-600 text-white px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-[85%] text-xs shadow-xs leading-normal">
                        "Need minimalist running shoes, breathable mesh, under $90. Dark colors."
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-zinc-100 text-zinc-800 px-3.5 py-2.5 rounded-2xl rounded-tl-xs max-w-[90%] space-y-2.5">
                        <p className="text-zinc-500 text-[11px]">I matched your requirements with local inventory verified options:</p>

                        <div className="border border-zinc-200 rounded-xl p-2.5 bg-white shadow-xs flex gap-3 items-center">
                          <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-lg shrink-0">👟</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-zinc-900 truncate text-[11px]">AeroMesh Onyx Runner</h4>
                              <span className="font-black text-zinc-900">$84</span>
                            </div>
                            <p className="text-[10px] text-zinc-400">Pace Athletic Co. • 4.8★</p>
                            <div className="mt-1 flex justify-between items-center">
                              <span className="text-[9px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-mono">Size 10, Black</span>
                              <button className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">Instant Buy</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-wrap pt-0.5">
                      <button className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 transition">🔄 Size 9 instead</button>
                      <button className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 transition">🏷️ Lower price cap</button>
                    </div>
                  </div>
                </div>
              </>
            )}





            {/* ================= MERCHANT MODAL VIEW ================= */}
            {userType === 'merchant' && (
              <>
                {/* Left Visual Simulation Column */}
                <div className="lg:col-span-7 bg-zinc-50/50 p-6 lg:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-100 order-last lg:order-first">
                  <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden text-xs font-sans">
                    <div className="flex border-b border-zinc-100 bg-zinc-50/50 text-[9px] uppercase font-bold tracking-wider text-zinc-400 text-center">
                      <button onClick={() => setMerchantStep(1)} className={`flex-1 py-2 border-b-2 transition ${merchantStep === 1 ? 'border-violet-600 text-violet-600 bg-white' : 'border-transparent'}`}>1. Upload</button>
                      <button onClick={() => setMerchantStep(2)} className={`flex-1 py-2 border-b-2 transition ${merchantStep === 2 ? 'border-violet-600 text-violet-600 bg-white' : 'border-transparent'}`}>2. Analyze</button>
                      <button onClick={() => setMerchantStep(3)} className={`flex-1 py-2 border-b-2 transition ${merchantStep === 3 ? 'border-violet-600 text-violet-600 bg-white' : 'border-transparent'}`}>3. Sync</button>
                    </div>

                    {merchantStep === 1 && (
                      <div className="p-6 text-center space-y-3">
                        <div className="h-28 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 flex flex-col items-center justify-center text-zinc-400 gap-1.5">
                          <span className="text-xl">📸</span>
                          <span className="font-medium text-[11px] text-zinc-500">Drop product camera rolls</span>
                        </div>
                        <button onClick={() => setMerchantStep(2)} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg transition text-center shadow-xs">Run Image Extraction</button>
                      </div>
                    )}

                    {merchantStep === 2 && (
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 p-2 rounded-xl">
                          <div className="w-8 h-8 bg-zinc-200 rounded-lg flex items-center justify-center text-base">🎒</div>
                          <div className="flex-1 min-w-0">
                            <div className="h-2 w-20 bg-zinc-300 rounded animate-pulse mb-1"></div>
                            <div className="h-1.5 w-12 bg-zinc-200 rounded"></div>
                          </div>
                          <span className="text-[9px] text-violet-600 bg-violet-50 font-bold px-1.5 py-0.5 rounded border border-violet-100">Vision Parsing</span>
                        </div>
                        <div className="space-y-2 text-[11px]">
                          <div>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Identified Item Title</span>
                            <p className="font-semibold text-zinc-800 border-b border-zinc-100 pb-0.5 mt-0.5">Technical Waterproof Backpack</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Suggested Pricing</span>
                              <p className="font-semibold text-zinc-800 border-b border-zinc-100 pb-0.5 mt-0.5">$68.00</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Taxonomy Tag</span>
                              <p className="font-semibold text-zinc-800 border-b border-zinc-100 pb-0.5 mt-0.5">Bags & Rugged Travel</p>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setMerchantStep(3)} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg transition text-center shadow-xs mt-1">Verify Specs & Publish</button>
                      </div>
                    )}

                    {merchantStep === 3 && (
                      <div className="p-6 text-center space-y-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-base font-bold">✓</div>
                        <div>
                          <h4 className="font-bold text-zinc-900">Storefront Index Completed</h4>
                          <p className="text-zinc-400 text-[11px] mt-0.5">Item attributes mapped securely. Live buyers matching target conditions view listing instantly.</p>
                        </div>
                        <button onClick={() => setMerchantStep(1)} className="text-[10px] text-zinc-400 hover:text-zinc-700 underline font-medium">Process next item</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Descriptive Column */}
                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center bg-white">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1 rounded-md w-fit">
                    <span>💼</span> Merchant Interface
                  </div>

                  <h2 className="mt-5 text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                    Onboard inventory via text-free pipelines.
                  </h2>

                  <p className="mt-3.5 text-xs md:text-sm text-zinc-500 leading-relaxed">
                    If your store relies on chat channels like WhatsApp groups or Instagram DMs, typing detailed web catalog inventories is holding you back.
                  </p>

                  <p className="mt-2 text-xs md:text-sm text-zinc-500 leading-relaxed">
                    Dump product pictures straight into CCM. The internal vision parser converts media into structured parameters, titles, and tax brackets for zero-effort creation.
                  </p>

                  <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3 text-xs text-zinc-700 font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded bg-violet-50 text-violet-600 flex items-center justify-center text-[10px]">✓</div>
                      <span>Zero manual copy or typing required</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded bg-violet-50 text-violet-600 flex items-center justify-center text-[10px]">✓</div>
                      <span>Auto-categorized tag structures</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded bg-violet-50 text-violet-600 flex items-center justify-center text-[10px]">✓</div>
                      <span>Seamless catalog sync across categories</span>
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