-- CreateTable
CREATE TABLE "Documents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "identityUrl" TEXT NOT NULL,
    "coverLetterUrl" TEXT,
    "educationUrl" TEXT,
    "experienceUrl" TEXT,
    "certificatesUrl" TEXT,
    "portfolioUrl" TEXT,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);
