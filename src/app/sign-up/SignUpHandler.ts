'use server'
import prisma from '@/prismaClient';
import { hash } from 'bcryptjs';

export default async function SignUpHandler(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  // … validation, duplicate-email check, OTP generation …
  const alreadyEmail = await prisma.user.findUnique({
    where: {
        email: formData.get("email") as string,
        },

})
if (alreadyEmail) {
    return {alreadyIsAlready:"Already has email"}
}
  const otp = Math.floor(Math.random() * 900000 + 100000).toString();
  const otpExpiry = new Date(Date.now() + 3600000);
  
  // 1️⃣ Call your resend route properly:
  const res = await fetch(
    new URL('/api/resend', process.env.NEXT_PUBLIC_APP_URL), // or use request.url if you have it
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, verifyCode: otp }),
    }
  );
  if (!res.ok) {
    // handle error…
    return { error: 'Failed to send verification email' };
  }

  // 2️⃣ Only create user after email sent
  const hashedPassword = await hash(password, 10);
  await prisma.user.create({
    data: {
      name: email,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: otpExpiry,
      role: formData.get('role') as string,
    },
  });

  return { redirectUrl: `verifyCode?email=${encodeURIComponent(email)}` };
}
