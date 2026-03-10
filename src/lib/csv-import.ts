import * as XLSX from "xlsx";
import { Prisma } from "@/generated/prisma/client";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export interface ImportResult {
  valid: Prisma.SurgeonCreateInput[];
  errors: ImportError[];
}

// ── CSV Column mapping (from the real spreadsheet header in row 2) ─────────

const COLUMN_MAP: Record<string, string> = {
  "surgeon name": "name",
  "practice name": "practiceName",
  "address": "address",
  "phone": "phone",
  "rating": "rating",
  "reviews": "reviews",
  "website": "website",
  "experience / qualification": "experienceQualification",
  "year of completion": "yearOfCompletion",
  "instagram": "instagram",
  "tiktok": "tiktok",
  "b&a aug": "baAug",
  "b&a lift": "baLift",
  "b&a reduction": "baReduction",
  "other breast": "otherBreast",
  "additional": "additional",
  "procedures": "procedures",
  "consult wait": "consultWaitTime",
  "consult cost": "consultCost",
  "second consult cost": "secondConsultCost",
  "surgery wait times": "surgeryWaitTime",
  "breast augmentation cost": "breastAugmentationCost",
  "breast lift cost": "breastLiftCost",
  "breast reduction cost": "breastReductionCost",
  "what happens if you need revision?": "revisionPolicy",
  "payment plans available?": "paymentPlansAvailable",
  "how much is deposit...": "depositInfo",
  "how much is deposit": "depositInfo",
  "can you provide before and after photos?": "beforeAfterAvailable",
  "how was the experience?": "callExperience",
  "did they take your name/number/email?": "followUpAction",
  "did they send anything out to you?": "sentMaterials",
  "any other information": "additionalInfo",
  "about the client with breast implant": "aboutClient",
  "about the client with breast implant...": "aboutClient",
};

// ── State extraction ───────────────────────────────────────────────────────

const STATE_PATTERNS: { state: string; patterns: RegExp[] }[] = [
  {
    state: "VIC",
    patterns: [
      /\bVIC\b/i,
      /\bVictoria\b/i,
      /\bMelbourne\b/i,
      /\bGeelong\b/i,
      /\bBallarat\b/i,
      /\bBendigo\b/i,
    ],
  },
  {
    state: "NSW",
    patterns: [
      /\bNSW\b/i,
      /\bNew South Wales\b/i,
      /\bSydney\b/i,
      /\bNewcastle\b/i,
      /\bWollongong\b/i,
    ],
  },
  {
    state: "QLD",
    patterns: [
      /\bQLD\b/i,
      /\bQueensland\b/i,
      /\bBrisbane\b/i,
      /\bGold Coast\b/i,
      /\bSunshine Coast\b/i,
      /\bCairns\b/i,
      /\bTownsville\b/i,
    ],
  },
  {
    state: "SA",
    patterns: [
      /\bSA\b/i,
      /\bSouth Australia\b/i,
      /\bAdelaide\b/i,
    ],
  },
  {
    state: "WA",
    patterns: [
      /\bWA\b/i,
      /\bWestern Australia\b/i,
      /\bPerth\b/i,
      /\bFremantle\b/i,
    ],
  },
  {
    state: "TAS",
    patterns: [
      /\bTAS\b/i,
      /\bTasmania\b/i,
      /\bHobart\b/i,
      /\bLaunceston\b/i,
    ],
  },
  {
    state: "NT",
    patterns: [
      /\bNT\b/i,
      /\bNorthern Territory\b/i,
      /\bDarwin\b/i,
    ],
  },
  {
    state: "ACT",
    patterns: [
      /\bACT\b/i,
      /\bAustralian Capital Territory\b/i,
      /\bCanberra\b/i,
    ],
  },
];

function extractState(address: string): string {
  for (const { state, patterns } of STATE_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(address)) {
        return state;
      }
    }
  }
  return "";
}

