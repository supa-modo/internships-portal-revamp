import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-600 to-primary-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About EAC Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/eac-logo.png"
                alt="EAC Logo"
                className="w-20 sm:w-14 h-auto"
              />
              <h3 className="text-lg sm:text-xl font-extrabold font-nunito-sans">
                East African Community Secretariat
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              The East African Community (EAC) is a regional intergovernmental
              organization headquartered in Arusha, Tanzania, committed to
              fostering prosperity, competitiveness, security, and political
              unity among East African countries.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold font-nunito-sans mb-4 border-b border-primary-700 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm ">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-300 transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/applications"
                  className="hover:text-primary-300 transition duration-300"
                >
                  Apply for Internship
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-300 transition duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-300 transition duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-primary-300 transition duration-300"
                >
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-base font-bold font-nunito-sans mb-4 border-b border-primary-700 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-primary-400" />
                <span>
                  EAC Headquarters, Afrika Mashariki Road, Arusha, Tanzania
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary-400" />
                <span>+255 27 216 2100</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400" />
                <span>eac@eachq.org</span>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="text-base font-bold font-nunito-sans mb-4 border-b border-primary-700 pb-2">
              Connect With Us
            </h4>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com/eac"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-800 border border-gray-50/5 p-2.5 rounded-full hover:bg-primary-700 transition duration-300"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a
                href="https://twitter.com/eac"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-800 p-2.5 border border-gray-50/5 rounded-full hover:bg-primary-700 transition duration-300"
              >
                <FaXTwitter className="text-lg" />
              </a>
              <a
                href="https://www.instagram.com/eac_secretariat1/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-800 p-2.5 border border-gray-50/5 rounded-full hover:bg-primary-700 transition duration-300"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a
                href="https://youtube.com/eac"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-800 p-2.5 border border-gray-50/5 rounded-full hover:bg-primary-700 transition duration-300"
              >
                <FaYoutube className="text-lg" />
              </a>
            </div>
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2">
                Subscribe to Our Newsletter
              </h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 text-sm rounded-l-md text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="bg-primary-600 px-4 py-2 text-sm font-semibold rounded-r-md hover:bg-primary-500 transition duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-500 bg-gradient from-gray-500  to-primary-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
          <div className="mb-2 md:mb-0">
            © {new Date().getFullYear()} East African Community. All rights
            reserved.
          </div>
          <div className="flex space-x-4">
            <Link
              to="/privacy-policy"
              className="hover:text-white transition duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-white transition duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
