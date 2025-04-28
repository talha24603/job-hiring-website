// app/api/update-role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";            // NextAuth export
import prisma from "@/prismaClient";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  try {
    // ← pass `request` here
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = (await request.json()) as { role: string };

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { role },
    });
    console.log("Role updated in DB:", updatedUser);

    return NextResponse.json(
      { message: "Role updated successfully", user: updatedUser },
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
