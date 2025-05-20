// src/app/job-applications/[id]/page.tsx
import JobApplications from "@/components/JobApplications"
import prisma from "@/prismaClient"
import type { Application } from "@/types/application"

interface PageProps {
  // params now comes in as a Promise<{ id: string }>
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  // unwrap the params promise
  const { id } = await params

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
