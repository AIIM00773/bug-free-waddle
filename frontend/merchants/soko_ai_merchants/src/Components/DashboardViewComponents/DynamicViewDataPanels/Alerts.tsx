import React from 'react';

export function DashboardOverViewAlerts({ alertsList = [] }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4 w-full">Message</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4 text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {alertsList.length ? (
            alertsList.map((alert: any) => (
              <tr 
                key={alert.unique_id} 
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {alert.Type}
                </td>
                <td className="px-6 py-4 text-slate-600 whitespace-normal">
                  {alert.Message}
                </td>
                <td className="px-6 py-4">
                  <span 
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      alert.Priority === 'HIGH' 
                        ? 'bg-rose-100 text-rose-800' 
                        : alert.Priority === 'MEDIUM' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {alert.Priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 text-right">
                  {alert.created_at}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-12 text-center text-slate-500" colSpan={4}>
                <p className="text-sm font-medium text-slate-900 mb-1">
                  No Alerts
                </p>
                <p className="text-sm text-slate-500">
                  You currently have no active notifications.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
