import {
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ExternalLink,
    Layers,
    ShoppingBag
} from 'lucide-react';
import { useMemo } from 'react';

import { useCart } from '../../Providers/CartProvider';

export default function ShoppingCartView() {
    const {
        items,
        totalItems,
        subtotal,
        tax,
        total,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    // Dynamically calculate how many unique platforms are sitting in the current cart layer
    const uniquePlatforms = useMemo(() => {
        const platforms = items.map(item => item?.merchant || 'Soko Market');
        return new Set(platforms).size;
    }, [items]);

    // Handle empty state gracefully
    if (items.length === 0) {
        return (
            <div className="w-full max-w-2xl mx-auto p-12 text-center bg-white border border-slate-100 rounded-2xl shadow-xs text-slate-800">
                <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Staged pipeline items will appear here when you prompt Soko AI to select deal vectors.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-slate-100 shadow-xs text-slate-800">

            {/* --- HEADER BLOCK --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">My Shopping Cart</h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Review staged items across aggregate platforms prior to processing your checkout order.
                    </p>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-center">
                    <button
                        onClick={clearCart}
                        className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                        Clear All
                    </button>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-lg text-xs font-bold text-slate-500">
                        <Layers className="h-3.5 w-3.5 text-slate-400" />
                        <span>{uniquePlatforms} Aggregate {uniquePlatforms === 1 ? 'Node' : 'Nodes'} Active</span>
                    </div>
                </div>
            </div>

            {/* --- MAIN INTERFACE GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* COLUMN 1 & 2: STAGED ITEM CARDS */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        // Dynamically render theme color options depending on what marketplace was scraped
                        const isJumia = item.merchant?.toLowerCase() === 'jumia';
                        const badgeStyles = isJumia
                            ? "bg-orange-50 text-orange-600 border-orange-100"
                            : "bg-blue-50 text-blue-600 border-blue-100";

                        return (
                            <div
                                key={item.id}
                                className="group relative bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 transition-all hover:border-slate-300 hover:shadow-xs"
                            >
                                {/* Thumbnail */}
                                <div className="h-20 w-20 sm:h-24 sm:w-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                                    <img
                                        src={item.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&auto=format&fit=crop&q=60"}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-103"
                                    />
                                </div>

                                {/* Specifications Metadata Box */}
                                <div className="flex flex-col justify-between flex-1 min-w-0">
                                    <div className="space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 pr-4">
                                                {item.title}
                                            </h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Dynamic Platform Tag Trace */}
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeStyles}`}>
                                                {item.merchant || 'Soko Target'}
                                            </span>
                                            {item.location && (
                                                <a
                                                    href={item.location}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    <span>Source Link</span>
                                                    <ExternalLink className="h-2.5 w-2.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer: Pricing and Context Steppers */}
                                    <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-slate-50">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xs sm:text-sm font-black text-slate-900">
                                                KSh {item.price.toLocaleString()}
                                            </span>
                                            {item.originalPrice && (
                                                <span className="text-[11px] text-slate-400 line-through">
                                                    KSh {item.price.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        {/* Numeric Stepper Frame Connected to Delta Modifier */}
                                        <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-lg p-0.5">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-1 text-slate-400 hover:bg-white hover:text-slate-900 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-7 font-mono text-xs font-bold text-center text-slate-800">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-1 text-slate-500 hover:bg-white hover:text-slate-900 rounded-md transition-colors cursor-pointer"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* COLUMN 3: SUMMARY ANALYSIS BREAKDOWN (SIDEBAR BOX) */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 lg:sticky lg:top-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Verification Matrix</h3>

                    <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Staged Volume</span>
                            <span className="font-mono text-slate-900">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Aggregate Subtotal</span>
                            <span className="font-mono text-slate-900">KSh {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Estimated VAT (16%)</span>
                            <span className="font-mono text-slate-900">KSh {Math.round(tax).toLocaleString()}</span>
                        </div>

                        <div className="h-px bg-slate-200 my-2"></div>

                        <div className="flex justify-between text-sm font-black">
                            <span className="text-slate-900">Target Total Vector</span>
                            <span className="text-slate-950 font-mono">KSh {Math.round(total).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Submission Action Trigger */}
                    <button className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl py-3 px-4 text-xs font-bold shadow-sm transition-all cursor-pointer">
                        <span>Proceed to Automated Routing</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                        Cross-platform checkout pipelines automatically route requests securely using integration parameters.
                    </p>
                </div>

            </div>
        </div>
    );
}