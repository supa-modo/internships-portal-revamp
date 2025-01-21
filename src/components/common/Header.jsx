import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo.png";
import logoInverted from "../../assets/logoInverted.png";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const socialLinks = [
    {
      icon: faFacebookF,
      bg: "bg-blue-600 hover:bg-blue-200",
      color: "hover:text-blue-600 text-white",
      href: "https://www.facebook.com/proudlyeastafrican",
    },
    {
      icon: faXTwitter,
      bg: "bg-gray-800 hover:bg-gray-200",
      color: "hover:text-gray-600 text-white",
      href: "https://x.com/jumuiya",
    },
    {
      icon: faInstagram,
      bg: "hover:bg-pink-100 bg-gradient-to-br from-pink-600 to-purple-600",
      color: "text-white",
      href: "https://www.instagram.com/eac_secretariat1/",
    },
    {
      icon: faYoutube,
      bg: "hover:bg-red-200 bg-red-600",
      color: "hover:text-red-600 text-white",
      href: "https://www.youtube.com/channel/UC_Nt3M0n4ftThoVVQMK_D3A",
    },
    {
      icon: faEnvelope,
      bg: "hover:bg-blue-200 bg-blue-600",
      color: "hover:text-blue-600 text-white",
      href: "mailto:eac@eachq.org",
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-primary-50 via-gray-100 to-primary-50 shadow-md">
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex items-center justify-between gap-x-8 py-1 px-6 md:px-14 lg:py-1">
          {/* Logo and Contact Info Section */}
          <div className="flex items-center w-auto">
            <Link
              to="/"
              className="flex-none flex-shrink-0 block p-1 rounded-lg"
            >
              <img
                className="block w-auto h-16 sm:h-20"
                src={logo}
                alt="EAC Logo"
              />
            </Link>
            <div className="text-gray-500 ml-3 mr-8 mt-3 hidden md:block">
              <p className="text-xs">
                EAC Close, Afrika Mashariki Road <br />
                P.O. Box 1096 <br />
                ARUSHA, TANZANIA <br />
                E-mail:{" "}
                <a
                  href="mailto:eac@eachq.org"
                  className="text-blue-600 hover:underline"
                >
                  eac@eachq.org
                </a>
              </p>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center lg:pl-8">
            <h1 className="text-green-700 font-extrabold text-base sm:text-lg md:text-3xl">
              East African Community Secretariat
            </h1>
            <p className="text-[0.65rem] italic mt-1 sm:text-xs md:text-sm">
              'One People, One Destiny'
            </p>
          </div>

          {/* Hamburger Menu Icon for Mobile */}
          <div className="md:hidden">
            {!menuOpen && (
              <button onClick={() => setMenuOpen(true)} aria-label="Open Menu">
                <AiOutlineMenu size={30} className="text-green-700" />
              </button>
            )}
          </div>

          {/* Social Media and Admin Login - Hidden on Mobile */}
          <div className="hidden md:flex items-baseline gap-2">
            {/* Admin Login Section */}
            <div ref={dropdownRef} className="relative my-auto">
              <div className="flex items-center">
                <button
                  onClick={() =>
                    user ? navigate("/dashboard") : navigate("/login")
                  }
                  className="flex items-center font-semibold space-x-2 px-4 py-2 rounded-lg text-green-700 transition-colors duration-200"
                >
                  <RiAdminLine className="w-5 h-5" />
                  <span>
                    {user
                      ? user.firstName + " " + user.lastName
                      : "Admin Login"}
                  </span>
                </button>
                {user && (
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <IoIosArrowDown className="w-4 h-4 text-green-700" />
                  </button>
                )}
              </div>

              {/* Updated Dropdown Menu */}
              {dropdownOpen && user && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 ease-out animate-dropIn">
                  {/* User Info Section */}
                  <div className="px-6 py-4 bg-gradient-to-r from-primary-100 to-blue-50 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-700 to-blue-500 flex items-center justify-center text-white font-semibold font-nunito-sans text-lg">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </div>
                      <div>
                        <div className="text-[15px] font-nunito-sans font-bold text-gray-700">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className=" bg-white">
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-6 py-3 text-sm text-red-600 hover:bg-red-200 transition-colors duration-150 group"
                    >
                      <svg
                        className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors duration-150"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="group-hover:text-red-700 font-nunito-sans font-bold   transition-colors duration-150">
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Icons */}
            <div className="flex md:flex-col gap-3 my-1">
              <p className="font-semibold pl-2">Find Us on</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.bg} ${social.color} px-2 py-1 rounded-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
                  >
                    <FontAwesomeIcon icon={social.icon} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-85 z-50 flex flex-col pt-24 items-center space-y-8">
            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-white z-50"
            >
              <AiOutlineClose size={30} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-none flex-shrink-0 block rounded-lg">
              <img
                className="block w-auto h-[90px]"
                src={logoInverted}
                alt="EAC Logo"
              />
            </Link>

            {/* Admin Login */}
            <div
              className="whitespace-nowrap text-blue-300 text-lg font-semibold cursor-pointer"
              // onClick={() => setDropdownOpen(!dropdownOpen)}
              onClick={() => navigate("/login")}
            >
              <RiAdminLine className="inline mr-3 text-white" size={23} />
              Admin Login
            </div>

            {/* Logout Option */}
            {dropdownOpen && (
              <button
                onClick={handleLogout}
                className="text-red-500 text-lg font-semibold mt-2"
              >
                Logout
              </button>
            )}

            {/* About Us */}
            <Link
              to="https://www.eac.int"
              className="text-white text-lg font-semibold"
            >
              About Us
            </Link>

            {/* Contact Us */}
            <Link
              to="https://www.eac.int/contacts"
              className="text-white text-lg font-semibold"
            >
              Contact Us
            </Link>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.bg} ${social.color} px-3 py-2 rounded-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
                >
                  <FontAwesomeIcon icon={social.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Contact Information */}
            <div className="text-center text-xs text-white">
              <p>EAC Close, Afrika Mashariki Road,</p>
              <p>P.O. Box 1096 ,</p>
              <p>ARUSHA, TANZANIA</p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
