// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
