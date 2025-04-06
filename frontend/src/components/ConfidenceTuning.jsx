import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function ConfidenceTuning() {
    const [threshold, setThreshold] = useState(0.6);

    useEffect(() => {
        api.get("/confidence-threshold")
            .then((data) => {
                if (data?.threshold !== undefined) {
                    setThreshold(data.threshold);
                }
            })
            .catch((err) => console.error("Failed to fetch threshold:", err));
    }, []);

    const handleChange = (e) => {
        setThreshold(parseFloat(e.target.value));
    };

    const handleSave = () => {
        api.post("/confidence-threshold", { threshold })
            .then(() => alert("✅ Threshold saved successfully!"))
            .catch(() => alert("❌ Failed to save threshold."));
    };

    return (
        <div className="max-w-xl mx-auto px-6 py-10 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">📈 Confidence Tuning</h1>
            <p className="text-gray-600 mb-6">
                Adjust how confident the AI should be before replying. A higher threshold means only strong matches will trigger auto-responses.
            </p>

            <div className="mb-8">
                <label htmlFor="confidence" className="block mb-3 text-sm font-medium text-gray-700">
                    Confidence Threshold:{" "}
                    <span className="text-[#10a37f] font-semibold">{threshold.toFixed(2)}</span>
                </label>
                <input
                    type="range"
                    id="confidence"
                    min="0"
                    max="1"
                    step="0.01"
                    value={threshold}
                    onChange={handleChange}
                    className="w-full appearance-none h-3 rounded-lg bg-gray-200 outline-none transition-all duration-200"
                    style={{
                        background: `linear-gradient(to right, #10a37f 0%, #10a37f ${threshold * 100}%, #e5e7eb ${threshold * 100}%, #e5e7eb 100%)`,
                    }}
                />
            </div>

            <button
                onClick={handleSave}
                className="bg-gradient-to-r from-[#10a37f] to-[#0e8e6c] text-white font-medium py-2.5 px-6 rounded-lg shadow hover:opacity-90 transition"
            >
                💾 Save Threshold
            </button>
        </div>
    );
}
