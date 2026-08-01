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
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
  Sliders,
  Smartphone,
  Terminal,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UserSettings({ onBackToChat }) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isNavMinimized, setIsNavMinimized] = useState(false);

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-0 animate-in fade-in duration-200">
      <div className="w-full h-full md:max-w-full md:h-[100vh] bg-[#F8FAFC] text-slate-800 font-sans flex flex-col md:flex-row relative rounded-none shadow-2xl overflow-hidden">
        
        {/* LEFT NAV SIDEBAR */}
        <div 
          className={`bg-[#191a1a]  text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 transition-all duration-300 ease-in-out ${
            isNavMinimized ? 'md:w-15' : 'md:w-64'
          } w-full`}
        >
          <div>
            {/* Brand / Title Header with Toggle Button */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full  shrink-0">
                  <Settings size={18} className="text-indigo-400" />
                </div>
                {!isNavMinimized && (
                  <span className="font-semibold text-white tracking-wide text-sm whitespace-nowrap">
                    SETTINGS 
                  </span>
                )}
              </div>
              
              {/* Sidebar Collapse Toggle Button */}
              <button
                type="button"
                onClick={() => setIsNavMinimized(!isNavMinimized)}
                className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors  "
                title={isNavMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
              >
                {isNavMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              
            </div>

            {/* Navigation Menu */}
            <div className="p-3 space-y-6 hidden md:inline-block w-full">
              <div>
                {!isNavMinimized && (
                  <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Preferences
                  </p>
                )}
                <div className="space-y-4">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        title={isNavMinimized ? tab.label : undefined}
                        className={` flex items-center ${
                          isNavMinimized ? 'justify-center p-2  w-fit rounded-full' : 'justify-between px-3 py-2.5  rounded-xl w-full'
                        } text-xs font-medium transition-all duration-150 relative ${
                          isActive 
                            ? 'bg-none  text-white bg-slate-800/40  shadow-sm  uppercase ' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? 'text-indigo-400 shrink-0' : 'text-slate-400 shrink-0'} />
                          {!isNavMinimized && <span className="whitespace-nowrap">{tab.label}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer / Back Action */}
          <div className="p-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onBackToChat}
              title={isNavMinimized ? "Back to Chat" : undefined}
              className={`w-full flex items-center ${
                isNavMinimized ? 'justify-center py-2.5' : 'justify-center gap-2 px-4 py-2.5'
              } rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-all`}
            >
              <ArrowLeft size={16} className="shrink-0" />
              {!isNavMinimized && <span className="whitespace-nowrap">Back to Chat</span>}
            </button>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
          
          {/* Top Header Bar */}
          <div className="h-16 px-8 bg-[#191a1a]  border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-lg font-semibold text-slate-50">Settings</h1>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-4">
              {showNotification && (
                <span className="text-xs text-emerald-600 font-mono font-medium flex items-center gap-1.5 animate-in fade-in duration-200">
                  <CheckCircle2 size={14} /> Saved successfully
                </span>
              )}
              
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              <button 
                type="button" 
                onClick={onBackToChat}
                className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Navigation Tabs */}
          <div className="bg-white px-8 border-b border-slate-200/80 flex items-center gap-8 overflow-x-auto shrink-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive 
                      ? 'border-slate-900 text-slate-900 font-semibold' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 2-Column Dashboard Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: System Overview Card */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                
                {/* Status Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
                    <Terminal size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      System Preferences
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Active Profile Sync
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Status Breakdown */}
                <div className="space-y-3 pb-6 border-b border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Active Summary</h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-500">Language</span>
                      <span className="font-mono font-medium text-slate-800">
                        {settings.language === 'sw' ? 'Kiswahili' : 'English'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-500">WhatsApp Alerts</span>
                      <span className={`font-semibold ${settings.whatsappAlerts ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {settings.whatsappAlerts ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-500">Auto-Scroll Feed</span>
                      <span className={`font-semibold ${settings.autoScrollChat ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {settings.autoScrollChat ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Storage & Environment Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Environment</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Changes made here apply instantly across your local merchant session and dispatch alerts.
                  </p>
                </div>

              </div>

              {/* RIGHT COLUMN: Settings Forms */}
              <div className="lg:col-span-8 space-y-6">
                <form onSubmit={handleSaveSettings}>
                  <AnimatePresence mode="wait">
                    
                    {/* TAB 1: NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                      <motion.div 
                        key="notifications"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">Alerts & Pings</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Choose how runners and automated order checkpoints pipeline updates to your devices
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <SettingsToggle 
                            title="In-App Push Alerts" 
                            description="Real-time status changes inside the viewport browser" 
                            checked={settings.pushNotifications} 
                            onChange={() => handleToggle('pushNotifications')} 
                          />
                          <SettingsToggle 
                            title="WhatsApp Dispatch Alerts" 
                            description="Receive runner map links directly on your connected M-Pesa line" 
                            checked={settings.whatsappAlerts} 
                            onChange={() => handleToggle('whatsappAlerts')} 
                          />
                          <SettingsToggle 
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
                        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">Feed Mechanics</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Customize the display language and chat interaction controls
                            </p>
                          </div>
                        </div>

                        <CleanSelect
                          label="Display Language / Lugha"
                          icon={<Globe size={14} />}
                          value={settings.language}
                          onChange={(v) => handleSelectChange('language', v)}
                          options={[
                            { label: 'English (Default)', value: 'en' },
                            { label: 'Kiswahili', value: 'sw' }
                          ]}
                        />

                        <div className="space-y-3 pt-2">
                          <SettingsToggle 
                            title="Auto-Scroll Feed" 
                            description="Automatically scroll down as new responses and offers arrive" 
                            checked={settings.autoScrollChat} 
                            onChange={() => handleToggle('autoScrollChat')} 
                          />
                          <SettingsToggle 
                            title="Enter Key to Send" 
                            description="Press Enter to send prompts instead of Shift + Enter" 
                            checked={settings.enterToSend} 
                            onChange={() => handleToggle('enterToSend')} 
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 3: PRIVACY & DATA */}
                    {activeTab === 'privacy' && (
                      <motion.div 
                        key="privacy"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">Data & Privacy</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Manage local encryption and cached application structures
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-800 flex items-center gap-2">
                            <Eye size={14} className="text-indigo-600" />
                            Workspace Encryption
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Chat payloads, local micro-logistics tags, and sync routes are secured peer-to-peer. Clearing local app structures improves platform computation speeds without affecting active transactions.
                          </p>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleClearCache}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all"
                          >
                            <Trash2 size={14} />
                            <span>Clear Local Feed Caches</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUB-COMPONENTS
   ========================================================= */

function SettingsToggle({ title, description, checked, onChange }) {
  return (
    <div 
      onClick={onChange}
      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer select-none"
    >
      <div className="pr-4">
        <h4 className="text-xs font-semibold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5 leading-normal">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(e) => {
          e.stopPropagation();
          onChange();
        }}
        className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
          checked ? 'bg-indigo-600' : 'bg-slate-300'
        }`}
      >
        <div 
          className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`} 
        />
      </button>
    </div>
  );
}

function CleanSelect({ label, value, onChange, options, icon }) {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50/60 border border-slate-200/80 focus-within:border-slate-400 focus-within:bg-white transition-all relative w-full">
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
      </label>
      <div className="relative flex items-center">
        <select 
          value={value ?? ''} 
          onChange={(e) => onChange && onChange(e.target.value)} 
          className="w-full bg-transparent text-xs text-slate-900 outline-none appearance-none cursor-pointer pr-4 font-medium"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="text-slate-800">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-0 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
