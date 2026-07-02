import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CreditCard,
  Edit,
  Save,
  CheckCircle2
} from 'lucide-react';

export function ProfileView({ merchantData }: { merchantData: any }) {
  // Mocking the status badge color logic
  const statusColors = {
    verified: "bg-emerald-100 text-emerald-700",
    pending_review: "bg-amber-100 text-amber-700",
    suspended: "bg-rose-100 text-rose-700"
  };

  return (
    <div className="space-y-6">
      {/* Header with Verification Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Merchant Profile</h1>
          <p className="text-slate-500 text-sm">Manage your business identity and payout configuration.</p>
        </div>
        <div className={`px-4 py-2 rounded-full font-semibold text-sm ${statusColors[merchantData.verificationStatus as keyof typeof statusColors]}`}>
          {merchantData.verificationStatus.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Identity & Compliance */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-900">Business Identity</h3>
              <button className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                <Edit size={14} /> Edit
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Shop Name</label>
                <p className="mt-1 font-medium text-slate-900">{merchantData.shopName}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Admin Email</label>
                <p className="mt-1 font-medium text-slate-900">{merchantData.accountEmail}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Description</label>
                <p className="mt-1 text-slate-600 text-sm">{merchantData.shopDescription}</p>
              </div>
            </div>
          </section>

          {/* Compliance Section */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" size={20} /> Regulatory Compliance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500">KRA Tax PIN</p>
                <p className="font-mono text-slate-900">{merchantData.taxPin || 'Not Provided'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500">Business Reg Number</p>
                <p className="font-mono text-slate-900">{merchantData.businessRegistrationNumber || 'N/A'}</p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Logistics & Payouts */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="text-emerald-600" size={20} /> Payout Method
            </h3>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg bg-slate-50">
                <p className="text-sm font-semibold">{merchantData.payoutMethod}</p>
                <p className="text-xs text-slate-500 mt-1">Primary: {merchantData.accountPhone || 'No Phone Set'}</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="text-emerald-600" size={20} /> Primary Hub
            </h3>
            {/* Logic: Fetch the primary branch from your MerchantStoreBranch model */}
            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-900">Juja Distribution Center</p>
              <p>Thika Road, Bypass Junction</p>
              <p className="mt-2 text-xs text-emerald-600 font-medium">Active & Accepting Orders</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}