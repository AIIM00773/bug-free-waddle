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
  Loader2, Eye, EyeOff, Maximize2, Minimize2, Sparkles, 
  PlusSquare
} from 'lucide-react';

// =============================================================================
// TYPES & DATA STRUCTURES
// =============================================================================

export interface Product {
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

export interface Branch {
  id?: string | number;
  unique_id?: string;
  branchName: string;
  isPrimary?: boolean;
}

export interface Inventory {
  inventoryID: string | number;
  inventoryTitle: string;
  inventoryLocked?: boolean;
  parrentBranch?: Branch | string | null; // Improved from 'any'
  products?: Product[];
  totalInventoryValue?: number;
  lowStockItems?: number;
  outOfStockItems?: number;
}

type ModalState = 'none' | 'create' | 'smart' | 'filter';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function InventoryView() {
  const { merchantProfile, isAuthenticated, isLoading: authLoading } = useAuth();
  const { branches, isLoading: branchLoading } = useBranch();
  const { 
    branchInventories, 
    activeInventory, 
    setActiveInventory, 
    fetchBranchInventories, 
    inventoryFetchingError,
    inventoryLoading,
    productOnboardingSucess 
  } = useInventory();
  
  // Local UI & Workspace States
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ModalState>('none');
  const [showSummary, setShowSummary] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false); 
  
  // Sync Default Fallback Branch Node
  useEffect(() => { 
    if (branches?.length > 0) { 
      const primary = branches.find((b: Branch) => b.isPrimary) || branches[0]; 
      setActiveBranch(primary);
    } else {
      setActiveBranch(null);
    }
  }, [branches]);

  // Close modals on successful onboarding
  useEffect(() => {
    if (productOnboardingSucess) {
      setActiveModal('none'); 
    }
  }, [productOnboardingSucess]);

  // Reactive Data Fetcher via Active Branch Channel
  useEffect(() => {
    if (activeBranch) {
      const targetId = activeBranch.unique_id || activeBranch.id;
      if (targetId) fetchBranchInventories(targetId); 
    }
  }, [activeBranch, fetchBranchInventories]);

  // Memoized current branch inventories to prevent unnecessary re-renders
  const currentBranchInvs = useMemo(() => {
    if (!activeBranch || !branchInventories) return [];
    const currentId = String(activeBranch.unique_id || activeBranch.id || '');
    
    return branchInventories.filter((invent: Inventory) => {
      const targetId = String(
        (typeof invent.parrentBranch === 'object' ? invent.parrentBranch?.unique_id : invent.parrentBranch) || ''
      );
      return targetId === currentId;
    });
  }, [branchInventories, activeBranch]);

  // Tab Allocation Sync Engine
  useEffect(() => {
    if (activeBranch && currentBranchInvs.length > 0) {
      const isActiveValid = currentBranchInvs.some(
        (inv: Inventory) => inv.inventoryID === activeInventory?.inventoryID
      );

      if (!isActiveValid) {
        setActiveInventory(currentBranchInvs[0]);
      }
    } else if (currentBranchInvs.length === 0) {
      setActiveInventory(null);
    }
  }, [currentBranchInvs, activeBranch, activeInventory, setActiveInventory]);

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
        <div className="flex items-center gap-2 text-sm text-red-600 font-mono bg-red-50 px-4 py-2 rounded-md border border-red-100 shadow-sm">
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
        <header className="bg-white px-6 py-4 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-transform duration-200 hover:scale-[1.02]">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-[15px] font-semibold tracking-tight text-slate-900">
                  {merchantProfile.shopName || 'Merchant Space'}
                </h1>
                <p className="mt-0.5 text-xs font-medium tracking-wide text-emerald-600">Live Operational Node</p>
              </div>
            </div>

            {/* BRANCH CONTROLLER REGION */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select 
                  value={activeBranch?.unique_id || activeBranch?.id || ''} 
                  onChange={(e) => { 
                    const selected = branches?.find((b: Branch) => String(b.unique_id || b.id) === e.target.value); 
                    setActiveBranch(selected || null); 
                  }} 
                  className="w-full min-w-[200px] max-w-[240px] appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-10 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
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
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE OPERATIONS ENVIRONMENT */}
        <main className="mx-auto max-w-7xl px-6 mt-6">
          
