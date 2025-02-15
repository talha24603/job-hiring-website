'use client'
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 text-gray-900">
        {/* Hero Section */}
        <section className="relative w-full h-[400px] flex items-center justify-center text-center text-white">
          <div className="absolute z-10 inset-0 bg-gradient-to-r from-gray-400 to-gray-400 opacity-80"></div>
          <Image 
            src="/images/contact-hero.jpg" 
            alt="Contact Us" 
            layout="fill" 
            objectFit="cover"
            className="absolute inset-0"
          />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-bold drop-shadow-lg ">Get in Touch</h1>
            <p className="text-lg mt-4 drop-shadow-md">We'd love to hear from you. Contact us anytime!</p>
          </div>
        </section>

        {/* Contact Details */}
        <section className="py-16 px-8 text-center">
          <h2 className="text-4xl font-semibold mb-6 text-green-700">Contact Information</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Reach out to us via email, phone, or visit our office. Our team is here to help you.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold text-green-700">Email</h3>
              <p className="text-gray-700 mt-2">support@careerconnect.com</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold text-green-700">Phone</h3>
              <p className="text-gray-700 mt-2">+1 (555) 123-4567</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold text-green-700">Location</h3>
              <p className="text-gray-700 mt-2">123 Main Street, New York, NY</p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-8 bg-white text-center">
          <h2 className="text-4xl font-semibold text-green-700 mb-6">Send Us a Message</h2>
          <form className="max-w-3xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="p-3 border rounded-md w-full" />
              <input type="email" placeholder="Email Address" className="p-3 border rounded-md w-full" />
            </div>
            <textarea placeholder="Your Message" className="p-3 border rounded-md w-full mt-4 h-32"></textarea>
            <button className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105">
              Send Message
            </button>
          </form>
        </section>

   
        
      </div>
      <Footer />
    </>
  );
}
