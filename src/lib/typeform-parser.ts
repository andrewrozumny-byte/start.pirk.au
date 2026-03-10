import Anthropic from "@anthropic-ai/sdk";

export interface ParsedTypeformData {
  name: string;
  email: string;
  phone: string;
  procedure: string;
  location: string;
  state: string;
  timeline: string;
  budget: string;
  paymentPlan: string;
  priorities: string[];
  travelWillingness: string;
  previousConsults: string;
  additionalNotes: string;
}

const SYSTEM_PROMPT = `You extract structured data from pasted Typeform questionnaire responses.
The responses are from clients seeking cosmetic surgery in Australia via Pirk.

Extract and return JSON in this exact format:
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "procedure": "...",
  "location": "...",
  "state": "...",
  "timeline": "...",
  "budget": "...",
  "paymentPlan": "...",
  "priorities": ["..."],
  "travelWillingness": "...",
  "previousConsults": "...",
  "additionalNotes": "..."
}

Rules:
- procedure: normalise to slug format like "breast-augmentation", "breast-lift", "breast-reduction", "rhinoplasty", "abdominoplasty", "liposuction", "facelift", etc.
- state: Australian state abbreviation (VIC, NSW, QLD, SA, WA, TAS, NT, ACT). Infer from city name if not stated.
- timeline: normalise to "ready-now", "3-6-months", "6-12-months", "12-plus-months", "not-sure"
- paymentPlan: normalise to "yes-interested", "maybe", "no-upfront", "not-sure"
- travelWillingness: normalise to "local-only", "prefer-local", "within-state", "interstate", "flexible"
- priorities: array of key concerns like "reviews", "experience", "price", "location", "availability", "bedside-manner", "medicare-guidance"
- previousConsults: "none", "one", "multiple"
- If a field cannot be determined, use empty string or "not-sure"

Return ONLY valid JSON, no markdown fences or explanation.`;

export async function parseTypeformWithAI(
  rawText: string
): Promise<ParsedTypeformData> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Fallback: simple regex-based parsing when no API key
    return parseTypeformManual(rawText);
  }

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: rawText }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return JSON.parse(text) as ParsedTypeformData;
  } catch (err) {
    console.error("AI parsing failed, using manual fallback:", err);
    return parseTypeformManual(rawText);
  }
}

// Known question patterns used to split glued text
const QUESTION_PATTERNS = [
  "first, what's your first name",
  "what's your first name",
  "what procedure are you exploring",
  "when would you realistically like this done",
  "have you spoken to any surgeons yet",
  "where are you based",
  "would you be open to travelling for surgery",
  "do you have a rough idea of what this procedure costs",
  "would a payment plan make this easier",
  "what level of investment feels realistic",
  "what matters most to you when choosing a surgeon",
  "how would you like us to support you",
  "where should we send your personalised summary",
  "what's the best number to reach you on",
];

