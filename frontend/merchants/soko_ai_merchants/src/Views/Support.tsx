import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Search,
  ChevronRight,
  Send
} from 'lucide-react';

// Mock Data
const TICKETS = [
  { id: 'TKT-8821', subject: 'Payout Delay: ORD-9901', status: 'In Progress', priority: 'High', date: 'Jul 2, 2026' },
  { id: 'TKT-8750', subject: 'Product Image Upload Issue', status: 'Resolved', priority: 'Low', date: 'Jun 28, 2026' },
  { id: 'TKT-8600', subject: 'Request to verify Tax PIN', status: 'Pending', priority: 'Medium', date: 'Jun 25, 2026' },
];

export function MerchantSupportView() {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Ticket List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Support Center</h1>
          <button 
            onClick={() => setActiveTab('new')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            <Plus size={16} /> New Support Ticket
          </button>
        </div>

        {activeTab === 'tickets' ? (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Ticket</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TICKETS.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{tkt.subject}</p>
                      <p className="text-xs text-slate-500">{tkt.id} • {tkt.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={tkt.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center justify-end gap-1">
                        View <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <NewTicketForm onCancel={() => setActiveTab('tickets')} />
        )}
      </div>

      {/* RIGHT COLUMN: Resources & Quick Help */}
      <aside className="space-y-6">
        <div className="bg-indigo-900 rounded-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">Need Immediate Help?</h3>
          <p className="text-indigo-200 text-sm mb-4">Our support team is available 24/7 on WhatsApp for critical order issues.</p>
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
             Chat via WhatsApp
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Common Guides</h3>
          <ul className="space-y-3">
            {['Resolving M-Pesa Payout Failures', 'How to manage inventory stocks', 'Updating Branch locations'].map((guide) => (
              <li key={guide} className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 cursor-pointer text-sm">
                <FileText size={16} /> {guide}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    'In Progress': 'bg-blue-50 text-blue-700',
    'Resolved': 'bg-emerald-50 text-emerald-700',
    'Pending': 'bg-amber-50 text-amber-700'
  }[status] || 'bg-slate-100';

  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles}`}>{status}</span>;
}

function NewTicketForm({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Create Support Ticket</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Issue Category</label>
          <select className="w-full p-2 border border-slate-300 rounded-lg">
            <option>Payout / Financial</option>
            <option>Order Fulfillment</option>
            <option>Technical / Bug</option>
            <option>Profile Verification</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input className="w-full p-2 border border-slate-300 rounded-lg" placeholder="Short summary of the issue" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Details</label>
          <textarea className="w-full p-2 border border-slate-300 rounded-lg h-32" placeholder="Provide as much detail as possible..." />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
          <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Submit Ticket</button>
        </div>
      </div>
    </div>
  );
}