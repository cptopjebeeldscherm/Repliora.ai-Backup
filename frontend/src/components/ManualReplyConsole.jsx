import React, { useEffect, useState } from "react";

export default function TestPage() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        fetch("http://localhost:8000")
            .then((res) => {
                if (!res.ok) throw new Error("Backend not reachable");
                return res.text();
            })
            .then((data) => setMessage("✅ Backend connected"))
            .catch((err) => {
                console.error(err);
                setMessage("❌ Backend connection failed");
            });
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Test Page</h1>
            <p className="text-gray-700">{message}</p>
        </div>
    );
}
