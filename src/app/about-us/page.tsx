'use client'
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 text-gray-900">
        
        {/* Hero Section */}
        <section className="bg-green-700 text-white py-16 px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">About CareerConnect</h1>
          <p className="text-lg max-w-2xl mx-auto">
            We empower software developers by connecting them with top employers and career opportunities. 
            Your dream job is just a click away!
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-8 text-center">
          <h2 className="text-4xl font-semibold mb-6 text-green-700">Our Mission & Vision</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700">
              At CareerConnect, we aim to bridge the gap between talented software developers and 
              thriving tech companies. We believe in fostering growth, innovation, and opportunities 
              for developers around the world.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-white py-16 px-8 text-center">
          <h2 className="text-4xl font-semibold text-green-700 mb-10">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: "Innovation", desc: "We embrace cutting-edge technology and encourage creative problem-solving." },
              { title: "Integrity", desc: "We believe in transparency, honesty, and building trust with our users." },
              { title: "Community", desc: "We foster a network of developers who collaborate and grow together." }
            ].map((value, index) => (
              <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                <p className="text-gray-600 mt-2">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="bg-white py-16 px-8">
          <h2 className="text-4xl font-semibold text-center text-green-700 mb-10">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              "Alice Johnson", "David Smith", "Sophia Martinez"
            ].map((name, index) => (
              <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image 
                    src={`/images/team-member-${index + 1}.jpg`} 
                    alt={name} 
                    layout="fill" 
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                <p className="text-gray-600">Senior Developer</p>
              </div>
            ))}
          </div>
        </section>

        {/* Industry Partnerships */}
        <section className="bg-gray-200 py-16 px-8 text-center">
          <h2 className="text-4xl font-semibold text-green-700 mb-8">Our Industry Partnerships</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            CareerConnect collaborates with leading tech companies, startups, and organizations to provide
            job opportunities tailored to software developers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {["Google", "Microsoft", "Amazon", "Meta", "Netflix"].map((partner, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md text-gray-800 font-semibold">
                {partner}
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-8 text-center bg-gray-200">
          <h2 className="text-4xl font-semibold text-green-700 mb-8">What Developers Say About Us</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              { quote: "CareerConnect helped me land my dream software engineering job!", name: "Michael Brown" },
              { quote: "A game-changer for developers looking for remote and onsite opportunities!", name: "Sarah Thompson" }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <h4 className="mt-4 font-semibold text-gray-900">— {testimonial.name}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-8 text-center">
          <h2 className="text-4xl font-semibold text-green-700 mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { question: "How do I apply for jobs?", answer: "You can browse job listings and apply directly through our platform." },
              { question: "Is CareerConnect free to use?", answer: "Yes, our platform is free for job seekers!" },
              { question: "How do I get noticed by recruiters?", answer: "Build a strong profile showcasing your skills and experience." }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md text-left">
                <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                <p className="text-gray-700 mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-8 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Join Us & Start Your Career Journey</h2>
          <p className="text-lg text-gray-700 mb-6">
            Sign up now to explore thousands of job opportunities and advance your software development career.
          </p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
            Get Started
          </button>
        </section>
      </div>
      <Footer />
    </>
  );
}
