import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Shield, 
  Trash2, 
  Globe, 
  CheckCircle2, 
  Eye, 
  Sparkles, 
  X,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UserSettings({ onBackToChat }) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [settings, setSettings] = useState({
    pushNotifications: true,
    whatsappAlerts: true,
    smsTracking: false,
    autoScrollChat: true,
    enterToSend: true,
    highContrastChat: false,
    language: 'en',
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
    if (window.confirm('Clear local chat cache? Active transaction channels will remain intact.')) {
      alert('Local workspace optimized.');
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Alerts & Pings', icon: Bell },
    { id: 'interface', label: 'Feed Mechanics', icon: MessageSquare },
    { id: 'privacy', label: 'Data & Privacy', icon: Shield }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#07080a]/80 backdrop-blur-lg flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-150">
      <div className="w-full h-full md:max-w-3xl md:h-[85vh] bg-[#0d0f12] text-zinc-200 font-sans flex flex-col relative rounded-none md:rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.06] bg-[#11141a]/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
              <Sparkles size={16} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-zinc-100 tracking-wide font-sans">App Settings</h2>
              <span className="text-[10px] text-zinc-500 font-mono tracking-tight flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                SYSTEM PREFERENCES
              </span>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onBackToChat} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-400 hover:text-zinc-200 text-xs transition-all duration-150"
          >
            <X size={14} />
            <span className="text-xs font-medium">Close</span>
          </button>
        </div>

        {/* SEGMENTED CONTROL TABS */}
        <div className="flex items-center border-b border-white/[0.06] bg-[#0d0f12] px-6 py-2 overflow-x-auto no-scrollbar gap-1.5 shrink-0">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                type="button"
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap ${
                  isActive 
                    ? 'bg-white/[0.08] text-cyan-300 border border-cyan-500/30' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                <tab.icon size={14} className={isActive ? 'text-cyan-400' : 'text-zinc-500'} /> 
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0d0f12] custom-scrollbar">
          <form onSubmit={handleSaveSettings} className="max-w-xl mx-auto space-y-6 pb-20">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <motion.div 
                  key="notifications"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4 bg-[#13161c] p-5 rounded-xl border border-white/[0.06]"
                >
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed border-b border-white/[0.06] pb-3">
                    Choose how runners and automated order checkpoints pipeline updates to your devices.
                  </p>

                  <div className="space-y-3">
                    <PerplexityToggle 
                      title="In-App Push Alerts" 
                      description="Real-time status changes inside the viewport browser" 
                      checked={settings.pushNotifications} 
                      onChange={() => handleToggle('pushNotifications')} 
                    />

                    <PerplexityToggle 
                      title="WhatsApp Dispatch Alerts" 
                      description="Receive runner map links directly on your connected M-Pesa line" 
                      checked={settings.whatsappAlerts} 
                      onChange={() => handleToggle('whatsappAlerts')} 
                    />

                    <PerplexityToggle 
                      title="Fallback SMS Pings" 
                      description="Standard text messages when off-grid or offline" 
                      checked={settings.smsTracking} 
                      onChange={() => handleToggle('smsTracking')} 
                    />
                  </div>
                </motion.div>
              )}

              {/* TAB 2: INTERFACE / FEED MECHANICS */}
              {activeTab === 'interface' && (
                <motion.div 
                  key="interface"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4 bg-[#13161c] p-5 rounded-xl border border-white/[0.06]"
                >
                  <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-[#181c24] border border-white/[0.06] focus-within:border-cyan-500/50 transition-all">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium flex items-center gap-1.5">
                      <Globe size={12} className="text-zinc-500" />
                      Display Language / Lugha
                    </label>
                    <div className="relative flex items-center">
                      <select
                        value={settings.language}
                        onChange={(e) => handleSelectChange('language', e.target.value)}
                        className="w-full bg-transparent text-xs text-zinc-100 outline-none appearance-none cursor-pointer pr-4"
                      >
                        <option value="en" className="bg-[#13161c]">English (Default)</option>
                        <option value="sw" className="bg-[#13161c]">Kiswahili</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-0 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                    <PerplexityToggle 
                      title="Auto-Scroll Feed" 
                      description="Automatically scroll down as new responses and offers arrive" 
                      checked={settings.autoScrollChat} 
                      onChange={() => handleToggle('autoScrollChat')} 
                    />

                    <PerplexityToggle 
                      title="Enter Key to Send" 
                      description="Press Enter to send prompts instead of Shift + Enter" 
                      checked={settings.enterToSend} 
                      onChange={() => handleToggle('enterToSend')} 
                    />
                  </div>
                </motion.div>
              )}

              {/* TAB 3: PRIVACY & SYSTEM DATA */}
              {activeTab === 'privacy' && (
                <motion.div 
                  key="privacy"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4 bg-[#13161c] p-5 rounded-xl border border-white/[0.06]"
                >
                  <div className="p-4 rounded-lg bg-[#181c24] border border-white/[0.06] space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-300 flex items-center gap-2">
                      <Eye size={13} className="text-cyan-400" />
                      Workspace Encryption
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Chat payloads, local micro-logistics tags, and sync routes are secured peer-to-peer. Clearing local app structures improves platform computation speeds.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleClearCache}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 text-xs font-medium transition-all"
                    >
                      <Trash2 size={13} />
                      <span>Clear Local Feed Caches</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* ACTION TRAY */}
            <div className="pt-4 flex items-center justify-between gap-4 border-t border-white/[0.06]">
              <div className="h-5 flex items-center">
                {showNotification && (
                  <span className="text-xs text-cyan-400 font-mono font-medium flex items-center gap-1.5 animate-in fade-in duration-200">
                    <CheckCircle2 size={13} /> Properties synced successfully
                  </span>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#0d0f12] text-xs font-semibold rounded-lg shadow-lg shadow-cyan-950/50 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Updating Workspace...</span>
                  </>
                ) : (
                  <span>Apply Workspace Changes</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

// Custom Perplexity Style Toggle Switch Component
function PerplexityToggle({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[#181c24] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
      <div className="pr-4">
        <h4 className="text-xs font-medium text-zinc-100">{title}</h4>
        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
          checked ? 'bg-cyan-500' : 'bg-zinc-800'
        }`}
      >
        <div 
          className={`w-4 h-4 rounded-full bg-[#0d0f12] shadow-md transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`} 
        />
      </button>
    </div>
  );
}
