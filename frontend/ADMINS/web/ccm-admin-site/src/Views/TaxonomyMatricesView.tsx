import React, { useState } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  Tag,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  GitCommit,
  FolderTree,
  X,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useTaxonomyMatrices } from '../Providers.tsx/TaxonomyMatricesContext';
import type { Category, Brand, Sizes, Colors, Weights } from '../Providers.tsx/TaxonomyMatricesContext';

export default function TaxonomyMatricesView() {
  const {
    categories,
    brands,
    sizes,
    colors,
    weights,
    isLoading,
    error,
    refreshTaxonomies,
    addCategory,
    addBrand,
    addSize,
    addColor,
    addWeight,
    removeCategory,
    removeBrand,
    removeSize,
    removeColor,
    removeWeight
  } = useTaxonomyMatrices();

  const [activeTab, setActiveTab] = useState<'categories' | 'brands' | 'variants'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Dynamic Multi-Type Composition Drawer Local Form State Handlers
  const [catForm, setCatForm] = useState({ title: '', id: '', path: '', description: '' });
  const [brandForm, setBrandForm] = useState({ title: '', id: '', slug: '', aliases: '' });
  const [variantForm, setVariantForm] = useState({
    type: 'Size' as 'Size' | 'Color' | 'Weight',
    label: '',
    id: '',
    category: '',
    options: '',
    extra: '' // hex color code / weight unit symbol mapping fallback fields
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'categories') {
      const payload: Category = {
        category_title: catForm.title,
        category_node_id: catForm.id,
        identity_definnition: catForm.path, // Mapping parent structural path trace reference
        description: catForm.description || null,
        releated_categories: [],
        indexed_sku_counts: 0
      };
      await addCategory(payload);
      setCatForm({ title: '', id: '', path: '', description: '' });
    }

    else if (activeTab === 'brands') {
      const payload: Brand = {
        brand_title: brandForm.title,
        brand_node_id: brandForm.id,
        identity_definnition: null,
        description: null,
        releated_categories: [],
        related_brands: [],
        indexed_sku_counts: 0,
        Canonical_Slugs: [brandForm.slug],
        // Parsing raw text strings safely into canonical string arrays
        rawAliases: brandForm.aliases.split(',').map(s => s.trim()).filter(Boolean)
      } as any; // Cast overlay adjustment to match internal DB properties
      await addBrand(payload);
      setBrandForm({ title: '', id: '', slug: '', aliases: '' });
    }

    else if (activeTab === 'variants') {
      const parsedOptions = variantForm.options.split(',').map(s => s.trim()).filter(Boolean);

      if (variantForm.type === 'Size') {
        const payload: Sizes = {
          size_label: variantForm.label,
          size_node_id: variantForm.id,
          identity_definnition: variantForm.category,
          description: null,
          releated_categories: [variantForm.category],
          related_brands: [],
          indexed_sku_counts: 0,
          Canonical_Slugs: parsedOptions
        };
        await addSize(payload);
      } else if (variantForm.type === 'Color') {
        const payload: Colors = {
          color_label: variantForm.label,
          size_node_id: variantForm.id,
          identity_definnition: variantForm.category,
          description: null,
          releated_categories: [variantForm.category],
          related_brands: [],
          indexed_sku_counts: 0,
          Canonical_Slugs: parsedOptions,
          color_code: variantForm.extra || '#000000',
          color_rgb: null
        };
        await addColor(payload);
      } else {
        const payload: Weights = {
          weight_unit_label: variantForm.label,
          weight_symbal: variantForm.extra || 'KG',
          weight_node_id: variantForm.id,
          identity_definnition: null,
          description: null,
          indexed_sku_counts: 0
        };
        await addWeight(payload);
      }
    }

    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-0.5 relative">

      {/* TOP HEADER SECTION MAP */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Taxonomy Matrices</h2>
          <p className="text-xs text-slate-400">
            Manage categorical properties, brand alias matching rules, and variation schemas to guarantee data integrity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refreshTaxonomies()}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
            title="Sync Database Mapping Cache"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-3.5 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Plus size={14} /> Add Entity Node
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-center gap-2 font-medium">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* MATRIX SUB-NAV AND CONTEXT FILTERS BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer w-full md:w-auto justify-center ${activeTab === 'categories' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <FolderTree size={12} /> Categories
          </button>
          <button
            onClick={() => { setActiveTab('brands'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer w-full md:w-auto justify-center ${activeTab === 'brands' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <Tag size={12} /> Brand Identifiers
          </button>
          <button
            onClick={() => { setActiveTab('variants'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer w-full md:w-auto justify-center ${activeTab === 'variants' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <SlidersHorizontal size={12} /> Variation Keys
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${activeTab} data stack...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* MATRIX RENDERING STRATEGIES LAYERS */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">

        {/* VIEW ONE: REGIONAL CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Category Node ID</th>
                  <th className="py-3 px-4">Entity Definition</th>
                  <th className="py-3 px-4">Parent Structural Hierarchy</th>
                  <th className="py-3 px-4">Indexed SKUs Count</th>
                  <th className="py-3 px-4">Model Validation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {categories.filter(c => c.category_title.toLowerCase().includes(searchQuery.toLowerCase())).map((cat) => (
                  <tr key={cat.category_node_id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{cat.category_node_id}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-bold">{cat.category_title}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <span className="text-slate-300 font-light mr-1">/</span> {cat.identity_definnition || 'Root Base Element'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{(cat.indexed_sku_counts || 0).toLocaleString()} products</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={10} className="text-emerald-500" /> Normalizing
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => removeCategory(cat.category_node_id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW TWO: BRAND ALIAS MAPPINGS */}
        {activeTab === 'brands' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">System Identity</th>
                  <th className="py-3 px-4">Canonical Slug</th>
                  <th className="py-3 px-4">Scraper Raw Text Synonyms (Aliases Mapped)</th>
                  <th className="py-3 px-4">Catalog Volume</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {brands.filter(b => b.brand_title.toLowerCase().includes(searchQuery.toLowerCase())).map((brand) => {
                  const aliases: string[] = (brand as any).rawAliases || [];
                  return (
                    <tr key={brand.brand_node_id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Bookmark size={12} className="text-blue-500 shrink-0" />
                          <span className="text-slate-800 font-bold">{brand.brand_title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{brand.Canonical_Slugs?.[0] || 'no-slug'}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {aliases.length > 0 ? aliases.map((alias, i) => (
                            <span key={i} className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                              <GitCommit size={8} className="text-slate-400" /> {alias}
                            </span>
                          )) : <span className="text-slate-400 italic text-[11px]">No synonyms recorded</span>}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">{(brand.indexed_sku_counts || 0).toLocaleString()} items</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => removeBrand(brand.brand_node_id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW THREE: DYNAMIC PROPERTY ATTRIBUTES */}
        {activeTab === 'variants' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Attribute Group Type</th>
                  <th className="py-3 px-4">Label Reference</th>
                  <th className="py-3 px-4">Target Application Class</th>
                  <th className="py-3 px-4">Standardized Parsed Values Configured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {/* 1. Render Sizes Array */}
                {sizes.filter(s => s.size_label.toLowerCase().includes(searchQuery.toLowerCase())).map((size) => (
                  <tr key={size.size_node_id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">Size Matrix</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{size.size_label}</td>
                    <td className="py-3.5 px-4 text-slate-500">{size.identity_definnition || 'Global Stack'}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {size.Canonical_Slugs?.map((opt, i) => (
                          <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-md font-mono">{opt}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => removeSize(size.size_node_id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}

                {/* 2. Render Colors Array */}
                {colors.filter(c => c.color_label.toLowerCase().includes(searchQuery.toLowerCase())).map((color) => (
                  <tr key={color.size_node_id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">Color Matrix</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] flex items-center gap-1.5 text-slate-500">
                      {color.color_code && <span className="h-2.5 w-2.5 rounded-full border border-slate-300 shrink-0" style={{ backgroundColor: color.color_code }} />}
                      {color.color_label}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{color.identity_definnition || 'All Categories'}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {color.Canonical_Slugs?.map((opt, i) => (
                          <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-md font-mono">{opt}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => removeColor(color.size_node_id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}

                {/* 3. Render Weights Array */}
                {weights.filter(w => w.weight_unit_label.toLowerCase().includes(searchQuery.toLowerCase())).map((w) => (
                  <tr key={w.weight_node_id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">Weight Metric</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{w.weight_unit_label} ({w.weight_symbal})</td>
                    <td className="py-3.5 px-4 text-slate-400 italic">Continuous Metric Structure</td>
                    <td className="py-3.5 px-4"><span className="text-[11px] text-slate-400">Dynamic system parsed bounds</span></td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => removeWeight(w.weight_node_id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={13} /></button>
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
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-end animate-fadeIn" onClick={() => setIsDrawerOpen(false)}>
          <div
            className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900">
                  <FolderTree size={16} className="text-blue-600" />
                  <h3 className="text-sm font-semibold">Provision {activeTab} Element</h3>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium text-slate-700">

                {/* CONTEXT ONE: CATEGORY FORM SCHEMA */}
                {activeTab === 'categories' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-slate-500">Category Name</label>
                      <input type="text" required placeholder="Gym Equipments" value={catForm.title} onChange={e => setCatForm({ ...catForm, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">Unique Code Node ID</label>
                      <input type="text" required placeholder="CAT-GY-01" value={catForm.id} onChange={e => setCatForm({ ...catForm, id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">Structural Hierarchy Trace Path</label>
                      <input type="text" required placeholder="Fitness / Strength Training" value={catForm.path} onChange={e => setCatForm({ ...catForm, path: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">Pipeline Scope Definition Context</label>
                      <textarea rows={3} placeholder="Provide descriptive taxonomy boundaries..." value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 resize-none" />
                    </div>
                  </>
                )}

                {/* CONTEXT TWO: BRAND FORM SCHEMA */}
                {activeTab === 'brands' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-slate-500">Brand Name</label>
                      <input type="text" required placeholder="Nike" value={brandForm.title} onChange={e => setBrandForm({ ...brandForm, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">Brand System ID</label>
                      <input type="text" required placeholder="BRD-NK-01" value={brandForm.id} onChange={e => setBrandForm({ ...brandForm, id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">Canonical Handle Slug URL</label>
                      <input type="text" required placeholder="nike" value={brandForm.slug} onChange={e => setBrandForm({ ...brandForm, slug: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">Unstructured Text Scraper Aliases (Comma Separated)</label>
                      <input type="text" placeholder="Nike Kenya, NIKE Official, Nike Wear" value={brandForm.aliases} onChange={e => setBrandForm({ ...brandForm, aliases: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                  </>
                )}

                {/* CONTEXT THREE: ATTRIBUTE VARIANTS METRICS */}
                {activeTab === 'variants' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-slate-500">Variant Matrix Class Type</label>
                      <select value={variantForm.type} onChange={e => setVariantForm({ ...variantForm, type: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer">
                        <option value="Size">Size Group</option>
                        <option value="Color">Color Palette Group</option>
                        <option value="Weight">Weight Scaling Unit</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-500">Label Text</label>
                        <input type="text" required placeholder="UK Sizes / Crimson" value={variantForm.label} onChange={e => setVariantForm({ ...variantForm, label: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500">Unique Mapping ID</label>
                        <input type="text" required placeholder="VRT-NODE-XX" value={variantForm.id} onChange={e => setVariantForm({ ...variantForm, id: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono" />
                      </div>
                    </div>

                    {variantForm.type !== 'Weight' && (
                      <div className="space-y-1">
                        <label className="text-slate-500">Applicable Structural Category Target</label>
                        <input type="text" placeholder="Footwear / Apparel" value={variantForm.category} onChange={e => setVariantForm({ ...variantForm, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-slate-500">
                        {variantForm.type === 'Weight' ? 'Unit Metric symbol abbreviation' : 'Standardized Parsed Options Options (Comma Separated)'}
                      </label>
                      <input
                        type="text" required
                        placeholder={variantForm.type === 'Weight' ? 'e.g., KG or LBS' : 'e.g., Small, Medium, Large'}
                        value={variantForm.type === 'Weight' ? variantForm.extra : variantForm.options}
                        onChange={e => variantForm.type === 'Weight' ? setVariantForm({ ...variantForm, extra: e.target.value }) : setVariantForm({ ...variantForm, options: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                      />
                    </div>

                    {variantForm.type === 'Color' && (
                      <div className="space-y-1">
                        <label className="text-slate-500">Hexadecimal Value Tint Match Code</label>
                        <input type="text" placeholder="#FF0000" value={variantForm.extra} onChange={e => setVariantForm({ ...variantForm, extra: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono" />
                      </div>
                    )}
                  </>
                )}

                <div className="pt-4 flex items-center gap-2">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="w-1/2 p-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer">Cancel</button>
                  <button type="submit" className="w-1/2 p-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-xs cursor-pointer">Commit Entry</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}