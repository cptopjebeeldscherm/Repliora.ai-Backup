import React, { useState, useEffect } from "react";

export default function AccountSettings() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
    });

    useEffect(() => {
        const storedEmail = localStorage.getItem("user_email");
        const storedName = localStorage.getItem("user_name");

        if (storedEmail) {
            setFormData((prev) => ({ ...prev, email: storedEmail }));
        }

        if (storedName) {
            setFormData((prev) => ({ ...prev, name: storedName }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        localStorage.setItem("user_email", formData.email);
        localStorage.setItem("user_name", formData.name);
        alert("✅ Account settings updated!");
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="bg-white shadow-xl rounded-xl p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-900">👤 Account Settings</h1>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Full Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-[#10a37f] focus:outline-none transition-all"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Email Address</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                            placeholder="you@example.com"
                            type="email"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Current Password</label>
                        <input
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-[#10a37f] focus:outline-none transition-all"
                            type="password"
                            placeholder="********"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">New Password</label>
                        <input
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-[#10a37f] focus:outline-none transition-all"
                            type="password"
                            placeholder="********"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-6 bg-gradient-to-r from-[#10a37f] to-[#0e8e6c] text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-all"
                    >
                        💾 Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
