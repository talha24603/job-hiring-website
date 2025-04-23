// src/app/api/job-applications/[id]/route.ts
import prisma from "@/prismaClient";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const applications = await prisma.candidateApplication.findMany({
      where: { jobPostId: id },
    });
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json(
      { error: "Error while fetching applications" },
      { status: 500 }
    );
  }
}
