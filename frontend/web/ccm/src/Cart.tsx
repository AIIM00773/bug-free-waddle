import { useState } from 'react';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShieldCheck,
    Truck,
    ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample abstracted item payload matching what your database syncs
interface CartItem {
    id: string;
    title: string;
    price: number; // in KSh
    image: string;
    quantity: number;
    platformBadge: string; // Hidden architecture details surface only as a minor trust label
    specification: string;
}

export default function CartPage() {
    // Mocking the local state synchronized from your global state/cart context
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const nextQty = item.quantity + delta;
                return nextQty > 0 ? { ...item, quantity: nextQty } : item;
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    // Abstracted Financial Calculations
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const estimatedDelivery = subtotal > 0 ? 250 : 0; // Flat-rate simplified abstraction
    const grandTotal = subtotal + estimatedDelivery;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-slate-50 px-4">
                <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100 shadow-xs">
                    <ShoppingBag className="h-6 w-6 stroke-[2]" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Your cart is empty</h2>
                <p className="text-xs text-slate-500 font-medium mt-1 mb-6 text-center max-w-xs">
                    Looks like you haven't added any items to your smart shopping basket yet.
                </p>
                <Link to="/">
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md shadow-emerald-600/10">
                        <ArrowLeft className="h-4 w-4" /> Discover Premium Deals
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-50/60 font-sans text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Page Identity Header */}
                <div className="mb-6 flex items-center gap-3">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Review Your Selection</h1>
                    <span className="text-xs font-bold font-mono bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-full">
                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                    </span>
                </div>

                {/* Dynamic Structural Grid Splitter */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">



                    {/* LEFT SIDE: Unified Registry Stream Component */}
                    <div className="lg:col-span-2 space-y-3.5">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex gap-4 relative overflow-hidden group select-none"
                            >
                                {/* 1. Enhanced Product Frame & Aspect Scale */}
                                <div className="h-24 w-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                                    />
                                </div>

                                {/* 2. Textual Context & Action Dashboard */}
                                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">

                                    {/* Title, Details and Subtle Status Badge */}
                                    <div className="space-y-1 pr-6">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-slate-900 truncate tracking-tight group-hover:text-emerald-700 transition-colors">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                {item.specification}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                            <span className="text-[11px] text-emerald-600 font-bold">In Stock</span>
                                        </div>
                                    </div>

                                    {/* Dynamic Quantity Adjuster & Final Cost Matrix */}
                                    <div className="flex items-end justify-between pt-3">

                                        {/* Polished Stepper Pill Block */}
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-2xs">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="h-7 w-7 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200/60 rounded-lg transition active:scale-90"
                                                title="Decrease quantity"
                                            >
                                                <Minus className="h-3 w-3 stroke-[2.5]" />
                                            </button>
                                            <span className="px-3 text-xs font-bold font-mono text-slate-900 min-w-[28px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="h-7 w-7 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200/60 rounded-lg transition active:scale-90"
                                                title="Increase quantity"
                                            >
                                                <Plus className="h-3 w-3 stroke-[2.5]" />
                                            </button>
                                        </div>

                                        {/* Pricing Aggregation Ledger */}
                                        <div className="text-right">
                                            <span className="text-[10px] text-slate-400 font-bold block leading-none font-mono tracking-wide mb-1">
                                                KSh {item.price.toLocaleString()} each
                                            </span>
                                            <span className="text-base font-black text-slate-900 font-mono tracking-tight bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">
                                                KSh {(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>

                                    </div>
                                </div>

                                {/* 3. Sleek Floating Dismiss Handle */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="absolute top-3 right-3 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50/60 rounded-xl opacity-80 group-hover:opacity-100 transition-all duration-150"
                                    title="Remove Item"
                                >
                                    <Trash2 className="h-4 w-4 stroke-[2]" />
                                </button>

                            </div>
                        ))}
                    </div>










                    {/* RIGHT SIDE: Financial Ledger Consolidation Terminal */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 space-y-5">
                        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Order Summary</h2>

                        {/* Calculation Breakdowns Stack */}
                        <div className="space-y-3 border-b border-slate-100 pb-4 text-xs font-semibold text-slate-600">
                            <div className="flex justify-between items-center">
                                <span>Items Subtotal</span>
                                <span className="font-mono text-slate-900 font-bold">KSh {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1">
                                    Estimated Delivery <Truck className="h-3 w-3 text-slate-400" />
                                </span>
                                <span className="font-mono text-slate-900 font-bold">KSh {estimatedDelivery.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Total Balance Displayer */}
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Total Amount</span>
                            <span className="text-xl font-black font-mono text-emerald-600 tracking-tight">
                                KSh {grandTotal.toLocaleString()}
                            </span>
                        </div>

                        {/* Safe Framework Checkpoint Bulletins */}
                        <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl space-y-2">
                            <div className="flex items-start gap-2 text-[11px] text-slate-500 font-medium leading-relaxed">
                                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Unified escrow protection guarantees refunds on canceled item dispatches.</span>
                            </div>
                        </div>

                        {/* Main Action Forwarding Gateway Dispatcher */}
                        <button className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10">
                            Proceed to Secure Checkout
                            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                        </button>

                        {/* Safe Backout Hyperlink Anchor */}
                        <div className="text-center">
                            <Link to="/" className="text-[11px] font-bold text-emerald-600 hover:underline inline-flex items-center gap-1">
                                Continue searching for items
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}