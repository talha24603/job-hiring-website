import prisma from "@/prismaClient";
import { hash } from "bcryptjs";

export async function POST(req:Request) {
    const {email, password} = await req.json();
    const hashedPassword = await hash(password, 10);
    try {
        await prisma.user.update({
            where: {
                email: email
                },
                data: {
                    password: hashedPassword
                }
            
                    });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Error updating password" }), {
                status: 500,
                }
        )
    }
    return new Response(
        JSON.stringify({ message: "Password updated successfully" }), {
            status: 200,
            }
            )
}