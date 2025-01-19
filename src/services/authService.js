import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create an axios instance with default config
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (credentials) => {
  try {
    const response = await authAxios.post("/auth/login", credentials);
    if (response.data.success) {
      // Store token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error("Network error occurred");
  }
};
