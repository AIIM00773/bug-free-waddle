import React from "react";
import { Shield, User, Mail, LogOut, CheckCircle } from "lucide-react";
import { useAdminAuth } from "../Providers.tsx/AdminAuthContext";

interface InfoCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

export default function AdminUserProfile() {
  const { adminUser, logout, isAuthenticated } = useAdminAuth();

  if (!isAuthenticated || !adminUser) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center max-w-2xl mx-auto shadow-xs">
        <p className="text-xs font-medium text-slate-500">
          No authenticated administrator context found.
        </p>
      </div>
    );
  }

  const fullName = [adminUser.first_name, adminUser.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="max-w-8xl my-auto mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden h-[fit-content] ">
      
      {/* Header Profile Banner */}
      <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 opacity-40" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-xs shrink-0">
            <User size={28} className="text-slate-200" />
          </div>
          <div className="leading-tight min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-white truncate">
              {fullName || adminUser.username || "Operator Node"}
            </h2>
            <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
              @{adminUser.username || "system_user"}
            </p>
          </div>
        </div>
      </div>

      {/* Detail Metrics Engine Grid */}
      <div className="p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard
            icon={<User size={14} />}
            label="System Username"
            value={adminUser.username || "Not assigned"}
          />

          <InfoCard
            icon={<Mail size={14} />}
            label="Email Address"
            value={adminUser.email || "No email assigned"}
          />

          <InfoCard
            icon={<Shield size={14} />}
            label="Admin Authorization Access"
            value={adminUser.is_staff ? "Authorized Administrator" : "Standard User Access"}
            badge={
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide ${
                adminUser.is_staff ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-slate-50 text-slate-600 border border-slate-200"
              }`}>
                {adminUser.is_staff ? "Staff Node" : "External"}
              </span>
            }
          />

          <InfoCard
            icon={<CheckCircle size={14} />}
            label="Account Node Status"
            value={adminUser.is_active ? "Active Operational Status" : "Suspended Network Access"}
            badge={
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide ${
                adminUser.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}>
                {adminUser.is_active ? "Online" : "Offline"}
              </span>
            }
          />
        </div>

        {/* Action Controls Section */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-medium">
            Soko AI System Node Profile Management Portal
          </p>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold hover:bg-rose-100/70 transition-all cursor-pointer"
          >
            <LogOut size={13} />
            Disconnect Node
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon, badge }: InfoCardProps) {
  return (
    <div className="border border-slate-200/80 bg-slate-50/30 rounded-xl p-4 flex flex-col justify-between group transition-all hover:bg-white hover:border-slate-300/80">
      <div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2.5">
          <span className="text-slate-400 group-hover:text-slate-500 transition-colors shrink-0">{icon}</span>
          <span className="tracking-wide uppercase text-[10px] text-slate-400 font-semibold">{label}</span>
        </div>
        <div className="font-medium text-xs text-slate-800 break-all">
          {value}
        </div>
      </div>
      {badge && <div className="mt-3 flex">{badge}</div>}
    </div>
  );
}