import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CategoriesPage() {
  const jobCategories = [
    {
      value: "frontend-developer",
      label: "Frontend Developer",
      image: "/images/front.jpg",
      description: "Build user interfaces and web applications",
      count: 124,
    },
    {
      value: "backend-developer",
      label: "Backend Developer",
      image: "/images/back.png",
      description: "Develop server-side logic and APIs",
      count: 98,
    },
    {
      value: "full-stack-developer",
      label: "Full Stack Developer",
      image: "/images/full.jpg",
      description: "Work on both client and server sides",
      count: 156,
    },
    {
      value: "mobile-app-developer",
      label: "Mobile App Developer",
      image: "/images/app.jpg",
      description: "Create apps for iOS and Android",
      count: 87,
    },
    {
      value: "devops-engineer",
      label: "DevOps Engineer",
      image: "/images/dev.jpg",
      description: "Automate and optimize deployment processes",
      count: 65,
    },
    {
      value: "software",
      label: "Software Engineer",
      image: "/images/se.jpg",
      description: "Design and build software systems",
      count: 210,
    },
    {
      value: "game",
      label: "Game Developer",
      image: "/images/game.png",
      description: "Create interactive gaming experiences",
      count: 42,
    },
    {
      value: "ai",
      label: "AI/ML Engineer",
      image: "/images/ai.jpg",
      description: "Build machine learning and AI solutions",
      count: 76,
    },
    {
      value: "cybersecurity",
      label: "Cybersecurity Engineer",
      image: "/images/cyber.jpg",
      description: "Protect systems from security threats",
      count: 53,
    },
    {
      value: "data",
      label: "Data Engineer",
      image: "/images/data.jpg",
      description: "Build data pipelines and infrastructure",
      count: 89,
    },
    {
      value: "database",
      label: "Database Administrator",
      image: "/images/database.jpg",
      description: "Manage and optimize databases",
      count: 37,
    },
    {
      value: "cloud",
      label: "Cloud Engineer",
      image: "/images/cloud.jpg",
      description: "Design and implement cloud solutions",
      count: 68,
    },
    {
      value: "ux-ui-designer",
      label: "UX/UI Designer",
      image: "/images/ui.png",
      description: "Create user-centered digital experiences",
      count: 92,
    },
    {
      value: "other",
      label: "Other",
      image: "/images/others.jpg",
      description: "Explore other tech opportunities",
      count: 45,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Job Categories</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore job opportunities across various tech specializations and find your perfect role
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobCategories.map((category) => (
            <Link
              href={`/job/${category.value}`}
              key={category.value}
              className="block h-full transition-transform hover:scale-[1.02]"
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-gray-200 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-lg overflow-hidden bg-green-50">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={`${category.label} category`}
                        width={60}
                        height={60}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{category.label}</h3>
                        {/* <Badge variant="outline" className="bg-gray-100 text-gray-700">
                          {category.count} jobs
                        </Badge> */}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                      <div className="mt-4">
                        <span className="text-sm text-green-600 font-medium">Browse jobs →</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Looking for Something Else?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Contact our support team and we'll help you find the perfect job
            category for your skills.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
