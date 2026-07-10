import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../Providers/AuthProvider';
import { useBranch } from '../Providers/BranchProvider'; 
import { useInventory } from '../Providers/InventoryProvider';
import { ProductCreateForm } from './onboarding/ProductCreateForm';
import { InventoryFilterDrawer } from './onboarding/InventoryFilterDrawer';
import { Search, Plus, Filter, MoreHorizontal, MapPin, Package, ArrowRightLeft, Store, Lock, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';

export function InventoryView() {
  // 1. CONTEXT INFRASTRUCTURE
  const { merchantProfile, isAuthenticated, isLoading: authLoading } = useAuth();
  const { branches, isLoading: branchLoading } = useBranch();
  
  const {
    branchInventories, 
    activeInventory, 
    setActiveInventory, 
    fetchBranchInventories,
    inventoryFetchingError,
    inventoryLoading
  } = useInventory();
  
  // 2. LOCAL WORKSPACE STATE
  const [activeBranch, setActiveBranch] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openInventoryFilterDrawer, setOpenInventoryFilterDrawer] = useState(false);
  const [openProductCreateForm, setOpenProductCreateForm] = useState(false);

  // 3. SYNCHRONIZATION EFFECTS
  
  // Set default fallback active branch when the merchant branches array resolves
  useEffect(() => {
    if (branches && branches.length > 0) {
      const primary = branches.find((b: any) => b.isPrimary) || branches[0];
      setActiveBranch(primary);
    } else {
      setActiveBranch(null);
    }
  }, [branches]);

  // Fetch inventories whenever the active branch changes
  useEffect(() => {
    if (activeBranch) {
      fetchBranchInventories(activeBranch.unique_id || activeBranch.id); 
    }
  }, [activeBranch, fetchBranchInventories]);

  // Auto-select the first inventory tab when inventories load for a new branch
  useEffect(() => {
    if (activeBranch && branchInventories?.length > 0) {
      const currentBranchInvs = branchInventories.filter((invent: any) => {
        const targetId = String(invent.parrentBranch?.unique_id || invent.parrentBranch || '');
        const currentId = String(activeBranch.unique_id || activeBranch.id || '');
        return targetId === currentId;
      });

      const isActiveValid = currentBranchInvs.some((inv: any) => inv.inventoryID === activeInventory?.inventoryID);

      if (!isActiveValid && currentBranchInvs.length > 0) {
        setActiveInventory(currentBranchInvs[0]);
      } else if (currentBranchInvs.length === 0) {
        setActiveInventory(null);
      }
    }
  }, [branchInventories, activeBranch, activeInventory, setActiveInventory]);

  // 4. CLIENT SIDE DATA PROCESSING Engine
  const displayProducts = useMemo(() => {
    const products = activeInventory?.products || [];
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product: any) =>
        product.title?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query)
    );
  }, [activeInventory, searchQuery]);

  // 5. GLOBAL ROUTING & ENGINE GUARDS
  const isGlobalLoading = authLoading || branchLoading;

  if (isGlobalLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500 font-mono tracking-wide">
          <Loader2 className="h-4 w-4 animate-spin" />
          Syncing backend ledgers...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !merchantProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-sm text-red-500 font-mono bg-red-50 px-4 py-2 rounded-md border border-red-100 shadow-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Unauthorized access setup layout or missing registration data.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12 selection:bg-emerald-100 selection:text-emerald-900">
        
        {/* TOP BAR BRAND BAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center rounded-lg shadow-sm">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-[15px] font-semibold tracking-tight text-slate-900">
                  {merchantProfile.shopName || 'Merchant Space'}
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-0.5">
                 Direct Merchant Operations Engine
                </p>
              </div>
            </div>

            {/* BRANCH CONTROL SWITCHER */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                <select 
                  value={activeBranch?.unique_id || activeBranch?.id || ''} 
                  onChange={(e) => { 
                    const selected = branches?.find((b: any) => String(b.unique_id || b.id) === e.target.value); 
                    setActiveBranch(selected || null); 
                  }} 
                  className="w-full sm:w-64 appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
                  disabled={!branches || branches.length === 0}
                >
                  {branches?.length > 0 ? (
                    branches.map((branch: any) => (
                      <option key={branch.unique_id || branch.id} value={branch.unique_id || branch.id}>
                        {branch.branchName} {branch.isPrimary ? '(HQ)' : ''}
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



        

        {/* DATA CONTAINER AREA */}
        <main className="max-w-7xl mx-auto px-6 mt-8">
          
          {/* INVENTORY TABS CONTROL */}
          {activeBranch && branchInventories?.length > 0 && !inventoryFetchingError && (
            <div className="border-b border-slate-200 mb-8">
              <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                {branchInventories
                  .filter((invent: any) => {
                    const targetId = String(invent.parrentBranch?.unique_id || invent.parrentBranch || '');
                    const currentId = String(activeBranch.unique_id || activeBranch.id || '');
                    return targetId === currentId;
                  })
                  .map((inv: any) => {
                    const isActive = activeInventory?.inventoryID === inv.inventoryID;
                    return (
                      <button
                        key={inv.inventoryID}
                        onClick={() => setActiveInventory(inv)}
                        className={`
                          group inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-all duration-200
                          ${isActive ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}
                        `}
                      >
                        {inv.inventoryTitle}
                        {inv.inventoryLocked && <Lock className="h-3.5 w-3.5 text-slate-400" />}
                        <span
                          className={`ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide transition-colors ${
                            isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
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


          

          {/* LOCALIZED LOADING STATE */}
          {inventoryLoading && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-slate-300" />
              <p className="text-sm font-medium">Retrieving merchant ledgers...</p>
            </div>
          )}


          

          {/* NO BRANCH FALLBACK UI */}
          {!activeBranch && !inventoryLoading && (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm mt-8">
              <Store className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">No Branch Selected</h3>
              <p className="mt-1 text-sm text-slate-500">
                Please select or create a storefront branch node layout to compute inventory datasets.
              </p>
            </div>
          )}




          {/* FETCH ERROR UI */}
          {inventoryFetchingError && !inventoryLoading && (
             <div className="text-center py-16 bg-white rounded-xl border border-red-100 shadow-sm mt-8">
               <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
               <h3 className="text-sm font-semibold text-slate-900">Error</h3>
               <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">{inventoryFetchingError}</p>
               <button 
                 onClick={() => activeBranch && fetchBranchInventories(activeBranch.unique_id || activeBranch.id)}
                 className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[transparent]  hover:text-green-500 hover:cursor-pointer  px-4 py-2 text-sm font-medium text-green-700 hover:bg-slate-50 transition-colors"
               >
                 Try Again
               </button>
             </div>
          )}

          

          {/* GENUINE MISSING INVENTORY RECORD FALLBACK */}
          {activeBranch && !activeInventory && !inventoryFetchingError && !inventoryLoading && (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm mt-8">
              <Package className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">No Inventory Ledger Tracked</h3>
              <p className="mt-1 text-sm text-slate-500">
                No tracking ledger currently mapped to: 
                <span className="text-emerald-600 font-medium font-mono text-[13px] ml-1">{activeBranch.branchName}</span>
              </p>
              <button
                onClick={() => setOpenProductCreateForm(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" /> Initialize Inventory
              </button>
            </div>
          )}

          {/* LIVE WORKSPACE WORKBENCH */}
          {activeBranch && activeInventory && !inventoryLoading && !inventoryFetchingError && (
            <div className="space-y-6">
              {/* LEDGER STAT METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatMetric label="Total Lines" value={displayProducts.length} />
                <StatMetric
                  label="Value (Est)"
                  value={`KES ${(activeInventory.totalInventoryValue || 0).toLocaleString()}`}
                  type="success"
                />
                <StatMetric
                  label="Low Stock"
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

              {/* CORE AGGREGATION VIEW TABLE */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* TOOLBAR CONTROLS */}
                <div className="border-b border-slate-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                      placeholder="Search SKU or item names..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setOpenInventoryFilterDrawer(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
                    >
                      <Filter className="h-4 w-4" /> Filter
                    </button>
                    <button
                      onClick={() => setOpenProductCreateForm(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 focus:outline-none"
                    >
                      <Plus className="h-4 w-4" /> New Item
                    </button>
                  </div>
                </div>

                {/* THE GRID WORKSPACE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider">Item Details</th>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider text-right">Unit Price</th>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider text-right">Available</th>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                            <Package className="h-10 w-10 mx-auto mb-4 text-slate-300" />
                            <p className="text-sm font-medium text-slate-600">No items allocated</p>
                            <p className="text-xs mt-1 text-slate-400">
                              As part of the direct-to-merchant setup, add your products using the "New Item" button above to populate your inventory ledger.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        displayProducts.map((product: any) => (
                          <tr key={product.unique_id || product.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex-shrink-0 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
                                  <img
                                    className="h-full w-full object-cover"
                                    src={product.primaryImage || '/api/placeholder/40/40'}
                                    alt={product.title}
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900">{product.title}</div>
                                  <div className="text-[12px] text-slate-500 mt-0.5">{product.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-mono font-medium text-slate-600 border border-slate-200">
                                {product.sku || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="font-medium text-slate-900">
                                KES {product.dealPrice?.toLocaleString() || 0}
                              </div>
                              {product.originalPrice > product.dealPrice && (
                                <div className="text-[11px] text-slate-400 line-through mt-0.5">
                                  KES {product.originalPrice.toLocaleString()}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="font-semibold text-slate-900">{product.stockQuantity || 0}</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-xs text-slate-500" title="Reserved Metrics">
                                  {product.reservedQuantity || 0}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <StatusIndicator
                                available={product.isAvailable !== false}
                                stock={product.stockQuantity || 0}
                                threshold={product.minimumStockThreshold || 5}
                              />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Transfer Stock Nodes">
                                  <ArrowRightLeft className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors" title="Settings Layout Options">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* VISUAL BREAK FOOTER */}
                <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center justify-between text-xs font-medium text-slate-500 rounded-b-xl">
                  <span>Balanced View: Rendering {displayProducts.length} unique items</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* COMPONENT DRAWER MODAL OVERLAYS */}
      {openProductCreateForm && (
        <ProductCreateForm onClose={() => setOpenProductCreateForm(false)} />
      )}
      {openInventoryFilterDrawer && (
        <InventoryFilterDrawer onClose={() => setOpenInventoryFilterDrawer(false)} />
      )}
    </>
  );
}

// --- SUBMETRIC VISUAL BLOCKS ---

interface StatMetricProps {
  label: string;
  value: string | number;
  alert?: boolean;
  type?: 'default' | 'warning' | 'critical' | 'success';
}

function StatMetric({ label, value, alert = false, type = 'default' }: StatMetricProps) {
  const config = {
    default: { border: 'border-slate-200', leftAccent: 'border-l-slate-200', dot: 'bg-slate-400' },
    success: { border: 'border-emerald-200', leftAccent: 'border-l-emerald-500', dot: 'bg-emerald-500' },
    warning: { border: 'border-amber-200', leftAccent: 'border-l-amber-400', dot: 'bg-amber-400' },
    critical: { border: 'border-red-200', leftAccent: 'border-l-red-500', dot: 'bg-red-500' },
  };

  const style = config[type] || config.default;

  return (
    <div className={`bg-white border-y border-r border-l-[3px] ${style.border} ${style.leftAccent} rounded-xl p-5 flex flex-col justify-between shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">
          {label}
        </span>
        {alert && (
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`} />
          </span>
        )}
      </div>
      <span className="text-2xl font-semibold tracking-tight text-slate-900">
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
  if (!available) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 border border-slate-200 text-slate-600">
        <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        <span className="text-[11px] font-semibold tracking-wide">Unlisted</span>
      </div>
    );
  }

  if (stock === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-1 border border-red-100 text-red-700">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
        <span className="text-[11px] font-semibold tracking-wide">Out of Stock</span>
      </div>
    );
  }

  if (stock <= threshold) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-1 border border-amber-100 text-amber-700">
        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span className="text-[11px] font-semibold tracking-wide">Low Stock</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 border border-emerald-100 text-emerald-700">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      <span className="text-[11px] font-semibold tracking-wide">Active</span>
    </div>
  );
}
