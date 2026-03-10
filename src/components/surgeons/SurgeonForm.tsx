"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  PROCEDURE_CATEGORIES,
  AUSTRALIAN_STATES,
} from "@/config/procedures";

type PriceRange = {
  min: string;
  max: string;
  notes: string;
};

export interface SurgeonFormData {
  name: string;
  practiceName: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  website: string;
  yearOfCompletion: string;
  experienceQualification: string;
  instagram: string;
  tiktok: string;
  proceduresOffered: string[];
  priceRanges: Record<string, PriceRange>;
  consultWaitTime: string;
  consultCost: string;
  secondConsultCost: string;
  surgeryWaitTime: string;
  revisionPolicy: string;
  paymentPlansAvailable: boolean;
  paymentPlanDetails: string;
  depositInfo: string;
  callExperienceNotes: string;
  followUpNotes: string;
  additionalInfo: string;
  acceptingPatients: boolean;
  googleRating: string;
  googleReviewCount: string;
}

const defaultFormData: SurgeonFormData = {
  name: "",
  practiceName: "",
  address: "",
  suburb: "",
  state: "",
  postcode: "",
  phone: "",
  website: "",
  yearOfCompletion: "",
  experienceQualification: "",
  instagram: "",
  tiktok: "",
  proceduresOffered: [],
  priceRanges: {},
  consultWaitTime: "",
  consultCost: "",
  secondConsultCost: "",
  surgeryWaitTime: "",
  revisionPolicy: "",
  paymentPlansAvailable: false,
  paymentPlanDetails: "",
  depositInfo: "",
  callExperienceNotes: "",
  followUpNotes: "",
  additionalInfo: "",
  acceptingPatients: true,
  googleRating: "",
  googleReviewCount: "",
};

const TABS = [
  "Basic Info",
  "Procedures & Pricing",
  "Consult & Logistics",
  "Internal Notes",
] as const;

interface SurgeonFormProps {
  initialData?: SurgeonFormData;
  surgeonId?: string;
  mode: "add" | "edit";
}

