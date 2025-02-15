-- DropForeignKey
ALTER TABLE "job_post" DROP CONSTRAINT "job_post_userId_fkey";

-- AddForeignKey
ALTER TABLE "job_post" ADD CONSTRAINT "job_post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
