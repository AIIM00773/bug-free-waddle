import React, { useState } from 'react';
import {
    Search,
    Plus,
    RefreshCw,
    Tag as TagIcon,
    SlidersHorizontal,
    Bookmark,
    GitCommit,
    FolderTree,
    X,
    AlertCircle,
    Trash2,
    Edit3,
    Layers,
    Coins,
    Globe2,
    Scale
} from 'lucide-react';
import type { Category, Brand, Size, Color, Weight, Tag, Shape, Country, Currency } from '../Providers.tsx/TaxonomyMatricesContext';
import { useTaxonomyMatrices } from '../Providers.tsx/TaxonomyMatricesContext';

type TabType = 'categories' | 'brands' | 'sizes' | 'colors' | 'weights' | 'tags' | 'shapes' | 'countries' | 'currency';

export default function TaxonomyMatricesView() {
    const {
        categories = [], brands = [], sizes = [], colors = [], weights = [],
        tags = [], shapes = [], countries = [], currencies = [],
        isLoading = false, error = null, refreshTaxonomies,
        addCategory, updateCategory, removeCategory,
        addBrand, updateBrand, removeBrand,
        addSize, updateSize, removeSize,
        addColor, updateColor, removeColor,
        addWeight, updateWeight, removeWeight,
        addTag, updateTag, removeTag,
        addShape, updateShape, removeShape,
        addCountry, updateCountry, removeCountry,
        addCurrency, updateCurrency, removeCurrency,
    } = useTaxonomyMatrices();

    // Core Layout States
    const [activeTab, setActiveTab] = useState<TabType>('categories');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

    // Form States
    const initialCategoryState = { name: '', description: '' };
    const [catForm, setCatForm] = useState(initialCategoryState);

    const initialBrandState = { name: '', description: '', categories: '', related_brands: '' };
    const [brandForm, setBrandForm] = useState(initialBrandState);

    const initialSizeState = { name: '', unit_symbol: '' };
    const [sizeForm, setSizeForm] = useState(initialSizeState);

    const initialColorState = { name: '', identity_definition: '', hex_code: '#000000' };
    const [colorForm, setColorForm] = useState(initialColorState);

    const initialWeightState = { unit_name: '', symbol: '' };
    const [weightForm, setWeightForm] = useState(initialWeightState);

    const initialTagState = { name: '' };
    const [tagForm, setTagForm] = useState(initialTagState);

    const initialShapeState = { name: '' };
    const [shapeForm, setShapeForm] = useState(initialShapeState);

    const initialCountryState = { name: '', zip_code: '', is_setup_for_operation: true };
    const [countryForm, setCountryForm] = useState(initialCountryState);

    const initialCurrencyState = { name: '', symbol: '', code: '', country: '', is_allowed: true, is_base_currency: false };
    const [currencyForm, setCurrencyForm] = useState(initialCurrencyState);

    // --- DRAWER CONTROLS ---
    const closeAndResetDrawer = () => {
        setIsDrawerOpen(false);
        setEditingNodeId(null);
        setCatForm(initialCategoryState);
        setBrandForm(initialBrandState);
        setSizeForm(initialSizeState);
        setColorForm(initialColorState);
        setWeightForm(initialWeightState);
        setTagForm(initialTagState);
        setShapeForm(initialShapeState);
        setCountryForm(initialCountryState);
        setCurrencyForm(initialCurrencyState);
    };

    const openNewDrawer = () => {
        closeAndResetDrawer();
        setIsDrawerOpen(true);
    };

    // --- EDIT HANDLERS ---
    const handleEditCategory = (cat: Category) => {
        setEditingNodeId(cat.unique_id);
        setCatForm({ name: cat.name, description: cat.description || '' });
        setIsDrawerOpen(true);
    };

    const handleEditBrand = (brand: Brand) => {
        setEditingNodeId(brand.unique_id);
        setBrandForm({
            name: brand.name,
            description: brand.description || '',
            categories: brand.categories.join(', '),
            related_brands: brand.related_brands.join(', ')
        });
        setIsDrawerOpen(true);
    };

    const handleEditSize = (size: Size) => {
        setEditingNodeId(size.unique_id);
        setSizeForm({ name: size.name, unit_symbol: size.unit_symbol });
        setIsDrawerOpen(true);
    };

    const handleEditColor = (color: Color) => {
        setEditingNodeId(color.unique_id);
        setColorForm({ name: color.name, identity_definition: color.identity_definition || '', hex_code: color.hex_code || '#000000' });
        setIsDrawerOpen(true);
    };

    const handleEditWeight = (weight: Weight) => {
        setEditingNodeId(weight.unique_id);
        setWeightForm({ unit_name: weight.unit_name, symbol: weight.symbol });
        setIsDrawerOpen(true);
    };

    const handleEditTag = (tag: Tag) => {
        setEditingNodeId(tag.unique_id);
        setTagForm({ name: tag.name });
        setIsDrawerOpen(true);
    };

    const handleEditShape = (shape: Shape) => {
        setEditingNodeId(shape.unique_id);
        setShapeForm({ name: shape.name });
        setIsDrawerOpen(true);
    };

    const handleEditCountry = (country: Country) => {
        setEditingNodeId(country.unique_id);
        setCountryForm({ name: country.name, zip_code: country.zip_code || '', is_setup_for_operation: country.is_setup_for_operation });
        setIsDrawerOpen(true);
    };

    const handleEditCurrency = (currency: Currency) => {
        setEditingNodeId(currency.unique_id);
        setCurrencyForm({ name: currency.name, symbol: currency.symbol || '', code: currency.code, country: currency.country, is_allowed: currency.is_allowed, is_base_currency: currency.is_base_currency });
        setIsDrawerOpen(true);
    };

    // --- SUBMISSION HANDLER ---
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (activeTab === 'categories') {
                const payload: Category = {
                    unique_id: editingNodeId || `category-${Date.now()}`,
                    name: catForm.name,
                    description: catForm.description || null,
                    related_categories: []
                };
                editingNodeId ? await updateCategory(payload) : await addCategory(payload);

            } else if (activeTab === 'brands') {
                const payload: Brand = {
                    unique_id: editingNodeId || `brand-${Date.now()}`,
                    name: brandForm.name,
                    description: brandForm.description || null,
                    categories: brandForm.categories.split(',').map(s => s.trim()).filter(Boolean),
                    related_brands: brandForm.related_brands.split(',').map(s => s.trim()).filter(Boolean)
                };
                editingNodeId ? await updateBrand(payload) : await addBrand(payload);

            } else if (activeTab === 'sizes') {
                const payload: Size = {
                    unique_id: editingNodeId || `size-${Date.now()}`,
                    name: sizeForm.name,
                    unit_symbol: sizeForm.unit_symbol
                };
                editingNodeId ? await updateSize(payload) : await addSize(payload);

            } else if (activeTab === 'colors') {
                const payload: Color = {
                    unique_id: editingNodeId || `color-${Date.now()}`,
                    name: colorForm.name,
                    identity_definition: colorForm.identity_definition || null,
                    hex_code: colorForm.hex_code || null
                };
                editingNodeId ? await updateColor(payload) : await addColor(payload);

            } else if (activeTab === 'weights') {
                const payload: Weight = {
                    unique_id: editingNodeId || `weight-${Date.now()}`,
                    unit_name: weightForm.unit_name,
                    symbol: weightForm.symbol
                };
                editingNodeId ? await updateWeight(payload) : await addWeight(payload);

            } else if (activeTab === 'tags') {
                const payload: Tag = { unique_id: editingNodeId || `tag-${Date.now()}`, name: tagForm.name };
                editingNodeId ? await updateTag(payload) : await addTag(payload);

            } else if (activeTab === 'shapes') {
                const payload: Shape = { unique_id: editingNodeId || `shape-${Date.now()}`, name: shapeForm.name };
                editingNodeId ? await updateShape(payload) : await addShape(payload);

            } else if (activeTab === 'countries') {
                const payload: Country = {
                    unique_id: editingNodeId || `country-${Date.now()}`,
                    name: countryForm.name,
                    zip_code: countryForm.zip_code || null,
                    is_setup_for_operation: countryForm.is_setup_for_operation
                };
                editingNodeId ? await updateCountry(payload) : await addCountry(payload);

            } else if (activeTab === 'currency') {
                const payload: Currency = {
                    unique_id: editingNodeId || `currency-${Date.now()}`,
                    name: currencyForm.name,
                    symbol: currencyForm.symbol || null,
                    code: currencyForm.code,
                    country: currencyForm.country,
                    is_allowed: currencyForm.is_allowed,
                    is_base_currency: currencyForm.is_base_currency,
                };
                editingNodeId ? await updateCurrency(payload) : await addCurrency(payload);
            }

            closeAndResetDrawer();
        } catch (submissionError) {
            alert(`Failed to save taxonomy entity: ${submissionError}`);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn p-0.5 relative">
            {/* HEADER SECTION LAYOUT */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-0.5">
                    <h2 className="text-base font-black tracking-tight text-slate-900">Taxonomy Engine Matrices</h2>
                    <p className="text-xs text-slate-400 font-medium">
                        Manage categorical properties, brand alias matching loops, and variation components to enforce global marketplace data integrity.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => refreshTaxonomies()}
                        disabled={isLoading}
                        className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-40"
                        title="Force Global Sync"
                    >
                        <RefreshCw size={14} className={isLoading ? 'animate-spin text-emerald-600' : ''} />
                    </button>

                    <button
                        type="button"
                        onClick={openNewDrawer}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                        <Plus size={14} />  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-center gap-2 font-semibold">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* HORIZONTAL COMPREHENSIVE SUB-NAV MATRICES */}
            <div className="flex flex-col gap-4 bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-full">
                    {[
                        { id: 'categories', label: 'Categories', icon: FolderTree },
                        { id: 'brands', label: 'Brands', icon: TagIcon },
                        { id: 'sizes', label: 'Sizes', icon: Layers },
                        { id: 'colors', label: 'Colors', icon: SlidersHorizontal },
                        { id: 'weights', label: 'Weights', icon: Scale },
                        { id: 'tags', label: 'Tags', icon: Bookmark },
                        { id: 'shapes', label: 'Shapes', icon: GitCommit },
                        { id: 'currency', label: 'Currencies', icon: Coins },
                        { id: 'countries', label: 'Countries', icon: Globe2 }
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id as TabType); setSearchQuery(''); }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                <Icon size={12} /> {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* INPUT STACK CONTEXT FILTERS BAR */}
                <div className="relative w-full">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Filter through active ${activeTab} data scope...`}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* MATRIX RENDERING STRATEGIES LAYERS */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">

                {/* VIEW 1: REGIONAL CATEGORIES */}
                {activeTab === 'categories' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4">Unique ID</th>
                                    <th className="py-3 px-4">Category Name</th>
                                    <th className="py-3 px-4">Description</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((cat) => (
                                    <tr key={cat.unique_id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{cat.unique_id.slice(0,10)}...</td>
                                        <td className="py-3.5 px-4 text-slate-800 font-black">{cat.name}</td>
                                        <td className="py-3.5 px-4 text-slate-500">{cat.description || 'No description'}</td>
                                        <td className="py-3.5 px-4 text-right flex items-center justify-end gap-1">
                                            <button onClick={() => handleEditCategory(cat)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg"><Edit3 size={13} /></button>
                                            <button onClick={() => removeCategory(cat.unique_id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={13} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}


                {/* VIEW 2: BRAND ALIAS MAPPINGS */}
                {activeTab === 'brands' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4">Unique ID</th>
                                    <th className="py-3 px-4">Brand Name</th>
                                    <th className="py-3 px-4">Categories</th>
                                    <th className="py-3 px-4">Aliases</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {brands.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).map((brand) => (
                                    <tr key={brand.unique_id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{brand.unique_id.slice(0,10)}...</td>
                                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                                            <Bookmark size={12} className="text-blue-500 shrink-0" /> {brand.name}
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-500">{brand.categories.length > 0 ? brand.categories.join(', ') : 'None'}</td>
                                        <td className="py-3.5 px-4 text-slate-500">{brand.related_brands.length > 0 ? brand.related_brands.join(', ') : 'None'}</td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleEditBrand(brand)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg"><Edit3 size={13} /></button>
                                                <button onClick={() => removeBrand(brand.unique_id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={13} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}


                {/* VIEW 3: SIZE ATTRIBUTES */}
                {activeTab === 'sizes' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4">Unique ID</th>
                                    <th className="py-3 px-4">Size Name</th>
                                    <th className="py-3 px-4">Unit Symbol</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {sizes.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((size) => (
                                    <tr key={size.unique_id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{size.unique_id.slice(0,10)}...</td>
                                        <td className="py-3.5 px-4 font-black text-slate-800">{size.name}</td>
                                        <td className="py-3.5 px-4 text-slate-500">{size.unit_symbol}</td>
                                        <td className="py-3.5 px-4 text-right flex justify-end gap-1">
                                            <button onClick={() => handleEditSize(size)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg"><Edit3 size={13} /></button>
                                            <button onClick={() => removeSize(size.unique_id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={13} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* VIEW 4: COLOR MATRIX */}
                {activeTab === 'colors' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4">Unique ID</th>
                                    <th className="py-3 px-4">Color Name</th>
                                    <th className="py-3 px-4">Hex Code</th>
                                    <th className="py-3 px-4">Identity</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {colors.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((color) => (
                                    <tr key={color.unique_id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{color.unique_id.slice(0,10)}...</td>
                                        <td className="py-3.5 px-4 font-black text-slate-800">{color.name}</td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: color.hex_code || '#000' }} />
                                                <span className="text-slate-500 font-mono text-[11px]">{color.hex_code || 'none'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-500">{color.identity_definition || 'None'}</td>
                                        <td className="py-3.5 px-4 text-right flex justify-end gap-1">
                                            <button onClick={() => handleEditColor(color)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg"><Edit3 size={13} /></button>
                                            <button onClick={() => removeColor(color.unique_id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={13} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* VIEW 5: WEIGHT METRICS */}
                {activeTab === 'weights' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4">Unique ID</th>
                                    <th className="py-3 px-4">Weight Name</th>
                                    <th className="py-3 px-4">Symbol</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {weights.filter(w => w.unit_name.toLowerCase().includes(searchQuery.toLowerCase())).map((weight) => (
                                    <tr key={weight.unique_id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{weight.unique_id.slice(0,10)}...</td>
                                        <td className="py-3.5 px-4 font-black text-slate-800">{weight.unit_name}</td>
                                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{weight.symbol}</td>
                                        <td className="py-3.5 px-4 text-right flex justify-end gap-1">
                                            <button onClick={() => handleEditWeight(weight)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg"><Edit3 size={13} /></button>
                                            <button onClick={() => removeWeight(weight.unique_id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={13} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* VIEW 6: TAGS */}
                {activeTab === 'tags' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4">Unique ID</th>
                                    <th className="py-3 px-4">Tag Name</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {tags.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map((tag) => (
                                    <tr key={tag.unique_id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{tag.unique_id.slice(0,10)}...</td>
                                        <td className="py-3.5 px-4 font-bold text-slate-900">{tag.name}</td>
                                        <td className="py-3.5 px-4 text-right flex items-center justify-end gap-1">
                                            <button onClick={() => handleEditTag(tag)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg"><Edit3 size={13} /></button>
                                            <button onClick={() => removeTag(tag.unique_id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={13} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* VIEW 7: SHAPES */}
                {activeTab === 'shapes' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4">Unique ID</th>
                                    <th className="py-3 px-4">Shape Name</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {shapes.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((shape) => (
                                    <tr key={shape.unique_id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{shape.unique_id.slice(0,10)}...</td>
                                        <td className="py-3.5 px-4 font-bold text-slate-900">{shape.name}</td>
                                        <td className="py-3.5 px-4 text-right flex items-center justify-end gap-1">
                                            <button onClick={() => handleEditShape(shape)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg"><Edit3 size={13} /></button>
                                            <button onClick={() => removeShape(shape.unique_id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={13} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* VIEW 8: CURRENCY */}
                {activeTab === 'currency' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4">Unique ID</th>
                                    <th className="py-3 px-4">Country</th>
                                    <th className="py-3 px-4">Code</th>
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {currencies.filter(c => c?.name?.toLowerCase().includes(searchQuery?.toLocaleLowerCase())).map((curr) => (
                                    <tr key={curr.unique_id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{curr.unique_id.slice(0,10)}...</td>
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{curr.country}</td>
                                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{curr.code}</td>
                                        <td className="py-3.5 px-4 text-slate-600">{curr.name}</td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button disabled={true} onClick={() => {  handleEditCurrency(curr)}} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg"><Edit3 size={13} /></button>
                                            <button onClick={() => removeCurrency(curr.unique_id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={13} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* VIEW 9: COUNTRIES */}
                {activeTab === 'countries' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4">Unique ID</th>
                                    <th className="py-3 px-4">Country Name</th>
                                    <th className="py-3 px-4">ZIP Code</th>
                                    <th className="py-3 px-4">Operational</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {countries.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((country) => (
                                    <tr key={country.unique_id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{country.unique_id.slice(0,10)}...</td>
                                        <td className="py-3.5 px-4 text-slate-900 font-bold">{country.name}</td>
                                        <td className="py-3.5 px-4 text-slate-500 font-mono">{country.zip_code || 'None'}</td>
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${country.is_setup_for_operation ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {country.is_setup_for_operation ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button onClick={() => handleEditCountry(country)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg"><Edit3 size={13} /></button>
                                            <button onClick={() => removeCountry(country.unique_id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={13} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* COMPOSITION COMPOSER FORM PANEL DRAWER */}
            {isDrawerOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end animate-fadeIn" onClick={closeAndResetDrawer}>
                    <div
                        className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-slideLeft"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2 text-slate-900">
                                    <FolderTree size={16} className="text-slate-800" />
                                    <h3 className="text-sm font-black tracking-tight text-slate-950">
                                        {editingNodeId ? 'Edit' : 'New'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                    </h3>
                                </div>
                                <button type="button" onClick={closeAndResetDrawer} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                                    <X size={15} />
                                </button>
                            </div>

                            <form id="taxonomyNodeForm" onSubmit={handleFormSubmit} className="space-y-4 text-xs font-bold text-slate-700">

                                {/* FORM: CATEGORIES */}
                                {activeTab === 'categories' && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Category Name</label>
                                            <input
                                                type="text" required value={catForm.name}
                                                onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Description</label>
                                            <textarea
                                                rows={4} value={catForm.description}
                                                onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* FORM: BRANDS */}
                                {activeTab === 'brands' && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Brand Name</label>
                                            <input type="text" required value={brandForm.name} onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Description</label>
                                            <textarea rows={2} value={brandForm.description} onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Categories (Comma separated)</label>
                                            <input type="text" placeholder="e.g. Electronics, Audio" value={brandForm.categories} onChange={(e) => setBrandForm({ ...brandForm, categories: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Related Brands (Comma separated aliases)</label>
                                            <input type="text" placeholder="e.g. Sony Corp, Sony Music" value={brandForm.related_brands} onChange={(e) => setBrandForm({ ...brandForm, related_brands: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                    </div>
                                )}

                                {/* FORM: SIZES */}
                                {activeTab === 'sizes' && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Size Name</label>
                                            <input type="text" required value={sizeForm.name} onChange={(e) => setSizeForm({ ...sizeForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Unit Symbol</label>
                                            <input type="text" required value={sizeForm.unit_symbol} onChange={(e) => setSizeForm({ ...sizeForm, unit_symbol: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                    </div>
                                )}

                                {/* FORM: COLORS */}
                                {activeTab === 'colors' && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Color Name</label>
                                            <input type="text" required value={colorForm.name} onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Hex Code</label>
                                            <input type="color" required value={colorForm.hex_code} onChange={(e) => setColorForm({ ...colorForm, hex_code: e.target.value })} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 focus:bg-white focus:outline-none cursor-pointer" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Identity Definition</label>
                                            <input type="text" value={colorForm.identity_definition} onChange={(e) => setColorForm({ ...colorForm, identity_definition: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                    </div>
                                )}

                                {/* FORM: WEIGHTS */}
                                {activeTab === 'weights' && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Unit Name</label>
                                            <input type="text" required value={weightForm.unit_name} onChange={(e) => setWeightForm({ ...weightForm, unit_name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Symbol</label>
                                            <input type="text" required value={weightForm.symbol} onChange={(e) => setWeightForm({ ...weightForm, symbol: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                    </div>
                                )}

                                {/* FORM: TAGS */}
                                {activeTab === 'tags' && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Tag Name</label>
                                            <input type="text" required value={tagForm.name} onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                    </div>
                                )}

                                {/* FORM: SHAPES */}
                                {activeTab === 'shapes' && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Shape Name</label>
                                            <input type="text" required value={shapeForm.name} onChange={(e) => setShapeForm({ ...shapeForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                    </div>
                                )}

                                {/* FORM: COUNTRIES */}
                                {activeTab === 'countries' && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Country Name</label>
                                            <input type="text" required value={countryForm.name} onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-slate-500">ZIP Code</label>
                                            <input type="text" value={countryForm.zip_code} onChange={(e) => setCountryForm({ ...countryForm, zip_code: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                        <div className="flex items-center gap-2 pt-2">
                                            <input type="checkbox" id="is_operational" checked={countryForm.is_setup_for_operation} onChange={(e) => setCountryForm({ ...countryForm, is_setup_for_operation: e.target.checked })} className="w-4 h-4 text-slate-900 rounded focus:ring-slate-900 border-slate-300" />
                                            <label htmlFor="is_operational" className="text-slate-700 cursor-pointer">Setup for Operations</label>
                                        </div>
                                    </div>
                                )}

                                {/* FORM: CURRENCIES */}
                                {activeTab === 'currency' && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Currency Name</label>
                                            <input type="text" required value={currencyForm.name} onChange={(e) => setCurrencyForm({ ...currencyForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="space-y-1 w-1/2">
                                                <label className="text-slate-500">Code</label>
                                                <input type="text" required placeholder="e.g. USD" value={currencyForm.code} onChange={(e) => setCurrencyForm({ ...currencyForm, code: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                            </div>
                                            <div className="space-y-1 w-1/2">
                                                <label className="text-slate-500">Symbol</label>
                                                <input type="text" placeholder="e.g. $" value={currencyForm.symbol} onChange={(e) => setCurrencyForm({ ...currencyForm, symbol: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-slate-500">Base Country </label>

                                            <select
                                                value={currencyForm.country}
                                                onChange={(e) => setCurrencyForm({ ...currencyForm, country: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-slate-400 font-medium text-slate-900"
                                            >
                                            
                                             <option key="" value={undefined} >----SELECT COUNTRY---</option>


                                                {countries.filter((e) => e.is_setup_for_operation).map((e) => {
                                                    return <option key={e.unique_id} value={e.unique_id}>{e.name} : +{e.zip_code}</option>
                                                })}
                                            </select>

                                        </div>
                                        <div className="flex flex-col gap-2 pt-2">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="is_allowed" checked={currencyForm.is_allowed} onChange={(e) => setCurrencyForm({ ...currencyForm, is_allowed: e.target.checked })} className="w-4 h-4 text-slate-900 rounded focus:ring-slate-900 border-slate-300" />
                                                <label htmlFor="is_allowed" className="text-slate-700 cursor-pointer">Allowed for Transactions</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="is_base_currency" checked={currencyForm.is_base_currency} onChange={(e) => setCurrencyForm({ ...currencyForm, is_base_currency: e.target.checked })} className="w-4 h-4 text-slate-900 rounded focus:ring-slate-900 border-slate-300" />
                                                <label htmlFor="is_base_currency" className="text-slate-700 cursor-pointer">Set as Base Currency</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* DRAWER FOOTER */}
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-2 mt-8">
                            <button
                                type="button"
                                onClick={closeAndResetDrawer}
                                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="taxonomyNodeForm"
                                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                            >
                                {editingNodeId ? 'Save Changes' : 'Create Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}