/*
  Warnings:

  - Added the required column `otpExpiry` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpExpiry" TEXT NOT NULL,
ALTER COLUMN "otp" SET DATA TYPE TEXT;
