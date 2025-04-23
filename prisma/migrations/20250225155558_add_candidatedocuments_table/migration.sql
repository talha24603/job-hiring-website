-- CreateTable
CREATE TABLE "CandidateDocuments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "identityCardUrl" TEXT NOT NULL,
    "resumeUrl" TEXT NOT NULL,

    CONSTRAINT "CandidateDocuments_pkey" PRIMARY KEY ("id")
);
