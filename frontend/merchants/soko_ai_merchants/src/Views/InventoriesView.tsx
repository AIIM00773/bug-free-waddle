import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../Providers/AuthProvider';
import { useBranch } from '../Providers/BranchProvider'; 
import { useInventory } from '../Providers/InventoryProvider';
import { ProductCreateForm } from './onboarding/ProductCreateForm';
import { SmartProductOnboardForm } from './onboarding/smartProductOnbardForm';
import { InventoryFilterDrawer } from './onboarding/InventoryFilterDrawer';

import { 
  Search, Plus, Filter, MoreHorizontal, MapPin, Package, 
  ArrowRightLeft, Store, Lock, ChevronDown, AlertCircle, 
  Loader2, Eye, EyeOff, Maximize2, Minimize2 ,Sparkles ,
  PlusSquare
} from 'lucide-react';

// =============================================================================
// TYPES & DATA STRUCTURES
// =============================================================================

interface Product {
  id?: string | number;
  unique_id?: string;
  title: string;
  sku?: string;
  category?: string;
  primaryImage?: string;
  dealPrice: number;
  originalPrice: number;
  stockQuantity: number;
  reservedQuantity?: number;
  minimumStockThreshold?: number;
  isAvailable?: boolean;
}

interface Inventory {
  inventoryID: string | number;
  inventoryTitle: string;
  inventoryLocked?: boolean;
  parrentBranch?: any; 
  products?: Product[];
  totalInventoryValue?: number;
  lowStockItems?: number;
  outOfStockItems?: number;
}

