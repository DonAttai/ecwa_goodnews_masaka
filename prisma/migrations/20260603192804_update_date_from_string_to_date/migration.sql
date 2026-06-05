/*
  Warnings:

  - You are about to alter the column `disciplineDate` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `disciplineReliefDate` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `memberSignedDate` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `pastorSignedDate` on the `Member` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
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
    "disciplineDate" DATETIME,
    "disciplineReliefDate" DATETIME,
    "previousChurchPosition" TEXT,
    "suggestions" TEXT,
    "memberSignature" TEXT,
    "memberSignedDate" DATETIME,
    "pastorSignature" TEXT,
    "pastorSignedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Member" ("acceptedChrist", "baptismPlace", "baptized", "baptizedBy", "beenOnDiscipline", "communicant", "createdAt", "disciplineDate", "disciplineReason", "disciplineReliefDate", "email", "firstName", "homeCell", "id", "lga", "maritalStatus", "memberSignature", "memberSignedDate", "otherNames", "passportUrl", "pastorSignature", "pastorSignedDate", "phoneNumber", "presentAddress", "previousChurchPosition", "previousPlaceOfWorship", "spouseName", "stateOfOrigin", "suggestions", "surname", "tribe", "updatedAt", "zone") SELECT "acceptedChrist", "baptismPlace", "baptized", "baptizedBy", "beenOnDiscipline", "communicant", "createdAt", "disciplineDate", "disciplineReason", "disciplineReliefDate", "email", "firstName", "homeCell", "id", "lga", "maritalStatus", "memberSignature", "memberSignedDate", "otherNames", "passportUrl", "pastorSignature", "pastorSignedDate", "phoneNumber", "presentAddress", "previousChurchPosition", "previousPlaceOfWorship", "spouseName", "stateOfOrigin", "suggestions", "surname", "tribe", "updatedAt", "zone" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
