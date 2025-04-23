// src/app/api/job-applications/[id]/route.ts
import prisma from "@/prismaClient";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  const { email } = params;
  console.log('email',email);
  
  try {
    const applications = await prisma.candidateApplication.findMany({
      where: { email: email },
    });
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json(
      { error: "Error while fetching applications" },
      { status: 500 }
    );
  }
}
