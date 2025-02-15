// app/jobs/[id]/JobPostForm.tsx

'use client';

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Rubik } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JoditEditor from "jodit-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const newsreader = Rubik({
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
  console.log("userId", userId);

  // Initialize state with any existing data (for editing) or with defaults for a new post
  const [jobTitle, setJobTitle] = useState(dataToEdit?.title || "");
  const [experience, setExperience] = useState(dataToEdit?.experience || "");
  const [salary, setSalary] = useState(dataToEdit?.salary || "");
  const [category, setCategory] = useState(dataToEdit?.category || "");
  const [jobType, setJobType] = useState(dataToEdit?.jobType || "full-time");
  const [address, setAddress] = useState(dataToEdit?.location || "");
  const [companyName, setCompanyName] = useState(dataToEdit?.company || "");
  const [details, setDetails] = useState(dataToEdit?.details || "");

  const router = useRouter();

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter detailed job requirements...",
      height: 250,
    }),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = dataToEdit?.id
    console.log("id",id);
    
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
    console.log("jobData", jobData);

    try {
      const response = await fetch("/api/job-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      if (response.ok) {
        router.push("/employer-profile");
      } else {
        console.error("Failed to create job");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#E8F5E9] flex items-center justify-center p-8">
      <div className="max-w-5xl w-full bg-[#E8F5E9] text-[#263238] p-8">
        <h2
          className={`text-2xl ${newsreader.className} font-bold text-center text-[#000000] mb-6`}
        >
         {dataToEdit?("Update the Job"):(" Post a Job")}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Left Side: Input Fields */}
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              className="border border-[#3c8e3c] text-black focus:outline-none"
            />
            <Input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="border border-[#3c8e3c] text-black focus:outline-none"
            />
            <Input
              type="text"
              placeholder="Experience Required (e.g. 2 years)"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
              className="border border-[#3c8e3c] text-black focus:outline-none"
            />
            <Input
              type="text"
              placeholder="Salary (e.g. $5000/month)"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
              className="border border-[#3c8e3c] text-black focus:outline-none"
            />
            {/* Job Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full border border-[#3c8e3c] text-black focus:outline-none">
                <SelectValue placeholder="Select Job Role" />
              </SelectTrigger>
              <SelectContent>
                
                <SelectItem value="frontend">Frontend Developer</SelectItem>
                <SelectItem value="backend">Backend Developer</SelectItem>
                <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                <SelectItem value="mobile">Mobile App Developer</SelectItem>
                <SelectItem value="devops">DevOps Engineer</SelectItem>
                <SelectItem value="software">Software Engineer</SelectItem>
                <SelectItem value="game">Game Developer</SelectItem>
                <SelectItem value="ai">AI/ML Engineer</SelectItem>
                <SelectItem value="cybersecurity">Cybersecurity Engineer</SelectItem>
                <SelectItem value="data">Data Engineer</SelectItem>
                <SelectItem value="database">Database Administrator</SelectItem>
                <SelectItem value="cloud">Cloud Engineer</SelectItem>
              </SelectContent>
            </Select>
            {/* Job Type */}
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-full border border-[#3c8e3c] text-black focus:outline-none">
                <SelectValue placeholder="Select Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-Time</SelectItem>
                <SelectItem value="part-time">Part-Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Job Location (Address)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="border border-[#3c8e3c] text-black focus:outline-none"
            />
          </div>

          {/* Right Side: Rich Text Editor */}
          <div className="border border-[#3c8e3c] bg-white p-4 rounded-md text-black">
            <h3 className="font-semibold mb-2">Job Details</h3>
            <JoditEditor
              value={details}
              config={editorConfig}
              onBlur={(newContent) => setDetails(newContent)}
            />
          </div>

          {/* Full Width Submit Button */}
          <div className="col-span-2">
            <Button
              type="submit"
              className="w-full font-sans hover:bg-[#8ece91] bg-[#29942f] text-[#263238] border-[#3c8e3c]"
            >
              Submit Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
