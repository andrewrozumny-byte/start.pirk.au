import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateCompleteness } from "@/lib/profile-completeness";

// GET /api/surgeon-profiles - list all surgeons with completeness scores
export async function GET() {
  try {
    const surgeons = await prisma.surgeon.findMany({
      orderBy: { name: "asc" },
    });

    const profiles = surgeons.map((surgeon) => {
      const completeness = calculateCompleteness(
        surgeon as unknown as Record<string, unknown>
      );
      return {
        id: surgeon.id,
        name: surgeon.name,
        practiceName: surgeon.practiceName,
        state: surgeon.state,
        profileToken: surgeon.profileToken,
        lastProfileUpdate: surgeon.lastProfileUpdate,
        reminderSentAt: surgeon.reminderSentAt,
        acceptingPatients: surgeon.acceptingPatients,
        score: completeness.score,
        ranking: completeness.ranking,
        rankLabel: completeness.rankLabel,
        filled: completeness.filled,
        total: completeness.total,
      };
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("GET /api/surgeon-profiles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}
