import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  ShieldAlert,
  RefreshCw,
  Ban,
  CheckCircle2,
  Mail,
  Lock,
  UserCheck,
  Plus,
  X,
  SlidersHorizontal,
  Trash2
} from 'lucide-react';
import type { AppUser } from '../Providers.tsx/PlatformUsersContext';
import { usePlatformUsers } from '../Providers.tsx/PlatformUsersContext';
export default function PlatformUsersView() {
  const {
    users,
    isLoading,
    error,
    refreshDirectory,
    updateUserRole,
    updateUserStatus,
    deleteUserAccount
  } = usePlatformUsers();

  // Search & State Matrix Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [revealedUserId, setRevealedUserId] = useState<string | null>(null);

  // Modal / Drawer Configurations 
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Targeted Context Selection
  const [targetUserId, setTargetUserId] = useState('');
  const [selectedRoleInput, setSelectedRoleInput] = useState<AppUser['accountRole']>('standard_user');

  // JIT Initial Core Engine Data Load
  useEffect(() => {
    refreshDirectory();
  }, [refreshDirectory]);

  // Performance Optimization: Memoized filtration processing
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const targetQuery = searchQuery.toLowerCase();
      const matchesSearch = user.id.toLowerCase().includes(targetQuery) ||
        user.clearTextEmailProxy.toLowerCase().includes(targetQuery);
      const matchesRole = roleFilter === 'all' || user.accountRole === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.accountStatus === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleToggleRevealPII = (userId: string) => {
    if (revealedUserId === userId) {
      setRevealedUserId(null);
    } else {
      console.warn(`[AUDIT COMPLIANCE]: Admin PII Read-Access Authorization granted for node ID: ${userId} at timestamp ${new Date().toISOString()}`);
      setRevealedUserId(userId);
    }
  };

  const openRoleModal = (user: AppUser) => {
    setTargetUserId(user.id);
    setSelectedRoleInput(user.accountRole);
    setIsRoleModalOpen(true);
  };

  const handleRoleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetUserId) {
      try {
        await updateUserRole(targetUserId, selectedRoleInput);
      } finally {
        // Guarantee modal closes and state resets regardless of success or API error
        setIsRoleModalOpen(false);
        setTargetUserId('');
      }
    }
  };

  const openDeleteModal = (id: string) => {
    setTargetUserId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (targetUserId) {
      try {
        await deleteUserAccount(targetUserId);
      } finally {
        setIsDeleteModalOpen(false);
        setTargetUserId('');
      }
    }
  };

  return (
    <div className="space-y-6 p-4 text-slate-800 antialiased">

      {/* DIRECTORY SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">User Identity Directory</h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Global sokoAI user directory and administrative management panel.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={refreshDirectory}
            disabled={isLoading}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-40"
            title="Poll Directory System Cluster State"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={() => alert("Feature not available at the moment.")}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus size={15} /> Account
          </button>
        </div>
      </div>

      {/* CORE EXCEPTIONS HANDLER */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <ShieldAlert size={16} className="shrink-0 text-rose-500 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Directory Scope Security Exception</span>
            <p className="text-rose-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* INTERACTIVE CONTROLS CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-3 justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts via identifier tokens or canonical proxies..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2.5 self-end lg:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <SlidersHorizontal size={12} className="text-slate-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Filters</span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer transition-all shadow-sm"
          >
            <option value="all">All Group Roles</option>
            <option value="standard_user">Standard End Consumers</option>
            <option value="moderator_admin">Staff Moderator Admins</option>
            <option value="system_developer">Core Infrastructure Engineers</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer transition-all shadow-sm"
          >
            <option value="all">All Access States</option>
            <option value="active">Active System Scope</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="suspended_breach">Suspended Breach Lock</option>
          </select>
        </div>
      </div>

      {/* MATRIX RECORDS TABLE OVERVIEW */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Token ID</th>
                <th className="py-3.5 px-5">Account Identity</th>
                <th className="py-3.5 px-5">Auth Group</th>
                <th className="py-3.5 px-5">Access State</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">

                    {/* User Token Identifier Code */}
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-500 font-bold">
                      {user.id.length > 10 ? `${user.id.slice(0, 10)}...` : user.id}
                    </td>

                    {/* JIT Visibility Proxy Module */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 max-w-xs">
                        <span className="font-mono text-slate-900 text-[11px] truncate bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100 shadow-sm">
                          {revealedUserId === user.id ? user.clearTextEmailProxy : user.maskedEmail}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleRevealPII(user.id)}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                          title={revealedUserId === user.id ? "Mask Identity Endpoint Layer" : "JIT De-mask Cleartext PII (Emits Audit Event Log)"}
                        >
                          {revealedUserId === user.id ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal mt-1 flex items-center gap-1">
                        <Mail size={10} className="text-slate-300" /> Registered on {user.dateJoined}
                      </div>
                    </td>

                    {/* Dynamic Role Badging Interface */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {user.accountRole === 'system_developer' && (
                        <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 font-mono font-bold rounded-lg shadow-sm">
                          Core Engineer
                        </span>
                      )}
                      {user.accountRole === 'moderator_admin' && (
                        <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 font-bold rounded-lg shadow-sm">
                          Staff Moderator
                        </span>
                      )}
                      {user.accountRole === 'standard_user' && (
                        <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 font-bold rounded-lg">
                          End Consumer
                        </span>
                      )}
                    </td>

                    {/* Verified Lifecycle Indicators */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {user.accountStatus === 'active' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md">
                          <CheckCircle2 size={11} /> Active Account
                        </span>
                      )}
                      {user.accountStatus === 'pending_verification' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-md">
                          <RefreshCw size={11} className="animate-spin" /> Pending Review
                        </span>
                      )}
                      {user.accountStatus === 'suspended_breach' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-md">
                          <ShieldAlert size={11} /> Locked Out
                        </span>
                      )}
                    </td>

                    {/* Action Engine Row Interventions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openRoleModal(user)}
                          className="px-2 py-1 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 rounded-lg shadow-sm text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          Modify Role
                        </button>

                        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

                        {user.accountStatus === 'suspended_breach' ? (
                          <button
                            type="button"
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className="p-1.5 text-emerald-600 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 rounded-lg shadow-sm cursor-pointer"
                            title="Reinstate Global App Core Token Routing Scopes"
                          >
                            <UserCheck size={13} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateUserStatus(user.id, 'suspended_breach')}
                            className="p-1.5 text-rose-600 bg-white flex flex-row items-center gap-1 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 rounded-lg shadow-sm cursor-pointer disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-slate-200"
                            disabled={user.accountRole === 'system_developer'}
                            title={user.accountRole === 'system_developer' ? "Security Guardrail Boundary Protect: Core Dev Node Cannot Be Revoked." : "Suspend profile access handles"}
                          >
                            <Ban size={13} /> Suspend
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openDeleteModal(user.id)}
                          className="p-1.5 text-slate-400 flex flex-row items-center gap-1 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 cursor-pointer"
                          title="Purge Identity Profile"
                        >
                          <Trash2 size={13} /> Purge
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-semibold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldAlert size={24} className="text-slate-300 stroke-[1.5]" />
                      <span className="text-xs">No administrative profile mappings intersect current directory criteria filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DYNAMIC SETTINGS MODAL: AUTHORIZATION GROUP MODIFICATION */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsRoleModalOpen(false)}>
          <div
            className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Lock size={14} className="text-slate-500" />
                <h4 className="text-xs">Alter Authorization Scope: {targetUserId.slice(0, 15)}...</h4>
              </div>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleRoleConfigSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1.5">
                <label className="text-slate-500">Security Group Mapping Strategy</label>
                <select
                  value={selectedRoleInput}
                  onChange={(e) => setSelectedRoleInput(e.target.value as AppUser['accountRole'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold cursor-pointer focus:bg-white focus:outline-none focus:border-slate-400"
                >
                  <option value="standard_user">Standard End Consumer</option>
                  <option value="moderator_admin">Staff Moderator Admin</option>
                  <option value="system_developer">Core Infrastructure Engineer</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button type="button" onClick={() => setIsRoleModalOpen(false)} className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="w-1/2 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm cursor-pointer">Re-allocate Group</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECURE DIRECTORY PRUNING CONFIRM DIALOG */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsDeleteModalOpen(false)}>
          <div
            className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center shrink-0 text-rose-600">
                <Trash2 size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Purge Node Identity Profile?</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Are you completely sure you want to remove <strong className="text-slate-700 font-bold">{targetUserId}</strong> from your internal authorization framework? This action invalidates token routes.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl cursor-pointer">Maintain Vector</button>
              <button type="button" onClick={handleDeleteConfirm} className="w-1/2 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer shadow-sm transition-colors">Confirm Purge</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}