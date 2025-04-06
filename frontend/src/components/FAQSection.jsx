import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useEmailSettings } from "../context/EmailSettingsContext";

export default function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [templates, setTemplates] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { emailSettings } = useEmailSettings();
  const userEmail = localStorage.getItem("user_email");

  useEffect(() => {
    if (!userEmail) return;

    fetch("http://localhost:8000/load-faqs", {
      headers: { "x-user-email": userEmail }
    })
      .then((res) => res.json())
      .then((data) => setFaqs(data))
      .catch((err) => console.error("Failed to load saved FAQs:", err));

    fetch("http://localhost:8000/get-all-templates", {
      headers: { "x-user-email": userEmail }
    })
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => console.error("Failed to load templates:", err));
  }, [userEmail]);

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parsedFaqs = results.data.map((row) => ({
          question: row.Question,
          answer: row.Answer,
        }));

        const updatedFaqs = [...faqs, ...parsedFaqs];
        setFaqs(updatedFaqs);

        fetch("http://localhost:8000/save-faqs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": userEmail
          },
          body: JSON.stringify(updatedFaqs),
        });
      },
    });
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setQuestion("");
    setCategory("");
    setIsModalOpen(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setQuestion(faqs[index].question);
    setCategory(faqs[index].answer); // answer holds category
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const updatedFaqs = [...faqs];
    const newItem = { question, answer: category };

    if (editingIndex !== null) {
      updatedFaqs[editingIndex] = newItem;
    } else {
      updatedFaqs.push(newItem);
    }

    setFaqs(updatedFaqs);
    setIsModalOpen(false);

    fetch("http://localhost:8000/save-faqs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-email": userEmail
      },
      body: JSON.stringify(updatedFaqs),
    });
  };

  const handleRemove = () => {
    if (editingIndex !== null) {
      const updatedFaqs = faqs.filter((_, i) => i !== editingIndex);
      setFaqs(updatedFaqs);
      setIsModalOpen(false);

      fetch("http://localhost:8000/save-faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail
        },
        body: JSON.stringify(updatedFaqs),
      });
    }
  };

  const getAutoReplyFromCategory = (intent, templateName) => {
    const templatesByIntent = templates[intent] || {};
    return templatesByIntent[templateName] || "[Template not found]";
  };

  const handleSend = async () => {
    if (!chatInput.trim()) return;

    const message = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatInput("");

    try {
      const res = await fetch("http://localhost:8000/match-faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail
        },
        body: JSON.stringify({ message, faqs }),
      });

      const data = await res.json();

      if (data.category && data.template) {
        const reply = getAutoReplyFromCategory(data.category, data.template);
        setChatMessages((prev) => [...prev, { role: "bot", content: reply }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "bot", content: data.answer || "Sorry, I couldn’t find a matching answer." },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", content: "Something went wrong." },
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-2">Frequently Asked Questions</h1>
      <p className="text-gray-500 mb-6">Connect questions to general categories</p>

      <div className="flex gap-4 mb-6">
        <button onClick={handleAdd} className="bg-[#10a37f] text-white px-4 py-2 rounded">
          Add
        </button>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          id="csvUpload"
          onChange={handleCSVUpload}
        />
        <label htmlFor="csvUpload" className="cursor-pointer bg-gray-200 px-4 py-2 rounded">
          Upload CSV
        </label>
      </div>

      {faqs.map((faq, index) => (
        <div key={index} className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{faq.question}</h3>
            <p className="text-gray-600 text-sm">Category: {faq.answer}</p>
          </div>
          <button onClick={() => handleEdit(index)} className="text-sm text-blue-500 hover:underline">
            Edit
          </button>
        </div>
      ))}

      <div className="bg-gray-100 rounded-lg p-4 mt-8">
        <h2 className="text-xl font-medium mb-3">Simulate a Customer Support Message</h2>
        <div className="h-60 overflow-y-auto mb-4 space-y-2 text-sm">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded max-w-[75%] ${msg.role === "user"
                ? "bg-black text-white ml-auto"
                : "bg-gray-200 text-gray-800 mr-auto"}`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-3 py-2 border rounded-l"
          />
          <button
            onClick={handleSend}
            className="bg-[#10a37f] text-white px-4 py-2 rounded-r"
          >
            Send
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl space-y-4">
            <h2 className="text-xl font-semibold">
              {editingIndex !== null ? "Edit FAQ" : "Add FAQ"}
            </h2>
            <div>
              <label className="block text-sm font-medium">Question</label>
              <input
                type="text"
                className="mt-1 block w-full border rounded px-3 py-2"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2"
              >
                <option value="">Select a category...</option>
                <option value="Orders">Orders</option>
                <option value="Shipping">Shipping</option>
                <option value="Refunds">Refunds</option>
                <option value="Returns">Returns</option>
                <option value="Issues">Issues</option>
              </select>
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={handleConfirm}
                className="bg-[#10a37f] text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              {editingIndex !== null && (
                <button
                  onClick={handleRemove}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
