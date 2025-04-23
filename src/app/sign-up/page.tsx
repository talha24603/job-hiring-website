"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import SignUpHandler from "./SignUpHandler"
import { useRouter } from "next/navigation"
import signInWithGoogle from "./signUpWithGoogle"
import Link from "next/link"
import { motion } from "framer-motion"
import { User, Mail, Lock, ArrowRight } from "lucide-react"

export default function RegisterCard() {
  const router = useRouter()
  const [passLevel1, setPasslevel1] = useState(false)
  const [passLevel2, setPasslevel2] = useState(false)
  const [passLevel3, setPasslevel3] = useState(false)
  const [role, setRole] = useState("employee")
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)

    const level1Regex = /^.{6,}$/
    const level2Regex = /^(?=(.*\d))(?=(.*[a-zA-Z]))|(?=(.*\d))(?=(.*[\W_]))|(?=(.*[a-zA-Z]))(?=(.*[\W_]))/
    const level3Regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).+$/

    setPasslevel1(level1Regex.test(value))
    setPasslevel2(level2Regex.test(value))
    setPasslevel3(level3Regex.test(value))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(event.target as HTMLFormElement)
      const response = await SignUpHandler(formData)

      if (response?.alreadyIsAlready) {
        toast.error(response.alreadyIsAlready)
      } else if (response?.redirectUrl) {
        toast.success("Account created successfully!")
        router.push(response.redirectUrl)
      }
    } catch (error) {
      toast.error("An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    if (passLevel3) return "Strong"
    if (passLevel2) return "Medium"
    if (passLevel1) return "Weak"
    return "Too weak"
  }

  const getPasswordColor = () => {
    if (passLevel3) return "bg-green-500"
    if (passLevel2) return "bg-yellow-500"
    if (passLevel1) return "bg-orange-500"
    return "bg-gray-300"
  }

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-b from-white to-green-50">
      <div className="w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="w-full overflow-hidden border-0 shadow-xl">
            {/* Green accent bar at the top */}
            <div className="h-2 bg-gradient-to-r from-green-600 to-green-400" />

            <CardHeader className="space-y-2 pt-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-800">Create an Account</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Join us to find your perfect job or hire great talent
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name Input */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-all"
                      required
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Password strength:</span>
                      <span
                        className={`text-xs font-medium ${
                          passLevel3
                            ? "text-green-600"
                            : passLevel2
                              ? "text-yellow-600"
                              : passLevel1
                                ? "text-orange-600"
                                : "text-gray-500"
                        }`}
                      >
                        {getPasswordStrength()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordColor()} transition-all duration-300 ease-in-out`}
                        style={{
                          width: passLevel3 ? "100%" : passLevel2 ? "66%" : passLevel1 ? "33%" : "0%",
                        }}
                      ></div>
                    </div>

                    {/* Password Requirements */}
                    <ul className="space-y-1 mt-2">
                      <li className="flex items-center gap-1.5 text-xs">
                        <div className={`w-3 h-3 rounded-full ${passLevel1 ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <span className={passLevel1 ? "text-gray-700" : "text-gray-500"}>At least 6 characters</span>
                      </li>
                      <li className="flex items-center gap-1.5 text-xs">
                        <div className={`w-3 h-3 rounded-full ${passLevel2 ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <span className={passLevel2 ? "text-gray-700" : "text-gray-500"}>
                          Mix of letters, numbers, or symbols
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5 text-xs">
                        <div className={`w-3 h-3 rounded-full ${passLevel3 ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <span className={passLevel3 ? "text-gray-700" : "text-gray-500"}>
                          Contains letters, numbers, and symbols
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">I am a:</Label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        role === "employee" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setRole("employee")}
                    >
                      <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                        {role === "employee" && <div className="h-2.5 w-2.5 rounded-full bg-green-500" />}
                      </div>
                      <input
                        type="radio"
                        name="role"
                        value="employee"
                        checked={role === "employee"}
                        onChange={() => setRole("employee")}
                        className="sr-only"
                      />
                      <div>
                        <p className="text-sm font-medium">Job Seeker</p>
                        <p className="text-xs text-gray-500">Looking for opportunities</p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        role === "employer" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setRole("employer")}
                    >
                      <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                        {role === "employer" && <div className="h-2.5 w-2.5 rounded-full bg-green-500" />}
                      </div>
                      <input
                        type="radio"
                        name="role"
                        value="employer"
                        checked={role === "employer"}
                        onChange={() => setRole("employer")}
                        className="sr-only"
                      />
                      <div>
                        <p className="text-sm font-medium">Employer</p>
                        <p className="text-xs text-gray-500">Hiring talent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create Account Button */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 h-11 transition-all duration-200 shadow-sm mt-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <form action={signInWithGoogle}>
                <Button
                  variant="outline"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium h-11 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center pb-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-green-600 hover:text-green-800 transition-colors">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        <p className="text-center text-xs text-gray-500 mt-8">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
