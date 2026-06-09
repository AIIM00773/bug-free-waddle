import { useState, useEffect } from 'react';
import {
    User,
    FileText,
    ShoppingBag,
    Bell,
    CreditCard,
    ShieldCheck,
    LogOut,
    ShoppingCart,
    SquarePen,
    MapPin,
    Menu,
    X,
    ChevronRight,
    Edit3,
    SearchCode,
    Zap,
    Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SokoLogo from './Constants/Logo';
import { useAuth } from './Providers/AuthContex';
import ShoppingCartView from './Components/ProfileComponents/Cart';
import OrderPipelinesView from './Components/ProfileComponents/Orders';
import ReviewsSubmissionsView from './Components/ProfileComponents/Reviews';
import PersonalizedAlertsView from './Components/ProfileComponents/Alert';
import PaymentMethodsView from './Components/ProfileComponents/PaymentMethords';
import ShippingAddressesView from './Components/ProfileComponents/Addresses';
import SettingsPreferencesView from './Components/ProfileComponents/SettingsPreferencesView';

type ActiveTab = 'profile' | 'cart' | 'orders' | 'reviews' | 'offers' | 'wallet' | 'addresses' | 'security';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [cartCount] = useState(0);
    const { user } = useAuth(); 

    const [profileNotEditable, setProfileNotEditable] = useState<boolean>(true);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    // Readjusted form state to sync directly with your context user payload
    const [profileForm, setProfileForm] = useState({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        nickname: user?.last_name || '',
        dob: user?.dob || '',
        gender: user?.gender || '',
        country: user?.country || 'Kenya',
        phone: user?.phone || '',
        email: user?.email || '',
        eligible: user?.search_allowance?.eligible !== undefined ? user.search_allowance.eligible : true,
        is_on_free_tier: user?.search_allowance?.is_on_free_tier !== undefined ? user.search_allowance.is_on_free_tier : true,
        free_tier_search_limit: user?.search_allowance?.free_tier_search_limit || 20,
        current_tier_use: user?.search_allowance?.current_tier_use || 0
    });

    // Keep form state in sync if context updates asynchronously
    useEffect(() => {
        if (user) {
            setProfileForm({
                firstName: user?.first_name || '',
                lastName: user?.last_name || '',
                nickname: user?.last_name || '',
                dob: user?.dob || '',
                gender: user?.gender || '',
                country: user?.country || 'Kenya',
                phone: user?.phone || '',
                email: user?.email || '',
                eligible: user?.search_allowance?.eligible !== undefined ? user.search_allowance.eligible : true,
                is_on_free_tier: user?.search_allowance?.is_on_free_tier !== undefined ? user.search_allowance.is_on_free_tier : true,
                free_tier_search_limit: user?.search_allowance?.free_tier_search_limit || 20,
                current_tier_use: user?.search_allowance?.current_tier_use || 0
            });
        }
    }, [user]);

    // Dynamic calculation metric instead of a static number fallback
    const usagePercentage = profileForm.free_tier_search_limit > 0 
        ? Math.min((profileForm.current_tier_use / profileForm.free_tier_search_limit) * 100, 100)
        : 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
    };

    const navItems = [
        { id: 'profile', label: 'Personal Details', icon: User, category: 'Account' },
        { id: 'cart', label: 'My Shopping Cart', icon: ShoppingCart, category: 'Account', badge: cartCount },
        { id: 'orders', label: 'My Order Pipelines', icon: FileText, category: 'Account' },
        { id: 'reviews', label: 'My Reviews', icon: SquarePen, category: 'Account' },
        { id: 'offers', label: 'Personalised Alerts', icon: Bell, category: 'Preferences' },
        { id: 'wallet', label: 'Payment Routes', icon: CreditCard, category: 'Preferences' },
        { id: 'addresses', label: 'Shipping Addresses', icon: MapPin, category: 'Preferences' },
        { id: 'security', label: 'Security Keys', icon: ShieldCheck, category: 'Preferences' },
    ] as const;

    const currentTabLabel = navItems.find(item => item.id === activeTab)?.label || 'Dashboard';

    return (
        <div className="min-h-screen w-full bg-slate-50/50 text-slate-800 font-sans antialiased">

            {/* 1. GLOBAL NAVIGATION HEADER */}
            <header className="h-20 bg-white border-b border-slate-100 flex items-center px-4 sm:px-6 lg:px-12 sticky top-0 z-40 select-none">
                <div className="w-full flex items-center justify-between gap-4">
                    <div className="flex items-center gap-10 shrink-0">
                        <button
                            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            aria-label="Toggle Navigation Side-panel"
                        >
                            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                        <Link to="/" className="text-xl font-black tracking-wider text-slate-900 uppercase">
                            <SokoLogo />
                        </Link>

                        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-500">
                            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <button
                            onClick={() => setActiveTab('cart')}
                            className={`relative p-2.5 rounded-full transition-colors ${activeTab === 'cart' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                        >
                            <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
                            {cartCount > 0 && (
                                <span className={`absolute top-1.5 right-1.5 font-mono text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center transition-colors ${activeTab === 'cart' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

                        {user?.is_merchant === false && (
                            <button className="hidden sm:inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors">
                                Start Selling
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* CURRENT ACTIVE TAB BAR DISPLAY FOR MOBILE ONLY */}
            <div className="md:hidden bg-white border-b border-slate-200/60 px-4 py-3 flex items-center justify-between shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Workspace View</span>
                <button
                    onClick={() => setIsMobileNavOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-slate-100 px-3 py-1.5 rounded-lg"
                >
                    <span>{currentTabLabel}</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                </button>
            </div>

            {/* 2. LAYOUT BODY CONTAINER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-10 grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 items-start">

                {/* DESKTOP + MOBILE SLIDE-OVER SIDEBAR CONTAINER */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 p-5 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-0 md:w-auto md:bg-transparent md:border-none md:p-0
                    ${isMobileNavOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
                    md:sticky md:top-28
                `}>
                    <div className="flex items-center justify-between mb-6 md:hidden">
                        <span className="text-sm font-black tracking-wider text-slate-900 uppercase"><SokoLogo /></span>
                        <button
                            onClick={() => setIsMobileNavOpen(false)}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <X className="h-5 w-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="bg-white md:border md:border-slate-200/60 p-3 md:rounded-2xl space-y-1 md:shadow-2xs">
                        <div className="px-3 py-2 mb-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Account</p>
                        </div>

                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const isSelected = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMobileNavOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all text-left ${isSelected
                                        ? 'bg-slate-950 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <IconComponent className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{item.label}</span>
                                    </div>
                                </button>
                            );
                        })}

                        <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
                            <button className="w-full flex items-center gap-3 px-3.5 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50/40 rounded-xl text-sm font-semibold transition-all text-left group">
                                <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                                <span>Sign Out Session</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {isMobileNavOpen && (
                    <div
                        onClick={() => setIsMobileNavOpen(false)}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 md:hidden"
                    />
                )}

                {/* WORKSPACE AREA */}
                <main className="md:col-span-3 bg-white border border-slate-200/60 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-2xs min-h-[520px]">

                    {/* TAB VALUE 1: PERSONAL PROFILE */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">Personal Data Settings</h2>
                                <p className="text-xs text-slate-400 mt-1">Configure structural identity credentials for checkout generation vectors.</p>
                            </div>

                            {/* Avatar File Workspace */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/40">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-14 w-14 flex items-center justify-center rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                        <span className='font-extrabold text-2xl text-blue-600'>
                                            {profileForm.firstName ? profileForm.firstName.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                            {user?.is_merchant ? "Merchant Account" : "Standard Account"}
                                        </p>
                                        <h3 className="text-sm font-bold text-slate-900">{profileForm.firstName} {profileForm.lastName}</h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setProfileNotEditable(!profileNotEditable)}
                                    className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-center ${!profileNotEditable
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    <Edit3 size={14} />
                                    {profileNotEditable ? "Edit Profile" : "Lock Fields"}
                                </button>
                            </div>

                            {/* --- REMAPPED SEARCH METRICS ALIGNMENT MODULE --- */}
                            <div className="border border-slate-100 rounded-2xl p-5 bg-white space-y-4 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
                                            <SearchCode size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">Search Allocation Monitor</h3>
                                            <p className="text-[11px] text-slate-400">Tracks operations remaining in your structural quota loop.</p>
                                        </div>
                                    </div>
                                    
                                    {/* Dynamic Subscription Tier Badge */}
                                    {profileForm.is_on_free_tier ? (
                                        <span className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            Free Tier Account
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-100">
                                            <Zap size={10} className="fill-amber-600 text-amber-600" /> Premium Pro
                                        </span>
                                    )}
                                </div>

                                {/* Quota Status Bar indicator layout */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="text-slate-500">Usage Limit Counter</span>
                                        <span className="font-mono text-slate-900">
                                            {profileForm.is_on_free_tier 
                                                ? `${profileForm.current_tier_use} / ${profileForm.free_tier_search_limit} Queries`
                                                : `${profileForm.current_tier_use} / Unlimited (∞)`
                                            }
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            style={{ width: `${profileForm.is_on_free_tier ? usagePercentage : 100}%` }}
                                            className={`h-full transition-all duration-500 ${
                                                !profileForm.eligible ? 'bg-rose-500' : usagePercentage > 80 ? 'bg-amber-500' : 'bg-blue-600'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Warning Notice UI */}
                                {!profileForm.eligible && (
                                    <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-800">
                                        <Lock size={16} className="shrink-0 mt-0.5 text-rose-600" />
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold">Search Loop Restrictions Active</p>
                                            <p className="text-[11px] text-rose-600 font-medium">Your account has exhausted its complimentary monthly tokens. Upgrade to Premium Pro to remove compute boundaries.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Layer Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={profileForm.firstName}
                                        onChange={handleInputChange}
                                        disabled={profileNotEditable}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm text-slate-800 disabled:text-blue-600/80 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={profileForm.lastName}
                                        onChange={handleInputChange}
                                        disabled={profileNotEditable}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm text-slate-800 disabled:text-blue-600/80 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileForm.email}
                                        onChange={handleInputChange}
                                        disabled={profileNotEditable}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm text-slate-800 disabled:text-blue-600/80 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Mobile Phone Line</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={profileForm.phone}
                                        onChange={handleInputChange}
                                        disabled={profileNotEditable}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm text-slate-800 disabled:text-blue-600/80 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={profileForm.dob}
                                        onChange={handleInputChange}
                                        disabled={profileNotEditable}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm text-slate-800 disabled:text-blue-600/80 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Country Node Location</label>
                                    <select
                                        name="country"
                                        value={profileForm.country}
                                        onChange={handleInputChange}
                                        disabled={profileNotEditable}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm text-slate-800 disabled:text-blue-600/80 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
                                    >
                                        <option value="Kenya">Kenya</option>
                                        <option value="Uganda">Uganda</option>
                                        <option value="Tanzania">Tanzania</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB VALUE 2: INDEPENDENT CART COMPONENT */}
                    {activeTab === 'cart' && <ShoppingCartView />}

                    {/* TAB VALUE 3: ORDERS */}
                    {activeTab === 'orders' && <OrderPipelinesView />}

                    {/* TAB VALUE 4: REVIEWS */}
                    {activeTab === 'reviews' && <ReviewsSubmissionsView />}

                    {/* TAB VALUE 5: ALERTS */}
                    {activeTab === 'offers' && <PersonalizedAlertsView />}

                    {/* TAB VALUE 6: WALLET */}
                    {activeTab === 'wallet' && <PaymentMethodsView />}

                    {/* TAB VALUE 7: SHIPPING ADDRESSES */}
                    {activeTab === 'addresses' && <ShippingAddressesView />}

                    {/* TAB VALUE 8: SECURITY */}
                    {activeTab === 'security' && <SettingsPreferencesView />}

                </main>
            </div>
        </div>
    );
}