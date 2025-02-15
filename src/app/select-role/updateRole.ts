'use server';
import { auth } from "@/auth"; // NextAuth setup
import prisma from "@/prismaClient";

export async function updateRole(role: string) {
  try {
    console.log("Attempting to update role to:", role);
    const session = await auth(); // Get session
    console.log("Session:", session);

    if (!session || !session.user?.email) {
      return { error: "Unauthorized", status: 401 };
    }

    const email = session.user.email;
    
    // Update the user's role and log the updated user
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role },
    });
    console.log("Updated user:", updatedUser);

    return { message: "Role updated successfully", status: 200 };
  } catch (error) {
    console.error("Error updating role:", error);
    return { error: "Internal Server Error", status: 500 };
  }
}
