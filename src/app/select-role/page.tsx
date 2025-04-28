'use client'
import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React, {  useState } from 'react';
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Page() {
   
    const {update: updateSession} = useSession()
    const [role, setRole] = useState("employee");
    const router = useRouter();

   

    const handleContinue = async () => {
        try {
          // send the PATCH with axios
          const res = await axios.patch('/api/update-role', { role })
          if (res.status === 200) {
            signOut() // sign out the user

          } else {
            console.error('Update failed:', res.data)
          }
        } catch (err: any) {
          // axios wraps non-2xx responses as exceptions
          console.error('Error updating role:', err.response?.data || err.message)
        }
      }

    return (
        <div className="flex justify-center min-h-screen items-center bg-[#E8F5E9]">
            <Card className="w-96 p-6 bg-white shadow-xl rounded-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-[#263238]">
                        Select your role
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mt-3">
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
                </CardContent>
                <CardFooter>
                    <Button onClick={handleContinue} className="bg-[#388E3C]">
                        Continue
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}