// Extract suburb from an Australian address string.
// Common formats:
//   "123 Some St, Suburb VIC 3000"
//   "Suite 1, 45 Road, Suburb, VIC"
//   "Suburb, State"
function extractSuburb(address: string): string {
  if (!address) return "";

  // Try to find postcode pattern: "Suburb STATE 1234"
  const postcodeMatch = address.match(
    /,\s*([A-Za-z\s]+?)\s+(?:VIC|NSW|QLD|SA|WA|TAS|NT|ACT)\s*\d{4}/i
  );
  if (postcodeMatch) {
    return postcodeMatch[1].trim();
  }

  // Try "..., Suburb, STATE" or "..., Suburb STATE"
  const commaMatch = address.match(
    /,\s*([A-Za-z\s]+?)\s*,?\s*(?:VIC|NSW|QLD|SA|WA|TAS|NT|ACT)\b/i
  );
  if (commaMatch) {
    return commaMatch[1].trim();
  }

  // Fallback: split by comma, take the second-to-last non-empty segment
  const parts = address
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    // The suburb is usually the second-to-last part
    const candidate = parts[parts.length - 2]
      .replace(/\d+/g, "")
      .replace(/\b(VIC|NSW|QLD|SA|WA|TAS|NT|ACT)\b/gi, "")
      .trim();
    if (candidate) return candidate;
  }

  return "";
}

// Extract postcode from address
function extractPostcode(address: string): string {
  const match = address.match(/\b(\d{4})\b/);
  return match ? match[1] : "";
}

// ── Procedure slug mapping ─────────────────────────────────────────────────

const PROCEDURE_SLUG_MAP: { pattern: RegExp; slug: string }[] = [
  { pattern: /breast\s*augmentation/i, slug: "breast-augmentation" },
  { pattern: /breast\s*lift/i, slug: "breast-lift" },
  { pattern: /mastopexy/i, slug: "breast-lift" },
  { pattern: /breast\s*reduction/i, slug: "breast-reduction" },
  { pattern: /breast\s*revision/i, slug: "breast-revision" },
  { pattern: /breast\s*implant\s*removal/i, slug: "breast-implant-removal" },
  { pattern: /explant/i, slug: "breast-implant-removal" },
  { pattern: /capsulectomy/i, slug: "capsulectomy" },
  { pattern: /rhinoplasty/i, slug: "rhinoplasty" },
  { pattern: /nose\s*job/i, slug: "rhinoplasty" },
  { pattern: /abdominoplasty/i, slug: "tummy-tuck" },
  { pattern: /tummy\s*tuck/i, slug: "tummy-tuck" },
  { pattern: /liposuction/i, slug: "liposuction" },
  { pattern: /lipo\b/i, slug: "liposuction" },
  { pattern: /facelift/i, slug: "facelift" },
  { pattern: /face\s*lift/i, slug: "facelift" },
  { pattern: /blepharoplasty/i, slug: "blepharoplasty" },
  { pattern: /eyelid/i, slug: "blepharoplasty" },
  { pattern: /brow\s*lift/i, slug: "brow-lift" },
  { pattern: /otoplasty/i, slug: "otoplasty" },
  { pattern: /ear\s*(pinning|surgery|correction)/i, slug: "otoplasty" },
  { pattern: /body\s*lift/i, slug: "body-lift" },
  { pattern: /arm\s*lift/i, slug: "arm-lift" },
  { pattern: /brachioplasty/i, slug: "arm-lift" },
  { pattern: /thigh\s*lift/i, slug: "thigh-lift" },
  { pattern: /mummy\s*makeover/i, slug: "mummy-makeover" },
  { pattern: /mommy\s*makeover/i, slug: "mummy-makeover" },
  { pattern: /fat\s*transfer/i, slug: "fat-transfer" },
  { pattern: /bbl/i, slug: "bbl" },
  { pattern: /brazilian\s*butt/i, slug: "bbl" },
  { pattern: /labiaplasty/i, slug: "labiaplasty" },
  { pattern: /gynecomastia/i, slug: "gynecomastia" },
  { pattern: /chin\s*(implant|augmentation)/i, slug: "chin-augmentation" },
  { pattern: /neck\s*lift/i, slug: "neck-lift" },
];

