// app/[category]/page.tsx  (or wherever this file lives)

import { auth } from "@/auth";
import Jobs from "@/components/jobs";
import Navbar from "@/components/navbar/NavBarComponent";
import prisma from "@/prismaClient";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  // 1️⃣ Unwrap the params promise
  const { category } = await params;

  // 2️⃣ Fetch session & user
  const session = await auth();
  const user = session?.user;

  // 3️⃣ Query jobs by category
  const jobs = await prisma.jobPost.findMany({
    where: { category },
    select: {
      id: true,
      title: true,
      createdAt: true,
      experience: true,
      jobType: true,
      company: true,
      salary: true,
    },
  });

  // 4️⃣ Render
  return (
    <div>
      <Navbar user={user} />
      <Jobs jobs={jobs} />
    </div>
  );
}
