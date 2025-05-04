import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import axios from "axios";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  X,
  MapPin,
  Building,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { DialogTitle } from '@radix-ui/react-dialog';

interface JobUser {
  image?: string | null;
}

interface JobPost {
  id: string;
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  user?: JobUser;
}

interface SearchSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const popularCategories = [
  { value: "frontend-developer", name: "Frontend Developer", icon: <Briefcase className="h-4 w-4" /> },
  { value: "backend-developer", name: "Backend Developer", icon: <Briefcase className="h-4 w-4" /> },
  { value: "ai", name: "AI/ML Engineer", icon: <Briefcase className="h-4 w-4" /> },
  { value: "ux-ui-designer", name: "UX/UI Designer", icon: <Briefcase className="h-4 w-4" /> },
  { value: "mobile-app-developer", name: "Mobile App Developer", icon: <Briefcase className="h-4 w-4" /> },
  { value: "game", name: "Game Developer", icon: <Briefcase className="h-4 w-4" /> },
];

export default function SearchSheet({ open, setOpen }: SearchSheetProps) {
  const [suggestions, setSuggestions] = useState<JobPost[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when sheet opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        localStorage.removeItem("recentSearches");
      }
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = useCallback((search: string) => {
    if (!search.trim()) return;
    setRecentSearches((prev) => {
      const updated = [search, ...prev.filter((s) => s !== search)].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<JobPost[]>("/api/search-jobs", { params: { q } });
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced fetch
  const debouncedFetch = useMemo(
    () => debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value) debouncedFetch(value);
    else setSuggestions([]);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    saveRecentSearch(query);
    router.push(`/searchedjobs?search=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  const handleSuggestionClick = (job: JobPost) => {
    saveRecentSearch(job.title);
    router.push(`/apply-job/${job.id}`);
    setOpen(false);
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
    debouncedFetch(search);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild />
      <SheetContent side="top" className="p-0 border-b shadow-lg max-h-[80vh] overflow-hidden">
        {/* Accessible Title (visually hidden) */}
        <VisuallyHidden>
          <DialogTitle>Search Jobs</DialogTitle>
        </VisuallyHidden>

        {/* Search Header */}
        <div className="p-4 border-b">
          <div className="flex items-center max-w-3xl mx-auto w-full gap-3">
            <div className="flex-1 relative">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search jobs, companies, keywords..."
                value={query}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-10 py-6 text-base bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-green-500 focus-visible:ring-offset-0"
                aria-label="Search"
              />
              {query && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {isLoading && (
              <div className="space-y-3 py-2">
                <p className="text-sm text-gray-500">Loading...</p>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && query && suggestions.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-6 w-6 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No results for "{query}"</h3>
                <Button className="mt-4" onClick={() => router.push("/categories")}>

                  Browse Categories
                </Button>
              </div>
            )}

            {/* Recent & Categories */}
            {!query && (
              <>   
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-medium">Recent Searches</h3>
                      <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem('recentSearches'); setRecentSearches([]); }}>
                        Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((s, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={() => handleRecentClick(s)}>
                          <Search className="h-4 w-4 mr-1 text-gray-500" />{s}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="mb-3 font-medium">Popular Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {popularCategories.map((cat) => (
                      <Button key={cat.value} variant="outline" className="justify-start" onClick={() => handleRecentClick(cat.value)}>
                        {cat.icon}<span className="ml-2 truncate">{cat.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Suggestions List */}
            <AnimatePresence>
              {!isLoading && suggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <h3 className="mb-2 font-medium">Suggestions</h3>
                  <ul className="divide-y divide-gray-100">
                    {suggestions.map((job) => (
                      <motion.li key={job.id} className="py-2">
                        <button className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50" onClick={() => handleSuggestionClick(job)}>
                          <div className="w-10 h-10 rounded-md overflow-hidden">
 {job.user?.image ? (
                      <Image
                        src={job.user.image || "/placeholder.svg"}
                        alt={`${job.company} logo`}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-green-100 flex items-center justify-center text-green-700 font-bold">
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                    )}                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{job.title}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Building className="h-3 w-3 mr-1" /><span className="truncate">{job.company}</span>
                              {job.location && <><span className="mx-1">•</span><MapPin className="h-3 w-3 mr-1" /><span className="truncate">{job.location}</span></>}
                              {job.jobType && <><span className="mx-1">•</span><span className="truncate">{job.jobType}</span></>}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 self-center" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={handleSearch} className="w-full">
                      View All Results <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
