import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-900 py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          About <span className="text-[#10a37f]">Repliora.ai</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Built for ecommerce. Powered by AI. Discover how we’re reshaping the future of customer support.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        <div className="bg-gray-50 rounded-xl p-8 shadow hover:shadow-lg transition-all">
          <h2 className="text-2xl font-semibold text-[#10a37f] mb-3">🚀 Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            We’re on a mission to revolutionize ecommerce support with smart, scalable AI.
            Repliora eliminates delays, reduces manual work, and empowers brands to deliver fast,
            intelligent, and human-like customer service—at scale.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 shadow hover:shadow-lg transition-all">
          <h2 className="text-2xl font-semibold text-[#10a37f] mb-3">📖 Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            Frustrated by outdated support systems, we created Repliora to give ecommerce brands
            the power of an AI assistant that learns, adapts, and delivers unmatched customer satisfaction—24/7.
          </p>
        </div>
      </div>

      <div className="text-center mt-16 text-gray-600 px-6">
        <div className="inline-block bg-white border rounded-lg px-6 py-4 shadow-sm">
          <p className="text-lg">
            💡 <em>Trusted by forward-thinking ecommerce brands to automate, learn, and grow—together.</em>
          </p>
        </div>
      </div>
    </div>
  );
}
