import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { matchSurgeons, type ClientProfile } from "@/lib/surgeon-matching";
import { enhanceMatchesWithAI } from "@/lib/ai-matching";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      typeformRaw,
      procedure,
      location,
      state,
      timeline,
      budget,
      paymentPlan,
      priorities,
      travelWillingness,
      previousConsults,
      additionalNotes,
      transcript,
    } = body;

    // 1. Create client record
    const client = await prisma.client.create({
      data: {
        name: name || "Unknown",
        email: email || "",
        phone: phone || "",
        typeformRaw: typeformRaw || "",
        transcript: transcript || "",
        procedure: procedure || "",
        location: location || "",
        state: state || "",
        timeline: timeline || "",
        budget: budget || "",
        paymentPlan: paymentPlan || "",
        priorities: JSON.stringify(priorities || []),
        travelWillingness: travelWillingness || "",
        previousConsults: previousConsults || "",
        additionalNotes: additionalNotes || "",
      },
    });

    // 2. Get all surgeons
    const allSurgeons = await prisma.surgeon.findMany();

    // 3. Run deterministic matching
    const profile: ClientProfile = {
      procedure,
      location,
      state,
      timeline,
      budget,
      paymentPlan,
      priorities: priorities || [],
      travelWillingness,
      transcript: transcript || undefined,
    };

    const scored = matchSurgeons(allSurgeons, profile, 8);

    // 4. Enhance with AI (if API key available)
    let aiResponse = null;
    let aiResponseRaw = "";
    try {
      aiResponse = await enhanceMatchesWithAI(scored, profile);
      if (aiResponse) {
        aiResponseRaw = JSON.stringify(aiResponse);
      }
    } catch (err) {
      console.error("AI matching failed, using algorithm only:", err);
    }

    // 5. Determine final top 3
    const finalSurgeons = aiResponse
      ? aiResponse.finalThree.map((ai) => {
          const match = scored.find((s) => s.surgeon.id === ai.surgeonId);
          return { ...ai, scored: match };
        })
      : scored.slice(0, 3).map((s, i) => ({
          surgeonId: s.surgeon.id,
          rank: i + 1,
          matchReason: s.reasons.join(". ") || "Strong algorithmic match based on your criteria.",
          strengths: s.reasons.slice(0, 2),
          considerations: [],
          scored: s,
        }));

    // 6. Create match record
    const match = await prisma.match.create({
      data: {
        clientId: client.id,
        aiResponseRaw,
        status: "draft",
        matchSurgeons: {
          create: finalSurgeons.map((fs) => ({
            surgeonId: fs.surgeonId,
            rank: fs.rank,
            finalScore: fs.scored?.totalScore || 0,
            matchReason: fs.matchReason,
            strengthsSummary: JSON.stringify(fs.strengths || []),
            considerationsSummary: JSON.stringify(fs.considerations || []),
          })),
        },
      },
      include: {
        client: true,
        matchSurgeons: {
          include: { surgeon: true },
          orderBy: { rank: "asc" },
        },
      },
    });

    return NextResponse.json(match);
  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json(
      { error: "Failed to run matching" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const matches = await prisma.match.findMany({
    where: status ? { status } : undefined,
    include: {
      client: true,
      matchSurgeons: {
        include: { surgeon: true },
        orderBy: { rank: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(matches);
}
