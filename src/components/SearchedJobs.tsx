"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Briefcase, Calendar, Clock, DollarSign, MapPin, Building, Award } from "lucide-react"

interface JobUser {
  image?: string | null
}

interface JobPost {
  id: string
  title: string
  salary: string
  company: string
  jobType: string
  experience: string
  location?: string
  createdAt: Date | string
  user?: JobUser
}

interface JobDetail extends JobPost {
  details: string
}

interface SearchedJobsProps {
  jobs: JobPost[] | null
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [query])
  return matches
}

export default function SearchedJobs({ jobs }: SearchedJobsProps) {
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [jobToApply, setJobToApply] = useState<JobPost | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <Briefcase className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">No jobs found</h3>
        <p className="text-gray-500 max-w-md">
          We couldn't find any jobs matching your search criteria. Try adjusting your filters or check back later.
        </p>
      </div>
    )
  }

  const handleCardClick = async (job: JobPost) => {
    setSelectedJobId(job.id)
    if (!isDesktop) {
      router.push(`/apply-job/${job.id}`)
    } else {
      setLoading(true)
      try {
        const response = await axios.get(`/api/job-detail/${job.id}`)
        setSelectedJob(response.data)
      } catch (error) {
        console.error("Error fetching job detail:", error)
        toast.error("Failed to load job details. Please try again.")
      }
      setLoading(false)
    }
  }

  const handleApplyJob = async (job: JobPost) => {
    try {
      const response = await axios.post("/api/apply-job", { jobId: job.id })
      toast.success(response.data.message || "Application submitted successfully!")
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        toast.error("Please sign in to apply for jobs")
        router.push("/login")
        return
      }
      const backendMessage = error.response?.data?.message || error.message || "Unknown error"
      toast.error(`Error applying for job: ${backendMessage}`)
    }
  }

  const confirmApplyJob = (job: JobPost, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setJobToApply(job)
    setAlertOpen(true)
  }

  const onConfirmApplyJob = async () => {
    if (jobToApply) {
      await handleApplyJob(jobToApply)
    }
    setAlertOpen(false)
    setJobToApply(null)
  }

  // Format salary for display
  const formatSalary = (salary: string) => {
    if (!salary) return "Competitive"

    // If it's already formatted with $ or other currency symbols, return as is
    if (salary.includes("$") || salary.includes("€") || salary.includes("£")) {
      return salary
    }

    // Otherwise add $ symbol
    return `$${salary}`
  }

  // Calculate how long ago the job was posted
  const getTimeAgo = (dateString: string | Date) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`

    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
      {/* Left Column: Job Listings */}
      <div className="lg:w-2/5 xl:w-1/3 p-4 lg:p-6 lg:border-r border-gray-200 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available Jobs</h2>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
          </Badge>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card
                className={`cursor-pointer border transition-all ${
                  selectedJobId === job.id
                    ? "border-green-500 shadow-md ring-1 ring-green-200"
                    : "border-gray-200 hover:border-gray-300 hover:shadow"
                }`}
                onClick={() => handleCardClick(job)}
              >
                <CardHeader className="p-4 pb-2 flex flex-row items-start gap-3">
                  <div className="flex-shrink-0">
                    {job.user?.image ? (
                      <Image
                        src={job.user.image || "/placeholder.svg"}
                        alt={`${job.company} logo`}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-green-100 flex items-center justify-center text-green-700 font-bold">
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Building className="h-3.5 w-3.5 mr-1" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-3.5 w-3.5 mr-1.5" />
                      <span>{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span>{job.jobType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Award className="h-3.5 w-3.5 mr-1.5" />
                      <span>{job.experience}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {getTimeAgo(job.createdAt)}
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={(e) => confirmApplyJob(job, e)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Column: Job Details */}
      {isDesktop && (
        <div className="hidden lg:block lg:w-3/5 xl:w-2/3 p-6 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="space-y-2 mt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : selectedJob ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  {selectedJob.user?.image ? (
                    <Image
                      src={selectedJob.user.image || "/placeholder.svg"}
                      alt={`${selectedJob.company} logo`}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
                      {selectedJob.company.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedJob.title}</h1>
                  <p className="text-lg text-gray-700">{selectedJob.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 flex items-center gap-1.5 px-3 py-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedJob.location || "Remote"}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 flex items-center gap-1.5 px-3 py-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatSalary(selectedJob.salary)}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 flex items-center gap-1.5 px-3 py-1">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedJob.jobType}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 flex items-center gap-1.5 px-3 py-1">
                  <Award className="h-3.5 w-3.5" />
                  {selectedJob.experience}
                </Badge>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                Posted {getTimeAgo(selectedJob.createdAt)}
              </div>

              <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedJob.details }}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  onClick={() => router.push(`/apply-job/${selectedJob.id}`)}
                >
                  Apply Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success("Job link copied to clipboard!")
                  }}
                >
                  Share Job
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Briefcase className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Select a job</h3>
              <p className="text-gray-500 max-w-md">Click on a job from the list to view its details here</p>
            </div>
          )}
        </div>
      )}

      {/* Apply Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply for this position?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to apply for <span className="font-medium">{jobToApply?.title}</span> at{" "}
              <span className="font-medium">{jobToApply?.company}</span>. Your profile information will be shared with
              the employer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmApplyJob} className="bg-green-600 hover:bg-green-700 text-white">
              Apply Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
