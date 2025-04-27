// app/jobs/page.tsx

import SearchedJobs from '@/components/SearchedJobs';

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  createdAt: string;
  experience: string;
  jobType: string;
}

interface JobsPageProps {
  // searchParams is now a Promise
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  // 1️⃣ unwrap the promise
  const { search } = await searchParams;
  let weburl = process.env.NEXT_PUBLIC_APP_URL;

  // 2️⃣ normalize to a single string
  const q = (search ?? '').trim();
  // 3️⃣ fetch (or skip) based on query
  const jobs: Job[] = q
    ? await fetch(
        `${weburl}/api/search-jobs?q=${encodeURIComponent(q)}`,
        { cache: 'no-store' }
      ).then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.json() as Promise<Job[]>;
      })
    : [];

  return <SearchedJobs jobs={jobs} />;
}
