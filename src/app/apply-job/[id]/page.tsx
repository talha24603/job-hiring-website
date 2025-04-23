import prisma from '@/prismaClient';
import ApplyJob from '@/components/applyJob';

export default async function JobDetails({ params }: { params: { id: string } }) {
  const jobData = await prisma.jobPost.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: {
        select: {
          image: true,
        },
      },
    },
  });
  

  return <>
  <ApplyJob job={jobData} />
  </>
}
