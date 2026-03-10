"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  calculateCompleteness,
  type CompletenessResult,
} from "@/lib/profile-completeness";
import {
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  TrendingUp,
  Minus,
  TrendingDown,
} from "lucide-react";

interface SurgeonData {
  [key: string]: unknown;
  name: string;
  proceduresOffered: string;
  priceRanges: string;
  beforeAfterLinks: string;
}

const PROCEDURE_OPTIONS = [
  // Breast
  { slug: "breast-augmentation", label: "Breast Augmentation", category: "Breast" },
  { slug: "breast-reduction", label: "Breast Reduction", category: "Breast" },
  { slug: "breast-lift", label: "Breast Lift (Mastopexy)", category: "Breast" },
  { slug: "breast-revision", label: "Breast Revision", category: "Breast" },
  { slug: "breast-implant-removal", label: "Breast Implant Removal", category: "Breast" },
  { slug: "capsulectomy", label: "Capsulectomy", category: "Breast" },
  { slug: "gynecomastia", label: "Gynecomastia (Male Breast Reduction)", category: "Breast" },

  // Face
  { slug: "rhinoplasty", label: "Rhinoplasty (Nose Job)", category: "Face" },
  { slug: "facelift", label: "Facelift", category: "Face" },
  { slug: "blepharoplasty", label: "Blepharoplasty (Eyelid Surgery)", category: "Face" },
  { slug: "brow-lift", label: "Brow Lift", category: "Face" },
  { slug: "neck-lift", label: "Neck Lift", category: "Face" },
  { slug: "otoplasty", label: "Otoplasty (Ear Surgery)", category: "Face" },
  { slug: "chin-augmentation", label: "Chin Augmentation", category: "Face" },

  // Body
  { slug: "tummy-tuck", label: "Tummy Tuck (Abdominoplasty)", category: "Body" },
  { slug: "liposuction", label: "Liposuction", category: "Body" },
  { slug: "bbl", label: "BBL (Brazilian Butt Lift)", category: "Body" },
  { slug: "mummy-makeover", label: "Mummy Makeover", category: "Body" },
  { slug: "body-lift", label: "Body Lift", category: "Body" },
  { slug: "arm-lift", label: "Arm Lift (Brachioplasty)", category: "Body" },
  { slug: "thigh-lift", label: "Thigh Lift", category: "Body" },
  { slug: "fat-transfer", label: "Fat Transfer", category: "Body" },
  { slug: "labiaplasty", label: "Labiaplasty", category: "Body" },
];

