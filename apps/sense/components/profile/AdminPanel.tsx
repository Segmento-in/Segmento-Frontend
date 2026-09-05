'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AuthUser } from '@/lib/auth';
import { apiClient, OrgInvite, OrgMember } from '@/lib/apiClient';
import {
  Users,
  UserPlus,
  Copy,
  Check,
  Ban,
  Trash2,
  ShieldCheck,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface AdminPanelProps {
  token: string;
  currentUser: AuthUser;
}

export default function AdminPanel({ token, currentUser }: AdminPanelProps) {
  // Members state
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Invites state
  const [invites, setInvites] = useState<OrgInvite[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [invitesError, setInvitesError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // Invite generator state
  const [inviteEmail, setInviteEmail] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  // ── Load Members ────────────────────────────────────────────────────────────
  const loadMembers = useCallback(async () => {
    if (!token) return;
    setMembersLoading(true);
    setMembersError(null);
    try {
      const data = await apiClient.listMembers(token);
      setMembers(data);
    } catch (err: any) {
      setMembersError(err?.message || 'Failed to load organization members');
    } finally {
      setMembersLoading(false);
    }
  }, [token]);

  // ── Load Invites ────────────────────────────────────────────────────────────
  const loadInvites = useCallback(async () => {
    if (!token) return;
    setInvitesLoading(true);
    setInvitesError(null);
    try {
      const data = await apiClient.listInvites(token);
      setInvites(data);
    } catch (err: any) {
      setInvitesError(err?.message || 'Failed to load invites history');
    } finally {
      setInvitesLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadMembers();
    loadInvites();
  }, [loadMembers, loadInvites]);

  // ── Generate Invite Handler ────────────────────────────────────────────────
  async function handleGenerateInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setGenerating(true);
    setGenerateError(null);
    setGeneratedUrl(null);
    setCopiedUrl(false);

    try {
      const res = await apiClient.generateInvite(inviteEmail.trim(), token);
      const fullUrl = res.invite_url.startsWith('http')
        ? res.invite_url
        : typeof window !== 'undefined'
        ? `${window.location.origin}${res.invite_url}`
        : res.invite_url;

      setGeneratedUrl(fullUrl);
      setInviteEmail('');
      // Reload invites list to reflect the new invite
      loadInvites();
    } catch (err: any) {
      setGenerateError(err?.message || 'Failed to generate invite');
    } finally {
      setGenerating(false);
    }
  }

  // ── Copy Link Helper ────────────────────────────────────────────────────────
  async function copyToClipboard(text: string, isGeneratedBanner = false, inviteId?: string) {
    try {
      await navigator.clipboard.writeText(text);
      if (isGeneratedBanner) {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
      if (inviteId) {
        setCopiedInviteId(inviteId);
        setTimeout(() => setCopiedInviteId(null), 2000);
      }
    } catch {
      // Fallback
    }
  }

  // ── Revoke Invite Handler ──────────────────────────────────────────────────
  async function handleRevokeInvite(inviteId: string) {
    setRevokingId(inviteId);
    try {
      await apiClient.revokeInvite(inviteId, token);
      await loadInvites();
    } catch (err: any) {
      alert(err?.message || 'Failed to revoke invite');
    } finally {
      setRevokingId(null);
    }
  }

  // ── Remove Member Handler ──────────────────────────────────────────────────
  async function handleRemoveMember(userId: string) {
    setRemovingId(userId);
    try {
      await apiClient.removeMember(userId, token);
      await loadMembers();
    } catch (err: any) {
      alert(err?.message || 'Failed to remove member');
    } finally {
      setRemovingId(null);
    }
  }

  function formatDate(iso: string | null) {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  return (
    <div data-testid="admin-panel" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Organization Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage team members and invite links for {currentUser.organization_name || 'your organization'}
          </p>
        </div>
      </div>

      {/* ── Section 1: Invite Generator ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Invite Teammate
          </h3>
        </div>

        <form onSubmit={handleGenerateInvite} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="invite-email" className="sr-only">
                Teammate Email
              </label>
              <input
                id="invite-email"
                type="email"
                required
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <button
              type="submit"
              disabled={generating || !inviteEmail.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating…</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Generate Invite</span>
                </>
              )}
            </button>
          </div>

          {generateError && (
            <div className="flex items-center gap-2 text-xs text-red-500 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generateError}</span>
            </div>
          )}

          {/* Generated URL Display Banner */}
          {generatedUrl && (
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4 mt-3">
              <p className="text-xs font-semibold text-blue-400 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Invite link generated! Send this URL to your teammate:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl}
                  data-testid="generated-invite-url"
                  className="flex-1 font-mono text-xs bg-slate-900/60 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-200 select-all"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedUrl, true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 transition-colors shrink-0"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* ── Section 2: Members List ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Organization Members ({members.length})
            </h3>
          </div>
          <button
            onClick={loadMembers}
            disabled={membersLoading}
            className="text-xs text-slate-400 hover:text-white transition-colors"
            title="Refresh members"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${membersLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {membersError && (
          <div className="text-xs text-red-400 mb-3">{membersError}</div>
        )}

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Joined</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    {membersLoading ? 'Loading members…' : 'No members found'}
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  const isCurrentAdmin =
                    member.user_id === currentUser.id || member.role === 'admin';

                  return (
                    <tr
                      key={member.user_id}
                      data-testid={`member-row-${member.user_id}`}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {member.name || '—'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {member.email}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            member.role === 'admin'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {member.role === 'admin' ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <Shield className="w-3 h-3" />
                          )}
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {formatDate(member.joined_at)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isCurrentAdmin ? (
                          <span className="text-[11px] text-slate-500 font-medium italic">
                            (Owner)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.user_id)}
                            disabled={removingId === member.user_id}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{removingId === member.user_id ? 'Removing…' : 'Remove'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 3: Invite History ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Invite History ({invites.length})
            </h3>
          </div>
          <button
            onClick={loadInvites}
            disabled={invitesLoading}
            className="text-xs text-slate-400 hover:text-white transition-colors"
            title="Refresh invites"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${invitesLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {invitesError && (
          <div className="text-xs text-red-400 mb-3">{invitesError}</div>
        )}

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Invited Email</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3">Expires</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {invites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    {invitesLoading ? 'Loading invite history…' : 'No invites generated yet'}
                  </td>
                </tr>
              ) : (
                invites.map((inv) => {
                  const isPending = inv.status === 'pending';
                  const isUsed = inv.status === 'used';
                  const isExpired = inv.status === 'expired';
                  const isRevoked = inv.status === 'revoked';

                  const fullUrl = inv.invite_url
                    ? (inv.invite_url.startsWith('http')
                        ? inv.invite_url
                        : typeof window !== 'undefined'
                        ? `${window.location.origin}${inv.invite_url}`
                        : inv.invite_url)
                    : (inv.token
                        ? (typeof window !== 'undefined' ? `${window.location.origin}/join/${inv.token}` : `/join/${inv.token}`)
                        : null);

                  return (
                    <tr
                      key={inv.id}
                      data-testid={`invite-row-${inv.id}`}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {inv.invited_email}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          data-testid={`status-badge-${inv.id}`}
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            isPending
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : isUsed
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isExpired
                              ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {isPending && <Clock className="w-3 h-3" />}
                          {isUsed && <CheckCircle2 className="w-3 h-3" />}
                          {isExpired && <XCircle className="w-3 h-3" />}
                          {isRevoked && <Ban className="w-3 h-3" />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {formatDate(inv.created_at)}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {formatDate(inv.expires_at)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          {isPending && fullUrl && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(fullUrl, false, inv.id)}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                              title="Copy invite URL"
                            >
                              {copiedInviteId === inv.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-300" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>
                          )}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleRevokeInvite(inv.id)}
                              disabled={revokingId === inv.id}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                              title="Revoke pending invite"
                            >
                              <Ban className="w-3 h-3" />
                              <span>{revokingId === inv.id ? 'Revoking…' : 'Revoke'}</span>
                            </button>
                          )}
                          {!isPending && (
                            <span className="text-[11px] text-slate-600 dark:text-slate-500">
                              —
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
