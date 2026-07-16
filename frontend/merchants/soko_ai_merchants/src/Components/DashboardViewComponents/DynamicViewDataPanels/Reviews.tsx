import React from 'react';

export function DashboardOverViewReviews({ reviewsList = [] }: any) {
  return (
    <div>
      {reviewsList.length > 0 && (
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
          <p className="text-sm text-slate-600">
            You have <span className="font-semibold text-slate-900">{reviewsList.length}</span> customer reviews to attend to.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 whitespace-nowrap">Customer</th>
              <th className="px-6 py-4 whitespace-nowrap">Rating</th>
              <th className="px-6 py-4 w-full">Comment</th>
              <th className="px-6 py-4 text-right whitespace-nowrap">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviewsList.length ? (
              reviewsList.map((review: any) => {
                // Safely handles both 'rating' and the database 'ratting' key
                const starRating = parseInt(review.rating || review.ratting, 10) || 5;
                
                return (
                  <tr key={review.unique_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {review.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex text-amber-400 text-lg selection:bg-transparent">
                        {"★".repeat(starRating)}{"☆".repeat(Math.max(0, 5 - starRating))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 italic">
                      "{review.comment}"
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-slate-500 whitespace-nowrap">
                      {review.date}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <h3 className="text-sm font-medium text-slate-900 mb-1">
                    No Customer Reviews Yet
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
