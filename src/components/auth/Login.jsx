import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaTimes, FaUser, FaLock } from "react-icons/fa";
import LoadingButton from "../common/Button";
import bg_image from "../../assets/eac-pic.jpg";
import logo from "../../assets/logo.png";
import { PiUserDuotone } from "react-icons/pi";
import { GiPadlock } from "react-icons/gi";
import { BiLogInCircle } from "react-icons/bi";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const errRef = useRef();

  // Get the redirect path from location state, or default to '/'
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Replace this with your actual API call
      const response = await fetch("your-api-endpoint/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      // const data = await response.json();
      // navigate(from, { replace: true });
      navigate("/hr-admin");

      // if (response.ok) {
      //   // Call the login function from context with the token and user data
      //   login(data.token, data.user);
      //   // Redirect to the page they tried to visit or home
      //   navigate(from, { replace: true });
      // } else {
      //   setError(data.message || "Login failed");
      //   errRef.current.focus();
      // }
    } catch (err) {
      setError("An error occurred during login!!");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateHome = () => {
    navigate("/");
    // setLoading(true);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center font-inter p-4 sm:p-6"
      style={{ backgroundImage: `url(${bg_image})` }}
    >
      <section className="relative bg-white bg-opacity-90 p-6 sm:p-8 rounded-3xl shadow-lg w-full max-w-2xl">
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 text-red-500 hover:text-red-700 font-extrabold text-xl"
          onClick={handleNavigateHome}
        >
          <FaTimes />
        </button>

        {/* Logo */}
        <div className="text-center mb-2 sm:mb-3">
          <img
            src={logo}
            alt="Logo"
            className="mx-auto mb-2 h-20 sm:h-24 md:h-28"
          />
          <h2 className="text-center font-extrabold text-xl sm:text-2xl text-primary-700">
            East African Community Secretariat
          </h2>
          <p className="mt-1 font-bold text-sm sm:text-base text-gray-500">
            Sign in to access your Account
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="sm:space-y-3 space-y-2 md:px-14"
        >
          {/* Error Message */}
          {error && (
            <p
              ref={errRef}
              className="text-red-600 font-bold text-sm text-center"
              aria-live="assertive"
            >
              {error}
            </p>
          )}

          {/* Username Input */}
          <div className="relative">
            <PiUserDuotone
              size={20}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-600"
            />
            <input
              type="text"
              placeholder="Enter your username"
              id="username"
              autoComplete="off"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
              className="w-full py-3 pl-16 pr-4 border text-sm md:text-[14.5px] text-gray-600 font-semibold border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <GiPadlock
              size={20}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              className="w-full py-3 pl-16 pr-4 border text-sm md:text-[14.5px] font-semibold border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 sm:h-4 text-green-700 border-gray-300 rounded focus:ring-green-700"
              />
              <label className="ml-2 text-xs sm:text-sm sm:font-semibold sm:font-sans font-open-sans font-bold text-gray-600">
                Remember Me
              </label>
            </div>
            <a
              href="#"
              className="text-xs sm:text-sm sm:font-sans font-open-sans font-bold text-primary-700 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          <div className="flex justify-center">
            <LoadingButton
              type="submit"
              disabled={loading}
              buttonText="Sign In"
              loadingText="Signing in..."
              isLoading={loading}
              prefixElement={<BiLogInCircle size={20} />}
              className="w-full sm:w-3/5 mt-2 py-3 shadow-lg text-center font-semibold text-white text-sm md:text-[14px] bg-green-700 rounded-lg hover:bg-green-800 transition duration-300"
            />
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
