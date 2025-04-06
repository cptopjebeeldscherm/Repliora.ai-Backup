import React from "react";
import {
  FaRobot,
  FaChartLine,
  FaSyncAlt,
  FaClipboardList,
  FaCogs,
  FaClock,
  FaLanguage,
  FaEnvelopeOpenText,
  FaBell,
  FaUserShield,
  FaTags,
} from "react-icons/fa";

export default function Features() {
  const features = [
    {
      title: "Smart Auto-Replies",
      description: "Automatically respond to emails based on customer intent using AI.",
      icon: <FaRobot />,
    },
    {
      title: "Self-Learning FAQ Engine",
      description: "Learns from unanswered messages and admin input to continuously improve.",
      icon: <FaClipboardList />,
    },
    {
      title: "Live Shopify Integration",
      description: "Look up orders, shipping updates, and customer info from your Shopify store.",
      icon: <FaSyncAlt />,
    },
    {
      title: "Customizable Templates",
      description: "Fully editable email templates for every scenario—delivery, refund, return, and more.",
      icon: <FaCogs />,
    },
    {
      title: "Performance Analytics",
      description: "Track email stats, confidence scores, reply rates, and user engagement over time.",
      icon: <FaChartLine />,
    },
    {
      title: "Auto-Scheduling",
      description: "Set custom hours for when Repliora should auto-reply—ideal for support hours.",
      icon: <FaClock />,
    },
    {
      title: "Multi-language Support",
      description: "Support multiple languages to better serve international customers.",
      icon: <FaLanguage />,
    },
    {
      title: "Manual Review Inbox",
      description: "Review and manually respond to low-confidence emails through the admin console.",
      icon: <FaEnvelopeOpenText />,
    },
    {
      title: "Notification Center",
      description: "Get notified for urgent emails, failed replies, or unusual trends in your inbox.",
      icon: <FaBell />,
    },
    {
      title: "Secure Email Credentials",
      description: "Safely store and manage your email login details locally—no cloud sync.",
      icon: <FaUserShield />,
    },
    {
      title: "Smart Tagging System",
      description: "Automatically assign tags like ‘Refunds’, ‘Orders’, or ‘Urgent’ to every incoming email.",
      icon: <FaTags />,
    },
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-6 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12">
          🚀 Features That Power <span className="text-[#10a37f]">Repliora.ai</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-6 text-center"
            >
              <div className="flex justify-center items-center mb-4 text-[#10a37f] text-3xl">
                {feat.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
              <p className="text-gray-600 text-sm">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