function parseProcedures(text: string): string[] {
  if (!text) return [];
  const slugs = new Set<string>();
  for (const { pattern, slug } of PROCEDURE_SLUG_MAP) {
    if (pattern.test(text)) {
      slugs.add(slug);
    }
  }
  return Array.from(slugs);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function parseRating(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : Math.min(num, 5);
}

function parseReviews(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const num = parseInt(String(value).replace(/[^0-9]/g, ""), 10);
  return isNaN(num) ? 0 : num;
}

function parseYear(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = parseInt(String(value).replace(/[^0-9]/g, ""), 10);
  if (isNaN(num)) return null;
  // Handle 2-digit years
  if (num >= 0 && num <= 99) {
    return num > 50 ? 1900 + num : 2000 + num;
  }
  // Only return plausible years
  if (num >= 1950 && num <= 2030) return num;
  return null;
}

function parsePaymentPlans(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const str = String(value).toLowerCase().trim();
  return (
    str === "yes" ||
    str === "y" ||
    str === "true" ||
    str === "1" ||
    str.includes("yes") ||
    str.includes("available") ||
    str.includes("offer")
  );
}

function parseBeforeAfterAvailable(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const str = String(value).toLowerCase().trim();
  return (
    str === "yes" ||
    str === "y" ||
    str === "true" ||
    str === "1" ||
    str.includes("yes")
  );
}

function cleanString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function isLikelySurgeon(name: string, qualifications: string): boolean {
  if (!name || !name.trim()) return false;

  const lowerName = name.toLowerCase();
  const lowerQual = qualifications.toLowerCase();

  // Skip generic labels or headers
  if (
    lowerName === "surgeon name" ||
    lowerName === "name" ||
    lowerName === "n/a" ||
    lowerName === "-"
  ) {
    return false;
  }

  // Skip if clearly not a surgeon (general practitioner etc.)
  const excludePatterns = [
    /\bgeneral practitioner\b/i,
    /\bGP\b/,
    /\bdentist\b/i,
    /\bdermatologist\b/i,
    /\bphysiotherapist\b/i,
  ];
  for (const pat of excludePatterns) {
    if (pat.test(lowerName) || pat.test(lowerQual)) {
      return false;
    }
  }

  return true;
}

// ── CSV parsing (handles quoted multi-line cells) ──────────────────────────

function parseCSVText(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;
  let i = 0;

  while (i < csvText.length) {
    const char = csvText[i];

    if (inQuotes) {
      if (char === '"') {
        // Check for escaped quote (double quote)
        if (i + 1 < csvText.length && csvText[i + 1] === '"') {
          currentField += '"';
          i += 2;
          continue;
        }
        // End of quoted field
        inQuotes = false;
        i++;
        continue;
      }
      // Inside quotes: accept everything including newlines
      currentField += char;
      i++;
      continue;
    }

    // Not inside quotes
    if (char === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (char === ",") {
      currentRow.push(currentField);
      currentField = "";
      i++;
      continue;
    }

    if (char === "\n" || char === "\r") {
      // Handle \r\n
      if (char === "\r" && i + 1 < csvText.length && csvText[i + 1] === "\n") {
        i++;
      }
      currentRow.push(currentField);
      currentField = "";
      rows.push(currentRow);
      currentRow = [];
      i++;
      continue;
    }

    currentField += char;
    i++;
  }

  // Push last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

// ── Main parse function ────────────────────────────────────────────────────

function normalizeHeaderKey(header: string): string {
  return header
    .toLowerCase()
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/\s+/g, " ")
    .replace(/\.{3,}$/, "")
    .trim();
}

function rowToMappedObject(
  headers: string[],
  row: (string | number | boolean | null)[]
): Record<string, string> {
  const obj: Record<string, string> = {};
  for (let i = 0; i < headers.length; i++) {
    const normalizedHeader = normalizeHeaderKey(headers[i] || "");
    const mappedKey = COLUMN_MAP[normalizedHeader];
    if (mappedKey) {
      obj[mappedKey] = cleanString(row[i]);
    }
  }
  return obj;
}

function mapRowToSurgeonInput(
  mapped: Record<string, string>,
  rowIndex: number,
  errors: ImportError[]
): Prisma.SurgeonCreateInput | null {
  const name = mapped.name || "";
  const qualifications = mapped.experienceQualification || "";

  if (!isLikelySurgeon(name, qualifications)) {
    return null;
  }

  // Validate name
  if (!name.trim()) {
    errors.push({
      row: rowIndex,
      field: "name",
      message: "Surgeon name is empty",
    });
    return null;
  }

  const address = mapped.address || "";
  const state = extractState(address);
  const suburb = extractSuburb(address);
  const postcode = extractPostcode(address);

  // Collect B&A links
  const baLinks: string[] = [];
  if (mapped.baAug) baLinks.push(mapped.baAug);
  if (mapped.baLift) baLinks.push(mapped.baLift);
  if (mapped.baReduction) baLinks.push(mapped.baReduction);
  if (mapped.otherBreast) baLinks.push(mapped.otherBreast);
  if (mapped.additional) baLinks.push(mapped.additional);

  // Parse procedures
  const procedureText = [
    mapped.procedures || "",
    mapped.experienceQualification || "",
  ].join(" ");
  const procedureSlugs = parseProcedures(procedureText);

  // Build price ranges
  const priceRanges: Record<string, string> = {};
  if (mapped.breastAugmentationCost) {
    priceRanges["breast-augmentation"] = mapped.breastAugmentationCost;
  }
  if (mapped.breastLiftCost) {
    priceRanges["breast-lift"] = mapped.breastLiftCost;
  }
  if (mapped.breastReductionCost) {
    priceRanges["breast-reduction"] = mapped.breastReductionCost;
  }

  // Build internal notes from call experience fields
  const callNotes = [
    mapped.callExperience ? `Experience: ${mapped.callExperience}` : "",
    mapped.followUpAction ? `Follow-up: ${mapped.followUpAction}` : "",
    mapped.sentMaterials ? `Sent materials: ${mapped.sentMaterials}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const surgeon: Prisma.SurgeonCreateInput = {
    name: name.trim(),
    practiceName: (mapped.practiceName || "").trim(),
    address: address.trim(),
    suburb,
    state,
    postcode,
    phone: (mapped.phone || "").trim(),
    website: (mapped.website || "").trim(),
    experienceQualification: (mapped.experienceQualification || "").trim(),
    yearOfCompletion: parseYear(mapped.yearOfCompletion),
    googleRating: parseRating(mapped.rating),
    googleReviewCount: parseReviews(mapped.reviews),
    instagram: (mapped.instagram || "").trim(),
    tiktok: (mapped.tiktok || "").trim(),
    beforeAfterLinks: JSON.stringify(baLinks.filter(Boolean)),
    proceduresOffered: JSON.stringify(procedureSlugs),
    priceRanges: JSON.stringify(priceRanges),
    consultWaitTime: (mapped.consultWaitTime || "").trim(),
    consultCost: (mapped.consultCost || "").trim(),
    secondConsultCost: (mapped.secondConsultCost || "").trim(),
    surgeryWaitTime: (mapped.surgeryWaitTime || "").trim(),
    revisionPolicy: (mapped.revisionPolicy || "").trim(),
    paymentPlansAvailable: parsePaymentPlans(mapped.paymentPlansAvailable),
    paymentPlanDetails: (mapped.paymentPlansAvailable || "").trim(),
    depositInfo: (mapped.depositInfo || "").trim(),
    beforeAfterAvailable: parseBeforeAfterAvailable(
      mapped.beforeAfterAvailable
    ),
    callExperienceNotes: callNotes,
    additionalInfo: (mapped.additionalInfo || "").trim(),
  };

  return surgeon;
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Parse a CSV string into Surgeon create inputs.
 */
export function parseCSV(csvText: string): ImportResult {
  const errors: ImportError[] = [];
  const valid: Prisma.SurgeonCreateInput[] = [];

  const rows = parseCSVText(csvText);
  if (rows.length < 2) {
    errors.push({ row: 0, field: "file", message: "CSV file is empty or has no data rows" });
    return { valid, errors };
  }

  // The real spreadsheet has a title row in row 1 and headers in row 2.
  // Detect: if the first row has fewer non-empty cells than the second, skip it.
  let headerRowIndex = 0;
  const row0NonEmpty = rows[0]?.filter((c) => c.trim()).length ?? 0;
  const row1NonEmpty =
    rows.length > 1 ? (rows[1]?.filter((c) => c.trim()).length ?? 0) : 0;

  if (row1NonEmpty > row0NonEmpty && row1NonEmpty > 5) {
    headerRowIndex = 1;
  }

  const headers = rows[headerRowIndex].map((h) => String(h).trim());
  const dataStartRow = headerRowIndex + 1;

  for (let i = dataStartRow; i < rows.length; i++) {
    const row = rows[i];
    // Skip completely empty rows
    if (!row || row.every((cell) => !cell.trim())) continue;

    try {
      const mapped = rowToMappedObject(headers, row);
      const surgeon = mapRowToSurgeonInput(mapped, i + 1, errors);
      if (surgeon) {
        valid.push(surgeon);
      }
    } catch (err) {
      errors.push({
        row: i + 1,
        field: "unknown",
        message: `Failed to parse row: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  return { valid, errors };
}

/**
 * Parse an XLSX buffer into Surgeon create inputs.
 */
export function parseXLSX(buffer: Buffer | ArrayBuffer): ImportResult {
  const errors: ImportError[] = [];
  const valid: Prisma.SurgeonCreateInput[] = [];

  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "buffer" });
  } catch (err) {
    errors.push({
      row: 0,
      field: "file",
      message: `Failed to read XLSX file: ${err instanceof Error ? err.message : String(err)}`,
    });
    return { valid, errors };
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    errors.push({ row: 0, field: "file", message: "XLSX file has no sheets" });
    return { valid, errors };
  }

  const sheet = workbook.Sheets[sheetName];
  // Convert to array of arrays to preserve row order and handle merged cells
  const rawRows: (string | number | boolean | null)[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (rawRows.length < 2) {
    errors.push({ row: 0, field: "file", message: "XLSX sheet is empty or has no data rows" });
    return { valid, errors };
  }

  // Detect header row (same heuristic as CSV)
  let headerRowIndex = 0;
  const r0NonEmpty = rawRows[0]?.filter((c) => String(c).trim()).length ?? 0;
  const r1NonEmpty =
    rawRows.length > 1
      ? (rawRows[1]?.filter((c) => String(c).trim()).length ?? 0)
      : 0;

  if (r1NonEmpty > r0NonEmpty && r1NonEmpty > 5) {
    headerRowIndex = 1;
  }

  const headers = rawRows[headerRowIndex].map((h) => String(h ?? "").trim());
  const dataStartRow = headerRowIndex + 1;

  for (let i = dataStartRow; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.every((cell) => !String(cell).trim())) continue;

    try {
      const mapped = rowToMappedObject(headers, row);
      const surgeon = mapRowToSurgeonInput(mapped, i + 1, errors);
      if (surgeon) {
        valid.push(surgeon);
      }
    } catch (err) {
      errors.push({
        row: i + 1,
        field: "unknown",
        message: `Failed to parse row: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  return { valid, errors };
}

/**
 * Auto-detect format and parse.
 * - If input is a string, treat as CSV text.
 * - If input is a Buffer/ArrayBuffer, treat as XLSX.
 */
export function parseSurgeonFile(
  input: string | Buffer | ArrayBuffer
): ImportResult {
  if (typeof input === "string") {
    return parseCSV(input);
  }
  return parseXLSX(input);
}
