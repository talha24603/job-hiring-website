
'use client'

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import debounce from "lodash.debounce"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, MapPin, Building, ArrowRight, Briefcase } from "lucide-react"

interface JobPost {
  id: string
  title: string
  company: string
  location?: string
  jobType?: string
}

interface SearchSheetProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SearchSheet({ open, setOpen }: SearchSheetProps) {
  const [suggestions, setSuggestions] = useState<JobPost[]>([])
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when sheet opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

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
    setOpen(false)
  }

  const handleSuggestionClick = (job: JobPost) => {
    saveRecentSearch(job.title)
    router.push(`/apply-job/${job.id}`)
    setOpen(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild />
      <SheetContent side="top" className="p-0 border-b border-gray-200 shadow-lg max-h-[80vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 max-w-3xl mx-auto w-full">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for jobs, companies, or keywords..."
                  value={query}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-10 py-6 text-base bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-green-500 focus-visible:ring-offset-0"
                />
                {query && (
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-3xl mx-auto">
              {/* Loading State */}
              {isLoading && (
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
              )}

              {/* No Results */}
              {!isLoading && query && suggestions.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No results found</h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any jobs matching "{query}". Try different keywords or browse categories.
                  </p>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => router.push("/categories")}
                  >
                    Browse Categories
                  </Button>
                </div>
              )}

              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
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
              {!query && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { name: "Software Development", icon: <Briefcase className="h-4 w-4" /> },
                      { name: "Marketing", icon: <Briefcase className="h-4 w-4" /> },
                      { name: "Design", icon: <Briefcase className="h-4 w-4" /> },
                      { name: "Customer Service", icon: <Briefcase className="h-4 w-4" /> },
                      { name: "Sales", icon: <Briefcase className="h-4 w-4" /> },
                      { name: "Finance", icon: <Briefcase className="h-4 w-4" /> },
                    ].map((category, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100"
                        onClick={() => {
                          setQuery(category.name)
                          debouncedFetchSuggestions(category.name)
                        }}
                      >
                        {category.icon}
                        <span className="ml-2 truncate">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              <AnimatePresence>
                {!isLoading && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
