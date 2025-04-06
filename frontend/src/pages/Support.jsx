import React from "react";
import { FaEnvelope, FaComments, FaClock } from "react-icons/fa";

export default function Support() {
  return (
    <div className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">🛠️ We're Here to Help</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Whether you're just getting started or need advanced support, our team is ready to assist you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email Support */}
          <div className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope className="text-[#10a37f] text-xl" />
              <h2 className="text-xl font-semibold">Email Support</h2>
            </div>
            <p className="text-gray-700 mb-2">
              Got questions about billing, setup, or something technical?
              We’re just a message away.
            </p>
            <p className="text-[#10a37f] font-medium text-sm">📧 support@repliora.ai</p>
          </div>

          {/* Live Chat */}
          <div className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <FaComments className="text-[#10a37f] text-xl" />
              <h2 className="text-xl font-semibold">Live Chat</h2>
            </div>
            <p className="text-gray-700">
              Reach out directly from your dashboard. Our team is available Monday to Friday via the chat bubble.
            </p>
          </div>
        </div>

        {/* Response Time */}
        <div className="mt-12 text-center text-sm text-gray-600 flex items-center justify-center gap-2">
          <FaClock />
          <span>Typical response time: <strong className="text-gray-800">under 12 hours</strong></span>
        </div>
      </div>
    </div>
  );
}