// Split text that may have answers glued to the next question (no newlines)
function splitTypeformText(rawText: string): { question: string; answer: string }[] {
  // First, try splitting by newlines
  let text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Insert newlines before known question patterns (handles glued text)
  for (const pattern of QUESTION_PATTERNS) {
    const regex = new RegExp(`(?<!^)(?=${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    text = text.replace(regex, "\n");
  }

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const pairs: { question: string; answer: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isQuestion = QUESTION_PATTERNS.some((p) => line.toLowerCase().includes(p)) || line.endsWith("?");
    if (isQuestion) {
      const answer = lines[i + 1] && !lines[i + 1].endsWith("?") ? lines[i + 1] : "";
      pairs.push({ question: line, answer });
      if (answer) i++; // skip the answer line
    }
  }

  return pairs;
}

// Fallback parser when no API key is available
function parseTypeformManual(rawText: string): ParsedTypeformData {
  const data: ParsedTypeformData = {
    name: "",
    email: "",
    phone: "",
    procedure: "",
    location: "",
    state: "",
    timeline: "",
    budget: "",
    paymentPlan: "",
    priorities: [],
    travelWillingness: "",
    previousConsults: "",
    additionalNotes: "",
  };

  const pairs = splitTypeformText(rawText);

  for (const { question, answer } of pairs) {
    const q = question.toLowerCase();

    if (q.includes("first name") || q.includes("your name"))
      data.name = answer;
    if (q.includes("send your") || q.includes("personalised summary"))
      data.email = answer;
    if (q.includes("best number") || q.includes("reach you"))
      data.phone = answer;
    if (q.includes("exploring") || (q.includes("procedure") && !q.includes("costs")))
      data.procedure = normaliseProcedure(answer);
    if (q.includes("rough idea") || q.includes("procedure costs"))
      data.budget = data.budget || answer;
    if (q.includes("where are you based"))
      data.location = answer;
    if (q.includes("when would you") || q.includes("realistically"))
      data.timeline = normaliseTimeline(answer);
    if (q.includes("payment plan"))
      data.paymentPlan = normalisePaymentPlan(answer);
    if (q.includes("investment") || q.includes("budget"))
      data.budget = answer;
    if (q.includes("matters most"))
      data.priorities = answer.split(/[,&]/).map((s) => s.trim().toLowerCase());
    if (q.includes("travelling") || q.includes("travel"))
      data.travelWillingness = normaliseTravel(answer);
    if (q.includes("spoken to any surgeons"))
      data.previousConsults = normaliseConsults(answer);
    if (q.includes("how would you like us"))
      data.additionalNotes = answer;
  }

  // Infer state from location
  if (data.location && !data.state) {
    data.state = inferState(data.location);
  }

  return data;
}

function normaliseProcedure(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("augmentation")) return "breast-augmentation";
  if (t.includes("reduction")) return "breast-reduction";
  if (t.includes("lift") && t.includes("breast")) return "breast-lift";
  if (t.includes("rhinoplast") || t.includes("nose")) return "rhinoplasty";
  if (t.includes("tummy") || t.includes("abdomino")) return "abdominoplasty";
  if (t.includes("liposuction")) return "liposuction";
  if (t.includes("facelift") || t.includes("face lift")) return "facelift";
  if (t.includes("blephar") || t.includes("eyelid")) return "blepharoplasty";
  return t.replace(/\s+/g, "-");
}

function normaliseTimeline(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("ready") || t.includes("asap") || t.includes("soon"))
    return "ready-now";
  if (t.includes("3") || t.includes("few months")) return "3-6-months";
  if (t.includes("6") || t.includes("half")) return "6-12-months";
  if (t.includes("12") || t.includes("year")) return "12-plus-months";
  return "not-sure";
}

function normalisePaymentPlan(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("yes") || t.includes("interested")) return "yes-interested";
  if (t.includes("maybe")) return "maybe";
  if (t.includes("no") || t.includes("upfront")) return "no-upfront";
  return "not-sure";
}

function normaliseTravel(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("local") || t.includes("prefer to stay"))
    return "prefer-local";
  if (t.includes("within") && t.includes("state")) return "within-state";
  if (t.includes("interstate") || t.includes("anywhere")) return "interstate";
  if (t.includes("flexible") || t.includes("open") || t.includes("yes"))
    return "flexible";
  return "prefer-local";
}

function normaliseConsults(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("no") || t.includes("first step")) return "none";
  if (t.includes("one") || t.includes("1")) return "one";
  if (t.includes("multiple") || t.includes("several")) return "multiple";
  return "none";
}

function inferState(location: string): string {
  const t = location.toLowerCase();
  if (t.includes("melbourne") || t.includes("victoria") || t.includes("vic"))
    return "VIC";
  if (t.includes("sydney") || t.includes("new south wales") || t.includes("nsw"))
    return "NSW";
  if (t.includes("brisbane") || t.includes("queensland") || t.includes("qld"))
    return "QLD";
  if (t.includes("adelaide") || t.includes("south australia"))
    return "SA";
  if (t.includes("perth") || t.includes("western australia"))
    return "WA";
  if (t.includes("hobart") || t.includes("tasmania"))
    return "TAS";
  if (t.includes("darwin")) return "NT";
  if (t.includes("canberra")) return "ACT";
  return "";
}
