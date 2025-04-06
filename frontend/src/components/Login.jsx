import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", { email, password });
      const { user_id, role = "user" } = response;

      // Debug log
      console.log("Login success:", response);

      // Save credentials
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_role", role);

      if (onLogin) onLogin(user_id, role);

      // Navigate based on role
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Branding Panel */}
      <div className="hidden md:flex flex-col justify-center items-start w-1/2 px-14 text-white bg-gradient-to-br from-[#10a37f] to-black">
        <h1 className="text-4xl font-extrabold mb-4">Repliora.ai</h1>
        <p className="text-lg mb-8 text-white/80">
          Powering the future of ecommerce support with AI that never sleeps.
        </p>
        <ul className="space-y-6 text-white/90 text-sm">
          <li className="flex items-start gap-3">
            <span className="text-[#10a37f] text-xl">🤖</span>
            <span>
              <strong className="block">Instant Smart Replies</strong>
              Respond to emails 24/7 with AI that understands intent.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#10a37f] text-xl">📦</span>
            <span>
              <strong className="block">Live Shopify Lookup</strong>
              Pull customer order details directly into your responses.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#10a37f] text-xl">📊</span>
            <span>
              <strong className="block">Analytics + Auto-Tagging</strong>
              Track performance and organize messages automatically.
            </span>
          </li>
        </ul>
      </div>

      {/* Login Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-6 sm:px-12 py-12 bg-white">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome Back</h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-3 py-2 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-3 py-2 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-[#10a37f] text-white py-2 rounded hover:bg-[#0e8e6c]"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
