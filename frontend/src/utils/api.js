import axios from "axios";

// Use environment variable for API base, fallback if not set
const API_BASE = import.meta.env.VITE_API_URL || "https://repliora-api.onrender.com";

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // important if backend uses cookies/sessions
});

// Add a request interceptor to inject user email in all requests
api.interceptors.request.use((config) => {
  const email = localStorage.getItem("user_email");
  if (email) {
    config.headers["x-user-email"] = email;
  }
  return config;
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
