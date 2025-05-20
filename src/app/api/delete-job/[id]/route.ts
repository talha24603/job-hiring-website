// src/app/api/delete-job/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prismaClient";  // or: import { PrismaClient } from "@prisma/client"; const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // 1) Unwrap the incoming params promise
  const { id } = await params;

  try {
    // 2) Verify the job exists
    const job = await prisma.jobPost.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // 3) Delete the job
    const deletedJob = await prisma.jobPost.delete({
      where: { id },
    });

    // 4) Return the deleted record
    return NextResponse.json(
      { success: true, data: deletedJob },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete job", details: err.message },
      { status: 500 }
    );
  }
}
