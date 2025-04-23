import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Application {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    identityCardUrl: string;
    resumeUrl: string;
    jobPostId: string;
  }
export default function ShowApplications({applications}:{applications:Application[]}) {
  return (
    <div>
       <div className="flex flex-col gap-1 h-screen">
      {applications.map((application) => (
        <Card key={application.id} className="m-4 w-2/4 bg-gray-100">
          <CardHeader>
            <CardTitle>{application.name}</CardTitle>
            <CardDescription>{application.email}</CardDescription>
          </CardHeader>
          
          <CardContent>
          

          
          </CardContent>

          <CardFooter>
            <p>Applied on: {new Date(application.createdAt).toLocaleDateString()}</p>
          </CardFooter>
        </Card>
      ))}
      </div>
    </div>
  )
}
