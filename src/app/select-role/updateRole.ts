import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/prismaClient';

export async function POST(req: Request) {
  const { role } = await req.json();
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { email: token.email },
      data: { role },
    });
    return NextResponse.json({ message: "OK", user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
