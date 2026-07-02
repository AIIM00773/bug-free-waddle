



import React, { useState } from 'react';
import { 
  PlusSquare, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Store, 
  Star, 
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

// Mock data mirroring the MerchantStoreBranch Django model
const MOCK_BRANCHES = [
  {
    unique_id: '123e4567-e89b-12d3-a456-426614174000',
    branchName: 'Main Fulfillment Center',
    phone: '+254 712 345 678',
    email: 'juja.hub@shop.com',
    county: 'Kiambu',
    cityTown: 'Juja',
    physicalAddress: 'Juja City Mall, Ground Floor, Wing B',
    isPrimary: true,
    operatingHours: 'Mon-Sat: 8AM-6PM',
    isActive: true,
  },
  {
    unique_id: '987fcdeb-51a2-43d7-9012-426614174001',
    branchName: 'Nairobi CBD Drop-off',
    phone: '+254 722 987 654',
    email: 'cbd.support@shop.com',
    county: 'Nairobi',
    cityTown: 'Nairobi',
    physicalAddress: 'Kimathi Street, Norwich Union House, 3rd Floor',
    isPrimary: false,
    operatingHours: 'Mon-Fri: 9AM-5PM',
    isActive: true,
  }
];



export default function BranchesView() {
  // Toggle this to [] to see the empty state in action
  const [branches, setBranches] = useState(MOCK_BRANCHES);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Store Branches</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your physical locations, routing hubs, and operating hours.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <PlusSquare size={16} />
            <span>Add New Branch</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {branches.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-12 px-6 text-center transition-all hover:border-indigo-200 hover:bg-slate-50/50">
          <div className="mb-4 rounded-full bg-slate-100 p-3 text-slate-400">
            <Store size={24} />
          </div>
          <p className="text-sm font-medium text-slate-900">No branches added yet.</p>
          <p className="mt-1 mb-6 text-sm text-slate-500">
            Get started by creating your first business location.
          </p>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700">
            <PlusSquare size={16} />
            <span>New Branch</span>
          </button>
        </div>
      ) : (
        /* Branch Grid */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {branches.map((branch) => (
            <div 
              key={branch.unique_id} 
              className={`relative flex flex-col rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${
                branch.isPrimary ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-slate-100 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {branch.branchName}
                    </h3>
                    {branch.isPrimary && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                        <Star size={12} className="fill-indigo-700" />
                        Primary Hub
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${branch.isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                      <CheckCircle2 size={14} />
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {/* Context Menu Placeholder */}
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Card Body - Logistics Details */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                {/* Location */}
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">{branch.cityTown}, {branch.county}</p>
                    <p className="mt-0.5 line-clamp-2">{branch.physicalAddress}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-2 flex flex-col gap-2">
                  {branch.phone && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={16} className="shrink-0 text-slate-400" />
                      <span>{branch.phone}</span>
                    </div>
                  )}
                  {branch.email && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail size={16} className="shrink-0 text-slate-400" />
                      <span className="truncate">{branch.email}</span>
                    </div>
                  )}
                </div>

                {/* Hours */}
                {branch.operatingHours && (
                  <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
                    <Clock size={16} className="shrink-0 text-slate-400" />
                    <span>{branch.operatingHours}</span>
                  </div>
                )}
              </div>

              {/* Card Footer - Quick Actions */}
              <div className="flex items-center gap-2 rounded-b-xl bg-slate-50 p-4">
                <button className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors">
                  Edit Branch
                </button>
                {!branch.isPrimary && (
                  <button className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo-600 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors">
                    Make Primary
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