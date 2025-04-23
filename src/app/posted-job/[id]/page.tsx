import prisma from '@/prismaClient';
import ShowPostedJob from '@/components/showPostedJob';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar/NavBarComponent';
import { auth } from '@/auth';

export default async function JobDetails({ params }: { params: { id: string } }) {
  const session = await auth();
    const user = session?.user
  const jobData = await prisma.jobPost.findUnique({
    where: {
      id: params.id,
    },
  });

  return <>
  <Navbar user={user}/>
   <ShowPostedJob job={jobData} />
  </>
}
