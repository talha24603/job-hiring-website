
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import createDOMPurify from 'dompurify';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

interface JobUser {
  image?: string | null;
}

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
  user?: JobUser;
}

interface ShowPostedJobProps {
  job: JobPost | null;
}

export default function ApplyJob({ job }: ShowPostedJobProps) {
  const router = useRouter();
  const [sanitizedDetails, setSanitizedDetails] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleApplyJob = async (job: JobPost) => {
    try {
      const response = await axios.post('/api/apply-job', { jobId: job.id });
      toast.success(response.data.message || 'Application submitted successfully!');
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        toast.error('Please sign in to apply for jobs');
        router.push('/login');
        return;
      }
      const backendMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Error applying for job: ${backendMessage}`);
    }
  };

  useEffect(() => {
    if (job && typeof window !== 'undefined') {
      const DOMPurify = createDOMPurify(window);
      setSanitizedDetails(DOMPurify.sanitize(job.details));
    }
  }, [job]);

  if (!job) {
    return <div>Job not found</div>;
  }

  const imageSrc = job.user?.image ? job.user.image : '/default-image.png';

  return (
    <div className="max-w-4xl mt-10 mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-200 p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-300">
          <div className="flex items-center space-x-4">
            <img
              src={imageSrc}
              alt={`${job.company} logo`}
              className="w-16 h-16 object-cover rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-lg text-gray-700">{job.company}</p>
              <p className="text-gray-600">{job.location}</p>
            </div>
          </div>

          {/* Confirm-Apply Dialog */}
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setConfirmOpen(true)}
                className="mt-4 md:mt-0 py-2 px-6 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              >
                Apply Now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Application</DialogTitle>
                <DialogDescription>
                  Are you sure you want to apply for <strong>{job.title}</strong> at{' '}
                  <strong>{job.company}</strong>?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setConfirmOpen(false);
                    handleApplyJob(job);
                  }}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Salary and Job Type */}
        <div className="px-6 py-4 border-b">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-700 font-semibold text-xl">${job.salary}</div>
            <div>
              <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {job.jobType}
              </span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Details</h2>
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizedDetails }}
          />
        </div>

        {/* Additional Info */}
        <div className="px-6 py-4 border-t flex flex-wrap gap-4">
          <div>
            <strong className="text-gray-800">Category:</strong> {job.category}
          </div>
          <div>
            <strong className="text-gray-800">Experience:</strong> {job.experience}
          </div>
          <div>
            <strong className="text-gray-800">Posted on:</strong>{' '}
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

