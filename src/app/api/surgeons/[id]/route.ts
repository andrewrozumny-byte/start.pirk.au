import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/surgeons/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const surgeon = await prisma.surgeon.findUnique({
      where: { id },
    });

    if (!surgeon) {
      return NextResponse.json(
        { error: "Surgeon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(surgeon);
  } catch (error) {
    console.error("GET /api/surgeons/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch surgeon" },
      { status: 500 }
    );
  }
}

// PUT /api/surgeons/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check surgeon exists
    const existing = await prisma.surgeon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Surgeon not found" },
        { status: 404 }
      );
    }

    // Build update data - only include fields that are present in body
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "name",
      "practiceName",
      "address",
      "suburb",
      "state",
      "postcode",
      "phone",
      "website",
      "experienceQualification",
      "yearOfCompletion",
      "registrationStatus",
      "googleRating",
      "googleReviewCount",
      "instagram",
      "tiktok",
      "beforeAfterLinks",
      "proceduresOffered",
      "priceRanges",
      "consultWaitTime",
      "consultCost",
      "secondConsultCost",
      "surgeryWaitTime",
      "revisionPolicy",
      "paymentPlansAvailable",
      "paymentPlanDetails",
      "depositInfo",
      "beforeAfterAvailable",
      "callExperienceNotes",
      "followUpNotes",
      "additionalInfo",
      "acceptingPatients",
      "internalRating",
    ];

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    const surgeon = await prisma.surgeon.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(surgeon);
  } catch (error) {
    console.error("PUT /api/surgeons/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update surgeon" },
      { status: 500 }
    );
  }
}

// DELETE /api/surgeons/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check surgeon exists
    const existing = await prisma.surgeon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Surgeon not found" },
        { status: 404 }
      );
    }

    await prisma.surgeon.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/surgeons/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete surgeon" },
      { status: 500 }
    );
  }
}
