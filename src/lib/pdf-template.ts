import fs from "fs";
import path from "path";

export interface PdfSurgeon {
  rank: number;
  name: string;
  practiceName: string;
  address: string;
  suburb: string;
  state: string;
  googleRating: number;
  googleReviewCount: number;
  website: string;
  instagram: string;
  yearOfCompletion: number | null;
  experienceQualification: string;
  consultWaitTime: string;
  consultCost: string;
  secondConsultCost: string;
  surgeryWaitTime: string;
  revisionPolicy: string;
  paymentPlansAvailable: boolean;
  paymentPlanDetails: string;
  depositInfo: string;
  beforeAfterAvailable: boolean;
  procedurePrice: string;
  matchReason: string;
  strengths: string[];
}

export interface PdfData {
  client: {
    name: string;
    procedure: string;
    location: string;
    state: string;
    timeline: string;
    budget: string;
    paymentPlan: string;
    travelWillingness: string;
    priorities: string[];
  };
  surgeons: PdfSurgeon[];
  generatedDate: string;
  matchId?: string;
}

function getLogoBase64(): string {
  const logoPath = path.join(process.cwd(), "public", "images", "pirk-logo.png");
  const logoBuffer = fs.readFileSync(logoPath);
  return `data:image/png;base64,${logoBuffer.toString("base64")}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateStars(rating: number): string {
  const fullStars = Math.round(rating);
  return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
}

function generateSurgeonCard(surgeon: PdfSurgeon, isPrimary: boolean): string {
  const cardClass = isPrimary ? "surgeon-card primary" : "surgeon-card";
  const tagClass = isPrimary ? "card-tag pick" : "card-tag extra";
  const tagText = isPrimary ? "Pirk Pick" : `#${surgeon.rank}`;

  const links: string[] = [];
  if (surgeon.website) {
    const displayUrl = surgeon.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    links.push(`<a class="card-link" href="${escapeHtml(surgeon.website)}" target="_blank">&#127760; Website</a>`);
  }
  if (surgeon.instagram) {
    const instaUrl = surgeon.instagram.startsWith("http")
      ? surgeon.instagram
      : `https://www.instagram.com/${surgeon.instagram.replace("@", "")}/`;
    const instaHandle = surgeon.instagram.startsWith("@")
      ? surgeon.instagram
      : `@${surgeon.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}`;
    links.push(`<a class="card-link" href="${escapeHtml(instaUrl)}" target="_blank">&#128247; Instagram</a>`);
  }
  if (surgeon.beforeAfterAvailable) {
    links.push(`<a class="card-link" href="#" target="_blank">&#128248; B&amp;A Available</a>`);
  }

  const infoRows: string[] = [];

  // Match reason / notable
  if (surgeon.matchReason) {
    infoRows.push(`
        <div class="info-row">
          <div class="info-icon">&#127942;</div>
          <div class="info-content">
            <div class="info-label">Why We Matched You</div>
            <div class="info-value">${escapeHtml(surgeon.matchReason)}</div>
          </div>
        </div>`);
  }

  // Qualification
  if (surgeon.experienceQualification) {
    const yearStr = surgeon.yearOfCompletion ? ` (${surgeon.yearOfCompletion})` : "";
    infoRows.push(`
        <div class="info-row">
          <div class="info-icon">&#127891;</div>
          <div class="info-content">
            <div class="info-label">Qualification</div>
            <div class="info-value">${escapeHtml(surgeon.experienceQualification)}${yearStr}</div>
            <div class="tag tag-coral">FRACS Certified</div>
          </div>
        </div>`);
  }

  // Procedure price
  if (surgeon.procedurePrice) {
    infoRows.push(`
        <div class="info-row">
          <div class="info-icon">&#128176;</div>
          <div class="info-content">
            <div class="info-label">Procedure Price</div>
            <div class="info-value price">${escapeHtml(surgeon.procedurePrice)}</div>
          </div>
        </div>`);
  } else {
    infoRows.push(`
        <div class="info-row">
          <div class="info-icon">&#128176;</div>
          <div class="info-content">
            <div class="info-label">Procedure Price</div>
            <div class="info-value unknown">Pricing not yet confirmed &mdash; call to verify</div>
          </div>
        </div>`);
  }

  // Consult details
  const consultParts: string[] = [];
  if (surgeon.consultCost) consultParts.push(surgeon.consultCost);
  if (surgeon.secondConsultCost) consultParts.push(`2nd consult: ${surgeon.secondConsultCost}`);
  if (surgeon.consultWaitTime) consultParts.push(`Wait: ${surgeon.consultWaitTime}`);
  if (consultParts.length > 0) {
    infoRows.push(`
        <div class="info-row">
          <div class="info-icon">&#128203;</div>
          <div class="info-content">
            <div class="info-label">Consult Details</div>
            <div class="info-value">${escapeHtml(consultParts.join(" · "))}</div>
          </div>
        </div>`);
  }

  // Location
  const locationParts = [surgeon.address, surgeon.suburb, surgeon.state].filter(Boolean);
  if (locationParts.length > 0) {
    infoRows.push(`
        <div class="info-row">
          <div class="info-icon">&#128205;</div>
          <div class="info-content">
            <div class="info-label">Location</div>
            <div class="info-value">${escapeHtml(locationParts.join(", "))}</div>
          </div>
        </div>`);
  }

  // Surgery wait
  if (surgeon.surgeryWaitTime) {
    infoRows.push(`
        <div class="info-row">
          <div class="info-icon">&#9200;</div>
          <div class="info-content">
            <div class="info-label">Surgery Wait Time</div>
            <div class="info-value">${escapeHtml(surgeon.surgeryWaitTime)}</div>
          </div>
        </div>`);
  }

  // Deposit info
  if (surgeon.depositInfo) {
    const paymentInfo = surgeon.paymentPlansAvailable && surgeon.paymentPlanDetails
      ? ` · ${surgeon.paymentPlanDetails}`
      : "";
    infoRows.push(`
        <div class="info-row">
          <div class="info-icon">&#128179;</div>
          <div class="info-content">
            <div class="info-label">Deposit &amp; Payment</div>
            <div class="info-value">${escapeHtml(surgeon.depositInfo + paymentInfo)}</div>
          </div>
        </div>`);
  }

  // Revision policy
  if (surgeon.revisionPolicy) {
    infoRows.push(`
        <div class="info-row">
          <div class="info-icon">&#128260;</div>
          <div class="info-content">
            <div class="info-label">Revision Policy</div>
            <div class="info-value">${escapeHtml(surgeon.revisionPolicy)}</div>
          </div>
        </div>`);
  }

  // Before & After
  infoRows.push(`
        <div class="info-row">
          <div class="info-icon">&#128248;</div>
          <div class="info-content">
            <div class="info-label">Before &amp; After Photos</div>
            <div class="info-value">${surgeon.beforeAfterAvailable ? "Available" : '<span class="unknown">Not confirmed</span>'}</div>
          </div>
        </div>`);

  return `
    <div class="${cardClass}">
      <div class="card-header">
        <div class="${tagClass}">${tagText}</div>
        <div class="surgeon-name">${escapeHtml(surgeon.name)}</div>
        <div class="surgeon-practice">${escapeHtml(surgeon.practiceName)}${surgeon.suburb ? ` &middot; ${escapeHtml(surgeon.suburb)}` : ""}</div>
        <div class="stars-row">
          <span class="stars">${generateStars(surgeon.googleRating)}</span>
          <span class="rating">${surgeon.googleRating.toFixed(1)}</span>
          <span class="review-count">${surgeon.googleReviewCount > 0 ? `(${surgeon.googleReviewCount} reviews)` : ""}</span>
        </div>
      </div>
      ${links.length > 0 ? `<div class="card-links">${links.join("\n        ")}</div>` : ""}
      <div class="card-body">
        ${infoRows.join("")}
      </div>
    </div>`;
}

