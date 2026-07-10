import React, { useState } from 'react';
import { useAuth } from "../Providers/AuthProvider";
import { useBranch } from "../Providers/BranchProvider";
import AddBranchForm from './onboarding/MerchnatStoreBranchAddForm';
import BranchViewModal from "./modals/IndividualBranchView";
import { 
  PlusSquare, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Store, 
  Star, 
  MoreVertical,
  CheckCircle2,
  User2,
  Edit,
  Trash2,
  Building2,
  Lock,
  EyeIcon
} from 'lucide-react';

export default function BranchesView() {
  const { isAuthenticated } = useAuth();
  const { branches, deletingBranch } = useBranch(); 
  const [addNewBranch, setAddNewBranch] = useState<boolean>(false); 
  const [viewIndividualBranch, setViewIndividualBranch] = useState<boolean>(false);
  const [branchInViewId, setBranchInViewId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen">

      {/* Node Analysis Control Panel Modal */}
      <BranchViewModal 
        isOpen={viewIndividualBranch}
        branchId={branchInViewId || ""} 
        onClose={() => {
          setViewIndividualBranch(false);
          setBranchInViewId(null); 
        }} 
      /> 
      
      {/* Refined Modal Overlay with Backdrop Blur */}
      {addNewBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <AddBranchForm onCancel={() => setAddNewBranch(false)} />
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Store Branches
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Manage your physical locations, routing hubs, and operating hours across the network.
          </p>
        </div>
        <div className="shrink-0">
          <button 
            onClick={() => setAddNewBranch(true)} 
            className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
          >
            <PlusSquare size={18} className="transition-transform group-hover:scale-110" />
            <span>Add Branch</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {!branches || branches.length === 0 ? (
        /* Enhanced Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 px-6 text-center shadow-sm transition-all hover:border-indigo-400 hover:bg-indigo-50/10">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-indigo-100">
            <Building2 size={40} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No branches added yet</h3>
          <p className="mt-2 mb-8 max-w-md text-sm text-slate-500 leading-relaxed">
            Get started by creating your first business location. This enables inventory routing, accurate local shipping, and customer pickups.
          </p>
          <button 
            onClick={() => setAddNewBranch(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusSquare size={18} />
            <span>Create First Branch</span>
          </button>
        </div>
      ) : (
        /* Branch Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <div 
              key={branch.unique_id} 
              className={`group relative flex flex-col rounded-2xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                branch.isPrimary 
                  ? 'border-2 border-indigo-500/50 shadow-indigo-100' 
                  : 'border border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-slate-100 p-5 bg-slate-50/50 rounded-t-2xl">
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1 pr-8" title={branch.branchName}>
                    {branch.branchName}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      branch.isActive 
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' 
                        : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10'
                    }`}>
                      <CheckCircle2 size={12} className={branch.isActive ? "text-emerald-500" : "text-slate-400"} />
                      {branch.isActive ? 'Active' : 'Offline'}
                    </span>

                    {branch.isPrimary && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                        <Star size={12} className="fill-indigo-600 text-indigo-600" />
                        Main Hub
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Context Menu */}
                <button className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Card Body - Logistics Details */}
              <div className="flex flex-1 flex-col gap-5 p-5">
                {/* Location */}
                <div className="flex items-start gap-3 text-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div className="pt-1">
                    <p className="font-semibold text-slate-900">{branch.cityTown}, {branch.county}</p>
                    {branch.physicalAddress && (
                       <p className="mt-1 text-slate-500 leading-snug line-clamp-2">{branch.physicalAddress}</p>
                    )}
                  </div>
                </div>

                {/* Contact Info Group */}
                <div className="mt-auto flex flex-col gap-2.5 rounded-xl bg-slate-50 border border-slate-100 p-4">
                  {branch.managerName && (
                    <div className="flex items-center gap-3 text-sm">
                      <User2 size={15} className="shrink-0 text-slate-400" />
                      <span className="font-medium text-slate-700 truncate">{branch.managerName}</span>
                    </div>
                  )}
                  
                  {branch.managerPhone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={15} className="shrink-0 text-slate-400" />
                      <span className="text-slate-600">{branch.managerPhone}</span>
                    </div>
                  )}

                  {branch.managerEmail && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={15} className="shrink-0 text-slate-400" />
                      <span className="text-slate-600 truncate" title={branch.managerEmail}>{branch.managerEmail}</span>
                    </div>
                  )}

                  {branch.operatingHours && (
                    <div className="mt-1 flex items-center gap-3 text-sm border-t border-slate-200/60 pt-3">
                      <Clock size={15} className="shrink-0 text-indigo-400" />
                      <span className="font-medium text-slate-700">{branch.operatingHours}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer - Actions */}
              <div className="grid grid-cols-3 gap-3 p-5 pt-0">
                <button 
                  onClick={() => {
                    setBranchInViewId(branch.unique_id);
                    setViewIndividualBranch(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                >
                  <EyeIcon size={16} />
                  <span>View</span>
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500">
                  <Edit size={16} />
                  <span>Edit</span>
                </button>

                {branch.isPrimary ? (
                  <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed" title="Primary branch cannot be deleted">
                    <Lock size={16} />
                    <span>Protected</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => deletingBranch(branch.unique_id)} 
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 focus:ring-2 focus:ring-red-500"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
