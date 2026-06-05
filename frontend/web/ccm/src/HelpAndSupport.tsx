

import { useState } from "react";
import {
    Search,
    MessageCircle,
    Mail,
    HelpCircle,
    ChevronRight,
    Send,
    BookOpen,
} from "lucide-react";

export default function HelpSupportPage() {
    const [query, setQuery] = useState("");
    const [message, setMessage] = useState("");

    const faqs = [
        {
            question: "How does SokoAI search work?",
            answer:
                "We combine AI matching and structured filters to help you find the best product deals across multiple marketplaces.",
        },
        {
            question: "Is my data secure?",
            answer:
                "Yes. We only store minimal authentication data and never share your personal information with third parties.",
        },
        {
            question: "Why am I not seeing results?",
            answer:
                "Try adjusting your filters or switching between AI Search and Standard Search for better results.",
        },
        {
            question: "How do I track prices?",
            answer:
                "Add items to your cart or wishlist and we will notify you when prices change.",
        },
    ];

    const filteredFaqs = faqs.filter((f) =>
        f.question.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* ================= HEADER ================= */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold">Help & Support</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Find answers, guides, or contact support.
                    </p>

                    {/* Search */}
                    <div className="mt-5 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search help articles..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                        />
                    </div>
                </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

                {/* ================= QUICK ACTIONS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition cursor-pointer">
                        <MessageCircle className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold mt-2">Live Chat</h3>
                        <p className="text-xs text-slate-500">
                            Talk to support instantly
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition cursor-pointer">
                        <Mail className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold mt-2">Email Support</h3>
                        <p className="text-xs text-slate-500">
                            support@sokoai.com
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition cursor-pointer">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold mt-2">Documentation</h3>
                        <p className="text-xs text-slate-500">
                            Read user guides
                        </p>
                    </div>

                </div>

                {/* ================= FAQ ================= */}
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-emerald-600" />
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-3">
                        {filteredFaqs.length === 0 && (
                            <p className="text-sm text-slate-500">
                                No results found.
                            </p>
                        )}

                        {filteredFaqs.map((faq, idx) => (
                            <details
                                key={idx}
                                className="group border border-slate-200 rounded-lg p-3"
                            >
                                <summary className="flex justify-between items-center cursor-pointer list-none">
                                    <span className="text-sm font-medium">
                                        {faq.question}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-slate-400 group-open:rotate-90 transition" />
                                </summary>

                                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* ================= CONTACT FORM ================= */}
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h2 className="font-bold text-lg mb-1">
                        Still need help?
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">
                        Send us a message and we’ll respond soon.
                    </p>

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your issue..."
                        className="w-full min-h-[120px] p-3 text-sm border border-slate-200 rounded-lg bg-slate-50 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                    />

                    <button className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                        <Send className="h-4 w-4" />
                        Submit Request
                    </button>
                </div>

            </div>
        </div>
    );
}