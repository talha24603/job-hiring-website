import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/prismaClient"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id as string

    // Verify the user is an employer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!user || user.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized. Employer access only." }, { status: 403 })
    }

    // Get all job posts by this employer
    const jobPosts = await prisma.jobPost.findMany({
      where: { userId: userId },
      select: { id: true },
    })

    const jobPostIds = jobPosts.map((job) => job.id)

    // Get all applications for these job posts
    const applications = await prisma.jobApplication.findMany({
      where: {
        jobPostId: { in: jobPostIds },
      },
      include: {
        jobPost: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            jobType: true,
            createdAt: true,
          },
        },
        employeeProfile: {
          select: {
            id: true,
            name: true,
            email: true,
            skills: true,
            education: true,
            linkedin: true,
            github: true,
            profilePicUrl: true,
            resumeUrl: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching employer applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
