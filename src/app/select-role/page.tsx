'use client'

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { updateRole } from './updateRole';

export default function Page() {
   
    
    const [role, setRole] = useState("employee");
    const router = useRouter();

   

    const handleContinue = async () => {
        
    
          const response = await updateRole(role)
          if (response) {
            router.push('/')
          }
    };
    

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