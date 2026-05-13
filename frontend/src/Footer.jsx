// Footer.jsx
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaHeartbeat,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#046d75] to-[#068e97] text-white">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white text-[#068e97] p-3 rounded-full shadow-lg">
                <FaHeartbeat className="text-2xl" />
              </div>

              <h1 className="text-3xl font-bold tracking-wide">
                Healthcare
              </h1>
            </div>

            <p className="text-sm md:text-base text-gray-100 leading-7 max-w-md">
              Your trusted healthcare partner for online consultations,
              appointments, and better patient care experience. 
              We make healthcare simple, fast, and accessible.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              {[
                FaFacebookF,
                FaTwitter,
                FaInstagram,
                FaLinkedinIn,
                FaYoutube,
              ].map((Icon, index) => (
                <div
                  key={index}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white hover:text-[#068e97] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md"
                >
                  <Icon className="text-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h2 className="text-lg font-semibold mb-5 relative inline-block">
              Product
              <span className="absolute left-0 -bottom-1 w-10 h-[3px] bg-white rounded-full"></span>
            </h2>

            <ul className="space-y-3 text-sm text-gray-100">
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Features
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Pricing
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Case Studies
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Reviews
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Updates
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-lg font-semibold mb-5 relative inline-block">
              Company
              <span className="absolute left-0 -bottom-1 w-10 h-[3px] bg-white rounded-full"></span>
            </h2>

            <ul className="space-y-3 text-sm text-gray-100">
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                About
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Contact Us
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Careers
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Culture
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Blog
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h2 className="text-lg font-semibold mb-5 relative inline-block">
              Support
              <span className="absolute left-0 -bottom-1 w-10 h-[3px] bg-white rounded-full"></span>
            </h2>

            <ul className="space-y-3 text-sm text-gray-100">
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Getting Started
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Help Center
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Server Status
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Report a Bug
              </li>
              <li className="hover:translate-x-1 transition duration-300 cursor-pointer">
                Chat Support
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <p className="text-sm text-gray-100 text-center md:text-left">
            © 2025 CodeCraft Crew. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-100">
            <span className="hover:text-white cursor-pointer transition">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer transition">
              Terms & Conditions
            </span>
            <span className="hover:text-white cursor-pointer transition">
              Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}