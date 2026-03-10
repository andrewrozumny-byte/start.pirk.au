import type { Surgeon } from "@/generated/prisma/client";

// ============================================================
// TYPES
// ============================================================

export interface ClientProfile {
  procedure: string;
  location: string;
  state: string;
  timeline: string;
  budget: string;
  paymentPlan: string;
  priorities: string[];
  travelWillingness: string;
  transcript?: string;
}

export interface SurgeonScore {
  surgeon: Surgeon;
  totalScore: number;
  baseScore: number;
  patientFitScore: number;
  reasons: string[];
}

// ============================================================
// CONSTANTS
// ============================================================

const MAX_BASE_SCORE = 30;
const MAX_PATIENT_FIT_SCORE = 70;

// ============================================================
// STATE MAPPING
// ============================================================

function extractStateFromAddress(address: string): string | null {
  const text = (address || "").toLowerCase();
  // Check city names and state abbreviations
  if (text.includes("melbourne") || text.includes("malvern") || text.includes("windsor") ||
      text.includes("brighton") || text.includes("toorak") || text.includes("prahran") ||
      text.includes("hawthorn") || text.includes("richmond") || text.includes("south yarra") ||
      text.includes("essendon") || text.includes("carlton") || text.includes("bendigo") ||
      text.includes("geelong") || /\bvic\b/.test(text)) return "VIC";
  if (text.includes("sydney") || text.includes("bondi") || text.includes("double bay") ||
      text.includes("chatswood") || text.includes("parramatta") || /\bnsw\b/.test(text)) return "NSW";
  if (text.includes("brisbane") || text.includes("gold coast") || text.includes("sunshine coast") ||
      /\bqld\b/.test(text)) return "QLD";
  if (text.includes("adelaide") || /\b sa\b/.test(text)) return "SA";
  if (text.includes("perth") || text.includes("subiaco") || /\b wa\b/.test(text)) return "WA";
  if (text.includes("hobart") || /\btas\b/.test(text)) return "TAS";
  if (text.includes("darwin") || /\b nt\b/.test(text)) return "NT";
  if (text.includes("canberra") || /\bact\b/.test(text)) return "ACT";
  return null;
}

function getSurgeonState(surgeon: Surgeon): string | null {
  if (surgeon.state) return surgeon.state;
  return extractStateFromAddress(surgeon.address);
}

// ============================================================
// PROCEDURE MATCHING - checks multiple data sources
// ============================================================

function surgeonOffersProcedure(surgeon: Surgeon, procedure: string): boolean {
  if (!procedure) return true;

  const procLower = procedure.toLowerCase().replace(/-/g, " ");
  const procWords = procLower.split(" ");

  // Check proceduresOffered JSON
  const procedures: string[] = JSON.parse(surgeon.proceduresOffered || "[]");
  const procMatch = procedures.some(
    (p) => {
      const pLower = p.toLowerCase().replace(/-/g, " ");
      return pLower === procLower ||
        pLower.includes(procLower) ||
        procLower.includes(pLower);
    }
  );
  if (procMatch) return true;

  // Check the bio/experience text for procedure mentions
  const bio = (surgeon.experienceQualification || "").toLowerCase();
  if (procWords.every(w => bio.includes(w))) return true;

  // Check additional info
  const additional = (surgeon.additionalInfo || "").toLowerCase();
  if (procWords.every(w => additional.includes(w))) return true;

  // Breast-specific: check if bio mentions "breast" for any breast procedure
  if (procLower.includes("breast") && (bio.includes("breast") || additional.includes("breast"))) {
    return true;
  }

  // Check if priceRanges has pricing for this procedure
  const priceRanges: Record<string, string> = JSON.parse(surgeon.priceRanges || "{}");
  if (priceRanges[procedure]) return true;

  return false;
}

// ============================================================
// HARD FILTERS (very lenient - just basic eligibility)
// ============================================================

function passesHardFilters(surgeon: Surgeon, profile: ClientProfile): boolean {
  if (!surgeon.acceptingPatients) return false;

  // Only hard-filter on procedure if surgeon has procedures listed AND doesn't match
  // If surgeon has no procedure data at all, let them through (score will be lower)
  if (profile.procedure) {
    const hasAnyProcData =
      surgeon.proceduresOffered !== "[]" ||
      surgeon.experienceQualification.length > 50;

    if (hasAnyProcData && !surgeonOffersProcedure(surgeon, profile.procedure)) {
      return false;
    }
  }

  // Location: only hard-filter for "local-only" (strict), not "prefer-local"
  if (profile.travelWillingness === "local-only") {
    const clientState = profile.state || extractStateFromAddress(profile.location);
    const surgeonState = getSurgeonState(surgeon);
    if (clientState && surgeonState && surgeonState !== clientState) {
      return false;
    }
  }

  return true;
}

// ============================================================
// BASE SCORE (0-30): Surgeon quality independent of client
// ============================================================

