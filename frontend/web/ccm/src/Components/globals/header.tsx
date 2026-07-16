import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  Compass,
  MessageSquare,
  User,
  MapPin,
  Sparkles,
  ShoppingBag,
  Trash2,
  Menu,
  X,
  ArrowUpRight,
  Check,
  ChevronRight,
  Smartphone,
  HelpCircle,
  Clock,
  Map,
  ArrowRight,
  AlertCircle
} from 'lucide-react';



export function Header({setSidebarOpen, cart}){


return(
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-2  bg-none active:bg-green-500/30 border-none  rounded-lg">
          <Menu size={20} />
        </button>

        
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-emerald-400 text-sm">
          <Sparkles size={16} />
        </div>

      </header>)

}
