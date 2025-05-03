import { NextRequest, NextResponse } from "next/server";

import { createNotification } from "@/lib/create-notification";
import { auth } from "@/auth";
import prisma from "@/prismaClient";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // unwrap the params promise
  const { id: applicationId } = await params;

  try {
    const session = await auth();
    const user = session?.user;
    if (user?.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id as string;
    const { status } = await request.json();

    // Validate status
    const validStatuses = [
      "applied",
      "reviewing",
      "interview",
      "hired",
      "rejected",
    ];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Fetch application + jobPost + employeeProfile
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        jobPost: true,
        employeeProfile: {
          select: { id: true, userId: true, name: true },
        },
      },
    });
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Ensure this employer owns the job
    if (application.jobPost.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update the status
    const updatedApplication = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    // Build notification
    let notificationMessage = "";
    let notificationType: "INFO" | "ALERT" | "JOB" = "INFO";

    switch (status.toLowerCase()) {
      case "reviewing":
        notificationMessage = `Your application for "${application.jobPost.title}" is now being reviewed`;
        break;
      case "interview":
        notificationMessage = `Congratulations! You've been selected for an interview for "${application.jobPost.title}"`;
        notificationType = "JOB";
        break;
      case "hired":
        notificationMessage = `Congratulations! You've been hired for "${application.jobPost.title}"`;
        notificationType = "JOB";
        break;
      case "rejected":
        notificationMessage = `We're sorry, your application for "${application.jobPost.title}" was not selected`;
        break;
      default:
        notificationMessage = `Your application status for "${application.jobPost.title}" has been updated to ${status}`;
    }

    await createNotification({
      userId: application.employeeProfile.userId,
      message: notificationMessage,
      type: notificationType,
      jobPostId: application.jobPost.id,
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}
