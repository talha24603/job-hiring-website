"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Menu,
  X,
  Briefcase,
  Building,
  Code,
  Brush,
  ChevronDown,
  Home,
  Info,
  LogOut,
  User,
  CreditCard,
  Users,
  Globe,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import SearchSheet from "../searchSheet"
import { motion, AnimatePresence } from "framer-motion"
import NotificationBell from "../notifications/NotificationBell"

export default function NavbarComponent({ user }: { user?: any }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close sidebar when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setSidebarOpen(false)
    }

    window.addEventListener("popstate", handleRouteChange)
    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  const categories = [
    {
      name: "Frontend Developer",
      href: "/job/frontend-developer",
      icon: <Code className="h-4 w-4 mr-2" />,
      description: "Software development, IT, and tech roles",
    },
    {
      name: "Full Stack Developer",
      href: "/job/full-stack-developer",
      icon: <Building className="h-4 w-4 mr-2" />,
      description: "Management, finance, and administrative positions",
    },
    {
      name: "AI/ML Engineer",
      href: "/job/ai",
      icon: <Brush className="h-4 w-4 mr-2" />,
      description: "Design, content creation, and marketing roles",
    },
    {
      name: "All Categories",
      href: "/categories",
      icon: <Briefcase className="h-4 w-4 mr-2" />,
      description: "Browse all job categories",
    },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white shadow-sm py-2" : "bg-white py-3",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {/* <div className="relative h-8 w-8">
                <Briefcase className="h-8 w-8 text-[#1dbf73]" />
              </div> */}
              <span className="text-2xl font-bold text-[#404145]">
                Career<span className="text-[#1dbf73]">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 ml-16">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group text-sm font-medium text-[#404145] hover:text-[#1dbf73]">
                    CareerHub Pro
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.slice(0, 3).map((category) => (
                        <li key={category.name}>
                          <Link href={category.href} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#f5f5f5] hover:text-[#1dbf73]",
                              )}
                            >
                              <div className="flex items-center">
                                {category.icon}
                                <div className="text-sm font-medium leading-none">{category.name}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-500">{category.description}</p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group text-sm font-medium text-[#404145] hover:text-[#1dbf73]">
                    Explore
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <li key={category.name}>
                          <Link href={category.href} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#f5f5f5] hover:text-[#1dbf73]",
                              )}
                            >
                              <div className="flex items-center">
                                {category.icon}
                                <div className="text-sm font-medium leading-none">{category.name}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-500">{category.description}</p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side: Search, Language, Become a Seller, Sign In, Join */}
          <div className="flex items-center gap-2 md:gap-5">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-[#404145] hover:text-[#1dbf73] hover:bg-transparent"
              onClick={() => setOpen(!open)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Link href="/contact" className="hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#404145] hover:text-[#1dbf73] hover:bg-transparent hidden md:flex items-center"
              >
                <span className="ml-1 text-sm font-medium">Contact</span>
              </Button>
            </Link>
            <Link href="/about" className="hidden md:block">
              <Button
                variant="ghost"
                className="text-[#404145] hover:text-[#1dbf73] hover:bg-transparent text-sm font-medium"
              >
                About
              </Button>
            </Link>

            {/* Notification Bell (only if logged in) */}
            {user && <NotificationBell />}

            {/* If user is not logged in, show Sign In */}
            {!user && (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-[#404145] hover:text-[#1dbf73] hover:bg-transparent text-sm font-medium"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    variant="outline"
                    className="border-[#1dbf73] text-[#1dbf73] hover:bg-transparent hover:text-[#1dbf73] font-medium"
                  >
                    Join
                  </Button>
                </Link>
              </div>
            )}

            {/* User Avatar Dropdown (only if logged in) */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-[#1dbf73]">
                      <AvatarImage src={user.image } alt="User Profile" />
                      <AvatarFallback className="bg-[#e4f9f0] text-[#1dbf73]">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || ""}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href={user.role === "employee" ? "/employee-dashboard" : "/employer-dashboard"}
                      className="flex w-full"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/notifications" className="flex w-full">
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <Link href="/" className="flex w-full">
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/" className="flex w-full">
                      Team
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() => signOut()}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu button - Now opens the sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-[#404145] hover:text-[#1dbf73] hover:bg-transparent"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                <MobileSidebar
                  user={user}
                  categories={categories}
                  mobileCategoriesOpen={mobileCategoriesOpen}
                  setMobileCategoriesOpen={setMobileCategoriesOpen}
                  onClose={() => setSidebarOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <SearchSheet open={open} setOpen={setOpen} />
    </nav>
  )
}

// Mobile Sidebar Component
function MobileSidebar({
  user,
  categories,
  mobileCategoriesOpen,
  setMobileCategoriesOpen,
  onClose,
}: {
  user?: any
  categories: any[]
  mobileCategoriesOpen: boolean
  setMobileCategoriesOpen: (open: boolean) => void
  onClose: () => void
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Briefcase className="h-6 w-6 text-[#1dbf73]" />
            <span className="text-xl font-bold text-[#404145]">
              Career<span className="text-[#1dbf73]">Hub</span>
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* User Profile Section (if logged in) */}
      {user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-[#e4f9f0]">
              <AvatarImage src={user.image } alt="User Profile" />
              <AvatarFallback className="bg-[#e4f9f0] text-[#1dbf73]">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{user.name || "User"}</p>
              <p className="text-sm text-gray-500 truncate">{user.email || ""}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="px-2 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#404145] hover:bg-[#f5f5f5] hover:text-[#1dbf73] transition-colors"
            onClick={onClose}
          >
            <Home className="h-5 w-5 text-gray-500" />
            <span>Home</span>
          </Link>

          {/* Categories with dropdown */}
          <div>
            <button
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md text-[#404145] hover:bg-[#f5f5f5] hover:text-[#1dbf73] transition-colors"
              onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <span>Categories</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  mobileCategoriesOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {mobileCategoriesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-10 pr-2 py-1 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-[#f5f5f5] hover:text-[#1dbf73] transition-colors"
                        onClick={onClose}
                      >
                        {category.icon}
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/about"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#404145] hover:bg-[#f5f5f5] hover:text-[#1dbf73] transition-colors"
            onClick={onClose}
          >
            <Info className="h-5 w-5 text-gray-500" />
            <span>About</span>
          </Link>

          <Link
            href="/contact"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#404145] hover:bg-[#f5f5f5] hover:text-[#1dbf73] transition-colors"
            onClick={onClose}
          >
            <Globe className="h-5 w-5 text-gray-500" />
            <span>Contact</span>
          </Link>

          {user && (
            <Link
              href="/notifications"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#404145] hover:bg-[#f5f5f5] hover:text-[#1dbf73] transition-colors"
              onClick={onClose}
            >
              <Bell className="h-5 w-5 text-gray-500" />
              <span>Notifications</span>
            </Link>
          )}
        </nav>

        {/* User Account Links (if logged in) */}
        {user && (
          <>
            <Separator className="my-4" />
            <div className="px-2 space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
              <Link
                href={user.role === "employee" ? "/employee-dashboard" : "/employer-dashboard"}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#404145] hover:bg-[#f5f5f5] hover:text-[#1dbf73] transition-colors"
                onClick={onClose}
              >
                <User className="h-5 w-5 text-gray-500" />
                <span>Dasboard</span>
              </Link>
              {/* <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#404145] hover:bg-[#f5f5f5] hover:text-[#1dbf73] transition-colors"
                onClick={onClose}
              >
                <CreditCard className="h-5 w-5 text-gray-500" />
                <span>Billing</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#404145] hover:bg-[#f5f5f5] hover:text-[#1dbf73] transition-colors"
                onClick={onClose}
              >
                <Users className="h-5 w-5 text-gray-500" />
                <span>Team</span>
              </Link> */}
            </div>
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="border-t p-4">
        {user ? (
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              signOut()
              onClose()
            }}
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </Button>
        ) : (
          <div className="space-y-2">
            <Link href="/login" onClick={onClose}>
              <Button variant="outline" className="w-full border-[#1dbf73] text-[#1dbf73]">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" onClick={onClose}>
              <Button className="w-full bg-[#1dbf73] hover:bg-[#19a463] text-white">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
