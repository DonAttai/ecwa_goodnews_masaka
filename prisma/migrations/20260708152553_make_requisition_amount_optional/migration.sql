-- AlterTable
ALTER TABLE "Requisition" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'NGN';
