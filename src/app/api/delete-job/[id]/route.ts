import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prismaClient'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // unwrap the params promise
  const { id } = await params

  try {
    const deletedJob = await prisma.jobPost.delete({
      where: { id },
    })
    return NextResponse.json({ success: true, data: deletedJob })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
