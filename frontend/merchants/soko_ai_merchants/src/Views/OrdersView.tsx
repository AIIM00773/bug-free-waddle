


import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Printer, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';

// Mock data reflecting a robust order management system
const MOCK_ORDERS = [
  {
    id: 'ORD-8923-KE',
    customerName: 'Grace Wanjiku',
    location: 'Juja, Kiambu',
    date: 'Jul 2, 2026, 08:14 AM',
    items: 3,
    total: 15400.00,
    paymentStatus: 'paid', // paid, pending, failed
    fulfillmentStatus: 'pending', // pending, processing, shipped, delivered, cancelled
  },
  {
    id: 'ORD-8922-KE',
    customerName: 'Kevin Ochieng',
    location: 'Nairobi CBD',
    date: 'Jul 1, 2026, 14:30 PM',
    items: 1,
    total: 65000.00,
    paymentStatus: 'paid',
    fulfillmentStatus: 'processing',
  },
  {
    id: 'ORD-8915-KE',
    customerName: 'Sarah Mutua',
    location: 'Thika Town',
    date: 'Jun 30, 2026, 11:05 AM',
    items: 2,
    total: 8500.00,
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
  },
  {
    id: 'ORD-8910-KE',
    customerName: 'David Kamau',
    location: 'Westlands, Nairobi',
    date: 'Jun 28, 2026, 09:12 AM',
    items: 5,
    total: 32000.00,
    paymentStatus: 'pending',
    fulfillmentStatus: 'cancelled',
  }
];

const TABS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function OrdersView() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Filter logic based on active tab and search query
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' || order.fulfillmentStatus.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Metrics for the top cards
  const pendingCount = orders.filter(o => o.fulfillmentStatus === 'pending').length;
  const processingCount = orders.filter(o => o.fulfillmentStatus === 'processing').length;
  const shippedCount = orders.filter(o => o.fulfillmentStatus === 'shipped').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Status Badge Renderers
  const renderFulfillmentBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20"><Clock size={12} /> Pending Action</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20"><Package size={12} /> Packing</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20"><Truck size={12} /> In Transit</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"><CheckCircle2 size={12} /> Delivered</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20"><XCircle size={12} /> Cancelled</span>;
      default:
        return null;
    }
  };

  const renderPaymentBadge = (status: string) => {
    if (status === 'paid') return <span className="text-emerald-600 font-medium text-sm">Paid</span>;
    if (status === 'pending') return <span className="text-amber-600 font-medium text-sm">Unpaid</span>;
    return <span className="text-slate-500 font-medium text-sm">{status}</span>;
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Process incoming orders, print waybills, and track fulfillment.
        </p>
      </div>

      {/* Actionable Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center gap-3 text-amber-700">
            <AlertCircle size={20} />
            <h3 className="text-sm font-medium">Action Required (Pending)</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-900">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <Package size={20} className="text-blue-600" />
            <h3 className="text-sm font-medium">Currently Packing</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{processingCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <Truck size={20} className="text-indigo-600" />
            <h3 className="text-sm font-medium">In Transit</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{shippedCount}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
        
        {/* Tabs */}
        <div className="border-b border-slate-200 px-4">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Toolbar (Search & Filter) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 p-4 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Order ID or Customer Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <Filter size={16} className="text-slate-400" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Data Table */}
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-3 text-slate-400">
              <Package size={24} />
            </div>
            <p className="text-sm font-medium text-slate-900">No orders found.</p>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900">Order Details</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900">Customer</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900">Payment</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Order ID & Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{order.id}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{order.date}</div>
                    </td>
                    
                    {/* Customer Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{order.customerName}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{order.location}</div>
                    </td>

                    {/* Payment Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{formatCurrency(order.total)}</div>
                      <div className="flex items-center gap-1 text-xs mt-0.5">
                        {renderPaymentBadge(order.paymentStatus)} 
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-slate-500">{order.items} item{order.items > 1 ? 's' : ''}</span>
                      </div>
                    </td>

                    {/* Fulfillment Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderFulfillmentBadge(order.fulfillmentStatus)}
                    </td>

                    {/* Actions Menu */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Primary action changes based on status */}
                        {order.fulfillmentStatus === 'pending' && (
                          <button className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
                            Process
                          </button>
                        )}
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Print Waybill">
                          <Printer size={18} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors" title="View Details">
                          <Eye size={18} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}