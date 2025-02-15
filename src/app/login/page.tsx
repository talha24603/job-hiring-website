'use client' 
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import signInWithGoogle from "../sign-up/signUpWithGoogle";
import Link from "next/link";
import { toast } from "sonner";
import { Spin } from "antd"; // Import Ant Design Loader
import { LoadingOutlined } from "@ant-design/icons";


export default function SignIn() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true); // Show loader
        
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get('email');
        const password = formData.get('password');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        console.log("Sign in response:", result);

        if (!result?.ok) {
            setLoading(false); // Hide loader if sign-in fails
            toast.error("Invalid email or password");
        } else {
            toast.success("Login successful!");
            router.push("/");
            setTimeout(() => window.location.reload(), 500); // Ensure session updates
        }
    };

    return (
        <div className="flex justify-center min-h-screen items-center bg-[#E8F5E9]">
            <Card className="w-96 p-6 bg-white shadow-xl rounded-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-[#263238]">
                        Welcome Back!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-[#388E3C]" />
                            <Input id="email" name="email" type="email" placeholder="Your email" className="pl-10 border-[#388E3C]" required />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-[#388E3C]" />
                            <Input id="password" name="password" type="password" placeholder="Enter your password" className="pl-10 border-[#388E3C]" required />
                        </div>

                        {/* Sign In Button */}
                        <Button className="w-full bg-[#388E3C] text-white hover:bg-[#2E7D32] mt-4" type="submit" disabled={loading}>
                            {loading ?  <Spin indicator={<LoadingOutlined style={{ fontSize: 20, color: "white" }} />} /> : "Sign In"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-[#263238]">or</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <form action={signInWithGoogle}>
                        <Button variant={"outline"} type="submit" className="w-full flex items-center justify-center gap-2 border-[#388E3C] text-[#388E3C] hover:bg-[#E8F5E9]">
                            <FaGoogle className="text-[#388E3C]" /> Sign in with Google
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center items-center gap-2 mt-4 text-[#263238]">
                    <span className="text-sm">Don't have an account?</span>
                    <Link href="/sign-up" className="text-[#388E3C] font-semibold hover:underline hover:text-[#2E7D32] transition-all duration-200">
                        Sign Up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
