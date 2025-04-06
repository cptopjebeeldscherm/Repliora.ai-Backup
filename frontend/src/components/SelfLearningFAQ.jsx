import React, { useEffect, useState } from "react";
import api from "../utils/api"; // Make sure this path is correct

export default function SelfLearningFAQ() {
    const [unanswered, setUnanswered] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");

    const CONFIDENCE_THRESHOLD = 0.4;

    useEffect(() => {
        api
            .get("/unanswered")
            .then((data) => {
                const filtered = data.filter((item) => item.score >= CONFIDENCE_THRESHOLD);
                setUnanswered(filtered);
            })
            .catch((err) => console.error("Error fetching unanswered:", err));
    }, []);

    const handleSubmit = async () => {
        try {
            await api.post("/add-faq", {
                question: selectedQuestion,
                answer: newAnswer,
            });

            alert("✅ FAQ saved!");
            setUnanswered((prev) => prev.filter((q) => q.body !== selectedQuestion));
            setSelectedQuestion("");
            setNewAnswer("");
        } catch (err) {
            alert("❌ Error saving FAQ");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-4">🧠 Self-Learning FAQ</h1>
            <p className="text-gray-500 mb-8">
                Automatically improve your system by answering high-confidence unmatched questions
                (score ≥ {CONFIDENCE_THRESHOLD})
            </p>

            <div className="space-y-4 mb-10">
                {unanswered.length === 0 && (
                    <p className="text-gray-400 text-sm">No high-confidence questions found.</p>
                )}
                {unanswered.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedQuestion(item.body)}
                        className={`cursor-pointer p-4 rounded-lg border shadow-sm transition-all duration-200
              ${selectedQuestion === item.body
                                ? "bg-gradient-to-r from-[#10a37f] to-[#0e8e6c] text-white"
                                : "bg-white hover:bg-gray-100 text-gray-800"}`}
                    >
                        <div className="text-sm font-medium">
                            Confidence Score: <span className="font-semibold">{(item.score * 100).toFixed(0)}%</span>
                        </div>
                        <div className="mt-1 text-sm">{item.body}</div>
                    </div>
                ))}
            </div>

            {selectedQuestion && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-1">Answer for:</h2>
                        <div className="bg-gray-50 border px-4 py-3 rounded text-sm text-gray-800">
                            {selectedQuestion}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Your Answer</label>
                        <textarea
                            placeholder="Write the answer here..."
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-3 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#10a37f]"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-[#10a37f] to-[#0e8e6c] text-white px-6 py-3 rounded-md shadow hover:opacity-90 transition"
                    >
                        💾 Save as FAQ
                    </button>
                </div>
            )}
        </div>
    );
}
