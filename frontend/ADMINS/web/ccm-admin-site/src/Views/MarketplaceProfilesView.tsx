

import  { useState } from 'react';
import { 
  Globe, 
  Search, 
  Plus, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Sliders, 
  ToggleLeft, 
  ToggleRight,
  ExternalLink
} from 'lucide-react';

// Strict interface mapping directly to your Django Marketplace configurations
interface MarketplaceProfile {
  id: string;
  name: string;
  countryCode: 'KE' | 'UG' | 'TZ';
  baseCurrency: string;
  parserStatus: 'active' | 'paused' | 'failing';
  lastScrapedRun: string;
  frequencyHours: number;
  extractedNodesCount: number;
  configSchemaSlug: string;
}

export default function MarketplaceProfilesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Local reactive state reflecting your background pipeline targets
  const [profiles, setProfiles] = useState<MarketplaceProfile[]>([
    {
      id: "MKT-JM-KE",
      name: "Jumia Kenya",
      countryCode: "KE",
      baseCurrency: "KES",
      parserStatus: "active",
      lastScrapedRun: "4 mins ago",
      frequencyHours: 6,
      extractedNodesCount: 4120,
      configSchemaSlug: "jumia_ke_shoes_v2.json"
    },
    {
      id: "MKT-KM-KE",
      name: "Kilimall",
      countryCode: "KE",
      baseCurrency: "KES",
      parserStatus: "active",
      lastScrapedRun: "18 mins ago",
      frequencyHours: 12,
      extractedNodesCount: 2890,
      configSchemaSlug: "kilimall_general_v1.json"
    },
    {
      id: "MKT-JM-UG",
      name: "Jumia Uganda",
      countryCode: "UG",
      baseCurrency: "UGX",
      parserStatus: "active",
      lastScrapedRun: "In Progress",
      frequencyHours: 12,
      extractedNodesCount: 1105,
      configSchemaSlug: "jumia_ug_main.json"
    },
    {
      id: "MKT-CP-KE",
      name: "Copia",
      countryCode: "KE",
      baseCurrency: "KES",
      parserStatus: "failing",
      lastScrapedRun: "2 hours ago",
      frequencyHours: 24,
      extractedNodesCount: 0,
      configSchemaSlug: "copia_supply_chain.json"
    }
  ]);

  const triggerSystemUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 1000);
  };

  const toggleParserState = (id: string) => {
    setProfiles(profiles.map(p => {
      if (p.id === id) {
        return {
          ...p,
          parserStatus: p.parserStatus === 'active' ? 'paused' : 'active'
        };
      }
      return p;
    }));
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.configSchemaSlug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn p-0.5">
      
      {/* HEADER BAR CONSTRUCT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Marketplace Profiles</h2>
          <p className="text-xs text-slate-400">
            Configure regional cluster domains, parsing limits, and structure parameters for core ingestion microservices.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={triggerSystemUpdate}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Poll Engine State Records"
          >
            <RefreshCw size={14} className={isUpdating ? 'animate-spin' : ''} />
          </button>
          
          <button
            type="button"
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus size={13} /> New Profile Schema
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter marketplace nodes or schema matrices..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* PROFILES GRID MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <div 
              key={profile.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all duration-150"
            >
              {/* Profile Meta Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
                    <Globe size={15} className="text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">{profile.name}</h3>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-tight">{profile.id}</p>
                  </div>
                </div>

                {/* Status Indicator Badges */}
                <div>
                  {profile.parserStatus === 'active' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                      <CheckCircle size={10} /> Running
                    </span>
                  )}
                  {profile.parserStatus === 'paused' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                      <Sliders size={10} /> Suspended
                    </span>
                  )}
                  {profile.parserStatus === 'failing' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md animate-pulse">
                      <AlertCircle size={10} /> Target Blocked
                    </span>
                  )}
                </div>
              </div>

              {/* Data Telemetry Grid */}
              <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 bg-slate-50/40 rounded-lg px-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block">Boundary</span>
                  <span className="text-xs font-medium text-slate-700">{profile.countryCode} ({profile.baseCurrency})</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block">Scan Frequency</span>
                  <span className="text-xs font-medium text-slate-700">Every {profile.frequencyHours}h</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block">Index Output</span>
                  <span className="text-xs font-mono font-medium text-slate-700">{profile.extractedNodesCount.toLocaleString()} SKUs</span>
                </div>
              </div>

              {/* Engine JSON Schema Tracking Ref */}
              <div className="flex items-center justify-between text-[11px] font-medium">
                <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[70%]">
                  <Layers size={12} className="text-slate-300" />
                  <span className="truncate font-mono text-slate-400" title={profile.configSchemaSlug}>
                    {profile.configSchemaSlug}
                  </span>
                </div>
                
                {/* Control Toggles & Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleParserState(profile.id)}
                    disabled={profile.parserStatus === 'failing'}
                    className={`p-1 rounded-md transition-colors inline-flex items-center ${
                      profile.parserStatus === 'failing'
                        ? 'opacity-40 cursor-not-allowed text-slate-300'
                        : 'text-slate-400 hover:text-slate-700 cursor-pointer'
                    }`}
                    title={profile.parserStatus === 'active' ? "Pause Scraper Automation Pipeline" : "Resume Scraper Automation Pipeline"}
                  >
                    {profile.parserStatus === 'active' ? <ToggleRight size={20} className="text-blue-600" /> : <ToggleLeft size={20} />}
                  </button>
                  <button
                    type="button"
                    className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                    title="Edit Parser Rules Map"
                  >
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 font-medium flex flex-col items-center justify-center gap-2 shadow-2xs">
            <AlertCircle size={20} className="text-slate-300" />
            <span>No matching marketplace boundaries verified in local cache cluster.</span>
          </div>
        )}
      </div>

    </div>
  );
}