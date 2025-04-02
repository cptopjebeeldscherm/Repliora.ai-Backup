import React, { useState, useEffect } from "react";
import Papa from "papaparse";

export default function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");


  useEffect(() => {
    fetch("http://localhost:8000/load-faqs")
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data);
      })
      .catch((err) => {
        console.error("Failed to load saved FAQs:", err);
      });
  }, []);

  // Chat simulation state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);


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

        // ✅ Confirm before saving
        console.log("Parsed CSV:", updatedFaqs);

        fetch("http://localhost:8000/save-faqs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFaqs),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Backend response:", data);
            alert("FAQs saved to backend!");
          })
          .catch((err) => {
            console.error("Failed to save:", err);
            alert("Error saving FAQs");
          });
      },
    });
  };



  const handleAdd = () => {
    setEditingIndex(null);
    setQuestion("");
    setAnswer("");
    setIsModalOpen(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setQuestion(faqs[index].question);
    setAnswer(faqs[index].answer);
    setIsModalOpen(true);
  };


  const handleConfirm = () => {
    const updatedFaqs = [...faqs];
    if (editingIndex !== null) {
      updatedFaqs[editingIndex] = { question, answer };
    } else {
      updatedFaqs.push({ question, answer });
    }
    setFaqs(updatedFaqs);
    setIsModalOpen(false);
  };

  const handleRemove = () => {
    if (editingIndex !== null) {
      const updatedFaqs = faqs.filter((_, i) => i !== editingIndex);
      setFaqs(updatedFaqs);
      setIsModalOpen(false);
    }
  };

  const handleSend = async () => {
    if (!chatInput.trim()) return;

    const message = chatInput.trim();

    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: message },
    ]);
    setChatInput("");

    try {
      const res = await fetch("http://localhost:8000/match-faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,     // customer's message
          faqs,        // send your current list of FAQs
        }),
      });

      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", content: data.answer },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", content: "Something went wrong." },
      ]);
    }
  };



  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-2">Add your Frequently Asked Questions</h1>
      <p className="text-gray-500 mb-6">History of added FAQs and answers</p>
      <p className="text-sm text-gray-400 mb-4">
        CSV should have two columns: <strong>Question</strong> and <strong>Answer</strong>.
      </p>


      <div className="flex gap-4 mb-6">
        <button
          onClick={handleAdd}
          className="bg-[#10a37f] hover:bg-[#0e8e6c] text-white px-4 py-2 rounded"
        >
          Add
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          accept=".csv"
          className="hidden"
          id="csvUpload"
          onChange={handleCSVUpload}
        />

        {/* Visible styled label */}
        <label
          htmlFor="csvUpload"
          className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Upload CSV
        </label>
      </div>


      {faqs.length > 0 && (
        <div className="space-y-4 mb-10">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
              <button
                onClick={() => handleEdit(index)}
                className="text-sm text-blue-500 hover:underline"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Chat Simulation Box */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-xl font-medium mb-3">Simulate a Customer Support Message</h2>
        <div className="h-60 overflow-y-auto mb-4 space-y-2 text-sm">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded max-w-[75%] ${msg.role === "user"
                ? "bg-black text-white ml-auto"
                : "bg-gray-200 text-gray-800 mr-auto"
                }`}
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
          <button onClick={handleSend} className="bg-[#10a37f] text-white px-4 py-2 rounded-r">
            Send
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl space-y-4">
            <h2 className="text-xl font-semibold">
              {editingIndex !== null ? "Edit FAQ" : "Add FAQ"}
            </h2>
            <div>
              <label className="block text-sm font-medium">Question</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Answer</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={handleConfirm}
                className="bg-[#10a37f] hover:bg-[#0e8e6c] text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              {editingIndex !== null && (
                <button
                  onClick={handleRemove}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 px-4 py-2"
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
