import React from 'react';

export const DashboardOverviewOrders = ({ ordersList = [], getStatusColor }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Branch</th>
            <th className="px-6 py-4 text-right">Amount</th>
            <th className="px-6 py-4 text-right">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {ordersList.length > 0 ? (
            ordersList.map((order) => (
              <tr 
                key={order.unique_id} 
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {order.order_id}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {order.shippingCustomerName}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {order.branch}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 text-right">
                  {order.gross_sales_amount}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor ? getStatusColor(order.status) : ''}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                <h3 className="text-sm font-medium text-slate-900 mb-1">
                  No Incoming Orders
                </h3>
                <p className="text-sm text-slate-500">
                  Once a customer buys a product, it will appear here.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