          {/* LEDGER TAB CONTROL DECKS */}
          {activeBranch && currentBranchInvs.length > 0 && !inventoryFetchingError && !isFullscreen && (
            <div className="mb-6 w-full border-b border-slate-200">
              <nav 
                className="flex space-x-6 overflow-x-auto pb-px scrollbar-hide" 
                aria-label="Inventory Tabs"
              >
                {currentBranchInvs.map((inv: Inventory) => {
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
                        <Lock className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-slate-500" />
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
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="mb-3 h-7 w-7 animate-spin text-slate-900" />
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Retrieving merchant ledgers...</p>
            </div>
          )}

          {!activeBranch && !inventoryLoading && (
            <div className="mt-4 rounded-xl border border-slate-200/70 bg-white py-20 text-center shadow-sm">
              <Store className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">No Branch Selected</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Please select or create a storefront branch node layout to compute inventory datasets.
              </p>
            </div>
          )}

          {inventoryFetchingError && !inventoryLoading && (
            <div className="mt-4 rounded-xl border border-red-100 bg-white py-16 text-center shadow-sm">
              <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
              <h3 className="text-sm font-semibold text-slate-900">System Fetch Desync</h3>
              <p className="mx-auto mt-1 max-w-sm font-mono text-xs text-slate-500">{inventoryFetchingError}</p>
              <button 
                onClick={() => activeBranch && fetchBranchInventories(activeBranch.unique_id || activeBranch.id)}
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 transition-all hover:bg-slate-100"
              >
                Try Again
              </button>
            </div>
          )}

          {activeBranch && !activeInventory && !inventoryFetchingError && !inventoryLoading && (
            <div className="mt-4 rounded-xl border border-slate-200/70 bg-white py-20 text-center shadow-sm">
              <Package className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">No Inventory Ledger Tracked</h3>
              <p className="mt-1 text-sm text-slate-500">
                No tracking ledger currently mapped to: 
                <span className="ml-1 font-mono text-[13px] font-semibold text-emerald-600">{activeBranch.branchName}</span>
              </p>
              <button
                onClick={() => setActiveModal('create')}
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" /> Create Inventory Ledger
              </button>
            </div>
          )}

          {/* ACTIVE WORKSPACE GRID ENGINE */}
          {activeBranch && activeInventory && !inventoryLoading && !inventoryFetchingError && (
            <div className="space-y-5">
              
              {/* LEDGER STRATIFICATION METRIC SHEETS */}
              {showSummary && !isFullscreen && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 animate-in fade-in duration-300">
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
              <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm">
                
                {/* INTERACTIVE WORKSPACE FILTERS */}
                <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 bg-white p-4 sm:flex-row">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-sm placeholder-slate-400 transition-all focus:border-slate-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-950"
                      placeholder="Search SKU or item names..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                    <button
                      onClick={() => setActiveModal('filter')}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
                    >
                      <Filter className="h-3.5 w-3.5" /> Filter
                    </button>
                    
                    <button
                      onClick={() => setActiveModal('create')}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
                    >
                      <PlusSquare className="h-3.5 w-3.5" /> 
                    </button>

                    <button
                      onClick={() => setActiveModal('smart')}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-pink-400" /> 
                      <PlusSquare className="h-3.5 w-3.5 text-white" /> 
                    </button>
                    
                    <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

                    {!isFullscreen && (
                      <button 
                        onClick={() => setShowSummary(prev => !prev)} 
                        title={showSummary ? 'Hide Summary Deck' : 'Show Summary Deck'}  
                        className={`cursor-pointer rounded-lg border p-2 transition-all duration-200 ${
                          showSummary 
                            ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100/80'  
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {showSummary ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}

                    {showSummary && (
                      <button
                        onClick={() => setIsFullscreen(prev => !prev)}
                        title={isFullscreen ? 'Exit Full Screen' : 'View Full Screen'}
                        className={`cursor-pointer rounded-lg border p-2 transition-all duration-200 ${
                          isFullscreen 
                            ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100' 
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* SYSTEM GRID VIEW AREA */}
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap text-left text-sm">
                    <thead className="border-b border-slate-200/80 bg-slate-50/70 font-mono text-slate-500">
                      <tr>
                        <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider">Item Details</th>
                        <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wider">Unit Pricing</th>
                        <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wider">Available Allocation</th>
                        <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider">System Status</th>
                        <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wider">Context Mapping</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                      {displayProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                            <Package className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                            <p className="text-sm font-medium text-slate-700">No core items allocated</p>
                            <p className="mx-auto mt-1 max-w-md whitespace-normal text-xs leading-relaxed text-slate-400">
                              Add products using the operational toolbar above to register datasets on this ledger.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        displayProducts.map((product: Product) => (
                          <tr key={product.unique_id || product.id} className="group transition-colors hover:bg-slate-50/60">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
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
                                  <div className="text-sm font-medium text-slate-900">{product.title}</div>
                                  <div className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-400">{product.category || 'Unassigned'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="inline-flex items-center rounded-md border border-slate-200/60 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-600">
                                {product.sku || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <div className="text-sm font-semibold text-slate-900">
                                KES {product.dealPrice?.toLocaleString() || 0}
                              </div>
                              {product.originalPrice > product.dealPrice && (
                                <div className="mt-0.5 font-mono text-[11px] text-slate-400 line-through">
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
                              <div className="flex items-center justify-end gap-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                                <button className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600" title="Transfer Stock Nodes">
                                  <ArrowRightLeft className="h-3.5 w-3.5" />
                                </button>
                                <button className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900" title="Settings Layout Configuration">
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
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 font-mono text-xs font-medium text-slate-400">
                  <span>SYSTEM FEED STATUS: BALANCED</span>
                  <span className="text-slate-500">Rendering {displayProducts.length} Ledger Records</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DETACHED OVERLAY INJECTIONS */}
      {activeModal === 'create' && (
        <ProductCreateForm 
          onCancel={() => setActiveModal('none')} 
          isOpen={true} 
          active_inventory={activeInventory} 
        />
      )}
      
      {activeModal === 'smart' && (
        <SmartProductOnboardForm 
          onCancel={() => setActiveModal('none')} 
        /> 
      )}
      
      {activeModal === 'filter' && (
        <InventoryFilterDrawer 
          isOpen={true} 
          onClose={() => setActiveModal('none')} 
        />
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
    <div className={`flex flex-col justify-between rounded-xl border-y border-r border-l-[3px] bg-white p-4 shadow-sm transition-all hover:shadow-md/50 ${style.border} ${style.leftAccent}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </span>
        {alert && (
          <span className="relative flex h-1.5 w-1.5">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${style.dot}`} />
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${style.dot}`} />
          </span>
        )}
      </div>
      <span className="font-mono text-xl font-bold tracking-tight text-slate-900">
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
      <div className={`${baseStyle} border-slate-200 bg-slate-50 text-slate-500`}>
        <div className="h-1 w-1 rounded-full bg-slate-400" />
        <span>UNLISTED</span>
      </div>
    );
  }

  if (stock === 0) {
    return (
      <div className={`${baseStyle} border-rose-100 bg-rose-50 text-rose-700`}>
        <div className="h-1 w-1 rounded-full bg-rose-500" />
        <span>OUT OF STOCK</span>
      </div>
    );
  }

  if (stock <= threshold) {
    return (
      <div className={`${baseStyle} border-amber-100 bg-amber-50 text-amber-700`}>
        <div className="h-1 w-1 rounded-full bg-amber-500" />
        <span>LOW STOCK</span>
      </div>
    );
  }

  return (
    <div className={`${baseStyle} border-emerald-100 bg-emerald-50 text-emerald-700`}>
      <div className="h-1 w-1 rounded-full bg-emerald-500" />
      <span>ACTIVE</span>
    </div>
  );
}
