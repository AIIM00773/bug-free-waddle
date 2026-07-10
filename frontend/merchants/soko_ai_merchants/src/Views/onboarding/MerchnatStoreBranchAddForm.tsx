import React, { useCallback, useState } from 'react';
import {
    Clock,
    ShieldCheck,
    Phone,
    Mail,
    ArrowRight,
    ArrowLeft,
    Save,
    Loader2,
    Map,
    ChevronDown
} from 'lucide-react';
import { useBranch } from '../../Providers/BranchProvider'; 
import { useAuth } from "../../Providers/AuthProvider";

import { LOCATIONS } from "../../Constants/kenya-locations"; 
import { BRANCH_CATEGORIES } from "../../Constants/branch-categories";

interface AddBranchFormProps {
    onCancel: () => void;
}

interface FormState {
    branchName: string;
    branchCategory: string;
    isPrimary: boolean;
    branchDescription: string;
    isOnline: boolean;
    isStocked: boolean;
    isAcceptingOrders: boolean;
    country: string;
    county: string;
    subCounty: string;
    physicalAddress: string;
    buildingName: string;
    latitude: string;
    longitude: string;
    opens: string;
    closes: string;
    operatingHours: string;
    managerName: string;
    managerPhone: string;
    managerEmail: string;
}

// Minimalist, premium input design tokens
const baseInputClass = "w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-[yellowgreen] font-sans  placeholder-zinc-400 transition-all focus:outline-none focus:border-zinc-400 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed font-normal";
const standardPadding = "px-3.5 py-2";
const iconPadding = "pl-9 pr-3.5 py-2";
const labelClass = "block text-xs font-normal text-zinc-500 dark:text-zinc-400 mb-1.5";
const errorTextClass = "text-[11px] text-red-500 mt-1 font-normal animate-fadeIn";

