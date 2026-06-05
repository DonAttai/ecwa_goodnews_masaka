/*
  Warnings:

  - You are about to drop the column `fellowshipGroupId` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `membershipOfFellowshipGroup` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `preferredFellowshipGroup` on the `Member` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "member_fellowships" (
    "memberId" TEXT NOT NULL,
    "fellowshipId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT,

    PRIMARY KEY ("memberId", "fellowshipId"),
    CONSTRAINT "member_fellowships_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "member_fellowships_fellowshipId_fkey" FOREIGN KEY ("fellowshipId") REFERENCES "FellowshipGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passportUrl" TEXT,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "otherNames" TEXT,
    "presentAddress" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "maritalStatus" TEXT,
    "spouseName" TEXT,
    "stateOfOrigin" TEXT NOT NULL,
    "lga" TEXT NOT NULL,
    "tribe" TEXT NOT NULL,
    "previousPlaceOfWorship" TEXT,
    "homeCell" TEXT,
    "zone" TEXT,
    "acceptedChrist" TEXT NOT NULL,
    "baptized" TEXT NOT NULL,
    "baptismPlace" TEXT,
    "baptizedBy" TEXT,
    "communicant" TEXT NOT NULL,
    "beenOnDiscipline" TEXT NOT NULL,
    "disciplineReason" TEXT,
    "disciplineDate" TEXT,
    "disciplineReliefDate" TEXT,
    "previousChurchPosition" TEXT,
    "suggestions" TEXT,
    "memberSignature" TEXT,
    "memberSignedDate" TEXT,
    "pastorSignature" TEXT,
    "pastorSignedDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Member" ("acceptedChrist", "baptismPlace", "baptized", "baptizedBy", "beenOnDiscipline", "communicant", "createdAt", "disciplineDate", "disciplineReason", "disciplineReliefDate", "email", "firstName", "homeCell", "id", "lga", "maritalStatus", "memberSignature", "memberSignedDate", "otherNames", "passportUrl", "pastorSignature", "pastorSignedDate", "phoneNumber", "presentAddress", "previousChurchPosition", "previousPlaceOfWorship", "spouseName", "stateOfOrigin", "suggestions", "surname", "tribe", "updatedAt", "zone") SELECT "acceptedChrist", "baptismPlace", "baptized", "baptizedBy", "beenOnDiscipline", "communicant", "createdAt", "disciplineDate", "disciplineReason", "disciplineReliefDate", "email", "firstName", "homeCell", "id", "lga", "maritalStatus", "memberSignature", "memberSignedDate", "otherNames", "passportUrl", "pastorSignature", "pastorSignedDate", "phoneNumber", "presentAddress", "previousChurchPosition", "previousPlaceOfWorship", "spouseName", "stateOfOrigin", "suggestions", "surname", "tribe", "updatedAt", "zone" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
