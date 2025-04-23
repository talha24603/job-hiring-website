import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const jobId = params.id;
  const jobDetail = await prisma.jobPost.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      salary: true,
      company: true,
      jobType: true,
      experience: true,
      createdAt: true,
      details: true,
      user: { select: { image: true } },
    },
  });

  if (!jobDetail) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  return NextResponse.json(jobDetail);
}
