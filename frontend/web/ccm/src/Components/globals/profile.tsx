import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Hash,
  Mail,
  Phone,
  Clipboard,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCart } from '../../Providers/CartContext';
import { useProfile } from '../../Providers/profileContext';
import { Counties } from '../../../db/counties';

import { ProfileLoadingAndNoAuth } from '../profileInpageComponents/ProfileLoadingAndNoAuth';
import { ProfileHeader } from '../profileInpageComponents/ProfileHeader';
import { ProfileAside } from '../profileInpageComponents/genralSidebar';
import { ProfileOverview } from '../profileInpageComponents/profileOverview';
import { FloatingSaveBar } from '../profileInpageComponents/floatingSaveBar';

import {
  CleanInput,
  CleanSelect,
  ChangeButton,
} from '../profileInpageComponents/cleanSubComponents';

// Helper function to safely extract default user values
const getDefaultProfile = (userData) => ({
  first_name: userData?.first_name || '',
  last_name: userData?.last_name || '',
  middle_name: userData?.middle_name || '',
  email: userData?.email || '',
  phone: userData?.phone || '',
  national_id_number: userData?.national_id_number || '',
  dob: userData?.date_of_birth || userData?.dob || '',
  age: userData?.age || '',
  gender: userData?.gender || '',
  country: userData?.country || 'Kenya',
  county: userData?.county || '',
  sub_county: userData?.sub_county || '',
  street: userData?.street || '',
  estate_area_neighborhood: userData?.estate_area_neighborhood || '',
  apartment_door_id: userData?.apartment_door_id || '',
  location_explanation: userData?.location_explanation || '',
});