interface Branch {
  id?: string | number;
  unique_id?: string;
  branchName: string;
  isPrimary?: boolean;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function InventoryView() {
  const { merchantProfile, isAuthenticated, isLoading: authLoading } = useAuth();
  const { branches, isLoading: branchLoading } = useBranch();
  const { branchInventories, activeInventory, setActiveInventory, fetchBranchInventories, inventoryFetchingError,inventoryLoading } = useInventory();
  
  // Local UI & Workspace States
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openInventoryFilterDrawer, setOpenInventoryFilterDrawer] = useState(false);
  const [openProductCreateForm, setOpenProductCreateForm] = useState(false);
  const [openSmartProducOnboard, setOpenSamrtProductOnboard] = useState(false); 
  const [showSummary, setShowSummary] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false); 
  
  // Sync Default Fallback Branch Node
  useEffect(() => { 
    if (branches && branches.length > 0) { 
      const primary = branches.find((b: Branch) => b.isPrimary) || branches[0]; 
      setActiveBranch(primary);
    } else {
      setActiveBranch(null);
    }
  }, [branches]);

  

  // Reactive Data Fetcher via Active Branch Channel
  useEffect(() => {
    if (activeBranch) {
      const targetId = activeBranch.unique_id || activeBranch.id;
      if (targetId) fetchBranchInventories(targetId); 
    }
  }, [activeBranch, fetchBranchInventories]);



  // Tab Allocation Sync Engine
  useEffect(() => {
    if (activeBranch && branchInventories?.length > 0) {
      const currentBranchInvs = branchInventories.filter((invent: Inventory) => {
        const targetId = String(invent.parrentBranch?.unique_id || invent.parrentBranch || '');
        const currentId = String(activeBranch.unique_id || activeBranch.id || '');
        return targetId === currentId;
      });

      const isActiveValid = currentBranchInvs.some(
        (inv: Inventory) => inv.inventoryID === activeInventory?.inventoryID
      );

      if (!isActiveValid && currentBranchInvs.length > 0) {
        setActiveInventory(currentBranchInvs[0]);
      } else if (currentBranchInvs.length === 0) {
        setActiveInventory(null);
      }
    }
  }, [branchInventories, activeBranch, activeInventory, setActiveInventory]);




  // Client Side In-Memory Search Processing Engine
  const displayProducts = useMemo(() => {
    const products = activeInventory?.products || [];
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product: Product) =>
        product.title?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query)
    );
  }, [activeInventory, searchQuery]);




  // App Level Security Guards
  const isGlobalLoading = authLoading || branchLoading;

  if (isGlobalLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500 font-mono tracking-wide">
          <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
          Syncing backend ledgers...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !merchantProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-sm text-red-600 font-mono bg-red-50 px-4 py-2 rounded-md border border-red-100 shadow-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Unauthorized access setup layout or missing registration data.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12 selection:bg-emerald-100 selection:text-emerald-900">
        
        {/* PREMIUM GLOBAL HEADER BAR */}
        <header className="bg-white  px-6 py-4 sticky top-0 z-20   ">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center rounded-xl shadow-sm transition-transform duration-200 hover:scale-[1.02]">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-[15px] font-semibold tracking-tight text-slate-900">
                  {merchantProfile.shopName || 'Merchant Space'}
                </h1>
                <p className="text-emerald-600 text-xs font-medium tracking-wide mt-0.5">Live Operational Node</p>
              </div>
            </div>

            {/* BRANCH CONTROLLER REGION */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select 
                  value={activeBranch?.unique_id || activeBranch?.id || ''} 
                  onChange={(e) => { 
                    const selected = branches?.find((b: Branch) => String(b.unique_id || b.id) === e.target.value); 
                    setActiveBranch(selected || null); 
                  }} 
                  className="w-full min-w-[200px] max-w-[240px] appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-10 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
                  disabled={!branches || branches.length === 0}
                >
                  {branches?.length > 0 ? (
                    branches.map((branch: Branch) => (
                      <option key={branch.unique_id || branch.id} value={branch.unique_id || branch.id}>
                        {branch.branchName} {branch.isPrimary ? ' (HQ)' : ''}
                      </option>
                    ))
                  ) : (
                    <option value="">No active branches setup</option>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE OPERATIONS ENVIRONMENT */}
        <main className="max-w-7xl mx-auto px-6 mt-6">
          
          {/* LEDGER TAB CONTROL DECKS */}
         {activeBranch && branchInventories?.length > 0 && !inventoryFetchingError && !isFullscreen && (
  <div className="border-b border-slate-200 mb-6 w-full">
    <nav 
      className="flex space-x-6 overflow-x-auto pb-px scrollbar-hide" 
      aria-label="Inventory Tabs"
    >
      {branchInventories
        .filter((invent: Inventory) => {
          const targetId = String(invent.parrentBranch?.unique_id || invent.parrentBranch || '');
          const currentId = String(activeBranch.unique_id || activeBranch.id || '');
          return targetId === currentId;
        })
        .map((inv: Inventory) => {
          const isActive = activeInventory?.inventoryID === inv.inventoryID;
          
          return (
            <button
              key={inv.inventoryID}
              onClick={() => setActiveInventory(inv)}
              className={`
                group inline-flex items-center gap-2 cursor-pointer whitespace-nowrap 
                border-b-2 py-2.5 px-1 text-sm font-medium transition-all duration-200 -mb-px
                ${isActive 
                  ? 'border-slate-900 text-slate-900 font-semibold' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}
              `}
            >
              <span className="tracking-wide">{inv.inventoryTitle}</span>
              
              {inv.inventoryLocked && (
                <Lock className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-500 transition-colors" />
              )}
              
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold font-mono transition-colors ${
                  isActive 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                {inv.products?.length || 0}
              </span>
            </button>
          );
        })}
    </nav>
  </div>
)}


          {/* INTERNAL ROUTING UI STATIONS */}
          {inventoryLoading && (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-7 w-7 animate-spin mb-3 text-slate-900" />
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Retrieving merchant ledgers...</p>
            </div>
          )}

          {!activeBranch && !inventoryLoading && (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200/70 shadow-sm mt-4">
              <Store className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">No Branch Selected</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                Please select or create a storefront branch node layout to compute inventory datasets.
              </p>
            </div>
          )}

          {inventoryFetchingError && !inventoryLoading && (
             <div className="text-center py-16 bg-white rounded-xl border border-red-100 shadow-sm mt-4">
               <AlertCircle className="mx-auto h-10 w-10 text-red-400 mb-3" />
               <h3 className="text-sm font-semibold text-slate-900">System Fetch Desync</h3>
               <p className="text-xs font-mono text-slate-500 mt-1 max-w-sm mx-auto">{inventoryFetchingError}</p>
               <button 
                 onClick={() => activeBranch && fetchBranchInventories(activeBranch.unique_id || activeBranch.id)}
                 className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-50 hover:bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-900 border border-slate-200 transition-all cursor-pointer"
               >
                 Try Again
               </button>
             </div>
          )}

          {activeBranch && !activeInventory && !inventoryFetchingError && !inventoryLoading && (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200/70 shadow-sm mt-4">
              <Package className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">No Inventory Ledger Tracked</h3>
              <p className="mt-1 text-sm text-slate-500">
                No tracking ledger currently mapped to: 
                <span className="text-emerald-600 font-semibold font-mono text-[13px] ml-1">{activeBranch.branchName}</span>
              </p>
              <button
                onClick={() => setOpenProductCreateForm(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> create Inventory Ledger
              </button>
            </div>
          )}

          {/* ACTIVE WORKSPACE GRID ENGINE */}
          {activeBranch && activeInventory && !inventoryLoading && !inventoryFetchingError && (
            <div className="space-y-5">
              
              {/* LEDGER STRATIFICATION METRIC SHEETS */}
              {showSummary &&  !isFullscreen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
                  <StatMetric label="Total Lines" value={displayProducts.length} />
                  <StatMetric
                    label="Value (Est)"
                    value={`KES ${(activeInventory.totalInventoryValue || 0).toLocaleString()}`}
                    type="success"
                  />
                  <StatMetric
                    label="Low Stock Items"
                    value={activeInventory.lowStockItems || 0}
                    alert={(activeInventory.lowStockItems || 0) > 0}
                    type="warning"
                  />
                  <StatMetric
                    label="Stockouts"
                    value={activeInventory.outOfStockItems || 0}
                    alert={(activeInventory.outOfStockItems || 0) > 0}
                    type="critical"
                  />
                </div>
              )}

              {/* CONSOLIDATED DATA VIEW MATRICES */}
              <div className="bg-white border border-slate-200/70 rounded-xl shadow-sm overflow-hidden">
                
                {/* INTERACTIVE WORKSPACE FILTERS */}
                <div className="border-b border-slate-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-sm placeholder-slate-400 focus:bg-white focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 transition-all"
                      placeholder="Search SKU or item names..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setOpenInventoryFilterDrawer(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950 cursor-pointer"
                    >
                      <Filter className="h-3.5 w-3.5" /> Filter
                    </button>
                    
                    <button
                      onClick={() => setOpenProductCreateForm(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 cursor-pointer"
                    >
                      <PlusSquare className="h-3.5 w-3.5" /> 
                    </button>



                    <button
                      onClick={() => setOpenSamrtProductOnboard(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" color={"pink"} /> 
                      <PlusSquare className="h-3.5 w-3.5" color={"white"}  /> 

                    </button>


                    
                    <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

                    {!isFullscreen && (
                      <button 
                        onClick={() => setShowSummary(prev => !prev)} 
                        title={showSummary ? 'Hide Summary Deck' : 'Show Summary Deck'}  
                        className={`p-2 cursor-pointer rounded-lg transition-all duration-200 border ${
                          showSummary 
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80'  
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {showSummary ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}

                    {showSummary && (
                      <button
                        onClick={() => setIsFullscreen(prev => !prev)}
                        title={isFullscreen ? 'Exit Full Screen' : 'View Full Screen'}
                        className={`p-2 rounded-lg transition-all duration-200 border cursor-pointer ${
                          isFullscreen 
                            ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* SYSTEM GRID VIEW AREA */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-mono">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-[10px] uppercase tracking-wider">Item Details</th>
                        <th className="px-6 py-3 font-semibold text-[10px] uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Unit Pricing</th>
                        <th className="px-6 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Available Allocation</th>
                        <th className="px-6 py-3 font-semibold text-[10px] uppercase tracking-wider">System Status</th>
                        <th className="px-6 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Context Mapping</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                      {displayProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                            <Package className="h-8 w-8 mx-auto mb-3 text-slate-300" />
                            <p className="text-sm font-medium text-slate-700">No core items allocated</p>
                            <p className="text-xs mt-1 text-slate-400 max-w-md mx-auto whitespace-normal leading-relaxed">
                              Add products using the operational toolbar above to register datasets on this ledger.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        displayProducts.map((product: Product) => (
                          <tr key={product.unique_id || product.id} className="hover:bg-slate-50/60 transition-colors group">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
                                  <img
                                    className="h-full w-full object-cover"
                                    src={product.primaryImage || '/api/placeholder/40/40'}
                                    alt={product.title}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/w3.org/w3.org/w3.org/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900 text-sm">{product.title}</div>
                                  <div className="text-[11px] font-medium text-slate-400 tracking-wide mt-0.5">{product.category || 'Unassigned'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600 border border-slate-200/60">
                                {product.sku || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <div className="font-semibold text-slate-900 text-sm">
                                KES {product.dealPrice?.toLocaleString() || 0}
                              </div>
                              {product.originalPrice > product.dealPrice && (
                                <div className="text-[11px] text-slate-400 line-through mt-0.5 font-mono">
                                  KES {product.originalPrice.toLocaleString()}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5 font-mono text-sm">
                                <span className="font-bold text-slate-950">{product.stockQuantity || 0}</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-xs text-slate-400" title="Reserved Metrics Portfolio">
                                  {product.reservedQuantity || 0}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <StatusIndicator
                                available={product.isAvailable !== false}
                                stock={product.stockQuantity || 0}
                                threshold={product.minimumStockThreshold || 5}
                              />
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer" title="Transfer Stock Nodes">
                                  <ArrowRightLeft className="h-3.5 w-3.5" />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer" title="Settings Layout Configuration">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* BOTTOM VISUAL COUNTER DECK */}
                <div className="border-t border-slate-150 bg-slate-50/50 px-6 py-3.5 flex items-center justify-between text-xs font-mono font-medium text-slate-400">
                  <span>SYSTEM FEED STATUS: BALANCED</span>
                  <span className="text-slate-500">Rendering {displayProducts.length} Ledger Records</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DETACHED OVERLAY INJECTIONS */}
      {openProductCreateForm &&  !openSmartProducOnboard && (
        <ProductCreateForm onCancel={() => setOpenProductCreateForm(false)} isOpen={openProductCreateForm} active_inventory={activeInventory} />
      )}

      {openSmartProducOnboard && !openProductCreateForm && (
      <SmartProductOnboardForm onCancel={()=>setOpenSamrtProductOnboard(false)} /> 
      
      )}

      
      {openInventoryFilterDrawer &&  !openProductCreateForm && !openSmartProducOnboard && (
        <InventoryFilterDrawer isOpen={openInventoryFilterDrawer} onClose={() => setOpenInventoryFilterDrawer(false)} />
      )}



      
    </>
  );
}

// =============================================================================
// SUB-METRIC VISUAL MODULES
// =============================================================================

interface StatMetricProps {
  label: string;
  value: string | number;
  alert?: boolean;
  type?: 'default' | 'warning' | 'critical' | 'success';
}

function StatMetric({ label, value, alert = false, type = 'default' }: StatMetricProps) {
  const config = {
    default: { border: 'border-slate-200/80', leftAccent: 'border-l-slate-300', dot: 'bg-slate-400' },
    success: { border: 'border-emerald-200/60', leftAccent: 'border-l-emerald-500', dot: 'bg-emerald-500' },
    warning: { border: 'border-amber-200/60', leftAccent: 'border-l-amber-500', dot: 'bg-amber-500' },
    critical: { border: 'border-red-200/60', leftAccent: 'border-l-red-500', dot: 'bg-red-500' },
  };

  const style = config[type] || config.default;

  return (
    <div className={`bg-white border-y border-r border-l-[3px] ${style.border} ${style.leftAccent} rounded-xl p-4 flex flex-col justify-between shadow-sm transition-all hover:shadow-md/50`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-slate-400">
          {label}
        </span>
        {alert && (
          <span className="relative flex h-1.5 w-1.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 style.dot" />
          </span>
        )}
      </div>
      <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">
        {value}
      </span>
    </div>
  );
}

interface StatusIndicatorProps {
  available: boolean;
  stock: number;
  threshold: number;
}

function StatusIndicator({ available, stock, threshold }: StatusIndicatorProps) {
  const baseStyle = "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide border";
  
  if (!available) {
    return (
      <div className={`${baseStyle} bg-slate-50 border-slate-200 text-slate-500`}>
        <div className="h-1 w-1 rounded-full bg-slate-400" />
        <span>UNLISTED</span>
      </div>
    );
  }

  if (stock === 0) {
    return (
      <div className={`${baseStyle} bg-rose-50 border-rose-100 text-rose-700`}>
        <div className="h-1 w-1 rounded-full bg-rose-500" />
        <span>OUT OF STOCK</span>
      </div>
    );
  }

  if (stock <= threshold) {
    return (
      <div className={`${baseStyle} bg-amber-50 border-amber-100 text-amber-700`}>
        <div className="h-1 w-1 rounded-full bg-amber-500" />
        <span>LOW STOCK</span>
      </div>
    );
  }

  return (
    <div className={`${baseStyle} bg-emerald-50 border-emerald-100 text-emerald-700`}>
      <div className="h-1 w-1 rounded-full bg-emerald-500" />
      <span>ACTIVE</span>
    </div>
  );
}
