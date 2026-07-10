import React, { useEffect, useState } from "react";
import { 
  Building2, MapPin, Phone, Mail, Clock, ShieldCheck, 
  AlertTriangle, Package, DollarSign, Layers, X, 
  CheckCircle, XCircle, ToggleLeft, Edit3, Plus, Search, Filter,
  Tag, Map, Briefcase, Globe, CheckSquare, Eye
} from "lucide-react";

import { useBranch } from "../../Providers/BranchProvider";
import { useAuth } from "../../Providers/AuthProvider";

interface MiniCatalogItemType {
  unique_id: string;
  title: string;
  sku?: string;
  category?: string;
  dealPrice: number;
  stockQuantity: number;
  minimumStockThreshold: number;
  primaryImage?: string;
  placeHolderimageUrl?: string;
}

interface EnhancedInventoryType {
  unique_id: string;
  inventoryID: string;
  inventoryTitle: string;
  inventoryDescription: string;
  inventoryLocked: boolean;
  totalProducts: number;
  totalInventoryValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  products: MiniCatalogItemType[];
}

export default function BranchViewModal({
  branchId,
  isOpen,
  onClose
}: {
  branchId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  
  const { editingBranch, getIndividualBranch } = useBranch();

  useEffect(() => {
    let isMounted = true;

    async function fetchNodeDetails() {
      if (!isOpen || !branchId) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const data = await getIndividualBranch(branchId);
        if (isMounted) setSelectedBranch(data);
      } catch (err) {
        if (isMounted) {
          setError("Failed to synchronize branch data parameters.");
          console.error(err);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchNodeDetails();
    return () => { isMounted = false; };
  }, [isOpen, branchId, getIndividualBranch]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const activeInventory: EnhancedInventoryType | null = selectedBranch?.inventories?.[0] || null;
  const catalogItems: MiniCatalogItemType[] = activeInventory?.products || [];

  const filteredCatalog = catalogItems.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    if (stockFilter === "low") {
      return matchesSearch && item.stockQuantity <= item.minimumStockThreshold && item.stockQuantity > 0;
    }
    if (stockFilter === "out") {
      return matchesSearch && item.stockQuantity === 0;
    }
    return matchesSearch;
  });

  const toggleBranchActiveState = () => {
    if (branchId && selectedBranch) {
      editingBranch(branchId, { isActive: !selectedBranch.isActive });
      setSelectedBranch((prev: any) => prev ? { ...prev, isActive: !prev.isActive } : null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Core Window */}
      <div className="relative z-10 flex h-[96vh] w-full max-w-7xl flex-col rounded-2xl bg-gray-50 text-gray-600 shadow-2xl transition-all mx-4">
        
        {/* --- HEADER BLOCK --- */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 bg-white rounded-t-2xl">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                {isLoading ? "Syncing Branch Manifest..." : selectedBranch?.branchName}
              </h1>
              {!isLoading && selectedBranch?.isPrimary && (
                <span className="inline-flex items-center rounded-md bg-gray-950 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Primary Hub
                </span>
              )}
              {!isLoading && selectedBranch?.isOnline && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Connection
                </span>
              )}
            </div>
            {!isLoading && selectedBranch && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                <p className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-gray-400" /> 
                  Code Vector: <span className="font-mono font-semibold text-gray-700">{selectedBranch.branchCode || "UNASSIGNED"}</span>
                </p>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <p className="capitalize">Category: <span className="font-semibold text-gray-700">{selectedBranch.branchCategory?.replace("-", " ")}</span></p>
              </div>
            )}
          </div>
          
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm cursor-pointer"
          >
            <span>Close Panel</span>
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* --- CORE BODY PANEL --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="py-12 text-center bg-white rounded-xl border border-red-100 p-6">
              <AlertTriangle className="mx-auto h-10 w-10 text-red-500 mb-2" />
              <p className="text-sm font-semibold text-red-800">{error}</p>
            </div>
          ) : !selectedBranch ? (
            <div className="py-12 text-center bg-white rounded-xl border border-gray-200">
              <Building2 className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">Node cluster could not be found.</p>
            </div>
          ) : (
            <>
              {/* TELEMETRY STATS GRID */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">SKU Profiles</p>
                    <h3 className="text-xl font-extrabold text-gray-900">{activeInventory?.totalProducts || 0}</h3>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2.5 text-gray-500"><Layers className="h-5 w-5" /></div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Asset Inventory Value</p>
                    <h3 className="text-xl font-extrabold text-gray-900">
                      <span className="text-xs font-normal text-gray-400 mr-0.5">KSh</span>
                      {activeInventory?.totalInventoryValue?.toLocaleString() || 0}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2.5 text-gray-600"><DollarSign className="h-5 w-5" /></div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-0.5">Low Stock Flags</p>
                    <h3 className={`text-xl font-extrabold ${(activeInventory?.lowStockItems || 0) > 0 ? "text-amber-600" : "text-gray-900"}`}>
                      {activeInventory?.lowStockItems || 0}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600"><AlertTriangle className="h-5 w-5" /></div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-0.5">Depleted Balances</p>
                    <h3 className={`text-xl font-extrabold ${(activeInventory?.outOfStockItems || 0) > 0 ? "text-red-600" : "text-gray-900"}`}>
                      {activeInventory?.outOfStockItems || 0}
                    </h3>
                  </div>
                  <div className="rounded-lg bg-red-50 p-2.5 text-red-600"><XCircle className="h-5 w-5" /></div>
                </div>
              </div>

              {/* TWO COLUMN CONTENT INTERFACE */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                
                {/* LEFT SIDEBAR DATA CLUSTERS */}
                <div className="xl:col-span-1 space-y-6">
                  
                  {/* System Description Banner alternative if null */}
                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Context Summary</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {selectedBranch.branchDescription || (
                        <span className="text-gray-400 italic">No custom public administrative description configured for this operational node matrix.</span>
                      )}
                    </p>
                  </div>

                  {/* Logistics Routing Vector */}
                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3.5">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Logistics & Routing Address</h3>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex gap-3">
                        <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">{selectedBranch.buildingName || "Physical Landmark Unset"}</p>
                          <p className="text-gray-600">{selectedBranch.physicalAddress}</p>
                          <p className="text-gray-500 font-medium">
                            {selectedBranch.cityTown}, {selectedBranch.county} County, {selectedBranch.country}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                        <Clock className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-semibold text-gray-900">{selectedBranch.operatingHours || "Hours Unconfigured"}</p>
                          <p className="text-gray-400 text-[11px]">Shift Cycle Window: {selectedBranch.opens} to {selectedBranch.closes}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Node Management Supervisor Panel */}
                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3.5">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Facility Supervisor</h3>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-900 flex items-center justify-center font-bold text-white text-xs">
                        {selectedBranch.managerName ? selectedBranch.managerName.split(" ").map((n: string) => n[0]).join("").toUpperCase() : "BM"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{selectedBranch.managerName || "Awaiting Assignment"}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">Designated Node Supervisor</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 text-xs space-y-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        {selectedBranch.managerPhone ? (
                          <a href={`tel:${selectedBranch.managerPhone}`} className="hover:underline font-mono text-gray-900">{selectedBranch.managerPhone}</a>
                        ) : <span className="text-gray-400 italic">No contact phone linked</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {selectedBranch.managerEmail ? (
                          <a href={`mailto:${selectedBranch.managerEmail}`} className="hover:underline text-gray-900">{selectedBranch.managerEmail}</a>
                        ) : <span className="text-gray-400 italic">No email ledger mapping</span>}
                      </div>
                    </div>
                  </div>

                  {/* Core Matrix Compliance Flags */}
                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Compliance Matrix Vectors</h3>
                    
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg bg-gray-50 p-2 border border-gray-100 flex flex-col gap-1">
                        <span className="text-gray-400 font-medium">Verification</span>
                        <span className={`font-bold inline-flex items-center gap-1 ${selectedBranch.branchVerified ? "text-emerald-700" : "text-amber-700"}`}>
                          <ShieldCheck className="h-3 w-3" /> {selectedBranch.branchVerified ? "Verified Node" : "Pending Sync"}
                        </span>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-2 border border-gray-100 flex flex-col gap-1">
                        <span className="text-gray-400 font-medium">Field Inspection</span>
                        <span className={`font-bold inline-flex items-center gap-1 ${selectedBranch.branchInspected ? "text-emerald-700" : "text-amber-600"}`}>
                          <Eye className="h-3 w-3" /> {selectedBranch.branchInspected ? "Passed Inspection" : "Awaiting Review"}
                        </span>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-2 border border-gray-100 flex flex-col gap-1">
                        <span className="text-gray-400 font-medium">Routing Locks</span>
                        <span className={`font-bold inline-flex items-center gap-1 ${selectedBranch.branchBlocked ? "text-red-700" : "text-emerald-700"}`}>
                          <XCircle className="h-3 w-3" /> {selectedBranch.branchBlocked ? "System Blocked" : "Active & Open"}
                        </span>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-2 border border-gray-100 flex flex-col gap-1">
                        <span className="text-gray-400 font-medium">Fulfillment Ledger</span>
                        <span className={`font-bold inline-flex items-center gap-1 ${selectedBranch.isAcceptingOrders ? "text-emerald-700" : "text-red-700"}`}>
                          <CheckSquare className="h-3 w-3" /> {selectedBranch.isAcceptingOrders ? "Routing Open" : "Locked Pipeline"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT SYSTEM PANEL: SKU REGISTER MATRIX */}
                <div className="xl:col-span-2">
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col h-full overflow-hidden">
                    
                    {/* Catalog Header & Filter Control Blocks */}
                    <div className="p-4 border-b border-gray-100 space-y-4 bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h2 className="text-base font-bold text-gray-900">Branch Stock Ledger</h2>
                          <p className="text-xs text-gray-400 mt-0.5">Physical items linked to this operational node storage core.</p>
                        </div>
                        <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition cursor-pointer">
                          <Plus className="h-3.5 w-3.5" /> Direct Stock Inbound
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search product matrix parameters by identifier or title..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-xs outline-none focus:border-gray-900 focus:bg-white transition"
                          />
                        </div>
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                          <select 
                            value={stockFilter} 
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-8 text-xs outline-none focus:border-gray-900 focus:bg-white transition appearance-none cursor-pointer"
                          >
                            <option value="all">All Quantities Ledger</option>
                            <option value="low">Low Threshold Alerts</option>
                            <option value="out">Depleted Ledger Stock</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Table Window Viewport */}
                    <div className="flex-1 overflow-auto bg-white min-h-[350px]">
                      <table className="w-full text-left text-xs text-gray-600 whitespace-nowrap">
                        <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500 sticky top-0 z-10 border-b border-gray-100">
                          <tr>
                            <th className="px-4 py-2.5">Mapped Item Profile</th>
                            <th className="px-4 py-2.5">SKU Reference</th>
                            <th className="px-4 py-2.5 text-right">Retail Unit Valuation</th>
                            <th className="px-4 py-2.5 text-center">In-Stock Metric</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredCatalog.length > 0 ? (
                            filteredCatalog.map((item) => {
                              const isLow = item.stockQuantity <= item.minimumStockThreshold && item.stockQuantity > 0;
                              const isOut = item.stockQuantity === 0;
                              return (
                                <tr key={item.unique_id} className="hover:bg-gray-50/50 transition">
                                  <td className="px-4 py-2.5 flex items-center gap-3">
                                    <img 
                                      src={item.primaryImage || item.placeHolderimageUrl || "https://via.placeholder.com/40"} 
                                      alt="" 
                                      className="h-8 w-8 rounded-md object-cover border border-gray-200 bg-gray-50"
                                    />
                                    <div className="truncate max-w-[180px]">
                                      <span className="block font-semibold text-gray-900 truncate">{item.title}</span>
                                      <span className="block text-[10px] text-gray-400">{item.category || "General Core"}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2.5 font-mono text-gray-500">{item.sku || "—"}</td>
                                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">{item.dealPrice.toLocaleString()}</td>
                                  <td className="px-4 py-2.5 text-center">
                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                                      isOut ? "bg-red-50 text-red-700 border border-red-100" :
                                      isLow ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                      "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    }`}>
                                      {item.stockQuantity} Pcs
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-4 py-16 text-center text-gray-400">
                                <Package className="mx-auto h-8 w-8 mb-2 stroke-[1.5] text-gray-300" />
                                <p className="text-xs font-medium">No storage nodes detected in active stock ledger.</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">Initialize stock balances or connect new parameters.</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
        
        {/* --- DYNAMIC ACTION FOOTER BAR --- */}
        <div className="flex items-center justify-between border-t border-gray-200 p-4 bg-white rounded-b-2xl">
          {selectedBranch && (
            <button 
              onClick={toggleBranchActiveState}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition border cursor-pointer ${
                selectedBranch.isActive 
                  ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50" 
                  : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              }`}
            >
              <ToggleLeft className={`h-4 w-4 ${selectedBranch.isActive ? "text-emerald-500" : "text-red-500"}`} />
              {selectedBranch.isActive ? "Node Routing Online" : "Routing Suspended"}
            </button>
          )}
          
          <div className="flex gap-2.5 ml-auto">
            <button 
              onClick={onClose}
              className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
            >
              Dismiss Control View
            </button>
            {!isLoading && selectedBranch && (
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition cursor-pointer">
                <Edit3 className="h-3.5 w-3.5" /> Modify Node Architecture
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
