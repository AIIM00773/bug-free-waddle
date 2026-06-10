


import React, { useState } from 'react';
import { 
    HelpCircle, 
    MessageSquare, 
    Phone, 
    Mail, 
    ChevronDown, 
    Send, 
    CheckCircle2, 
    Clock, 
    ExternalLink 
} from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

export default function UserSupportView() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: 'General Inquiry',
        message: ''
    });

    const faqData: FAQItem[] = [
        {
            question: "How does Soko AI find the best deals?",
            answer: "Soko AI runs an automated real-time background processing pipeline that scans major Kenyan e-commerce marketplaces (such as Jumia) for specific structural attributes. It clusters matching products so you can easily compare pricing tiers and find matching entries instantly."
        },
        {
            question: "What happens when a category says 'exhausted monthly tokens'?",
            answer: "Standard tier accounts are given 20 complimentary monthly query tokens to monitor price updates. If you run out of tokens, background scrapers pause monitoring your specific links until your counter resets or you upgrade to Premium Pro."
        },
        {
            question: "Can I set up price tracking alerts for items out of stock?",
            answer: "Yes! If you search for a specialized category (e.g., specific Gym Equipment or shoes) and the local database returns empty records, you can hit the 'Smart Alert' trigger inside the product view to command the scraper engine to run a dedicated session."
        },
        {
            question: "How long does it take to get a response on an opened ticket?",
            answer: "Our technical operations team typically reviews database, scraper sync errors, or payment route disputes within 2 to 4 hours during active business tracking slots."
        }
    ];

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTicketForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitTicket = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would hook into your soko_ai_backend endpoint pipeline
        console.log("Submitting support ticket configuration:", ticketForm);
        setFormSubmitted(true);
        
        // Reset form state after timeout loop simulation
        setTimeout(() => {
            setTicketForm({ subject: '', category: 'General Inquiry', message: '' });
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* HEADER LAYER */}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Customer Support Desk</h2>
                <p className="text-xs text-slate-400 mt-1">Resolve system pipeline problems, monitor active query errors, or open direct messaging links.</p>
            </div>

            {/* DIRECT HOTLINE CHANNEL SEGMENTS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                        <MessageSquare size={18} />
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">WhatsApp Live Chat</h4>
                        <p className="text-[11px] text-slate-400">Instant agent sync channel.</p>
                        <a 
                            href="https://wa.me/254700000000" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline mt-1.5"
                        >
                            Open Chat <ExternalLink size={10} />
                        </a>
                    </div>
                </div>

                <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-start gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <Phone size={18} />
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">Direct Telephone</h4>
                        <p className="text-[11px] text-slate-400">Mon - Fri • 8 AM to 5 PM</p>
                        <a href="tel:+254700000000" className="block text-[11px] font-bold text-blue-600 hover:underline mt-1.5">
                            +254 700 000 000
                        </a>
                    </div>
                </div>

                <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-start gap-3">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                        <Mail size={18} />
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">Email Gateway</h4>
                        <p className="text-[11px] text-slate-400">For business partnerships.</p>
                        <a href="mailto:support@sokoai.com" className="block text-[11px] font-bold text-purple-600 hover:underline mt-1.5">
                            support@sokoai.com
                        </a>
                    </div>
                </div>
            </div>

            {/* LOWER BOUND ACTION INTERFACES */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-2">
                
                {/* ACCORDION DISCLOSURE SECTION (FAQ) */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                        <HelpCircle size={16} className="text-slate-400" />
                        <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h3>
                    </div>

                    <div className="space-y-2">
                        {faqData.map((faq, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div 
                                    key={idx} 
                                    className="border border-slate-100 rounded-xl overflow-hidden bg-white transition-all"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full px-4 py-3.5 flex items-center justify-between gap-4 text-left font-semibold text-xs text-slate-700 hover:bg-slate-50/60 transition-colors"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown 
                                            size={14} 
                                            className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-900' : ''}`} 
                                        />
                                    </button>
                                    
                                    <div className={`transition-all duration-200 overflow-hidden ${isOpen ? 'max-h-40 border-t border-slate-50' : 'max-h-0'}`}>
                                        <div className="p-4 text-[11px] leading-relaxed text-slate-500 bg-slate-50/30">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* TICKET DISPATCH CORE FORM MODULE */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dispatch Support Ticket</h3>
                            <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-semibold border border-amber-100/60">
                                <Clock size={10} /> 2h Response Avg
                            </div>
                        </div>

                        {formSubmitted ? (
                            <div className="p-6 text-center space-y-2 animate-fadeIn">
                                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={20} />
                                </div>
                                <h4 className="text-xs font-bold text-slate-900">Ticket Dispatched Successfully</h4>
                                <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto">
                                    Our telemetry queue has accepted your payload. Check your inbox for updates shortly.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setFormSubmitted(false)}
                                    className="mt-4 text-[11px] font-bold text-blue-600 hover:underline"
                                >
                                    Open another ticket
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitTicket} className="space-y-3.5">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-600">Issue Category</label>
                                    <select
                                        name="category"
                                        value={ticketForm.category}
                                        onChange={handleFormChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Scraper/Pipeline Error">Scraper/Pipeline Sync Error</option>
                                        <option value="Quota/Limit Restrict">Quota Quota Adjustments</option>
                                        <option value="M-Pesa/Payment Issue">Payment/M-Pesa Route Error</option>
                                    </select>
                               </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-600">Subject Heading</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        required
                                        placeholder="e.g., Scraper skipped Jumia shoe query"
                                        value={ticketForm.subject}
                                        onChange={handleFormChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-slate-300 placeholder:text-slate-300 transition-all"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-600">Detailed Message Log</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={4}
                                        placeholder="Describe the anomalies or database missing fields..."
                                        value={ticketForm.message}
                                        onChange={handleFormChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-slate-300 placeholder:text-slate-300 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                                >
                                    <Send size={12} /> Dispatch Telemetry Ticket
                                </button>
                            </form>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}