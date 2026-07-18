/*
  Warnings:

  - You are about to drop the column `releasedById` on the `Requisition` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Requisition" DROP CONSTRAINT "Requisition_releasedById_fkey";

-- AlterTable
ALTER TABLE "Requisition" DROP COLUMN "releasedById",
ADD COLUMN     "paidById" TEXT;

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
