
import ccmlogo1 from '../../assets/ccmlogo1.png'


import React from 'react';

export const LoadingScreen = ({ 
  message = "Initializing shopping mode...", 
  subtext = "Connecting to merchants & catalogs" 
}) => {
  return (
    <div className="flex flex-1 h-screen w-full items-center justify-center bg-[#0d0f12] text-zinc-200 antialiased font-sans">
      <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center">
        
        <div className="relative flex items-center justify-center w-12 h-12">
          <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-ping" />
          
          <div className="absolute inset-0 rounded-full border border-t-teal-400 border-r-transparent border-b-zinc-700 border-l-transparent animate-spin duration-1000" />
          
          <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-400/40 shadow-[0_0_15px_rgba(20,184,166,0.3)] animate-pulse" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium tracking-wide text-zinc-200 animate-pulse">
            {message}
          </p>
          {subtext && (
            <p className="text-xs text-zinc-500 font-normal">
              {subtext}
            </p>
          )}
        </div>

        <div className="w-48 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-shimmer" />
        </div>

<img src= {ccmlogo1} height={150} width={150} /> 
      </div>
    </div>
  );
};
