'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface JobPost {
  id: string;
  title: string;
  salary: string;
  company: string;
  jobType: string;
  experience: string;
  createdAt: Date | string;
}

interface ShowPostedJobProps {
  jobs: JobPost[] | null;
}

export default function Jobs({ jobs }: ShowPostedJobProps) {
  const router = useRouter();

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No jobs posted yet.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Link href={`/apply-job/${job.id}`} key={job.id}>
            <Card className="cursor-pointer hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {job.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{job.company}</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>{job.jobType}</span>
                  <span>{job.salary}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Experience: {job.experience}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
