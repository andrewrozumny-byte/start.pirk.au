"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, GripVertical } from "lucide-react";
import Link from "next/link";

interface MatchSurgeon {
  id: string;
  rank: number;
  finalScore: number;
  matchReason: string;
  strengthsSummary: string;
  considerationsSummary: string;
  adminNotes: string;
  surgeon: {
    id: string;
    name: string;
    practiceName: string;
    state: string;
    googleRating: number;
  };
}

interface MatchData {
  id: string;
  status: string;
  client: { name: string; procedure: string };
  matchSurgeons: MatchSurgeon[];
}

export default function MatchReviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [match, setMatch] = useState<MatchData | null>(null);
  const [surgeons, setSurgeons] = useState<MatchSurgeon[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/match/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setMatch(data);
        setSurgeons(data.matchSurgeons || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load match");
        setLoading(false);
      });
  }, [id]);

  function moveUp(index: number) {
    if (index === 0) return;
    const newSurgeons = [...surgeons];
    [newSurgeons[index - 1], newSurgeons[index]] = [
      newSurgeons[index],
      newSurgeons[index - 1],
    ];
    newSurgeons.forEach((s, i) => (s.rank = i + 1));
    setSurgeons(newSurgeons);
  }

  function moveDown(index: number) {
    if (index === surgeons.length - 1) return;
    const newSurgeons = [...surgeons];
    [newSurgeons[index], newSurgeons[index + 1]] = [
      newSurgeons[index + 1],
      newSurgeons[index],
    ];
    newSurgeons.forEach((s, i) => (s.rank = i + 1));
    setSurgeons(newSurgeons);
  }

  function updateSurgeon(index: number, field: string, value: string) {
    const newSurgeons = [...surgeons];
    ((newSurgeons[index] as unknown) as Record<string, unknown>)[field] = value;
    setSurgeons(newSurgeons);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/match/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "reviewed",
          matchSurgeons: surgeons.map((s) => ({
            id: s.id,
            rank: s.rank,
            matchReason: s.matchReason,
            adminNotes: s.adminNotes,
          })),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Match reviewed and saved");
      router.push(`/match/${id}`);
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-coral" />
      </div>
    );
  }

  if (!match) return <p className="text-warm-grey">Match not found</p>;

  return (
    <div className="max-w-4xl">
      <Link
        href={`/match/${id}`}
        className="flex items-center gap-1 text-sm text-warm-grey hover:text-coral mb-4 transition-colors"
      >
        <ArrowLeft className="w-3 h-3" /> Back to results
      </Link>

      <h1 className="text-2xl font-semibold text-near-black tracking-tight mb-1">
        Review Matches — {match.client.name}
      </h1>
      <p className="text-warm-grey text-sm mb-8">
        Reorder surgeons, edit reasoning, and add notes before generating the
        PDF
      </p>

      <div className="space-y-4 mb-8">
        {surgeons.map((ms, i) => (
          <div
            key={ms.id}
            className={`bg-white rounded-xl border p-5 ${
              i === 0 ? "border-coral border-[1.5px]" : "border-coral-mid/30"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Reorder controls */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <GripVertical className="w-4 h-4 text-warm-grey/40" />
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="text-[10px] text-warm-grey hover:text-coral disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === surgeons.length - 1}
                  className="text-[10px] text-warm-grey hover:text-coral disabled:opacity-30"
                >
                  ▼
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full ${
                      i === 0
                        ? "bg-coral text-white"
                        : "bg-coral-light text-coral"
                    }`}
                  >
                    #{i + 1}
                    {i === 0 ? " — Pirk Pick" : ""}
                  </span>
                  <h3 className="font-semibold text-near-black">
                    {ms.surgeon.name}
                  </h3>
                  <span className="text-xs text-warm-grey">
                    {ms.surgeon.practiceName} · {ms.surgeon.state} ·{" "}
                    {ms.surgeon.googleRating}★
                  </span>
                  <span className="ml-auto text-sm font-bold text-coral">
                    {ms.finalScore}/100
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-warm-grey font-medium mb-1">
                      Match Reasoning (shown on PDF)
                    </label>
                    <textarea
                      value={ms.matchReason}
                      onChange={(e) =>
                        updateSurgeon(i, "matchReason", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-coral-mid/30 rounded-lg text-sm text-near-black bg-cream/30 focus:outline-none focus:ring-2 focus:ring-coral/30 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-warm-grey font-medium mb-1">
                      Admin Notes (internal only)
                    </label>
                    <input
                      type="text"
                      value={ms.adminNotes}
                      onChange={(e) =>
                        updateSurgeon(i, "adminNotes", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-coral-mid/30 rounded-lg text-sm text-near-black bg-cream/30 focus:outline-none focus:ring-2 focus:ring-coral/30"
                      placeholder="Internal notes..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href={`/match/${id}`}
          className="bg-white text-near-black border border-coral-mid/30 hover:bg-cream rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-coral text-white hover:bg-coral/90 disabled:opacity-50 rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save & Mark Reviewed"}
        </button>
      </div>
    </div>
  );
}
