import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Package, ShoppingBag, Compass, Hash, 
  Mail, Phone, UserCircle, Plus, Minus, ChevronDown, X, Check, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from  "../../Providers/CartContext"; 
import { useProfile } from '../../Providers/profileContext';
import { Counties } from "../../../db/counties";

export function UserProfile({ onBackToChat }) {
  // Context & Hooks
  const { mpesaPhone, setMpesaPhone, cart, cartSummary, updateCartQty } = useCart();
  const { isAuthenticated, user, isLoading, editIdentity, editLogistics } = useProfile();

  const [activeTab, setActiveTab] = useState('identity');
  const [isSaving, setIsSaving] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState({
    first_name: '', last_name: '', middle_name: '', email: '',
    phone: '', national_id_number: '', dob: '', age: '', gender: '',
    country: 'Kenya', county: '', sub_county: '', street: '',
    estate_area_neighborhood: '', apartment_door_id: '', location_explanation: '',
  });

  const selectedCountyObj = useMemo(() => {
    return Counties.find((c) => c.name === profile.county);
  }, [profile.county]);

  const availableSubCounties = selectedCountyObj ? selectedCountyObj.sub_counties : [];

  const tabs = [
    { id: 'identity', label: 'Identity', icon: UserCircle },
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
    setIsSaving(true);

    try {
      if (activeTab === 'identity') await editIdentity(profile);
      else if (activeTab === 'logistics') await editLogistics(profile);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      setIsModified(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#090d11]/80 backdrop-blur-sm flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <span className="text-xs font-medium tracking-wide">Loading Profile...</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200">
      <div className="w-full h-full md:max-w-3xl md:h-[90vh] bg-[#0b0f14] text-zinc-200 font-sans flex flex-col relative rounded-none md:rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-800/60 bg-zinc-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <User size={18} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">{user?.full_name || 'My Profile'}</h2>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isAuthenticated ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {isAuthenticated ? 'Verified Account' : 'Guest Mode'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={onBackToChat} 
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/50 hover:bg-red-500/10 border border-zinc-700/50 hover:border-red-500/40 transition-all duration-200"
          >
            <X size={14} className="text-zinc-400 group-hover:text-red-400 transition-colors" />
            <span className="text-xs font-medium text-zinc-300 group-hover:text-red-400 transition-colors">Close</span>
          </button>
        </div>

        {/* TABS */}
        <div className="flex items-center border-b border-zinc-800/60 bg-[#0b0f14] px-6 sticky top-0 z-10 overflow-x-auto no-scrollbar gap-2">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`relative flex items-center gap-2 px-4 py-3.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <tab.icon size={15} className={isActive ? 'text-emerald-400' : 'text-zinc-400'} /> 
                {tab.label}
                {!!tab.badge && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-emerald-500/20 text-emerald-400 font-bold rounded-full">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <form onSubmit={handleFormSubmission} className="max-w-xl mx-auto space-y-6 pb-20">
            <AnimatePresence mode="wait">
              
              {/* TAB: IDENTITY */}
              {activeTab === 'identity' && (
                <motion.div 
                  key="identity"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 bg-zinc-900/20 p-5 rounded-2xl border border-zinc-800/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name" disabled={!!profile.first_name} value={profile.first_name} onChange={(v) => handleFieldChange('first_name', v)} />
                    <Input label="Last Name" disabled={!!profile.last_name} value={profile.last_name} onChange={(v) => handleFieldChange('last_name', v)} />
                  </div>
                  
                  <Input label="Email" type="email" icon={<Mail size={12} />} value={profile.email} disabled={!!profile.email} onChange={(v) => handleFieldChange('email', v)} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Phone" disabled={!!profile.phone} value={profile.phone} icon={<Phone size={12} />} />
                    <Input label="National ID / Passport" disabled={!!profile.national_id_number} value={profile.national_id_number} icon={<Hash size={12} />} onChange={(v) => handleFieldChange('national_id_number', v)} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.age ? (
                      <Input label="Age" type="text" disabled value={profile.age} />
                    ) : (
                      <Input label="Date of Birth" type={profile.dob ? "text" : "date"} disabled={!!profile.dob} value={profile.dob} onChange={(v) => handleFieldChange('dob', v)} />
                    )}
                    <SelectInput label="Gender" disabled={!!profile.gender} value={profile.gender} onChange={(v) => handleFieldChange('gender', v)} options={['Male', 'Female', 'Other']} />
                  </div>
                </motion.div>
              )}

              {/* TAB: LOGISTICS */}
              {activeTab === 'logistics' && (
                <motion.div 
                  key="logistics"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 bg-zinc-900/20 p-5 rounded-2xl border border-zinc-800/50"
                >
                  <Input label="Country" value={profile.country} onChange={(v) => handleFieldChange('country', v)} />

                  {/* County Field */}
                  <div className="flex items-end gap-2">
                    {profile.county ? (
                      <Input label="County" value={profile.county} disabled />
                    ) : (
                      <div className="w-full flex flex-col gap-1.5 border-b border-zinc-800 focus-within:border-emerald-500 pb-1.5 transition-colors">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">County</label>
                        <select 
                          value={profile.county || ''} 
                          onChange={(e) => { handleFieldChange('county', e.target.value); handleFieldChange('sub_county', ''); }}
                          className="bg-transparent text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="" disabled className="bg-[#0b0f14] text-zinc-400">Select County</option>
                          {Counties.map((c) => (
                            <option key={c.code} value={c.name} className="bg-[#0b0f14]">
                              {c.code} - {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {profile.county && <ChangeButton onClick={() => { handleFieldChange('county', ''); handleFieldChange('sub_county', ''); }} />}
                  </div>

                  {/* Sub-County Field */}
                  <div className="flex items-end gap-2">
                    {profile.sub_county ? (
                      <Input label="Sub-County" value={profile.sub_county} disabled />
                    ) : (
                      <div className="w-full flex flex-col gap-1.5 border-b border-zinc-800 focus-within:border-emerald-500 pb-1.5 transition-colors">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Sub-County</label>
                        <select 
                          value={profile.sub_county || ''} 
                          onChange={(e) => handleFieldChange('sub_county', e.target.value)}
                          disabled={!profile.county}
                          className="bg-transparent text-xs text-white outline-none cursor-pointer disabled:opacity-40"
                        >
                          <option value="" disabled className="bg-[#0b0f14] text-zinc-400">
                            {profile.county ? 'Select Sub-County' : 'Select County First'}
                          </option>
                          {availableSubCounties.map((subCountyName) => (
                            <option key={subCountyName} value={subCountyName} className="bg-[#0b0f14]">
                              {subCountyName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {profile.sub_county && <ChangeButton onClick={() => handleFieldChange('sub_county', '')} />}
                  </div>

                  <Input label="Estate / Neighborhood" value={profile.estate_area_neighborhood} onChange={(v) => handleFieldChange('estate_area_neighborhood', v)} />
                  <Input label="Apartment / Door ID" value={profile.apartment_door_id} onChange={(v) => handleFieldChange('apartment_door_id', v)} />
                  <Input label="Location Description" value={profile.location_explanation} onChange={(v) => handleFieldChange('location_explanation', v)} />
                </motion.div>
              )}

              {/* TAB: CART */}
              {activeTab === 'cart' && (
                <motion.div 
                  key="cart"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {cart?.length > 0 ? (
                    <div className="space-y-4">
                      <div className="space-y-2.5">
                        {cart.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                            <div>
                              <p className="text-xs font-medium text-white">{item.product.name}</p>
                              <p className="text-[11px] text-zinc-400 mt-0.5">KSH {item.product.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-zinc-800/60 p-1 rounded-lg border border-zinc-700/50">
                              <button type="button" onClick={() => updateCartQty(item.product.id, -1)} className="p-1 hover:bg-zinc-700/50 rounded text-zinc-300 transition-colors"><Minus size={12} /></button>
                              <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                              <button type="button" onClick={() => updateCartQty(item.product.id, 1)} className="p-1 hover:bg-zinc-700/50 rounded text-zinc-300 transition-colors"><Plus size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-zinc-800/80 space-y-2 bg-zinc-900/20 p-4 rounded-xl">
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>Subtotal</span>
                          <span>KSH {cartSummary.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-sm text-white pt-2 border-t border-zinc-800/50">
                          <span>Total</span>
                          <span className="text-emerald-400">KSH {cartSummary.finalTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState icon={ShoppingBag} text="Your cart is currently empty" />
                  )}
                </motion.div>
              )}

              {/* TAB: ORDERS */}
              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <EmptyState icon={Package} text="No active orders found" />
                </motion.div>
              )}

            </AnimatePresence>

            {/* SAVE BUTTON Floating Footer */}
            <AnimatePresence>
              {['identity', 'logistics'].includes(activeTab) && isModified && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-6 right-6 md:absolute md:bottom-6 md:right-8 z-20"
                >
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check size={14} />
                        <span>Saved Successfully!</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </form>
        </div>
      </div>
    </div>
  );
}

// Sub-Components
function Input({ label, value, onChange, type = "text", icon, disabled = false }) {
  return (
    <div className={`group flex flex-col gap-1 border-b pb-1.5 transition-colors w-full ${
      disabled ? 'border-zinc-800/40 opacity-50' : 'border-zinc-800 focus-within:border-emerald-500'
    }`}>
      <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">{label}</label>
      <div className="flex items-center gap-2">
        {icon && <span className="text-zinc-400">{icon}</span>}
        <input 
          type={type} 
          value={value} 
          disabled={disabled} 
          onChange={(e) => !disabled && onChange(e.target.value)} 
          className="w-full bg-transparent text-xs text-white outline-none py-0.5 disabled:cursor-not-allowed" 
        />
      </div>
    </div>
  );
}

function SelectInput({ label, value, onChange, options, disabled = false }) {
  return (
    <div className={`group flex flex-col gap-1 border-b pb-1.5 transition-colors relative w-full ${
      disabled ? 'border-zinc-800/40 opacity-50' : 'border-zinc-800 focus-within:border-emerald-500'
    }`}>
      <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">{label}</label>
      <div className="relative flex items-center">
        <select 
          disabled={disabled}
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full bg-transparent text-xs text-white outline-none py-0.5 appearance-none cursor-pointer disabled:cursor-not-allowed pr-4"
        >
          {!value && <option value="" className="bg-[#0b0f14] text-zinc-400">Select {label}</option>}
          {options.map(opt => (
            <option key={opt} value={opt} className="bg-[#0b0f14]">{opt}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-0 text-zinc-400 pointer-events-none" />
      </div>
    </div>
  );
}

function ChangeButton({ onClick, label = "Change" }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 hover:text-amber-300 transition-colors pb-1 shrink-0"
    >
      {label}
    </button>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
      <div className="p-4 bg-zinc-900/50 rounded-full border border-zinc-800/50 mb-3">
        <Icon size={28} className="opacity-40 text-zinc-300" />
      </div>
      <p className="text-xs font-medium">{text}</p>
    </div>
  );
}
