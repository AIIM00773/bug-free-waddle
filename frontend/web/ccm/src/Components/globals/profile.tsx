import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Package, ShoppingBag, Compass, Hash, 
  Mail, Phone, UserCircle, Plus, Minus, ChevronDown, 
  X, Check, Loader2, Sparkles, MapPin, Calendar, 
  ShieldCheck, ArrowLeft, Edit3, Trash2, ExternalLink,
  ChevronLeft, ChevronRight,
  Clipboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from "../../Providers/CartContext"; 
import { useProfile } from '../../Providers/profileContext';
import { Counties } from "../../../db/counties";



export function UserProfile({ onBackToChat }) {
  const { mpesaPhone, setMpesaPhone, cart, cartSummary, updateCartQty } = useCart();
  const { isAuthenticated, user, isLoading, editIdentity, editLogistics } = useProfile();

  const [activeTab, setActiveTab] = useState('identity');
  const [isSaving, setIsSaving] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // NEW: Sidebar minimization state
  const [isNavMinimized, setIsNavMinimized] = useState(false);

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

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B131D]/80 backdrop-blur-md flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span className="text-sm font-medium text-slate-200 tracking-wide">Loading Profile...</span>
      </div>
    );
  }

  const fullNameDisplay = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user?.full_name || 'Guest User';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-0 animate-in fade-in duration-200">
      <div className="w-full h-full md:max-w-full md:h-[100vh] bg-[#F8FAFC] text-slate-800 font-sans flex flex-col md:flex-row relative rounded-none shadow-2xl overflow-hidden">
        
        {/* LEFT NAV SIDEBAR (Dark Navy Theme with Toggle Width) */}
        <div  className={`bg-[#0B131D] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 transition-all duration-300 ease-in-out ${ isNavMinimized ? 'md:w-15' : 'md:w-64'} w-full`}>
          <div>
            {/* Brand / Title Header with Toggle Button */}
            <div className={`h-16 ${isNavMinimized ? 'pr-5':'px-4'} flex items-center justify-between border-b border-slate-800/80`}>
              <div className="flex items-center gap-2.5 overflow-hidden">
               {!isNavMinimized && (
                 <div className="p-1.5 bg-none  border border-indigo-500/20 rounded-full  shrink-0">
                  <User size={26} className="text-indigo-400" />
                </div>
               )}

                {!isNavMinimized && (
                  <span className="font-semibold text-white tracking-wide text-sm whitespace-nowrap">
                    PROFILE
                  </span>
                )}
              </div>
              
              {/* Sidebar Collapse Toggle Button (Desktop only) */}
              <button
                type="button"
                onClick={() => setIsNavMinimized(!isNavMinimized)}
                className={`hidden md:flex p-2.5 rounded-full text-slate-50 hover:text-white ${isNavMinimized ? 'bg-gray-950/20' : 'bg-gray-800'} cursor-pointer   hover:bg-slate-800 transition-colors`}
                title={isNavMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
              >
                {isNavMinimized ? <ChevronRight size={20} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            {/* Navigation Menu */}
            <div className="p-3 space-y-6 hidden md:inline-block w-full">
              <div>
                {!isNavMinimized && (
                  <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    My Info
                  </p>
                )}
                <div className="space-y-3">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabChange(tab.id)}
                        title={isNavMinimized ? tab.label : undefined}
                        className={` ${
                          isNavMinimized ? 'justify-center py-2 px-2  w-fit flex items-center rounded-full ' : 'justify-between px-3 py-2.5 w-full flex items-center rounded-xl  '
                        } text-xs font-medium transition-all duration-150 relative ${
                          isActive 
                            ? 'bg-slate-800/90 text-white shadow-sm  border border-[1px] border-white ' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? 'text-indigo-400 shrink-0' : 'text-slate-400 shrink-0'} />
                          {!isNavMinimized && <span className="whitespace-nowrap">{tab.label}</span>}
                        </div>
                        
                        {!!tab.badge && tab.badge > 0 && (
                          <span className={`${
                            isNavMinimized 
                              ? 'absolute top-1 right-1 px-1.5 py-0.2 text-[9px]' 
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
            </div>
          </div>

          {/* Sidebar Footer / Close Action */}
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
          <div className="h-16 px-8 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Profile</h1>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-3">
              {['identity', 'logistics'].includes(activeTab) && isModified && (
                <button
                  type="button"
                  onClick={handleFormSubmission}
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
              )}
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
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive 
                      ? 'border-slate-900 text-slate-900 font-semibold' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {!!tab.badge && tab.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] bg-slate-100 text-slate-700 font-mono font-semibold rounded">
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
              
              {/* LEFT COLUMN: User Summary Card */}
              {activeTab === 'identity' && (
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                  
                  {/* Profile Avatar & Header */}
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 font-bold text-xl shrink-0">
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

                  {/* Section 1: About */}
                  <div className="space-y-3 pb-6 border-b border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">About</h4>
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

                  {/* Section 3: Account Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">User details</h4>
                    <div className="space-y-2.5 text-xs">
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
                        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6"
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
                        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">Delivery Logistics</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Set your default address and delivery instructions</p>
                          </div>
                        </div>

                        <CleanInput label="Country" value={profile.country} onChange={(v) => handleFieldChange('country', v)} />

                        {/* County Selector */}
                        <div className="flex items-center gap-2">
                          <div className="w-full flex flex-col gap-1.5 bg-slate-50/60 p-3 rounded-xl border border-slate-200/80 focus-within:border-slate-400 focus-within:bg-white transition-all">
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
                        <div className="flex items-center gap-2">
                          <div className="w-full flex flex-col gap-1.5 bg-slate-50/60 p-3 rounded-xl border border-slate-200/80 focus-within:border-slate-400 focus-within:bg-white transition-all">
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
                        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6"
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
                        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm"
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
        ? 'border-slate-200/50 opacity-60 bg-slate-100/50' 
        : 'border-slate-200/80 focus-within:border-slate-400 focus-within:bg-white focus-within:shadow-sm'
    }`}>
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-400">{icon}</span>}
        <input 
          type={type} 
          value={value ?? ''} 
          disabled={disabled} 
          onChange={(e) => !disabled && onChange && onChange(e.target.value)} 
          className="w-full bg-transparent text-xs text-slate-900 outline-none disabled:cursor-not-allowed placeholder-slate-400 font-medium" 
        />
      </div>
    </div>
  );
}

function CleanSelect({ label, value, onChange, options, disabled = false }) {
  return (
    <div className={`flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50/60 border transition-all relative w-full ${
      disabled 
        ? 'border-slate-200/50 opacity-60 bg-slate-100/50' 
        : 'border-slate-200/80 focus-within:border-slate-400 focus-within:bg-white focus-within:shadow-sm'
    }`}>
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative flex items-center">
        <select 
          disabled={disabled}
          value={value ?? ''} 
          onChange={(e) => onChange && onChange(e.target.value)} 
          className="w-full bg-transparent text-xs text-slate-900 outline-none appearance-none cursor-pointer disabled:cursor-not-allowed pr-4 font-medium"
        >
          {!value && <option value="" className="text-slate-400">Select {label}</option>}
          {options.map(opt => (
            <option key={opt} value={opt} className="text-slate-800">{opt}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-0 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function ChangeButton({ onClick, label = "Edit" }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 shrink-0"
    >
      {label}
    </button>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
        {Icon && <Icon size={24} className="text-slate-400" />}
      </div>
      <p className="text-xs font-medium text-slate-500">{text}</p>
    </div>
  );
}
