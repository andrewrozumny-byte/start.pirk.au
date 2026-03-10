export interface ProfileField {
  key: string;
  label: string;
  category: string;
  weight: number; // importance weight for scoring
}

export const PROFILE_FIELDS: ProfileField[] = [
  // Contact & Location (essential)
  { key: "practiceName", label: "Practice Name", category: "Contact & Location", weight: 3 },
  { key: "address", label: "Address", category: "Contact & Location", weight: 2 },
  { key: "suburb", label: "Suburb", category: "Contact & Location", weight: 2 },
  { key: "state", label: "State", category: "Contact & Location", weight: 3 },
  { key: "postcode", label: "Postcode", category: "Contact & Location", weight: 1 },
  { key: "phone", label: "Phone", category: "Contact & Location", weight: 3 },
  { key: "website", label: "Website", category: "Contact & Location", weight: 2 },

  // Qualifications
  { key: "experienceQualification", label: "Qualifications / Experience", category: "Qualifications", weight: 3 },
  { key: "yearOfCompletion", label: "Year of Completion", category: "Qualifications", weight: 2 },

  // Online Presence
  { key: "googleRating", label: "Google Rating", category: "Online Presence", weight: 2 },
  { key: "googleReviewCount", label: "Google Review Count", category: "Online Presence", weight: 1 },
  { key: "instagram", label: "Instagram", category: "Online Presence", weight: 1 },
  { key: "tiktok", label: "TikTok", category: "Online Presence", weight: 1 },

  // Procedures & Pricing (high value)
  { key: "proceduresOffered", label: "Procedures Offered", category: "Procedures & Pricing", weight: 3 },
  { key: "priceRanges", label: "Price Ranges", category: "Procedures & Pricing", weight: 3 },

  // Consultation
  { key: "consultWaitTime", label: "Consultation Wait Time", category: "Consultation & Surgery", weight: 2 },
  { key: "consultCost", label: "Consultation Cost", category: "Consultation & Surgery", weight: 3 },
  { key: "secondConsultCost", label: "Second Consultation Cost", category: "Consultation & Surgery", weight: 1 },
  { key: "surgeryWaitTime", label: "Surgery Wait Time", category: "Consultation & Surgery", weight: 2 },

  // Financial
  { key: "revisionPolicy", label: "Revision Policy", category: "Financial", weight: 2 },
  { key: "paymentPlanDetails", label: "Payment Plan Details", category: "Financial", weight: 2 },
  { key: "depositInfo", label: "Deposit Information", category: "Financial", weight: 2 },

  // Media
  { key: "beforeAfterLinks", label: "Before & After Photos", category: "Media", weight: 2 },
];

function isFieldFilled(value: unknown, key: string): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return false;
    // JSON arrays/objects that are empty
    if (trimmed === "[]" || trimmed === "{}") return false;
    // Check if JSON array has items
    if (key === "proceduresOffered" || key === "beforeAfterLinks") {
      try {
        const arr = JSON.parse(trimmed);
        return Array.isArray(arr) && arr.length > 0;
      } catch {
        return trimmed.length > 0;
      }
    }
    // Check if price ranges has entries
    if (key === "priceRanges") {
      try {
        const obj = JSON.parse(trimmed);
        return Object.keys(obj).length > 0;
      } catch {
        return trimmed.length > 0;
      }
    }
    return true;
  }
  if (typeof value === "number") return value > 0;
  if (typeof value === "boolean") return true; // booleans are always "filled"
  return false;
}

export interface CompletenessResult {
  score: number; // 0-100
  filled: number;
  total: number;
  ranking: "great" | "ok" | "needs-work";
  rankLabel: string;
  rankDescription: string;
  fields: {
    key: string;
    label: string;
    category: string;
    filled: boolean;
    weight: number;
  }[];
  categories: {
    name: string;
    filled: number;
    total: number;
    percentage: number;
  }[];
}

export function calculateCompleteness(
  surgeon: Record<string, unknown>
): CompletenessResult {
  let weightedFilled = 0;
  let weightedTotal = 0;
  let filledCount = 0;

  const fields = PROFILE_FIELDS.map((field) => {
    const filled = isFieldFilled(surgeon[field.key], field.key);
    weightedTotal += field.weight;
    if (filled) {
      weightedFilled += field.weight;
      filledCount++;
    }
    return { ...field, filled };
  });

  const score = Math.round((weightedFilled / weightedTotal) * 100);

  // Group by category
  const catMap = new Map<string, { filled: number; total: number }>();
  for (const f of fields) {
    const cat = catMap.get(f.category) || { filled: 0, total: 0 };
    cat.total++;
    if (f.filled) cat.filled++;
    catMap.set(f.category, cat);
  }

  const categories = Array.from(catMap.entries()).map(([name, data]) => ({
    name,
    filled: data.filled,
    total: data.total,
    percentage: Math.round((data.filled / data.total) * 100),
  }));

  let ranking: "great" | "ok" | "needs-work";
  let rankLabel: string;
  let rankDescription: string;

  if (score >= 75) {
    ranking = "great";
    rankLabel = "You're ranking well!";
    rankDescription =
      "Your profile is strong. Clients are seeing comprehensive information about your practice, which builds trust and increases referrals.";
  } else if (score >= 45) {
    ranking = "ok";
    rankLabel = "You're doing OK";
    rankDescription =
      "Your profile has the basics covered, but there are gaps that could be costing you referrals. Filling in the missing details will help us match you with the right clients.";
  } else {
    ranking = "needs-work";
    rankLabel = "You could be doing better";
    rankDescription =
      "Your profile is missing key information that clients look for. The more complete your profile, the more confidently we can recommend you to the right clients.";
  }

  return {
    score,
    filled: filledCount,
    total: PROFILE_FIELDS.length,
    ranking,
    rankLabel,
    rankDescription,
    fields,
    categories,
  };
}
