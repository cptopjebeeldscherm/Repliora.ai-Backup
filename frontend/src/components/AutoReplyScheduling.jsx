import React, { useEffect, useState } from "react";

export default function AutoReplyScheduling() {
    const [enabled, setEnabled] = useState(false);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");

    useEffect(() => {
        const userEmail = localStorage.getItem("user_email");
        if (!userEmail) return;

        fetch("http://localhost:8000/auto-reply-schedule", {
            headers: {
                "x-user-email": userEmail,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setEnabled(data.enabled ?? false);
                setStartTime(data.start ?? "09:00");
                setEndTime(data.end ?? "17:00");
            })
            .catch((err) => console.error("Failed to load schedule:", err));
    }, []);

    const handleSave = async () => {
        const userEmail = localStorage.getItem("user_email");
        if (!userEmail) {
            alert("❌ No user email found.");
            return;
        }

        const payload = {
            enabled,
            start: startTime,
            end: endTime,
        };

        try {
            const res = await fetch("http://localhost:8000/auto-reply-schedule", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-email": userEmail,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            alert("✅ Schedule saved!");
        } catch (err) {
            console.error("Failed to save schedule:", err);
            alert("❌ Failed to save schedule.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">🕓 Auto-Reply Scheduling</h1>
            <p className="text-gray-600 mb-8">
                Set hours when your assistant should automatically respond to emails.
            </p>

            <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 space-y-6 relative overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#10a37f] to-transparent blur-md opacity-10 rounded-xl"></div>

                <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-800">Enable Scheduling</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={enabled}
                            onChange={() => setEnabled(!enabled)}
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#10a37f] transition-all duration-300"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-full transition-transform duration-300"></div>
                    </label>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-[#10a37f] focus:border-[#10a37f]"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-semibold mb-1 text-gray-700">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-[#10a37f] focus:border-[#10a37f]"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="mt-6 w-full bg-gradient-to-r from-[#10a37f] to-[#0e8e6c] text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition duration-300"
                >
                    💾 Save Schedule
                </button>
            </div>
        </div>
    );
}
