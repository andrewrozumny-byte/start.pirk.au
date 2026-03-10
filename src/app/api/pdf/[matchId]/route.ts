import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateComparisonHTML, type PdfData, type PdfSurgeon } from "@/lib/pdf-template";
import { generatePdf } from "@/lib/pdf-generator";
import { getProcedureLabel } from "@/config/procedures";

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;

  try {
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

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

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
    const pdfBuffer = await generatePdf(html);

    // Update match record to mark PDF generation time
    await prisma.match.update({
      where: { id: matchId },
      data: { pdfGeneratedAt: new Date() },
    });

    const sanitizedName = client.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const filename = `pirk-surgeon-comparison-${sanitizedName}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
