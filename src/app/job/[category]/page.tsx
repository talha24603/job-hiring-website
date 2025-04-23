import { auth } from "@/auth";
import Jobs from "@/components/jobs";
import Navbar from "@/components/navbar/NavBarComponent";
import prisma from "@/prismaClient";

// Remove useParams import
// import { useParams } from "next/navigation";

export default async function Page({ params }: { params: { category: string } }) {
  const session = await auth();
    const user = session?.user
  const jobs = await prisma.jobPost.findMany({
    where: {
      category: params.category,
    },
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

  return (
    <div>
      <Navbar user = {user}/>
      <Jobs jobs={jobs} />
    </div>
  );
}
