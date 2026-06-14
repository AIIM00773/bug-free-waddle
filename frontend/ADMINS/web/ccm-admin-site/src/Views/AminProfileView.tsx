import React, { useState, useMemo } from "react";
import { 
    Shield, 
    User, 
    Mail, 
    LogOut, 
    CheckCircle, 
    Copy, 
    Check, 
    Terminal, 
    Clock, 
    Globe, 
    Cpu 
} from "lucide-react";
import { useAdminAuth } from "../Providers.tsx/AdminAuthAndProfileContext";

interface InfoCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    badge?: React.ReactNode;
    copyable?: boolean;
}

export default function AdminUserProfile() {
    const { adminUser, logout, isAuthenticated } = useAdminAuth();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    if (!isAuthenticated || !adminUser) {
        return (
            <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs animate-in fade-in duration-200">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 mb-3">
                    <Shield size={20} />
                </div>
                <p className="text-sm font-medium text-slate-600">
                    No authenticated administrator context found.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    Please terminate this execution path and return to the main security validation gate.
                </p>
            </div>
        );
    }

    const fullName = useMemo(() => {
        return [adminUser.first_name, adminUser.last_name]
            .filter(Boolean)
            .join(" ");
    }, [adminUser.first_name, adminUser.last_name]);

    // Generate dynamic clean avatars derived from string matrix calculations
    const initials = useMemo(() => {
        if (fullName) {
            return fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        }
        return adminUser.username?.slice(0, 2).toUpperCase() || "OP";
    }, [fullName, adminUser.username]);

    const handleCopyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Header Profile Banner Block */}
            <div className="bg-slate-900 px-6 py-8 sm:px-8 sm:py-10 text-white relative overflow-hidden select-none">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-60" />
                {/* Micro Tech Visual Aesthetic Blueprint Grid lines */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:14px_24px]" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shrink-0 font-mono text-xl font-bold tracking-wider text-slate-100 shadow-inner">
                            {initials}
                        </div>
                        <div className="leading-tight min-w-0">
                            <div className="flex items-center gap-2">
                                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                                    {fullName || "System Operator Node"}
                                </h2>
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase">
                                    Live
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium truncate mt-1 font-mono">
                                node_uid: @{adminUser.username || "system_root"}
                            </p>
                        </div>
                    </div>
                    
                    {/* Fast Metadata Header Readout Panel */}
                    <div className="flex gap-3 sm:gap-4 border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0 w-full sm:w-auto font-mono text-[11px] text-slate-400">
                        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                            <span className="block text-[9px] text-slate-500 uppercase font-bold">Region</span>
                            <span className="text-slate-300">KE-NBO-01</span>
                        </div>
                        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                            <span className="block text-[9px] text-slate-500 uppercase font-bold">Role Hierarchy</span>
                            <span className="text-slate-300">{adminUser.is_staff ? "Superuser" : "Standard"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Workspace Division Matrix */}
            <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-6">
                
                {/* Left Side Column: Core Credentials Output Grid */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 select-none flex items-center gap-2">
                        <Terminal size={12} className="text-slate-400" />
                        Identity Profile Context Details
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        <InfoCard
                            icon={<User size={13} />}
                            label="Internal Profile Node ID"
                            value={String(adminUser.id || "00404")}
                            copyable
                            copiedId={copiedId}
                            onCopy={(val) => handleCopyToClipboard(val, "id")}
                            id="id"
                        />

                        <InfoCard
                            icon={<User size={13} />}
                            label="System Username Access Code"
                            value={adminUser.username || "Not assigned"}
                            copyable
                            copiedId={copiedId}
                            onCopy={(val) => handleCopyToClipboard(val, "username")}
                            id="username"
                        />

                        <InfoCard
                            icon={<Mail size={13} />}
                            label="System Email Terminal Routing"
                            value={adminUser.email || "No routing assigned"}
                            copyable
                            copiedId={copiedId}
                            onCopy={(val) => handleCopyToClipboard(val, "email")}
                            id="email"
                        />

                        <InfoCard
                            icon={<Shield size={13} />}
                            label="Admin Authorization Access Level"
                            value={adminUser.is_staff ? "Authorized Administrator Authority" : "Restricted Pipeline Access"}
                            badge={
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                                    adminUser.is_staff ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-slate-50 text-slate-600 border border-slate-200"
                                }`}>
                                    {adminUser.is_staff ? "Staff Node" : "External Access"}
                                </span>
                            }
                        />

                        <InfoCard
                            icon={<CheckCircle size={13} />}
                            label="Database Registry Account Status"
                            value={adminUser.is_active ? "Active Operational Status Enabled" : "Suspended Network Access Intercepted"}
                            badge={
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                                    adminUser.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                                }`}>
                                    {adminUser.is_active ? "Online / Verified" : "Offline / Terminated"}
                                </span>
                            }
                        />
                    </div>
                </div>

                {/* Right Side Column: Environmental Telemetry Panel Monitor */}
                <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 space-y-4 font-mono select-none">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Cpu size={13} className="text-slate-400" />
                        Session Diagnostics
                    </h3>

                    <div className="space-y-3.5 text-xs">
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                            <span className="text-slate-500 flex items-center gap-1.5"><Globe size={12} /> Sync Origin</span>
                            <span className="text-slate-700 font-medium text-right">127.0.0.1 (Localhost)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                            <span className="text-slate-500 flex items-center gap-1.5"><Clock size={12} /> Access Lifecycle</span>
                            <span className="text-slate-700 font-medium text-right">JWT Bearer Slip TLS</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                            <span className="text-slate-500 flex items-center gap-1.5">⚡ Core Pipeline</span>
                            <span className="text-slate-700 font-medium text-right text-emerald-600">Soko AI Scraper Active</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 flex items-center gap-1.5">⚙️ Cluster Node</span>
                            <span className="text-slate-400 font-medium text-right text-[10px] bg-slate-200/60 px-1.5 py-0.5 rounded">Django_Engine_v1</span>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-slate-900 text-slate-400 rounded-xl text-[10px] leading-relaxed border border-slate-800 shadow-inner">
                        <span className="text-emerald-400 font-bold">soko_ai_node_sys ~$</span> token_validation: 200 OK. Initialization thread monitoring running seamlessly.
                    </div>
                </div>
            </div>

            {/* Action Control Panel Footer Bar */}
            <div className="px-6 py-4 sm:px-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between select-none">
                <p className="text-[11px] text-slate-400 font-medium text-center sm:text-left">
                    Security Boundary: Access to cryptographic configuration blocks is monitored via internal telemetry.
                </p>
                <button
                    type="button"
                    onClick={logout}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 hover:border-rose-300 transition-all duration-200 shadow-xs active:scale-[0.98] cursor-pointer"
                >
                    <LogOut size={13} />
                    Disconnect Security Node
                </button>
            </div>
        </div>
    );
}

