"use client";
import React from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";

interface JobPost {
  id: string;
  title: string;
  details: string; // Contains HTML markup
  location: string;
  salary: string;
  company: string;
  jobType: string;
  category: string;
  experience: string;
  createdAt: Date | string;
}

// Create a separate props interface
interface ShowPostedJobProps {
  job: JobPost | null;
}

export default function ShowPostedJob({ job }: ShowPostedJobProps) {
  const router = useRouter();

  if (!job) {
    return <div>Job not found</div>;
  }

  // Sanitize the HTML to remove any malicious scripts
  const sanitizedDetails = DOMPurify.sanitize(job.details);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:underline"
      >
        &larr; Back to Listings
      </button>

      {/* Job Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-lg text-gray-700 mt-1">{job.company}</p>
          <p className="text-gray-500">{job.location}</p>
        </div>

        {/* Salary & Job Type */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <span className="text-2xl font-semibold text-green-600">{job.salary}</span>
          </div>
          <div className="mt-2 md:mt-0">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {job.jobType}
            </span>
          </div>
        </div>

        {/* Job Details (HTML) */}
        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Details</h2>
          {/* Render sanitized HTML here */}
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizedDetails }} />
        </div>

        {/* Additional Info */}
        <div className="border-t pt-6 mt-6 flex flex-wrap gap-6">
          <div>
            <strong className="text-gray-800">Category:</strong> {job.category}
          </div>
          <div>
            <strong className="text-gray-800">Experience:</strong> {job.experience}
          </div>
          <div>
            <strong className="text-gray-800">Posted on:</strong>{" "}
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* View Applications Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push(`/job-applications/${job.id}`)}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            View Applications
          </button>
        </div>
      </div>
    </div>
  );
}
