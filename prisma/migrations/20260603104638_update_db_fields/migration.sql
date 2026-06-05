/*
  Warnings:

  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `departmentId` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `memberSignatureUrl` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `memberSignedAt` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `pastorSignatureUrl` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `pastorSignedAt` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `recommendations` on the `Member` table. All the data in the column will be lost.
  - Added the required column `beenOnDiscipline` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Made the column `lga` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `presentAddress` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stateOfOrigin` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tribe` on table `Member` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Department_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Department";
PRAGMA foreign_keys=on;

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
    "preferredFellowshipGroup" TEXT,
    "membershipOfFellowshipGroup" TEXT,
    "fellowshipGroupId" TEXT,
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Member_fellowshipGroupId_fkey" FOREIGN KEY ("fellowshipGroupId") REFERENCES "FellowshipGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("acceptedChrist", "baptismPlace", "baptized", "baptizedBy", "communicant", "createdAt", "email", "fellowshipGroupId", "firstName", "homeCell", "id", "lga", "maritalStatus", "otherNames", "passportUrl", "phoneNumber", "preferredFellowshipGroup", "presentAddress", "previousChurchPosition", "previousPlaceOfWorship", "spouseName", "stateOfOrigin", "surname", "tribe", "updatedAt", "zone") SELECT "acceptedChrist", "baptismPlace", "baptized", "baptizedBy", "communicant", "createdAt", "email", "fellowshipGroupId", "firstName", "homeCell", "id", "lga", "maritalStatus", "otherNames", "passportUrl", "phoneNumber", "preferredFellowshipGroup", "presentAddress", "previousChurchPosition", "previousPlaceOfWorship", "spouseName", "stateOfOrigin", "surname", "tribe", "updatedAt", "zone" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
