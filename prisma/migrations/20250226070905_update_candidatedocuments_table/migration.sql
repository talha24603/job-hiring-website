/*
  Warnings:

  - Added the required column `jobPostId` to the `CandidateDocuments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CandidateDocuments" ADD COLUMN     "jobPostId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CandidateDocuments" ADD CONSTRAINT "CandidateDocuments_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
