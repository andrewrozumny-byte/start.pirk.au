/**
 * Export data from local SQLite (pirk.db) to a SQL file you can run on Turso.
 * Run with TURSO_* unset so the app uses SQLite.
 *
 *   npx tsx scripts/export-local-to-turso.ts > turso-data.sql
 *   turso db shell YOUR_DB_NAME < turso-data.sql
 *
 * Prerequisites: schema already applied on Turso (prisma/turso-init.sql).
 */

import { prisma } from "../src/lib/db";

function esc(s: string | null | undefined): string {
  if (s == null) return "NULL";
  return "'" + String(s).replace(/'/g, "''") + "'";
}
function dateEsc(d: Date | string | null | undefined): string {
  if (d == null) return "NULL";
  return esc(d instanceof Date ? d.toISOString() : String(d));
}

async function main() {
  const clients = await prisma.client.findMany();
  const surgeons = await prisma.surgeon.findMany();
  const matches = await prisma.match.findMany();
  const matchSurgeons = await prisma.matchSurgeon.findMany();

  const lines: string[] = [
    "-- Export from local pirk.db. Apply to Turso: turso db shell YOUR_DB < thisfile.sql",
  ];

  for (const r of clients) {
    lines.push(
      `INSERT OR IGNORE INTO Client(id,name,email,phone,typeformRaw,transcript,procedure,location,state,timeline,budget,paymentPlan,priorities,travelWillingness,previousConsults,additionalNotes,source,tier,paidAt,stripeSessionId,priceTransparency,paymentPlanImportance,timeSpentResearching,consultationStatus,confidence,requirements,createdAt,updatedAt) VALUES(${esc(r.id)},${esc(r.name)},${esc(r.email)},${esc(r.phone)},${esc(r.typeformRaw)},${esc(r.transcript)},${esc(r.procedure)},${esc(r.location)},${esc(r.state)},${esc(r.timeline)},${esc(r.budget)},${esc(r.paymentPlan)},${esc(r.priorities)},${esc(r.travelWillingness)},${esc(r.previousConsults)},${esc(r.additionalNotes)},${esc(r.source)},${esc(r.tier)},${dateEsc(r.paidAt)},${esc(r.stripeSessionId)},${esc(r.priceTransparency)},${esc(r.paymentPlanImportance)},${esc(r.timeSpentResearching)},${esc(r.consultationStatus)},${esc(r.confidence)},${esc(r.requirements)},${dateEsc(r.createdAt)},${dateEsc(r.updatedAt)});`
    );
  }
  for (const r of surgeons) {
    lines.push(
      `INSERT OR IGNORE INTO Surgeon(id,name,practiceName,address,suburb,state,postcode,phone,website,experienceQualification,yearOfCompletion,registrationStatus,googleRating,googleReviewCount,instagram,tiktok,beforeAfterLinks,proceduresOffered,priceRanges,consultWaitTime,consultCost,secondConsultCost,surgeryWaitTime,revisionPolicy,paymentPlansAvailable,paymentPlanDetails,depositInfo,beforeAfterAvailable,callExperienceNotes,followUpNotes,additionalInfo,profileToken,lastProfileUpdate,reminderSentAt,acceptingPatients,internalRating,createdAt,updatedAt) VALUES(${esc(r.id)},${esc(r.name)},${esc(r.practiceName)},${esc(r.address)},${esc(r.suburb)},${esc(r.state)},${esc(r.postcode)},${esc(r.phone)},${esc(r.website)},${esc(r.experienceQualification)},${r.yearOfCompletion == null ? "NULL" : r.yearOfCompletion},${esc(r.registrationStatus)},${r.googleRating},${r.googleReviewCount},${esc(r.instagram)},${esc(r.tiktok)},${esc(r.beforeAfterLinks)},${esc(r.proceduresOffered)},${esc(r.priceRanges)},${esc(r.consultWaitTime)},${esc(r.consultCost)},${esc(r.secondConsultCost)},${esc(r.surgeryWaitTime)},${esc(r.revisionPolicy)},${r.paymentPlansAvailable ? 1 : 0},${esc(r.paymentPlanDetails)},${esc(r.depositInfo)},${r.beforeAfterAvailable ? 1 : 0},${esc(r.callExperienceNotes)},${esc(r.followUpNotes)},${esc(r.additionalInfo)},${esc(r.profileToken)},${dateEsc(r.lastProfileUpdate)},${dateEsc(r.reminderSentAt)},${r.acceptingPatients ? 1 : 0},${r.internalRating == null ? "NULL" : r.internalRating},${dateEsc(r.createdAt)},${dateEsc(r.updatedAt)});`
    );
  }
  for (const r of matches) {
    lines.push(
      `INSERT OR IGNORE INTO Match(id,clientId,aiResponseRaw,status,tier,pdfGeneratedAt,pdfSentAt,createdAt,updatedAt) VALUES(${esc(r.id)},${esc(r.clientId)},${esc(r.aiResponseRaw)},${esc(r.status)},${esc(r.tier)},${dateEsc(r.pdfGeneratedAt)},${dateEsc(r.pdfSentAt)},${dateEsc(r.createdAt)},${dateEsc(r.updatedAt)});`
    );
  }
  for (const r of matchSurgeons) {
    lines.push(
      `INSERT OR IGNORE INTO MatchSurgeon(id,matchId,surgeonId,rank,finalScore,matchReason,strengthsSummary,considerationsSummary,adminNotes,isManualOverride,createdAt) VALUES(${esc(r.id)},${esc(r.matchId)},${esc(r.surgeonId)},${r.rank},${r.finalScore},${esc(r.matchReason)},${esc(r.strengthsSummary)},${esc(r.considerationsSummary)},${esc(r.adminNotes)},${r.isManualOverride ? 1 : 0},${dateEsc(r.createdAt)});`
    );
  }

  console.log(lines.join("\n"));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
