"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import UserImageChange from "@/components/userImageChange"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Pencil,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  ChevronRight,
  Award,
  X,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Application } from "@/types/application"
import { motion } from "framer-motion"

interface EmployeeProfileProps {
  user: {
    id: string
    name: string
    email: string
    image?: string
    role?: string
    isVerified: boolean
    emailVerified?: null
  }
  applications?: Application[]
}

export default function EmployeeDashboard({ user, applications = [] }: EmployeeProfileProps) {
  const [open, setOpen] = useState(false)
  const [app, setApp] = useState<Application[]>(applications)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false)
  const router = useRouter()

  const handleViewJobDetails = (application: Application) => {
    setSelectedApplication(application)
    setJobDetailsOpen(true)
  }

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Sidebar - Profile Section */}
      <div className="w-full md:w-1/4 md:min-h-screen">
        <div className="p-6 bg-white shadow-lg rounded-lg m-4 flex flex-col items-center md:items-start gap-6">
          {/* Profile Image */}
          <div
            className="group relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-4 border-white shadow-md hover:shadow-lg transition-shadow duration-300"
            onClick={() => setOpen(!open)}
          >
            {user.image ? (
              <>
                <img src={user.image || "/placeholder.svg"} alt="Profile" className="object-cover w-full h-full" />
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-300">
                  <div className="opacity-0 group-hover:opacity-100 transition duration-300">
                    <Pencil className="h-6 w-6 text-white" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-green-100 to-green-200">
                <span className="text-green-700 text-3xl font-bold">{user.name?.charAt(0).toUpperCase() || "U"}</span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center md:items-start gap-2 w-full">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              {user.isVerified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-gray-600">{user.email}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-2 border-green-200 hover:bg-green-50 hover:text-green-700 transition-colors"
              onClick={() => router.push("/edit-profile")}
            >
              <Pencil size={14} />
              Edit Profile
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 w-full mt-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg text-center shadow-sm">
              <p className="text-3xl font-bold text-green-700">{app.length}</p>
              <p className="text-sm text-green-600">Job Applications</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full space-y-2 mt-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Quick Links</h3>
            <div className="space-y-1">
              <Link
                href="/categories"
                className="flex items-center justify-between p-3 rounded-md hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Browse Jobs</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              {/* <Link
                href="/saved-jobs"
                className="flex items-center justify-between p-3 rounded-md hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Saved Jobs</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link> */}
              <Link
                href="/profile"
                className="flex items-center justify-between p-3 rounded-md hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>My Resume</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="text-xl">My Applications</CardTitle>
            <CardDescription className="text-green-100">Track and manage your job applications</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {app.length > 0 ? (
              <div className="space-y-4">
                {app.map((application, index) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    index={index}
                    onClick={() => handleViewJobDetails(application)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No applications yet"
                description="Start applying for jobs to track your applications here"
                action={
                  <Link href="/jobs">
                    <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                      <Briefcase size={16} />
                      Browse Jobs
                    </Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <UserImageChange open={open} setOpen={setOpen} userId={user.id} />

      {/* Job Details Dialog */}
      <Dialog open={jobDetailsOpen} onOpenChange={setJobDetailsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold">Job Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setJobDetailsOpen(false)} className="h-8 w-8">
              {/* <X className="h-4 w-4" /> */}
            </Button>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-md bg-green-100 flex items-center justify-center text-green-700">
                  {selectedApplication.jobPost.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedApplication.jobPost.title}</h2>
                  <p className="text-gray-600">{selectedApplication.jobPost.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span>{selectedApplication.jobPost.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>{selectedApplication.jobPost.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>{selectedApplication.jobPost.jobType}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Award className="h-4 w-4 text-green-600" />
                  <span>{selectedApplication.jobPost.experience}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: selectedApplication.jobPost.details }}
                />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Application Status</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">
                        Applied on: {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Under Review</Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setJobDetailsOpen(false)}>
                  Close
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">Contact Employer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

// Application Card Component
interface ApplicationCardProps {
  application: Application
  index: number
  onClick: () => void
}

function ApplicationCard({ application, index, onClick }: ApplicationCardProps) {
  // Function to determine badge color based on status
  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
      case "reviewing":
      case "under review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
      case "interview":
      case "interviewing":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
      case "hired":
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    }
  }

  // Function to format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className={`bg-white shadow hover:shadow-md transition cursor-pointer border-l-4 ${
          application.status.toLowerCase() === "hired" || application.status.toLowerCase() === "accepted"
            ? "border-l-green-500"
            : application.status.toLowerCase() === "rejected"
              ? "border-l-red-500"
              : application.status.toLowerCase() === "interview" || application.status.toLowerCase() === "interviewing"
                ? "border-l-purple-500"
                : application.status.toLowerCase() === "reviewing" ||
                    application.status.toLowerCase() === "under review"
                  ? "border-l-yellow-500"
                  : "border-l-blue-500"
        } hover:bg-gray-50`}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">{application.jobPost.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Building className="h-3.5 w-3.5" />
                {application.jobPost.company}
              </CardDescription>
            </div>
            <Badge variant="outline" className={getStatusBadgeStyles(application.status)}>
              {formatStatus(application.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {application.jobPost.location}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {application.jobPost.jobType}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {application.jobPost.salary}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-0">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Applied on: {new Date(application.appliedAt).toLocaleDateString()}
          </p>
          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0">
            View Details <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
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
      <div className="rounded-full bg-green-100 p-3 mb-4">
        <Briefcase className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {action}
    </div>
  )
}
