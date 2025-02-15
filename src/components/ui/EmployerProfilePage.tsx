'use client';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserImageChange from "@/components/userImageChange";
import { FaEdit, FaTrash } from "react-icons/fa";
import DeleteJobDialog from "../DeleteJobDialog";

interface JobPost {
  id: string;
  title: string;
  details: string;
  location: string;
  salary: string;
  company: string;
  jobType: string;
  category: string;
  experience: string;
  createdAt: Date;
}

interface EmployerProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
    isVerified: boolean;
    emailVerified?: null;
  };
  postedJobs: JobPost[];
}

export default function EmployerProfilePage({ user, postedJobs }: EmployerProfileProps) {
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState(postedJobs);
  const [deleteJobId, setDeleteJobId] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();

  return (
    <div className="max-w-4xl mt-8 mx-auto">
      {/* Profile Section */}
      <div className="h-96 flex flex-col items-center justify-center bg-[#f4fef4]">
        <UserImageChange open={open} setOpen={setOpen} userId={user.id} />
        <h1 className="text-3xl font-bold text-[#263238] mb-2">Profile</h1>
        <div
          onClick={() => setOpen(!open)}
          className="relative w-40 mb-2 h-40 rounded-full border-4 border-[#388E3C] flex items-center justify-center overflow-hidden shadow-lg cursor-pointer"
        >
          {user.image ? (
            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-lg">No Image</span>
            </div>
          )}
        </div>
        <div>
          <p className="font-thin text-xl">{user.name}</p>
          <p className="font-sans">Email: {user.email}</p>
        </div>
      </div>

      {/* Add Post Button */}
      <Link href={'/post-job'}>
        <button className="mt-6 px-6 py-2 bg-[#388E3C] text-white rounded-full shadow-md hover:bg-green-700 transition fixed bottom-10 right-10">
          Add Post
        </button>
      </Link>

      {/* Posted Jobs Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#263238]">Posted Jobs</h2>
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <Link href={`/posted-job/${job.id}`} key={job.id}>
                <Card className="relative shadow-md hover:shadow-lg transition">
                  {/* Edit Icon as a Button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); // Prevent outer link navigation
                      e.stopPropagation(); // Stop event bubbling
                      router.push(`/edit-job/${job.id}`);
                    }}
                    className="absolute top-2 right-10 h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <FaEdit />
                  </button>
                  {/* Delete Icon as a Button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteJobId(job.id);
                      setOpenDelete(true);
                    }}
                    className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mt-2">
                      Posted on: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No jobs posted yet.</p>
        )}
      </div>
      <DeleteJobDialog openDelete={openDelete} setOpenDelete={setOpenDelete} deleteJobId={deleteJobId} />
    </div>
  );
}
