import React from 'react';
import { 
  TrendingUp, 
  Cpu, 
  Globe, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

const NEWS_DATA = [
  {
    category: 'Market Trend',
    title: 'The Rise of "Conversational Commerce"',
    excerpt: 'Shoppers are increasingly using AI agents to compare prices and check stock. Ensure your product descriptions are keyword-rich to stay visible.',
    icon: Cpu,
    color: 'text-indigo-600'
  },
  {
    category: 'Logistics',
    title: 'Omnichannel: Your Store is a Hub',
    excerpt: 'Data shows that stores offering "Click & Collect" see a 30% increase in secondary sales. Use your branches as fulfillment nodes.',
    icon: Globe,
    color: 'text-emerald-600'
  },
  {
    category: 'Growth',
    title: 'Ethical Branding is Loyalty Gold',
    excerpt: 'In 2026, transparency about your sourcing and fair trade practices is no longer optional—it is a primary driver of customer retention.',
    icon: ShieldCheck,
    color: 'text-amber-600'
  }
];

export function MerchantIntelligenceHub() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <header className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Intelligence Hub</h1>
          <p className="text-slate-500 mt-1">Daily insights, market shifts, and strategies to grow your store.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-200">View Market Report</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {NEWS_DATA.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 ${item.color}`}>
                <item.icon size={14} /> {item.category}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-3">{item.title}</h2>
              <p className="text-slate-600 mt-2 leading-relaxed">{item.excerpt}</p>
              <button className="mt-4 flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                Read Full Briefing <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Sidebar: Market Pulse */}
        <aside className="space-y-6">
          <div className="bg-indigo-900 p-6 rounded-2xl text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart3 size={20} /> Market Pulse 2026
            </h3>
            <ul className="space-y-4">
              <li className="flex justify-between border-b border-indigo-800 pb-2">
                <span className="text-indigo-200">Avg. Basket Value</span>
                <span className="font-bold text-emerald-400">+12%</span>
              </li>
              <li className="flex justify-between border-b border-indigo-800 pb-2">
                <span className="text-indigo-200">Mobile Traffic</span>
                <span className="font-bold text-emerald-400">74%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-indigo-200">Conversion Rate</span>
                <span className="font-bold text-indigo-100">3.2%</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-300">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Lightbulb className="text-yellow-500" size={20} /> Pro Tip
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Data-Driven Pricing:</strong> Don't guess your prices. Use our "Price Competition Record" feature to see how you rank against the top 5% of merchants.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}