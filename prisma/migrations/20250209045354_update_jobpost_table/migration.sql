/*
  Warnings:

  - Added the required column `experience` to the `job_post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_post" ADD COLUMN     "experience" TEXT NOT NULL;
