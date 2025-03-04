-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSyncedWithSalesforce" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "salesforceAccountId" TEXT,
ADD COLUMN     "salesforceContactId" TEXT;
