import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  Settings, 
  Save, 
  AlertCircle,
  Truck,
  CheckCircle2
} from 'lucide-react';

// Interfaces mapping to your Django Models
interface MerchantProfileProps {
  // ... maps to InternalMerchantProfile
  shopName: string;
  taxPin: string;
  verificationStatus: 'verified' | 'pending_review' | 'suspended';
  payoutMethod: string;
}

export function MerchantSettingsView({ merchant }: { merchant: any }) {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Info', icon: Settings },
    { id: 'logistics', label: 'Logistics & Branches', icon: MapPin },
    { id: 'payouts', label: 'Payout Configuration', icon: CreditCard },
    { id: 'compliance', label: 'Compliance & Legal', icon: ShieldCheck },
  ];

  return (
    <div className="flex gap-8 max-w-6xl mx-auto p-6">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0">
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        {activeTab === 'general' && <GeneralSettings merchant={merchant} />}
        {activeTab === 'logistics' && <LogisticsSettings merchant={merchant} />}
        {activeTab === 'payouts' && <PayoutSettings merchant={merchant} />}
        {activeTab === 'compliance' && <ComplianceSettings merchant={merchant} />}
      </main>
    </div>
  );
}

// --- Sub-components to keep code clean ---

function GeneralSettings({ merchant }: { merchant: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">General Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700">Shop Name</label>
          <input type="text" defaultValue={merchant.shopName} className="mt-1 w-full p-2 border border-slate-300 rounded-lg" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea defaultValue={merchant.shopDescription} className="mt-1 w-full p-2 border border-slate-300 rounded-lg" rows={3} />
        </div>
      </div>
      <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700">
        <Save size={18} /> Save Changes
      </button>
    </div>
  );
}

function LogisticsSettings({ merchant }: { merchant: any }) {
  // Mapping to your MerchantStoreBranch model
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Store Branches</h2>
        <button className="text-emerald-600 font-medium text-sm">+ Add New Branch</button>
      </div>
      <div className="space-y-4">
        {merchant.branches?.map((branch: any) => (
          <div key={branch.unique_id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-900">{branch.branchName}</p>
              <p className="text-xs text-slate-500">{branch.physicalAddress} • {branch.county}</p>
            </div>
            {branch.isPrimary && (
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">Primary Hub</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PayoutSettings({ merchant }: { merchant: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Payout Configuration</h2>
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">Default Payout Method</label>
        <select defaultValue={merchant.payoutMethod} className="w-full p-2 border border-slate-300 rounded-lg">
          <option>M-Pesa</option>
          <option>Bank Transfer</option>
          <option>Card Settlement</option>
        </select>
        
        {merchant.payoutMethod === 'M-Pesa' && (
          <div className="mt-4 p-4 bg-white border rounded-md">
            <p className="text-sm text-slate-500">Business Phone for M-Pesa</p>
            <p className="font-mono mt-1 font-semibold">{merchant.accountPhone}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ComplianceSettings({ merchant }: { merchant: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Regulatory Compliance</h2>
      <div className="flex gap-4 p-4 border border-amber-200 bg-amber-50 rounded-lg">
        <AlertCircle className="text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          Your account is currently <strong>{merchant.verificationStatus}</strong>. 
          Upload your KRA PIN and business registration documents to unlock high-volume payouts.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-500">Tax PIN (KRA)</label>
          <input type="text" defaultValue={merchant.taxPin} className="mt-1 w-full p-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm text-slate-500">Reg. Number</label>
          <input type="text" defaultValue={merchant.businessRegistrationNumber} className="mt-1 w-full p-2 border border-slate-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
}