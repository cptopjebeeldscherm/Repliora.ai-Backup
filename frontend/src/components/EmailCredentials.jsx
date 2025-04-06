import React, { useState } from "react";
import api from "../utils/api";

export default function EmailCredentials() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSaveCredentials = async () => {
    if (!email || !password) {
      setMessage("⚠️ Please enter both email and password.");
      return;
    }

    try {
      await api.post("/save-email-credentials", { email, password });
      setMessage("✅ Credentials saved successfully!");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("❌ Error saving credentials.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-2 text-gray-900">🔐 Email Credentials</h2>
      <p className="text-gray-500 mb-6">Your credentials are stored to the cloud.</p>

      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#10a37f] outline-none transition"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="App password"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#10a37f] outline-none transition"
        />
        <button
          onClick={handleSaveCredentials}
          className="w-full bg-[#10a37f] hover:bg-[#0e8e6c] text-white font-medium py-3 rounded-lg shadow-md transition-all"
        >
          Save Credentials
        </button>
      </div>

      {message && (
        <p className="mt-4 text-sm text-gray-700 border-l-4 border-[#10a37f] pl-3 py-2 bg-gray-50 rounded">
          {message}
        </p>
      )}
    </div>
  );
}
