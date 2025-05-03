"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Building, Calendar, Clock, DollarSign, Search, Award, Filter } from "lucide-react"
import { motion } from "framer-motion"

interface JobPost {
  id: string
  title: string
  salary: string
  company: string
  jobType: string
  experience: string
  createdAt: Date | string
}

interface ShowPostedJobProps {
  jobs: JobPost[] | null
}

export default function Jobs({ jobs }: ShowPostedJobProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterType, setFilterType] = useState("all")

  // Filter and sort jobs
  const filteredJobs = jobs
    ? jobs
        .filter((job) => {
          // Search filter
          const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase())

          // Job type filter
          const matchesType = filterType === "all" || job.jobType.toLowerCase() === filterType.toLowerCase()

          return matchesSearch && matchesType
        })
        .sort((a, b) => {
          // Sort logic
          if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          } else if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          }
          return 0
        })
    : []

  // Get unique job types for filter
  const jobTypes = jobs ? [...new Set(jobs.map((job) => job.jobType))] : []

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Briefcase className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">No jobs available</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          There are currently no job postings in this category. Please check back later or explore other categories.
        </p>
        <Button onClick={() => router.push("/categories")} className="bg-green-600 hover:bg-green-700 text-white">
          Browse Categories
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Available Jobs ({filteredJobs.length})</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Job Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="Sort By" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No matching jobs found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button
            onClick={() => {
              setSearchTerm("")
              setFilterType("all")
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/apply-job/${job.id}`} className="block h-full">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-gray-200 h-full hover:border-green-300 hover:translate-y-[-2px]">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-900 mb-1">{job.title}</CardTitle>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Building className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-md flex items-center justify-center text-green-700 font-bold">
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-2">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100">
                        <Clock className="h-3 w-3" />
                        {job.jobType}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100">
                        <DollarSign className="h-3 w-3" />
                        {job.salary}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100">
                        <Award className="h-3 w-3" />
                        {job.experience}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Posted {formatDate(job.createdAt)}</span>
                      </div>
                      <span className="text-green-600 font-medium">View Details</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Helper function to format dates in a relative way
function formatDate(dateString: string | Date): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`
  } else {
    return date.toLocaleDateString()
  }
}
