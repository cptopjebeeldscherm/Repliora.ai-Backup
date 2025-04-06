import React, { useState } from "react";

export default function ShippingLookup() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [result, setResult] = useState(null);

    const handleTrack = () => {
        // Simulate tracking for now
        if (trackingNumber.trim() === "") {
            alert("Please enter a tracking number.");
            return;
        }

        setResult({
            status: "In Transit",
            carrier: "DHL",
            expectedDelivery: "April 8, 2025",
            lastUpdate: "April 2, 2025 - 15:30",
        });
    };

    return (
        <div className="max-w-xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-semibold mb-4">📦 Shipping Lookup</h1>
            <p className="text-gray-600 mb-6">
                Enter a tracking number to check shipping status (simulated for now).
            </p>

            <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
                <input
                    type="text"
                    placeholder="Enter tracking number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
                <button
                    onClick={handleTrack}
                    className="bg-[#10a37f] hover:bg-[#0e8e6c] text-white px-4 py-2 rounded"
                >
                    Track Package
                </button>
            </div>

            {result && (
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                    <h2 className="font-semibold text-lg mb-2">Tracking Result</h2>
                    <p><strong>Status:</strong> {result.status}</p>
                    <p><strong>Carrier:</strong> {result.carrier}</p>
                    <p><strong>Expected Delivery:</strong> {result.expectedDelivery}</p>
                    <p><strong>Last Update:</strong> {result.lastUpdate}</p>
                </div>
            )}
        </div>
    );
}