function calculateBaseScore(surgeon: Surgeon): number {
  let score = 0;

  // Experience years (0-8 points)
  if (surgeon.yearOfCompletion) {
    const yearsExp = new Date().getFullYear() - surgeon.yearOfCompletion;
    if (yearsExp >= 20) score += 8;
    else if (yearsExp >= 15) score += 7;
    else if (yearsExp >= 10) score += 6;
    else if (yearsExp >= 5) score += 4;
    else score += 2;
  }

  // FRACS qualification (0-4 points)
  const bio = (surgeon.experienceQualification || "").toLowerCase();
  if (bio.includes("fracs")) score += 4;
  else if (bio.includes("fellow")) score += 2;

  // Google reviews & rating (0-8 points)
  if (surgeon.googleRating >= 4.8 && surgeon.googleReviewCount >= 50) score += 8;
  else if (surgeon.googleRating >= 4.5 && surgeon.googleReviewCount >= 30) score += 6;
  else if (surgeon.googleRating >= 4.0 && surgeon.googleReviewCount >= 20) score += 4;
  else if (surgeon.googleRating >= 3.5) score += 2;

  // Has revision policy (0-3 points)
  if (surgeon.revisionPolicy && surgeon.revisionPolicy.length > 5) score += 3;

  // Has before & after photos (0-3 points)
  if (surgeon.beforeAfterAvailable) score += 3;

  // Payment plans available (0-2 points)
  if (surgeon.paymentPlansAvailable) score += 2;

  // Internal rating boost (0-2 points)
  if (surgeon.internalRating && surgeon.internalRating >= 0.8) score += 2;

  return Math.min(score, MAX_BASE_SCORE);
}

// ============================================================
// PATIENT FIT SCORE (0-70): How well surgeon matches client
// ============================================================

function calculatePatientFitScore(
  surgeon: Surgeon,
  profile: ClientProfile
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Procedure specialisation match (0-15 points)
  if (profile.procedure) {
    const bio = (surgeon.experienceQualification || "").toLowerCase();
    const procLower = profile.procedure.toLowerCase().replace(/-/g, " ");

    if (bio.includes(procLower)) {
      score += 15;
      reasons.push(`Experience in ${profile.procedure.replace(/-/g, " ")}`);
    } else if (surgeonOffersProcedure(surgeon, profile.procedure)) {
      score += 10;
      reasons.push(`Performs ${profile.procedure.replace(/-/g, " ")}`);
    } else {
      score += 3;
    }
  }

  // Location match (0-15 points)
  const clientState = profile.state || extractStateFromAddress(profile.location);
  const surgeonState = getSurgeonState(surgeon);

  if (clientState && surgeonState === clientState) {
    score += 15;
    reasons.push(`Located in ${surgeonState}`);
  } else if (!surgeonState) {
    // Unknown state — give partial credit
    score += 5;
  } else if (
    profile.travelWillingness === "flexible" ||
    profile.travelWillingness === "interstate"
  ) {
    score += 5;
  }

  // Budget alignment (0-15 points)
  if (profile.procedure) {
    const priceRanges: Record<string, string> = JSON.parse(
      surgeon.priceRanges || "{}"
    );
    const price = priceRanges[profile.procedure];
    if (price) {
      score += 10;
      reasons.push("Pricing information available");
    }
  }

  // Timeline alignment (0-10 points)
  const waitTime = (surgeon.surgeryWaitTime || "").toLowerCase();
  if (profile.timeline === "asap" || profile.timeline === "ready-now") {
    if (
      waitTime.includes("week") ||
      waitTime.includes("1 month") ||
      waitTime.includes("2 month")
    ) {
      score += 10;
      reasons.push("Short surgery wait time");
    } else if (waitTime) {
      score += 5;
    }
  } else {
    if (waitTime) score += 7;
  }

  // Payment plan match (0-8 points)
  if (
    profile.paymentPlan === "yes-interested" ||
    profile.paymentPlan === "yes"
  ) {
    if (surgeon.paymentPlansAvailable) {
      score += 8;
      reasons.push("Offers payment plans");
    }
  } else {
    score += 4;
  }

  // Priority alignment (0-7 points)
  if (profile.priorities.length > 0) {
    for (const priority of profile.priorities) {
      const pLower = priority.toLowerCase();
      if (
        (pLower.includes("review") || pLower.includes("outcome")) &&
        surgeon.googleRating >= 4.5
      ) {
        score += 3;
        reasons.push("Highly rated by patients");
        break;
      }
      if (
        pLower.includes("experience") &&
        surgeon.yearOfCompletion &&
        new Date().getFullYear() - surgeon.yearOfCompletion >= 15
      ) {
        score += 3;
        reasons.push("Highly experienced surgeon");
        break;
      }
      if (pLower.includes("price") && surgeon.paymentPlansAvailable) {
        score += 3;
        reasons.push("Flexible pricing options");
        break;
      }
    }
  }

  return { score: Math.min(score, MAX_PATIENT_FIT_SCORE), reasons };
}

// ============================================================
// MAIN MATCHING FUNCTION
// ============================================================

export function matchSurgeons(
  surgeons: Surgeon[],
  profile: ClientProfile,
  topN: number = 5
): SurgeonScore[] {
  const eligible = surgeons.filter((s) => passesHardFilters(s, profile));

  const scored: SurgeonScore[] = eligible.map((surgeon) => {
    const baseScore = calculateBaseScore(surgeon);
    const { score: fitScore, reasons } = calculatePatientFitScore(
      surgeon,
      profile
    );

    return {
      surgeon,
      totalScore: baseScore + fitScore,
      baseScore,
      patientFitScore: fitScore,
      reasons,
    };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);

  return scored.slice(0, topN);
}
