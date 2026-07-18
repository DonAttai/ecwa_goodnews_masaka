/*
  Warnings:

  - The values [RELEASED] on the enum `RequisitionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequisitionStatus_new" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'PAID', 'COMPLETED');
ALTER TABLE "public"."Requisition" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Requisition" ALTER COLUMN "status" TYPE "RequisitionStatus_new" USING ("status"::text::"RequisitionStatus_new");
ALTER TYPE "RequisitionStatus" RENAME TO "RequisitionStatus_old";
ALTER TYPE "RequisitionStatus_new" RENAME TO "RequisitionStatus";
DROP TYPE "public"."RequisitionStatus_old";
ALTER TABLE "Requisition" ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';
COMMIT;
