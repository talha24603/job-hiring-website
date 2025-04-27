// app/job-details/[id]/page.tsx

import prisma from '@/prismaClient';
import ShowPostedJob from '@/components/showPostedJob';
import Navbar from '@/components/navbar/NavBarComponent';
import { auth } from '@/auth';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetails({ params }: PageProps) {
  // 1️⃣ Await params to get your ID
  const { id } = await params;

  // 2️⃣ Fetch session and user
  const session = await auth();
  const user = session?.user;

  // 3️⃣ Fetch the job
  const jobData = await prisma.jobPost.findUnique({
    where: { id },
  });

  // 4️⃣ Render
  return (
    <>
      <Navbar user={user} />
      <ShowPostedJob job={jobData} />
    </>
  );
}
