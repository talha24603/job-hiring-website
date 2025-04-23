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
  Bell,
  Menu,
  X,
  Briefcase,
  Building,
  Code,
  Brush,
  ChevronDown,
  Home,
  TagIcon as PriceTag,
  Info,
  LogOut,
  User,
  CreditCard,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import SearchSheet from "../searchSheet"
import { motion, AnimatePresence } from "framer-motion"

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
      name: "Technology",
      href: "/category/technology",
      icon: <Code className="h-4 w-4 mr-2" />,
      description: "Software development, IT, and tech roles",
    },
    {
      name: "Business",
      href: "/category/business",
      icon: <Building className="h-4 w-4 mr-2" />,
      description: "Management, finance, and administrative positions",
    },
    {
      name: "Creative",
      href: "/category/creative",
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
        scrolled ? "bg-white shadow-md py-2" : "bg-white py-4",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                CareerHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        "data-[active]:bg-green-50 data-[active]:text-green-700",
                      )}
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group text-sm font-medium hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <li key={category.name}>
                          <Link href={category.href} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700",
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
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        "data-[active]:bg-green-50 data-[active]:text-green-700",
                      )}
                    >
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        "data-[active]:bg-green-50 data-[active]:text-green-700",
                      )}
                    >
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side: Search, Notifications, Profile */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => setOpen(!open)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-green-700 hover:bg-green-50 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            )}

            {/* If user is not logged in, show Sign In */}
            {!user && (
              <div className="hidden md:flex gap-3">
                <Link href="/login">
                  <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* User Avatar Dropdown (only if logged in) */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-green-100">
                      <AvatarImage src={user.image || "/images/profile-image.webp"} alt="User Profile" />
                      <AvatarFallback className="bg-green-100 text-green-700">
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
                      href={user.role === "employee" ? "/employee-profile" : "/employer-profile"}
                      className="flex w-full"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/billing" className="flex w-full">
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/team" className="flex w-full">
                      Team
                    </Link>
                  </DropdownMenuItem>
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
                  className="md:hidden text-gray-600 hover:text-green-700 hover:bg-green-50"
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
            <Briefcase className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              CareerHub
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
            <Avatar className="h-10 w-10 border-2 border-green-100">
              <AvatarImage src={user.image || "/images/profile-image.webp"} alt="User Profile" />
              <AvatarFallback className="bg-green-100 text-green-700">
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            onClick={onClose}
          >
            <Home className="h-5 w-5 text-gray-500" />
            <span>Home</span>
          </Link>

          {/* Categories with dropdown */}
          <div>
            <button
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
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
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
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
            href="/pricing"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            onClick={onClose}
          >
            <PriceTag className="h-5 w-5 text-gray-500" />
            <span>Pricing</span>
          </Link>

          <Link
            href="/about"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            onClick={onClose}
          >
            <Info className="h-5 w-5 text-gray-500" />
            <span>About</span>
          </Link>
        </nav>

        {/* User Account Links (if logged in) */}
        {user && (
          <>
            <Separator className="my-4" />
            <div className="px-2 space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
              <Link
                href={user.role === "employee" ? "/employee-profile" : "/employer-profile"}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                onClick={onClose}
              >
                <User className="h-5 w-5 text-gray-500" />
                <span>Profile</span>
              </Link>
              <Link
                href="/billing"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                onClick={onClose}
              >
                <CreditCard className="h-5 w-5 text-gray-500" />
                <span>Billing</span>
              </Link>
              <Link
                href="/team"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                onClick={onClose}
              >
                <Users className="h-5 w-5 text-gray-500" />
                <span>Team</span>
              </Link>
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
              <Button variant="outline" className="w-full border-green-600 text-green-700">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" onClick={onClose}>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
