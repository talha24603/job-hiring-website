// app/edit-job/[id]/page.tsx

import prisma from "@/prismaClient";
import JobPostForm from "../../post-job/page";
import Navbar from "@/components/navbar/NavBarComponent";
import { auth } from "@/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPostPage({ params }: PageProps) {
  const { id } = await params;               // ← await here
  const session = await auth();
  const user = session?.user;

  const dataToEdit = await prisma.jobPost.findUnique({
    where: { id },
    select: {
      id: true,
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

  return (
    <>
      <Navbar user={user} />
      <JobPostForm dataToEdit={dataToEdit ?? undefined} />
    </>
  );
}
