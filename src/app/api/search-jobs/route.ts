// app/api/search-jobs/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  // Simple search criteria with limit, including user image data.
  const jobs = await prisma.jobPost.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        
        { company: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
        { jobType: { contains: query, mode: "insensitive" } },
        { experience: { contains: query, mode: "insensitive" } },
        { salary: { contains: query, mode: "insensitive" } },
        { category:  { contains: query, mode: "insensitive" } },
      ],
    },
    take: 10,
    select: {
      id: true,
      title: true,
      salary: true,
      company: true,
      jobType: true,
      experience: true,
      createdAt: true,
      user: {
        select: {
          image: true,
        },
      },
    },
  });
  

  return NextResponse.json(jobs);
}
