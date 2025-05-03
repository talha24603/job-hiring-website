// @/types/application.ts
export interface EmployeeProfile {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    skills?: string | null;
    education?: string | null;
    linkedin?: string | null;
    github?: string | null;
    profilePicUrl?: string | null;
    resumeUrl?: string | null;
    createdAt: Date;
    userId: string;
  }
  
  export interface JobPost {
    id: string;
    title: string;
    details: string;
    location: string;
    salary: string;
    company: string;
    jobType: string;
    category: string;
    experience: string;
    userId: string;
    createdAt: Date;
  }
  
  export interface Application {
    id: string;              // JobApplication id
    appliedAt: Date;
    jobPost: JobPost;
    status: string; // e.g., "applied", "interviewed", "hired", "rejected"
    employeeProfile: EmployeeProfile;
  }
  