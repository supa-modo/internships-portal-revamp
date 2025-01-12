import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaTimes, FaUser, FaLock } from "react-icons/fa";
import LoadingButton from "../common/Button";
import bg_image from "../../assets/eac-pic.jpg";
import logo from "../../assets/logo.png";

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

      const data = await response.json();

      if (response.ok) {
        // Call the login function from context with the token and user data
        login(data.token, data.user);
        // Redirect to the page they tried to visit or home
        navigate(from, { replace: true });
      } else {
        setError(data.message || "Login failed");
        errRef.current.focus();
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center font-inter p-6"
      style={{ backgroundImage: `url(${bg_image})` }}
    >
      <section className="relative bg-white bg-opacity-85 p-6 md:p-8 px-7 rounded-3xl shadow-md w-full max-w-[49rem] md:px-40">
        <button
          className="absolute top-4 right-6 text-red-500 hover:text-red-700 font-extrabold text-xl"
          onClick={handleNavigateHome}
        >
          <FaTimes />
        </button>

        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="mx-auto mb-2 h-[6rem] md:h-[8.5rem]"
          />
          <h2 className="text-center font-bold text-xl md:text-2xl text-primary-700">
            East African Community Secretariat
          </h2>
          <p className="mt-1 font-bold text-sm md:text-base text-gray-500">
            Sign in to access your Account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <p
              ref={errRef}
              className="text-red-600 font-semibold text-sm text-center"
              aria-live="assertive"
            >
              {error}
            </p>
          )}

          {/* Username Input */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
              className="w-full py-3 pl-12 pr-4 border text-sm font-medium border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              className="w-full py-3 pl-12 pr-4 border text-sm font-medium border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
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
                className="w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-700"
              />
              <label className="ml-2 text-sm font-semibold text-green-700">
                Remember Me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          {/* Login Button */}
          <div className="text-center">
            <LoadingButton
              type="submit"
              disabled={loading}
              buttonText="Sign In"
              loadingText="Signing in..."
              isLoading={loading}
              className="w-full md:w-2/5 mt-6 py-3 text-center font-semibold text-white text-sm bg-green-700 rounded-lg hover:bg-green-800 transition duration-300"
            />
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
