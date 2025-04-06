import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaRobot,
    FaCogs,
    FaStore,
    FaBrain,
    FaSearch,
    FaChartLine,
} from "react-icons/fa";

export default function Homepage() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is Repliora.ai?",
            answer:
                "Repliora is an AI assistant that automates ecommerce customer support.",
        },
        {
            question: "Can it reply to emails automatically?",
            answer:
                "Yes! It detects intent and replies based on your rules and templates.",
        },
        {
            question: "Does it connect to Shopify?",
            answer:
                "Absolutely — we support full Shopify integration with real-time order lookup.",
        },
        {
            question: "Is my data secure?",
            answer:
                "Yes, we store data securely and never share it with third parties.",
        },
    ];

    const features = [
        {
            icon: <FaRobot size={28} />,
            title: "Automated Responses",
            desc: "Instant replies powered by AI-driven accuracy.",
        },
        {
            icon: <FaCogs size={28} />,
            title: "Custom Templates",
            desc: "Match your tone with fully customizable replies.",
        },
        {
            icon: <FaStore size={28} />,
            title: "Shopify Integration",
            desc: "Real-time order lookup straight from Shopify.",
        },
        {
            icon: <FaBrain size={28} />,
            title: "Self-Learning FAQ",
            desc: "Our system improves answers over time.",
        },
        {
            icon: <FaSearch size={28} />,
            title: "Smart Intent Detection",
            desc: "Understands what your customers really want.",
        },
        {
            icon: <FaChartLine size={28} />,
            title: "Analytics & Tagging",
            desc: "Track conversations, performance, and more.",
        },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Hero Section */}
            <main className="flex-grow flex items-center justify-center text-center px-4 py-20">
                <div className="max-w-3xl">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Automate Your Customer Support with{" "}
                        <span className="text-[#10a37f]">Repliora.ai</span>
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Let AI handle your ecommerce emails, replies, and FAQs—smart, fast,
                        and fully customizable.
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/register"
                            className="bg-[#10a37f] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#0e8e6c]"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/features"
                            className="text-[#10a37f] text-lg font-medium hover:underline"
                        >
                            See Features →
                        </Link>
                    </div>
                </div>
            </main>

            {/* Features */}
            <section className="bg-gray-100 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="text-4xl font-bold text-center mb-12">
                        Next-Gen Features
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition-all"
                            >
                                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-[#10a37f]/10 text-[#10a37f] rounded-full text-2xl">
                                    {f.icon}
                                </div>
                                <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
                                <p className="text-gray-600">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h3 className="text-4xl font-bold mb-6">
                        Why Repliora Instead of a Human VA?
                    </h3>
                    <p className="text-gray-700 mb-10 max-w-3xl mx-auto">
                        Traditional customer service teams or virtual assistants are
                        expensive, inconsistent, and slow. Repliora solves all of that.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="bg-gray-50 rounded-xl p-6 border">
                            <h4 className="text-lg font-bold mb-2 text-[#10a37f]">
                                🤖 Repliora.ai
                            </h4>
                            <ul className="text-gray-700 space-y-2 list-disc list-inside">
                                <li>Replies instantly 24/7</li>
                                <li>Understands customer intent</li>
                                <li>Connects directly to Shopify & orders</li>
                                <li>Costs 10x less than hiring support staff</li>
                                <li>Improves automatically via self-learning</li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl p-6 border">
                            <h4 className="text-lg font-bold mb-2 text-red-500">
                                👩‍💼 Human VA
                            </h4>
                            <ul className="text-gray-700 space-y-2 list-disc list-inside">
                                <li>Limited hours & response delays</li>
                                <li>May require training & monitoring</li>
                                <li>No direct access to live store data</li>
                                <li>Monthly salary, tools, and supervision</li>
                                <li>Can't scale instantly with demand</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <h3 className="text-3xl font-bold text-center mb-10">
                        Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="border rounded-lg overflow-hidden bg-white shadow-sm"
                            >
                                <button
                                    className="w-full text-left px-6 py-4 font-medium text-gray-800 flex justify-between items-center"
                                    onClick={() => toggleFAQ(i)}
                                >
                                    {faq.question}
                                    <span className="text-gray-400">
                                        {openIndex === i ? "-" : "+"}
                                    </span>
                                </button>
                                {openIndex === i && (
                                    <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