export function SurgeonForm({
  initialData,
  surgeonId,
  mode,
}: SurgeonFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState<SurgeonFormData>(
    initialData ?? defaultFormData
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function updateField<K extends keyof SurgeonFormData>(
    key: K,
    value: SurgeonFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleProcedure(slug: string) {
    setForm((prev) => {
      const has = prev.proceduresOffered.includes(slug);
      return {
        ...prev,
        proceduresOffered: has
          ? prev.proceduresOffered.filter((s) => s !== slug)
          : [...prev.proceduresOffered, slug],
      };
    });
  }

  function updatePrice(slug: string, field: keyof PriceRange, value: string) {
    setForm((prev) => ({
      ...prev,
      priceRanges: {
        ...prev.priceRanges,
        [slug]: {
          ...{ min: "", max: "", notes: "" },
          ...prev.priceRanges[slug],
          [field]: value,
        },
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Surgeon name is required");
      setActiveTab(0);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        yearOfCompletion: form.yearOfCompletion
          ? parseInt(form.yearOfCompletion)
          : null,
        googleRating: form.googleRating ? parseFloat(form.googleRating) : 0,
        googleReviewCount: form.googleReviewCount
          ? parseInt(form.googleReviewCount)
          : 0,
        proceduresOffered: JSON.stringify(form.proceduresOffered),
        priceRanges: JSON.stringify(form.priceRanges),
      };

      const url =
        mode === "edit" ? `/api/surgeons/${surgeonId}` : "/api/surgeons";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save surgeon");
      }

      toast.success(
        mode === "edit" ? "Surgeon updated" : "Surgeon created"
      );
      router.push("/surgeons");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this surgeon? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/surgeons/${surgeonId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete surgeon");
      }

      toast.success("Surgeon deleted");
      router.push("/surgeons");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setDeleting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-coral-mid/30 bg-white px-3 py-2 text-sm text-near-black placeholder:text-warm-grey/60 focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral";
  const labelClass = "block text-sm font-medium text-near-black mb-1";
  const textareaClass =
    "w-full rounded-lg border border-coral-mid/30 bg-white px-3 py-2 text-sm text-near-black placeholder:text-warm-grey/60 focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral min-h-[80px] resize-y";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/surgeons"
            className="rounded-lg border border-coral-mid/30 bg-white p-2 text-warm-grey hover:text-near-black hover:bg-coral-light transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-burgundy text-pirk-heading">
              {mode === "edit" ? "Edit Surgeon" : "Add Surgeon"}
            </h1>
            {mode === "edit" && form.name && (
              <p className="text-sm text-warm-grey mt-0.5">{form.name}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="bg-coral text-white hover:bg-coral/90 rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving
              ? "Saving..."
              : mode === "edit"
                ? "Update Surgeon"
                : "Create Surgeon"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-coral-mid/20">
        <nav className="flex gap-1">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === idx
                  ? "bg-white text-coral border border-coral-mid/20 border-b-white -mb-px"
                  : "text-warm-grey hover:text-near-black hover:bg-coral-light/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-coral-mid/30 p-6">
        {/* Tab 0: Basic Info */}
        {activeTab === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Name <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Dr. Jane Smith"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Practice Name</label>
                <input
                  type="text"
                  value={form.practiceName}
                  onChange={(e) => updateField("practiceName", e.target.value)}
                  placeholder="Smith Plastic Surgery"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="123 Collins St"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Suburb</label>
                <input
                  type="text"
                  value={form.suburb}
                  onChange={(e) => updateField("suburb", e.target.value)}
                  placeholder="Melbourne"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <select
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select state</option>
                  {AUSTRALIAN_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} &mdash; {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Postcode</label>
                <input
                  type="text"
                  value={form.postcode}
                  onChange={(e) => updateField("postcode", e.target.value)}
                  placeholder="3000"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="03 9000 0000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Website</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  placeholder="https://example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Year of Completion</label>
                <input
                  type="number"
                  value={form.yearOfCompletion}
                  onChange={(e) =>
                    updateField("yearOfCompletion", e.target.value)
                  }
                  placeholder="2005"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Experience & Qualifications
                </label>
                <textarea
                  value={form.experienceQualification}
                  onChange={(e) =>
                    updateField("experienceQualification", e.target.value)
                  }
                  placeholder="FRACS, specialist plastic surgeon..."
                  className={textareaClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Instagram</label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => updateField("instagram", e.target.value)}
                  placeholder="@drjanesmith"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>TikTok</label>
                <input
                  type="text"
                  value={form.tiktok}
                  onChange={(e) => updateField("tiktok", e.target.value)}
                  placeholder="@drjanesmith"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Procedures & Pricing */}
        {activeTab === 1 && (
          <div className="space-y-8">
            {Object.entries(PROCEDURE_CATEGORIES).map(([catKey, category]) => (
              <div key={catKey}>
                <h3 className="text-lg font-semibold text-burgundy mb-3">
                  {category.label}
                </h3>
                <div className="space-y-2">
                  {category.procedures.map((proc) => {
                    const isChecked = form.proceduresOffered.includes(
                      proc.slug
                    );
                    const isBreast = catKey === "breast";
                    return (
                      <div
                        key={proc.slug}
                        className="flex flex-col gap-2 sm:flex-row sm:items-center rounded-lg border border-coral-mid/15 p-3 hover:bg-coral-light/20 transition-colors"
                      >
                        <label className="flex items-center gap-3 cursor-pointer sm:w-60 shrink-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleProcedure(proc.slug)}
                            className="h-4 w-4 rounded border-coral-mid text-coral focus:ring-coral"
                          />
                          <span className="text-sm text-near-black">
                            {proc.label}
                          </span>
                        </label>
                        {isBreast && isChecked && (
                          <div className="flex items-center gap-2 ml-7 sm:ml-0">
                            <input
                              type="text"
                              placeholder="Min $"
                              value={form.priceRanges[proc.slug]?.min ?? ""}
                              onChange={(e) =>
                                updatePrice(proc.slug, "min", e.target.value)
                              }
                              className="w-24 rounded-lg border border-coral-mid/30 bg-white px-2 py-1.5 text-xs text-near-black placeholder:text-warm-grey/60 focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral"
                            />
                            <span className="text-warm-grey text-xs">to</span>
                            <input
                              type="text"
                              placeholder="Max $"
                              value={form.priceRanges[proc.slug]?.max ?? ""}
                              onChange={(e) =>
                                updatePrice(proc.slug, "max", e.target.value)
                              }
                              className="w-24 rounded-lg border border-coral-mid/30 bg-white px-2 py-1.5 text-xs text-near-black placeholder:text-warm-grey/60 focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral"
                            />
                            <input
                              type="text"
                              placeholder="Notes"
                              value={form.priceRanges[proc.slug]?.notes ?? ""}
                              onChange={(e) =>
                                updatePrice(proc.slug, "notes", e.target.value)
                              }
                              className="flex-1 min-w-[100px] rounded-lg border border-coral-mid/30 bg-white px-2 py-1.5 text-xs text-near-black placeholder:text-warm-grey/60 focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Consult & Logistics */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Consult Wait Time</label>
                <input
                  type="text"
                  value={form.consultWaitTime}
                  onChange={(e) =>
                    updateField("consultWaitTime", e.target.value)
                  }
                  placeholder="2-3 weeks"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Consult Cost</label>
                <input
                  type="text"
                  value={form.consultCost}
                  onChange={(e) => updateField("consultCost", e.target.value)}
                  placeholder="$250"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Second Consult Cost</label>
                <input
                  type="text"
                  value={form.secondConsultCost}
                  onChange={(e) =>
                    updateField("secondConsultCost", e.target.value)
                  }
                  placeholder="$150 or complimentary"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Surgery Wait Time</label>
                <input
                  type="text"
                  value={form.surgeryWaitTime}
                  onChange={(e) =>
                    updateField("surgeryWaitTime", e.target.value)
                  }
                  placeholder="4-6 weeks"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Revision Policy</label>
              <textarea
                value={form.revisionPolicy}
                onChange={(e) => updateField("revisionPolicy", e.target.value)}
                placeholder="Describe the surgeon's revision policy..."
                className={textareaClass}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "paymentPlansAvailable",
                      !form.paymentPlansAvailable
                    )
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    form.paymentPlansAvailable ? "bg-coral" : "bg-warm-grey/30"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      form.paymentPlansAvailable
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
                <label className="text-sm font-medium text-near-black">
                  Payment Plans Available
                </label>
              </div>

              {form.paymentPlansAvailable && (
                <div>
                  <label className={labelClass}>Payment Plan Details</label>
                  <input
                    type="text"
                    value={form.paymentPlanDetails}
                    onChange={(e) =>
                      updateField("paymentPlanDetails", e.target.value)
                    }
                    placeholder="E.g., TLC, Zip Pay, in-house plans"
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Deposit Info</label>
              <input
                type="text"
                value={form.depositInfo}
                onChange={(e) => updateField("depositInfo", e.target.value)}
                placeholder="E.g., $500 non-refundable deposit"
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Internal Notes */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Call Experience Notes</label>
              <textarea
                value={form.callExperienceNotes}
                onChange={(e) =>
                  updateField("callExperienceNotes", e.target.value)
                }
                placeholder="Notes from phone interactions with the practice..."
                className={textareaClass}
                rows={4}
              />
            </div>

            <div>
              <label className={labelClass}>Follow Up Notes</label>
              <textarea
                value={form.followUpNotes}
                onChange={(e) => updateField("followUpNotes", e.target.value)}
                placeholder="Follow-up actions and notes..."
                className={textareaClass}
                rows={4}
              />
            </div>

            <div>
              <label className={labelClass}>Additional Info</label>
              <textarea
                value={form.additionalInfo}
                onChange={(e) => updateField("additionalInfo", e.target.value)}
                placeholder="Any other relevant information..."
                className={textareaClass}
                rows={4}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  updateField("acceptingPatients", !form.acceptingPatients)
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  form.acceptingPatients ? "bg-coral" : "bg-warm-grey/30"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    form.acceptingPatients
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
              <label className="text-sm font-medium text-near-black">
                Currently Accepting Patients
              </label>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Google Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.googleRating}
                  onChange={(e) => updateField("googleRating", e.target.value)}
                  placeholder="4.8"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Google Review Count</label>
                <input
                  type="number"
                  min="0"
                  value={form.googleReviewCount}
                  onChange={(e) =>
                    updateField("googleReviewCount", e.target.value)
                  }
                  placeholder="127"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
