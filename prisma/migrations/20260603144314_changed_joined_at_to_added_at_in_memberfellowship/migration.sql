/*
  Warnings:

  - You are about to drop the column `joinedAt` on the `member_fellowships` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_member_fellowships" (
    "memberId" TEXT NOT NULL,
    "fellowshipId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT,

    PRIMARY KEY ("memberId", "fellowshipId"),
    CONSTRAINT "member_fellowships_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "member_fellowships_fellowshipId_fkey" FOREIGN KEY ("fellowshipId") REFERENCES "FellowshipGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_member_fellowships" ("fellowshipId", "memberId", "role") SELECT "fellowshipId", "memberId", "role" FROM "member_fellowships";
DROP TABLE "member_fellowships";
ALTER TABLE "new_member_fellowships" RENAME TO "member_fellowships";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
