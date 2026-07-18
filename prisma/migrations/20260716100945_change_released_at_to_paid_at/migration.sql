/*
  Warnings:

  - You are about to drop the column `releasedAt` on the `Requisition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Requisition" DROP COLUMN "releasedAt",
ADD COLUMN     "paidAt" TIMESTAMP(3);
