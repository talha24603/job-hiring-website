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
import Image from "next/image"

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
  const searchContainerRef = useRef<HTMLDivElement>(null)

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

  // Close suggestions when clicking outside the search container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
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
          <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src="/video/video1.mp4" type="video/mp4" />
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

          {/* Search Bar Container - Make this relative for positioning suggestions */}
          <div className="relative w-full max-w-3xl mx-auto" ref={searchContainerRef}>
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

            {/* Search Results Container - Move this here from below */}
            <div className="relative">
              {/* Loading State */}
              {isLoading && (
                <Card className="absolute z-20 w-full mt-2 shadow-lg border-gray-200 overflow-hidden">
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
                    className="absolute z-20 w-full mt-2"
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            {/* <Briefcase className="h-5 w-5 text-gray-600" /> */}
            Popular Job Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                name: "Frontend Developer",
                icon: <Image width="40" height="40" src="/images/front.jpg" alt="ui" />,
                count: 1240,
              },
              {
                name: "Backend Developer",
                icon: <Image width="40" height="40" src="/images/back.png" alt="ui" />,
                count: 842,
              },
              {
                name: "UX/UI Designer",
                icon: <Image width="60" height="60" src="/images/ui.png" alt="ui" />,
                count: 675,
              },
              {
                name: "Mobile App Developer",
                icon: <Image width="40" height="40" src="/images/app.jpg" alt="ui" />,
                count: 531,
              },
              {
                name: "Game Developer",
                icon: <Image width="40" height="40" src="/images/game.png" alt="ui" />,
                count: 489,
              },
              {
                name: "AI/ML Engineer",
                icon: <Image width="40" height="40" src="/images/ai.jpg" alt="ui" />,
                count: 325,
              },
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
                    <div className="border rounded-full ">{category.icon}</div>
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

       
      </div>
    </div>
  )
}