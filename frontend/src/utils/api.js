// src/utils/api.js
import axios from "axios";

const API_BASE = "http://localhost:8000";

const api = axios.create({
  baseURL: "https://repliora-api.onrender.com",
});


const getHeaders = (isJson = true) => {
  const email = localStorage.getItem("user_email");
  const headers = { "x-user-email": email || "" };
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error("Request failed");
  return res.json();
};

export default {
  get: (endpoint) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    }).then(handleResponse),

  post: (endpoint, body) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (endpoint, body) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (endpoint) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleResponse),

  upload: (endpoint, formData) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: getHeaders(false), // omit Content-Type for FormData
      body: formData,
    }).then(handleResponse),
};
