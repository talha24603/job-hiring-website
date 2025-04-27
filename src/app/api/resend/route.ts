// src/app/api/resend/route.ts

import { NextRequest, NextResponse } from "next/server";
import verificationEmail from "../../../components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    // 1) Parse email & code from the request body
    const { email, verifyCode } = (await request.json()) as {
      email: string;
      verifyCode: string;
    };

    // 2) Send via Resend SDK
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Your Verification Code",
      react: verificationEmail({ otp: verifyCode }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    // 3) Return the send result
    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error in POST /api/resend:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
