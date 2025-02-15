'use server'
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Ensure you import auth from your NextAuth setup
import prisma from "@/prismaClient";

export async function updateRole(role:any) {
    try {
        const session = await auth(); // Get session
        console.log('session',session);
        
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = session.user.email; // Get email from session

        await prisma.user.update({
            where: { email },
            data: { role },
        });

        return NextResponse.json({ message: "Role updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating role:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
