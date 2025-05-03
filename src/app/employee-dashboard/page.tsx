// 'use client'  // you don’t need client here if this is an async server component
import { auth } from "@/auth";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import prisma from "@/prismaClient";
import { Application } from "@/types/application";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/");

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
    isVerified: session.user.isVerified ?? false,
  };

  // Initialize once
  let applications: Application[] = [];

  try {
    const rawApplications = await prisma.jobApplication.findMany({
      where: { employeeProfile: { userId: user.id } },
      include: {
        jobPost: true,
        employeeProfile: true,
      },
    });

    // Map into your Application type—and include status
    applications = rawApplications.map(app => ({
      id: app.id,
      appliedAt: app.appliedAt,
      status: app.status,               // ← include the missing field
      jobPost: app.jobPost,
      employeeProfile: app.employeeProfile,
    }));
  } catch (error) {
    console.error("Error fetching applications:", error);
  }

  return (
    <div>
      <EmployeeDashboard user={user} applications={applications} />
    </div>
  );
}
