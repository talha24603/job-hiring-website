"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import signInWithGoogle from "../sign-up/signUpWithGoogle"
import Link from "next/link"
import { toast } from "sonner"
import Forget_password from "@/components/forget_password/Forget_password"
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function SignIn() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [openForgetPassword, setOpenForgetPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      console.log("Sign in response:", result)

      if (!result?.ok) {
        toast.error("Invalid email or password")
      } else {
        toast.success("Login successful!")
        router.push("/")
        setTimeout(() => window.location.reload(), 500) // Ensure session updates
      }
    } catch (error) {
      toast.error("An error occurred during sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-b from-white to-green-50">
      <Forget_password open={openForgetPassword} setOpen={setOpenForgetPassword} />

      <div className="w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="w-full overflow-hidden border-0 shadow-xl">
            {/* Green accent bar at the top */}
            <div className="h-2 bg-gradient-to-r from-green-600 to-green-400" />

            <CardHeader className="space-y-2 pt-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-800">Welcome Back</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
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
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setOpenForgetPassword(true)}
                      className="text-xs font-medium text-green-600 hover:text-green-800 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Sign In Button */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 h-11 transition-all duration-200 shadow-sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
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

              {/* Google Sign In */}
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
                  Google
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center pb-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/sign-up" className="font-medium text-green-600 hover:text-green-800 transition-colors">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        <p className="text-center text-xs text-gray-500 mt-8">
          Protected by reCAPTCHA and subject to our Privacy Policy and Terms of Service
        </p>
      </div>
    </div>
  )
}
