import React, { useEffect, useState } from "react";
import api from "../utils/api"; // make sure the path is correct

export default function EmailComponent() {
    const [emails, setEmails] = useState([]);
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("user_email");
        if (!storedEmail) {
            console.warn("No user email found. Make sure the user is logged in.");
            return;
        }

        setUserEmail(storedEmail);

        api.get("/confidence-threshold")
            .then((data) => setConfidenceThreshold(data.threshold))
            .catch((err) => console.error("Failed to fetch threshold:", err));

        api.get("/unanswered")
            .then((data) => setEmails(data))
            .catch((err) => console.error("Failed to fetch emails:", err));
    }, []);

    const customerEmails = emails.filter((e) => e.score >= confidenceThreshold);
    const otherEmails = emails.filter((e) => e.score < confidenceThreshold);

    const renderEmails = (list) =>
        list.map((email, index) => (
            <div
                key={index}
                className="bg-white border border-gray-100 shadow-md rounded-xl p-5 hover:shadow-lg transition"
            >
                <div className="flex justify-between items-center mb-3">
                    <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${email.score >= 0.8
                                ? "bg-green-100 text-green-800"
                                : email.score >= 0.5
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        Score: {(email.score * 100).toFixed(0)}%
                    </span>
                    <span className="text-xs text-gray-400">Unanswered</span>
                </div>

                <p className="text-gray-800 whitespace-pre-line text-sm">
                    {email.body.length > 300
                        ? `${email.body.substring(0, 300)}...`
                        : email.body}
                </p>

                {email.body.length > 300 && (
                    <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-[#10a37f] hover:underline">
                            Read full email
                        </summary>
                        <div className="mt-2 text-gray-700 text-sm whitespace-pre-line">
                            {email.body}
                        </div>
                    </details>
                )}
            </div>
        ));

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center mb-10">📭 Unanswered Emails</h1>

            {!userEmail && (
                <div className="text-center text-red-600 font-medium mb-6">
                    No user email found. Please make sure you're logged in.
                </div>
            )}

            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">
                    🟢 Likely from Customers
                </h2>
                <div className="space-y-6">
                    {customerEmails.length > 0 ? (
                        renderEmails(customerEmails)
                    ) : (
                        <p className="text-sm text-gray-500">No high-confidence emails available.</p>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-yellow-700 mb-4">
                    🟡 Other Emails
                </h2>
                <div className="space-y-6">
                    {otherEmails.length > 0 ? (
                        renderEmails(otherEmails)
                    ) : (
                        <p className="text-sm text-gray-500">No low-confidence emails found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
