import React, { useState } from 'react';
import { ChevronRight, X, ExternalLink, Store, MapPin, ShieldCheck } from 'lucide-react';

// Interface for Merchant / Source items
export interface SourceItem {
  id: string;
  title: string;
  url?: string;
  domain?: string;
  location?: string;
  snippet?: string;
  isVerified?: boolean;
}

// Sample fallback merchants/sources aligned with the neighborhood Soko AI context
const SAMPLE_SOURCES: SourceItem[] = [
  {
    id: '1',
    title: 'Mama Jane Fresh Greens & Veggies',
    domain: 'Kilimani Market Stall #14',
    location: '0.4 km away',
    snippet: 'Fresh farm spinach, sukuma wiki, and organic tomatoes delivered daily.',
    isVerified: true,
  },
  {
    id: '2',
    title: 'City Choice Butchery & Meat Hub',
    domain: 'Ngong Road Branch',
    location: '1.2 km away',
    snippet: 'Prime beef cuts, local goat meat, and fresh poultry. Cold-chain guaranteed.',
    isVerified: true,
  },
  {
    id: '3',
    title: 'QuickMart Express Neighborhood',
    domain: 'Valley Arcade',
    location: '0.8 km away',
    snippet: 'Pantry essentials, dairy items, and fresh baked goods ready for fast dispatch.',
    isVerified: true,
  },
];

export function SourcesPanel({
  sources = SAMPLE_SOURCES,
  openSources,
  setOpenSources,
}: {
  sources?: SourceItem[];
  openSources: boolean;
  setOpenSources: (val: boolean) => void;
}) {
  const [expandSources, setExpandSources] = useState<boolean>(true);

  if (!openSources) return null;

  return (
    <div className="hidden lg:block border-l border-slate-200/80  pl-6 pt-2 ">
      <div className="sticky top-6 w-full max-w-[320px] rounded-2xl border border-orange-500 bg-white p-4 shadow-sm transition-all hover:shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3C3147]/10 text-[#3C3147]">
              <Store size={13} />
            </div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Verified Merchants
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700">
              {sources.length}
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setExpandSources((prev) => !prev)}
              aria-label="Expand sources"
              className="flex items-center rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3C3147]/20"
            >
              <ChevronRight
                size={14}
                className={`transition-transform duration-200 ${
                  expandSources ? 'rotate-90' : 'rotate-0'
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setOpenSources(false)}
              aria-label="Close sources"
              className="flex items-center rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3C3147]/20"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Collapsible Source Links Listing */}
        {expandSources && (
          <div className="mt-3 max-h-[420px] space-y-2.5 overflow-y-auto pr-1 text-left custom-scrollbar">
            {sources.map((source, index) => {
              const Wrapper = source.url ? 'a' : 'div';
              const wrapperProps = source.url
                ? {
                    href: source.url,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  }
                : {};

              return (
                <Wrapper
                  key={source.id || index}
                  {...wrapperProps}
                  className="group flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-all hover:border-[#3C3147]/30 hover:bg-white hover:shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Store size={12} className="shrink-0 text-slate-400 group-hover:text-[#3C3147]" />
                      <span className="truncate text-[10px] font-semibold text-slate-500">
                        {source.domain || 'Verified Local Vendor'}
                      </span>
                    </div>

                    {source.isVerified !== false && (
                      <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200/60 shrink-0">
                        <ShieldCheck size={10} />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  <h5 className="line-clamp-1 text-xs font-bold text-slate-800 transition-colors group-hover:text-[#3C3147] flex items-center justify-between">
                    <span>{source.title}</span>
                    {source.url && (
                      <ExternalLink
                        size={11}
                        className="shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-slate-700 ml-1"
                      />
                    )}
                  </h5>

                  {source.snippet && (
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-500 font-normal">
                      {source.snippet}
                    </p>
                  )}

                  {source.location && (
                    <div className="flex items-center gap-1 pt-1 text-[10px] font-medium text-slate-400">
                      <MapPin size={10} className="shrink-0 text-slate-400" />
                      <span>{source.location}</span>
                    </div>
                  )}
                </Wrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
