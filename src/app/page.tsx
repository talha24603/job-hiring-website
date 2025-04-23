import Link from "next/link"
import { auth } from "@/auth"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Search, Users, TrendingUp, Star } from "lucide-react"

const categories = [
  { title: "Frontend Developer", skills: "React, Vue, Angular, HTML, CSS, JavaScript" },
  { title: "Backend Developer", skills: "Node.js, Django, Spring Boot, Ruby on Rails" },
  { title: "Full Stack Developer", skills: "MERN, MEAN, LAMP Stack" },
  { title: "Mobile App Developer", skills: "React Native, Flutter, Swift, Kotlin" },
  { title: "DevOps Engineer", skills: "CI/CD, AWS, Docker, Kubernetes" },
  { title: "Software Engineer", skills: "General software development roles" },
  { title: "Game Developer", skills: "Unity, Unreal Engine, C#" },
  { title: "AI/ML Engineer", skills: "TensorFlow, PyTorch, NLP, Data Science" },
  { title: "Cybersecurity Engineer", skills: "Penetration Testing, Ethical Hacking" },
  { title: "Data Engineer", skills: "Big Data, SQL, ETL Pipelines" },
  { title: "Database Administrator", skills: "MongoDB, PostgreSQL, MySQL, Firebase" },
  { title: "Cloud Engineer", skills: "AWS, Azure, Google Cloud" },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Frontend Developer",
    company: "TechCorp",
    image: "/placeholder.svg?height=80&width=80",
    text: "CareerHub helped me find my dream job in just two weeks! The platform is intuitive and the job matches were spot-on for my skills.",
  },
  {
    name: "Michael Chen",
    role: "DevOps Engineer",
    company: "CloudSystems",
    image: "/placeholder.svg?height=80&width=80",
    text: "As someone looking to switch careers, CareerHub provided valuable resources and connections that made my transition smooth and successful.",
  },
  {
    name: "Jessica Williams",
    role: "HR Director",
    company: "InnovateTech",
    image: "/placeholder.svg?height=80&width=80",
    text: "From an employer perspective, CareerHub delivers high-quality candidates that match our requirements perfectly. It's streamlined our hiring process.",
  },
]

const stats = [
  { value: "10K+", label: "Job Listings" },
  { value: "8K+", label: "Companies" },
  { value: "15M+", label: "Job Seekers" },
  { value: "90%", label: "Success Rate" },
]

export default async function Home() {
 
  return (
    <>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-green-50 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0">
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1">
                Your Career Journey Starts Here
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Your <span className="text-green-600">Dream Job</span> Today
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                Connect with top employers, discover opportunities that match your skills, and take the next step in
                your career journey with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
                  Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 px-8">
                  For Employers
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative h-[400px] w-full">
                <Image
                  src="/images"
                  alt="Job seekers"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform hover:scale-105"
              >
                <p className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How CareerHub Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to find the perfect job match in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Search Jobs</h3>
              <p className="text-gray-600">
                Browse thousands of opportunities filtered by your skills, experience, and preferences.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Connect</h3>
              <p className="text-gray-600">
                Apply directly to positions and connect with hiring managers and recruiters.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Grow</h3>
              <p className="text-gray-600">
                Advance your career with personalized recommendations and professional development resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Job Categories</h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Discover opportunities across various tech specializations that match your skills and career goals
              </p>
            </div>
            <Link href="/categories" className="mt-4 md:mt-0">
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category, index) => {
              const slug = category.title.toLowerCase().replace(/ /g, "-")
              return (
                <Link key={index} href={`/job/${slug}`}>
                  <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(category.title)}`}
                        alt={`${category.title}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{category.title}</h3>
                    </div>
                    <div className="p-5 flex-grow">
                      <p className="text-gray-600 mb-4">{category.skills}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-sm text-green-600 font-medium">View Jobs</span>
                        <ArrowRight className="h-4 w-4 text-green-600 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/categories">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <div className="relative h-[400px] w-full">
                <Image
                  src="/placeholder.svg?height=400&width=500&text=For+Employers"
                  alt="For Employers"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">For Employers</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Find the Perfect Talent for Your Team
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Post jobs, screen candidates, and build your dream team with our comprehensive hiring platform designed
                for modern businesses.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Access to a pool of qualified tech professionals",
                  "AI-powered candidate matching",
                  "Streamlined interview scheduling",
                  "Branded company profile",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/employer-signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Start Hiring <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from job seekers and employers who have found success with CareerHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Career Journey?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of professionals who have found their dream jobs through CareerHub. Your next opportunity is
            just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 px-8">
              Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700 px-8">
              For Employers
            </Button>
          </div>
        </div>
      </section>

    </>
  )
}
