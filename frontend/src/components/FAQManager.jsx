import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useEmailSettings } from "../context/EmailSettingsContext";
import api from "../utils/api";

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

    useEffect(() => {
        api.get("/load-faqs").then(setFaqs);
        api.get("/get-all-templates").then(setTemplates);
    }, []);

    const handleCSVUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const parsedFaqs = results.data.map((row) => ({
                    question: row.Question,
                    category: row.Category,
                }));

                const updatedFaqs = [...faqs, ...parsedFaqs];
                setFaqs(updatedFaqs);
                api.post("/save-faqs", updatedFaqs);
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
        setCategory(faqs[index].category);
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        const updatedFaqs = [...faqs];
        const newItem = { question, category };

        if (editingIndex !== null) {
            updatedFaqs[editingIndex] = newItem;
        } else {
            updatedFaqs.push(newItem);
        }

        setFaqs(updatedFaqs);
        setIsModalOpen(false);
        api.post("/save-faqs", updatedFaqs);
    };

    const handleRemove = () => {
        if (editingIndex !== null) {
            const updatedFaqs = faqs.filter((_, i) => i !== editingIndex);
            setFaqs(updatedFaqs);
            setIsModalOpen(false);
            api.post("/save-faqs", updatedFaqs);
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
            const res = await api.post("/match-faq", { message, faqs });

            if (res.category && res.template) {
                const reply = getAutoReplyFromCategory(res.category, res.template);
                setChatMessages((prev) => [...prev, { role: "bot", content: reply }]);
            } else {
                setChatMessages((prev) => [
                    ...prev,
                    { role: "bot", content: res.answer || "Sorry, I couldn’t find a matching answer." },
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
        <div className="max-w-5xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-bold mb-4">💬 FAQ Manager</h1>
            <p className="text-gray-500 mb-6">Match incoming questions to categories & generate answers</p>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-[#10a37f] to-[#0e8e6c] text-white px-5 py-2 rounded shadow hover:opacity-90 transition"
                >
                    ➕ Add FAQ
                </button>
                <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    id="csvUpload"
                    onChange={handleCSVUpload}
                />
                <label
                    htmlFor="csvUpload"
                    className="cursor-pointer bg-gray-100 border px-4 py-2 rounded hover:bg-gray-200"
                >
                    📁 Upload CSV
                </label>
            </div>

            <div className="space-y-4 mb-10">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-sm border border-gray-100 p-4 rounded-lg flex justify-between items-start"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                            <p className="text-sm text-gray-600">Category: {faq.category}</p>
                        </div>
                        <button
                            onClick={() => handleEdit(index)}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-[#f7f7f9] p-5 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-3">💬 Simulate a Customer Question</h2>
                <div className="h-64 overflow-y-auto p-3 space-y-2 bg-white rounded-lg border border-gray-100 shadow-inner mb-4">
                    {chatMessages.map((msg, i) => (
                        <div
                            key={i}
                            className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${msg.role === "user"
                                ? "bg-black text-white ml-auto"
                                : "bg-gray-100 text-gray-800"
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
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type a customer question..."
                        className="flex-1 px-4 py-2 border rounded-l focus:outline-none"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-[#10a37f] text-white px-5 py-2 rounded-r hover:bg-[#0e8e6c]"
                    >
                        Send
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl space-y-4">
                        <h2 className="text-xl font-semibold">
                            {editingIndex !== null ? "Edit FAQ" : "Add FAQ"}
                        </h2>
                        <div>
                            <label className="text-sm font-medium">Question</label>
                            <input
                                type="text"
                                className="mt-1 w-full border px-3 py-2 rounded"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-1 w-full border px-3 py-2 rounded"
                            >
                                <option value="">Select category</option>
                                <option value="General">General</option>
                                <option value="Orders">Orders</option>
                                <option value="Shipping">Shipping</option>
                                <option value="Refunds">Refunds</option>
                                <option value="Returns">Returns</option>
                                <option value="Issues">Issues</option>
                            </select>
                        </div>
                        <div className="flex justify-between pt-3">
                            <button
                                onClick={handleConfirm}
                                className="bg-[#10a37f] text-white px-4 py-2 rounded"
                            >
                                Confirm
                            </button>
                            {editingIndex !== null && (
                                <button
                                    onClick={handleRemove}
                                    className="text-red-600 bg-red-100 px-4 py-2 rounded"
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
