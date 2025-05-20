"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowRight, Send } from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Here you would typically call your API to handle the subscription
    toast.success("Thank you for subscribing to our newsletter!")
    setEmail("")
  }

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 ">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-white">CareerHub</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting talented professionals with top employers worldwide. Find your dream job and advance your
              career with us.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="#"
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-300"
              >
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-300"
              >
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-300"
              >
                <Linkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-300"
              >
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Find Jobs", href: "/jobs" },
                { name: "Post a Job", href: "/post-job" },
                { name: "About Us", href: "/about-us" },
                { name: "Contact", href: "/contact-us" },
                { name: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight
                      size={14}
                      className="mr-2 text-green-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <Link href="mailto:info@careerhub.com" className="text-gray-400 hover:text-green-400 flex items-center">
                  <Mail size={16} className="mr-3 text-green-500" />
                  <span>info@careerhub.com</span>
                </Link>
              </li>
              <li>
                <Link href="tel:+1234567890" className="text-gray-400 hover:text-green-400 flex items-center">
                  <Phone size={16} className="mr-3 text-green-500" />
                  <span>+1 (234) 567-890</span>
                </Link>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-3 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">1234 Career Street, Employment District, Jobville, JB 56789</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-gray-400">
              Subscribe to our newsletter for the latest job opportunities and career tips.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 space-y-2">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white focus:ring-green-500 focus:border-green-500 rounded-r-none"
                  required
                />
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-l-none px-4">
                  <Send size={16} />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </form>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} CareerHub. All rights reserved.</div>

          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
