-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TemplateLike" (
    "userId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateLike_pkey" PRIMARY KEY ("userId","templateId")
);

-- CreateIndex
CREATE INDEX "TemplateLike_templateId_idx" ON "TemplateLike"("templateId");

-- CreateIndex
CREATE INDEX "TemplateLike_userId_idx" ON "TemplateLike"("userId");

-- AddForeignKey
ALTER TABLE "TemplateLike" ADD CONSTRAINT "TemplateLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateLike" ADD CONSTRAINT "TemplateLike_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
