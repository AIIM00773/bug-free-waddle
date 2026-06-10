import React, { useState } from 'react';
import { 
  User, 
  Search, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  RefreshCw, 
  Ban, 
  CheckCircle2, 
  Mail, 
  Lock,
  UserCheck
} from 'lucide-react';

// Strict administrative data architecture mapping cleanly to custom Django Auth extensions
interface AppUserNode {
  id: string;
  maskedEmail: string;
  clearTextEmailProxy: string; // Exposed only upon intentional administrative trigger
  dateJoined: string;
  accountRole: 'standard_user' | 'moderator_admin' | 'system_developer';
  accountStatus: 'active' | 'suspended_breach' | 'pending_verification';
  totalAlertsConfigured: number; // e.g. Smart tracking hooks for missing categories
}

export default function PlatformUsersView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [revealedUserId, setRevealedUserId] = useState<string | null>(null);

  const [users, setUsers] = useState<AppUserNode[]>([
    {
      id: "USR-0041-KE",
      maskedEmail: "mwangi.*******@gmail.com",
      clearTextEmailProxy: "mwangi.dev@gmail.com",
      dateJoined: "2026-05-12",
      accountRole: "system_developer",
      accountStatus: "active",
      totalAlertsConfigured: 14
    },
    {
      id: "USR-9912-KE",
      maskedEmail: "kamau.******@outlook.com",
      clearTextEmailProxy: "kamau.j@outlook.com",
      dateJoined: "2026-05-28",
      accountRole: "standard_user",
      accountStatus: "active",
      totalAlertsConfigured: 3
    },
    {
      id: "USR-3049-UG",
      maskedEmail: "atieno.******@yahoo.com",
      clearTextEmailProxy: "atieno_fit@yahoo.com",
      dateJoined: "2026-06-02",
      accountRole: "standard_user",
      accountStatus: "pending_verification",
      totalAlertsConfigured: 0
    },
    {
      id: "USR-1102-TZ",
      maskedEmail: "bad.actor.*****@gmail.com",
      clearTextEmailProxy: "bad.actor.scraping@gmail.com",
      dateJoined: "2026-06-05",
      accountRole: "standard_user",
      accountStatus: "suspended_breach",
      totalAlertsConfigured: 89 // System flag: abnormal high-frequency automation pattern
    }
  ]);

  const triggerDirectorySync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);
  };

  const toggleUserLifecycleState = (id: string, targetStatus: AppUserNode['accountStatus']) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, accountStatus: targetStatus };
      }
      return u;
    }));
  };

  const handleToggleRevealPII = (userId: string) => {
    if (revealedUserId === userId) {
      setRevealedUserId(null);
    } else {
      // Security Practice Hook: Log event internally to your backend server audits here
      console.warn(`AUDIT LOG TRIGGERED: Admin accessed cleartext PII identity parameters for node: ${userId}`);
      setRevealedUserId(userId);
    }
  };

  const filteredUsers = users.filter(user => {
    const targetQuery = searchQuery.toLowerCase();
    const matchesSearch = user.id.toLowerCase().includes(targetQuery) || 
                          user.clearTextEmailProxy.toLowerCase().includes(targetQuery);
    const matchesRole = roleFilter === 'all' || user.accountRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fadeIn p-0.5">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">User Identity Directory</h2>
          <p className="text-xs text-slate-400">
            Audit system access controls, track metric triggers, and securely manage platform permission states while maintaining data compliance layers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={triggerDirectorySync}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Poll User Directory State"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* FILTER CONTROL CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts via ID or email parameters..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-slate-300 focus:bg-white cursor-pointer transition-all"
          >
            <option value="all">All Group Roles</option>
            <option value="standard_user">Standard Consumers</option>
            <option value="moderator_admin">Moderator Admins</option>
            <option value="system_developer">Core Engineers</option>
          </select>
        </div>
      </div>

      {/* SECURED USER ACCOUNT TABLE DIRECTORY */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">User Token ID</th>
                <th className="py-3 px-4">Account Reference Context (Masked PII Layer)</th>
                <th className="py-3 px-4">Authorization Group</th>
                <th className="py-3 px-4">Deal Targets Tracking</th>
                <th className="py-3 px-4">Account State</th>
                <th className="py-3 px-4 text-right">Administrative Interventions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Token Identifier */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {user.id}
                    </td>

                    {/* Masked PII Identity Node with JIT Visibility Switcher */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5 max-w-xs">
                        <span className="font-mono text-slate-800 text-[11px] truncate">
                          {revealedUserId === user.id ? user.clearTextEmailProxy : user.maskedEmail}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleRevealPII(user.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-sm hover:bg-slate-100 transition-colors cursor-pointer"
                          title={revealedUserId === user.id ? "Mask PII Context Data" : "Inspect Cleartext Identity (Logs Action to Audit Feed)"}
                        >
                          {revealedUserId === user.id ? <EyeOff size={11} /> : <Eye size={11} />}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal tracking-tight block mt-0.5">Joined {user.dateJoined}</span>
                    </td>

                    {/* Authorization Role Mapping */}
                    <td className="py-3.5 px-4">
                      {user.accountRole === 'system_developer' && (
                        <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-100 font-mono px-2 py-0.5 rounded-md">
                          Core Engineer
                        </span>
                      )}
                      {user.accountRole === 'moderator_admin' && (
                        <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                          Staff Moderator
                        </span>
                      )}
                      {user.accountRole === 'standard_user' && (
                        <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          End Consumer
                        </span>
                      )}
                    </td>

                    {/* App Specific Activity Track */}
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {user.totalAlertsConfigured} alerts active
                    </td>

                    {/* Functional Status Flag */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {user.accountStatus === 'active' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          <CheckCircle2 size={10} /> Active
                        </span>
                      )}
                      {user.accountStatus === 'pending_verification' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                          <RefreshCw size={10} className="animate-spin" /> Verification
                        </span>
                      )}
                      {user.accountStatus === 'suspended_breach' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                          <ShieldAlert size={10} /> Suspended
                        </span>
                      )}
                    </td>

                    {/* Core System Intervention Triggers */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {user.accountStatus === 'suspended_breach' ? (
                          <button
                            type="button"
                            onClick={() => toggleUserLifecycleState(user.id, 'active')}
                            className="px-2 py-1 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 rounded-lg shadow-2xs transition-all text-[11px] cursor-pointer inline-flex items-center gap-1"
                          >
                            <UserCheck size={11} /> Reinstate
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleUserLifecycleState(user.id, 'suspended_breach')}
                            className="px-2 py-1 bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-lg shadow-2xs transition-all text-[11px] cursor-pointer inline-flex items-center gap-1"
                            disabled={user.accountRole === 'system_developer'}
                            title={user.accountRole === 'system_developer' ? "Core developers cannot be suspended via dashboard operations." : "Suspend profile access handles"}
                          >
                            <Ban size={11} /> Suspend Profile
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldAlert size={20} className="text-slate-300" />
                      <span>No verified user accounts match current filter matrices.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}