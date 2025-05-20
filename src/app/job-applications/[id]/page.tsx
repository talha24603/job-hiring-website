import JobApplications from "@/components/JobApplications"
import prisma from "@/prismaClient"
import type { Application } from "@/types/application"

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const { id } = params

  // Fetch all applications for the given job post
  const rawApplications = await prisma.jobApplication.findMany({
    where: { jobPostId: id },
    include: {
      jobPost: true,
      employeeProfile: true,
    },
    orderBy: { appliedAt: "desc" },
  })

  const applications: Application[] = rawApplications.map((app) => ({
    id: app.id,
    status: app.status,
    appliedAt: app.appliedAt,
    jobPost: app.jobPost,
    employeeProfile: app.employeeProfile,
  }))

  return <JobApplications applications={applications} />
}
