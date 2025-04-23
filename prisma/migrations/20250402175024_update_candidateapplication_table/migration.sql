/*
  Warnings:

  - You are about to drop the column `identityCardUrl` on the `CandidateApplication` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `CandidateApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CandidateApplication" DROP COLUMN "identityCardUrl",
ADD COLUMN     "education" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profilePicUrl" TEXT,
ADD COLUMN     "skills" TEXT,
ALTER COLUMN "resumeUrl" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CandidateApplication_email_key" ON "CandidateApplication"("email");
