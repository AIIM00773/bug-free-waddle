import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  Wallet, 
  Package, 
  ArrowRight 
} from 'lucide-react';

const COURSES = [
  { id: 1, category: 'Onboarding', title: 'Setting up your first storefront', duration: '5 min', completed: true },
  { id: 2, category: 'Finances', title: 'How to configure M-Pesa Payouts', duration: '3 min', completed: false },
  { id: 3, category: 'Operations', title: 'Fulfilling your first order', duration: '8 min', completed: false },
  { id: 4, category: 'Growth', title: 'Optimizing product images for clicks', duration: '4 min', completed: false },
];

export function LearningCenterView() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Hero Section */}
      <div className="bg-indigo-900 rounded-2xl p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to SokoAcademy</h1>
          <p className="text-indigo-200 text-lg">Master the platform, scale your business, and maximize your payouts.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-indigo-400" size={20} />
          <input 
            type="text" 
            placeholder="Search guides, tips, and tutorials..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Progress Tracker (Sidebar) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">My Learning Path</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Progress</span>
                <span className="font-bold text-emerald-600">25%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COURSES.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${course.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {course.completed ? <CheckCircle2 size={24} /> : <BookOpen size={24} />}
                  </div>
                  <span className="text-xs font-medium text-slate-400">{course.duration}</span>
                </div>
                
                <h3 className="font-bold text-slate-900 mb-1">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{course.category}</p>
                
                <button className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
                  {course.completed ? 'Review Lesson' : 'Start Learning'} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}