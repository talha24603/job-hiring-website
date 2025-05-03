"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import UserImageChange from "@/components/userImageChange"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash2, Plus, Briefcase, Users } from "lucide-react"
import DeleteJobDialog from "@/components/DeleteJobDialog"
import Image from "next/image"
import { Roboto } from "next/font/google"
import type { Application } from "@/types/application"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
})

interface JobPost {
  id: string
  title: string
  details: string
  location: string
  salary: string
  company: string
  jobType: string
  category: string
  experience: string
  createdAt: Date
}

interface EmployerProfileProps {
  user: {
    id: string
    name: string
    email: string
    image?: string
    role?: string
    isVerified: boolean
    emailVerified?: null
  }
  postedJobs?: JobPost[]
  applications?: Application[]
}

export default function EmployerDashboard({ user, postedJobs = [], applications = [] }: EmployerProfileProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [jobs, setJobs] = useState<JobPost[]>(postedJobs)
  const [app, setApp] = useState<Application[]>(applications)
  const [deleteJobId, setDeleteJobId] = useState("")
  const [openDelete, setOpenDelete] = useState(false)

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Profile Section */}
      <div className="w-full md:w-1/4 md:min-h-screen">
        <div className="p-6 bg-white shadow-sm rounded-lg m-4 flex flex-col items-center md:items-start gap-6">
          {/* Profile Image */}
          <div
            className="group relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-4 border-gray-100 shadow-md"
            onClick={() => setOpen(!open)}
          >
            {user.image ? (
              <>
                <img src={user.image || "/placeholder.svg"} alt="Profile" className="object-cover w-full h-full" />
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-300">
                  <div className="opacity-0 group-hover:opacity-100 transition duration-300">
                    <Image
                      width={24}
                      height={24}
                      src="/placeholder.svg?height=24&width=24"
                      alt="Edit"
                      className="filter invert"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <span className="text-gray-500 text-2xl font-bold">{user.name?.charAt(0).toUpperCase() || "U"}</span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center md:items-start gap-2 w-full">
            <div className="flex items-center gap-2 break-words">
              <h1 className="text-2xl font-bold text-gray-800 break-words">{user.name}</h1>
              {user.isVerified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-gray-600">{user.email}</p>
            {/* <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-2"
              onClick={() => router.push("/edit-profile")}
            >
              <Pencil size={14} />
              Edit Profile
            </Button> */}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-800">{jobs.length}</p>
              <p className="text-sm text-gray-600">Jobs Posted</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-800">{app.length}</p>
              <p className="text-sm text-gray-600">Applications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-2 sm:p-4">
        <Tabs defaultValue="jobs" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="jobs" className="gap-2">
                <Briefcase size={16} />
                Posted Jobs
              </TabsTrigger>
              <TabsTrigger value="applications" className="gap-2">
                <Users size={16} />
                Applications
              </TabsTrigger>
            </TabsList>
            <Link href="/post-job" className="w-full sm:w-auto">
              <Button className="gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <Plus size={16} />
                Post New Job
              </Button>
            </Link>
          </div>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {jobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    index={index}
                    onEdit={() => router.push(`/edit-job/${job.id}`)}
                    onDelete={() => {
                      setDeleteJobId(job.id)
                      setOpenDelete(true)
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No jobs posted yet"
                description="Start by posting your first job opening"
                action={
                  <Link href="/post-job">
                    <Button className="gap-2">
                      <Plus size={16} />
                      Post Job
                    </Button>
                  </Link>
                }
              />
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {app.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {app.map((application, index) => (
                  <ApplicationCard key={application.id} application={application} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No applications yet"
                description="Applications will appear here when candidates apply to your jobs"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <UserImageChange open={open} setOpen={setOpen} userId={user.id} />
      <DeleteJobDialog openDelete={openDelete} setOpenDelete={setOpenDelete} deleteJobId={deleteJobId} />

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// Job Card Component
interface JobCardProps {
  job: JobPost
  index: number
  onEdit: () => void
  onDelete: () => void
}

function JobCard({ job, index, onEdit, onDelete }: JobCardProps) {
  const router = useRouter()

  return (
    <Link href={`/posted-job/${job.id}`}>
      <Card
        className="relative bg-white shadow hover:shadow-md transition hover:bg-gray-50 fade-up"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold break-words">{job.title}</CardTitle>
              <CardDescription className="text-sm">{job.company}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onEdit()
                }}
              >
                <Pencil size={16} />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 size={16} />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="bg-gray-100">
              {job.jobType}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100">
              {job.location}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100">
              {job.experience}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

// Application Card Component
interface ApplicationCardProps {
  application: Application
  index: number
}

// In ApplicationCard component:
function ApplicationCard({ application, index }: ApplicationCardProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(application.status)

  // Function to determine badge color based on status
  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "reviewing":
      case "under review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "interview":
      case "interviewing":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "hired":
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true)

      // Make API call to update application status
      const response = await fetch(`/api/application/${application.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setCurrentStatus(newStatus)
        // You could add a toast notification here
      } else {
        // Handle error
        console.error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating application status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card
      className={`bg-white shadow hover:shadow-md transition fade-up border-l-4 ${
        currentStatus.toLowerCase() === "hired" || currentStatus.toLowerCase() === "accepted"
          ? "border-l-green-500"
          : currentStatus.toLowerCase() === "rejected"
            ? "border-l-red-500"
            : currentStatus.toLowerCase() === "interview" || currentStatus.toLowerCase() === "interviewing"
              ? "border-l-purple-500"
              : currentStatus.toLowerCase() === "reviewing" || currentStatus.toLowerCase() === "under review"
                ? "border-l-yellow-500"
                : "border-l-blue-500"
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{application.employeeProfile.name}</CardTitle>
            <CardDescription>{application.employeeProfile.email}</CardDescription>
          </div>
          <Badge variant="outline" className={getStatusBadgeStyles(currentStatus)}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => router.push(`/view-application/${application.employeeProfile.id}`)}
            >
              View Resume
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              View ID
            </Button>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Update Status:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${currentStatus.toLowerCase() === "reviewing" ? "bg-yellow-100" : ""}`}
                onClick={() => handleStatusChange("reviewing")}
                disabled={isUpdating || currentStatus.toLowerCase() === "reviewing"}
              >
                Reviewing
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${currentStatus.toLowerCase() === "interview" ? "bg-purple-100" : ""}`}
                onClick={() => handleStatusChange("interview")}
                disabled={isUpdating || currentStatus.toLowerCase() === "interview"}
              >
                Interview
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${currentStatus.toLowerCase() === "hired" ? "bg-green-100" : ""}`}
                onClick={() => handleStatusChange("hired")}
                disabled={isUpdating || currentStatus.toLowerCase() === "hired"}
              >
                Hire
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${currentStatus.toLowerCase() === "rejected" ? "bg-red-100" : ""}`}
                onClick={() => handleStatusChange("rejected")}
                disabled={isUpdating || currentStatus.toLowerCase() === "rejected"}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Applied on: {new Date(application.appliedAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  )
}

// Empty State Component
interface EmptyStateProps {
  title: string
  description: string
  action?: React.ReactNode
}

function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <Briefcase className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {action}
    </div>
  )
}
