"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  Mail,
  Check,
  TrendingUp,
  Minus,
  TrendingDown,
  Loader2,
  Search,
  Filter,
} from "lucide-react";

interface SurgeonProfile {
  id: string;
  name: string;
  practiceName: string;
  state: string;
  profileToken: string;
  lastProfileUpdate: string | null;
  reminderSentAt: string | null;
  acceptingPatients: boolean;
  score: number;
  ranking: "great" | "ok" | "needs-work";
  rankLabel: string;
  filled: number;
  total: number;
}

export default function SurgeonProfilesPage() {
  const [profiles, setProfiles] = useState<SurgeonProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "great" | "ok" | "needs-work">(
    "all"
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [emailCopiedId, setEmailCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/surgeon-profiles")
      .then((r) => r.json())
      .then((data) => {
        setProfiles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  const copyLink = (token: string, id: string) => {
    navigator.clipboard.writeText(`${baseUrl}/profile/${token}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyReminderEmail = async (profile: SurgeonProfile) => {
    const link = `${baseUrl}/profile/${profile.profileToken}`;
    const firstName = profile.name.split(" ")[0];

    const subject = `${firstName}, your Pirk profile needs an update`;
    const body = `Hi ${firstName},

Just a friendly reminder to keep your Pirk profile up to date. Your current profile completeness is ${profile.score}% — ${profile.ranking === "great" ? "great work!" : profile.ranking === "ok" ? "not bad, but there's room to improve." : "there are some gaps that could be impacting your referrals."}

Take 5 minutes to review and update your details:
${link}

A complete profile helps us match you with the right clients more confidently. The more information we have, the better we can represent your practice.

Thanks,
The Pirk Team`;

    await navigator.clipboard.writeText(
      `Subject: ${subject}\n\n${body}`
    );

    // Mark reminder as sent
    await fetch("/api/surgeon-profiles/remind", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surgeonId: profile.id }),
    });

    setEmailCopiedId(profile.id);
    setTimeout(() => setEmailCopiedId(null), 3000);

    // Update local state
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profile.id
          ? { ...p, reminderSentAt: new Date().toISOString() }
          : p
      )
    );
  };

  const filtered = profiles
    .filter((p) => {
      if (filter !== "all" && p.ranking !== filter) return false;
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.practiceName.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => a.score - b.score); // worst first so you know who to chase

  const avgScore = profiles.length
    ? Math.round(profiles.reduce((s, p) => s + p.score, 0) / profiles.length)
    : 0;

  const counts = {
    great: profiles.filter((p) => p.ranking === "great").length,
    ok: profiles.filter((p) => p.ranking === "ok").length,
    "needs-work": profiles.filter((p) => p.ranking === "needs-work").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-coral" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">
          Surgeon Profiles
        </h1>
        <p className="text-warm-grey text-sm mt-1">
          Monitor profile completeness and send update reminders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-coral-mid/30 p-4">
          <p className="text-sm text-warm-grey">Average Score</p>
          <p className="text-3xl font-bold text-charcoal mt-1">{avgScore}%</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <p className="text-sm text-emerald-700">Ranking Well</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {counts.great}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4">
          <div className="flex items-center gap-2">
            <Minus className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-amber-700">OK</p>
          </div>
          <p className="text-3xl font-bold text-amber-600 mt-1">{counts.ok}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-600">Needs Work</p>
          </div>
          <p className="text-3xl font-bold text-red-500 mt-1">
            {counts["needs-work"]}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search surgeons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as "all" | "great" | "ok" | "needs-work"
              )
            }
            className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none appearance-none bg-white"
          >
            <option value="all">All ({profiles.length})</option>
            <option value="great">Ranking Well ({counts.great})</option>
            <option value="ok">OK ({counts.ok})</option>
            <option value="needs-work">Needs Work ({counts["needs-work"]})</option>
          </select>
        </div>
      </div>

      {/* Surgeon List */}
      <div className="bg-white rounded-xl border border-coral-mid/30 overflow-hidden">
        <table className="w-full">
          <thead className="bg-cream/50 border-b border-coral-mid/20">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-warm-grey uppercase">
                Surgeon
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-warm-grey uppercase">
                State
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-warm-grey uppercase">
                Score
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-warm-grey uppercase">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-warm-grey uppercase">
                Last Updated
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-warm-grey uppercase">
                Last Reminded
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-warm-grey uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((profile) => {
              const scoreColor =
                profile.ranking === "great"
                  ? "text-emerald-600"
                  : profile.ranking === "ok"
                    ? "text-amber-600"
                    : "text-red-500";
              const scoreBg =
                profile.ranking === "great"
                  ? "bg-emerald-50"
                  : profile.ranking === "ok"
                    ? "bg-amber-50"
                    : "bg-red-50";
              const RankIcon =
                profile.ranking === "great"
                  ? TrendingUp
                  : profile.ranking === "ok"
                    ? Minus
                    : TrendingDown;

              return (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {profile.name}
                    </p>
                    {profile.practiceName && (
                      <p className="text-xs text-gray-500">
                        {profile.practiceName}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {profile.state || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${scoreBg} ${scoreColor}`}
                      >
                        <RankIcon className="h-3 w-3" />
                        {profile.score}%
                      </span>
                      <span className="text-xs text-gray-400">
                        {profile.filled}/{profile.total}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        profile.acceptingPatients
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {profile.acceptingPatients ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {profile.lastProfileUpdate
                      ? new Date(profile.lastProfileUpdate).toLocaleDateString(
                          "en-AU",
                          { day: "numeric", month: "short" }
                        )
                      : "Never"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {profile.reminderSentAt
                      ? new Date(profile.reminderSentAt).toLocaleDateString(
                          "en-AU",
                          { day: "numeric", month: "short" }
                        )
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() =>
                          copyLink(profile.profileToken, profile.id)
                        }
                        className="p-1.5 text-gray-400 hover:text-[#8B2252] hover:bg-[#8B2252]/5 rounded-lg transition-colors"
                        title="Copy profile link"
                      >
                        {copiedId === profile.id ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => copyReminderEmail(profile)}
                        className="p-1.5 text-gray-400 hover:text-[#8B2252] hover:bg-[#8B2252]/5 rounded-lg transition-colors"
                        title="Copy reminder email"
                      >
                        {emailCopiedId === profile.id ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No surgeons match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
