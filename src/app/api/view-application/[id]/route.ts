// File: src/app/api/employee/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // 1) Unwrap the params promise
  const { id } = await params

  try {
    // 2) Await your Prisma query
    const profile = await prisma.employeeProfile.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        skills: true,
        education: true,
        linkedin: true,
        github: true,
        profilePicUrl: true,
        resumeUrl: true,
        createdAt: true,
      },
    })

    // 3) Handle not-found
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // 4) Return the result
    return NextResponse.json(profile)
  } catch (err) {
    console.error('Error fetching employee profile:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