export default function SurgeonProfilePage() {
  const params = useParams<{ token: string }>();
  const [surgeon, setSurgeon] = useState<SurgeonData | null>(null);
  const [completeness, setCompleteness] = useState<CompletenessResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [priceRanges, setPriceRanges] = useState<
    Record<string, { min: string; max: string; notes?: string }>
  >({});

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/surgeon-profile/${params.token}`);
      if (!res.ok) throw new Error("Profile not found");
      const data = await res.json();
      setSurgeon(data);
      setCompleteness(calculateCompleteness(data));
      try {
        setPriceRanges(JSON.parse(data.priceRanges || "{}"));
      } catch {
        setPriceRanges({});
      }
    } catch {
      setError("This profile link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  }, [params.token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const startEditing = (key: string) => {
    if (!surgeon) return;
    const val = surgeon[key];
    setEditValues((prev) => ({
      ...prev,
      [key]: typeof val === "string" ? val : val?.toString() ?? "",
    }));
    setEditingField(key);
  };

  const saveField = async (key: string) => {
    if (!surgeon) return;
    setSaving(true);
    try {
      let value: unknown = editValues[key];

      // Handle numeric fields
      if (key === "yearOfCompletion") {
        value = value ? parseInt(value as string) : null;
      } else if (key === "googleRating") {
        value = value ? parseFloat(value as string) : 0;
      } else if (key === "googleReviewCount") {
        value = value ? parseInt(value as string) : 0;
      }

      const res = await fetch(`/api/surgeon-profile/${params.token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });

      if (!res.ok) throw new Error("Failed to save");

      // Refresh data
      await fetchProfile();
      setEditingField(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updatePriceRange = (
    slug: string,
    field: "min" | "max",
    value: string
  ) => {
    setPriceRanges((prev) => ({
      ...prev,
      [slug]: { ...{ min: "", max: "" }, ...prev[slug], [field]: value },
    }));
  };

  const savePriceRanges = async () => {
    if (!surgeon) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/surgeon-profile/${params.token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceRanges: JSON.stringify(priceRanges) }),
      });
      if (!res.ok) throw new Error("Failed to save");
      await fetchProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save prices. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleProcedure = async (slug: string) => {
    if (!surgeon) return;
    let current: string[] = [];
    try {
      current = JSON.parse(surgeon.proceduresOffered || "[]");
    } catch {
      current = [];
    }

    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];

    setSaving(true);
    try {
      const res = await fetch(`/api/surgeon-profile/${params.token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proceduresOffered: JSON.stringify(updated) }),
      });
      if (!res.ok) throw new Error("Failed to save");
      await fetchProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleAcceptingPatients = async () => {
    if (!surgeon) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/surgeon-profile/${params.token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptingPatients: !surgeon.acceptingPatients }),
      });
      if (!res.ok) throw new Error("Failed to save");
      await fetchProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B2252]" />
      </div>
    );
  }

  if (error || !surgeon || !completeness) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600">{error ?? "Profile not found."}</p>
        </div>
      </div>
    );
  }

  const procedures: string[] = (() => {
    try {
      return JSON.parse(surgeon.proceduresOffered || "[]");
    } catch {
      return [];
    }
  })();

  const RankingIcon =
    completeness.ranking === "great"
      ? TrendingUp
      : completeness.ranking === "ok"
        ? Minus
        : TrendingDown;

  const rankColor =
    completeness.ranking === "great"
      ? "text-emerald-600"
      : completeness.ranking === "ok"
        ? "text-amber-600"
        : "text-red-500";

  const rankBg =
    completeness.ranking === "great"
      ? "bg-emerald-50 border-emerald-200"
      : completeness.ranking === "ok"
        ? "bg-amber-50 border-amber-200"
        : "bg-red-50 border-red-200";

  const scoreColor =
    completeness.ranking === "great"
      ? "text-emerald-600"
      : completeness.ranking === "ok"
        ? "text-amber-600"
        : "text-red-500";

  const progressColor =
    completeness.ranking === "great"
      ? "bg-emerald-500"
      : completeness.ranking === "ok"
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B2252] to-[#6B1A3E] text-white">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl font-light tracking-wide">pirk</span>
          </div>
          <h1 className="text-2xl font-semibold mt-4">
            Welcome, {surgeon.name}
          </h1>
          <p className="text-white/70 mt-1">
            Keep your profile up to date so we can match you with the right
            clients.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Saved toast */}
        {saved && (
          <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Saved
          </div>
        )}

        {/* Score + Ranking Card */}
        <div className={`rounded-2xl border p-6 ${rankBg}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <RankingIcon className={`h-10 w-10 ${rankColor}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className={`text-xl font-semibold ${rankColor}`}>
                  {completeness.rankLabel}
                </h2>
                <span className={`text-3xl font-bold ${scoreColor}`}>
                  {completeness.score}%
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                {completeness.rankDescription}
              </p>
              <div className="mt-3 h-2 bg-white/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                  style={{ width: `${completeness.score}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {completeness.filled} of {completeness.total} fields completed
              </p>
            </div>
          </div>
        </div>

        {/* Accepting Patients Toggle */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Accepting New Patients</p>
            <p className="text-sm text-gray-500">
              Toggle off if you&apos;re not currently taking new referrals
            </p>
          </div>
          <button
            onClick={toggleAcceptingPatients}
            disabled={saving}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              surgeon.acceptingPatients ? "bg-emerald-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                surgeon.acceptingPatients ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Category Sections */}
        {completeness.categories.map((cat) => {
          const isExpanded = expandedCategories.has(cat.name);
          const catFields = completeness.fields.filter(
            (f) => f.category === cat.name
          );
          const allFilled = cat.filled === cat.total;

          // Special handling for procedures
          if (cat.name === "Procedures & Pricing") {
            return (
              <div
                key={cat.name}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${allFilled ? "bg-emerald-500" : "bg-amber-500"}`}
                    />
                    <span className="font-medium text-gray-900">
                      {cat.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {cat.filled}/{cat.total}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-6">
                    <p className="text-sm text-gray-500">
                      Tick the procedures you offer, then add your price range (min – max) for each.
                    </p>

                    {/* Group procedures by category */}
                    {["Breast", "Face", "Body"].map((group) => {
                      const groupProcs = PROCEDURE_OPTIONS.filter(
                        (p) => p.category === group
                      );
                      return (
                        <div key={group}>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            {group}
                          </p>
                          <div className="space-y-1">
                            {groupProcs.map((proc) => {
                              const selected = procedures.includes(proc.slug);
                              const price = priceRanges[proc.slug] || {
                                min: "",
                                max: "",
                              };
                              return (
                                <div
                                  key={proc.slug}
                                  className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                                    selected ? "bg-[#8B2252]/5" : "hover:bg-gray-50"
                                  }`}
                                >
                                  <button
                                    onClick={() => toggleProcedure(proc.slug)}
                                    disabled={saving}
                                    className={`flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                                      selected
                                        ? "bg-[#8B2252] border-[#8B2252]"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {selected && (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                    )}
                                  </button>
                                  <span
                                    className={`flex-1 text-sm ${
                                      selected
                                        ? "text-gray-900 font-medium"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {proc.label}
                                  </span>
                                  {selected && (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs text-gray-400">$</span>
                                      <input
                                        type="number"
                                        placeholder="Min"
                                        value={price.min}
                                        onChange={(e) =>
                                          updatePriceRange(
                                            proc.slug,
                                            "min",
                                            e.target.value
                                          )
                                        }
                                        className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-right"
                                      />
                                      <span className="text-xs text-gray-400">–</span>
                                      <span className="text-xs text-gray-400">$</span>
                                      <input
                                        type="number"
                                        placeholder="Max"
                                        value={price.max}
                                        onChange={(e) =>
                                          updatePriceRange(
                                            proc.slug,
                                            "max",
                                            e.target.value
                                          )
                                        }
                                        className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-right"
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Save prices button */}
                    {procedures.length > 0 && (
                      <button
                        onClick={savePriceRanges}
                        disabled={saving}
                        className="px-4 py-2 bg-[#8B2252] text-white rounded-lg text-sm hover:bg-[#6B1A3E] transition-colors flex items-center gap-2"
                      >
                        {saving ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3" />
                        )}
                        Save Prices
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={cat.name}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(cat.name)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${allFilled ? "bg-emerald-500" : "bg-amber-500"}`}
                  />
                  <span className="font-medium text-gray-900">{cat.name}</span>
                  <span className="text-xs text-gray-400">
                    {cat.filled}/{cat.total}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-4 border-t border-gray-100 pt-3 space-y-3">
                  {catFields.map((field) => (
                    <div
                      key={field.key}
                      className="flex items-start gap-3 py-2"
                    >
                      {field.filled ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">
                          {field.label}
                        </p>
                        {editingField === field.key ? (
                          <div className="mt-1 flex gap-2">
                            {field.key === "paymentPlansAvailable" ? (
                              <select
                                value={editValues[field.key] ?? ""}
                                onChange={(e) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [field.key]: e.target.value,
                                  }))
                                }
                                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#8B2252]/20 focus:border-[#8B2252] outline-none"
                              >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                              </select>
                            ) : (
                              <input
                                type={
                                  field.key === "yearOfCompletion" ||
                                  field.key === "googleRating" ||
                                  field.key === "googleReviewCount"
                                    ? "number"
                                    : "text"
                                }
                                value={editValues[field.key] ?? ""}
                                onChange={(e) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [field.key]: e.target.value,
                                  }))
                                }
                                placeholder={getPlaceholder(field.key)}
                                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#8B2252]/20 focus:border-[#8B2252] outline-none"
                                autoFocus
                              />
                            )}
                            <button
                              onClick={() => saveField(field.key)}
                              disabled={saving}
                              className="px-3 py-1.5 bg-[#8B2252] text-white rounded-lg text-sm hover:bg-[#6B1A3E] transition-colors flex items-center gap-1"
                            >
                              {saving ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Save className="h-3 w-3" />
                              )}
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-sm text-gray-500 truncate">
                              {formatDisplayValue(
                                surgeon[field.key],
                                field.key
                              ) || (
                                <span className="text-red-400 italic">
                                  Not provided
                                </span>
                              )}
                            </p>
                            <button
                              onClick={() => startEditing(field.key)}
                              className="text-xs text-[#8B2252] hover:underline flex-shrink-0"
                            >
                              {field.filled ? "Edit" : "Add"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Footer */}
        <div className="text-center py-8 text-sm text-gray-400">
          <p>
            This profile is managed by{" "}
            <span className="font-medium text-[#8B2252]">Pirk</span>. If you
            have questions, contact your account manager.
          </p>
          {typeof surgeon.lastProfileUpdate === "string" && surgeon.lastProfileUpdate && (
            <p className="mt-1">
              Last updated:{" "}
              {new Date(
                surgeon.lastProfileUpdate
              ).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getPlaceholder(key: string): string {
  const placeholders: Record<string, string> = {
    practiceName: "e.g. Melbourne Plastic Surgery",
    address: "e.g. 123 Collins St",
    suburb: "e.g. Melbourne",
    state: "e.g. VIC",
    postcode: "e.g. 3000",
    phone: "e.g. 03 9123 4567",
    website: "e.g. https://www.example.com",
    experienceQualification: "e.g. FRACS, 15 years experience",
    yearOfCompletion: "e.g. 2010",
    googleRating: "e.g. 4.8",
    googleReviewCount: "e.g. 120",
    instagram: "e.g. @drsurgeon",
    tiktok: "e.g. @drsurgeon",
    consultWaitTime: "e.g. 2-3 weeks",
    consultCost: "e.g. $200",
    secondConsultCost: "e.g. Free / $100",
    surgeryWaitTime: "e.g. 4-6 weeks",
    revisionPolicy: "e.g. Free revisions within 12 months",
    paymentPlanDetails: "e.g. Available through TLC or Zip",
    depositInfo: "e.g. $500 non-refundable deposit",
  };
  return placeholders[key] ?? "";
}

function formatDisplayValue(value: unknown, key: string): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
    if (key === "googleRating") return value > 0 ? `${value} / 5` : "";
    if (key === "googleReviewCount") return value > 0 ? `${value} reviews` : "";
    return value.toString();
  }
  if (typeof value === "string") {
    if (key === "beforeAfterLinks") {
      try {
        const arr = JSON.parse(value);
        if (Array.isArray(arr) && arr.length > 0) return `${arr.length} links`;
      } catch {
        /* empty */
      }
      return "";
    }
    return value;
  }
  return "";
}

