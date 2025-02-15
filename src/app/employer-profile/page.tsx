// app/employer-profile/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth"; // Import your auth configuration
import Navbar from "@/components/navbar/NavBar";
import EmployerProfilePage from "@/components/ui/EmployerProfilePage";
import prisma from "@/prismaClient";

export default async function ProfilePage() {
  // Get the server session using your auth configuration
  const session = await auth();

  // Redirect if no user is logged in
  if (!session?.user) {
    redirect("/");
  }
  
  // Now that we've confirmed session.user exists, reassign it.
  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
    isVerified: session.user.isVerified ?? false,
    //emailVerified?: session.user.emailVerified ?? null,
  };  console.log("user", user);

  const postedJobs = await prisma.jobPost.findMany({
    where: { userId: user.id },
  });

  return (
    <>
      <Navbar user={user} />
      <EmployerProfilePage user={user} postedJobs={postedJobs} />
    </>
  );
}
