import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Dynamically get the current year

  return (
    <footer className="bg-gray-800 text-gray-300 py-12 md:py-16 mt-16">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Column 1: Brand/About */}
        <div className="col-span-1">
          <h3 className="text-xl font-bold text-white mb-4">BengalWander</h3>
          <p className="text-sm leading-relaxed">
            Discover the vibrant beauty and rich culture of Bangladesh with
            BengalWander. Your ultimate guide to exploring breathtaking
            landscapes and hidden gems.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/destinations"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Destinations
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal & Help */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">
            Legal & Help
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/privacy"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/faq"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Socials (combined for better layout) */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">
            Connect With Us
          </h4>
          <div className="flex space-x-4 text-2xl mb-6">
            {" "}
            {/* Increased icon size */}
            <a
              href="https://facebook.com/yourprofile" // Use your actual social links
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors duration-200"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition-colors duration-200"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://github.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors duration-200"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
          <p className="text-sm">
            Email:{" "}
            <a
              href="mailto:info@bengalwander.com"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              info@bengalwander.com
            </a>
          </p>
          <p className="text-sm">
            Phone:{" "}
            <a
              href="tel:+8801234567890"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              +880 123 456 7890
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Bar - Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        <p>&copy; {currentYear} BengalWander. All rights reserved.</p>
        <p className="mt-1">Designed with ❤️ in Bangladesh</p>
      </div>
    </footer>
  );
};

export default Footer;
