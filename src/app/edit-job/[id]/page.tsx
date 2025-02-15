// app/edit-job/[id]/page.tsx

import prisma from "@/prismaClient";
import JobPostForm from "../../post-job/page"; // static import

interface PageProps {
  params: {
    id: string;
  };
}

export default async function JobPostPage({ params }: PageProps) {
  const { id } = params;

  // Perform your server-side data fetching here (e.g., using Prisma)
  const dataToEdit = await prisma.jobPost.findUnique({
    where: { id },
    select: {
      id:true,
      title: true,
      jobType: true,
      location: true,
      category: true,
      experience: true,
      salary: true,
      details: true,
      company: true,
    },
  });

  return <JobPostForm dataToEdit={dataToEdit || undefined} />;
}
