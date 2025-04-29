"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import debounce from "lodash.debounce"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, MapPin, Building, ArrowRight, Briefcase, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface JobPost {
  id: string
  title: string
  company: string
  location?: string
  jobType?: string
}

export default function HomePage() {

  const [suggestions, setSuggestions] = useState<JobPost[]>([])
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on page load
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches")
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to parse recent searches", e)
        }
      }
    }
  }, [])

  

  // Save recent searches to localStorage
  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return

    const updated = [
      search,
      ...recentSearches.filter((item) => item !== search), // Remove duplicates
    ].slice(0, 5) // Keep only 5 most recent

    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const fetchSuggestions = async (q: string) => {
    if (!q) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.get("/api/search-jobs", {
        params: { q },
      })
      setSuggestions(response.data)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedFetchSuggestions = debounce((q: string) => {
    fetchSuggestions(q)
  }, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value) {
      debouncedFetchSuggestions(value)
    } else {
      setSuggestions([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (!query.trim()) return

    saveRecentSearch(query)
    router.push(`/searchedjobs?search=${encodeURIComponent(query)}`)
  }

  const handleSuggestionClick = (job: JobPost) => {
    saveRecentSearch(job.title)
    router.push(`/apply-job/${job.id}`)
  }

  const handleRecentSearchClick = (search: string) => {
    setQuery(search)
    debouncedFetchSuggestions(search)
  }

  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Video Background */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="/video/video1.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
          {/* Black Overlay with Opacity */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <div className="text-center mb-8 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Find Your Dream Job Today</h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
              Search thousands of jobs from top companies and find the perfect match for your skills and experience.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="pl-12 pr-12 py-7 text-base bg-white text-gray-900 border-0 rounded-lg shadow-lg focus-visible:ring-green-500 focus-visible:ring-offset-0"
            />
            {query && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-4"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Search Results Container */}
        <div className="relative">
          {/* Loading State */}
          {isLoading && (
            <Card className="absolute z-10 w-full mt-2 shadow-lg border-gray-200 overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3 py-2">
                  <p className="text-sm text-gray-500 mb-2">Loading suggestions...</p>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          <AnimatePresence>
            {!isLoading && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-2"
              >
                <Card className="shadow-lg border-gray-200 overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Job Suggestions</h3>
                    <ul className="space-y-2 divide-y divide-gray-100">
                      {suggestions.map((job) => (
                        <motion.li
                          key={job.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="py-2"
                        >
                          <button
                            className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            onClick={() => handleSuggestionClick(job)}
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-md flex items-center justify-center text-green-700">
                              {job.company.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Building className="h-3 w-3 mr-1" />
                                <span className="truncate">{job.company}</span>
                                {job.location && (
                                  <>
                                    <span className="mx-1.5">•</span>
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span className="truncate">{job.location}</span>
                                  </>
                                )}
                                {job.jobType && (
                                  <>
                                    <span className="mx-1.5">•</span>
                                    <span className="truncate">{job.jobType}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 self-center flex-shrink-0" />
                          </button>
                        </motion.li>
                      ))}
                    </ul>

                    {/* View All Results Button */}
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        className="border-green-200 text-green-700 hover:bg-green-50 w-full"
                        onClick={handleSearch}
                      >
                        View All Results
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                Recent Searches
              </h2>
              <Button
                variant="ghost"
                className="text-xs text-gray-500 h-auto p-1"
                onClick={() => {
                  setRecentSearches([])
                  localStorage.removeItem("recentSearches")
                }}
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  <Search className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Categories */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-gray-600" />
            Popular Job Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Software Development", icon: <Briefcase className="h-5 w-5" />, count: 1240 },
              { name: "Marketing", icon: <Briefcase className="h-5 w-5" />, count: 842 },
              { name: "Design", icon: <Briefcase className="h-5 w-5" />, count: 675 },
              { name: "Customer Service", icon: <Briefcase className="h-5 w-5" />, count: 531 },
              { name: "Sales", icon: <Briefcase className="h-5 w-5" />, count: 489 },
              { name: "Finance", icon: <Briefcase className="h-5 w-5" />, count: 325 },
            ].map((category, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow cursor-pointer border-gray-200"
                onClick={() => {
                  setQuery(category.name)
                  debouncedFetchSuggestions(category.name)
                }}
              >
                <CardContent className="p-5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-green-100 rounded-lg text-green-700">{category.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.count} jobs</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Jobs Section */}
        <div className="mt-16">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer border-gray-200">
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {["Senior Frontend Developer", "Marketing Manager", "UX Designer", "Product Manager"][i - 1]}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {["TechCorp", "Marketing Pro", "DesignHub", "ProductLabs"][i - 1]}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">
                          {["Remote", "New York, NY", "San Francisco, CA", "Austin, TX"][i - 1]}
                        </span>
                        <span className="mx-1.5">•</span>
                        <span className="truncate">{["Full-time", "Contract", "Full-time", "Part-time"][i - 1]}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button className="bg-green-600 hover:bg-green-700">View All Jobs</Button>
          </div>
        </div>
      </div>
    </div>
  )
}




// import Link from "next/link"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ArrowRight, Search, Users, TrendingUp } from "lucide-react"
// import { auth } from "@/auth"





// const stats = [
//   { value: "10K+", label: "Job Listings" },
//   { value: "8K+", label: "Companies" },
//   { value: "15M+", label: "Job Seekers" },
//   { value: "90%", label: "Success Rate" },
// ]

// export default async function Home() {
//   const session = await auth()
//   const user = session?.user
//   console.log(user?.role)
//   return (
//     <>

//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-b from-white to-green-50 pt-24 pb-16 md:pt-32 md:pb-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row items-center">
//             <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0">
//               <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1">
//                 Your Career Journey Starts Here {user?.role}
//               </Badge>
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
//                 Find Your <span className="text-green-600">Dream Job</span> Today
//               </h1>
//               <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
//                 Connect with top employers, discover opportunities that match your skills, and take the next step in
//                 your career journey with confidence.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
//                   Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//                 <Button size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 px-8">
//                   For Employers
//                 </Button>
//               </div>
//             </div>
//             <div className="md:w-1/2 relative">
//               <div className="relative h-[400px] w-full">
//                 <Image
//                   src="/images/landing-hero.jpg"
//                   alt="Job seekers"
//                   fill
//                   className="object-contain"
//                   priority
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Stats Section */}
//           <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
//             {stats.map((stat, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform hover:scale-105"
//               >
//                 <p className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.value}</p>
//                 <p className="text-gray-600">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How CareerHub Works</h2>
//             <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//               Our platform makes it easy to find the perfect job match in just a few simple steps
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
//               <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
//                 <Search className="h-8 w-8 text-green-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3">Search Jobs</h3>
//               <p className="text-gray-600">
//                 Browse thousands of opportunities filtered by your skills, experience, and preferences.
//               </p>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
//               <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
//                 <Users className="h-8 w-8 text-green-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3">Connect</h3>
//               <p className="text-gray-600">
//                 Apply directly to positions and connect with hiring managers and recruiters.
//               </p>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
//               <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
//                 <TrendingUp className="h-8 w-8 text-green-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3">Grow</h3>
//               <p className="text-gray-600">
//                 Advance your career with personalized recommendations and professional development resources.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

      {/* Job Categories Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Job Categories</h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Discover opportunities across various tech specializations that match your skills and career goals
              </p>
            </div>
            <Link href="/categories" className="mt-4 md:mt-0">
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category, index) => {
              const slug = category.title.toLowerCase().replace(/ /g, "-")
              return (
                <Link key={index} href={`/job/${slug}`}>
                  <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(category.title)}`}
                        alt={`${category.title}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{category.title}</h3>
                    </div>
                    <div className="p-5 flex-grow">
                      <p className="text-gray-600 mb-4">{category.skills}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-sm text-green-600 font-medium">View Jobs</span>
                        <ArrowRight className="h-4 w-4 text-green-600 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/categories">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* For Employers Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <div className="relative h-[400px] w-full">
                <Image
                  src="/placeholder.svg?height=400&width=500&text=For+Employers"
                  alt="For Employers"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">For Employers</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Find the Perfect Talent for Your Team
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Post jobs, screen candidates, and build your dream team with our comprehensive hiring platform designed
                for modern businesses.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Access to a pool of qualified tech professionals",
                  "AI-powered candidate matching",
                  "Streamlined interview scheduling",
                  "Branded company profile",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/employer-signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Start Hiring <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from job seekers and employers who have found success with CareerHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Final CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Career Journey?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of professionals who have found their dream jobs through CareerHub. Your next opportunity is
            just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 px-8">
              Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700 px-8">
              For Employers
            </Button>
          </div>
        </div>
      </section> */}

//     </>
//   )
// }
