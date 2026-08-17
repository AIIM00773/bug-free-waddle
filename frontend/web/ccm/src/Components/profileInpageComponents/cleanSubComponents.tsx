import React, { useState } from 'react';
import { ChevronDown, Copy, Check, ShieldCheck, Eye, EyeOff } from 'lucide-react';

/* =========================================================
   CLEAN SUB-COMPONENTS
   ========================================================= */

/**
 * Single-line input field with floating label style
 */
export function CleanInput({ label, value, onChange, type = "text", icon, disabled = false, placeholder }) {
  return (
    <div
      className={`flex flex-col gap-1.5 p-3.5 rounded-2xl bg-slate-50 border transition-all w-full ${
        disabled
          ? 'opacity-60 cursor-not-allowed border-slate-200/60'
          : 'border-slate-200/80 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100'
      }`}
    >
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
        {label}
      </label>
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
        <input
          type={type}
          disabled={disabled}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none disabled:cursor-not-allowed placeholder:text-slate-400"
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}

/**
 * Dropdown select field
 */
export function CleanSelect({ label, value, onChange, options = [], disabled = false }) {
  return (
    <div
      className={`flex flex-col gap-1.5 p-3.5 rounded-2xl bg-slate-50 border transition-all w-full ${
        disabled
          ? 'opacity-60 cursor-not-allowed border-slate-200/60'
          : 'border-slate-200/80 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100'
      }`}
    >
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
        {label}
      </label>
      <div className="relative flex items-center">
        <select
          disabled={disabled}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none cursor-pointer disabled:cursor-not-allowed appearance-none pr-6"
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal} className="text-slate-800">
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown size={14} className="absolute right-0 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

/**
 * Multi-line textarea input
 */
export function CleanTextArea({ label, value, onChange, rows = 3, disabled = false, placeholder }) {
  return (
    <div
      className={`flex flex-col gap-1.5 p-3.5 rounded-2xl bg-slate-50 border transition-all w-full ${
        disabled
          ? 'opacity-60 cursor-not-allowed border-slate-200/60'
          : 'border-slate-200/80 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100'
      }`}
    >
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
        {label}
      </label>
      <textarea
        rows={rows}
        disabled={disabled}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none disabled:cursor-not-allowed placeholder:text-slate-400 resize-none"
        placeholder={placeholder || `Provide ${label.toLowerCase()} details...`}
      />
    </div>
  );
}

/**
 * Read-only display field with optional copy or masked/KYC privacy controls
 */
export function CleanReadOnlyField({ label, value, icon, isMasked = false, isVerified = false, canCopy = false }) {
  const [copied, setCopied] = useState(false);
  const [showMasked, setShowMasked] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayVal = isMasked && !showMasked
    ? value ? '•••• •••• ' + value.slice(-4) : '••••••••'
    : value || '—';

  return (
    <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/60 w-full">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
          {label}
        </label>
        {isVerified && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <ShieldCheck size={11} /> Verified
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span className="text-xs font-semibold text-slate-800 truncate">
            {displayVal}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isMasked && (
            <button
              type="button"
              onClick={() => setShowMasked(!showMasked)}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              title={showMasked ? "Hide" : "Show"}
            >
              {showMasked ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          )}
          {canCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Secondary action or inline change button
 */
export function ChangeButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-3.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 rounded-2xl transition-all shrink-0 cursor-pointer"
    >
      {label}
    </button>
  );
}

/**
 * Empty state indicator for empty tabs or missing records
 */
export function EmptyState({ icon: Icon, text }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
        <Icon size={24} />
      </div>
      <p className="text-xs font-semibold text-slate-500">{text}</p>
    </div>
  );
}

/**
 * Form section title header
 */
export function CleanSectionHeader({ title, description, badge }) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
        {badge && (
          <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
            {badge}
          </span>
        )}
      </div>
      {description && <p className="text-xs text-slate-500 font-medium">{description}</p>}
    </div>
  );
}
