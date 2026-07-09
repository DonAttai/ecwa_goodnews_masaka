-- DropForeignKey
ALTER TABLE "Requisition" DROP CONSTRAINT "Requisition_requestedById_fkey";

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
