'use client'
import { useState } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 text-center px-6">
      <h1 className="text-5xl font-bold text-green-700 mb-4">Coming Soon</h1>
      <p className="text-lg text-gray-700 max-w-xl">
        We're working hard to bring this job category to you. Stay tuned for updates!
      </p>

      {/* Subscribe Form */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 w-64 border border-gray-300 rounded-lg focus:outline-none"
        />
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition">
          Notify Me
        </button>
      </div>

      {/* Back to Home */}
      <button
        onClick={() => window.location.href = "/"}
        className="mt-6 text-green-700 font-medium hover:underline"
      >
        ← Back to Home
      </button>
    </div>
  );
}
