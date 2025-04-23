/*
  Warnings:

  - You are about to drop the `CandidateApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CandidateApplication" DROP CONSTRAINT "CandidateApplication_jobPostId_fkey";

-- DropTable
DROP TABLE "CandidateApplication";

-- DropTable
DROP TABLE "Documents";

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeProfileId" TEXT NOT NULL,
    "jobPostId" TEXT NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobApplications" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JobApplications_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_employeeProfileId_jobPostId_key" ON "JobApplication"("employeeProfileId", "jobPostId");

-- CreateIndex
CREATE INDEX "_JobApplications_B_index" ON "_JobApplications"("B");

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_employeeProfileId_fkey" FOREIGN KEY ("employeeProfileId") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "job_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplications" ADD CONSTRAINT "_JobApplications_A_fkey" FOREIGN KEY ("A") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplications" ADD CONSTRAINT "_JobApplications_B_fkey" FOREIGN KEY ("B") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
