import React from 'react';

export function DashboardOverViewInventory({ fullStockList = [] }: any) {
  return (
    <div>
      {fullStockList.length > 0 && (
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
          <p className="text-sm text-slate-600">
            You have <span className="font-semibold text-slate-900">{fullStockList.length}</span> items across variants.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4 text-right">Price</th>
              <th className="px-6 py-4 text-right">Stock</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fullStockList.length ? (
              fullStockList.map((item: any) => (
                <tr key={item.unique_id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    KES {item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    {item.currentStock}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.currentStock > 10
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.currentStock > 10 ? 'In Stock' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <h3 className="text-sm font-medium text-slate-900 mb-1">
                    Catalog Empty
                  </h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
