"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";  

interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
}

const JobSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<JobPost[]>([]);
  const router = useRouter();

  // Function to fetch job suggestions from your search API
  const fetchSuggestions = async (q: string) => {
    if (!q) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get("/api/search-jobs", {
        params: { q },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Create a debounced version of fetchSuggestions to reduce API calls on each keystroke.
  const debouncedFetchSuggestions = debounce((q: string) => {
    fetchSuggestions(q);
  }, 300);

  // Called on every input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchSuggestions(value);
  };

  // Called when the form is submitted (i.e., search button click)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to a search results page with the query as a parameter.
    router.push(`/jobs?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={query}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2 block w-full">
          Search
        </button>
      </form>
      
      {/* Suggestion List */}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full mt-1 max-h-60 overflow-auto z-10">
          {suggestions.map((job) => (
            <li
              key={job.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              // Optionally, add a click handler to directly navigate or fill the input
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              {job.title} - {job.company}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobSearch;
