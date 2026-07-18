/*
  Warnings:

  - The values [PENDING] on the enum `RequisitionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `dueDate` on the `Requisition` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Requisition` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - A unique constraint covering the columns `[userId]` on the table `PasswordSetupToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequisitionStatus_new" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'RELEASED', 'COMPLETED');
ALTER TABLE "public"."Requisition" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Requisition" ALTER COLUMN "status" TYPE "RequisitionStatus_new" USING ("status"::text::"RequisitionStatus_new");
ALTER TYPE "RequisitionStatus" RENAME TO "RequisitionStatus_old";
ALTER TYPE "RequisitionStatus_new" RENAME TO "RequisitionStatus";
DROP TYPE "public"."RequisitionStatus_old";
ALTER TABLE "Requisition" ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';
COMMIT;

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'FINANCE';

-- AlterTable
ALTER TABLE "Requisition" DROP COLUMN "dueDate",
ADD COLUMN     "neededBy" TIMESTAMP(3),
ADD COLUMN     "releasedAt" TIMESTAMP(3),
ADD COLUMN     "releasedById" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';

-- CreateIndex
CREATE UNIQUE INDEX "PasswordSetupToken_userId_key" ON "PasswordSetupToken"("userId");

-- CreateIndex
CREATE INDEX "Requisition_status_idx" ON "Requisition"("status");

-- CreateIndex
CREATE INDEX "Requisition_departmentId_idx" ON "Requisition"("departmentId");

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_releasedById_fkey" FOREIGN KEY ("releasedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
