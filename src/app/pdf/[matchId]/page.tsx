export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { generateComparisonHTML, type PdfData, type PdfSurgeon } from "@/lib/pdf-template";
import { getProcedureLabel } from "@/config/procedures";
import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";

function formatPriceForPdf(raw: unknown): string {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as { min?: string; max?: string; notes?: string };
    if (obj.min && obj.max) {
      const prefix = obj.notes ? `${obj.notes}: ` : "";
      return `${prefix}$${Number(obj.min).toLocaleString()} – $${Number(obj.max).toLocaleString()}`;
    }
    if (obj.min) return `From $${Number(obj.min).toLocaleString()}`;
    if (obj.notes) return obj.notes;
  }
  return "";
}

export default async function PdfPreviewPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      client: true,
      matchSurgeons: {
        include: { surgeon: true },
        orderBy: { rank: "asc" },
      },
    },
  });

  if (!match) return notFound();

  const client = match.client;
  const priorities: string[] = JSON.parse(client.priorities || "[]");
  const procedureLabel = getProcedureLabel(client.procedure);

  const surgeons: PdfSurgeon[] = match.matchSurgeons.map((ms) => {
    const surgeon = ms.surgeon;
    const priceRanges: Record<string, unknown> = JSON.parse(surgeon.priceRanges || "{}");
    const rawPrice = priceRanges[client.procedure];
    const procedurePrice = formatPriceForPdf(rawPrice);
    const strengths: string[] = JSON.parse(ms.strengthsSummary || "[]");

    return {
      rank: ms.rank,
      name: surgeon.name,
      practiceName: surgeon.practiceName,
      address: surgeon.address,
      suburb: surgeon.suburb,
      state: surgeon.state,
      googleRating: surgeon.googleRating,
      googleReviewCount: surgeon.googleReviewCount,
      website: surgeon.website,
      instagram: surgeon.instagram,
      yearOfCompletion: surgeon.yearOfCompletion,
      experienceQualification: surgeon.experienceQualification,
      consultWaitTime: surgeon.consultWaitTime,
      consultCost: surgeon.consultCost,
      secondConsultCost: surgeon.secondConsultCost,
      surgeryWaitTime: surgeon.surgeryWaitTime,
      revisionPolicy: surgeon.revisionPolicy,
      paymentPlansAvailable: surgeon.paymentPlansAvailable,
      paymentPlanDetails: surgeon.paymentPlanDetails,
      depositInfo: surgeon.depositInfo,
      beforeAfterAvailable: surgeon.beforeAfterAvailable,
      procedurePrice,
      matchReason: ms.matchReason,
      strengths,
    };
  });

  const generatedDate = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const pdfData: PdfData = {
    client: {
      name: client.name,
      procedure: procedureLabel,
      location: client.location,
      state: client.state,
      timeline: client.timeline,
      budget: client.budget,
      paymentPlan: client.paymentPlan,
      travelWillingness: client.travelWillingness,
      priorities,
    },
    surgeons,
    generatedDate,
    matchId,
  };

  const html = generateComparisonHTML(pdfData);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/match/${matchId}`}
            className="flex items-center gap-1 text-sm text-warm-grey hover:text-coral transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to match
          </Link>
          <div className="h-4 w-px bg-coral-mid/30" />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-coral" />
            <h1 className="text-lg font-semibold text-near-black tracking-tight">
              PDF Preview &mdash; {client.name}
            </h1>
          </div>
        </div>

        <a
          href={`/api/pdf/${matchId}`}
          className="bg-coral text-white hover:bg-coral/90 rounded-lg px-5 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </div>

      {/* Info bar */}
      <div className="bg-white rounded-xl border border-coral-mid/30 px-5 py-3 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-warm-grey">
          <span>
            {procedureLabel} &middot; {client.location}, {client.state}
          </span>
          <span>&middot;</span>
          <span>{match.matchSurgeons.length} surgeons compared</span>
        </div>
        {match.pdfGeneratedAt && (
          <span className="text-xs text-warm-grey">
            Last generated{" "}
            {new Date(match.pdfGeneratedAt).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      {/* HTML Preview */}
      <div className="rounded-xl border border-coral-mid/30 overflow-hidden shadow-sm bg-white">
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="pdf-preview"
        />
      </div>

      {/* Bottom download bar */}
      <div className="mt-6 flex items-center justify-center gap-4 pb-8">
        <a
          href={`/api/pdf/${matchId}`}
          className="bg-coral text-white hover:bg-coral/90 rounded-lg px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
        <Link
          href={`/match/${matchId}/review`}
          className="bg-white text-near-black border border-coral-mid/30 hover:bg-cream rounded-lg px-6 py-3 text-sm font-medium transition-colors"
        >
          Adjust Matches
        </Link>
      </div>
    </div>
  );
}
