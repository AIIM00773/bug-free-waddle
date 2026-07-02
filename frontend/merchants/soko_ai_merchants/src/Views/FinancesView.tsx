


import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Building2, 
  Download,
  Clock,
  CheckCircle2
} from 'lucide-react';

// Mock Transaction Data
const TRANSACTIONS = [
  { id: 'TXN-9901', type: 'sale', amount: 12500, date: 'Jul 2, 2026', desc: 'Order ORD-8922-KE' },
  { id: 'TXN-9900', type: 'payout', amount: -45000, date: 'Jun 30, 2026', desc: 'M-Pesa Payout to 0712345678' },
  { id: 'TXN-9899', type: 'sale', amount: 8500, date: 'Jun 30, 2026', desc: 'Order ORD-8915-KE' },
];

export function FinancesView() {
  const formatKES = (val: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(val);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
          <p className="text-sm text-slate-500">Track your earnings, payouts, and commission deductions.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
          <p className="text-emerald-50 text-sm font-medium">Available Balance</p>
          <h2 className="text-3xl font-bold mt-1">{formatKES(89450)}</h2>
          <button className="mt-4 w-full bg-white/10 hover:bg-white/20 transition-colors py-2 rounded-lg text-sm font-medium border border-white/20">
            Request Payout
          </button>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Pending Clearing</p>
          <h2 className="text-2xl font-bold mt-1 text-slate-900">{formatKES(12400)}</h2>
          <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit">
            <Clock size={12} /> 2 Orders pending verification
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Commission Paid</p>
          <h2 className="text-2xl font-bold mt-1 text-slate-900">{formatKES(4250)}</h2>
          <p className="text-slate-400 text-xs mt-2">Based on 3.5% standard cut</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-900">
          Recent Transactions
        </div>
        <table className="min-w-full divide-y divide-slate-100">
          <tbody className="divide-y divide-slate-100">
            {TRANSACTIONS.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${txn.type === 'sale' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {txn.type === 'sale' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{txn.desc}</p>
                      <p className="text-xs text-slate-400">{txn.date} • {txn.id}</p>
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 text-right font-semibold ${txn.type === 'sale' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {txn.type === 'sale' ? '+' : ''}{formatKES(txn.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payout Method Footer */}
      <div className="flex items-center justify-between p-4 bg-slate-100 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <CreditCard className="text-slate-600" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Default Payout: M-Pesa</p>
            <p className="text-xs text-slate-500">Business Phone: +254 712 345 678</p>
          </div>
        </div>
        <button className="text-sm text-indigo-600 font-medium hover:underline">Edit Method</button>
      </div>
    </div>
  );
}