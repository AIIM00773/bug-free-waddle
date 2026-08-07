import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Package, ShoppingBag, Compass, Hash, 
  Mail, Phone, Plus, Minus, X, Check, Loader2, 
  MapPin, Calendar, ArrowLeft, ChevronLeft, 
  ChevronRight, Clipboard, LogOut, ChevronDown, CheckCircle2,Sparkles 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
  const [isNavMinimized, setIsNavMinimized] = useState(false);
  const [ShowPersonalDetails,setShowPersonalDetails] = useState(true); 

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
    if (e) e.preventDefault();
    if (!isModified) return;
    setIsSaving(true);

    try {
      if (activeTab === 'identity') await editIdentity(profile);
      else if (activeTab === 'logistics') await editLogistics(profile);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      setIsModified(false);
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setIsSaving(false);
    }
  };



  if (isLoading || !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-md flex flex-col items-center justify-center p-4">
        {isLoading ? (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-4 text-center max-w-sm w-full">
            <Loader2 className="animate-spin text-indigo-600" size={38} />
            <span className="text-sm font-semibold text-slate-700 tracking-wide">Loading Profile...</span>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 p-8 rounded-3xl flex flex-col items-center gap-5 max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <User size={32} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Not Authenticated</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Please sign in to view and manage your profile settings.</p>
            </div>
            <button
              type="button"
              onClick={onBackToChat}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold rounded-2xl shadow-md transition-all"
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
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 text-slate-800 font-sans overflow-hidden animate-in fade-in duration-200">
      {/* UNIFIED TOP HEADER BAR */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-orange-500/20 bg-gradient-to-r from-orange-500 to-amber-500 px-4 sm:px-6 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg leading-tight">
                Soko AI
              </h1>
              <p className="text-[11px] font-medium text-orange-100 leading-none mt-0.5">
                Profile & Account Settings
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-3">
          <AnimatePresence>
            <div className="text-xs font-medium text-white/90">
              {/* Optional Right Action Content */}
            </div>
          </AnimatePresence>
          <button
            type="button"
            onClick={onBackToChat}
            className="p-2 text-orange-100 hover:text-white rounded-xl hover:bg-white/10 transition-colors md:hidden"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* MAIN FLEX WRAPPER (Takes remaining viewport height without overflowing) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT NAV SIDEBAR (Desktop / Tablet) */}
        <div
          className={`bg-slate-100/80 border-r border-slate-200 text-slate-700 flex-col justify-between shrink-0 transition-all duration-300 ease-in-out ${
            isNavMinimized ? "md:w-20" : "md:w-64"
          } hidden md:flex`}
        >
          <div>
            {/* Sidebar Header */}
            <div
              className={`h-14 ${
                isNavMinimized ? "px-3 justify-center" : "px-6 justify-between"
              } flex items-center border-b border-slate-200/60`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {!isNavMinimized && (
                  <div className="p-2 bg-slate-800 border border-slate-700 rounded-full shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                )}
                {!isNavMinimized && (
                  <span className="font-serif  text-slate-900 tracking-tight text-xs">
                   Profile and Account 
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsNavMinimized(!isNavMinimized)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title={isNavMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isNavMinimized ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )}
              </button>
            </div>

            {/* Nav Items */}
            <div className="p-3 space-y-4.5 w-full">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    title={isNavMinimized ? tab.label : undefined}
                    className={`w-[78%] flex items-center  ${
                      isNavMinimized
                        ? "justify-center py-3 px-0"
                        : "justify-between px-3.5 py-3"
                    } text-xs font-semibold transition-all relative cursor-pointer  ${
                      isActive
                        ? "bg-orange-400/40  text-orange-800 shadow-sm rounded-4xl "
                        : "text-slate-600 hover:text-slate-900 bg-slate-200/30  border border-slate-200/60    hover:bg-slate-200/50 rounded-4xl "
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={
                          isActive
                            ? "text-orange-800 shrink-0"
                            : "text-slate-400 shrink-0"
                        }
                      />
                      {!isNavMinimized && <span>{tab.label}</span>}
                    </div>

                    {!!tab.badge && tab.badge > 0 && (
                      <span
                        className={`${
                          isNavMinimized
                            ? "absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px]"
                            : "px-2 py-0.5 text-[10px]"
                        } bg-indigo-600 text-white font-mono font-bold rounded-full shadow-sm`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-200/60 space-y-1.5">
            <button
              type="button"
              onClick={logout}
              title={isNavMinimized ? "Log Out" : undefined}
              className={`w-full flex items-center ${
                isNavMinimized
                  ? "justify-center py-3"
                  : "justify-start gap-3 px-3.5 py-3"
              } rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors`}
            >
              <LogOut size={18} className="shrink-0" />
              {!isNavMinimized && <span>Log Out</span>}
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 w-full">
          {/* HORIZONTAL TAB NAVIGATION (Mobile Only Bar) */}
          <div className="bg-white px-4 border-b border-slate-200 flex items-center gap-4 overflow-x-auto shrink-0 md:hidden">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-3.5 px-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "border-slate-800 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-slate-900" : "text-slate-400"}
                  />
                  <span>{tab.label}</span>
                  {!!tab.badge && tab.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-indigo-100 text-indigo-700 font-mono font-bold rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN DASHBOARD CONTENT */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
            <div
              className={`w-full grid ${
                ShowPersonalDetails
                  ? "grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                  : "grid-cols-1 items-center"
              }`}
            >
              {/* LEFT COLUMN: Profile Overview (Only on Identity Tab) */}
              {activeTab === "identity" && (
                <div
                  className={`lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 ${
                    ShowPersonalDetails ? "" : "hidden"
                  }`}
                >
                  {/* User Profile Card */}
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-slate-900 text-base truncate">
                        {fullNameDisplay}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isAuthenticated ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        <span className="text-[10px] font-light text-slate-600 lowercase tracking-wider">
                          {isAuthenticated
                            ? "Verified Account"
                            : "Guest Account"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Summary */}
                  <div className="space-y-3 pb-6 border-b border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Contact Info
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Phone size={15} className="text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-800 font-medium">
                          {profile.phone || "No phone set"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Mail size={15} className="text-slate-400 shrink-0" />
                        <span className="truncate text-slate-800 font-medium">
                          {profile.email || "No email set"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address Summary */}
                  <div className="space-y-3 pb-6 border-b border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Default Delivery
                    </h4>
                    <div className="space-y-2.5 text-xs text-slate-600">
                      <div className="flex items-start gap-3">
                        <MapPin
                          size={15}
                          className="text-slate-400 shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {profile.estate_area_neighborhood ||
                              "Location not specified"}
                          </p>
                          <p className="text-slate-500 mt-0.5">
                            {[
                              profile.sub_county,
                              profile.county,
                              profile.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Details
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between py-0.5">
                        <span className="text-slate-500 flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          Date of birth
                        </span>
                        <span className="font-semibold text-slate-800">
                          {profile.dob || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-0.5">
                        <span className="text-slate-500 flex items-center gap-2">
                          <Hash size={14} className="text-slate-400" />
                          National ID
                        </span>
                        <span className="font-semibold font-mono text-slate-800">
                          {profile.national_id_number || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-0.5">
                        <span className="text-slate-500 flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          Gender
                        </span>
                        <span className="font-semibold text-slate-800">
                          {profile.gender || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RIGHT COLUMN: Dynamic Interactive Panel */}
              <div
                className={`space-y-6 ${
                  activeTab === "identity"
                    ? "lg:col-span-8"
                    : "lg:col-span-12"
                }`}
              >
                <form onSubmit={handleFormSubmission}>
                  <AnimatePresence mode="wait">
                    {/* TAB: IDENTITY */}
                    {activeTab === "identity" && (
                      <motion.div
                        key="identity"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">
                              Personal Information
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Manage your legal identity and contact credentials
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <CleanInput
                            label="First Name"
                            disabled={!!user?.first_name}
                            value={profile.first_name}
                            onChange={(v) => handleFieldChange("first_name", v)}
                          />
                          <CleanInput
                            label="Last Name"
                            disabled={!!user?.last_name}
                            value={profile.last_name}
                            onChange={(v) => handleFieldChange("last_name", v)}
                          />
                        </div>

                        <CleanInput
                          label="Email Address"
                          type="email"
                          icon={<Mail size={16} />}
                          value={profile.email}
                          disabled={!!user?.email}
                          onChange={(v) => handleFieldChange("email", v)}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <CleanInput
                            label="Phone Number"
                            disabled={!!user?.phone}
                            value={profile.phone}
                            icon={<Phone size={16} />}
                            onChange={(v) => handleFieldChange("phone", v)}
                          />
                          <CleanInput
                            label="National ID / Passport"
                            disabled={!!user?.national_id_number}
                            value={profile.national_id_number}
                            icon={<Hash size={16} />}
                            onChange={(v) =>
                              handleFieldChange("national_id_number", v)
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {profile.age ? (
                            <CleanInput
                              label="Age"
                              type="text"
                              disabled
                              value={profile.age}
                            />
                          ) : (
                            <CleanInput
                              label="Date of Birth"
                              type={profile.dob ? "text" : "date"}
                              disabled={!!user?.dob}
                              value={profile.dob}
                              onChange={(v) => handleFieldChange("dob", v)}
                            />
                          )}
                          <CleanSelect
                            label="Gender"
                            disabled={!!user?.gender}
                            value={profile.gender}
                            onChange={(v) => handleFieldChange("gender", v)}
                            options={["Male", "Female", "Other"]}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* TAB: LOGISTICS */}
                    {activeTab === "logistics" && (
                      <motion.div
                        key="logistics"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">
                              Delivery Logistics
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Set default address details and delivery
                              directions
                            </p>
                          </div>
                        </div>

                        <CleanInput
                          label="Country"
                          value={profile.country}
                          onChange={(v) => handleFieldChange("country", v)}
                        />

                        {/* County Selector */}
                        <div className="flex items-center gap-2">
                          <div className="w-full flex flex-col gap-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              County
                            </label>
                            <div className="relative flex items-center">
                              <select
                                value={profile.county || ""}
                                onChange={(e) => {
                                  handleFieldChange("county", e.target.value);
                                  handleFieldChange("sub_county", "");
                                }}
                                className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none cursor-pointer appearance-none pr-6"
                              >
                                <option
                                  value=""
                                  disabled
                                  className="text-slate-400"
                                >
                                  Select County
                                </option>
                                {Counties.map((c) => (
                                  <option
                                    key={c.code}
                                    value={c.name}
                                    className="text-slate-800"
                                  >
                                    {c.code} - {c.name}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={14}
                                className="absolute right-0 text-slate-400 pointer-events-none"
                              />
                            </div>
                          </div>
                          {profile.county && (
                            <ChangeButton
                              label="Clear"
                              onClick={() => {
                                handleFieldChange("county", "");
                                handleFieldChange("sub_county", "");
                              }}
                            />
                          )}
                        </div>

                        {/* Sub-County Selector */}
                        <div className="flex items-center gap-2">
                          <div className="w-full flex flex-col gap-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Sub-County
                            </label>
                            <div className="relative flex items-center">
                              <select
                                value={profile.sub_county || ""}
                                onChange={(e) =>
                                  handleFieldChange(
                                    "sub_county",
                                    e.target.value
                                  )
                                }
                                disabled={!profile.county}
                                className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed appearance-none pr-6"
                              >
                                <option
                                  value=""
                                  disabled
                                  className="text-slate-400"
                                >
                                  {profile.county
                                    ? "Select Sub-County"
                                    : "Select County First"}
                                </option>
                                {availableSubCounties.map((subCountyName) => (
                                  <option
                                    key={subCountyName}
                                    value={subCountyName}
                                    className="text-slate-800"
                                  >
                                    {subCountyName}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={14}
                                className="absolute right-0 text-slate-400 pointer-events-none"
                              />
                            </div>
                          </div>
                          {profile.sub_county && (
                            <ChangeButton
                              label="Clear"
                              onClick={() => handleFieldChange("sub_county", "")}
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <CleanInput
                            label="Estate / Neighborhood"
                            value={profile.estate_area_neighborhood}
                            onChange={(v) =>
                              handleFieldChange("estate_area_neighborhood", v)
                            }
                          />
                          <CleanInput
                            label="Apartment / Door ID"
                            value={profile.apartment_door_id}
                            onChange={(v) =>
                              handleFieldChange("apartment_door_id", v)
                            }
                          />
                        </div>
                        <CleanInput
                          label="Delivery Directions"
                          value={profile.location_explanation}
                          onChange={(v) =>
                            handleFieldChange("location_explanation", v)
                          }
                        />
                      </motion.div>
                    )}

                    {/* TAB: CART */}
                    {activeTab === "cart" && (
                      <motion.div
                        key="cart"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">
                              Active Cart Items
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Review and adjust items before checkout
                            </p>
                          </div>
                          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                            {cart?.length || 0} items
                          </span>
                        </div>

                        {cart?.length > 0 ? (
                          <div className="space-y-6">
                            <div className="divide-y divide-slate-100">
                              {cart.map((item) => (
                                <div
                                  key={item.product.id || item.id}
                                  className="py-4 flex items-center justify-between gap-4"
                                >
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">
                                      {item.product.name}
                                    </p>
                                    <p className="text-xs font-mono font-medium text-slate-500 mt-0.5">
                                      KES{" "}
                                      {item.product.price?.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateCartQty(item.product.id, -1)
                                      }
                                      className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors shadow-none hover:shadow-sm"
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className="text-xs font-mono font-bold w-6 text-center text-slate-900">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateCartQty(item.product.id, 1)
                                      }
                                      className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors shadow-none hover:shadow-sm"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-4 space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>Subtotal</span>
                                <span className="font-mono text-slate-900 font-semibold">
                                  KES{" "}
                                  {cartSummary?.subtotal?.toLocaleString() ?? 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center font-bold text-xs text-slate-900 pt-3 border-t border-slate-200/60">
                                <span>Total Amount</span>
                                <span className="font-mono text-indigo-600 text-base">
                                  KES{" "}
                                  {cartSummary?.finalTotal?.toLocaleString() ??
                                    0}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <EmptyState
                            icon={ShoppingBag}
                            text="Your shopping cart is currently empty"
                          />
                        )}
                      </motion.div>
                    )}

                    {/* TAB: ORDERS */}
                    {activeTab === "orders" && (
                      <motion.div
                        key="orders"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6"
                      >
                        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">
                              Order Activity
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Historical log of all completed transactions
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <EmptyState
                            icon={Package}
                            text="No recent order history found"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </div>

          {/* FLOATING ACTION / SAVE BAR */}
          <AnimatePresence>
            {(isModified || saveSuccess) &&
              ["identity", "logistics"].includes(activeTab) && (
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-slate-800"
                >
                  {saveSuccess ? (
                    <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-semibold px-2">
                      <CheckCircle2 size={18} />
                      <span>Profile saved successfully!</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs font-medium text-slate-300 px-2">
                        Unsaved changes detected
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsModified(false)}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                        >
                          Discard
                        </button>
                        <button
                          type="button"
                          onClick={handleFormSubmission}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md transition-all disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
  }
  

/* =========================================================
   CLEAN SUB-COMPONENTS
   ========================================================= */

function CleanInput({ label, value, onChange, type = "text", icon, disabled = false }) {
  return (
    <div className={`flex flex-col gap-1.5 p-3.5 rounded-2xl bg-slate-50 border transition-all w-full ${
      disabled 
        ? 'opacity-60 cursor-not-allowed border-slate-200/60' 
        : 'border-slate-200/80 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100'
    }`}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-slate-400">{icon}</span>}
        <input
          type={type}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none disabled:cursor-not-allowed placeholder:text-slate-400"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}

function CleanSelect({ label, value, onChange, options = [], disabled = false }) {
  return (
    <div className={`flex flex-col gap-1.5 p-3.5 rounded-2xl bg-slate-50 border transition-all w-full ${
      disabled 
        ? 'opacity-60 cursor-not-allowed border-slate-200/60' 
        : 'border-slate-200/80 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100'
    }`}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="relative flex items-center">
        <select
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none cursor-pointer disabled:cursor-not-allowed appearance-none pr-6"
        >
          <option value="" disabled>Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-slate-800">{opt}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-0 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function ChangeButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-3.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 rounded-2xl transition-all shrink-0"
    >
      {label}
    </button>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
        <Icon size={24} />
      </div>
      <p className="text-xs font-semibold text-slate-500">{text}</p>
    </div>
  );
}
