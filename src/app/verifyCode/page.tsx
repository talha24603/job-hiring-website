'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import codeVerificationHandler from "./codeVerificationHandler";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function VerifyCode() {
  const [code, setCode] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleVerify = async (e: any) => {
    e.preventDefault();

    // Check if searchParams is not null
    const email = searchParams?.get("email");
    if (!email) {
      toast.error("Email parameter is missing.");
      return;
    }

    console.log("Verification Code:", code);
    const response = await codeVerificationHandler(code, email);

    if (response?.success) {
      router.push("/");
    } else {
      toast.error("Code doesn't match");
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full flex justify-center items-center bg-gray-100">
        <div className="w-full flex justify-center">
          <Card className="w-96 p-6 bg-white shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Verify Your Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center">
                  Enter the 6-digit code sent to your email
                </p>
                <form onSubmit={handleVerify} className="space-y-4">
                  <Input
                    type="text"
                    name="code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="text-center tracking-widest text-xl"
                  />
                  <Button
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:opacity-90"
                    type="submit"
                  >
                    Verify
                  </Button>
                </form>
                <p className="text-sm text-gray-500 text-center">
                  Didn't receive the code? <span className="text-blue-500 cursor-pointer">Resend</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}