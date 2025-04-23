'use client'
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <div className=" min-h-screen bg-gray-100 text-gray-900">

        {/* Hero Banner */}
        <section className="relative w-full h-[500px] flex items-center justify-center text-center text-white">
          <div className="absolute inset-0 bg-black/50"></div>
          <Image 
            src="/images/landing-hero.jpg" 
            alt="Welcome Banner" 
            layout="fill" 
            objectFit="cover"
            className="absolute inset-0"
          />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-bold drop-shadow-lg">Welcome to CareerConnect</h1>
            <p className="text-lg mt-4 drop-shadow-md">
              The ultimate platform for software developers to find jobs, build profiles, and grow their careers.
            </p>
            <Link href="/sign-up">
              <button className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105">
                Get Started
              </button>
            </Link>
          </div>
        </section>

        {/* Features Banners */}
        <section className="grid grid-cols-1 md-grid-cols-2 gap-6 px-8 py-16">
          {[
            { src: "/images/explore-jobs.jpg", title: "Explore Thousands of Jobs", desc: "Browse job openings from top tech companies worldwide.", btnText: "Browse Jobs", btnColor: "bg-blue-600 hover:bg-blue-700", link: "/jobs" },
            { src: "/images/build-profile.webp", title: "Build a Professional Profile", desc: "Showcase your coding skills and attract top recruiters.", btnText: "Create Profile", btnColor: "bg-purple-600 hover:bg-purple-700", link: "/profile" },
            { src: "/images/connect-recruiters.webp", title: "Connect with Top Recruiters", desc: "Expand your network in the tech industry and land interviews.", btnText: "Start Networking", btnColor: "bg-red-600 hover:bg-red-700", link: "/network" },
            { src: "/images/career-growth.jpg", title: "Grow Your Career", desc: "Access developer resources, mentorship, and career guidance.", btnText: "Learn More", btnColor: "bg-teal-600 hover:bg-teal-700", link: "/about-us" },
          ].map((banner, index) => (
            <div key={index} className="relative w-full h-[300px] flex items-center justify-center text-center text-white overflow-hidden rounded-lg shadow-lg">
              <div className="absolute inset-0 bg-black/40"></div>
              <Image 
                src={banner.src} 
                alt={banner.title} 
                layout="fill" 
                objectFit="cover"
                className="absolute inset-0 transition-transform transform hover:scale-105 duration-300"
              />
              <div className="relative z-10 p-6">
                <h2 className="text-3xl font-semibold drop-shadow-lg">{banner.title}</h2>
                <p className="mt-2 text-lg drop-shadow-md">{banner.desc}</p>
                <Link href={banner.link}>
                  <button className={`mt-4 px-5 py-2 text-white rounded-md transition-transform transform hover:scale-105 duration-300 ${banner.btnColor}`}>
                    {banner.btnText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Call to Action Banner */}
        <section className="relative w-full h-[400px] flex items-center justify-center text-center text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-500 opacity-80"></div>
          <Image 
            src="/images/call-to-action-banner.jpg" 
            alt="Join Us Banner" 
            layout="fill" 
            objectFit="cover"
            className="absolute inset-0 opacity-50"
          />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-bold drop-shadow-lg">Join the CareerConnect Community</h2>
            <p className="mt-3 text-lg drop-shadow-md">Join thousands of software developers in building their future.</p>
            <Link href="/sign-up">
              <button className="mt-6 px-6 py-3 bg-white text-green-700 text-lg font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                Sign Up Now
              </button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
