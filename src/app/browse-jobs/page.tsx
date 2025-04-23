"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MapPin,
  Building,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  X,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Award,
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import Link from "next/link"

interface JobPost {
  id: string
  title: string
  company: string
  location: string
  salary: string
  jobType: string
  category: string
  experience: string
  details: string
  createdAt: Date
  user?: {
    name?: string
    image?: string
  }
}

interface FilterOption {
  name: string
  count: number
}

interface BrowseJobsPageProps {
  jobs: JobPost[]
  totalPages: number
  currentPage: number
  categories: FilterOption[]
  jobTypes: FilterOption[]
  locations: FilterOption[]
  searchParams: {
    search: string
    category: string
    jobType: string
    location: string
  }
}

export default function BrowseJobsPage({
  jobs,
  totalPages,
  currentPage,
  categories,
  jobTypes,
  locations,
  searchParams,
}: BrowseJobsPageProps) {
  const router = useRouter()
  const queryParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.search || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || "")
  const [selectedJobType, setSelectedJobType] = useState(searchParams.jobType || "")
  const [selectedLocation, setSelectedLocation] = useState(searchParams.location || "")
  const [salaryRange, setSalaryRange] = useState([0, 200000])
  const [activeView, setActiveView] = useState<"grid" | "list">("list")
  const [isFiltersMobileOpen, setIsFiltersMobileOpen] = useState(false)

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedJobType) params.set("jobType", selectedJobType)
    if (selectedLocation) params.set("location", selectedLocation)

    router.push(`/browse-jobs?${params.toString()}`)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(queryParams?.toString())
    params.set("page", page.toString())
    router.push(`/browse-jobs?${params.toString()}`)

  // Handle filter reset
  const resetFilters = () => {
    setSearch("")
    setSelectedCategory("")
    setSelectedJobType("")
    setSelectedLocation("")
    setSalaryRange([0, 200000])
    router.push("/browse-jobs")
  }


  // Format date
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  // Format salary
  const formatSalary = (salary: string) => {
    if (!salary) return "Competitive"
    return salary
  }

  // Get category label
  const getCategoryLabel = (categoryValue: string) => {
    const categoryMap: { [key: string]: string } = {
      "frontend-developer": "Frontend Developer",
      "backend-developer": "Backend Developer",
      "full-stack-developer": "Full Stack Developer",
      "mobile-app-developer": "Mobile App Developer",
      "devops-engineer": "DevOps Engineer",
      software: "Software Engineer",
      game: "Game Developer",
      ai: "AI/ML Engineer",
      cybersecurity: "Cybersecurity Engineer",
      data: "Data Engineer",
      database: "Database Administrator",
      cloud: "Cloud Engineer",
    }

    return categoryMap[categoryValue] || categoryValue
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-gray-600">Find your perfect role from {jobs.length}+ job opportunities</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Job title, company, or keywords"
                className="pl-10 bg-gray-50 border-gray-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative md:w-1/4">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Location"
                className="pl-10 bg-gray-50 border-gray-200"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Search Jobs
            </Button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-1/4 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Filters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Reset
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Categories */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.name}`}
                          checked={selectedCategory === category.name}
                          onCheckedChange={() => {
                            setSelectedCategory(selectedCategory === category.name ? "" : category.name)
                          }}
                        />
                        <label
                          htmlFor={`category-${category.name}`}
                          className="text-sm text-gray-700 flex-grow cursor-pointer"
                        >
                          {getCategoryLabel(category.name)}
                        </label>
                        <span className="text-xs text-gray-500">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Job Types */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <div key={type.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type.name}`}
                          checked={selectedJobType === type.name}
                          onCheckedChange={() => {
                            setSelectedJobType(selectedJobType === type.name ? "" : type.name)
                          }}
                        />
                        <label htmlFor={`type-${type.name}`} className="text-sm text-gray-700 flex-grow cursor-pointer">
                          {type.name}
                        </label>
                        <span className="text-xs text-gray-500">{type.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Locations */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Popular Locations</h3>
                  <div className="space-y-2">
                    {locations.map((loc) => (
                      <div key={loc.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`location-${loc.name}`}
                          checked={selectedLocation === loc.name}
                          onCheckedChange={() => {
                            setSelectedLocation(selectedLocation === loc.name ? "" : loc.name)
                          }}
                        />
                        <label
                          htmlFor={`location-${loc.name}`}
                          className="text-sm text-gray-700 flex-grow cursor-pointer"
                        >
                          {loc.name}
                        </label>
                        <span className="text-xs text-gray-500">{loc.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Salary Range */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm">Salary Range</h3>
                    <span className="text-xs text-gray-500">
                      ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 200000]}
                    max={200000}
                    step={10000}
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    className="mb-6"
                  />
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleSearch()}>
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Filters Button */}
          <div className="lg:hidden mb-4">
            <Sheet open={isFiltersMobileOpen} onOpenChange={setIsFiltersMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow down your job search with filters</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-120px)] py-4">
                  <div className="space-y-5 px-1">
                    {/* Categories */}
                    <div>
                      <h3 className="font-medium text-sm mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-category-${category.name}`}
                              checked={selectedCategory === category.name}
                              onCheckedChange={() => {
                                setSelectedCategory(selectedCategory === category.name ? "" : category.name)
                              }}
                            />
                            <label
                              htmlFor={`mobile-category-${category.name}`}
                              className="text-sm text-gray-700 flex-grow cursor-pointer"
                            >
                              {getCategoryLabel(category.name)}
                            </label>
                            <span className="text-xs text-gray-500">{category.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Job Types */}
                    <div>
                      <h3 className="font-medium text-sm mb-3">Job Type</h3>
                      <div className="space-y-2">
                        {jobTypes.map((type) => (
                          <div key={type.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-type-${type.name}`}
                              checked={selectedJobType === type.name}
                              onCheckedChange={() => {
                                setSelectedJobType(selectedJobType === type.name ? "" : type.name)
                              }}
                            />
                            <label
                              htmlFor={`mobile-type-${type.name}`}
                              className="text-sm text-gray-700 flex-grow cursor-pointer"
                            >
                              {type.name}
                            </label>
                            <span className="text-xs text-gray-500">{type.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Locations */}
                    <div>
                      <h3 className="font-medium text-sm mb-3">Popular Locations</h3>
                      <div className="space-y-2">
                        {locations.map((loc) => (
                          <div key={loc.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-location-${loc.name}`}
                              checked={selectedLocation === loc.name}
                              onCheckedChange={() => {
                                setSelectedLocation(selectedLocation === loc.name ? "" : loc.name)
                              }}
                            />
                            <label
                              htmlFor={`mobile-location-${loc.name}`}
                              className="text-sm text-gray-700 flex-grow cursor-pointer"
                            >
                              {loc.name}
                            </label>
                            <span className="text-xs text-gray-500">{loc.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Salary Range */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-sm">Salary Range</h3>
                        <span className="text-xs text-gray-500">
                          ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[0, 200000]}
                        max={200000}
                        step={10000}
                        value={salaryRange}
                        onValueChange={setSalaryRange}
                        className="mb-6"
                      />
                    </div>
                  </div>
                </ScrollArea>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      resetFilters()
                      setIsFiltersMobileOpen(false)
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleSearch()
                      setIsFiltersMobileOpen(false)
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Jobs List */}
          <div className="flex-1">
            {/* Active Filters */}
            {(selectedCategory || selectedJobType || selectedLocation || search) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {search && (
                  <Badge variant="secondary" className="bg-gray-100 gap-1 pl-2 pr-1 py-1.5">
                    <span>Search: {search}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-gray-200"
                      onClick={() => {
                        setSearch("")
                        handleSearch()
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="bg-gray-100 gap-1 pl-2 pr-1 py-1.5">
                    <span>Category: {getCategoryLabel(selectedCategory)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-gray-200"
                      onClick={() => {
                        setSelectedCategory("")
                        handleSearch()
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedJobType && (
                  <Badge variant="secondary" className="bg-gray-100 gap-1 pl-2 pr-1 py-1.5">
                    <span>Job Type: {selectedJobType}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-gray-200"
                      onClick={() => {
                        setSelectedJobType("")
                        handleSearch()
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedLocation && (
                  <Badge variant="secondary" className="bg-gray-100 gap-1 pl-2 pr-1 py-1.5">
                    <span>Location: {selectedLocation}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-gray-200"
                      onClick={() => {
                        setSelectedLocation("")
                        handleSearch()
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={resetFilters}
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* View Toggle */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{jobs.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <Tabs defaultValue="list" onValueChange={(value) => setActiveView(value as "grid" | "list")}>
                  <TabsList className="grid w-[160px] grid-cols-2">
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Jobs Grid/List */}
            {jobs.length > 0 ? (
              <div className={activeView === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                {jobs.map((job, index) => (
                  <JobCard key={job.id} job={job} index={index} view={activeView} />
                ))}
              </div>
            ) : (
              <Card className="bg-white p-8 text-center">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gray-100 p-3 mb-4">
                    <Briefcase className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any jobs matching your search criteria. Try adjusting your filters or check back
                    later.
                  </p>
                  <Button onClick={resetFilters}>Clear Filters</Button>
                </div>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => handlePageChange(page)}
                          className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {page}
                        </Button>
                      )
                    }

                    // Show ellipsis for skipped pages
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      )
                    }

                    return null
                  })}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
}

interface JobCardProps {
  job: JobPost
  index: number
  view: "grid" | "list"
}

function JobCard({ job, index, view }: JobCardProps) {
  // Format date
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/apply-job/${job.id}`}>
        <Card
          className={`bg-white shadow hover:shadow-md transition cursor-pointer border-l-4 border-l-green-500 hover:bg-gray-50 ${
            view === "list" ? "flex flex-col md:flex-row" : ""
          }`}
        >
          <div className={view === "list" ? "md:w-3/4" : ""}>
            <CardHeader className={`pb-2 ${view === "list" ? "md:pb-4" : ""}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-green-100 flex items-center justify-center text-green-700">
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Building className="h-3.5 w-3.5" />
                    {job.company}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className={`pb-2 ${view === "list" ? "md:pb-4" : ""}`}>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {job.jobType}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {job.experience}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {job.salary}
                </Badge>
              </div>
            </CardContent>
          </div>
          <CardFooter
            className={`flex justify-between items-center pt-0 ${view === "list" ? "md:w-1/4 md:justify-end md:pr-6" : ""}`}
          >
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(job.createdAt)}
            </p>
            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0">
              View Job <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
