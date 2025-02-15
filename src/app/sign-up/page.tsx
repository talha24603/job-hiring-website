'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUser, FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import SignUpHandler from "./SignUpHandler";
import { useRouter } from "next/navigation";
import signInWithGoogle from "./signUpWithGoogle";
import Link from "next/link";


export default function RegisterCard() {
    const router = useRouter();
    const [passLevel1, setPasslevel1] = useState(false);
    const [passLevel2, setPasslevel2] = useState(false);
    const [passLevel3, setPasslevel3] = useState(false);

    const [role, setRole] = useState("employee");

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const level1Regex = /^.+$/;
        const level2Regex = /^(?=(.*\d))(?=(.*[a-zA-Z]))|(?=(.*\d))(?=(.*[\W_]))|(?=(.*[a-zA-Z]))(?=(.*[\W_]))/;
        const level3Regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).+$/;

        setPasslevel1(level1Regex.test(value));
        setPasslevel2(level2Regex.test(value));
        setPasslevel3(level3Regex.test(value));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const response = await SignUpHandler(formData);
        if (response?.alreadyIsAlready) {
            toast.error(response.alreadyIsAlready);
        } else if (response?.redirectUrl) {
            router.push(response.redirectUrl);
        }
    };

    return (
        <div className="flex justify-center min-h-screen items-center bg-[#E8F5E9]">
            <Card className="w-96 p-6 bg-white shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-[#388E3C]">Welcome!</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-3 text-[#388E3C]" />
                            <Input id="name" name="name" type="text" placeholder="Your name" className="pl-10 text-[#263238]" required />
                        </div>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-[#388E3C]" />
                            <Input id="email" name="email" type="email" placeholder="Your email" className="pl-10 text-[#263238]" required />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-[#388E3C]" />
                            <Input id="password" name="password" onChange={handlePasswordChange} type="password" placeholder="Create password" className="pl-10 text-[#263238]" required />
                        </div>
                        <p className="text-sm text-[#263238] mt-2">Password strength</p>
                        <div className="flex space-x-1 mt-1">
                            <div className={`w-6 h-1 ${passLevel1 ? "bg-[#FFEB3B]" : "bg-gray-300"}`}></div>
                            <div className={`w-6 h-1 ${passLevel2 ? "bg-[#FFEB3B]" : "bg-gray-300"}`}></div>
                            <div className={`w-6 h-1 ${passLevel3 ? "bg-[#FFEB3B]" : "bg-gray-300"}`}></div>
                        </div>

                        {/* Role Selection */}
                        <div className="mt-3">
                            <Label className="text-[#263238] text-sm">Select your role:</Label>
                            <div className="flex space-x-4 mt-1">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="employee"
                                        checked={role === "employee"}
                                        onChange={() => setRole("employee")}
                                        className="accent-[#FFEB3B]"
                                    />
                                    <span className="text-[#263238]">Employee</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="employer"
                                        checked={role === "employer"}
                                        onChange={() => setRole("employer")}
                                        className="accent-[#FFEB3B]"
                                    />
                                    <span className="text-[#263238]">Employer</span>
                                </label>
                            </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-[#388E3C] to-[#66BB6A] text-white hover:opacity-90 mt-4" type="submit">
                            Create account
                        </Button>
                    </form>

                   

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#263238]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-[#263238]">or</span>
                        </div>
                    </div>

                    <form action={signInWithGoogle}>
                        <Button variant={"outline"} type="submit" className="w-full flex items-center justify-center gap-2 border-[#388E3C] text-[#388E3C] hover:bg-[#E8F5E9]">
                            <FaGoogle className="text-[#388E3C]" /> Sign up with Google
                        </Button>

                    </form>
                </CardContent>
                <CardFooter className="flex justify-center items-center gap-2 mt-4 text-[#263238]">
    <span className="text-sm">if already have an account?</span>
    <Link href="/login" className="text-[#388E3C] font-semibold hover:underline hover:text-[#2E7D32] transition-all duration-200">
        Sign In
    </Link>
</CardFooter>
            </Card>
        </div>
    );
}
