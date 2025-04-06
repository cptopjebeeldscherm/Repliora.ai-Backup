import React, { useEffect, useState } from "react";

export default function AnsweredEmails() {
    const [answeredEmails, setAnsweredEmails] = useState([]);
    const [filteredEmails, setFilteredEmails] = useState([]);
    const [selectedTag, setSelectedTag] = useState("All");
    const [allTags, setAllTags] = useState([]);

    const tagColors = {
        Orders: "bg-blue-600",
        Refunds: "bg-purple-600",
        Returns: "bg-yellow-500",
        Shipping: "bg-green-600",
        Issues: "bg-red-600",
        Payment: "bg-pink-600",
        Cancellations: "bg-orange-500",
        Urgent: "bg-rose-600",
        VIP: "bg-amber-600",
        General: "bg-gray-500",
    };

    useEffect(() => {
        const userEmail = localStorage.getItem("user_email");

        if (!userEmail) {
            console.warn("No user email found in localStorage.");
            return;
        }

        fetch("http://localhost:8000/answered-emails", {
            headers: {
                "x-user-email": userEmail,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setAnsweredEmails(data);
                setFilteredEmails(data);

                const tags = new Set();
                data.forEach((email) => {
                    email.tags?.forEach((tag) => tags.add(tag));
                });
                setAllTags(["All", ...Array.from(tags)]);
            })
            .catch((err) =>
                console.error("Error loading answered emails:", err)
            );
    }, []);

    const handleFilterChange = (tag) => {
        setSelectedTag(tag);
        if (tag === "All") {
            setFilteredEmails(answeredEmails);
        } else {
            const filtered = answeredEmails.filter((email) =>
                email.tags?.includes(tag)
            );
            setFilteredEmails(filtered);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
                📩 Answered Emails
            </h1>

            <div className="flex flex-wrap gap-3 justify-center mb-10">
                {allTags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleFilterChange(tag)}
                        className={`px-5 py-2 rounded-full font-medium text-sm shadow transition-all duration-200 ${selectedTag === tag
                            ? "bg-[#10a37f] text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {filteredEmails.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">No emails found for this category.</p>
            ) : (
                <div className="space-y-8">
                    {filteredEmails.map((email, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-100 shadow-md rounded-xl p-6 hover:shadow-lg transition"
                        >
                            <div className="flex justify-between flex-wrap items-start gap-4">
                                <div className="text-sm text-gray-800 space-y-2">
                                    <p>
                                        <span className="font-medium text-gray-500">From:</span>{" "}
                                        {email.from}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-500">Subject:</span>{" "}
                                        {email.subject}
                                    </p>
                                    <div className="mt-4 text-sm text-gray-700">
                                        <p className="font-semibold text-gray-600 mb-1">Message:</p>
                                        <div className="whitespace-pre-line bg-gray-50 p-3 rounded text-gray-800">
                                            {email.message}
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-700">
                                        <p className="font-semibold text-gray-600 mb-1">Reply:</p>
                                        <div className="whitespace-pre-line bg-green-50 p-3 rounded text-gray-800">
                                            {email.reply}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {email.tags?.map((tag, j) => (
                                        <span
                                            key={j}
                                            className={`text-xs text-white px-3 py-1 rounded-full font-medium ${tagColors[tag] || "bg-gray-500"
                                                }`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
