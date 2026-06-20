-- CreateEnum
CREATE TYPE "CoverLetterTone" AS ENUM ('professional', 'warm', 'confident', 'concise');

-- CreateEnum
CREATE TYPE "CoverLetterLength" AS ENUM ('short', 'standard', 'detailed');

-- CreateTable
CREATE TABLE "CoverLetter" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "tone" "CoverLetterTone" NOT NULL,
    "length" "CoverLetterLength" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_processId_fkey" FOREIGN KEY ("processId") REFERENCES "AnalyseProcess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