export function UserProfile({ onBackToChat }) {
  const { mpesaPhone, setMpesaPhone } = useCart();
  const { isAuthenticated, user, isLoading, editIdentity, editLogistics, logout } = useProfile();

  const [activeTab, setActiveTab] = useState('identity');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isNavMinimized, setIsNavMinimized] = useState(false);
  const [showPersonalDetails] = useState(true);

  // Initialize profile state
  const [profile, setProfile] = useState(() => getDefaultProfile(user));

  // 1. Sync local profile when user context updates
  useEffect(() => {
    if (user) {
      setProfile(getDefaultProfile(user));
    }
  }, [user]);

  // 2. Safely sync M-Pesa phone separately
  useEffect(() => {
    if (user?.phone && !mpesaPhone) {
      setMpesaPhone(user.phone);
    }
  }, [user?.phone, mpesaPhone, setMpesaPhone]);

  // Memoized derived properties
  const tabs = useMemo(() => [
    { id: 'identity', label: 'Profile and Identity', icon: Clipboard },
    { id: 'logistics', label: 'Logistics', icon: Compass },
  ], []);

  const selectedCountyObj = useMemo(() => {
    return Counties.find((c) => c.name === profile.county);
  }, [profile.county]);

  const availableSubCounties = selectedCountyObj ? selectedCountyObj.sub_counties : [];

  // Dynamically compute if the active tab has unsaved changes
  const hasChanges = useMemo(() => {
    if (!user) return false;
    const baseProfile = getDefaultProfile(user);
    
    const identityFields = ['first_name', 'last_name', 'middle_name', 'email', 'phone', 'national_id_number', 'dob', 'age', 'gender'];
    const logisticsFields = ['country', 'county', 'sub_county', 'street', 'estate_area_neighborhood', 'apartment_door_id', 'location_explanation'];
    
    const fieldsToCheck = activeTab === 'identity' ? identityFields : logisticsFields;
    
    return fieldsToCheck.some((key) => baseProfile[key] !== profile[key]);
  }, [profile, user, activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleFieldChange = (key, value) => {
    setProfile((prev) => {
      const updated = { ...prev, [key]: value };
      
      // Auto-clear sub_county if the parent county changes
      if (key === 'county' && prev.county !== value) {
        updated.sub_county = '';
      }
      return updated;
    });
  };

  const handleFormSubmission = async (e) => {
    if (e) e.preventDefault();
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      if (activeTab === 'identity') {
        await editIdentity(profile);
      } else if (activeTab === 'logistics') {
        await editLogistics(profile);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Profile update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReload = () => {
    localStorage.removeItem('showWelcomeBanner');
    window.location.reload();
  };

  if (isLoading || !isAuthenticated) {
    return (
      <ProfileLoadingAndNoAuth
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        onBackToChat={onBackToChat}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 text-slate-800 font-sans overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <ProfileHeader onBackToChat={onBackToChat} handleReload={handleReload} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Desktop) */}
        <ProfileAside
          isNavMinimized={isNavMinimized}
          setIsNavMinimized={setIsNavMinimized}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabs={tabs}
          logout={logout}
        />

        {/* Main content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 w-full">
          {/* Horizontal tab (Mobile Only) */}
          <div className="bg-white px-4 border-b border-slate-200 flex items-center gap-4 overflow-x-auto shrink-0 md:hidden justify-evenly">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-3.5 px-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                    isActive ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
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
                showPersonalDetails
                  ? 'grid-cols-1 lg:grid-cols-12 gap-6 items-start'
                  : 'grid-cols-1 items-center'
              }`}
            >
              {/* LEFT COLUMN: Profile Overview */}
              <ProfileOverview
                activeTab={activeTab}
                profile={profile}
                ShowPersonalDetails={showPersonalDetails}
              />

              {/* RIGHT COLUMN: Dynamic Interactive Panel */}
              <div
                className={`space-y-6 ${
                  activeTab === 'identity' ? 'lg:col-span-8' : 'lg:col-span-12'
                }`}
              >
                <form onSubmit={handleFormSubmission}>
                  <AnimatePresence mode="wait">
                    {/* TAB: IDENTITY */}
                    {activeTab === 'identity' && (
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
                            disabled={Boolean(user?.first_name)}
                            value={profile.first_name}
                            type={profile?.first_name ? 'password' : 'text'}
                            onChange={(v) => handleFieldChange('first_name', v)}
                          />
                          <CleanInput
                            label="Last Name"
                            disabled={Boolean(user?.last_name)}
                            value={profile.last_name}
                            type={profile?.last_name ? 'password' : 'text'}
                            onChange={(v) => handleFieldChange('last_name', v)}
                          />
                        </div>

                        <CleanInput
                          label="Email Address"
                          type={user?.email ? 'password' : 'email'}
                          icon={<Mail size={16} />}
                          value={profile.email}
                          disabled={Boolean(user?.email)}
                          onChange={(v) => handleFieldChange('email', v)}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <CleanInput
                            label="Phone Number"
                            disabled={Boolean(user?.phone)}
                            type={user?.phone ? 'password' : 'text'}
                            value={profile.phone}
                            icon={<Phone size={16} />}
                            onChange={(v) => handleFieldChange('phone', v)}
                          />

                          <CleanInput
                            label="National ID / Passport"
                            disabled={Boolean(user?.national_id_number)}
                            type={user?.national_id_number ? 'password' : 'text'}
                            value={profile.national_id_number}
                            icon={<Hash size={16} />}
                            onChange={(v) => handleFieldChange('national_id_number', v)}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {profile.age ? (
                            <CleanInput
                              label="Age"
                              disabled
                              type={profile?.age ? 'password' : 'text'}
                              value={profile.age}
                            />
                          ) : (
                            <CleanInput
                              label="Date of Birth"
                              type={profile.dob ? 'text' : 'date'}
                              disabled={Boolean(user?.dob || user?.date_of_birth)}
                              value={profile.dob}
                              onChange={(v) => handleFieldChange('dob', v)}
                            />
                          )}

                          {!user?.gender && (
                            <CleanSelect
                              label="Gender"
                              disabled={Boolean(user?.gender)}
                              value={profile.gender || ''}
                              onChange={(v) => handleFieldChange('gender', v)}
                              options={['Male', 'Female', 'Other']}
                            />
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* TAB: LOGISTICS */}
                    {activeTab === 'logistics' && (
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
                              Set default address details and delivery directions
                            </p>
                          </div>
                        </div>

                        <CleanInput
                          label="Country"
                          value={profile.country}
                          onChange={(v) => handleFieldChange('country', v)}
                        />

                        {/* County Selector */}
                        {profile.county ? (
                          <div className="flex items-center gap-2">
                            <div className="relative flex items-center w-full">
                              <CleanInput
                                label="County"
                                value={profile.county}
                                onChange={(v) => handleFieldChange('county', v)}
                              />
                            </div>
                            <ChangeButton
                              label="Clear"
                              onClick={() => handleFieldChange('county', '')}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-full flex flex-col gap-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                County
                              </label>
                              <div className="relative flex items-center">
                                <select
                                  value={profile.county || ''}
                                  onChange={(e) => handleFieldChange('county', e.target.value)}
                                  className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none cursor-pointer appearance-none pr-6"
                                >
                                  <option value="" disabled className="text-slate-400">
                                    Select County
                                  </option>
                                  {Counties.map((c) => (
                                    <option key={c.code} value={c.name} className="text-slate-800">
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
                          </div>
                        )}

                        {/* Sub-County Selector */}
                        {profile.sub_county ? (
                          <div className="flex items-center gap-2">
                            <div className="relative flex items-center w-full">
                              <CleanInput
                                label="Sub County"
                                value={profile.sub_county}
                                onChange={(v) => handleFieldChange('sub_county', v)}
                              />
                            </div>
                            <ChangeButton
                              label="Clear"
                              onClick={() => handleFieldChange('sub_county', '')}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-full flex flex-col gap-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Sub-County
                              </label>
                              <div className="relative flex items-center">
                                <select
                                  value={profile.sub_county || ''}
                                  onChange={(e) => handleFieldChange('sub_county', e.target.value)}
                                  disabled={!profile.county}
                                  className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed appearance-none pr-6"
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
                                <ChevronDown
                                  size={14}
                                  className="absolute right-0 text-slate-400 pointer-events-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <CleanInput
                            label="Estate / Neighborhood / Town"
                            value={profile.estate_area_neighborhood}
                            onChange={(v) => handleFieldChange('estate_area_neighborhood', v)}
                          />
                          <CleanInput
                            label="Apartment / Door ID / Flat"
                            value={profile.apartment_door_id}
                            onChange={(v) => handleFieldChange('apartment_door_id', v)}
                          />
                        </div>

                        <CleanInput
                          label="Descriptive Delivery Directions"
                          value={profile.location_explanation}
                          onChange={(v) => handleFieldChange('location_explanation', v)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </div>

          {/* FLOATING ACTION / SAVE BAR */}
          <FloatingSaveBar
            isModified={hasChanges}
            saveSuccess={saveSuccess}
            activeTab={activeTab}
            isSaving={isSaving}
            handleFormSubmission={handleFormSubmission}
          />
        </div>
      </div>
    </div>
  );
}
