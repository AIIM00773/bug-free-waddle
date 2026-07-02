import React, { useState } from "react";
import { useAuth } from "../../Providers/AuthProvider";
import type { ShopCategory, PayoutMethod } from "../../Providers/AuthProvider";
import { Store, ArrowRight, ArrowLeft, AlertCircle, ShieldCheck, TrendingUp, Zap } from "lucide-react";


const SHOP_CATEGORIES: string[] = [
    "General Merchandise",   // Catch-all for multi-niche stores
    "Electronics",          // Covers everything from phones to industrial gear
    "Fashion & Apparel",    // Clothing, shoes, accessories
    "Home & Living",        // Furniture, kitchen, decor, garden
    "Health & Beauty",      // Personal care, supplements, cosmetics
    "Food & Grocery",       // Produce, pantry, beverages
    "Sports & Hobbies",     // Equipment, toys, instruments, collectibles
    "Automotive",           // Parts, tools, maintenance
    "Business & Services",  // Digital products, consulting, professional services
];

const PAYOUT_METHODS: { id: PayoutMethod; title: string; description: string; icon: string }[] = [
    {
        id: "M-Pesa Send Money",
        title: "M-Pesa",
        description: "Receive directly to your phone",
        icon: "📱"
    },
    {
        id: "M-pesa Paybill",
        title: "Paybill",
        description: "Business paybill settlement",
        icon: "🏦"
    },
    {
        id: "M-pesa Till",
        title: "Till Number",
        description: "Receive via Buy Goods",
        icon: "🛒"
    },
    {
        id: "Bank Transfer",
        title: "Bank",
        description: "Direct bank settlement",
        icon: "🏛️"
    }
];




