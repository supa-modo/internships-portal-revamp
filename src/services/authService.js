import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Adjust port as needed

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};

export const axiosInstance = axios.create({
  baseURL: API_URL,
});
