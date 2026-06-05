-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passportUrl" TEXT,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "otherNames" TEXT,
    "gender" TEXT,
    "presentAddress" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "maritalStatus" TEXT,
    "spouseName" TEXT,
    "stateOfOrigin" TEXT,
    "lga" TEXT,
    "tribe" TEXT,
    "previousPlaceOfWorship" TEXT,
    "homeCell" TEXT,
    "zone" TEXT,
    "preferredFellowshipGroup" TEXT,
    "fellowshipGroupId" TEXT,
    "acceptedChrist" BOOLEAN NOT NULL DEFAULT false,
    "baptized" BOOLEAN NOT NULL DEFAULT false,
    "baptismPlace" TEXT,
    "baptizedBy" TEXT,
    "communicant" BOOLEAN NOT NULL DEFAULT false,
    "previousChurchPosition" TEXT,
    "recommendations" TEXT,
    "memberSignatureUrl" TEXT,
    "memberSignedAt" DATETIME,
    "pastorSignatureUrl" TEXT,
    "pastorSignedAt" DATETIME,
    "departmentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Member_fellowshipGroupId_fkey" FOREIGN KEY ("fellowshipGroupId") REFERENCES "FellowshipGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Member_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "memberId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Child_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DisciplineRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reason" TEXT NOT NULL,
    "dateOfDiscipline" DATETIME,
    "dateOfRelief" DATETIME,
    "memberId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DisciplineRecord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FellowshipGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FellowshipGroup_name_key" ON "FellowshipGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");
