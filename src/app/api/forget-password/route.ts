// app/api/forget-password/route.ts (for Next.js App Router)
// or pages/api/forget-password.ts for Pages Router

import prisma from '@/prismaClient';
import { POST as emailPost } from '../resend/route';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }
    const googleUser = await prisma.user.findUnique({
        where: {
            email: email,
            provider: 'google'
        }
    })
    if (googleUser) {
        return new Response(JSON.stringify({ error: "you are signed up with google." }), { status: 500 });

    }
    // Generate OTP and expiry
    const otp = Math.floor(Math.random() * 900000 + 100000).toString();
    const otpExpiry = new Date(Date.now() + 3600000);

    console.log(`Sending OTP ${otp} to ${email}`);

    // Send the email via Resend
    const sendEmail = await emailPost(email, otp);
    console.log("Resend response:", sendEmail);
    
    if (sendEmail) {
      try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { provider: true },
          });
          if (user && user.provider === 'google') {
            return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 400 });

          }
      } catch (updateError) {
        console.error("Error updating user with OTP:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update OTP" }), { status: 500 });
      }
      return new Response(JSON.stringify({ success: true, data: sendEmail }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
    }
  } catch (error: any) {
    console.error("Error in forgot password endpoint:", error);
    return new Response(JSON.stringify({ error: error.message || error }), { status: 500 });
  }
}
