import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prismaClient";

export async function PATCH(
  request: NextRequest
): Promise<NextResponse> {
  try {
    // 1) Get the session
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2) Extract the new role from the request body
    const { role } = (await request.json()) as { role: string };

    // 3) Update the user in the database
    await prisma.user.update({
      where: { email: session.user.email },
      data: { role },
    });

    // 4) Return success
    return NextResponse.json(
      { message: "Role updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
