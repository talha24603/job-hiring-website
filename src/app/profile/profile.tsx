"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "sonner"
import { Worker, Viewer } from "@react-pdf-viewer/core"
import "@react-pdf-viewer/core/lib/styles/index.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileText } from "lucide-react"
import { useSession } from "next-auth/react"

interface Data {
  name: string
  email: string
  phone: string
  skills: string
  education: string
  resumeUrl: string
  linkedin: string
  github: string
}

interface FormData {
  name: string
  email: string
  phone: string
  skills: string
  education: string
  resume: File | null
  linkedin: string
  github: string
}

interface EmployeeProfileProps {
  data: Data
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ data }) => {
  const session = useSession()
  const user = session?.data?.user
  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      skills: "",
      education: "",
      resume: null,
      linkedin: "",
      github: "",
    },
  })

  const [profileExists, setProfileExists] = useState(false)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form when `data` arrives
  useEffect(() => {
    if (data) {
      setProfileExists(true)
      if (data.resumeUrl) setResumeUrl(data.resumeUrl)
      console.log("Resume URL:", data)
      setValue("name", data.name)
      setValue("email", data.email)
      setValue("phone", data.phone)
      setValue("skills", data.skills)
      setValue("education", data.education)
      setValue("linkedin", data.linkedin)
      setValue("github", data.github)
    }
  }, [data, setValue])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit")
        return
      }

      // Check file type
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed")
        return
      }

      setSelectedFile(file)
      setValue("resume", file)
    }
  }

  

  const onSubmit = async (form: FormData) => {
    setIsSubmitting(true)
    try {
      const apiData = new FormData()
      apiData.append("name", form.name)
      apiData.append("userId", user?.id as string)

      apiData.append("email", form.email)
      apiData.append("phone", form.phone)
      apiData.append("skills", form.skills)
      apiData.append("education", form.education)
      apiData.append("linkedin", form.linkedin)
      apiData.append("github", form.github)
      if (form.resume) apiData.append("resume", form.resume)

      const res = await axios.post("/api/employee-profile", apiData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success(profileExists ? "Profile updated!" : "Profile created!")
      if (res.data.employeeProfile?.resumeUrl) {
        setResumeUrl(res.data.employeeProfile.resumeUrl)
      }
      setProfileExists(true)
    } catch (err) {
      console.error(err)
      toast.error("Failed to save profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-5xl py-8 mx-auto px-4 sm:px-6">
      <h1 className="text-2xl font-bold mb-6">{profileExists ? "Update Your Profile" : "Create Your Profile"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Personal Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Full Name"
                      {...register("name", { required: "Name is required" })}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email"
                      {...register("email", { required: "Email is required" })}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="text"
                      placeholder="Phone Number"
                      {...register("phone")}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Professional Links</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      id="linkedin"
                      type="text"
                      placeholder="https://linkedin.com/in/yourprofile"
                      {...register("linkedin")}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="github" className="block text-sm font-medium mb-1">
                      GitHub Profile
                    </label>
                    <input
                      id="github"
                      type="text"
                      placeholder="https://github.com/yourusername"
                      {...register("github")}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Skills, Education, Resume */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Skills & Education</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium mb-1">
                      Skills (comma separated)
                    </label>
                    <textarea
                      id="skills"
                      placeholder="JavaScript, React, Node.js, etc."
                      {...register("skills")}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="education" className="block text-sm font-medium mb-1">
                      Education
                    </label>
                    <textarea
                      id="education"
                      placeholder="Your education background..."
                      {...register("education")}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                    ></textarea>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Resume</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium mb-1">
                      Upload Resume (PDF)
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ease-in-out ${
                        selectedFile
                          ? "bg-green-50 border-green-300"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const files = e.dataTransfer.files
                        if (files.length > 0 && files[0].type === "application/pdf") {
                          setSelectedFile(files[0])
                          setValue("resume", files[0])
                        }
                      }}
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        {selectedFile ? (
                          <>
                            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                              <FileText className="h-7 w-7 text-green-600" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => {
                                setSelectedFile(null)
                                setValue("resume", null)
                                // Reset the file input
                                const fileInput = document.getElementById("resume") as HTMLInputElement
                                if (fileInput) fileInput.value = ""
                              }}
                            >
                              Remove File
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                              <FileText className="h-7 w-7 text-blue-600" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900">Drag and drop your resume here</p>
                              <p className="text-xs text-gray-500 mt-1">PDF (max. 5MB)</p>
                            </div>
                            <div className="mt-2">
                              <label htmlFor="resume" className="cursor-pointer">
                                <div className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                  Browse Files
                                </div>
                                <input
                                  id="resume"
                                  type="file"
                                  accept=".pdf"
                                  onChange={handleFileChange}
                                  className="sr-only"
                                />
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Display existing resume if available */}
                  {resumeUrl && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Current Resume</h3>
                        
                      </div>

                      <div className="border rounded-md overflow-hidden h-[300px]">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                          <Viewer fileUrl={resumeUrl} />
                        </Worker>
                      </div>
                    </div>
                  )}

                  {/* Show message if no resume */}
                  {!resumeUrl && !selectedFile && (
                    <div className="flex flex-col items-center justify-center h-[200px] border rounded-md bg-gray-50">
                      <FileText className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">No resume uploaded yet</p>
                      <p className="text-gray-400 text-sm">Upload a PDF file to showcase your experience</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : profileExists ? (
            "Update Profile"
          ) : (
            "Create Profile"
          )}
        </Button>
      </form>
    </div>
  )
}

export default EmployeeProfile
