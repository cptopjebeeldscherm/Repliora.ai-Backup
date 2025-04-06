import React, { useEffect, useState } from "react";
import api from "../utils/api"; // ✅ Make sure this path is correct

export default function Settings() {
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
        timezone: "UTC",
        autoReply: true,
        language: "en",
    });

    useEffect(() => {
        api
            .get("/load-settings")
            .then((data) => {
                if (data) {
                    setSettings((prev) => ({ ...prev, ...data }));
                }
            })
            .catch((err) => console.error("Failed to load settings:", err));
    }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = () => {
        api
            .post("/save-settings", settings)
            .then(() => alert("✅ Settings saved!"))
            .catch(() => alert("❌ Failed to save settings."));
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">⚙️ System Settings</h1>

            <div className="relative p-6 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#10a37f] to-transparent opacity-10 blur-xl rounded-xl" />

                <div className="space-y-6 relative z-10">
                    {/* Toggle row */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-800 font-medium">Enable Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="notifications"
                                checked={settings.notifications}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#10a37f] rounded-full peer transition-all duration-300"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-full transition-transform duration-300"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-800 font-medium">Enable Dark Mode (Soon)</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="darkMode"
                                checked={settings.darkMode}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#10a37f] rounded-full peer transition-all duration-300"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-full transition-transform duration-300"></div>
                        </label>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Timezone</label>
                        <select
                            name="timezone"
                            value={settings.timezone}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-[#10a37f] focus:border-[#10a37f]"
                        >
                            <option value="UTC">UTC</option>
                            <option value="CET">CET (Europe)</option>
                            <option value="EST">EST (US)</option>
                            <option value="PST">PST (US)</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-800 font-medium">Enable Auto-Reply Bot</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="autoReply"
                                checked={settings.autoReply}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#10a37f] rounded-full peer transition-all duration-300"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-full transition-transform duration-300"></div>
                        </label>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Language</label>
                        <select
                            name="language"
                            value={settings.language}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-[#10a37f] focus:border-[#10a37f]"
                        >
                            <option value="en">English</option>
                            <option value="nl">Dutch</option>
                            <option value="fr">French</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-6 bg-gradient-to-r from-[#10a37f] to-[#0e8e6c] text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition"
                    >
                        💾 Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
