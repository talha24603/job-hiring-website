// app/jobs/page.tsx

import SearchedJobs from '@/components/SearchedJobs';
import axios from 'axios';

interface JobsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  // Access the query directly from searchParams
  const searchQuery = (searchParams.search as string) || "";

  let searchedjobs = null;
  try {
    const response = await axios.get("http://localhost:3000/api/search-jobs", {
      params: { q: searchQuery },
    });
    searchedjobs = response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }

  return (
    <>
      <SearchedJobs jobs={searchedjobs} />
    </>
  );
}
