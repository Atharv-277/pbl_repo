// Footer.jsx
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";


export default function Footer() {
  
  return (
    <div className="w-full bg-[#068e97] text-white pt-6 md:pt-8 pb-4 md:pb-6 px-4 md:px-32">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 md:gap-10">
        {/* Left Side: Name and copyright */}
        <div className="flex-1 min-w-[220px] mb-6 md:mb-0 text-center md:text-left">
          <div className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Healthcare</div>
          <div className="text-xs md:text-sm opacity-80">
            Copyright © 2025 Codecraft Crew<br />
            All Rights Reserved
          </div>
        </div>
        {/* Center Columns */}
        <div className="flex-[2] grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center md:text-left">
            <div className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Product</div>
            <ul className="space-y-1 opacity-90 text-xs md:text-sm">
              <li>Features</li>
              <li>Pricing</li>
              <li>Case studies</li>
              <li>Reviews</li>
              <li>Updates</li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <div className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Company</div>
            <ul className="space-y-1 opacity-90 text-xs md:text-sm">
              <li>About</li>
              <li>Contact us</li>
              <li>Careers</li>
              <li>Culture</li>
              <li>Blog</li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <div className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Support</div>
            <ul className="space-y-1 opacity-90 text-xs md:text-sm">
              <li>Getting started</li>
              <li>Help center</li>
              <li>Server status</li>
              <li>Report a bug</li>
              <li>Chat support</li>
            </ul>
          </div>
          {/* Social Links */}
          <div className="text-center md:text-left">
            <div className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Follow us</div>
            <ul className="space-y-1 opacity-90 text-xs md:text-sm">
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <span className="bg-opacity-10 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                  {/*<i className="fab fa-facebook-f" />*/}
                   <FaFacebookF className="text-lg md:text-xl" />
                  
                </span>
                Facebook
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <span className="bg-opacity-10 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                  <FaTwitter className="text-lg md:text-xl" />
                </span>
                Twitter
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <span className="bg-opacity-10 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                  <FaInstagram className="text-lg md:text-xl" />
                </span>
                Instagram
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <span className="bg-opacity-10 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                 <FaLinkedinIn className="text-lg md:text-xl" />
                </span>
                LinkedIn
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <span className="bg-opacity-10 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                  <FaYoutube className="text-lg md:text-xl" />
                </span>
                YouTube
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
