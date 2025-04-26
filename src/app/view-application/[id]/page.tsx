"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Worker, Viewer } from "@react-pdf-viewer/core"
import "@react-pdf-viewer/core/lib/styles/index.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone, Briefcase, GraduationCap, Linkedin, Github, FileText } from "lucide-react"

type EmployeeProfile = {
  id: string
  name: string
  email: string
  phone?: string
  skills?: string
  education?: string
  linkedin?: string
  github?: string
  profilePicUrl?: string
  resumeUrl?: string
  createdAt: string
}

export default function JobSeekerProfile() {
  const params = useParams()
  const id = params?.id as string
  const [profile, setProfile] = useState<EmployeeProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("Invalid application ID")
      setLoading(false)
      return
    }

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/view-application/${id}`)
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        setError("Could not load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-destructive">{error}</h2>
              <p className="mt-2 text-muted-foreground">Please check the URL and try again.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Profile not found</h2>
              <p className="mt-2 text-muted-foreground">The requested profile could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Parse skills into an array if they exist
  const skillsArray = profile.skills ? profile.skills.split(",").map((skill) => skill.trim()) : []

  return (
    <div className="container max-w-5xl py-8 mx-auto space-y-6 px-4 sm:px-6">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
        <div className="px-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profile.profilePicUrl || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 mb-2">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">Applicant</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
              {profile.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {profile.github && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pb-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {skillsArray.length > 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skillsArray.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {profile.education && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{profile.education}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.resumeUrl ? (
                    <div className="border rounded-md overflow-hidden h-[600px]">
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <Viewer fileUrl={profile.resumeUrl} />
                      </Worker>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] border rounded-md bg-muted/20">
                      <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No resume uploaded</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container max-w-5xl py-8 mx-auto space-y-6 px-4 sm:px-6">
      <Card className="overflow-hidden">
        <div className="h-32 bg-muted" />
        <div className="px-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="ml-4 mb-2 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pb-6">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[600px] w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
