import { auth } from "@/auth"
import Jobs from "@/components/jobs"
import prisma from "@/prismaClient"

interface PageProps {
  params: Promise<{ category: string }>
}

export default async function Page({ params }: PageProps) {
  // 1️⃣ Unwrap the params promise
  const { category } = await params

  // 2️⃣ Fetch session & user
  const session = await auth()
  const user = session?.user

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
  })

  // Format category name for display
  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // 4️⃣ Render
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{formattedCategory} Jobs</h1>
          <p className="text-gray-600 mt-2">
            Browse available positions in the {formattedCategory.toLowerCase()} category
          </p>
        </div>

        <Jobs jobs={jobs} />
      </div>
    </div>
  )
}
