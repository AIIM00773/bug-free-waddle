import React, { useState } from 'react';
import {
  Store,
  Search,
  RefreshCw,
  User,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  CreditCard,
  UserCheck,
  Trash2,
  Mail,
  Percent,
  ScanEye
} from 'lucide-react';

import { useDirectMerchants } from '../Providers.tsx/PartnerMerchantsContext';
import { IndividualMerchantAdminViewDashboardPage } from '../Components/IndividualMerchnatView';

export default function PartnerMerchantsView() {
  const {
    merchants,
    isLoading,
    error,
    refreshMerchantData,
    ActivateMerchantProfile,
    DeactivateMerchantProfile,
    removeVendorAccount,
    loadingIndividual,
    individualMerchant,
    fetchIndividualMerchant
  } = useDirectMerchants();

  // Search and Mode States
  const [searchQuery, setSearchQuery] = useState('');
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Focus Targets
  const [targetVendorId, setTargetVendorId] = useState('');
  const [localRateInput, setLocalRateInput] = useState('');

  // Filtering System Nodes Engine (Aligned completely with MerchantSummary keys)
  const filteredMerchants = (merchants || []).filter(m => {
    const shopName = m.shopName || '';
    const email = m.accountEmail || m.owner?.email || '';
    const id = m.unique_id || '';
    
    return (
      shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const openRateModal = (merchant: any) => {
    const currentRate = merchant.commissionCutPercent ?? '3.5';
    setTargetVendorId(merchant.unique_id);
    setLocalRateInput(currentRate.toString());
    setIsRateModalOpen(true);
  };

  const handleRateOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetVendorId && localRateInput) {
      /* 
        NOTE: 'updatePlatformTakeRate' is not declared in your global context engine.
        If you add this endpoint to your Provider backend schema later, wire it up here:
        await updatePlatformTakeRate(targetVendorId, Number(localRateInput));
      */
      console.log(`Override Take Rate request for target vendor ${targetVendorId}: ${localRateInput}%`);
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

  // Intercept Render Pipeline if Single Deep-Dive Profile Node Is Selected
  if (individualMerchant) {
    return <IndividualMerchantAdminViewDashboardPage />;
  }

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
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-40"
            title="Poll Database Node Cluster"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ERROR HANDLER NOTIFIER */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-start gap-3 shadow-sm">
          <XCircle size={16} className="shrink-0 text-rose-500 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Transaction Registry Exception</span>
            <p className="text-rose-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* SEARCH AND FILTERS CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="relative w-full max-w-lg">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by shop name, unique ID string, or associated email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* VENDOR CARDS COMPONENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredMerchants.length > 0 ? (
          filteredMerchants.map((merchant) => {
            const shopName = merchant.shopName || "Unknown Shop";
            const verificationStatus = merchant.verificationStatus || "pending_review";
            const commissionCut = merchant.commissionCutPercent || "0.0";
            const payoutMethod = merchant.payoutMethod || "M-Pesa";
            const accountEmail = merchant.accountEmail || merchant.owner?.email || "No email stored";
            const isVerified = merchant.verified === true || merchant.owner?.is_merchant_verified === true;

            return (
              <div
                key={merchant.unique_id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-10 w-10 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-slate-100 transition-colors">
                        <Store size={18} />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h3 className="text-xs font-bold text-slate-900 truncate" title={shopName}>
                          {shopName}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono text-slate-500 font-bold tracking-tight bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200/60">
                            {merchant.unique_id}
                          </span>
                          <span className="text-slate-300 text-[10px]">|</span>
                          <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                            <User size={11} className="text-slate-400" />
                            <span>
                              Status: <strong className="text-slate-700 font-bold">
                                {isVerified ? 'Verified Node' : 'Unverified Node'}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* LOGICAL STATUS WRAPPER */}
                    <div className="shrink-0">
                      {verificationStatus === 'verified' ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 size={11} className="text-emerald-600" /> Active
                        </span>
                      ) : merchant.owner?.is_suspended || verificationStatus === 'suspended' ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg">
                          <XCircle size={11} className="text-rose-500" /> Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                          <AlertTriangle size={11} className="text-amber-500" /> Provisioned
                        </span>
                      )}
                    </div>
                  </div>

                  {/* MATRIX DATA METRICS */}
                  <div className="grid grid-cols-2 gap-2 border-y border-slate-100 py-3 bg-slate-50/50 rounded-xl px-3 text-xs font-semibold">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Commission</span>
                      <span className="text-slate-900 font-bold tracking-tight">
                        {parseFloat(commissionCut).toFixed(2)}% Split
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Payout Endpoint</span>
                      <div className="flex items-center gap-1 text-slate-800">
                        <CreditCard size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{payoutMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION FOOTER BAR */}
                <div className="flex items-center justify-between text-[11px] font-semibold pt-4 mt-3 border-t border-slate-100/70">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] max-w-[45%] truncate">
                    <Mail size={10} className="shrink-0" />
                    <span className="truncate" title={accountEmail}>{accountEmail}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => openRateModal(merchant)} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors" title="Change Take Rate" >
                      <Percent size={13} />
                    </button>

                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                    <button 
                      type="button" 
                      disabled={loadingIndividual} 
                      onClick={() => fetchIndividualMerchant(merchant.unique_id)}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200 rounded-lg transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1 disabled:opacity-50" 
                    >
                      <ScanEye size={11} className={loadingIndividual ? "animate-pulse" : ""} /> Full View
                    </button>

                    {/* CONDITIONAL SYSTEM ACTIONS CONTROLS */}
                    {!isVerified ? (
                      <button
                        type="button"
                        onClick={() => ActivateMerchantProfile(merchant.unique_id)}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200 rounded-lg transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                      >
                        <UserCheck size={11} /> Approve
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => DeactivateMerchantProfile(merchant.unique_id)}
                        className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100/80 border border-amber-200 rounded-lg transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                      >
                        <XCircle size={11} /> Restrict
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => openDeleteModal(merchant.unique_id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg cursor-pointer transition-colors"
                      title="Decommission Account"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-1 xl:col-span-2 bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-16 text-center text-slate-400 font-semibold flex flex-col items-center justify-center gap-2 shadow-sm">
            <Store size={24} className="text-slate-300 stroke-[1.5]" />
            <span className="text-xs">No active localized store-nodes mapped to current parameter strings.</span>
          </div>
        )}
      </div>

      {/* REVISED COMMISSION OVERLAY MODAL */}
      {isRateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsRateModalOpen(false)}>
          <div
            className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Percent size={14} className="text-slate-500" />
                <h4 className="text-xs truncate max-w-[240px]">Override Take Rate: {targetVendorId}</h4>
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
                  step="0.001"
                  min="0"
                  max="100"
                  required
                  value={localRateInput}
                  onChange={e => setLocalRateInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button type="button" onClick={() => setIsRateModalOpen(false)} className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="w-1/2 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm cursor-pointer">Apply Split</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SYSTEM ACCOUNT REMOVAL/DELETE DECOMMISSION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsDeleteModalOpen(false)}>
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
                  Are you sure you want to remove <strong className="text-slate-700 font-bold truncate inline-block max-w-[150px] align-bottom">{targetVendorId}</strong> from your internal multi-vendor database registry? This action removes all active SKUs.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl cursor-pointer">Maintain Vendor</button>
              <button type="button" onClick={handleDeleteConfirm} className="w-1/2 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm cursor-pointer">Purge Account</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}