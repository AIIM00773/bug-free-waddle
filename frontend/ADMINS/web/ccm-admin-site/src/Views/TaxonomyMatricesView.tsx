

import { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';

// Strict definitions mapping directly to your relational database normalization layers
interface CategoryNode {
  id: string;
  name: string;
  parentPath: string;
  mappedSkusCount: number;
  isActive: boolean;
}

interface BrandNode {
  id: string;
  name: string;
  normalizedSlug: string;
  rawAliases: string[]; // Scraper text variations mapped to single canonical brand
  productCount: number;
}

interface AttributeVariantNode {
  id: string;
  attributeName: 'Size' | 'Color' | 'Weight' | 'Tension';
  applicableCategory: string;
  valueOptions: string[];
}

export default function TaxonomyMatricesView() {
  const [activeTab, setActiveTab] = useState<'categories' | 'brands' | 'variants'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Categories State (e.g. tracking missing target scopes like "Gym Equipments")
  const [categories, setCategories] = useState<CategoryNode[]>([
    { id: "CAT-SH-01", name: "Running Shoes", parentPath: "Apparel / Footwear", mappedSkusCount: 5210, isActive: true },
    { id: "CAT-SH-02", name: "Training & Gym Shoes", parentPath: "Apparel / Footwear", mappedSkusCount: 2910, isActive: true },
    { id: "CAT-GY-01", name: "Gym Equipments", parentPath: "Fitness / Strength Training", mappedSkusCount: 4280, isActive: true },
    { id: "CAT-GY-02", name: "Resistance Bands", parentPath: "Fitness / Accessories", mappedSkusCount: 1880, isActive: true },
  ]);

  // 2. Brands Synonyms Mapping (Crucial for normalizing unstructured marketplace texts to correct models)
  const [brands, setBrands] = useState<BrandNode[]>([
    { id: "BRD-NK-01", name: "Nike", normalizedSlug: "nike", rawAliases: ["Nike Official", "NIKE", "Nike Kenya"], productCount: 4120 },
    { id: "BRD-AD-02", name: "Adidas", normalizedSlug: "adidas", rawAliases: ["Adidas Performance", "ADIDAS", "Adidas Core"], productCount: 3890 },
    { id: "BRD-GN-03", name: "Generic", normalizedSlug: "generic", rawAliases: ["No Brand", "Unknown", "Unbranded"], productCount: 5200 },
  ]);

  // 3. Global Variation Matrices (Handling complex attributes on the frontend without database pollution)
  const [variants, setVariants] = useState<AttributeVariantNode[]>([
    { id: "VRT-SZ-01", attributeName: "Size", applicableCategory: "Footwear", valueOptions: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"] },
    { id: "VRT-CL-02", attributeName: "Color", applicableCategory: "All Categories", valueOptions: ["Black", "White", "Navy", "Crimson/Grey"] },
    { id: "VRT-WT-03", attributeName: "Weight", applicableCategory: "Gym Equipments", valueOptions: ["5KG", "10KG", "15KG", "20KG"] },
  ]);

  const triggerTaxonomySync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-0.5">
      
      {/* TOP HEADER SECTION */}
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
            onClick={triggerTaxonomySync}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Sync Database Mapping Cache"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
          </button>
          
          <button
            type="button"
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus size={13} /> Add Entity Node
          </button>
        </div>
      </div>

      {/* MATRIX SUB-NAV AND CONTEXT FILTERS BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
        
        {/* Toggle Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer w-full md:w-auto justify-center ${
              activeTab === 'categories' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderTree size={12} />
            Categories
          </button>
          <button
            onClick={() => { setActiveTab('brands'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer w-full md:w-auto justify-center ${
              activeTab === 'brands' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag size={12} />
            Brand Identifiers
          </button>
          <button
            onClick={() => { setActiveTab('variants'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer w-full md:w-auto justify-center ${
              activeTab === 'variants' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <SlidersHorizontal size={12} />
            Variation Keys
          </button>
        </div>

        {/* Local Scope Search Inputs */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${activeTab}...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* MATRIX RENDER STRATEGIES */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        
        {/* VIEW ONE: REGIONAL CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Category Node ID</th>
                  <th className="py-3 px-4">Entity Definition</th>
                  <th className="py-3 px-4">Parent Structural Hierarchy</th>
                  <th className="py-3 px-4">Indexed SKUs Count</th>
                  <th className="py-3 px-4">Model Validation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{cat.id}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{cat.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <span className="text-slate-300 font-light mr-1">/</span> {cat.parentPath}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{cat.mappedSkusCount.toLocaleString()} products</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={10} className="text-emerald-500" /> Normalizing
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg transition-colors cursor-pointer">
                        <ExternalLink size={12} />
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
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">System Identity</th>
                  <th className="py-3 px-4">Canonical Slug</th>
                  <th className="py-3 px-4">Scraper Raw Text Synonyms (Aliases Mapped)</th>
                  <th className="py-3 px-4">Catalog Volume</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {brands.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).map((brand) => (
                  <tr key={brand.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Bookmark size={12} className="text-blue-500" />
                        <span className="text-slate-800 font-medium">{brand.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{brand.normalizedSlug}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {brand.rawAliases.map((alias, i) => (
                          <span key={i} className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                            <GitCommit size={8} className="text-slate-400" /> {alias}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{brand.productCount.toLocaleString()} items</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs text-blue-600 hover:text-blue-800 bg-transparent px-2 py-1 rounded-md hover:bg-blue-50/50 cursor-pointer transition-colors">
                        Edit Synonyms
                  </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW THREE: DYNAMIC PROPERTY ATTRIBUTES */}
        {activeTab === 'variants' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Attribute Group Name</th>
                  <th className="py-3 px-4">Target Application Class</th>
                  <th className="py-3 px-4">Standardized Parsed Values Configured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {variants.filter(v => v.attributeName.toLowerCase().includes(searchQuery.toLowerCase())).map((variant) => (
                  <tr key={variant.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{variant.attributeName} Matrix</td>
                    <td className="py-3.5 px-4 text-slate-500">{variant.applicableCategory}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {variant.valueOptions.map((opt, i) => (
                          <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-sm">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer transition-colors">
                        Modify Keys
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}