/*
  Warnings:

  - You are about to drop the `CandidateDocuments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CandidateDocuments" DROP CONSTRAINT "CandidateDocuments_jobPostId_fkey";

-- DropTable
DROP TABLE "CandidateDocuments";

-- CreateTable
CREATE TABLE "CandidateApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "identityCardUrl" TEXT NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "jobPostId" TEXT NOT NULL,

    CONSTRAINT "CandidateApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CandidateApplication" ADD CONSTRAINT "CandidateApplication_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