function generateComparisonTable(surgeons: PdfSurgeon[]): string {
  if (surgeons.length === 0) return "";

  const headers = surgeons
    .map((s, i) => `<th${i === 0 ? ' class="col-p"' : ""}>${escapeHtml(s.name)}</th>`)
    .join("\n          ");

  function row(label: string, values: string[]): string {
    return `
        <tr>
          <td>${label}</td>
          ${values.map((v, i) => `<td${i === 0 ? ' class="col-p"' : ""}>${v}</td>`).join("\n          ")}
        </tr>`;
  }

  const rows: string[] = [];

  // Rating
  rows.push(
    row(
      "Rating",
      surgeons.map(
        (s) =>
          `&#11088; ${s.googleRating.toFixed(1)}${s.googleReviewCount > 0 ? ` &middot; ${s.googleReviewCount} reviews` : ""}`
      )
    )
  );

  // Qualification
  rows.push(
    row(
      "Qualification",
      surgeons.map((s) =>
        s.experienceQualification
          ? `<span class="tag tag-coral">${escapeHtml(s.experienceQualification)}</span>`
          : '<span class="dash">Not confirmed</span>'
      )
    )
  );

  // Procedure Price
  rows.push(
    row(
      "Procedure Price",
      surgeons.map((s) =>
        s.procedurePrice
          ? `<span class="price-good">${escapeHtml(s.procedurePrice)}</span>`
          : '<span class="price-unknown">Not yet confirmed</span>'
      )
    )
  );

  // Consult Fee
  rows.push(
    row(
      "Consult Fee",
      surgeons.map((s) =>
        s.consultCost ? escapeHtml(s.consultCost) : '<span class="dash">Not confirmed</span>'
      )
    )
  );

  // 2nd Consult
  rows.push(
    row(
      "2nd Consult",
      surgeons.map((s) =>
        s.secondConsultCost
          ? escapeHtml(s.secondConsultCost)
          : '<span class="dash">Not confirmed</span>'
      )
    )
  );

  // Consult Wait
  rows.push(
    row(
      "Consult Wait",
      surgeons.map((s) =>
        s.consultWaitTime
          ? escapeHtml(s.consultWaitTime)
          : '<span class="dash">Not confirmed</span>'
      )
    )
  );

  // Surgery Wait
  rows.push(
    row(
      "Surgery Wait",
      surgeons.map((s) =>
        s.surgeryWaitTime
          ? escapeHtml(s.surgeryWaitTime)
          : '<span class="dash">Not confirmed</span>'
      )
    )
  );

  // Deposit
  rows.push(
    row(
      "Deposit",
      surgeons.map((s) =>
        s.depositInfo ? escapeHtml(s.depositInfo) : '<span class="dash">Not confirmed</span>'
      )
    )
  );

  // Payment Plans
  rows.push(
    row(
      "Payment Plans",
      surgeons.map((s) =>
        s.paymentPlansAvailable
          ? `<span class="tick">${escapeHtml(s.paymentPlanDetails || "Available")}</span>`
          : '<span class="cross">None</span>'
      )
    )
  );

  // Revision Policy
  rows.push(
    row(
      "Revisions",
      surgeons.map((s) =>
        s.revisionPolicy
          ? escapeHtml(s.revisionPolicy)
          : '<span class="dash">Not confirmed</span>'
      )
    )
  );

  // B&A Gallery
  rows.push(
    row(
      "B&amp;A Gallery",
      surgeons.map((s) =>
        s.beforeAfterAvailable
          ? '<span class="tick">&#10003; Available</span>'
          : '<span class="dash">Not confirmed</span>'
      )
    )
  );

  // Website
  rows.push(
    row(
      "Website",
      surgeons.map((s) => {
        if (!s.website) return '<span class="dash">N/A</span>';
        const displayUrl = s.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
        return `<a href="${escapeHtml(s.website)}" target="_blank" style="color:var(--coral);font-size:11px;">${escapeHtml(displayUrl)}</a>`;
      })
    )
  );

  // Instagram
  rows.push(
    row(
      "Instagram",
      surgeons.map((s) => {
        if (!s.instagram) return '<span class="dash">N/A</span>';
        const instaUrl = s.instagram.startsWith("http")
          ? s.instagram
          : `https://www.instagram.com/${s.instagram.replace("@", "")}/`;
        const handle = s.instagram.startsWith("@")
          ? s.instagram
          : `@${s.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}`;
        return `<a href="${escapeHtml(instaUrl)}" target="_blank" style="color:var(--coral);font-size:11px;">${escapeHtml(handle)}</a>`;
      })
    )
  );

  return `
  <div class="section-label">At a Glance Comparison</div>
  <div class="table-wrap">
    <table class="comp-table">
      <thead>
        <tr>
          <th></th>
          ${headers}
        </tr>
      </thead>
      <tbody>
        ${rows.join("")}
      </tbody>
    </table>
  </div>`;
}

