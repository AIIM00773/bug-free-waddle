
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Check, AlertCircle, SlidersHorizontal } from 'lucide-react';




export function HomeNotificationToast(notification:any){

if(!notification)  return null;
return(

        <div className="fixed top-4 right-4 z-[99] max-w-sm bg-slate-950/90 backdrop-blur-md border border-slate-800/80 rounded-xl px-4 py-3.5 shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-5 duration-300">
          {notification.type === 'success' && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400">
              <Check size={11} strokeWidth={3} />
            </div>
          )}
          {notification.type === 'info' && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 animate-pulse">
              <Sparkles size={11} />
            </div>
          )}
          {notification.type === 'error' && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/10 text-rose-400">
              <AlertCircle size={11} />
            </div>
          )}
          <span className="font-medium text-slate-200">{notification.text}</span>
        </div>
)
}
