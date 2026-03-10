-- Run against Turso: turso db shell YOUR_DB_NAME < prisma/turso-init.sql

-- CreateTable
CREATE TABLE "Surgeon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "practiceName" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "suburb" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "postcode" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "experienceQualification" TEXT NOT NULL DEFAULT '',
    "yearOfCompletion" INTEGER,
    "registrationStatus" TEXT NOT NULL DEFAULT 'fracs',
    "googleRating" REAL NOT NULL DEFAULT 0,
    "googleReviewCount" INTEGER NOT NULL DEFAULT 0,
    "instagram" TEXT NOT NULL DEFAULT '',
    "tiktok" TEXT NOT NULL DEFAULT '',
    "beforeAfterLinks" TEXT NOT NULL DEFAULT '[]',
    "proceduresOffered" TEXT NOT NULL DEFAULT '[]',
    "priceRanges" TEXT NOT NULL DEFAULT '{}',
    "consultWaitTime" TEXT NOT NULL DEFAULT '',
    "consultCost" TEXT NOT NULL DEFAULT '',
    "secondConsultCost" TEXT NOT NULL DEFAULT '',
    "surgeryWaitTime" TEXT NOT NULL DEFAULT '',
    "revisionPolicy" TEXT NOT NULL DEFAULT '',
    "paymentPlansAvailable" BOOLEAN NOT NULL DEFAULT false,
    "paymentPlanDetails" TEXT NOT NULL DEFAULT '',
    "depositInfo" TEXT NOT NULL DEFAULT '',
    "beforeAfterAvailable" BOOLEAN NOT NULL DEFAULT false,
    "callExperienceNotes" TEXT NOT NULL DEFAULT '',
    "followUpNotes" TEXT NOT NULL DEFAULT '',
    "additionalInfo" TEXT NOT NULL DEFAULT '',
    "profileToken" TEXT NOT NULL,
    "lastProfileUpdate" DATETIME,
    "reminderSentAt" DATETIME,
    "acceptingPatients" BOOLEAN NOT NULL DEFAULT true,
    "internalRating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "typeformRaw" TEXT NOT NULL DEFAULT '',
    "transcript" TEXT NOT NULL DEFAULT '',
    "procedure" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "timeline" TEXT NOT NULL DEFAULT '',
    "budget" TEXT NOT NULL DEFAULT '',
    "paymentPlan" TEXT NOT NULL DEFAULT '',
    "priorities" TEXT NOT NULL DEFAULT '[]',
    "travelWillingness" TEXT NOT NULL DEFAULT '',
    "previousConsults" TEXT NOT NULL DEFAULT '',
    "additionalNotes" TEXT NOT NULL DEFAULT '',
    "source" TEXT NOT NULL DEFAULT 'admin',
    "tier" TEXT NOT NULL DEFAULT 'free',
    "paidAt" DATETIME,
    "stripeSessionId" TEXT NOT NULL DEFAULT '',
    "priceTransparency" TEXT NOT NULL DEFAULT '',
    "paymentPlanImportance" TEXT NOT NULL DEFAULT '',
    "timeSpentResearching" TEXT NOT NULL DEFAULT '',
    "consultationStatus" TEXT NOT NULL DEFAULT '',
    "confidence" TEXT NOT NULL DEFAULT '',
    "requirements" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "aiResponseRaw" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "tier" TEXT NOT NULL DEFAULT 'free',
    "pdfGeneratedAt" DATETIME,
    "pdfSentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Match_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchSurgeon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "surgeonId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "finalScore" REAL NOT NULL DEFAULT 0,
    "matchReason" TEXT NOT NULL DEFAULT '',
    "strengthsSummary" TEXT NOT NULL DEFAULT '',
    "considerationsSummary" TEXT NOT NULL DEFAULT '',
    "adminNotes" TEXT NOT NULL DEFAULT '',
    "isManualOverride" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatchSurgeon_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatchSurgeon_surgeonId_fkey" FOREIGN KEY ("surgeonId") REFERENCES "Surgeon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Surgeon_profileToken_key" ON "Surgeon"("profileToken");
