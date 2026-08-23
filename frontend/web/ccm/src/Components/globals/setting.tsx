import React, { useState, useCallback, useEffect } from 'react';
import {
  Bell,
  MessageSquare,
  Shield,
  Trash2,
  Globe,
  CheckCircle2,
  Eye,
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
  Terminal,
  Settings,
  Smartphone,
  Truck,
  CreditCard,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ccmLogo from '../../assets/ccmlogo1.png';

// Import your custom hook (adjust the path to match your project structure)
import { useProfile } from '../../Providers/profileContext';

export interface UserSettingsProps {
  onBackToChat: () => void;
  onSave?: (settings: SettingsState) => Promise<void> | void;
}

export interface SettingsState {
  pushNotifications: boolean;
  whatsappAlerts: boolean;
  smsTracking: boolean;
  orderDispatchAlerts: boolean;
  mpesaReceiptAlerts: boolean;
  LocationAccess: boolean;
  autoScrollChat: boolean;
  enterToSend: boolean;
  highContrastChat: boolean;
  language: string;
}

interface SelectOption {label: string;value: string;}

interface TabItem {
  id: 'notifications' | 'interface' | 'privacy';
  label: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  { id: 'notifications', label: 'Alerts & Channels', icon: Bell },
  { id: 'interface', label: 'Feed Mechanics', icon: MessageSquare },
  { id: 'privacy', label: 'Data & Security', icon: Shield }
];


const LANGUAGE_OPTIONS: SelectOption[] = [{ label: 'English (Default)', value: 'en' },];


// Helper to load UI-only settings that don't exist in the DB
const loadLocalUISettings = () => ({
  autoScrollChat: JSON.parse(localStorage.getItem('soko_ui_autoScrollChat') ?? 'true'),
  enterToSend: JSON.parse(localStorage.getItem('soko_ui_enterToSend') ?? 'true'),
  highContrastChat: JSON.parse(localStorage.getItem('soko_ui_highContrastChat') ?? 'false'),
});


export function UserSettings({ onBackToChat, onSave }: UserSettingsProps) {
  const { user, editIdentity } = useProfile();

  const [activeTab, setActiveTab] = useState<TabItem['id']>('notifications');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [isNavMinimized, setIsNavMinimized] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Initialize state with user profile data + local UI data
  const [settings, setSettings] = useState<SettingsState>({
    pushNotifications: user?.allow_push_notification,
    whatsappAlerts: user?.allow_whatsApp_dispatch_alerts ,
    smsTracking: user?.allow_sms_tracking_pings,
    orderDispatchAlerts: user?.allow_order_dispatch_checkpoints_alerts,
    mpesaReceiptAlerts: user?.allow_payment_receipt_alert ,
    LocationAccess: user?.allow_location_access,
    language: user?.preferred_language || 'en',
  });
  

  // Re-sync settings if the user object finishes loading asynchronously
  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        pushNotifications: user.allow_push_notification ?? prev.pushNotifications,
        whatsappAlerts: user.allow_whatsApp_dispatch_alerts ?? prev.whatsappAlerts,
        smsTracking: user.allow_sms_tracking_pings ?? prev.smsTracking,
        orderDispatchAlerts: user.allow_order_dispatch_checkpoints_alerts ?? prev.orderDispatchAlerts,
        mpesaReceiptAlerts: user.allow_payment_receipt_alert ?? prev.mpesaReceiptAlerts,
        LocationAccess: user.allow_location_access ?? prev.LocationAccess,
        language: user.preferred_language || prev.language,
      }));
    }
  }, [user]);


  // Handle Escape key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBackToChat();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToChat]);



  const handleToggle = useCallback((key: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);


  const handleSelectChange = useCallback((key: keyof SettingsState, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);
  

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    
    try {
      // 1. Save Backend Preferences via Provider
      if (user) {
        await editIdentity({
          allow_push_notification: settings.pushNotifications,
          allow_whatsApp_dispatch_alerts: settings.whatsappAlerts,
          allow_sms_tracking_pings: settings.smsTracking,
          allow_order_dispatch_checkpoints_alerts: settings.orderDispatchAlerts,
          allow_payment_receipt_alert: settings.mpesaReceiptAlerts,
          allow_location_access: settings.LocationAccess,
          preferred_language: settings.language,
        });
      }

      // 2. Persist UI-only settings to LocalStorage
      localStorage.setItem('soko_ui_autoScrollChat', JSON.stringify(settings.autoScrollChat));
      localStorage.setItem('soko_ui_enterToSend', JSON.stringify(settings.enterToSend));
      localStorage.setItem('soko_ui_highContrastChat', JSON.stringify(settings.highContrastChat));

      // 3. Trigger optional prop callback
      if (onSave) {
        await onSave(settings);
      }

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      setSaveError(error.message || 'Failed to sync settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCache = () => {
    if (
      window.confirm(
        'Clear local feed cache? Your active order channels, M-Pesa receipts, and runner links will remain intact.'
      )
    ) {
      alert('Local  workspace optimized.');
    }
  };



  

  return (
    <div
      onClick={onBackToChat}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:p-1 md:p-0 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Merchant Workspace Preferences"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full flex-col overflow-hidden bg-slate-50 font-sans text-slate-800 shadow-2xl sm:rounded-0"
      >
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-orange-500/20 bg-gradient-to-r from-white to-amber-500 px-4 sm:px-6 sm:pl-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToChat}
              className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20 active:scale-95 sm:hidden"
              title="Back"
              aria-label="Back to chat"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-2.5">
              <img src={ccmLogo} height={70} width={70} className="text-white" alt="Logo" />
              <div>
                <p className="hidden text-[11px] font-medium text-orange-500 sm:block">
                  Settings Preferences
                </p>
              </div>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {showNotification && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-950/30 px-3 py-1 font-mono text-xs font-semibold text-emerald-100 backdrop-blur-sm"
                >
                  <CheckCircle2 size={14} className="text-emerald-300" /> Saved
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin text-orange-400" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Check size={14} className="text-orange-400" strokeWidth={3} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Workspace Layout */}
        <div className="relative flex flex-1 overflow-hidden">
          {/* LEFT NAV SIDEBAR (Desktop Only) */}
          <aside
            className={`hidden shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out md:flex ${
              isNavMinimized ? 'w-18' : 'w-64'
            }`}
          >
            <div>
              {/* Sidebar Header with Minimize Toggle */}
              <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="shrink-0 rounded-lg bg-slate-100 p-1.5 text-slate-700">
                    <Settings size={17} />
                  </div>
                  {!isNavMinimized && (
                    <span className="whitespace-nowrap text-xs font-bold tracking-wider text-slate-800 uppercase">
                      Settings
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsNavMinimized(!isNavMinimized)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  title={isNavMinimized ? 'Expand Sidebar' : 'Minimize Sidebar'}
                >
                  {isNavMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1 p-3">
                {!isNavMinimized && (
                  <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Preferences
                  </p>
                )}

                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      title={isNavMinimized ? tab.label : undefined}
                      className={`group relative flex w-full items-center rounded-xl text-xs font-medium transition-all duration-150 ${
                        isNavMinimized
                          ? 'justify-center py-3'
                          : 'justify-between px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-orange-50 font-semibold text-orange-950 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={`shrink-0 transition-colors ${
                            isActive ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-700'
                          }`}
                        />
                        {!isNavMinimized && <span className="whitespace-nowrap">{tab.label}</span>}
                      </div>
                      {isActive && !isNavMinimized && (
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Status */}
            {!isNavMinimized && (
              <div className="m-3 rounded-xl border border-slate-200/60 bg-slate-50 p-3 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Sync Channel: {user ? 'Active' : 'Offline'}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Connected to M-Pesa & WhatsApp Gateway.
                </p>
              </div>
            )}
          </aside>

          {/* RIGHT MAIN CONTENT AREA */}
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-50/50">
            {/* Horizontal Navigation Tabs (Mobile Only) */}
            <div className="no-scrollbar flex shrink-0 items-center gap-6 overflow-x-auto border-b border-slate-200/80 bg-white px-4 md:hidden">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-3.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'border-orange-500 font-semibold text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 2-Column Dashboard Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
                {/* LEFT COLUMN: System Overview Card */}
                <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6 lg:col-span-4">
                  <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-800">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Session Profile</h3>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-medium tracking-wider text-emerald-700 uppercase">
                          {user?.full_name || 'Live Environment'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-b border-slate-100 pb-5">
                    <h4 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      Active Settings
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-500">Language</span>
                        <span className="font-mono font-medium text-slate-900">
                          {settings.language === 'sw' ? 'Kiswahili' : 'English'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-500">WhatsApp Dispatch</span>
                        <span
                          className={`font-semibold ${
                            settings.whatsappAlerts ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          {settings.whatsappAlerts ? 'Active' : 'Muted'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-500">Auto-Scroll Feed</span>
                        <span
                          className={`font-semibold ${
                            settings.autoScrollChat ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          {settings.autoScrollChat ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      Dispatch Guarantee
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-500">
                      Changes apply across your active merchant session and immediate runner dispatch queues.
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN: Settings Forms */}
                <div className="space-y-6 lg:col-span-8">
                  <form onSubmit={handleSaveSettings}>
                    {/* Error Banner */}
                    {saveError && (
                      <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                        {saveError}
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {activeTab === 'notifications' && (
                        <motion.div
                          key="notifications"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.16 }}
                          className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6"
                        >
                          <div className="border-b border-slate-100 pb-4">
                            <h3 className="text-sm font-semibold text-slate-900">Alerts & Dispatch Channels</h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Configure how runner tracking, orders, and payment signals reach your devices.
                            </p>
                          </div>

                          <div className="space-y-3">

                           <SettingsToggle
                              title="Location access"
                              description="Allow access to location for acurate surgestions  and efficient Delivery "
                              checked={settings.LocationAccess}
                              onChange={() => handleToggle('LocationAccess')}
                              icon={<Smartphone size={16} className="text-emerald-600" />}
                            />

                            
                            <SettingsToggle
                              title="WhatsApp Dispatch Alerts"
                              description="Receive runner map links and live order updates directly on your connected line"
                              checked={settings.whatsappAlerts}
                              onChange={() => handleToggle('whatsappAlerts')}
                              icon={<Smartphone size={16} className="text-emerald-600" />}
                            />
                            
                            <SettingsToggle
                              title="In-App Push Notifications"
                              description="Real-time status banners inside the active merchant browser viewport"
                              checked={settings.pushNotifications}
                              onChange={() => handleToggle('pushNotifications')}
                              icon={<Bell size={16} className="text-orange-500" />}
                            />
                            <SettingsToggle
                              title="Fallback SMS Tracking Pings"
                              description="Standard text alerts when off-grid or when data connectivity drops"
                              checked={settings.smsTracking}
                              onChange={() => handleToggle('smsTracking')}
                            />
                          </div>

                          <div className="border-t border-slate-100 pt-5">
                            <h4 className="mb-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                              Event Filters
                            </h4>
                            <div className="space-y-3">
                              <SettingsToggle
                                title="M-Pesa & Payment Receipts"
                                description="Instant notification upon verified till or paybill transaction settlement"
                                checked={settings.mpesaReceiptAlerts}
                                onChange={() => handleToggle('mpesaReceiptAlerts')}
                                icon={<CreditCard size={16} className="text-blue-600" />}
                              />
                              <SettingsToggle
                                title="Order Dispatch Checkpoints"
                                description="Notify when a runner accepts, picks up, or completes delivery"
                                checked={settings.orderDispatchAlerts}
                                onChange={() => handleToggle('orderDispatchAlerts')}
                                icon={<Truck size={16} className="text-amber-600" />}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'interface' && (
                        <motion.div
                          key="interface"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.16 }}
                          className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6"
                        >
                          <div className="border-b border-slate-100 pb-4">
                            <h3 className="text-sm font-semibold text-slate-900">Feed Mechanics</h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Customize display localization and live chat interaction behaviors.
                            </p>
                          </div>

                          <CleanSelect
                            label="Display Language / Lugha"
                            icon={<Globe size={14} />}
                            value={settings.language}
                            onChange={(v) => handleSelectChange('language', v)}
                            options={LANGUAGE_OPTIONS}
                          />

                          <div className="space-y-3 pt-2">
                            <SettingsToggle
                              title="Auto-Scroll Feed"
                              description="Automatically stick to the bottom as new logistics updates and bids arrive"
                              checked={settings.autoScrollChat}
                              onChange={() => handleToggle('autoScrollChat')}
                            />
                            <SettingsToggle
                              title="Enter Key to Send"
                              description="Press Enter to send instructions immediately instead of adding a line break"
                              checked={settings.enterToSend}
                              onChange={() => handleToggle('enterToSend')}
                            />
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'privacy' && (
                        <motion.div
                          key="privacy"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.16 }}
                          className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6"
                        >
                          <div className="border-b border-slate-100 pb-4">
                            <h3 className="text-sm font-semibold text-slate-900">Data & Workspace Security</h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Manage local storage footprints and encrypted communication payloads.
                            </p>
                          </div>

                          <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4">
                            <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                              <Eye size={15} className="text-slate-700" />
                              End-to-End Transport Encryption
                            </h4>
                            <p className="text-xs leading-relaxed text-slate-600">
                              All order tags, buyer phone numbers, and M-Pesa verification tokens are encrypted in transit. Clearing local application cache improves browser performance without interrupting active runner routes.
                            </p>
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={handleClearCache}
                              className="flex cursor-pointer items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 active:scale-95"
                            >
                              <Trash2 size={14} />
                              <span>Clear Local Feed Cache</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE UI PRIMITIVES
   ========================================================= */

interface SettingsToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
}

function SettingsToggle({ title, description, checked, onChange, icon }: SettingsToggleProps) {
  return (
    <label className="flex cursor-pointer select-none items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all hover:border-slate-300 hover:bg-white focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-orange-500/20">
      <div className="flex items-start gap-3 pr-4">
        {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
        <div>
          <h4 className="text-xs font-semibold text-slate-900">{title}</h4>
          <p className="mt-0.5 text-xs leading-normal text-slate-500">{description}</p>
        </div>
      </div>

      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />

      <div
        className={`h-6 w-10 shrink-0 rounded-full p-0.5 transition-colors duration-200 ${
          checked ? 'bg-orange-500' : 'bg-slate-300'
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
}

interface CleanSelectProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
}

function CleanSelect({ label, value, onChange, options, icon }: CleanSelectProps) {
  return (
    <div className="relative flex w-full flex-col gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition-all focus-within:border-slate-400 focus-within:bg-white">
      <label className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
      </label>
      <div className="relative flex items-center">
        <select
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent pr-8 text-xs font-medium text-slate-900 outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-800">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-0 text-slate-400" />
      </div>
    </div>
  );
}