interface ExtendedInfoCardProps extends InfoCardProps {
    copiedId?: string | null;
    onCopy?: (value: string) => void;
    id?: string;
}

function InfoCard({ label, value, icon, badge, copyable, copiedId, onCopy, id }: ExtendedInfoCardProps) {
    const isCopied = copiedId === id && !!id;

    return (
        <div className="border border-slate-200 bg-slate-50/20 rounded-xl p-4 flex flex-col justify-between group transition-all duration-200 hover:bg-white hover:border-slate-300 hover:shadow-xs">
            <div className="min-w-0">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2 select-none">
                    <span className="text-slate-400 group-hover:text-slate-500 transition-colors shrink-0">{icon}</span>
                    <span className="tracking-wider uppercase text-[9px] text-slate-400 font-bold">{label}</span>
                </div>
                <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="font-semibold text-xs text-slate-800 break-all leading-relaxed font-mono">
                        {value}
                    </div>
                    {copyable && onCopy && (
                        <button
                            type="button"
                            onClick={() => onCopy(value)}
                            className="shrink-0 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-all cursor-pointer relative"
                            title="Copy target metadata to clipboard"
                        >
                            {isCopied ? (
                                <Check size={12} className="text-emerald-600 animate-in zoom-in duration-150" />
                            ) : (
                                <Copy size={12} />
                            )}
                        </button>
                    )}
                </div>
            </div>
            {badge && <div className="mt-3.5 flex select-none">{badge}</div>}
        </div>
    );
}