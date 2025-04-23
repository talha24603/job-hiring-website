//'use client'
import { auth } from '@/auth';
import EmployeeProfilePage from '@/components/employeeProfile';
import prisma from '@/prismaClient';
import { Application } from '@/types/application';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function page() {
    const session = await auth();
    let applications:Application[] = [];
    //  const [applications, setApplications] = useState<Application[]>([]);
    const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || // e.g. https://your-deployment.com
    "http://localhost:3000";

    // const user = session?.user 
    if(!session){
        redirect('/');
    }
    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        isVerified: session.user.isVerified ?? false,
        //emailVerified?: session.user.emailVerified ?? null,
      };
      const { email } = session.user;

      if (user) {
        
        try {
          const rawApplications = await prisma.jobApplication.findMany({
            where: {
              employeeProfile: { userId: user.id },
            },
            include: {
              jobPost: true,
              employeeProfile: true,
            },
          });
          
          // Map the raw data into your Application type
          const applications: Application[] = rawApplications.map(app => ({
          
            appliedAt: app.appliedAt,
            id: app.id,
            jobPost: app.jobPost,
            employeeProfile: {
              ...app.employeeProfile,
            },
          }));
          } catch (error) {
            console.error("Error fetching applications:", error);
          }
        }
     
  return (
    <div>
      <EmployeeProfilePage user={user} applications={applications}/>
    </div>
  )
}
