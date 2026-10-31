-- Link married members to their spouse's member record.
ALTER TABLE "Member" ADD COLUMN "spouseId" TEXT;

CREATE UNIQUE INDEX "Member_spouseId_key" ON "Member"("spouseId");

ALTER TABLE "Member" ADD CONSTRAINT "Member_spouseId_fkey" FOREIGN KEY ("spouseId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
