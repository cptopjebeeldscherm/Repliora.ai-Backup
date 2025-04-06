import React, { useState, useEffect } from "react";
import api from "../utils/api"; // ✅ Ensure this path is correct

export default function ShopifyIntegration() {
    const [shopDomain, setShopDomain] = useState("");
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        api
            .get("/shopify-credentials")
            .then((data) => {
                if (data?.shopDomain) setShopDomain(data.shopDomain);
                if (data?.accessToken) setAccessToken(data.accessToken);
            })
            .catch((err) => {
                console.error("Failed to load saved Shopify credentials:", err);
            });
    }, []);

    const handleConnect = async () => {
        if (!shopDomain || !accessToken) {
            alert("⚠️ Both fields are required.");
            return;
        }

        try {
            await api.post("/shopify-credentials", {
                shopDomain,
                accessToken,
            });

            alert("✅ Shopify store connected successfully!");
        } catch (err) {
            console.error("❌ Error connecting store:", err);
            alert("❌ Failed to connect Shopify store.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-extrabold mb-2 text-gray-900">🛒 Shopify Integration</h1>
            <p className="text-gray-600 mb-8">
                Securely connect your Shopify store to sync real-time order and shipping data.
            </p>

            <div className="relative bg-white border border-gray-200 rounded-xl shadow-xl p-6 space-y-6 overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#10a37f] via-transparent to-[#0e8e6c] blur-lg opacity-10 rounded-xl"></div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Domain
                    </label>
                    <input
                        type="text"
                        placeholder="your-store.myshopify.com"
                        value={shopDomain}
                        onChange={(e) => setShopDomain(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-[#10a37f] focus:border-[#10a37f]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Access Token
                    </label>
                    <input
                        type="password"
                        placeholder="Your Access Token"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-[#10a37f] focus:border-[#10a37f]"
                    />
                </div>

                <button
                    onClick={handleConnect}
                    className="w-full bg-gradient-to-r from-[#10a37f] to-[#0e8e6c] text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition duration-300"
                >
                    🚀 Connect Store
                </button>
            </div>
        </div>
    );
}
