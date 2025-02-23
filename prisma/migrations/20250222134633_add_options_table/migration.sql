/*
  Warnings:

  - You are about to drop the column `options` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "options";

-- CreateTable
CREATE TABLE "Options" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "questionId" INTEGER,

    CONSTRAINT "Options_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Options" ADD CONSTRAINT "Options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
