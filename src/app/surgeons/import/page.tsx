"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { PROCEDURE_CATEGORIES, AUSTRALIAN_STATES } from "@/config/procedures";

const ALL_PROCEDURE_SLUGS = Object.values(PROCEDURE_CATEGORIES).flatMap(
  (cat) => cat.procedures.map((p) => p.slug)
);

const STATE_CODES = AUSTRALIAN_STATES.map((s) => s.code);

interface PreviewError {
  row: number;
  field: string;
  message: string;
}

interface PreviewResult {
  valid: number;
  errors: PreviewError[];
  total: number;
}

export default function ImportSurgeonsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [importResult, setImportResult] = useState<{
    count: number;
  } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  function validateAndSetFile(f: File) {
    const validTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const validExtensions = [".csv", ".xlsx", ".xls"];
    const hasValidExt = validExtensions.some((ext) =>
      f.name.toLowerCase().endsWith(ext)
    );

    if (!validTypes.includes(f.type) && !hasValidExt) {
      toast.error("Please upload a .csv or .xlsx file");
      return;
    }

    setFile(f);
    setPreview(null);
    setImportResult(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handlePreview() {
    if (!file) return;
    setPreviewing(true);
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/surgeons/import?preview=true", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Preview failed");
      }

      const data: PreviewResult = await res.json();
      setPreview(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to preview file"
      );
    } finally {
      setPreviewing(false);
    }
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/surgeons/import", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Import failed");
      }

      const data = await res.json();
      setImportResult({ count: data.count ?? 0 });
      toast.success(`Successfully imported ${data.count} surgeons`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to import file"
      );
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/surgeons"
          className="rounded-lg border border-coral-mid/30 bg-white p-2 text-warm-grey hover:text-near-black hover:bg-coral-light transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-burgundy text-pirk-heading">
            Import Surgeons
          </h1>
          <p className="mt-0.5 text-sm text-warm-grey">
            Upload a CSV or XLSX file to bulk-import surgeon data
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-coral-mid/30 p-6">
        <h2 className="text-sm font-semibold text-near-black mb-2">
          Expected Columns
        </h2>
        <p className="text-xs text-warm-grey mb-3">
          Your file should include a header row. Supported columns:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "name",
            "practiceName",
            "address",
            "suburb",
            "state",
            "postcode",
            "phone",
            "website",
            "yearOfCompletion",
            "experienceQualification",
            "instagram",
            "tiktok",
            "proceduresOffered",
            "consultWaitTime",
            "consultCost",
            "secondConsultCost",
            "surgeryWaitTime",
            "revisionPolicy",
            "paymentPlansAvailable",
            "paymentPlanDetails",
            "depositInfo",
            "googleRating",
            "googleReviewCount",
          ].map((col) => (
            <span
              key={col}
              className="inline-flex items-center rounded-full bg-coral-light px-2 py-0.5 text-[10px] font-medium text-burgundy"
            >
              {col}
            </span>
          ))}
        </div>
        <p className="text-xs text-warm-grey mt-3">
          <strong>proceduresOffered:</strong> comma-separated procedure slugs
          (e.g.{" "}
          <code className="bg-coral-light/50 px-1 rounded text-burgundy">
            breast-augmentation,rhinoplasty
          </code>
          ). Valid slugs:
        </p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {ALL_PROCEDURE_SLUGS.slice(0, 8).map((slug) => (
            <code
              key={slug}
              className="bg-cream px-1.5 py-0.5 rounded text-[10px] text-warm-grey"
            >
              {slug}
            </code>
          ))}
          <span className="text-[10px] text-warm-grey">
            ... and {ALL_PROCEDURE_SLUGS.length - 8} more
          </span>
        </div>
        <p className="text-xs text-warm-grey mt-2">
          <strong>state:</strong> must be one of{" "}
          {STATE_CODES.map((code, i) => (
            <span key={code}>
              <code className="bg-coral-light/50 px-1 rounded text-burgundy">
                {code}
              </code>
              {i < STATE_CODES.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </div>

      {/* Upload Area */}
      {!importResult && (
        <div className="bg-white rounded-xl border border-coral-mid/30 p-6">
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 cursor-pointer transition-colors ${
                dragging
                  ? "border-coral bg-coral-light/30"
                  : "border-coral-mid/30 hover:border-coral hover:bg-coral-light/10"
              }`}
            >
              <Upload className="h-10 w-10 text-coral mb-3" />
              <p className="text-sm font-medium text-near-black mb-1">
                Drop your file here, or click to browse
              </p>
              <p className="text-xs text-warm-grey">
                Accepts .csv and .xlsx files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-coral-mid/20 bg-coral-light/20 p-4">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-coral" />
                  <div>
                    <p className="text-sm font-medium text-near-black">
                      {file.name}
                    </p>
                    <p className="text-xs text-warm-grey">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="rounded-lg p-1.5 text-warm-grey hover:text-near-black hover:bg-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={previewing}
                  className="bg-coral text-white hover:bg-coral/90 rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {previewing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {previewing ? "Analyzing..." : "Upload & Preview"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Results */}
      {preview && !importResult && (
        <div className="bg-white rounded-xl border border-coral-mid/30 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-near-black">
            Preview Results
          </h2>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm text-near-black">
                <strong>{preview.valid}</strong> valid rows
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-near-black">
                <strong>{preview.errors.length}</strong> errors
              </span>
            </div>
          </div>

          {preview.errors.length > 0 && (
            <div className="rounded-lg border border-red-200 overflow-hidden">
              <div className="bg-red-50 px-4 py-2 border-b border-red-200">
                <p className="text-sm font-medium text-red-800">
                  Errors found
                </p>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-red-100">
                {preview.errors.map((err, idx) => (
                  <div key={idx} className="px-4 py-2 text-sm">
                    <span className="font-medium text-red-700">
                      Row {err.row}
                    </span>
                    <span className="text-warm-grey mx-1.5">&middot;</span>
                    <span className="font-medium text-near-black">
                      {err.field}
                    </span>
                    <span className="text-warm-grey mx-1.5">&mdash;</span>
                    <span className="text-warm-grey">{err.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {preview.valid > 0 && (
            <button
              type="button"
              onClick={handleImport}
              disabled={importing}
              className="bg-coral text-white hover:bg-coral/90 rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {importing
                ? "Importing..."
                : `Import ${preview.valid} Surgeon${preview.valid !== 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      )}

      {/* Import Success */}
      {importResult && (
        <div className="bg-white rounded-xl border border-coral-mid/30 p-6 text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
          <div>
            <h2 className="text-lg font-semibold text-near-black">
              Import Complete
            </h2>
            <p className="text-sm text-warm-grey mt-1">
              Successfully imported{" "}
              <strong className="text-near-black">
                {importResult.count}
              </strong>{" "}
              surgeon{importResult.count !== 1 ? "s" : ""} into the database.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Link
              href="/surgeons"
              className="bg-coral text-white hover:bg-coral/90 rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-colors"
            >
              View Surgeons
            </Link>
            <button
              type="button"
              onClick={() => {
                clearFile();
                setImportResult(null);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-coral-mid/30 bg-white px-4 py-2 text-sm font-medium text-near-black hover:bg-coral-light transition-colors"
            >
              Import More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
