import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function AutoSyncWithEmail() {
    const [enabled, setEnabled] = useState(false);
    const [interval, setInterval] = useState(15);

    useEffect(() => {
        api.get("/auto-sync-settings")
            .then((data) => {
                setEnabled(data.enabled);
                setInterval(data.interval);
            })
            .catch((err) => {
                console.error("Failed to load settings:", err);
                alert("❌ Failed to load auto-sync settings.");
            });
    }, []);

    const handleSave = async () => {
        try {
            await api.post("/auto-sync-settings", { enabled, interval });
            alert("✅ Auto-sync settings saved!");
        } catch (err) {
            console.error("Failed to save settings:", err);
            alert("❌ Failed to save auto-sync settings.");
        }
    };

    return (
        <div className="max-w-xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-3 text-gray-900">🔁 Auto-Sync with Email</h1>
            <p className="text-gray-600 mb-8">
                Check new inbox messages automatically at regular intervals without manual action.
            </p>

            <div className="relative bg-white border border-gray-200 rounded-xl shadow-xl p-6 space-y-6 overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#10a37f] to-transparent blur-lg opacity-10 rounded-xl"></div>

                <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-800">Enable Auto-Sync</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={() => setEnabled(!enabled)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#10a37f] transition-all duration-300"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-full transition-transform duration-300"></div>
                    </label>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                        Check Interval (minutes)
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={interval}
                        onChange={(e) => setInterval(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-[#10a37f] focus:border-[#10a37f]"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-[#10a37f] to-[#0e8e6c] text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition duration-300"
                >
                    💾 Save Settings
                </button>
            </div>
        </div>
    );
}
