import React, { useState, useMemo } from 'react';
import { 
  Search, Check, Trash2, Filter, Bell, 
  Wallet, Package, AlertTriangle, Info,
  MoreVertical, ExternalLink
} from 'lucide-react';

// Mocking high-fidelity notification data
const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'payout', priority: 'high', title: 'Payout Rejected', body: 'The KRA PIN verification failed for your recent payout.', date: '2026-07-02T09:00:00Z', read: false, action: 'Update Profile' },
  { id: '2', type: 'order', priority: 'medium', title: 'New Batch Order', body: '5 new items have been assigned to your store for fulfillment.', date: '2026-07-02T08:30:00Z', read: false, action: 'Process Orders' },
  { id: '3', type: 'system', priority: 'low', title: 'New Platform Feature', body: 'You can now use Bulk Import for product images.', date: '2026-07-01T14:00:00Z', read: true, action: 'Learn More' },
];

export function MerchantNotificationsView() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [search, setSearch] = useState('');

  // Group notifications by date (The "Pro" touch)
  const groupedNotifications = useMemo(() => {
    return notifications.filter(n => 
      n.title.toLowerCase().includes(search.toLowerCase()) || 
      n.body.toLowerCase().includes(search.toLowerCase())
    ).reduce((groups: any, n) => {
      const date = n.date.split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(n);
      return groups;
    }, {});
  }, [notifications, search]);

  return (
    <div className="max-w-5xl mx-auto h-[80vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header with Controls */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-500">You have {notifications.filter(n => !n.read).length} unread updates.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Search alerts..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><Filter size={20} /></button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-0">
        {Object.entries(groupedNotifications).map(([date, items]: [string, any]) => (
          <div key={date}>
            <div className="sticky top-0 bg-white px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              {date === new Date().toISOString().split('T')[0] ? 'Today' : date}
            </div>
            
            {items.map((n: any) => (
              <div key={n.id} className={`group flex items-start gap-4 p-6 border-b border-slate-50 transition-all hover:bg-slate-50 ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                
                {/* Visual Indicator */}
                <div className={`mt-1 p-2 rounded-full ${n.priority === 'high' ? 'bg-rose-100' : 'bg-slate-100'}`}>
                  {n.priority === 'high' ? <AlertTriangle className="text-rose-600" size={18} /> : <Info className="text-slate-600" size={18} />}
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h3>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{n.body}</p>
                  
                  {/* Action Bar (The "Operational" part) */}
                  <div className="mt-4 flex gap-3">
                    <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      {n.action} <ExternalLink size={14} />
                    </button>
                    <button className="text-sm text-slate-400 hover:text-slate-600">Dismiss</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}