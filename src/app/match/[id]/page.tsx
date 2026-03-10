export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Award,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { getProcedureLabel } from "@/config/procedures";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const match = await prisma.match.findUnique({
    where: { id },
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

  return (
    <div className="max-w-5xl">
      <Link
        href="/match"
        className="flex items-center gap-1 text-sm text-warm-grey hover:text-coral mb-4 transition-colors"
      >
        <ArrowLeft className="w-3 h-3" /> Back to matching
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-near-black tracking-tight">
            Match Results — {client.name}
          </h1>
          <p className="text-warm-grey text-sm mt-1">
            {getProcedureLabel(client.procedure)} · {client.location},{" "}
            {client.state} ·{" "}
            {new Date(match.createdAt).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/match/${id}/review`}
            className="bg-white text-near-black border border-coral-mid/30 hover:bg-cream rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Adjust Matches
          </Link>
          <Link
            href={`/pdf/${id}`}
            className="bg-coral text-white hover:bg-coral/90 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Generate PDF
          </Link>
        </div>
      </div>

      {/* Client Brief */}
      <div className="bg-white rounded-xl border border-coral-mid/30 p-5 mb-6">
        <h2 className="text-[10px] uppercase tracking-[3px] text-coral font-semibold mb-3 pb-3 border-b border-coral-mid/30">
          Client Brief
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <BriefItem
            label="Procedure"
            value={getProcedureLabel(client.procedure)}
          />
          <BriefItem label="Timeline" value={client.timeline} />
          <BriefItem
            label="Location"
            value={`${client.location}, ${client.state}`}
          />
          <BriefItem label="Budget" value={client.budget || "Not specified"} />
          <BriefItem
            label="Payment"
            value={client.paymentPlan || "Not specified"}
          />
          <BriefItem
            label="Travel"
            value={client.travelWillingness || "Not specified"}
          />
          <BriefItem
            label="Priorities"
            value={priorities.join(", ") || "Not specified"}
          />
          <BriefItem
            label="Previous Consults"
            value={client.previousConsults || "None"}
          />
        </div>
      </div>

      {/* Matched Surgeons */}
      <h2 className="text-[10px] uppercase tracking-[3px] text-warm-grey font-semibold mb-4 flex items-center gap-3">
        Matched Surgeons
        <span className="flex-1 h-px bg-coral-mid/50" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {match.matchSurgeons.map((ms, i) => {
          const surgeon = ms.surgeon;
          const priceRanges: Record<string, unknown> = JSON.parse(
            surgeon.priceRanges || "{}"
          );
          const rawPrice = priceRanges[client.procedure];
          const price = formatPrice(rawPrice);
          const strengths: string[] = JSON.parse(
            ms.strengthsSummary || "[]"
          );

          return (
            <div
              key={ms.id}
              className={`bg-white rounded-xl border overflow-hidden ${
                i === 0
                  ? "border-coral border-[1.5px]"
                  : "border-coral-mid/30"
              }`}
            >
              {/* Card Header */}
              <div
                className={`p-5 ${
                  i === 0
                    ? "bg-gradient-to-br from-[#5c0128] to-[#7a0232]"
                    : "bg-burgundy"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-semibold text-lg tracking-tight">
                      {surgeon.name}
                    </p>
                    <p className="text-white/45 text-xs">
                      {surgeon.practiceName}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full ${
                      i === 0
                        ? "bg-coral text-white"
                        : "bg-white/15 text-white/80"
                    }`}
                  >
                    {i === 0 ? "Pirk Pick" : `#${i + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm font-semibold">
                    {surgeon.googleRating}
                  </span>
                  <span className="text-white/40 text-xs">
                    ({surgeon.googleReviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <div className="px-5 py-2.5 bg-coral-light/50 border-b border-coral-mid/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-warm-grey font-medium">
                    Match Score
                  </span>
                  <span className="text-coral font-bold">
                    {ms.finalScore}/100
                  </span>
                </div>
                <div className="mt-1 h-1.5 bg-coral-mid/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coral rounded-full transition-all"
                    style={{ width: `${ms.finalScore}%` }}
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                {ms.matchReason && (
                  <div className="text-sm text-near-black leading-relaxed pb-3 border-b border-coral-mid/20">
                    <Award className="w-3 h-3 text-coral inline mr-1" />
                    {ms.matchReason}
                  </div>
                )}

                <InfoRow
                  icon={<MapPin className="w-3 h-3" />}
                  label="Location"
                  value={`${surgeon.suburb || surgeon.address}, ${surgeon.state}`}
                />
                {price && (
                  <InfoRow
                    icon={<DollarSign className="w-3 h-3" />}
                    label="Procedure Price"
                    value={price}
                    highlight
                  />
                )}
                <InfoRow
                  icon={<Clock className="w-3 h-3" />}
                  label="Consult Wait"
                  value={surgeon.consultWaitTime || "Ask on enquiry"}
                />
                <InfoRow
                  icon={<Clock className="w-3 h-3" />}
                  label="Surgery Wait"
                  value={surgeon.surgeryWaitTime || "Ask on enquiry"}
                />

                {strengths.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {strengths.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-coral-light text-coral font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-coral-mid/30 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              match.status === "sent"
                ? "bg-green-500"
                : match.status === "reviewed"
                ? "bg-yellow-500"
                : "bg-warm-grey"
            }`}
          />
          <span className="text-sm text-near-black capitalize">
            {match.status}
          </span>
        </div>
        {match.pdfGeneratedAt && (
          <span className="text-xs text-warm-grey">
            PDF generated{" "}
            {new Date(match.pdfGeneratedAt).toLocaleDateString("en-AU")}
          </span>
        )}
      </div>
    </div>
  );
}

function formatPrice(raw: unknown): string {
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

function BriefItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-warm-grey font-medium mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-near-black">{value}</p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-6 h-6 bg-coral-light rounded flex items-center justify-center text-coral flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-widest text-warm-grey font-medium">
          {label}
        </p>
        <p
          className={`text-sm ${
            highlight
              ? "font-bold text-burgundy"
              : "text-near-black"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
