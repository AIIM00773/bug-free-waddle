import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Package, ShoppingBag, Compass, Hash, 
  Mail, Phone, UserCircle, Plus, Minus, ChevronDown, X, Check, Loader2, Sparkles 
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
      <div className="fixed inset-0 z-50 bg-[#0d0f12]/90 backdrop-blur-md flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="animate-spin text-cyan-400" size={28} />
        <span className="text-xs font-medium text-zinc-300 font-mono tracking-wide">Initializing profile...</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#07080a]/80 backdrop-blur-lg flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-150">
      <div className="w-full h-full md:max-w-4xl md:h-[85vh] bg-[#0d0f12] text-zinc-200 font-sans flex flex-col relative rounded-none md:rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.06] bg-[#11141a]/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
              <Sparkles size={16} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-zinc-100 tracking-wide font-sans">{user?.full_name || 'Account Settings'}</h2>
              <span className="text-[10px] text-zinc-500 font-mono tracking-tight flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isAuthenticated ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                {isAuthenticated ? 'VERIFIED' : 'GUEST'}
              </span>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onBackToChat} 
            className="flex items-center gap-1.5 px-3 py-1.2 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-400 hover:text-zinc-200 text-xs transition-all duration-150"
          >
            <X size={14} />
            <span className="text-xs font-medium">Close</span>
          </button>
        </div>

        {/* TABS (Perplexity Segmented Control) */}
        <div className="flex items-center border-b border-white/[0.06] bg-[#0d0f12] px-6 py-2 overflow-x-auto no-scrollbar gap-1.5">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                type="button"
                key={tab.id} 
                onClick={() => handleTabChange(tab.id)} 
                className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap ${
                  isActive 
                    ? 'bg-white/[0.08] text-cyan-300 border border-cyan-500/30' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                <tab.icon size={14} className={isActive ? 'text-cyan-400' : 'text-zinc-500'} /> 
                <span>{tab.label}</span>
                {!!tab.badge && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-cyan-500/20 text-cyan-300 font-mono font-semibold rounded">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#0d0f12]">
          <form onSubmit={handleFormSubmission} className="max-w-5xl  mx-auto space-y-6 pb-20">
            <AnimatePresence mode="wait">
              
              {/* TAB: IDENTITY */}
              {activeTab === 'identity' && (
                <motion.div 
                  key="identity"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4 bg-[#13161c] p-5 rounded-xl border border-white/[0.06]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PerplexityInput label="First Name" disabled={!!user?.first_name} value={profile.first_name} onChange={(v) => handleFieldChange('first_name', v)} />
                    <PerplexityInput label="Last Name" disabled={!!user?.last_name} value={profile.last_name} onChange={(v) => handleFieldChange('last_name', v)} />
                  </div>
                  
                  <PerplexityInput label="Email Address" type="email" icon={<Mail size={13} />} value={profile.email} disabled={!!user?.email} onChange={(v) => handleFieldChange('email', v)} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PerplexityInput label="Phone Number" disabled={!!user?.phone} value={profile.phone} icon={<Phone size={13} />} onChange={(v) => handleFieldChange('phone', v)} />
                    <PerplexityInput label="National ID / Passport" disabled={!!user?.national_id_number} value={profile.national_id_number} icon={<Hash size={13} />} onChange={(v) => handleFieldChange('national_id_number', v)} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.age ? (
                      <PerplexityInput label="Age" type="text" disabled value={profile.age} />
                    ) : (
                      <PerplexityInput label="Date of Birth" type={profile.dob ? "text" : "date"} disabled={!!user?.dob} value={profile.dob} onChange={(v) => handleFieldChange('dob', v)} />
                    )}
                    <PerplexitySelect label="Gender" disabled={!!user?.gender} value={profile.gender} onChange={(v) => handleFieldChange('gender', v)} options={['Male', 'Female', 'Other']} />
                  </div>
                </motion.div>
              )}

              {/* TAB: LOGISTICS */}
 {/* TAB: LOGISTICS */}
{activeTab === 'logistics' && (
  <motion.div 
    key="logistics"
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.15 }}
    className="space-y-4 bg-[#13161c] p-5 rounded-xl border border-white/[0.06]"
  >
    <PerplexityInput label="Country" value={profile.country} onChange={(v) => handleFieldChange('country', v)} />

    {/* Editable County Selector */}
    <div className="flex items-center gap-2">
      <div className="w-full flex flex-col gap-1.5 bg-[#181c24] p-2.5 rounded-lg border border-white/[0.06] focus-within:border-cyan-500/50 transition-all">
        <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">County</label>
        <select 
          value={profile.county || ''} 
          onChange={(e) => { 
            handleFieldChange('county', e.target.value); 
            handleFieldChange('sub_county', ''); 
          }}
          className="bg-transparent text-xs text-zinc-100 outline-none cursor-pointer"
        >
          <option value="" disabled className="bg-[#13161c] text-zinc-500">Select County</option>
          {Counties.map((c) => (
            <option key={c.code} value={c.name} className="bg-[#13161c]">
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

    {/* Editable Sub-County Selector */}
    <div className="flex items-center gap-2">
      <div className="w-full flex flex-col gap-1.5 bg-[#181c24] p-2.5 rounded-lg border border-white/[0.06] focus-within:border-cyan-500/50 transition-all">
        <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">Sub-County</label>
        <select 
          value={profile.sub_county || ''} 
          onChange={(e) => handleFieldChange('sub_county', e.target.value)}
          disabled={!profile.county}
          className="bg-transparent text-xs text-zinc-100 outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="" disabled className="bg-[#13161c] text-zinc-500">
            {profile.county ? 'Select Sub-County' : 'Select County First'}
          </option>
          {availableSubCounties.map((subCountyName) => (
            <option key={subCountyName} value={subCountyName} className="bg-[#13161c]">
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

    <PerplexityInput label="Estate / Neighborhood" value={profile.estate_area_neighborhood} onChange={(v) => handleFieldChange('estate_area_neighborhood', v)} />
    <PerplexityInput label="Apartment / Door ID" value={profile.apartment_door_id} onChange={(v) => handleFieldChange('apartment_door_id', v)} />
    <PerplexityInput label="Delivery Directions" value={profile.location_explanation} onChange={(v) => handleFieldChange('location_explanation', v)} />
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
                >
                  {cart?.length > 0 ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {cart.map((item) => (
                          <div key={item.product.id || item.id} className="flex items-center justify-between p-3.5 bg-[#13161c] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                            <div>
                              <p className="text-xs font-medium text-zinc-100">{item.product.name}</p>
                              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">KES {item.product.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-[#181c24] p-1 rounded-md border border-white/[0.06]">
                              <button type="button" onClick={() => updateCartQty(item.product.id, -1)} className="p-1 hover:bg-white/[0.06] rounded text-zinc-300 transition-colors"><Minus size={12} /></button>
                              <span className="text-xs font-mono font-semibold w-5 text-center">{item.quantity}</span>
                              <button type="button" onClick={() => updateCartQty(item.product.id, 1)} className="p-1 hover:bg-white/[0.06] rounded text-zinc-300 transition-colors"><Plus size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-white/[0.06] space-y-2 bg-[#13161c] p-4 rounded-xl border border-white/[0.06]">
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>Subtotal</span>
                          <span className="font-mono">KES {cartSummary?.subtotal?.toLocaleString() ?? 0}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-xs text-zinc-100 pt-2 border-t border-white/[0.06]">
                          <span>Total</span>
                          <span className="text-cyan-400 font-mono">KES {cartSummary?.finalTotal?.toLocaleString() ?? 0}</span>
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
                >
                  <EmptyState icon={Package} text="No recent order history found" />
                </motion.div>
              )}

            </AnimatePresence>

            {/* SAVE BUTTON (Perplexity Bottom Action Bar) */}
            <AnimatePresence>
              {['identity', 'logistics'].includes(activeTab) && isModified && (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="fixed bottom-6 right-6 md:absolute md:bottom-6 md:right-8 z-20"
                >
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="flex items-center gap-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#0d0f12] text-xs font-semibold rounded-lg shadow-lg shadow-cyan-950/50 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check size={13} />
                        <span>Saved</span>
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

// Sub-components adapted to Perplexity UI
function PerplexityInput({ label, value, onChange, type = "text", icon, disabled = false }) {
  return (
    <div className={`flex flex-col gap-1.5 p-2.5 rounded-lg bg-[#181c24] border transition-all w-full ${
      disabled ? 'border-white/[0.03] opacity-50' : 'border-white/[0.06] focus-within:border-cyan-500/50'
    }`}>
      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">{label}</label>
      <div className="flex items-center gap-2">
        {icon && <span className="text-zinc-500">{icon}</span>}
        <input 
          type={type} 
          value={value ?? ''} 
          disabled={disabled} 
          onChange={(e) => !disabled && onChange && onChange(e.target.value)} 
          className="w-full bg-transparent text-xs text-zinc-100 outline-none disabled:cursor-not-allowed placeholder-zinc-600" 
        />
      </div>
    </div>
  );
}

function PerplexitySelect({ label, value, onChange, options, disabled = false }) {
  return (
    <div className={`flex flex-col gap-1.5 p-2.5 rounded-lg bg-[#181c24] border transition-all relative w-full ${
      disabled ? 'border-white/[0.03] opacity-50' : 'border-white/[0.06] focus-within:border-cyan-500/50'
    }`}>
      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">{label}</label>
      <div className="relative flex items-center">
        <select 
          disabled={disabled}
          value={value ?? ''} 
          onChange={(e) => onChange && onChange(e.target.value)} 
          className="w-full bg-transparent text-xs text-zinc-100 outline-none appearance-none cursor-pointer disabled:cursor-not-allowed pr-4"
        >
          {!value && <option value="" className="bg-[#13161c] text-zinc-500">Select {label}</option>}
          {options.map(opt => (
            <option key={opt} value={opt} className="bg-[#13161c]">{opt}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-0 text-zinc-500 pointer-events-none" />
      </div>
    </div>
  );
}

function ChangeButton({ onClick, label = "Edit" }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="text-[10px] font-mono uppercase tracking-wider font-semibold text-cyan-400 hover:text-cyan-300 transition-colors pb-2 shrink-0"
    >
      {label}
    </button>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
      <div className="p-3 bg-[#13161c] rounded-lg border border-white/[0.06] mb-3">
        <Icon size={20} className="text-zinc-400" />
      </div>
      <p className="text-xs font-mono">{text}</p>
    </div>
  );
}
