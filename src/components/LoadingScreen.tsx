'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(); // Detects route changes

  useEffect(() => {
    setLoading(true); // Show loader when path changes
    const timer = setTimeout(() => setLoading(false), 500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [pathname]); // Runs every time pathname changes

  if (!loading) return null; // Hide when not loading

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="spinner border-4 border-t-4 border-green-700 h-12 w-12 rounded-full animate-spin"></div>
    </div>
  );
}
