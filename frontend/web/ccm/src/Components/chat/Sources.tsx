

import React, { useState } from 'react';
import { ChevronRight, X, ExternalLink, Globe } from 'lucide-react';

// Example source item interface
interface SourceItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet?: string;
}

// Sample fallback sources if not passed from props
const SAMPLE_SOURCES: SourceItem[] = [
  {
    id: '1',
    title: 'Jumia Kenya - Electronics & Local Deals',
    url: 'https://www.jumia.co.ke',
    domain: 'jumia.co.ke',
    snippet: 'Best online prices for smartphones, home appliances & groceries.',
  },
  {
    id: '2',
    title: 'Kilimall Kenya - Online Shopping Marketplace',
    url: 'https://www.kilimall.co.ke',
    domain: 'kilimall.co.ke',
    snippet: 'Find top quality products with fast local delivery options.',
  },
  {
    id: '3',
    title: 'Jiji Kenya - Free Classifieds Marketplace',
    url: 'https://jiji.co.ke',
    domain: 'jiji.co.ke',
    snippet: 'Buy and sell second-hand or new items directly from verified sellers.',
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
    <div className="hidden lg:block ml-2 border-l border-gray-400/20 p-4 rounded-xl">
      <div className="sticky top-6 w-full max-w-[280px] rounded-xl border border-[#2d2d2d] bg-[#202020] p-4 transition-all hover:border-[#3d3d3d]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">Sources</span>
            <span className="rounded-full bg-[#2a2a2a] px-2 py-0.5 text-[10px] font-semibold text-teal-400">
              {sources.length}
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setExpandSources((prev) => !prev)}
              aria-label="Expand sources"
              className="flex items-center text-xs font-semibold text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-[#2a2a2a]"
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
              className="flex items-center text-xs font-semibold text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-[#2a2a2a]"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Collapsible Source Links Listing */}
        {expandSources && (
          <div className="custom-scrollbar mt-3 max-h-80 space-y-2 overflow-y-auto pt-2 border-t border-[#2a2a2a]">
            {sources.map((source, index) => (
              <a
                key={source.id || index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 rounded-lg border border-transparent bg-[#181818] p-2.5 transition-all hover:border-[#333333] hover:bg-[#252525]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Globe size={12} className="shrink-0 text-teal-400" />
                    <span className="truncate text-[10px] font-medium text-gray-400">
                      {source.domain}
                    </span>
                  </div>
                  <ExternalLink
                    size={10}
                    className="shrink-0 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-gray-300"
                  />
                </div>

                <h5 className="line-clamp-2 text-xs font-semibold leading-snug text-gray-200 transition-colors group-hover:text-teal-400">
                  {source.title}
                </h5>

                {source.snippet && (
                  <p className="line-clamp-2 text-[11px] leading-normal text-gray-400">
                    {source.snippet}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
