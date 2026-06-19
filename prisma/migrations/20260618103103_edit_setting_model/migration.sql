/*
  Warnings:

  - You are about to drop the column `defaultRole` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `emailNotifications` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `requireApproval` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `smsNotifications` on the `settings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "churchName" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "welcomeMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_settings" ("address", "churchName", "createdAt", "email", "id", "logoUrl", "phone", "updatedAt", "website", "welcomeMessage") SELECT "address", "churchName", "createdAt", "email", "id", "logoUrl", "phone", "updatedAt", "website", "welcomeMessage" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
