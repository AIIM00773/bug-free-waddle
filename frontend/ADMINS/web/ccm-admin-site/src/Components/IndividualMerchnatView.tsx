import React from 'react';
import {
    Building2, Store, DollarSign, Package, ShoppingCart,
    ArrowUpRight, MapPin, Phone, Mail, ArrowLeft, Loader2, AlertTriangle, HelpCircle
} from 'lucide-react';

import { useDirectMerchants } from '../Providers.tsx/PartnerMerchantsContext';

export const IndividualMerchantAdminViewDashboardPage = () => {
    const [activeTab, setActiveTab] = React.useState<'overview' | 'catalog' | 'orders' | 'payouts'>('overview');
    const { individualMerchant, loadingIndividual, error, resetActiveMerchant } = useDirectMerchants();

    // 1. LOADING STATE
    if (loadingIndividual) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
                <div className="text-center text-slate-600 font-medium text-sm tracking-wide">
                    Aggregating merchant core matrices...
                </div>
            </div>
        );
    }

    // 2. ERROR STATE
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
                <div className="max-w-md w-full border border-rose-100 bg-white p-6 rounded-2xl shadow-sm text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 mb-4">
                        <AlertTriangle className="h-6 w-6 text-rose-600" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">Pipeline Breakdown</h3>
                    <p className="text-sm text-rose-600 font-mono bg-rose-50/50 px-3 py-2 rounded-xl border border-rose-100/50 break-words">
                        {error}
                    </p>
                    <button 
                        onClick={() => resetActiveMerchant()}
                        className="mt-4 text-xs font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-4"
                    >
                        Return to Management Console
                    </button>
                </div>
            </div>
        );
    }

    // 3. EMPTY STATE
    if (!individualMerchant) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
                <div className="max-w-sm w-full text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                        <HelpCircle className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">No profile contextual records found</h3>
                    <p className="text-xs text-slate-500 mt-1">This merchant record may have been reassigned or unlinked.</p>
                    <button 
                        onClick={() => resetActiveMerchant()}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
                    >
                        <ArrowLeft size={14} /> Back to Directory
                    </button>
                </div>
            </div>
        );
    }

    // Financial aggregates calculation safely mapped directly to context state
    const lifetimeGross = individualMerchant.order_groups?.reduce((acc, curr) => acc + parseFloat(curr.group_gross_amount || '0'), 0) || 0;
    const pendingSettlement = individualMerchant.payout_history?.filter(p => p.status === 'pending' || p.status === 'processing')
        .reduce((acc, curr) => acc + parseFloat(curr.net_payout_amount || '0'), 0) || 0;

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans antialiased selection:bg-indigo-50 selection:text-indigo-900">
            
            {/* ACTION / NAVIGATION BAR */}
            <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8">
                <button 
                    onClick={() => resetActiveMerchant()}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 transition-all shadow-xs"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
                    <span>Exit Merchant Profile View</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                
                {/* 1. TOP HEADER BRAND BLOCK */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{individualMerchant.shopName}</h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border
                                ${individualMerchant.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  individualMerchant.verificationStatus === 'suspended' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'}`}
                            >
                                {individualMerchant.verificationStatus?.replace('_', ' ') || 'Pending Action'}
                            </span>
                        </div>
                        <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
                            {individualMerchant.shopDescription || "No custom storefront bio descriptions provided."}
                        </p>
                    </div>
                    <div className="text-xs text-slate-500 font-mono bg-slate-50 border border-slate-150 px-3 py-2 rounded-xl shrink-0">
                        <span className="text-slate-400 select-none">ID: </span>{individualMerchant.unique_id}
                    </div>
                </div>

                {/* 2. SUMMARY COUNTER RIBBON */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lifetime Gross Revenue</p>
                            <h3 className="text-2xl font-bold text-slate-900">KES {lifetimeGross.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><DollarSign size={20} /></div>
                    </div>

                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Payouts</p>
                            <h3 className="text-2xl font-bold text-amber-600">KES {pendingSettlement.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><ArrowUpRight size={20} /></div>
                    </div>

                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Catalog</p>
                            <h3 className="text-2xl font-bold text-slate-900">{individualMerchant.totalActiveListings || 0} Items</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Package size={20} /></div>
                    </div>

                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Handlers</p>
                            <h3 className="text-2xl font-bold text-slate-900">{individualMerchant.order_groups?.length || 0} Segments</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShoppingCart size={20} /></div>
                    </div>
                </div>

                {/* 3. WORKSPACE SELECTION TABS */}
                <div className="flex bg-slate-200/60 p-1 rounded-xl w-fit gap-1">
                    {(['overview', 'catalog', 'orders', 'payouts'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 font-semibold text-sm capitalize rounded-lg transition-all
                                ${activeTab === tab
                                    ? 'bg-white text-indigo-600 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 4. DYNAMIC VIEW MODULES */}
                <div className="mt-4">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Account Core Context */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:col-span-1 shadow-xs">
                                <h2 className="font-bold border-b border-slate-100 pb-3 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
                                    <Store size={15} /> Base Configuration Profiles
                                </h2>
                                <div className="space-y-4 text-sm">
                                    {individualMerchant.vendorOwner && (
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">Primary Vendor Owner</span>
                                            <span className="font-semibold text-slate-800 block">
                                                {individualMerchant.vendorOwner.first_name} {individualMerchant.vendorOwner.last_name}
                                            </span>
                                            <span className="text-xs text-slate-500 block font-mono mt-0.5">{individualMerchant.vendorOwner.email}</span>
                                        </div>
                                    )}
                                    <div className="px-1">
                                        <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-0.5">Accounting Mail</span>
                                        <span className="font-medium text-slate-800 font-mono text-xs">{individualMerchant.accountEmail}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 px-1">
                                        <div>
                                            <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-0.5">Commission Rate</span>
                                            <span className="text-base font-bold text-indigo-600">
                                                {parseFloat(individualMerchant.commissionCutPercent as any || '0').toFixed(2)}%
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-0.5">Settlement Route</span>
                                            <span className="font-semibold text-slate-800 mt-0.5 block text-xs uppercase tracking-wide">{individualMerchant.payoutMethod}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Logistics Fulfillment Hub Infrastructure */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:col-span-2 shadow-xs">
                                <h2 className="font-bold border-b border-slate-100 pb-3 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
                                    <Building2 size={15} /> Regional Distribution Branches ({individualMerchant.branches?.length || 0})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {individualMerchant.branches?.map((b) => (
                                        <div key={b.unique_id} className="border border-slate-200/70 rounded-xl p-4 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                                            <div className="flex justify-between items-center mb-2.5">
                                                <h4 className="font-bold text-slate-800 text-sm">{b.branch_name}</h4>
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                    b.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${b.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                    {b.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-2.5">
                                                <p className="flex items-start gap-2 leading-relaxed">
                                                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" /> 
                                                    <span>{b.physical_address}, {b.city_town}, {b.county} County</span>
                                                </p>
                                                {b.phone && (
                                                    <p className="flex items-center gap-2 font-mono text-slate-500">
                                                        <Phone size={14} className="text-slate-400 shrink-0" /> {b.phone}
                                                    </p>
                                                )}
                                                {b.email && (
                                                    <p className="flex items-center gap-2 font-mono text-slate-500">
                                                        <Mail size={14} className="text-slate-400 shrink-0" /> {b.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                    {activeTab === 'catalog' && (
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                                <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Merchant Product Catalog Storage</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50/40 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                            <th className="p-4">Item details</th>
                                            <th className="p-4">SKU Code</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4 text-right">Original Price</th>
                                            <th className="p-4 text-right">Market Deal Price</th>
                                            <th className="p-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {individualMerchant.products?.map((p) => (
                                            <tr key={p.unique_id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 flex items-center gap-3">
                                                    <img src={p.primary_image_url} alt={p.title} className="w-10 h-10 object-cover rounded-xl border border-slate-200 bg-slate-50 shrink-0 shadow-2xs" />
                                                    <div className="max-w-[240px]">
                                                        <p className="font-semibold text-slate-800 truncate">{p.title}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">{p.brand || 'No Brand Specified'}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-mono text-xs text-slate-500 select-all">{p.sku || '--'}</td>
                                                <td className="p-4 text-slate-600 text-xs font-medium">{p.category}</td>
                                                <td className="p-4 text-right text-slate-400 font-medium line-through decoration-slate-300">
                                                    KES {parseFloat(p.original_price || '0').toLocaleString()}
                                                </td>
                                                <td className="p-4 text-right font-bold text-slate-900">
                                                    <div>KES {parseFloat(p.deal_price || '0').toLocaleString()}</div>
                                                    {p.discount_percentage > 0 && (
                                                        <span className="inline-block bg-emerald-50 text-[10px] text-emerald-700 font-bold px-1.5 py-0.5 rounded-md mt-0.5">
                                                            -{p.discount_percentage}% OFF
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                                        p.is_available 
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                                    }`}>
                                                        {p.is_available ? 'In Stock' : 'Hidden'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {individualMerchant.order_groups?.map((group) => (
                                <div key={group.unique_id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                        <div className="space-y-0.5">
                                            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Sub-Order Envelope ID</span>
                                            <span className="font-mono font-semibold text-slate-700 select-all">{group.unique_id}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="sm:text-right">
                                                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Allocation Status</span>
                                                <span className="font-bold text-indigo-600 capitalize tracking-wide mt-0.5 block">{group.status?.replace(/_/g, ' ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="divide-y divide-slate-100">
                                            {group.items?.map((item) => (
                                                <div key={item.unique_id} className="py-3 flex justify-between text-sm items-center first:pt-0 last:pb-0">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{item.product_title}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            Qty: <span className="font-semibold text-slate-700">{item.quantity}</span> × KES {parseFloat(item.price_at_purchase || '0').toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <p className="font-bold text-slate-900">KES {(item.total_item_gross || 0).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/80 p-3 rounded-xl text-center text-xs">
                                            <div className="space-y-0.5">
                                                <span className="text-slate-400 font-medium block">Gross Subtotal</span>
                                                <span className="font-semibold text-slate-700 text-sm">KES {parseFloat(group.group_gross_amount || '0').toLocaleString()}</span>
                                            </div>
                                            <div className="space-y-0.5 border-y sm:border-y-0 sm:border-x border-slate-200/60 py-2 sm:py-0">
                                                <span className="text-slate-400 font-medium block">Platform Fee ({parseFloat(group.items?.[0]?.take_rate_at_purchase || '0').toFixed(1)}%)</span>
                                                <span className="font-bold text-rose-600 text-sm">-KES {parseFloat(group.group_platform_cut || '0').toLocaleString()}</span>
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-slate-400 font-medium block">Net Earnings Allocation</span>
                                                <span className="font-extrabold text-emerald-600 text-sm">KES {parseFloat(group.group_merchant_payout || '0').toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'payouts' && (
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                                <h2 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Settlement Records History</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50/40 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                            <th className="p-4">Created Date</th>
                                            <th className="p-4">Target Channel</th>
                                            <th className="p-4 text-right">Gross Total</th>
                                            <th className="p-4 text-right">Net Payout</th>
                                            <th className="p-4">Gateway Reference</th>
                                            <th className="p-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {individualMerchant.payout_history?.map((ledger) => (
                                            <tr key={ledger.unique_id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 font-semibold text-slate-600 text-xs">
                                                    {ledger.created_at ? new Date(ledger.created_at).toLocaleDateString('en-KE', { dateStyle: 'medium' }) : '--'}
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-bold text-slate-800 text-xs uppercase tracking-wide">{ledger.payout_channel}</p>
                                                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 select-all">{ledger.payout_destination}</p>
                                                </td>
                                                <td className="p-4 text-right text-slate-400 font-medium text-xs">KES {parseFloat(ledger.gross_amount || '0').toLocaleString()}</td>
                                                <td className="p-4 text-right font-bold text-emerald-600">KES {parseFloat(ledger.net_payout_amount || '0').toLocaleString()}</td>
                                                <td className="p-4 font-mono text-xs text-slate-500 select-all">{ledger.transaction_reference || '--'}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
                                                        ${ledger.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                          ledger.status === 'failed' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                          'bg-amber-50 text-amber-700 border-amber-100'}`}
                                                    >
                                                        {ledger.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};