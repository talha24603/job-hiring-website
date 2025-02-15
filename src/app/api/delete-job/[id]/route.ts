'use server';

import { NextResponse } from 'next/server';
import prisma from '@/prismaClient';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedJob = await prisma.jobPost.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, data: deletedJob });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
