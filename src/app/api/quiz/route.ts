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
      procedure,
      location,
      priceTransparency,
      paymentPlans,
      timeSpent,
      consultations,
      consultationSurgeonName,
      priorities,
      confidence,
      budget,
      requirements,
      travelWillingness,
      anythingElse,
    } = body;

    // 1. Create client record with source="quiz"
    const client = await prisma.client.create({
      data: {
        name: name || "Unknown",
        email: email || "",
        phone: phone || "",
        procedure: procedure || "",
        location: location || "",
        state: location || "",
        budget: budget || "",
        priorities: JSON.stringify(priorities || []),
        requirements: JSON.stringify(requirements || []),
        source: "quiz",
        tier: "free",
        priceTransparency: priceTransparency || "",
        paymentPlanImportance: paymentPlans || "",
        timeSpentResearching: timeSpent || "",
        consultationStatus: consultations || "",
        previousConsults: consultationSurgeonName || "",
        confidence: confidence || "",
        travelWillingness: travelWillingness || "",
        additionalNotes: anythingElse || "",
      },
    });

    // 2. Run surgeon matching (algorithm + optional AI)
    const allSurgeons = await prisma.surgeon.findMany();

    const profile: ClientProfile = {
      procedure: procedure || "",
      location: location || "",
      state: (location || "").toUpperCase(),
      timeline: "",
      budget: budget || "",
      paymentPlan: paymentPlans || "",
      priorities: Array.isArray(priorities) ? priorities : [],
      travelWillingness: travelWillingness || "",
    };

    const scored = matchSurgeons(allSurgeons, profile, 8);

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

    const finalSurgeons = aiResponse
      ? aiResponse.finalThree.map((ai) => {
          const match = scored.find((s) => s.surgeon.id === ai.surgeonId);
          return { ...ai, scored: match };
        })
      : scored.slice(0, 3).map((s, i) => ({
          surgeonId: s.surgeon.id,
          rank: i + 1,
          matchReason:
            s.reasons.join(". ") ||
            "Strong algorithmic match based on your criteria.",
          strengths: s.reasons.slice(0, 2),
          considerations: [] as string[],
          scored: s,
        }));

    // 3. Create match record with surgeon matches
    const match = await prisma.match.create({
      data: {
        clientId: client.id,
        aiResponseRaw,
        status: "draft",
        tier: "free",
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
    });

    return NextResponse.json({ matchId: match.id });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: "Failed to process quiz submission" },
      { status: 500 }
    );
  }
}
