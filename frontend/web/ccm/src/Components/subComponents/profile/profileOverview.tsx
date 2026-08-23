import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Hash,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useProfile } from '../../../Providers/profileContext';

interface ProfileOverviewProps {
  activeTab: string | null;
  profile: {
    phone?: string;
    email?: string;
    estate_area_neighborhood?: string;
    sub_county?: string;
    county?: string;
    country?: string;
    dob?: string;
    national_id_number?: string;
    gender?: string;
  };
  ShowPersonalDetails?: boolean;
}


export function ProfileOverview({
  activeTab,
  profile,
  ShowPersonalDetails = true,
}: ProfileOverviewProps) {
  const { user, isAuthenticated } = useProfile();
  const [viewHiddenKYC, setViewHiddenKYC] = useState(false);

  // Guard clause: Only render when active tab is 'identity'
  if (activeTab !== "identity") return null;

  return (
    <div
      className={`lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 ${
        ShowPersonalDetails ? "" : "hidden"
      }`}
    >
      {/* User Profile Card */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
        <div className="overflow-hidden">
          <h3 className="font-bold text-slate-900 text-base truncate">
            {user?.first_name
              ? `${user.first_name} ${user.last_name || ""}`.trim()
              : user?.full_name || "User"}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isAuthenticated ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <span className="text-[10px] font-light text-slate-600 lowercase tracking-wider">
              {isAuthenticated ? "Verified Account" : "Guest Account"}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Summary */}
      <div className="space-y-3 pb-6 border-b border-slate-100">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Contact Info
        </h4>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-3 text-slate-600">
            <Phone size={15} className="text-slate-400 shrink-0" />
            <span className="font-mono text-slate-800 font-medium">
              {profile?.phone || "No phone set"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <Mail size={15} className="text-slate-400 shrink-0" />
            <span className="truncate text-slate-800 font-medium">
              {profile?.email || "No email set"}
            </span>
          </div>
        </div>
      </div>

      {/* Address Summary */}
      <div className="space-y-3 pb-6 border-b border-slate-100">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Default Delivery
        </h4>
        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="flex items-start gap-3">
            <MapPin
              size={15}
              className="text-slate-400 shrink-0 mt-0.5"
            />
            <div>
              <p className="font-semibold text-slate-800">
                {profile?.estate_area_neighborhood || "Location not specified"}
              </p>
              <p className="text-slate-500 mt-0.5">
                {[
                  profile?.sub_county,
                  profile?.county,
                  profile?.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User KYC Details */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>KYC Details</span>
          <button
            type="button"
            onClick={() => setViewHiddenKYC(!viewHiddenKYC)}
            className="cursor-pointer text-sky-500 hover:text-sky-600 transition-colors p-1"
            title={viewHiddenKYC ? "Hide KYC Details" : "Show KYC Details"}
          >
            {viewHiddenKYC ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </h4>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-500 flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              Date of birth
            </span>
            <input
              className="font-semibold text-slate-800 bg-transparent text-right border-none outline-none w-36 focus:ring-0 cursor-default"
              value={profile?.dob || "—"}
              disabled
              type={viewHiddenKYC ? "text" : "password"}
            />
          </div>

          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-500 flex items-center gap-2">
              <Hash size={14} className="text-slate-400" />
              National ID
            </span>
            <input
              className="font-semibold font-mono text-slate-800 bg-transparent text-right border-none outline-none w-36 focus:ring-0 cursor-default"
              value={profile?.national_id_number || "—"}
              disabled
              type={viewHiddenKYC ? "text" : "password"}
            />
          </div>

          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-500 flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              Gender
            </span>
            <input
              className="font-semibold text-slate-800 bg-transparent text-right border-none outline-none w-36 focus:ring-0 cursor-default"
              value={profile?.gender || "—"}
              disabled
              type={viewHiddenKYC ? "text" : "password"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
