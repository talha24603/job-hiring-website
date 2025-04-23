// app/employer-profile/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth"; // Import your auth configuration
import EmployerProfilePage from "@/components/EmployerProfilePage";
import prisma from "@/prismaClient";
import { Application } from "@/types/application";

export default async function ProfilePage() {
  // Get the server session using your auth configuration
  const session = await auth();

  // Redirect if no user is logged in
  if (!session?.user) {
    redirect("/");
  }
  
  // Build the user object with relevant details
  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
    isVerified: session.user.isVerified ?? false,
  };

  console.log("user", user);

  // Fetch jobs posted by the employer
  const postedJobs = await prisma.jobPost.findMany({
    where: { userId: user.id },
  });

  // Fetch job applications for the jobs that the employer posted
  // Fetch raw applications from Prisma
const rawApplications = await prisma.jobApplication.findMany({
  where: {
    jobPost: { userId: user.id },
  },
  include: {
    jobPost: true,
    employeeProfile: true,
  },
});

// Map the raw data into your Application type
const applications: Application[] = rawApplications.map(app => ({

  appliedAt: app.appliedAt,
  id: app.id,
  jobPost: app.jobPost,
  employeeProfile: {
    ...app.employeeProfile,
    // Provide a fallback if identityCardUrl is missing
  },
}));

// Now pass the mapped applications into your component
return (
  <>
    <EmployerProfilePage 
      user={user} 
      postedJobs={postedJobs} 
      applications={applications}
    />
  </>
);
}