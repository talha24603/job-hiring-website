// src/app/api/delete-job/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prismaClient'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    // Verify the job exists first
    const job = await prisma.jobPost.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const deletedJob = await prisma.jobPost.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, data: deletedJob },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete job', details: error.message },
      { status: 500 }
    );
  }
}