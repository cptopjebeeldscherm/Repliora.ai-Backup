import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // Adjust path if needed

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const data = await api.post("/register", {
        email,
        password,
        role: "user", // ✅ Hardcoded to user
      });

      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_role", data.role); // Store role

      if (onRegister) onRegister(data.user_id, data.role);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-center items-start w-1/2 px-14 text-white bg-gradient-to-br from-[#10a37f] to-black">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to Repliora.ai</h1>
        <p className="text-lg mb-8 text-white/80">
          Start your journey into automated support with confidence.
        </p>
        <ul className="space-y-6 text-white/90 text-sm">
          <li className="flex items-start gap-3">
            <span className="text-[#10a37f] text-xl">🚀</span>
            <span>
              <strong className="block">Launch faster</strong>
              Set up your smart AI assistant in minutes.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#10a37f] text-xl">🧠</span>
            <span>
              <strong className="block">Smarter every day</strong>
              Our system learns from every interaction.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#10a37f] text-xl">📈</span>
            <span>
              <strong className="block">Scale effortlessly</strong>
              From 1 order to 1000—Repliora grows with you.
            </span>
          </li>
        </ul>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6">Create your account</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full bg-[#10a37f] text-white py-2 rounded hover:bg-[#0e8e6c] transition"
          >
            Register & Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}
