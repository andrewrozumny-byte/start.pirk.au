import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

// GET /api/surgeons
// Supports ?search= (searches name, practiceName, suburb)
// Supports ?state= (exact match on state)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search")?.trim() || "";
    const state = searchParams.get("state")?.trim() || "";

    const where: Prisma.SurgeonWhereInput = {};
    const conditions: Prisma.SurgeonWhereInput[] = [];

    if (search) {
      conditions.push({
        OR: [
          { name: { contains: search } },
          { practiceName: { contains: search } },
          { suburb: { contains: search } },
        ],
      });
    }

    if (state) {
      conditions.push({ state: { equals: state } });
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    const surgeons = await prisma.surgeon.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(surgeons);
  } catch (error) {
    console.error("GET /api/surgeons error:", error);
    return NextResponse.json(
      { error: "Failed to fetch surgeons" },
      { status: 500 }
    );
  }
}

// POST /api/surgeons
// Create a new surgeon from JSON body
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: "Surgeon name is required" },
        { status: 400 }
      );
    }

    const surgeon = await prisma.surgeon.create({
      data: {
        name: body.name,
        practiceName: body.practiceName ?? "",
        address: body.address ?? "",
        suburb: body.suburb ?? "",
        state: body.state ?? "",
        postcode: body.postcode ?? "",
        phone: body.phone ?? "",
        website: body.website ?? "",
        experienceQualification: body.experienceQualification ?? "",
        yearOfCompletion: body.yearOfCompletion ?? null,
        registrationStatus: body.registrationStatus ?? "fracs",
        googleRating: body.googleRating ?? 0,
        googleReviewCount: body.googleReviewCount ?? 0,
        instagram: body.instagram ?? "",
        tiktok: body.tiktok ?? "",
        beforeAfterLinks: body.beforeAfterLinks ?? "[]",
        proceduresOffered: body.proceduresOffered ?? "[]",
        priceRanges: body.priceRanges ?? "{}",
        consultWaitTime: body.consultWaitTime ?? "",
        consultCost: body.consultCost ?? "",
        secondConsultCost: body.secondConsultCost ?? "",
        surgeryWaitTime: body.surgeryWaitTime ?? "",
        revisionPolicy: body.revisionPolicy ?? "",
        paymentPlansAvailable: body.paymentPlansAvailable ?? false,
        paymentPlanDetails: body.paymentPlanDetails ?? "",
        depositInfo: body.depositInfo ?? "",
        beforeAfterAvailable: body.beforeAfterAvailable ?? false,
        callExperienceNotes: body.callExperienceNotes ?? "",
        followUpNotes: body.followUpNotes ?? "",
        additionalInfo: body.additionalInfo ?? "",
        acceptingPatients: body.acceptingPatients ?? true,
        internalRating: body.internalRating ?? null,
      },
    });

    return NextResponse.json(surgeon, { status: 201 });
  } catch (error) {
    console.error("POST /api/surgeons error:", error);
    return NextResponse.json(
      { error: "Failed to create surgeon" },
      { status: 500 }
    );
  }
}
