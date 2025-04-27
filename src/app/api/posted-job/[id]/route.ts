import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prismaClient";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // 1️⃣ unwrap the params promise
  const { id } = await params;

  try {
    // 2️⃣ await your Prisma query
    const jobData = await prisma.jobPost.findUnique({
      where: { id },
    });

    // 3️⃣ handle “not found”
    if (!jobData) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // 4️⃣ return the record directly
    return NextResponse.json(jobData);
  } catch (error) {
    console.error("Error in GET /job-detail/[id]:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
