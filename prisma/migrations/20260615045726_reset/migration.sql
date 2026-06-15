-- CreateEnum
CREATE TYPE "Status" AS ENUM ('generating', 'pending', 'done');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "AnalyseProcess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT,
    "jobTitle" TEXT,
    "companyName" TEXT,
    "parsingStatus" "Status" NOT NULL DEFAULT 'pending',
    "readingStatus" "Status" NOT NULL DEFAULT 'pending',
    "comparingStatus" "Status" NOT NULL DEFAULT 'pending',
    "generatingStatus" "Status" NOT NULL DEFAULT 'pending',
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyseProcess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnalyseProcess" ADD CONSTRAINT "AnalyseProcess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
