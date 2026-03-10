import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public GET - fetch surgeon profile by token
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const surgeon = await prisma.surgeon.findUnique({
      where: { profileToken: token },
      select: {
        id: true,
        name: true,
        practiceName: true,
        address: true,
        suburb: true,
        state: true,
        postcode: true,
        phone: true,
        website: true,
        experienceQualification: true,
        yearOfCompletion: true,
        googleRating: true,
        googleReviewCount: true,
        instagram: true,
        tiktok: true,
        proceduresOffered: true,
        priceRanges: true,
        consultWaitTime: true,
        consultCost: true,
        secondConsultCost: true,
        surgeryWaitTime: true,
        revisionPolicy: true,
        paymentPlansAvailable: true,
        paymentPlanDetails: true,
        depositInfo: true,
        beforeAfterAvailable: true,
        beforeAfterLinks: true,
        acceptingPatients: true,
        lastProfileUpdate: true,
        // Exclude internal fields: callExperienceNotes, followUpNotes, additionalInfo, internalRating
      },
    });

    if (!surgeon) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(surgeon);
  } catch (error) {
    console.error("GET /api/surgeon-profile/[token] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// Public PUT - surgeon updates their own profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();

    const existing = await prisma.surgeon.findUnique({
      where: { profileToken: token },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Only allow surgeons to update these fields (not internal notes etc)
    const allowedFields = [
      "practiceName",
      "address",
      "suburb",
      "state",
      "postcode",
      "phone",
      "website",
      "experienceQualification",
      "yearOfCompletion",
      "instagram",
      "tiktok",
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
      "beforeAfterLinks",
      "acceptingPatients",
    ];

    const updateData: Record<string, unknown> = {
      lastProfileUpdate: new Date(),
    };

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    const surgeon = await prisma.surgeon.update({
      where: { profileToken: token },
      data: updateData,
    });

    return NextResponse.json({ success: true, updatedAt: surgeon.updatedAt });
  } catch (error) {
    console.error("PUT /api/surgeon-profile/[token] error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
