"use client";

import dynamic from "next/dynamic";
import type React from "react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Rubik } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Clock,
  Award,
  Save,
  FileText,
} from "lucide-react";
import axios from "axios";

// Dynamically import the JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const rubik = Rubik({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

interface JobPostFormProps {
  dataToEdit?: {
    id?: string;
    title?: string;
    jobType?: string;
    location?: string;
    category?: string;
    experience?: string;
    salary?: string;
    details?: string;
    company?: string;
  };
}

export default function JobPostForm({ dataToEdit }: JobPostFormProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize state with any existing data (for editing) or with defaults for a new post
  const [jobTitle, setJobTitle] = useState(dataToEdit?.title || "");
  const [experience, setExperience] = useState(dataToEdit?.experience || "");
  const [salary, setSalary] = useState(dataToEdit?.salary || "");
  const [category, setCategory] = useState(dataToEdit?.category || "");
  const [jobType, setJobType] = useState(dataToEdit?.jobType || "full-time");
  const [address, setAddress] = useState(dataToEdit?.location || "");
  const [companyName, setCompanyName] = useState(dataToEdit?.company || "");
  const [details, setDetails] = useState(dataToEdit?.details || "");
  const [activeTab, setActiveTab] = useState("basic");

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter detailed job requirements...",
      height: 350,
      toolbarButtonSize: "small" as "small",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "paragraph",
        "fontsize",
        "link",
        "|",
        "undo",
        "redo",
      ],
    }),
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const id = dataToEdit?.id;

    const jobData = {
      id,
      userId,
      jobTitle,
      experience,
      salary,
      category,
      jobType,
      address,
      details,
      companyName,
    };
    console.log("jobData:", jobData);

    try {
      const response = await axios.post("/api/job-post", jobData);


      if (response.status === 200) {
        toast.success(dataToEdit ? "Job updated successfully!" : "Job posted successfully!");
        router.push("/employer-dashboard");
      } else {
        toast.error(response.data?.message || "Failed to save job posting");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobCategories = [
    { value: "frontend-developer", label: "Frontend Developer" },
    { value: "backend-developer", label: "Backend Developer" },
    { value: "full-stack-developer", label: "Full Stack Developer" },
    { value: "mobile-app-developer", label: "Mobile App Developer" },
    { value: "devops-engineer", label: "DevOps Engineer" },
    { value: "software", label: "Software Engineer" },
    { value: "game", label: "Game Developer" },
    { value: "ai", label: "AI/ML Engineer" },
    { value: "cybersecurity", label: "Cybersecurity Engineer" },
    { value: "data", label: "Data Engineer" },
    { value: "database", label: "Database Administrator" },
    { value: "cloud", label: "Cloud Engineer" },
    { value: "ux-ui-designer", label: "UX/UI Designer" },
    { value: "other", label: "Other" },
  ];

  const jobTypes = [
    { value: "full-time", label: "Full-Time" },
    { value: "part-time", label: "Part-Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-green-50 py-12 px-4">
      <Card className="max-w-5xl mx-auto shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardTitle className={`text-2xl ${rubik.className} font-bold`}>
            {dataToEdit ? "Update Job Posting" : "Create New Job Posting"}
          </CardTitle>
          <CardDescription className="text-green-100">
            {dataToEdit
              ? "Update the details of your job posting"
              : "Fill in the details to post a new job opportunity"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Basic Information
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Job Description
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-gray-700">
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="jobTitle"
                        type="text"
                        placeholder="e.g. Senior Frontend Developer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-700">
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="e.g. Acme Corporation"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Job Location */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700">
                      Job Location <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="address"
                        type="text"
                        placeholder="e.g. New York, NY or Remote"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-gray-700">
                      Salary <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="salary"
                        type="text"
                        placeholder="e.g. $80,000 - $100,000/year"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-gray-700">
                      Experience Required <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="experience"
                        type="text"
                        placeholder="e.g. 2+ years"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Job Type */}
                  <div className="space-y-2">
                    <Label htmlFor="jobType" className="text-gray-700">
                      Job Type <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Select value={jobType} onValueChange={setJobType} required>
                        <SelectTrigger
                          id="jobType"
                          className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        >
                          <SelectValue placeholder="Select Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Job Category */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="category" className="text-gray-700">
                      Job Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger
                        id="category"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      >
                        <SelectValue placeholder="Select Job Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Next: Job Description
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="details" className="text-gray-700">
                      Job Description & Requirements <span className="text-red-500">*</span>
                    </Label>
                    <div className="border rounded-md border-gray-300 overflow-hidden">
                      <JoditEditor
                        value={details}
                        config={editorConfig}
                        onBlur={(newContent) => setDetails(newContent)}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Provide a detailed description of the job, including responsibilities, requirements, benefits, and application process.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("basic")}
                    className="border-gray-300"
                  >
                    Back to Basic Info
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {dataToEdit ? "Updating..." : "Posting..."}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {dataToEdit ? "Update Job" : "Post Job"}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
