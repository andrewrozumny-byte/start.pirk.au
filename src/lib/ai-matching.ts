import Anthropic from "@anthropic-ai/sdk";
import type { Surgeon } from "@/generated/prisma/client";
import type { ClientProfile, SurgeonScore } from "./surgeon-matching";

export interface AIMatchResult {
  surgeonId: string;
  rank: number;
  matchReason: string;
  strengths: string[];
  considerations: string[];
}

export interface AIMatchResponse {
  finalThree: AIMatchResult[];
  notes: string;
}

const SYSTEM_PROMPT = `You are Pirk's surgeon matching assistant. You help match Australian cosmetic surgery clients with the best surgeons for their specific needs. You are thorough, evidence-based, and always prioritise patient safety and outcome quality.

You will receive:
1. A client profile (parsed from their questionnaire)
2. A shortlist of pre-scored surgeons (ranked by our algorithm)
3. Optionally, a call transcript from the client's consultation call with Pirk

Your job:
- Review the top candidates and confirm or adjust the top 3 picks
- If a call transcript is provided, use the insights from it to deeply understand the client's concerns, preferences, personality, and unstated needs — factor these into your matching decisions and reasoning
- For each of the final 3, write a personalised "why matched" explanation (2-3 sentences, warm but professional tone, avoid medical advice). If transcript is available, reference specific things the client mentioned in the call
- For each surgeon, note 1-2 key strengths and 1 consideration specific to this client
- If you recommend swapping any surgeon, explain why

Respond in this exact JSON format (no markdown fences):
{
  "finalThree": [
    {
      "surgeonId": "...",
      "rank": 1,
      "matchReason": "...",
      "strengths": ["...", "..."],
      "considerations": ["..."]
    }
  ],
  "notes": "Any overall notes about this match (optional)"
}`;

function formatSurgeonForAI(surgeon: Surgeon, score: number): string {
  const priceRanges: Record<string, string> = JSON.parse(
    surgeon.priceRanges || "{}"
  );
  const procedures: string[] = JSON.parse(surgeon.proceduresOffered || "[]");

  return `Name: ${surgeon.name}
ID: ${surgeon.id}
Practice: ${surgeon.practiceName}
Location: ${surgeon.suburb || surgeon.address}, ${surgeon.state}
Rating: ${surgeon.googleRating} (${surgeon.googleReviewCount} reviews)
Experience: ${surgeon.experienceQualification.slice(0, 500)}${surgeon.experienceQualification.length > 500 ? "..." : ""}
Year qualified: ${surgeon.yearOfCompletion || "Unknown"}
Procedures: ${procedures.join(", ")}
Pricing: ${Object.entries(priceRanges).map(([k, v]) => `${k}: ${v}`).join(", ") || "Not disclosed"}
Consult cost: ${surgeon.consultCost || "Unknown"}
Consult wait: ${surgeon.consultWaitTime || "Unknown"}
Surgery wait: ${surgeon.surgeryWaitTime || "Unknown"}
Payment plans: ${surgeon.paymentPlansAvailable ? "Yes" : "No"}${surgeon.paymentPlanDetails ? ` (${surgeon.paymentPlanDetails})` : ""}
Revision policy: ${surgeon.revisionPolicy || "Not stated"}
B&A photos: ${surgeon.beforeAfterAvailable ? "Available" : "Not available"}
Algorithm score: ${score}/100`;
}

export async function enhanceMatchesWithAI(
  scoredSurgeons: SurgeonScore[],
  profile: ClientProfile
): Promise<AIMatchResponse | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return null; // Fall back to algorithm-only matching
  }

  const client = new Anthropic({ apiKey });

  const surgeonDescriptions = scoredSurgeons
    .slice(0, 8)
    .map((s, i) => `### Surgeon ${i + 1} — Score: ${s.totalScore}/100\n${formatSurgeonForAI(s.surgeon, s.totalScore)}`)
    .join("\n\n");

  const transcriptSection = profile.transcript
    ? `\n\n## Call Transcript\nBelow is the transcript from the client's consultation call with Pirk. Use the insights from this conversation to better understand what the client is looking for, their concerns, personality, and any preferences not captured in the questionnaire.\n\n${profile.transcript.slice(0, 15000)}`
    : "";

  const userPrompt = `## Client Profile
Procedure: ${profile.procedure}
Location: ${profile.location} (${profile.state})
Timeline: ${profile.timeline}
Budget: ${profile.budget}
Payment preference: ${profile.paymentPlan}
What matters most: ${profile.priorities.join(", ")}
Travel willingness: ${profile.travelWillingness}${transcriptSection}

## Pre-Scored Surgeon Shortlist

${surgeonDescriptions}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    return JSON.parse(text) as AIMatchResponse;
  } catch {
    console.error("Failed to parse AI response:", text);
    return null;
  }
}
