import prisma from "@/prismaClient";

export async function POST(request: Request) {
    const { code, email } = await request.json();



    try {
        const Otp = await prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                otp: true,
                otpExpiresAt: true
            }
        })
        if (Otp?.otpExpiresAt === null) {
            return new Response('OTP has expired', {
                status: 400
            });
        } else {
            if (Otp?.otp === code) {
                return new Response("OTP is correct", {
                    status: 200
                });
            } else {
                return new Response("OTP is incorrect", {
                    status: 400
                });
            }
        }


    } catch (error) {
        return new Response("Error", {
            status: 500,
        })

    }
}