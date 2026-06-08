-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "rawDiff" TEXT NOT NULL,
    "oneLiner" TEXT NOT NULL,
    "detailedSummary" TEXT NOT NULL,
    "businessImpact" TEXT,
    "riskScore" INTEGER NOT NULL,
    "riskReasoning" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "founderView" TEXT,
    "pmView" TEXT,
    "qaView" TEXT,
    "devView" TEXT,
    "changelog" TEXT,
    "commitTitle" TEXT,
    "testCases" TEXT NOT NULL DEFAULT '[]',
    "affectedAreas" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