export default function MerchantOnboarding() {
    const { user, merchantOnboarding, isLoading, authError, clearAuthError } = useAuth();


    const [currentStep, setCurrentStep] = useState(1);
    const [localError, setLocalError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        shopName: "",
        shopDescription: "",
        accountEmail: user?.email || "",
        support_phone: user?.phone || "",
        shopCategory: "GeneralShop" as ShopCategory,

        // Legal (Matching backend interface)
        bussinessRegisted: false,
        taxPin: "",
        businessRegistrationNumber: "",
        businessDocument: null as File | null,

        // Finance
        payoutMethod: "M-Pesa" as PayoutMethod,
        accountPhone: user?.phone || "",
        bankName: "",
        bankAccountNumber: "",
        payBillNumber: "",
        accountNumber: ""
    });



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        if (localError) setLocalError(null); if (authError) clearAuthError();
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) { setLocalError("Only PDF, JPG or PNG documents are allowed."); return; }
        if (file.size > 5 * 1024 * 1024) { setLocalError("Document size must be below 5MB."); return; }
        setFormData(prev => ({ ...prev, businessDocument: file }));
        setLocalError(null);
    };



    // Tighter validation logic 
    const getStepError = (): string | null => {
        if (currentStep === 1) {
            if (!formData.shopName.trim()) return "Shop name is required."; const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.accountEmail)) return "Please enter a valid business email.";
            if (formData.support_phone.replace(/\D/g, '').length < 9) { return "Please enter a valid support phone number."; }
        }

        if (currentStep === 2 && formData.bussinessRegisted) {
            if (!formData.taxPin.trim()) return "KRA Tax PIN is required for registered businesses.";
            if (!formData.businessRegistrationNumber.trim()) return "Business Registration Number is required.";
            if (!formData.businessDocument) return "Business verification document is required.";
        }


        if (currentStep === 3) {
            switch (formData.payoutMethod) {
                case "M-Pesa Send Money":
                    if (!formData.accountPhone.trim()) { return "M-Pesa phone number is required."; } break;
                case "M-pesa Paybill":
                    if (!formData.payBillNumber.trim()) { return "Paybill number is required."; }
                    if (!formData.accountNumber.trim()) { return "Paybill account number is required."; }
                    break;
                case "M-pesa Till": if (!formData.accountNumber.trim()) { return "Till number is required."; } break;
                case "Bank Transfer":
                    if (!formData.bankName.trim()) { return "Bank name is required."; }
                    if (!formData.bankAccountNumber.trim()) { return "Bank account number is required."; }
                    break;
            }
        }
        return null;

    };


    const handleNext = () => {
        const error = getStepError();
        if (error) { setLocalError(error); return; }
        setLocalError(null);
        setCurrentStep(prev => prev + 1);
    };

    const handlePrev = () => { setLocalError(null); setCurrentStep(prev => prev - 1); };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = getStepError();

        if (error) { setLocalError(error); return; }
        if (isLoading) return;

        try {
            await merchantOnboarding(formData);
        } catch (error: any) {
            setLocalError(error.message || "Failed to complete onboarding. Please try again.");
        }
    };

    const activeError = localError || authError;

    return (
        <div className="min-h-screen bg-white flex font-sans selection:bg-emerald-500/20">

            {/* LEFT PANEL */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">


                {/* Background decorative elements */}
                <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 font-black text-2xl tracking-tight mb-16">
                        <Store className="h-8 w-8 text-emerald-500" />
                        SokoAI <span className="text-emerald-500 font-light">Sellers</span>
                    </div>

                    <h1 className="text-4xl xl:text-4xl font-bold leading-tight mb-6">
                        Scale your business across Kenya.
                    </h1>
                    <p className="text-slate-300 text-md max-w-md mb-12 leading-relaxed">
                        Join thousands of merchants managing their inventory, tracking sales, and receiving instant settlements all in one powerful dashboard.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                <Zap className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Instant Settlements</h3>
                                <p className="text-slate-400 text-xs">Direct to your M-Pesa or Bank account.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                <TrendingUp className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Smart Analytics</h3>
                                <p className="text-slate-400 text-xs">AI-driven insights to boost your sales.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                <ShieldCheck className="h-6 w-6 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Verified Trust</h3>
                                <p className="text-slate-400 text-xs">Stand out with official merchant badges.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* RIGHT PANEL - The Form */}
            <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col relative overflow-y-auto bg-slate-50">

                {/* Mobile Header (Hidden on Desktop) */}
                <div className="lg:hidden flex items-center p-6 bg-white border-b border-slate-200 sticky top-0 z-20">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tight text-slate-900">
                        <Store className="h-6 w-6 text-emerald-600" />
                        SokoAI <span className="text-emerald-600 font-light">Sellers</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
                    <div className="w-full max-w-md mx-auto">

                        {/* Progress Indicator */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Step {currentStep} of 3</p>
                                <p className="text-sm font-medium text-emerald-600">
                                    {currentStep === 1 && "Store Profile"}
                                    {currentStep === 2 && "Verification"}
                                    {currentStep === 3 && "Payout Setup"}
                                </p>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                                <div className={`h-full bg-emerald-500 rounded-full transition-all duration-500 flex-1 ${currentStep >= 1 ? 'opacity-100' : 'opacity-0'}`} />
                                <div className={`h-full bg-emerald-500 rounded-full transition-all duration-500 flex-1 ${currentStep >= 2 ? 'opacity-100' : 'opacity-20 bg-slate-300'}`} />
                                <div className={`h-full bg-emerald-500 rounded-full transition-all duration-500 flex-1 ${currentStep >= 3 ? 'opacity-100' : 'opacity-20 bg-slate-300'}`} />
                            </div>
                        </div>

                        {/* Form Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                {currentStep === 1 && "Set up your storefront"}
                                {currentStep === 2 && "Business identity"}
                                {currentStep === 3 && "How should we pay you?"}
                            </h2>
                            <p className="text-slate-500">
                                {currentStep === 1 && "Let buyers know who you are and what you sell."}
                                {currentStep === 2 && "Verified businesses get priority ranking in search results."}
                                {currentStep === 3 && "Link your preferred account for automated settlements."}
                            </p>
                        </div>

                        {activeError && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium rounded-xl flex gap-3 items-start shadow-sm">
                                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                                <span>{activeError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* STEP 1: STORE PROFILE */}
                            {currentStep === 1 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Store Name</label>
                                        <input
                                            name="shopName"
                                            type="text"
                                            placeholder="e.g., ElectroHub Nairobi"
                                            value={formData.shopName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Primary Category</label>
                                        <select
                                            name="shopCategory"
                                            value={formData.shopCategory}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-red-300 shadow-sm cursor-pointer"
                                        >
                                            {SHOP_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Business Email</label>
                                            <input
                                                name="accountEmail"
                                                type="email"
                                                placeholder="sales@yourshop.com"
                                                value={formData.accountEmail}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Support Phone</label>
                                            <input
                                                name="support_phone"
                                                type="tel"
                                                placeholder="07XX XXX XXX"
                                                value={formData.support_phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Store Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                                        <textarea
                                            name="shopDescription"
                                            rows={3}
                                            placeholder="What makes your inventory or service stand out?"
                                            value={formData.shopDescription}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none shadow-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: LEGAL & COMPLIANCE */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <label className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group">
                                        <div className="flex-shrink-0 mt-1">
                                            <input
                                                type="checkbox"
                                                name="bussinessRegisted"
                                                checked={formData.bussinessRegisted}
                                                onChange={handleChange}
                                                className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 accent-emerald-600"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-base">My business is legally registered</p>
                                            <p className="text-sm text-slate-500 mt-1">Check this if you have a KRA PIN and official registration documents. Verified accounts get higher visibility.</p>
                                        </div>
                                    </label>

                                    {formData.bussinessRegisted && (

                                        <div className="space-y-6 p-6 bg-slate-100/50 rounded-xl border border-slate-200">


                                            <div className="space-y-1.5">

                                                <label className="text-sm font-bold text-slate-700">
                                                    KRA Tax PIN
                                                </label>


                                                <input

                                                    name="taxPin"

                                                    type="text"

                                                    placeholder="e.g., P051..."

                                                    value={formData.taxPin}

                                                    onChange={handleChange}

                                                    className="
w-full
px-4
py-3
bg-white
border
border-slate-200
rounded-xl
focus:border-emerald-500
focus:ring-4
focus:ring-emerald-500/10
transition-all
uppercase
shadow-sm
"

                                                />

                                            </div>




                                            <div className="space-y-1.5">

                                                <label className="text-sm font-bold text-slate-700">
                                                    Business Registration Number
                                                </label>


                                                <input

                                                    name="businessRegistrationNumber"

                                                    type="text"

                                                    placeholder="e.g., BN/2024/..."

                                                    value={formData.businessRegistrationNumber}

                                                    onChange={handleChange}

                                                    className="
w-full
px-4
py-3
bg-white
border
border-slate-200
rounded-xl
focus:border-emerald-500
focus:ring-4
focus:ring-emerald-500/10
transition-all
shadow-sm
"

                                                />

                                            </div>




                                            {/* DOCUMENT UPLOAD */}

                                            <div className="space-y-2">


                                                <label className="text-sm font-bold text-slate-700">
                                                    Business Verification Document
                                                </label>


                                                <label
                                                    className="
flex
flex-col
items-center
justify-center
w-full
h-40
border-2
border-dashed
border-slate-300
rounded-xl
bg-white
cursor-pointer
hover:border-emerald-500
hover:bg-emerald-50/30
transition-all
"
                                                >


                                                    <div className="text-center">

                                                        <p className="text-sm font-semibold text-slate-700">

                                                            {
                                                                formData.businessDocument
                                                                    ?
                                                                    formData.businessDocument.name
                                                                    :
                                                                    "Upload Registration Certificate"
                                                            }

                                                        </p>


                                                        <p className="text-xs text-slate-400 mt-2">

                                                            PDF, JPG or PNG • Maximum 5MB

                                                        </p>


                                                    </div>


                                                    <input

                                                        type="file"

                                                        accept=".pdf,.jpg,.jpeg,.png"

                                                        onChange={handleFileChange}

                                                        className="hidden"

                                                    />


                                                </label>



                                            </div>


                                        </div>

                                    )}

                                </div>
                            )}




                            {/* STEP 3: FINANCIAL ROUTING */}


                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">


                                    {/* METHOD SELECTOR */}

                                    <div>

                                        <label className="text-sm font-bold text-slate-700">
                                            Select payout method
                                        </label>


                                        <div className="grid grid-cols-2 gap-4 mt-4">

                                            {
                                                PAYOUT_METHODS.map(method => (

                                                    <button
                                                        key={method.id}
                                                        type="button"

                                                        onClick={() => {

                                                            setFormData(prev => ({
                                                                ...prev,
                                                                payoutMethod: method.id
                                                            }));

                                                        }}

                                                        className={`
relative p-5 rounded-2xl border text-left transition-all

${formData.payoutMethod === method.id

                                                                ?
                                                                "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"

                                                                :

                                                                "bg-white border-slate-200 hover:border-slate-300"

                                                            }
`}
                                                    >


                                                        <div className="text-2xl mb-3">
                                                            {method.icon}
                                                        </div>


                                                        <p className="font-bold text-slate-900">
                                                            {method.title}
                                                        </p>


                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {method.description}
                                                        </p>


                                                    </button>

                                                ))

                                            }

                                        </div>

                                    </div>



                                    {/* DETAILS PANEL */}

                                    <div className="
bg-white
border
border-slate-200
rounded-2xl
p-6
shadow-sm
">


                                        {/* MPESA PHONE */}

                                        {formData.payoutMethod === "M-Pesa Send Money" && (

                                            <div>

                                                <label className="text-sm font-bold text-slate-700">
                                                    M-Pesa Phone Number
                                                </label>


                                                <input

                                                    name="accountPhone"

                                                    type="tel"

                                                    placeholder="07XX XXX XXX"

                                                    value={formData.accountPhone}

                                                    onChange={handleChange}

                                                    className="
mt-2
w-full
px-4
py-3
rounded-xl
border
border-slate-200
focus:ring-4
focus:ring-emerald-500/10
focus:border-emerald-500
"

                                                />

                                            </div>

                                        )}




                                        {/* PAYBILL */}

                                        {formData.payoutMethod === "M-pesa Paybill" && (

                                            <div className="space-y-5">


                                                <div>

                                                    <label className="text-sm font-bold">
                                                        Paybill Number
                                                    </label>


                                                    <input

                                                        name="payBillNumber"

                                                        type="text"

                                                        placeholder="e.g 247247"

                                                        value={formData.payBillNumber}

                                                        onChange={handleChange}

                                                        className="w-full mt-2 px-4 py-3 rounded-xl border"

                                                    />

                                                </div>



                                                <div>

                                                    <label className="text-sm font-bold">
                                                        Account Number
                                                    </label>


                                                    <input

                                                        name="accountNumber"

                                                        type="text"

                                                        placeholder="Business account"

                                                        value={formData.accountNumber}

                                                        onChange={handleChange}

                                                        className="w-full mt-2 px-4 py-3 rounded-xl border"

                                                    />

                                                </div>



                                            </div>

                                        )}





                                        {/* TILL */}

                                        {formData.payoutMethod === "M-pesa Till" && (

                                            <div>

                                                <label className="text-sm font-bold">
                                                    Till Number
                                                </label>


                                                <input

                                                    name="accountNumber"

                                                    type="text"

                                                    placeholder="Till number"

                                                    value={formData.accountNumber}

                                                    onChange={handleChange}

                                                    className="w-full mt-2 px-4 py-3 rounded-xl border"

                                                />


                                            </div>

                                        )}







                                        {/* BANK */}

                                        {formData.payoutMethod === "Bank Transfer" && (

                                            <div className="space-y-5">


                                                <div>

                                                    <label className="text-sm font-bold">
                                                        Bank Name
                                                    </label>


                                                    <input

                                                        name="bankName"

                                                        value={formData.bankName}

                                                        onChange={handleChange}

                                                        placeholder="KCB, Equity, Co-op..."

                                                        className="w-full mt-2 px-4 py-3 rounded-xl border"

                                                    />


                                                </div>



                                                <div>

                                                    <label className="text-sm font-bold">
                                                        Account Number
                                                    </label>


                                                    <input

                                                        name="bankAccountNumber"

                                                        value={formData.bankAccountNumber}

                                                        onChange={handleChange}

                                                        placeholder="Account number"

                                                        className="w-full mt-2 px-4 py-3 rounded-xl border"

                                                    />


                                                </div>


                                            </div>

                                        )}



                                    </div>


                                </div>
                            )}



                            {/* FOOTER ACTIONS - FIXED */}
                            <div className="pt-8 flex items-center justify-between">
                                {currentStep > 1 ? (
                                    <button
                                        type="button" // Force this to NOT submit the form
                                        onClick={handlePrev}
                                        className="px-5 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl flex items-center gap-2 transition-all shadow-sm"
                                    >
                                        <ArrowLeft className="h-4 w-4" /> Back
                                    </button>
                                ) : (
                                    <div />
                                )}

                                {currentStep !== 4 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl flex items-center gap-2"
                                    >
                                        {currentStep >= 3 ? "Submit" : " Next Step"} <ArrowRight className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl flex items-center gap-2"
                                    >
                                        Complete Setup
                                    </button>
                                )}
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}