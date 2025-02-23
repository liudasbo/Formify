/*
  Warnings:

  - You are about to drop the column `value` on the `Tags` table. All the data in the column will be lost.
  - Added the required column `label` to the `Tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "value",
ADD COLUMN     "label" TEXT NOT NULL;