export function generateComparisonHTML(data: PdfData): string {
  const logoDataUri = getLogoBase64();
  const { client, surgeons, generatedDate } = data;

  const prioritiesStr = client.priorities.length > 0 ? client.priorities.join(", ") : "Not specified";

  const briefItems = [
    { label: "Procedure", value: client.procedure },
    { label: "Location", value: `${client.location}, ${client.state}` },
    { label: "Timeline", value: client.timeline || "Not specified" },
    { label: "Budget", value: client.budget || "Not specified" },
    { label: "Payment Plan", value: client.paymentPlan || "Not specified" },
    { label: "Travel", value: client.travelWillingness || "Not specified" },
    { label: "Priorities", value: prioritiesStr },
  ];

  const surgeonCards = surgeons
    .map((s, i) => generateSurgeonCard(s, i === 0))
    .join("\n");

  const comparisonTable = generateComparisonTable(surgeons);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Surgeon Comparison &mdash; ${escapeHtml(client.name)} | Pirk</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --white: #FFFFFF;
    --cream: #F9F5F2;
    --coral: #F2705C;
    --burgundy: #4D0121;
    --warm-grey: #66645E;
    --near-black: #282726;
    --coral-light: #fdf0ee;
    --coral-mid: #f4c4bb;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--cream); font-family:'Outfit',sans-serif; color:var(--near-black); font-size:14px; line-height:1.6; }

  /* HEADER */
  .header { background:var(--burgundy); padding:40px 48px 36px; display:flex; flex-direction:column; gap:20px; }
  .logo img { height:34px; filter:brightness(0) invert(1); opacity:.9; }
  .header-divider { width:100%; height:1px; background:rgba(255,255,255,.12); }
  .header-eyebrow { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--coral); font-weight:600; margin-bottom:8px; }
  .header h1 { font-size:clamp(24px,4vw,38px); font-weight:300; color:var(--white); letter-spacing:-1px; line-height:1.1; }
  .header h1 strong { font-weight:600; color:var(--coral); }
  .header-meta { margin-top:10px; font-size:13px; color:rgba(255,255,255,.45); font-weight:300; }

  /* AHPRA BAR */
  .ahpra-bar { background:var(--near-black); padding:14px 48px; display:flex; gap:12px; align-items:flex-start; }
  .ahpra-icon { color:var(--coral); font-size:15px; flex-shrink:0; margin-top:2px; }
  .ahpra-text { font-size:12px; color:rgba(255,255,255,.6); line-height:1.6; }
  .ahpra-text strong { color:rgba(255,255,255,.9); }
  .ahpra-text a { color:var(--coral); text-decoration:underline; }

  /* MAIN */
  .main { max-width:1020px; margin:0 auto; padding:40px 24px 60px; }

  /* BRIEF */
  .brief-card { background:var(--white); border-radius:12px; border:1px solid var(--coral-mid); padding:26px 30px; margin-bottom:44px; }
  .brief-title { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--coral); font-weight:600; margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid #f0ddd9; }
  .brief-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(155px,1fr)); gap:16px; }
  .brief-item label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--warm-grey); font-weight:500; display:block; margin-bottom:3px; }
  .brief-item span { font-size:14px; font-weight:500; }

  /* SECTION LABEL */
  .section-label { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--warm-grey); font-weight:600; margin-bottom:18px; display:flex; align-items:center; gap:14px; }
  .section-label::after { content:''; flex:1; height:1px; background:var(--coral-mid); }

  /* CARDS */
  .cards-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px; margin-bottom:44px; }
  .surgeon-card { background:var(--white); border-radius:12px; border:1px solid #e5d8d4; overflow:hidden; display:flex; flex-direction:column; }
  .surgeon-card.primary { border-color:var(--coral); border-width:1.5px; }

  .card-header { background:var(--burgundy); padding:20px 22px 16px; position:relative; }
  .surgeon-card.primary .card-header { background:linear-gradient(135deg,#5c0128,#7a0232); }
  .card-tag { position:absolute; top:13px; right:13px; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; padding:3px 9px; border-radius:100px; font-weight:600; }
  .card-tag.pick { background:var(--coral); color:white; }
  .card-tag.extra { background:rgba(255,255,255,.15); color:rgba(255,255,255,.8); }

  .surgeon-name { font-size:17px; font-weight:600; color:var(--white); margin-bottom:2px; letter-spacing:-.3px; padding-right:90px; }
  .surgeon-practice { font-size:11px; color:rgba(255,255,255,.45); font-weight:300; margin-bottom:12px; }
  .stars-row { display:flex; align-items:center; gap:6px; }
  .stars { color:#f5c842; font-size:11px; letter-spacing:1px; }
  .rating { font-size:13px; font-weight:600; color:white; }
  .review-count { font-size:11px; color:rgba(255,255,255,.4); }

  .card-links { background:var(--coral-light); padding:9px 22px; display:flex; gap:14px; flex-wrap:wrap; border-bottom:1px solid #f0ddd9; }
  .card-link { font-size:11px; font-weight:600; color:var(--coral); text-decoration:none; display:flex; align-items:center; gap:4px; }

  .card-body { padding:16px 22px 20px; flex:1; display:flex; flex-direction:column; }
  .info-row { display:flex; align-items:flex-start; padding:9px 0; border-bottom:1px solid #f2ebe8; gap:11px; }
  .info-row:last-child { border-bottom:none; }
  .info-icon { width:25px; height:25px; background:var(--coral-light); border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0; margin-top:1px; }
  .info-content { flex:1; }
  .info-label { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--warm-grey); font-weight:600; margin-bottom:2px; }
  .info-value { font-size:13px; color:var(--near-black); line-height:1.45; }
  .info-value.price { font-size:15px; font-weight:700; color:var(--burgundy); }
  .info-value.unknown { font-size:13px; color:var(--warm-grey); font-style:italic; }

  .tag { display:inline-block; font-size:10px; padding:2px 8px; border-radius:100px; font-weight:600; margin-top:3px; }
  .tag-coral { background:var(--coral-light); color:var(--coral); }
  .tag-green { background:#edf7f0; color:#2d7a50; }
  .tag-amber { background:#fff5e0; color:#8a6030; }
  .tag-grey { background:#f0ecea; color:var(--warm-grey); }
  .tag-yellow { background:rgba(255,200,50,.15); color:#8a6a00; }

  /* TABLE */
  .table-wrap { overflow-x:auto; margin-bottom:44px; border-radius:12px; border:1px solid #e5d8d4; }
  .comp-table { width:100%; border-collapse:collapse; background:var(--white); font-size:12.5px; }
  .comp-table thead tr { background:var(--burgundy); }
  .comp-table thead th { padding:13px 14px; color:white; font-weight:500; text-align:left; font-size:11px; }
  .comp-table thead th:first-child { color:rgba(255,255,255,.4); font-size:9px; letter-spacing:2px; text-transform:uppercase; width:120px; font-weight:400; }
  .comp-table thead th.col-p { background:rgba(242,112,92,.22); color:#f9c4bb; }
  .comp-table tbody tr:nth-child(even) { background:var(--cream); }
  .comp-table td { padding:10px 14px; border-bottom:1px solid #f0ebe8; vertical-align:top; color:var(--near-black); line-height:1.4; }
  .comp-table td:first-child { font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:var(--warm-grey); font-weight:600; background:var(--cream) !important; border-right:1px solid #e5d8d4; white-space:nowrap; }
  .comp-table td.col-p { background:rgba(242,112,92,.04) !important; border-left:2px solid var(--coral); border-right:2px solid var(--coral); }
  .tick { color:#2d7a50; font-weight:700; }
  .cross { color:#c04444; }
  .dash { color:#b5b0aa; font-style:italic; font-size:11px; }
  .price-good { color:#2d7a50; font-weight:600; }
  .price-warn { color:#8a6030; font-weight:600; }
  .price-unknown { color:var(--warm-grey); font-style:italic; font-size:11px; }

  /* DISCLAIMER */
  .disclaimer-box { background:var(--white); border:1px solid var(--coral-mid); border-left:4px solid var(--coral); border-radius:10px; padding:22px 26px; margin-bottom:32px; }
  .disc-title { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:var(--coral); font-weight:600; margin-bottom:12px; }
  .disclaimer-box p { font-size:12.5px; color:var(--warm-grey); line-height:1.7; margin-bottom:8px; }
  .disclaimer-box p:last-child { margin-bottom:0; }
  .disclaimer-box strong { color:var(--near-black); }
  .disclaimer-box a { color:var(--coral); text-decoration:underline; text-underline-offset:2px; }

  /* NEXT STEPS CTA */
  .next-steps { background:var(--white); border:1px solid var(--coral-mid); border-radius:12px; padding:28px 30px; margin-bottom:32px; }
  .next-steps-title { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--coral); font-weight:600; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #f0ddd9; }
  .next-steps ol { padding-left:20px; margin-bottom:0; }
  .next-steps li { font-size:13px; color:var(--near-black); line-height:1.7; margin-bottom:6px; }
  .next-steps li strong { color:var(--burgundy); }

  /* UPGRADE CTA */
  .upgrade-section { background:linear-gradient(135deg,var(--burgundy),#6a0230); border-radius:14px; padding:36px 34px; margin-bottom:32px; position:relative; overflow:hidden; }
  .upgrade-section::before { content:''; position:absolute; top:-40px; right:-40px; width:180px; height:180px; background:radial-gradient(circle,rgba(242,112,92,.25),transparent 70%); border-radius:50%; }
  .upgrade-section::after { content:''; position:absolute; bottom:-30px; left:-30px; width:120px; height:120px; background:radial-gradient(circle,rgba(242,112,92,.15),transparent 70%); border-radius:50%; }
  .upgrade-eyebrow { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--coral); font-weight:600; margin-bottom:10px; position:relative; z-index:1; }
  .upgrade-headline { font-size:24px; font-weight:600; color:var(--white); line-height:1.25; margin-bottom:6px; letter-spacing:-0.5px; position:relative; z-index:1; }
  .upgrade-headline em { font-style:normal; color:var(--coral); }
  .upgrade-sub { font-size:14px; color:rgba(255,255,255,.65); line-height:1.6; margin-bottom:22px; position:relative; z-index:1; }
  .upgrade-features { display:grid; grid-template-columns:1fr 1fr; gap:10px 20px; margin-bottom:26px; position:relative; z-index:1; }
  .upgrade-feature { display:flex; align-items:flex-start; gap:8px; font-size:12.5px; color:rgba(255,255,255,.85); line-height:1.5; }
  .upgrade-feature-icon { color:var(--coral); font-size:14px; flex-shrink:0; margin-top:1px; }
  .upgrade-cta-row { display:flex; align-items:center; gap:16px; position:relative; z-index:1; }
  .upgrade-btn { display:inline-block; background:var(--coral); color:white; font-size:14px; font-weight:600; padding:13px 34px; border-radius:100px; text-decoration:none; letter-spacing:0.3px; transition:background .2s; }
  .upgrade-btn:hover { background:#e05d49; }
  .upgrade-note { font-size:11px; color:rgba(255,255,255,.4); }

  /* FOOTER */
  .footer { border-top:1px solid #e2d9d5; padding:26px 48px; background:var(--white); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
  .footer img { height:20px; opacity:.65; }
  .footer-right { font-size:11px; color:var(--warm-grey); }
  .footer-right a { color:var(--coral); text-decoration:none; font-weight:500; }

  @media(max-width:640px){
    .header,.ahpra-bar,.footer{padding-left:20px;padding-right:20px;}
    .main{padding:28px 16px 48px;}
    .brief-card{padding:18px;}
  }
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <div class="logo"><img src="${logoDataUri}" alt="Pirk"></div>
  <div class="header-divider"></div>
  <div>
    <div class="header-eyebrow">Your Surgeon Comparison</div>
    <h1>Your personalised surgeon shortlist, <strong>${escapeHtml(client.name)}</strong></h1>
    <div class="header-meta">${escapeHtml(generatedDate)} &nbsp;&middot;&nbsp; ${escapeHtml(client.procedure)} &nbsp;&middot;&nbsp; ${escapeHtml(client.location)}, ${escapeHtml(client.state)}</div>
  </div>
</div>

<!-- AHPRA BAR -->
<div class="ahpra-bar">
  <div class="ahpra-icon">&#9432;</div>
  <div class="ahpra-text">
    <strong>Important:</strong> This is an informational comparison only. Pirk does not recommend or endorse any surgeon. The final decision is entirely yours. There are many other qualified surgeons you may also wish to consider. Please read our <a href="https://www.pirk.com.au/terms-and-conditions" target="_blank">Terms &amp; Conditions</a>.
  </div>
</div>

<div class="main">

  <!-- BRIEF -->
  <div class="brief-card">
    <div class="brief-title">Your Profile Summary</div>
    <div class="brief-grid">
      ${briefItems.map((item) => `<div class="brief-item"><label>${escapeHtml(item.label)}</label><span>${escapeHtml(item.value)}</span></div>`).join("\n      ")}
    </div>
  </div>

  <!-- SURGEON CARDS -->
  <div class="section-label">Surgeons Included in This Comparison</div>
  <div class="cards-grid">
    ${surgeonCards}
  </div>

  <!-- COMPARISON TABLE -->
  ${comparisonTable}

  <!-- NEXT STEPS -->
  <div class="next-steps">
    <div class="next-steps-title">Your Next Steps</div>
    <ol>
      <li><strong>Review this comparison</strong> &mdash; take your time reading through each surgeon's profile and the comparison table.</li>
      <li><strong>Book a consultation</strong> &mdash; contact your preferred surgeon(s) directly to arrange a consultation. A GP referral may be required.</li>
      <li><strong>Ask questions</strong> &mdash; bring a list of questions to your consultation. Don't be afraid to ask about experience, results, and revision policies.</li>
      <li><strong>Take your time</strong> &mdash; there is no rush. The best outcomes come from informed, confident decisions.</li>
    </ol>
  </div>

  <!-- UPGRADE CTA -->
  <div class="upgrade-section">
    <div class="upgrade-eyebrow">This Is Just the Beginning</div>
    <div class="upgrade-headline">Your shortlist is ready. <em>Now let us do the rest.</em></div>
    <div class="upgrade-sub">You've got the information &mdash; but navigating consultations, comparing quotes, and coordinating surgery is a journey in itself. Our Full Support Package takes over from here so you can focus on you.</div>
    <div class="upgrade-features">
      <div class="upgrade-feature"><span class="upgrade-feature-icon">&#10003;</span> We book your consultations for you</div>
      <div class="upgrade-feature"><span class="upgrade-feature-icon">&#10003;</span> Pre-appointment prep &amp; question guides</div>
      <div class="upgrade-feature"><span class="upgrade-feature-icon">&#10003;</span> Quote comparison &amp; negotiation support</div>
      <div class="upgrade-feature"><span class="upgrade-feature-icon">&#10003;</span> Post-op check-in &amp; recovery coordination</div>
      <div class="upgrade-feature"><span class="upgrade-feature-icon">&#10003;</span> Dedicated Pirk concierge throughout</div>
      <div class="upgrade-feature"><span class="upgrade-feature-icon">&#10003;</span> Ongoing guidance until you're fully recovered</div>
    </div>
    <div class="upgrade-cta-row">
      <a class="upgrade-btn" href="${escapeHtml(`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.pirk.com.au"}/upgrade/${data.matchId || ""}`)}" target="_blank">Upgrade Now &#8594;</a>
      <a class="upgrade-btn" href="https://calendly.com/pirk" target="_blank" style="background:rgba(255,255,255,.15);color:white;">Book a Chat First</a>
    </div>
    <div style="margin-top:12px;position:relative;z-index:1;"><span class="upgrade-note">One-time fee &middot; No lock-in &middot; 100% money-back guarantee</span></div>
  </div>

  <!-- DISCLAIMER -->
  <div class="disclaimer-box">
    <div class="disc-title">Important Disclaimer</div>
    <p><strong>This comparison is provided for informational purposes only.</strong> Pirk does not recommend, endorse, or refer to any specific surgeon or medical professional. The decision to consult with or select any surgeon is entirely your own.</p>
    <p>This is a simple side-by-side summary based on data researched at the time of preparation. It is not exhaustive &mdash; <strong>there are many other qualified, FRACS-certified plastic surgeons you may also wish to consider.</strong> All pricing, availability, and other details are subject to change and must be verified directly with each practice prior to booking.</p>
    <p>Pirk is not a medical service and does not provide medical advice. Before undergoing any surgical procedure, please consult with a qualified medical professional. By using this information, you agree to our <a href="https://www.pirk.com.au/terms-and-conditions" target="_blank">Terms &amp; Conditions</a>.</p>
  </div>

</div>

<!-- FOOTER -->
<div class="footer">
  <div class="logo"><img src="${logoDataUri}" alt="Pirk"></div>
  <div class="footer-right">
    Surgeon Comparison &middot; Confidential &nbsp;|&nbsp;
    <a href="https://www.pirk.com.au/terms-and-conditions" target="_blank">Terms &amp; Conditions</a>
  </div>
</div>

</body>
</html>`;
}
