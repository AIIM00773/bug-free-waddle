import React, { useState } from 'react';
import {
  Store,
  Search,
  Plus,
  RefreshCw,
  User,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  CreditCard,
  UserCheck,
  Edit2,
  Trash2,
  Mail,
  Percent
} from 'lucide-react';
import { useDirectMerchants } from '../Providers.tsx/PartnerMerchantsContext';
import type { InternalMerchantProfile } from '../Providers.tsx/PartnerMerchantsContext';

const INITIAL_FORM_STATE = {
  id: '',
  shopName: '',
  vendorOwner: '',
  accountEmail: '',
  commissionCutPercent: '8.0',
  payoutMethod: 'M-Pesa' as InternalMerchantProfile['payoutMethod'],
  verificationStatus: 'pending_review' as InternalMerchantProfile['verificationStatus']
};

export default function PartnerMerchantsView() {
  const {
    merchants,
    isLoading,
    error,
    refreshMerchantData,
    onboardNewVendor,
    updateMerchantDetails,
    updatePlatformTakeRate,
    toggleVendorVerification,
    removeVendorAccount
  } = useDirectMerchants();

  // Search and Mode States
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Focus Targets
  const [targetVendorId, setTargetVendorId] = useState('');
  const [localRateInput, setLocalRateInput] = useState('');
  const [vendorForm, setVendorForm] = useState(INITIAL_FORM_STATE);

  // Filtering Logic
  const filteredMerchants = merchants.filter(m =>
    m.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.vendorOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Trigger Form Config for Dynamic Creation
  const openCreateDrawer = () => {
    setVendorForm(INITIAL_FORM_STATE);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  // Trigger Form Config for Dynamic Update
  const openEditDrawer = (merchant: InternalMerchantProfile) => {
    setVendorForm({
      id: merchant.id,
      shopName: merchant.shopName,
      vendorOwner: merchant.vendorOwner,
      accountEmail: merchant.accountEmail,
      commissionCutPercent: merchant.commissionCutPercent.toString(),
      payoutMethod: merchant.payoutMethod,
      verificationStatus: merchant.verificationStatus
    });
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (drawerMode === 'create') {
        await onboardNewVendor({
          id: vendorForm.id,
          shopName: vendorForm.shopName,
          vendorOwner: vendorForm.vendorOwner,
          accountEmail: vendorForm.accountEmail,
          commissionCutPercent: Number(vendorForm.commissionCutPercent) || 0.0,
          payoutMethod: vendorForm.payoutMethod,
          verificationStatus: vendorForm.verificationStatus
        });
      } else {
        await updateMerchantDetails(vendorForm.id, {
          shopName: vendorForm.shopName,
          vendorOwner: vendorForm.vendorOwner,
          accountEmail: vendorForm.accountEmail,
          payoutMethod: vendorForm.payoutMethod,
          verificationStatus: vendorForm.verificationStatus,
          commissionCutPercent: Number(vendorForm.commissionCutPercent) || 0.0
        });
      }
      setIsDrawerOpen(false);
      setVendorForm(INITIAL_FORM_STATE);
    } catch (err) {
      // Handled by context state logging mechanisms natively
    }
  };

  const openRateModal = (merchant: InternalMerchantProfile) => {
    setTargetVendorId(merchant.id);
    setLocalRateInput(merchant.commissionCutPercent.toString());
    setIsRateModalOpen(true);
  };

  const handleRateOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetVendorId && localRateInput) {
      await updatePlatformTakeRate(targetVendorId, Number(localRateInput));
      setIsRateModalOpen(false);
      setTargetVendorId('');
      setLocalRateInput('');
    }
  };

  const openDeleteModal = (id: string) => {
    setTargetVendorId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (targetVendorId) {
      await removeVendorAccount(targetVendorId);
      setIsDeleteModalOpen(false);
      setTargetVendorId('');
    }
  };

  return (
    <div className="space-y-6 p-1 relative antialiased text-slate-800">
      
      {/* PLATFORM HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Direct Merchant Registry</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Configure underlying local digital merchant accounts, assign transactional platform split percentages, mutate vendor life-cycle status flags, and trace individual storefront profiles.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={refreshMerchantData}
            disabled={isLoading}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-40"
            title="Poll Database Node Cluster"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <button
            type="button"
            onClick={openCreateDrawer}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus size={15} /> Register New Vendor
          </button>
        </div>
      </div>

      {/* ERROR HANDLER NOTIFIER */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-start gap-3 shadow-xs">
          <XCircle size={16} className="shrink-0 text-rose-500 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Transaction Registry Exception</span>
            <p className="text-rose-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* SEARCH AND FILTERS CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="relative w-full max-w-lg">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by shop name, seller representative or unique ID string..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all shadow-inner/5"
          />
        </div>
      </div>

      {/* VENDOR CARDS COMPONENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredMerchants.length > 0 ? (
          filteredMerchants.map((merchant) => (
            <div 
              key={merchant.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-10 w-10 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-100 transition-colors">
                      <Store size={18} />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-xs font-bold text-slate-900 truncate" title={merchant.shopName}>
                        {merchant.shopName}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-500 font-bold tracking-tight bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200/60">{merchant.id}</span>
                        <span className="text-slate-300 text-[10px]">|</span>
                        <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                          <User size={11} className="text-slate-400" /> 
                          <span>Owner: <strong className="text-slate-700 font-bold">{merchant.vendorOwner}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LOGICAL STATUS WRAPPER */}
                  <div className="shrink-0">
                    {merchant.verificationStatus === 'verified' && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 size={11} className="text-emerald-600" /> Active
                      </span>
                    )}
                    {merchant.verificationStatus === 'pending_review' && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                        <AlertTriangle size={11} className="text-amber-500" /> Provisioned
                      </span>
                    )}
                    {merchant.verificationStatus === 'suspended' && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg">
                        <XCircle size={11} className="text-rose-500" /> Suspended
                      </span>
                    )}
                  </div>
                </div>

                {/* MATRIX DATA METRICS */}
                <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 bg-slate-50/50 rounded-xl px-3 text-xs font-semibold">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Commission</span>
                    <span className="text-slate-900 font-bold tracking-tight">{merchant.commissionCutPercent.toFixed(1)}% Split</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Payout Endpoint</span>
                    <div className="flex items-center gap-1 text-slate-800">
                      <CreditCard size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{merchant.payoutMethod}</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Live Catalog</span>
                    <div className="flex items-center gap-1 text-slate-900 font-mono">
                      <Package size={12} className="text-slate-400 shrink-0" />
                      <span>{merchant.totalActiveListings} Items</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER BAR */}
              <div className="flex items-center justify-between text-[11px] font-semibold pt-4 mt-3 border-t border-slate-100/70">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] max-w-[45%] truncate">
                  <Mail size={10} className="shrink-0" />
                  <span className="truncate" title={merchant.accountEmail}>{merchant.accountEmail}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openRateModal(merchant)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                    title="Change Take Rate"
                  >
                    <Percent size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditDrawer(merchant)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                    title="Edit Vendor Parameters"
                  >
                    <Edit2 size={13} />
                  </button>

                  <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                  {/* CONDITIONAL SYSTEM ACTIONS CONTROLS */}
                  {merchant.verificationStatus !== 'verified' && (
                    <button
                      type="button"
                      onClick={() => toggleVendorVerification(merchant.id, 'verified')}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200 rounded-lg transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                    >
                      <UserCheck size={11} /> Approve
                    </button>
                  )}

                  {merchant.verificationStatus === 'verified' && (
                    <button
                      type="button"
                      onClick={() => toggleVendorVerification(merchant.id, 'suspended')}
                      className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100/80 border border-amber-200 rounded-lg transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                    >
                      <XCircle size={11} /> Restrict
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => openDeleteModal(merchant.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg cursor-pointer transition-colors"
                    title="Decommission Account"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-1 xl:col-span-2 bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-16 text-center text-slate-400 font-semibold flex flex-col items-center justify-center gap-2 shadow-inner/5">
            <Store size={24} className="text-slate-300 stroke-[1.5]" />
            <span className="text-xs">No active localized store-nodes mapped to current parameter strings.</span>
          </div>
        )}
      </div>

      {/* UNIFIED ONBOARDING & EDIT DRAWER OVERLAY */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end" onClick={() => setIsDrawerOpen(false)}>
          <div 
            className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900">
                  <Store size={18} className="text-slate-800" />
                  <h3 className="text-sm font-bold">
                    {drawerMode === 'create' ? 'Onboard Internal Merchant Node' : 'Edit Merchant Profile Parameters'}
                  </h3>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <form id="drawerVendorForm" onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                {/* ID FIELD CONTROL - READONLY IN EDIT MODE */}
                <div className="space-y-1">
                  <label className="text-slate-500">System Registry ID Unique String</label>
                  <input 
                    type="text" 
                    required
                    disabled={drawerMode === 'edit'}
                    placeholder="e.g., VN-NBO-402 (Leave empty to auto-generate)" 
                    value={vendorForm.id} 
                    onChange={e => setVendorForm({...vendorForm, id: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 rounded-xl px-3 py-2 text-slate-900 font-mono tracking-tight focus:bg-white focus:outline-hidden focus:border-slate-400" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Shop / Storefront Trade Title Name</label>
                  <input type="text" required placeholder="e.g., Mombasa Apparel Lab" value={vendorForm.shopName} onChange={e => setVendorForm({...vendorForm, shopName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-slate-400" />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Representative / Owner Legal Name</label>
                  <input type="text" required placeholder="e.g., Mwangi Kipchumba" value={vendorForm.vendorOwner} onChange={e => setVendorForm({...vendorForm, vendorOwner: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-slate-400" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-500">Settlement Workflow Channel</label>
                    <select value={vendorForm.payoutMethod} onChange={e => setVendorForm({...vendorForm, payoutMethod: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-slate-400">
                      <option value="M-Pesa">M-Pesa</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card Settlement">Card Settlement</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Lifecycle Workflow Status</label>
                    <select value={vendorForm.verificationStatus} onChange={e => setVendorForm({...vendorForm, verificationStatus: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-slate-400">
                      <option value="pending_review">Pending Review</option>
                      <option value="verified">Verified Active</option>
                      <option value="suspended">Suspended Hold</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="text-slate-500">Administrative Target Email</label>
                    <input type="email" required placeholder="billing@shop.co.ke" value={vendorForm.accountEmail} onChange={e => setVendorForm({...vendorForm, accountEmail: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500">Take Rate (%)</label>
                    <input type="number" step="0.1" min="0" max="100" required placeholder="8.0" value={vendorForm.commissionCutPercent} onChange={e => setVendorForm({...vendorForm, commissionCutPercent: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400" />
                  </div>
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center gap-2">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold rounded-xl cursor-pointer transition-colors">Cancel</button>
              <button type="submit" form="drawerVendorForm" className="w-1/2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-colors">
                {drawerMode === 'create' ? 'Onboard Store' : 'Commit Refactor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVISED COMMISSION OVERLAY MODAL */}
      {isRateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setIsRateModalOpen(false)}>
          <div 
            className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Percent size={14} className="text-slate-500" />
                <h4 className="text-xs">Override Take Rate: {targetVendorId}</h4>
              </div>
              <button onClick={() => setIsRateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleRateOverride} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1.5">
                <label className="text-slate-500">Platform Split Cut Percentage (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  max="100"
                  required 
                  value={localRateInput} 
                  onChange={e => setLocalRateInput(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 font-bold focus:bg-white focus:outline-hidden focus:border-slate-400" 
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button type="button" onClick={() => setIsRateModalOpen(false)} className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="w-1/2 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs cursor-pointer">Apply Split</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SYSTEM ACCOUNT REMOVAL/DELETE DECOMMISSION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setIsDeleteModalOpen(false)}>
          <div 
            className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center shrink-0 text-rose-600">
                <Trash2 size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Decommission Store Account?</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Are you sure you want to remove <strong className="text-slate-700 font-bold">{targetVendorId}</strong> from your internal multi-vendor database registry? This action removes all active SKUs.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl cursor-pointer">Maintain Vendor</button>
              <button type="button" onClick={handleDeleteConfirm} className="w-1/2 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer">Purge Account</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}