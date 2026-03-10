"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ClipboardPaste,
  Sparkles,
  Search,
  Loader2,
  ChevronRight,
  FileText,
  Upload,
  X,
} from "lucide-react";
import type { ParsedTypeformData } from "@/lib/typeform-parser";

type Step = "paste" | "transcript" | "review" | "matching";

const STEPS = [
  { key: "paste", label: "Typeform" },
  { key: "transcript", label: "Transcript" },
  { key: "review", label: "Review" },
  { key: "matching", label: "Match" },
] as const;

export default function MatchPage() {
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [transcriptFileName, setTranscriptFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedTypeformData | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [step, setStep] = useState<Step>("paste");

  async function handleParse() {
    if (!rawText.trim()) {
      toast.error("Please paste the Typeform response first");
      return;
    }
    setIsParsing(true);
    try {
      const res = await fetch("/api/ai/parse-typeform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      if (!res.ok) throw new Error("Parse failed");
      const data = await res.json();
      setParsed(data);
      setStep("transcript");
      toast.success("Typeform data parsed successfully");
    } catch {
      toast.error("Failed to parse Typeform data");
    } finally {
      setIsParsing(false);
    }
  }

  function handleTranscriptFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setTranscriptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTranscript(ev.target?.result as string);
      toast.success(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  }

  async function handleMatch() {
    if (!parsed) return;
    setIsMatching(true);
    setStep("matching");
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed,
          typeformRaw: rawText,
          transcript: transcript || undefined,
        }),
      });
      if (!res.ok) throw new Error("Match failed");
      const match = await res.json();
      toast.success("Surgeons matched successfully!");
      router.push(`/match/${match.id}`);
    } catch {
      toast.error("Failed to run matching");
      setStep("review");
    } finally {
      setIsMatching(false);
    }
  }

  function updateParsedField(
    field: keyof ParsedTypeformData,
    value: string | string[]
  ) {
    if (!parsed) return;
    setParsed({ ...parsed, [field]: value });
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-near-black tracking-tight mb-1">
        New Match
      </h1>
      <p className="text-warm-grey text-sm mb-8">
        Paste a Typeform response, add a call transcript, then match
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                i <= stepIndex
                  ? "bg-coral text-white"
                  : "bg-white text-warm-grey border border-coral-mid/30"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                {i + 1}
              </span>
              {s.label}
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="w-3 h-3 text-coral-mid" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Paste Typeform */}
      {step === "paste" && (
        <div className="bg-white rounded-xl border border-coral-mid/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardPaste className="w-4 h-4 text-coral" />
            <h2 className="text-sm font-semibold text-near-black uppercase tracking-wider">
              Paste Typeform Response
            </h2>
          </div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`Paste the full Typeform notification here...\n\nExample:\nFirst, what's your first name?\nKliantha\nWhat procedure are you exploring?\nBreast reduction\n...`}
            className="w-full h-64 p-4 border border-coral-mid/30 rounded-lg text-sm text-near-black bg-cream/50 placeholder:text-warm-grey/50 focus:outline-none focus:ring-2 focus:ring-coral/30 resize-none"
          />
          <button
            onClick={handleParse}
            disabled={isParsing || !rawText.trim()}
            className="mt-4 bg-coral text-white hover:bg-coral/90 disabled:opacity-50 rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            {isParsing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isParsing ? "Parsing..." : "Parse & Continue"}
          </button>
        </div>
      )}

      {/* Step 2: Add Transcript (optional) */}
      {step === "transcript" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-coral-mid/30 p-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-coral" />
              <h2 className="text-sm font-semibold text-near-black uppercase tracking-wider">
                Call Transcript
              </h2>
              <span className="text-[10px] text-warm-grey bg-cream px-2 py-0.5 rounded-full uppercase tracking-wider">
                Optional
              </span>
            </div>
            <p className="text-xs text-warm-grey mb-4">
              Upload or paste a call transcript for deeper, more personalised
              matching. The AI will review the transcript to understand the
              client&apos;s needs beyond the Typeform answers.
            </p>

            {/* Upload area */}
            {!transcript ? (
              <div className="space-y-4">
                <label className="block border-2 border-dashed border-coral-mid/40 rounded-lg p-8 text-center cursor-pointer hover:border-coral/50 hover:bg-coral-light/30 transition-colors">
                  <Upload className="w-6 h-6 text-coral-mid mx-auto mb-2" />
                  <p className="text-sm text-near-black font-medium">
                    Upload transcript file
                  </p>
                  <p className="text-xs text-warm-grey mt-1">
                    .txt, .doc, .pdf — or paste below
                  </p>
                  <input
                    type="file"
                    accept=".txt,.doc,.docx,.pdf,.md"
                    onChange={handleTranscriptFile}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-coral-mid/30" />
                  <span className="text-[10px] uppercase tracking-widest text-warm-grey">
                    or paste
                  </span>
                  <div className="flex-1 h-px bg-coral-mid/30" />
                </div>

                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste the call transcript here..."
                  className="w-full h-48 p-4 border border-coral-mid/30 rounded-lg text-sm text-near-black bg-cream/50 placeholder:text-warm-grey/50 focus:outline-none focus:ring-2 focus:ring-coral/30 resize-none"
                />
              </div>
            ) : (
              <div className="border border-coral-mid/30 rounded-lg p-4 bg-cream/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-coral" />
                    <span className="text-sm font-medium text-near-black">
                      {transcriptFileName || "Pasted transcript"}
                    </span>
                    <span className="text-xs text-warm-grey">
                      {transcript.length.toLocaleString()} characters
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setTranscript("");
                      setTranscriptFileName("");
                    }}
                    className="text-warm-grey hover:text-coral transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-warm-grey line-clamp-3">
                  {transcript.substring(0, 300)}...
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("paste")}
              className="bg-white text-near-black border border-coral-mid/30 hover:bg-cream rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep("review")}
              className="bg-coral text-white hover:bg-coral/90 rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              {transcript ? "Continue with Transcript" : "Skip — No Transcript"}
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review parsed data */}
      {step === "review" && parsed && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-coral-mid/30 p-6">
            <h2 className="text-sm font-semibold text-near-black uppercase tracking-wider mb-4">
              Parsed Client Data
            </h2>
            <p className="text-xs text-warm-grey mb-4">
              Review and edit any fields before running the match
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Name"
                value={parsed.name}
                onChange={(v) => updateParsedField("name", v)}
              />
              <Field
                label="Email"
                value={parsed.email}
                onChange={(v) => updateParsedField("email", v)}
              />
              <Field
                label="Phone"
                value={parsed.phone}
                onChange={(v) => updateParsedField("phone", v)}
              />
              <Field
                label="Procedure"
                value={parsed.procedure}
                onChange={(v) => updateParsedField("procedure", v)}
              />
              <Field
                label="Location"
                value={parsed.location}
                onChange={(v) => updateParsedField("location", v)}
              />
              <Field
                label="State"
                value={parsed.state}
                onChange={(v) => updateParsedField("state", v)}
              />
              <Field
                label="Timeline"
                value={parsed.timeline}
                onChange={(v) => updateParsedField("timeline", v)}
              />
              <Field
                label="Budget"
                value={parsed.budget}
                onChange={(v) => updateParsedField("budget", v)}
              />
              <Field
                label="Payment Plan"
                value={parsed.paymentPlan}
                onChange={(v) => updateParsedField("paymentPlan", v)}
              />
              <Field
                label="Travel Willingness"
                value={parsed.travelWillingness}
                onChange={(v) => updateParsedField("travelWillingness", v)}
              />
              <Field
                label="Previous Consults"
                value={parsed.previousConsults}
                onChange={(v) => updateParsedField("previousConsults", v)}
              />
              <Field
                label="Priorities"
                value={parsed.priorities.join(", ")}
                onChange={(v) =>
                  updateParsedField(
                    "priorities",
                    v.split(",").map((s) => s.trim())
                  )
                }
              />
            </div>
            {parsed.additionalNotes && (
              <div className="mt-4">
                <Field
                  label="Additional Notes"
                  value={parsed.additionalNotes}
                  onChange={(v) => updateParsedField("additionalNotes", v)}
                />
              </div>
            )}
          </div>

          {/* Transcript summary */}
          {transcript && (
            <div className="bg-white rounded-xl border border-coral-mid/30 p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-coral" />
                <h3 className="text-sm font-semibold text-near-black uppercase tracking-wider">
                  Call Transcript Attached
                </h3>
              </div>
              <p className="text-xs text-warm-grey">
                {transcript.length.toLocaleString()} characters — will be sent to
                AI for deeper matching analysis
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep("transcript")}
              className="bg-white text-near-black border border-coral-mid/30 hover:bg-cream rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleMatch}
              disabled={isMatching}
              className="bg-coral text-white hover:bg-coral/90 disabled:opacity-50 rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              {isMatching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {isMatching ? "Matching..." : "Find Matches"}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Matching in progress */}
      {step === "matching" && (
        <div className="bg-white rounded-xl border border-coral-mid/30 p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-coral mx-auto mb-4" />
          <p className="text-near-black font-medium">
            Finding the best surgeon matches...
          </p>
          <p className="text-warm-grey text-sm mt-1">
            {transcript
              ? "AI is reviewing the transcript and matching against your surgeon database"
              : "Analysing client preferences against your surgeon database"}
          </p>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-warm-grey font-medium mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-coral-mid/30 rounded-lg text-sm text-near-black bg-cream/30 focus:outline-none focus:ring-2 focus:ring-coral/30"
      />
    </div>
  );
}
