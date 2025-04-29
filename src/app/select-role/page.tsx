"use client"

import type React from "react"

import { signOut } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, User, CheckCircle } from "lucide-react"

export default function Page() {
  const [role, setRole] = useState("employee")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleContinue = async () => {
    try {
      setIsLoading(true)
      // send the PATCH with axios
      const res = await axios.patch("/api/update-role", { role })
      if (res.status === 200) {
        signOut() // sign out the user
      } else {
        console.error("Update failed:", res.data)
      }
    } catch (err: any) {
      // axios wraps non-2xx responses as exceptions
      console.error("Error updating role:", err.response?.data || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-b from-green-50 to-green-100">
      <Card className="w-[450px] p-6 bg-white shadow-xl rounded-xl border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Choose Your Path</CardTitle>
          <p className="text-center text-gray-500 mt-1">Select the role that best describes you</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <RoleOption
              title="Job Seeker"
              description="Looking for job opportunities"
              icon={<User size={24} />}
              isSelected={role === "employee"}
              onClick={() => setRole("employee")}
            />

            <RoleOption
              title="Employer"
              description="Hiring talent for your company"
              icon={<Briefcase size={24} />}
              isSelected={role === "employer"}
              onClick={() => setRole("employer")}
            />
          </div>
        </CardContent>
        <CardFooter className="pt-6 flex flex-col gap-3">
          <Button
            onClick={handleContinue}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">You'll be signed out after selecting your role</p>
        </CardFooter>
      </Card>
    </div>
  )
}

interface RoleOptionProps {
  title: string
  description: string
  icon: React.ReactNode
  isSelected: boolean
  onClick: () => void
}

function RoleOption({ title, description, icon, isSelected, onClick }: RoleOptionProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg p-4 transition-all duration-200 ${
        isSelected
          ? "bg-green-50 border-2 border-green-500"
          : "bg-gray-50 border-2 border-gray-100 hover:border-gray-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${isSelected ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {isSelected && <CheckCircle className="text-green-500 h-6 w-6" />}
      </div>
    </motion.div>
  )
}
