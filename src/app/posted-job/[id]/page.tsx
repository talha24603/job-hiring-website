import prisma from '@/prismaClient';
import ShowPostedJob from '@/components/showPostedJob';

export default async function JobDetails({ params }: { params: { id: string } }) {
  const jobData = await prisma.jobPost.findUnique({
    where: {
      id: params.id,
    },
  });

  return <ShowPostedJob job={jobData} />;
}
