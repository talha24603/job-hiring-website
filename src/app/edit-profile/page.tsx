"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  skills: string;
  education: string;
  resume: File | null;
  linkedin: string;
  github: string;
}

const ProfileUpdate: React.FC = () => {
    const session = useSession()
    const user= session.data?.user;
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
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
  });

  // State to track selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file input separately
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setValue("resume", file);
  };

  // Submit Handler
  const onSubmit = async (data: FormData) => {
    try {
      // Build multipart/form-data
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("userId", user?.id as string);

      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("skills", data.skills);
      formData.append("education", data.education);
      formData.append("linkedin", data.linkedin);
      formData.append("github", data.github);

      // File upload (only resume in this version)
      if (data.resume) {
        console.log("File selected:", data.resume.name); // Debugging log
        formData.append("resume", data.resume);
      } else {
        console.warn("No file selected.");
      }

      // Send POST request
      const response = await axios.post("/api/employee-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Profile update failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 w-full bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Update Your Profile</h2>

      {/** Two-column layout **/}
      <div className="grid grid-cols-2 gap-4 w-full">
        {/** Left Column **/}
        <div className="bg-white p-4 rounded-lg w-full flex flex-col gap-2">
          <label className="font-bold">Full Name</label>
          <input
            type="text"
            placeholder="Full Name"
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <label className="font-bold">Email</label>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full border p-2"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <label className="font-bold">Phone</label>
          <input
            type="text"
            placeholder="Phone Number"
            {...register("phone")}
            className="w-full border p-2"
          />

          <label className="font-bold">Skills</label>
          <textarea
            placeholder="Add your skills..."
            {...register("skills")}
            className="w-full border p-2"
          ></textarea>

          <label className="font-bold">Social Links</label>
          <input
            type="text"
            placeholder="LinkedIn Profile"
            {...register("linkedin")}
            className="w-full border p-2"
          />
          <input
            type="text"
            placeholder="GitHub Profile"
            {...register("github")}
            className="w-full border p-2"
          />
        </div>

        {/** Right Column **/}
        <div className="bg-white p-4 rounded-lg w-full flex flex-col gap-2">
          <label className="font-bold">Education</label>
          <textarea
            placeholder="Your education background..."
            {...register("education")}
            className="w-full border p-2"
          ></textarea>

          <label className="font-bold">Resume/CV</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border p-2"
          />
          {selectedFile && <p className="text-green-600">File selected: {selectedFile.name}</p>}
        </div>
      </div>

      <button type="submit" className="mt-4 bg-green-600 text-white p-3 rounded-lg w-full">
        Update Profile
      </button>
    </form>
  );
};

export default ProfileUpdate;