export default function AddBranchForm({ onCancel }: AddBranchFormProps) {
    const { branchOnboardingForm, isLoading, onBoardingBranch, branches  } = useBranch();
    const { isAuthenticated, user, merchantProfile } = useAuth();
    
    const [addGeoCoordinates, setAddGeoCoordinates] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(1);
    
    const [localForm, setLocalForm] = useState<FormState>({
        branchName: '',
        branchCategory: '',
        isPrimary: false,
        branchDescription: '',
        isOnline: false,
        isStocked: false,
        isAcceptingOrders: false,
        country: 'Kenya',
        county: '',
        subCounty: '',
        physicalAddress: '',
        buildingName: '',
        latitude: '',
        longitude: '',
        opens: '',
        closes: '',
        operatingHours: '',
        managerName: '',
        managerPhone: '',
        managerEmail: '',
        ...branchOnboardingForm 
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

    const currentCountyObj = LOCATIONS.find(c => c.county === localForm.county);
    const availableSubCounties = currentCountyObj ? currentCountyObj.subcounties : [];

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setLocalForm(prev => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            if (name === 'county') {
                updated.subCounty = '';
            }

            return updated;
        });

        // Clear individual field errors as the user edits
        if (errors[name as keyof FormState]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }, [errors]);

    // Validate active step inputs cleanly using targeted Regex where applicable
    const validateStep = (step: number): boolean => {
        const stepErrors: Partial<Record<keyof FormState, string>> = {};

        if (step === 1) {
            if (!localForm.branchName.trim()) stepErrors.branchName = "Branch name is required";
            if (!localForm.branchCategory) stepErrors.branchCategory = "Operational role category is required";
        }

        if (step === 2) {
            if (!localForm.county) stepErrors.county = "County selection is required";
            if (!localForm.subCounty) stepErrors.subCounty = "Sub-County selection is required";
            if (!localForm.physicalAddress.trim()) stepErrors.physicalAddress = "Street address layout details are required";
            if (!localForm.buildingName.trim()) stepErrors.buildingName = "Building or Suite detail is required";
            
            if (addGeoCoordinates) {
                if (!localForm.latitude.trim()) stepErrors.latitude = "Latitude decimal value is required";
                if (!localForm.longitude.trim()) stepErrors.longitude = "Longitude decimal value is required";
            }
        }

        if (step === 3) {
            if (!localForm.managerName.trim()) stepErrors.managerName = "Manager full name is required";
            
            // Clean space formatting and check Kenyan phone patterns (+254... or 07... / 01...)
            const cleanPhone = localForm.managerPhone.replace(/\s+/g, '');
            const kenyanPhoneRegex = /^(?:\+254|0)[17]\d{8}$/;
            if (!localForm.managerPhone.trim()) {
                stepErrors.managerPhone = "Mobile contact is required";
            } else if (!kenyanPhoneRegex.test(cleanPhone)) {
                stepErrors.managerPhone = "Enter a valid Kenyan number (e.g., 0712345678 or +254712345678)";
            }

            if (localForm.managerEmail.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(localForm.managerEmail)) {
                    stepErrors.managerEmail = "Please provide a valid structure layout for emails";
                }
            }
        }

        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const onboardingHandlePrev = () => {
        setOnboardingStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateStep(onboardingStep)) {
            return;
        }

        if (onboardingStep < 3) {
            setOnboardingStep(prev => prev + 1);
        } else {
            const success = await onBoardingBranch(localForm);
            if (success) {
                onCancel(); 
            }
        }
    };

    if (!isAuthenticated || !user || !merchantProfile) {
        return <div className="flex items-center justify-center p-8 text-xs font-normal text-zinc-400">Not Authenticated</div>;
    }
    
    return (
        <div className="w-full max-w-2xl xl:mt-14 mx-auto bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
            
            {/* Visual Step Indicator Progress Bar */}
            <div className="pt-6 px-8 flex items-center justify-between gap-2">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex-1 space-y-2">
                        <div className={`h-[2px] transition-all duration-300 ${step <= onboardingStep ? 'bg-zinc-700 dark:bg-zinc-300' : 'bg-zinc-100 dark:bg-zinc-900'}`} />
                        <span className={`text-[10px] uppercase tracking-wider block transition-colors ${ step === onboardingStep  ? 'text-zinc-800 dark:text-green-400 font-medium'   : 'text-zinc-400 font-normal'  }`}>
                            {step === 1 && "Identity"}
                            {step === 2 && "Location & Hours"}
                            {step === 3 && "Management"}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 z-20 flex flex-col items-center justify-center backdrop-blur-[1px] rounded-b-xl">
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin stroke-[1.5]" />
                        <p className="text-xs font-normal text-zinc-500 mt-2.5 tracking-wide">Updating setup records...</p>
                    </div>
                )}

                {/* STEP 1: IDENTITY */}
                {onboardingStep === 1 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="branchName" className={labelClass}>Branch Name <span className="text-zinc-300 dark:text-zinc-700">•</span></label>
                                <input
                                    type="text"
                                    id="branchName"
                                    name="branchName"
                                    value={localForm.branchName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Nairobi Central Hub"
                                    disabled={isLoading}
                                    className={`${baseInputClass} ${standardPadding} ${errors.branchName ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                />
                                {errors.branchName && <p className={errorTextClass}>{errors.branchName}</p>}
                            </div>

                            <div>
                                <label htmlFor="branchCategory" className={labelClass}>Category <span className="text-zinc-300 dark:text-zinc-700">•</span></label>
                                <div className="relative">
                                    <select
                                        id="branchCategory"
                                        name="branchCategory"
                                        value={localForm.branchCategory}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className={`${baseInputClass} ${standardPadding} appearance-none pr-8 cursor-pointer ${errors.branchCategory ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                    >
                                        <option value="">Select operational role</option>
                                        {BRANCH_CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3 pointer-events-none stroke-[1.5]" />
                                </div>
                                {errors.branchCategory && <p className={errorTextClass}>{errors.branchCategory}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="branchDescription" className={labelClass}>Description</label>
                            <textarea
                                id="branchDescription"
                                name="branchDescription"
                                value={localForm.branchDescription}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Describe the operational core or delivery range of this station..."
                                disabled={isLoading}
                                className={`${baseInputClass} ${standardPadding} resize-none`}
                            />
                        </div>

                        {/* Minimal Checklist Controls */}
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex items-start gap-3 cursor-pointer select-none group">
                                <input 
                                    type="checkbox" 
                                    id="isPrimary"
                                    name="isPrimary" 
                                    checked={localForm.isPrimary} 
                                    onChange={handleInputChange} 
                                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-800 focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer" 
                                />
                                <div className="-mt-0.5">
                                    <span className="text-xs font-normal text-zinc-700 dark:text-zinc-300 block">Main Corporate Hub</span>
                                    <span className="text-[11px] text-zinc-400 block font-normal">Set this location as your default primary storefront.</span>
                                </div>
                            </label>

                            <div className="space-y-2.5 sm:pl-4 sm:border-l border-zinc-100 dark:border-zinc-900">
                                <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-zinc-600 dark:text-zinc-400">
                                    <input type="checkbox" name="isOnline" checked={localForm.isOnline} onChange={handleInputChange} className="h-3.5 w-3.5 rounded border-zinc-300 text-zinc-800 focus:ring-0" />
                                    <span>Visible to online storefront searches</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-zinc-600 dark:text-zinc-400">
                                    <input type="checkbox" name="isStocked" checked={localForm.isStocked} onChange={handleInputChange} className="h-3.5 w-3.5 rounded border-zinc-300 text-zinc-800 focus:ring-0" />
                                    <span>Track physical inventory configurations</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-zinc-600 dark:text-zinc-400">
                                    <input type="checkbox" name="isAcceptingOrders" checked={localForm.isAcceptingOrders} onChange={handleInputChange} className="h-3.5 w-3.5 rounded border-zinc-300 text-zinc-800 focus:ring-0" />
                                    <span>Authorize instant order placement routes</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: LOGISTICS & LOCATION */}
                {onboardingStep === 2 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={localForm.country}
                                    disabled
                                    className={`${baseInputClass} ${standardPadding} bg-zinc-50 dark:bg-zinc-900/40 border-zinc-100 dark:border-zinc-900 text-zinc-400`}
                                />
                            </div>

                            <div>
                                <label htmlFor="county" className={labelClass}>County <span className="text-zinc-300 dark:text-zinc-700">•</span></label>
                                <div className="relative">
                                    <select
                                        id="county"
                                        name="county"
                                        value={localForm.county}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className={`${baseInputClass} ${standardPadding} appearance-none pr-8 ${errors.county ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                    >
                                        <option value="">Select County</option>
                                        {LOCATIONS.map((loc) => (
                                            <option key={loc.id} value={loc.county}>{loc.county}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3 pointer-events-none stroke-[1.5]" />
                                </div>
                                {errors.county && <p className={errorTextClass}>{errors.county}</p>}
                            </div>

                            <div>
                                <label htmlFor="subCounty" className={labelClass}>Sub-County <span className="text-zinc-300 dark:text-zinc-700">•</span></label>
                                <div className="relative">
                                    <select
                                        id="subCounty"
                                        name="subCounty"
                                        value={localForm.subCounty}
                                        disabled={!localForm.county || isLoading}
                                        onChange={handleInputChange}
                                        className={`${baseInputClass} ${standardPadding} appearance-none pr-8 ${errors.subCounty ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                    >
                                        <option value="">{localForm.county ? "Select Sub-County" : "Await County Selection"}</option>
                                        {availableSubCounties.map((sub) => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3 pointer-events-none stroke-[1.5]" />
                                </div>
                                {errors.subCounty && <p className={errorTextClass}>{errors.subCounty}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="physicalAddress" className={labelClass}>Street Address <span className="text-zinc-300 dark:text-zinc-700">•</span></label>
                                <input
                                    type="text"
                                    id="physicalAddress"
                                    name="physicalAddress"
                                    value={localForm.physicalAddress}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Along Thika Road, Exit 13"
                                    disabled={isLoading}
                                    className={`${baseInputClass} ${standardPadding} ${errors.physicalAddress ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                />
                                {errors.physicalAddress && <p className={errorTextClass}>{errors.physicalAddress}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="buildingName" className={labelClass}>Building / Suite <span className="text-zinc-300 dark:text-zinc-700">•</span></label>
                                <input
                                    type="text"
                                    id="buildingName"
                                    name="buildingName"
                                    value={localForm.buildingName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Spur Mall, 1st Floor"
                                    disabled={isLoading}
                                    className={`${baseInputClass} ${standardPadding} ${errors.buildingName ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                />
                                {errors.buildingName && <p className={errorTextClass}>{errors.buildingName}</p>}
                            </div>
                        </div>

                        {/* Compact Coordinates Toggle Area */}
                        <div className="pt-2">
                            <button 
                                type="button" 
                                onClick={() => setAddGeoCoordinates(!addGeoCoordinates)}
                                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                            >
                                <Map className="w-3.5 h-3.5 stroke-[1.5]" />
                                <span className="underline underline-offset-4 decoration-zinc-200">
                                    {addGeoCoordinates ? "Hide precise geo-coordinates" : "Provide routing coordinates (latitude/longitude)"}
                                </span>
                            </button>
                        </div>

                        {addGeoCoordinates && (
                            <div className="p-4 rounded-lg border border-zinc-100 dark:border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slideDown">
                                <div>
                                    <label htmlFor="latitude" className={labelClass}>Latitude</label>
                                    <input
                                        type="text"
                                        id="latitude"
                                        name="latitude"
                                        value={localForm.latitude}
                                        onChange={handleInputChange}
                                        placeholder="-1.101234"
                                        disabled={isLoading}
                                        className={`${baseInputClass} ${standardPadding} ${errors.latitude ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                    />
                                    {errors.latitude && <p className={errorTextClass}>{errors.latitude}</p>}
                                </div>
                                <div>
                                    <label htmlFor="longitude" className={labelClass}>Longitude</label>
                                    <input
                                        type="text"
                                        id="longitude"
                                        name="longitude"
                                        value={localForm.longitude}
                                        onChange={handleInputChange}
                                        placeholder="37.012345"
                                        disabled={isLoading}
                                        className={`${baseInputClass} ${standardPadding} ${errors.longitude ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                    />
                                    {errors.longitude && <p className={errorTextClass}>{errors.longitude}</p>}
                                </div>
                            </div>
                        )}

                        {/* Operating Hours Grid Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-5">
                            <div>
                                <label htmlFor="opens" className={labelClass}>Opening Time</label>
                                <input
                                    type="time"
                                    id="opens"
                                    name="opens"
                                    value={localForm.opens}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className={`${baseInputClass} ${standardPadding}`}
                                />
                            </div>
                            <div>
                                <label htmlFor="closes" className={labelClass}>Closing Time</label>
                                <input
                                    type="time"
                                    id="closes"
                                    name="closes"
                                    value={localForm.closes}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className={`${baseInputClass} ${standardPadding}`}
                                />
                            </div>
                            <div>
                                <label htmlFor="operatingHours" className={labelClass}>Overview Summary</label>
                                <div className="relative">
                                    <Clock className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3 pointer-events-none stroke-[1.5]" />
                                    <input
                                        type="text"
                                        id="operatingHours"
                                        name="operatingHours"
                                        value={localForm.operatingHours}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Mon-Sat: 8AM-6PM"
                                        disabled={isLoading}
                                        className={`${baseInputClass} ${iconPadding}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: PERSONNEL PERSONNEL ASSIGNMENT */}
                {onboardingStep === 3 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div className="flex gap-2.5 items-start text-zinc-500 dark:text-zinc-400 pb-2">
                            <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5 stroke-[1.5]" />
                            <p className="text-xs font-normal leading-relaxed">
                                Personnel parameters below establish operational ownership for real-time order dispatch notifications.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="managerName" className={labelClass}>Manager Full Name <span className="text-zinc-300 dark:text-zinc-700">•</span></label>
                                <input
                                    type="text"
                                    id="managerName"
                                    name="managerName"
                                    value={localForm.managerName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Jane Doe"
                                    disabled={isLoading}
                                    className={`${baseInputClass} ${standardPadding} ${errors.managerName ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                />
                                {errors.managerName && <p className={errorTextClass}>{errors.managerName}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="managerPhone" className={labelClass}>Mobile Contact <span className="text-zinc-300 dark:text-zinc-700">•</span></label>
                                    <div className="relative">
                                        <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3 pointer-events-none stroke-[1.5]" />
                                        <input
                                            type="tel"
                                            id="managerPhone"
                                            name="managerPhone"
                                            value={localForm.managerPhone}
                                            onChange={handleInputChange}
                                            placeholder="e.g., +254 712 345 678"
                                            disabled={isLoading}
                                            className={`${baseInputClass} ${iconPadding} ${errors.managerPhone ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                        />
                                    </div>
                                    {errors.managerPhone && <p className={errorTextClass}>{errors.managerPhone}</p>}
                                </div>
                                
                                <div>
                                    <label htmlFor="managerEmail" className={labelClass}>Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3 pointer-events-none stroke-[1.5]" />
                                        <input
                                            type="email"
                                            id="managerEmail"
                                            name="managerEmail"
                                            value={localForm.managerEmail}
                                            onChange={handleInputChange}
                                            placeholder="e.g., jane.doe@merchant.com"
                                            disabled={isLoading}
                                            className={`${baseInputClass} ${iconPadding} ${errors.managerEmail ? 'border-red-300 dark:border-red-900 focus:border-red-400' : ''}`}
                                        />
                                    </div>
                                    {errors.managerEmail && <p className={errorTextClass}>{errors.managerEmail}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Navigation Controls */}
                <div className={`flex items-center justify-between pt-5 mt-4 border-t border-zinc-100 dark:border-zinc-900   `}>
                    <button
                        type="button"
                        onClick={onboardingStep === 1 ? onCancel : onboardingHandlePrev}
                        disabled={isLoading}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-normal text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors disabled:opacity-40  ${onboardingStep === 1 ? "bg-red-600 rounded-2xl p-3 dark:text-[aliceblue]":'' } `}
                    >
                        {onboardingStep > 1 && <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />}
                        {onboardingStep === 1 ? "Quit the  Process" : "Back"}
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-normal text-white bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-white rounded-lg transition-all shadow-sm disabled:opacity-40"
                    >
                        {onboardingStep < 3 ? (
                            <>
                                Continue
                                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                            </>
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5 stroke-[1.5]" />
                                Complete Registration
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
