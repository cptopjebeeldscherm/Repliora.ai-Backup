import React, { useState } from "react";
import api from "../utils/api";

export default function ChatSimulation() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const data = await api.post("/match-faq", { message: input });
      const botMessage = {
        role: "bot",
        text: data.answer || "Sorry, I couldn't find a good match.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error matching FAQ:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold mb-4">💬 Test AI Customer Support</h2>
      <div className="border border-gray-300 rounded p-4 mb-4 h-80 overflow-y-auto bg-white shadow">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"
              }`}
          >
            <div
              className={`inline-block px-3 py-2 rounded ${msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button className="bg-[#10a37f] hover:bg-[#0e8e6c] text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
