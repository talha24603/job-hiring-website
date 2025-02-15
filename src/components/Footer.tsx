export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-10 mt-12">
        <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-semibold text-green-400 mb-4">CareerConnect</h3>
            <p className="text-gray-400">
              Connecting job seekers with top employers. Find your dream job and grow your career with us.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-green-400 transition duration-300">Home</a></li>
              <li><a href="#" className="hover:text-green-400 transition duration-300">Job Listings</a></li>
              <li><a href="about-us" className="hover:text-green-400 transition duration-300">About Us</a></li>
              <li><a href="contact-us" className="hover:text-green-400 transition duration-300">Contact</a></li>
            </ul>
          </div>
  
          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-3">Subscribe to our newsletter to get the latest job updates.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="p-2 w-full rounded-l-md bg-gray-800 border border-gray-700 focus:border-green-400 focus:ring-green-400 focus:outline-none text-white"
              />
              <button className="bg-green-600 px-4 py-2 rounded-r-md hover:bg-green-700 transition duration-300">Subscribe</button>
            </div>
          </div>
        </div>
  
        {/* Social Media & Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} CareerConnect. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-green-400 transition duration-300">Facebook</a>
            <a href="#" className="hover:text-green-400 transition duration-300">Twitter</a>
            <a href="#" className="hover:text-green-400 transition duration-300">LinkedIn</a>
            <a href="#" className="hover:text-green-400 transition duration-300">Instagram</a>
          </div>
        </div>
      </footer>
    );
  }
  