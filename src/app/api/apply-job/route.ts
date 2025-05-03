import { auth } from "@/auth";
import prisma from "@/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/create-notification";

export async function POST(request: NextRequest) {
  const { jobId } = await request.json();
  const session = await auth();
  const user = session?.user;
  const userId = user?.id;
  const role = user?.role;

  if (!userId) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }
  if (role !== 'employee') {
    return NextResponse.json({ message: "You are not an employee" }, { status: 400 });
  }
  
  // Fetch the complete employee profile
  const profile = await prisma.employeeProfile.findFirst({
    where: { userId: userId }
  });

  if (!profile) {
    return NextResponse.json({ message: 'Profile not found' });
  }

  // Define the fields that must be non-empty. Adjust this list based on your business rules.
  const requiredFields: { field: keyof typeof profile; label: string }[] = [
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'phone', label: 'Phone' },
    { field: 'skills', label: 'Skills' },
    { field: 'education', label: 'Education' },
    { field: 'resumeUrl', label: 'Resume URL' },
  ];

  // Check if any required field is empty (null, undefined, or an empty string)
  const incompleteFields = requiredFields.filter(({ field }) => {
    const value = profile[field];
    return (value === null || value === undefined || value === '');
  });

  if (incompleteFields.length > 0) {
    // Build a message listing which fields are incomplete
    const incompleteLabels = incompleteFields.map(f => f.label).join(", ");
    return NextResponse.json(
      { message: `Please complete your profile. The following fields are missing: ${incompleteLabels}` },
      { status: 400 }
    );
  }

  try {
    // Fetch the job details to get the employer ID and job title
    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
      include: { user: true }
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // Create the application
    const application = await prisma.jobApplication.create({
      data: {
        jobPost: { connect: { id: jobId } },
        employeeProfile: { connect: { id: profile.id } }
      }
    });
    
    // Create notification for the employer
    await createNotification({
      userId: job.userId,
      message: `New application received from ${profile.name} for "${job.title}"`,
      type: "JOB",
      jobPostId: jobId,
    });

    // Create notification for the applicant
    await createNotification({
      userId: userId,
      message: `Your application for "${job.title}" has been submitted successfully`,
      type: "INFO",
      jobPostId: jobId,
    });

    console.log(application);
    return NextResponse.json({ message: "Application submitted successfully", application }, { status: 200 });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json({ message: "Error submitting application", error }, { status: 500 });
  }
}