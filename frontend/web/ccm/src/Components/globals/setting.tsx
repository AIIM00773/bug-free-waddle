import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  MessageSquare, 
  Shield, 
  Trash2, 
  Globe, 
  CheckCircle2, 
  Eye,
  Sparkles,
  Settings,
  X
} from 'lucide-react';

export function UserSettings({ onBackToChat }) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Customer-centric preferences state
  const [settings, setSettings] = useState({
    pushNotifications: true,
    whatsappAlerts: true,
    smsTracking: false,
    autoScrollChat: true,
    enterToSend: true,
    highContrastChat: false,
    language: 'en', // 'en' or 'sw'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2500);
    }, 500);
  };

  const handleClearCache = () => {
    if (window.confirm('Clear local chat cache? active transaction channels will remain intact.')) {
      // Logic for purging local state/cache goes here
      alert('Local workspace optimized.');
    }
  };

  return (
    /* TRUE FLOATING OVERLAY: Matches UserProfile depth and backdrop mechanics */
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200">
      
      {/* CARD BODY PANEL */}
      <div className="w-full h-full md:max-w-3xl md:h-[85vh] bg-[#0b0f14] text-zinc-200 font-sans flex flex-col relative rounded-none md:rounded-2xl border-none md:border md:border-zinc-800/60 shadow-2xl overflow-hidden">
        
        {/* ================= PREMIUM HEADER ================= */}
        <div className="px-6 md:px-8 pt-8 pb-6 flex flex-col gap-6 shrink-0 border-b border-zinc-900/60 bg-gradient-to-b from-zinc-900/20 to-transparent">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBackToChat}
              className="group flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors cursor-pointer border border-[1px] border-red-500 px-3 py-1 rounded-3xl "
            >
              <X size={14} className="transition-transform group-hover:-translate-x-0.5" />
              <span>Close </span>
            </button>

            <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800/80 px-2.5 py-1 rounded-full">
              <Settings size={11} className="text-emerald-400" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">App Settings</h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">Configure your hyper-local interface experience</p>
          </div>
        </div>

        {/* ================= TAB NAVIGATION ================= */}
        <div className="flex px-6 md:px-8 border-b border-zinc-900/40 bg-[#0b0f14] sticky top-0 z-10">
          {[
            { id: 'notifications', label: 'Alerts & Pings', icon: Bell },
            { id: 'interface', label: 'Feed Mechanics', icon: MessageSquare },
            { id: 'privacy', label: 'Data & Privacy', icon: Shield }
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 mr-6 py-4 text-xs font-medium relative transition-all cursor-pointer
                  ${isSelected ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
                `}
              >
                <span>{tab.label}</span>
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* ================= TAB PANELS ================= */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 custom-scrollbar">
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-xl">
            
            {/* TAB 1: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Choose how runners and automated order checkpoints pipeline updates to your devices.
                </p>

                <div className="space-y-4">
                  {/* Toggle Option Row */}
                  <div className="flex items-center justify-between py-3 border-b border-zinc-900/40">
                    <div>
                      <h4 className="text-sm font-medium text-white">In-App Push Alerts</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Real-time status changes inside the viewport browser</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('pushNotifications')}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${settings.pushNotifications ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${settings.pushNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* WhatsApp Alerts */}
                  <div className="flex items-center justify-between py-3 border-b border-zinc-900/40">
                    <div>
                      <h4 className="text-sm font-medium text-white">WhatsApp Dispatch Alerts</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Receive runner map links directly on your connected M-Pesa line</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('whatsappAlerts')}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${settings.whatsappAlerts ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${settings.whatsappAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* SMS Tracking */}
                  <div className="flex items-center justify-between py-3 border-b border-zinc-900/40">
                    <div>
                      <h4 className="text-sm font-medium text-white">Fallback SMS Pings</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Standard text messages when off-grid or offline</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('smsTracking')}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${settings.smsTracking ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${settings.smsTracking ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INTERFACE / FEED MECHANICS */}
            {activeTab === 'interface' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  
                  {/* Language Selection Dropdown */}
                  <div className="group flex flex-col gap-2 border-b border-zinc-900 pb-4">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                      <Globe size={12} />
                      <span>Display Language / Lugha</span>
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSelectChange('language', e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-850 text-xs text-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-zinc-700 transition-colors"
                    >
                      <option value="en">English (Default)</option>
                      <option value="sw">Kiswahili</option>
                    </select>
                  </div>

     
                </div>
              </div>
            )}

            {/* TAB 3: PRIVACY & SYSTEM DATA */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900/80 space-y-3">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Eye size={12} className="text-zinc-500" />
                    Workspace Encryption
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Chat payloads, local micro-logistics tags, and sync routes are secured peer-to-peer. Clearing local app structures improves platform computation speeds.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-950/40 bg-rose-950/10 text-rose-400 hover:bg-rose-950/20 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} className="text-rose-400" />
                    <span>Clear Local Feed Caches</span>
                  </button>
                </div>
              </div>
            )}

            {/* ================= ACTIONS TRAY ================= */}
            <div className="pt-6 flex items-center justify-between gap-4 border-t border-zinc-900/40">
              <div className="h-4 flex items-center">
                {showNotification && (
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                    <CheckCircle2 size={12} /> Local properties synced.
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-900 disabled:text-zinc-600 rounded-full text-black text-xs font-semibold tracking-tight transition-all active:scale-[0.98] cursor-pointer"
              >
                {isSaving ? 'Updating Workspace...' : 'Apply Workspace Changes'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
