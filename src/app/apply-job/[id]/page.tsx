import prisma from '@/prismaClient';
import ApplyJob from '@/components/applyJob';

export default async function JobDetails({ params }: { params: Promise<{ id: string }> }) {
  // 🛠 Await params
  const { id } = await params;

  const jobData = await prisma.jobPost.findUnique({
    where: { id },
    include: {
      user: { select: { image: true } },
    },
  });

  return (
    <>
      <ApplyJob job={jobData} />
    </>
  );


  
}
