import axios from "axios";

// Automatically choose the correct base URL depending on the environment
const API_BASE =
  import.meta.env.PROD
    ? "https://repliora-api.onrender.com"
    : "http://localhost:8000";

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
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
