-- Rename USER -> WORKER and WORKER -> ELDER, add PASTOR.
-- RENAME VALUE only relabels the enum in the catalog: no row data is
-- rewritten, and the whole migration is transactional (all-or-nothing).
-- Order matters: free up WORKER before reusing the label.
ALTER TYPE "Role" RENAME VALUE 'WORKER' TO 'ELDER';
ALTER TYPE "Role" RENAME VALUE 'USER' TO 'WORKER';
ALTER TYPE "Role" ADD VALUE 'PASTOR';
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'WORKER';
