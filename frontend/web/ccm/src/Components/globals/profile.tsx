import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Package, ShoppingBag, Compass, Hash, 
  Mail, Phone, Plus, Minus, X, Check, Loader2, 
  MapPin, Calendar, ArrowLeft, ChevronLeft, 
  ChevronRight, Clipboard, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from "../../Providers/CartContext"; 
import { useProfile } from '../../Providers/profileContext';
import { Counties } from "../../../db/counties";

export function UserProfile({ onBackToChat }) {
  const { mpesaPhone, setMpesaPhone, cart, cartSummary, updateCartQty } = useCart();
  const { isAuthenticated, user, isLoading, editIdentity, editLogistics, logout } = useProfile();

  const [activeTab, setActiveTab] = useState('identity');
  const [isSaving, setIsSaving] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isNavMinimized, setIsNavMinimized] = useState(true);

  const [profile, setProfile] = useState({
    first_name: '', last_name: '', middle_name: '', email: '',
    phone: '', national_id_number: '', dob: '', age: '', gender: '',
    country: 'Kenya', county: '', sub_county: '', street: '',
    estate_area_neighborhood: '', apartment_door_id: '', location_explanation: '',
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsModified(false);
  };

  const selectedCountyObj = useMemo(() => {
    return Counties.find((c) => c.name === profile.county);
  }, [profile.county]);

  const availableSubCounties = selectedCountyObj ? selectedCountyObj.sub_counties : [];

  const tabs = [
    { id: 'identity', label: 'Identity', icon: Clipboard },
    { id: 'logistics', label: 'Logistics', icon: Compass },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cart?.length },
    { id: 'orders', label: 'Orders', icon: Package }
  ];

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        middle_name: user.middle_name || '',
        email: user.email || '',
        phone: user.phone || '',
        national_id_number: user.national_id_number || '',
        dob: user.dob || '',
        age: user.age || '', 
        gender: user.gender || '',
        country: user.country || "Kenya", 
        county: user.county || '',
        sub_county: user.sub_county || '',
        street: user.street || '',
        estate_area_neighborhood: user.estate_area_neighborhood || '',
        apartment_door_id: user.apartment_door_id || '',
        location_explanation: user.location_explanation || '', 
      });
      if (user.phone && !mpesaPhone) setMpesaPhone(user.phone);
    }
  }, [user, mpesaPhone, setMpesaPhone]);

  const handleFieldChange = (key, value) => {
    if (!isModified) setIsModified(true);
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    if (!isModified) return;
    setIsSaving(true);

    try {
      if (activeTab === 'identity') await editIdentity(profile);
      else if (activeTab === 'logistics') await editLogistics(profile);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      setIsModified(false);
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-slate-400 gap-4">
        {isLoading ? (
          <>
            <Loader2 className="animate-spin text-indigo-500" size={36} />
            <span className="text-sm font-medium text-slate-200 tracking-wide">Loading Profile...</span>
          </>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-4 max-w-sm text-center shadow-xl">
            <User size={36} className="text-slate-500" />
            <div>
              <h3 className="text-base font-semibold text-slate-100">Not Authenticated</h3>
              <p className="text-xs text-slate-400 mt-1">Please sign in to view and manage your profile settings.</p>
            </div>
            <button
              type="button"
              onClick={onBackToChat}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    );
  }

  const fullNameDisplay = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user?.full_name || 'Guest User';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-0 animate-in fade-in duration-200">
      <div className="w-full h-full md:max-w-full md:h-[100vh] bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row relative overflow-hidden">
        
        {/* LEFT NAV SIDEBAR */}
        <div className={`bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800/80 transition-all duration-300 ease-in-out ${isNavMinimized ? 'md:w-16' : 'md:w-60'} w-full`}>
          <div>
            {/* Header */}
            <div className={`h-16 ${isNavMinimized ? 'px-3 justify-center' : 'px-5 justify-between'} flex items-center border-b border-slate-800/80`}>
              <div className="flex items-center gap-3 overflow-hidden">
                {!isNavMinimized && (
                  <div className="p-1.5 border border-indigo-500/20 rounded-full shrink-0">
                    <User size={22} className="text-indigo-400" />
                  </div>
                )}
                {!isNavMinimized && (
                  <span className="font-semibold text-white tracking-wider text-xs uppercase">
                    Profile
                  </span>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setIsNavMinimized(!isNavMinimized)}
                className="hidden md:flex p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isNavMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
              >
                {isNavMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </div>

            {/* Nav Items */}
            <div className="p-3 space-y-1 hidden md:block w-full">
              {!isNavMinimized && (
                <p className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Navigation
                </p>
              )}
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    title={isNavMinimized ? tab.label : undefined}
                    className={`w-full flex items-center ${
                      isNavMinimized ? 'justify-center py-2.5 px-0' : 'justify-between px-3 py-2.5'
                    } text-xs font-medium rounded-xl transition-all relative ${
                      isActive 
                        ? 'text-white bg-slate-800/80 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-indigo-400 shrink-0' : 'text-slate-400 shrink-0'} />
                      {!isNavMinimized && <span>{tab.label}</span>}
                    </div>
                    
                    {!!tab.badge && tab.badge > 0 && (
                      <span className={`${
                        isNavMinimized 
                          ? 'absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px]' 
                          : 'px-2 py-0.5 text-[10px]'
                      } bg-indigo-500/20 text-indigo-300 font-mono font-semibold rounded-full`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer / Actions */}
          <div className="p-3 border-t border-slate-800/80 space-y-2">
            <button
              type="button"
              onClick={logout}
              title={isNavMinimized ? "Log Out" : undefined}
              className={`w-full flex items-center ${
                isNavMinimized ? 'justify-center py-2.5' : 'justify-start gap-3 px-3 py-2.5'
              } rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 text-xs font-medium transition-colors`}
            >
              <LogOut size={16} className="shrink-0" />
              {!isNavMinimized && <span>Log Out</span>}
            </button>

            <button
              type="button"
              onClick={onBackToChat}
              title={isNavMinimized ? "Back to Chat" : undefined}
              className={`w-full flex items-center ${
                isNavMinimized ? 'justify-center py-2.5' : 'justify-center gap-2 px-3 py-2.5'
              } rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-all`}
            >
              <ArrowLeft size={16} className="shrink-0" />
              {!isNavMinimized && <span className="whitespace-nowrap">Back to Chat</span>}
            </button>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
          
          {/* Top Header Bar */}
          <div className="h-16 px-6 md:px-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-base font-semibold text-slate-100">Account Overview</h1>
            </div>

            {/* Top Actions */}
            <div className="flex items-center gap-3">
              {['identity', 'logistics'].includes(activeTab) && isModified && (
                <button
                  type="button"
                  onClick={handleFormSubmission}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
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
              )}
              <button 
                type="button" 
                onClick={onBackToChat}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Navigation Tabs (Mobile/Responsive Bar) */}
          <div className="bg-white px-6 md:px-8 border-b border-slate-200 flex items-center gap-8 overflow-x-auto shrink-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-3.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive 
                      ? 'border-indigo-600 text-slate-900 font-semibold' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {!!tab.badge && tab.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-700 font-mono font-semibold rounded">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 2-Column Dashboard Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: User Summary Card (Only on Identity Tab) */}
              {activeTab === 'identity' && (
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                  
                  {/* Avatar & Header */}
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 font-bold text-xl shrink-0">
                      {profile.first_name?.[0] || 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-semibold text-slate-900 text-base truncate">
                        {fullNameDisplay}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          {isAuthenticated ? 'Verified Account' : 'Guest Account'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Contact */}
                  <div className="space-y-3 pb-6 border-b border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Contact</h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        <span className="font-mono">{profile.phone || 'No phone set'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Mail size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{profile.email || 'No email set'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Address Summary */}
                  <div className="space-y-3 pb-6 border-b border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Address</h4>
                    <div className="space-y-2.5 text-xs text-slate-600">
                      <div className="flex items-start gap-3">
                        <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-800">
                            {profile.estate_area_neighborhood || 'Location not specified'}
                          </p>
                          <p className="text-slate-500 mt-0.5">
                            {[profile.sub_county, profile.county, profile.country].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Identity Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">User Details</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-500 flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          Date of birth
                        </span>
                        <span className="font-medium text-slate-800">{profile.dob || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-500 flex items-center gap-2">
                          <Hash size={14} className="text-slate-400" />
                          National ID
                        </span>
                        <span className="font-medium font-mono text-slate-800">{profile.national_id_number || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-500 flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          Gender
                        </span>
                        <span className="font-medium text-slate-800">{profile.gender || '—'}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* RIGHT COLUMN: Dynamic Panel */}
              <div className={`space-y-6 ${activeTab === 'identity' ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                <form onSubmit={handleFormSubmission}>
                  <AnimatePresence mode="wait">
                    
                    {/* TAB: IDENTITY */}
                    {activeTab === 'identity' && (
                      <motion.div 
                        key="identity"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Manage your legal identification and contact details</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <CleanInput label="First Name" disabled={!!user?.first_name} value={profile.first_name} onChange={(v) => handleFieldChange('first_name', v)} />
                          <CleanInput label="Last Name" disabled={!!user?.last_name} value={profile.last_name} onChange={(v) => handleFieldChange('last_name', v)} />
                        </div>
                        
                        <CleanInput label="Email Address" type="email" icon={<Mail size={14} />} value={profile.email} disabled={!!user?.email} onChange={(v) => handleFieldChange('email', v)} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <CleanInput label="Phone Number" disabled={!!user?.phone} value={profile.phone} icon={<Phone size={14} />} onChange={(v) => handleFieldChange('phone', v)} />
                          <CleanInput label="National ID / Passport" disabled={!!user?.national_id_number} value={profile.national_id_number} icon={<Hash size={14} />} onChange={(v) => handleFieldChange('national_id_number', v)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {profile.age ? (
                            <CleanInput label="Age" type="text" disabled value={profile.age} />
                          ) : (
                            <CleanInput label="Date of Birth" type={profile.dob ? "text" : "date"} disabled={!!user?.dob} value={profile.dob} onChange={(v) => handleFieldChange('dob', v)} />
                          )}
                          <CleanSelect label="Gender" disabled={!!user?.gender} value={profile.gender} onChange={(v) => handleFieldChange('gender', v)} options={['Male', 'Female', 'Other']} />
                        </div>
                      </motion.div>
                    )}

                    {/* TAB: LOGISTICS */}
                    {activeTab === 'logistics' && (
                      <motion.div 
                        key="logistics"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">Delivery Logistics</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Set your default address and delivery instructions</p>
                          </div>
                        </div>

                        <CleanInput label="Country" value={profile.country} onChange={(v) => handleFieldChange('country', v)} />

                        {/* County Selector */}
                        <div className="flex items-end gap-2">
                          <div className="w-full flex flex-col gap-1.5 bg-slate-50/60 p-3 rounded-xl border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white transition-all">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">County</label>
                            <select 
                              value={profile.county || ''} 
                              onChange={(e) => { 
                                handleFieldChange('county', e.target.value); 
                                handleFieldChange('sub_county', ''); 
                              }}
                              className="bg-transparent text-xs text-slate-900 outline-none cursor-pointer"
                            >
                              <option value="" disabled className="text-slate-400">Select County</option>
                              {Counties.map((c) => (
                                <option key={c.code} value={c.name} className="text-slate-800">
                                  {c.code} - {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {profile.county && (
                            <ChangeButton 
                              label="Clear" 
                              onClick={() => { 
                                handleFieldChange('county', ''); 
                                handleFieldChange('sub_county', ''); 
                              }} 
                            />
                          )}
                        </div>

                        {/* Sub-County Selector */}
                        <div className="flex items-end gap-2">
                          <div className="w-full flex flex-col gap-1.5 bg-slate-50/60 p-3 rounded-xl border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white transition-all">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sub-County</label>
                            <select 
                              value={profile.sub_county || ''} 
                              onChange={(e) => handleFieldChange('sub_county', e.target.value)}
                              disabled={!profile.county}
                              className="bg-transparent text-xs text-slate-900 outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <option value="" disabled className="text-slate-400">
                                {profile.county ? 'Select Sub-County' : 'Select County First'}
                              </option>
                              {availableSubCounties.map((subCountyName) => (
                                <option key={subCountyName} value={subCountyName} className="text-slate-800">
                                  {subCountyName}
                                </option>
                              ))}
                            </select>
                          </div>
                          {profile.sub_county && (
                            <ChangeButton 
                              label="Clear" 
                              onClick={() => handleFieldChange('sub_county', '')} 
                            />
                          )}
                        </div>

                        <CleanInput label="Estate / Neighborhood" value={profile.estate_area_neighborhood} onChange={(v) => handleFieldChange('estate_area_neighborhood', v)} />
                        <CleanInput label="Apartment / Door ID" value={profile.apartment_door_id} onChange={(v) => handleFieldChange('apartment_door_id', v)} />
                        <CleanInput label="Delivery Directions" value={profile.location_explanation} onChange={(v) => handleFieldChange('location_explanation', v)} />
                      </motion.div>
                    )}

                    {/* TAB: CART */}
                    {activeTab === 'cart' && (
                      <motion.div 
                        key="cart"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">Active Cart Items</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Review and adjust items before checkout</p>
                          </div>
                          <span className="text-xs font-medium text-slate-500">
                            {cart?.length || 0} items
                          </span>
                        </div>

                        {cart?.length > 0 ? (
                          <div className="space-y-6">
                            <div className="divide-y divide-slate-100">
                              {cart.map((item) => (
                                <div key={item.product.id || item.id} className="py-3.5 flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-semibold text-slate-900">{item.product.name}</p>
                                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">KES {item.product.price.toLocaleString()}</p>
                                  </div>
                                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
                                    <button type="button" onClick={() => updateCartQty(item.product.id, -1)} className="p-1 hover:bg-white rounded text-slate-600 transition-colors"><Minus size={12} /></button>
                                    <span className="text-xs font-mono font-semibold w-6 text-center text-slate-800">{item.quantity}</span>
                                    <button type="button" onClick={() => updateCartQty(item.product.id, 1)} className="p-1 hover:bg-white rounded text-slate-600 transition-colors"><Plus size={12} /></button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-4 border-t border-slate-200 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>Subtotal</span>
                                <span className="font-mono text-slate-800 font-medium">KES {cartSummary?.subtotal?.toLocaleString() ?? 0}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-xs text-slate-900 pt-2 border-t border-slate-200/60">
                                <span>Total Amount</span>
                                <span className="font-mono text-indigo-600 text-sm">KES {cartSummary?.finalTotal?.toLocaleString() ?? 0}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <EmptyState icon={ShoppingBag} text="Your shopping cart is currently empty" />
                        )}
                      </motion.div>
                    )}

                    {/* TAB: ORDERS */}
                    {activeTab === 'orders' && (
                      <motion.div 
                        key="orders"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                      >
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">Order Activity</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Historical log of all transactions</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <EmptyState icon={Package} text="No recent order history found" />
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

function CleanInput({ label, value, onChange, type = "text", icon, disabled = false }) {
  return (
    <div className={`flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50/60 border transition-all w-full ${
      disabled 
        ? 'border-slate-200/50 opacity-60 bg-slate-100/50 cursor-not-allowed' 
        : 'border-slate-200 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-sm'
    }`}>
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-400">{icon}</span>}
        <input
          type={type}
          disabled={disabled}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-transparent text-xs text-slate-900 outline-none w-full placeholder:text-slate-400 disabled:cursor-not-allowed"
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      </div>
    </div>
  );
}

function CleanSelect({ label, value, onChange, options = [], disabled = false }) {
  return (
    <div className={`flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50/60 border transition-all w-full ${
      disabled 
        ? 'border-slate-200/50 opacity-60 bg-slate-100/50 cursor-not-allowed' 
        : 'border-slate-200 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-sm'
    }`}>
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <select
        disabled={disabled}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-transparent text-xs text-slate-900 outline-none w-full cursor-pointer disabled:cursor-not-allowed"
      >
        <option value="" disabled className="text-slate-400">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-slate-800">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChangeButton({ label = "Clear", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors shrink-0"
    >
      {label}
    </button>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
      {Icon && (
        <div className="p-3 bg-slate-100/80 rounded-full text-slate-400">
          <Icon size={24} />
        </div>
      )}
      <p className="text-xs font-medium text-slate-500 max-w-xs">{text}</p>
    </div>
  );
}
