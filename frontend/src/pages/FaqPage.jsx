import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Repliora.ai?",
      answer:
        "Repliora.ai is a virtual assistant built for ecommerce stores. It uses AI to automatically answer customer emails, match FAQs, and even look up Shopify orders in real-time.",
    },
    {
      question: "Can it reply to customer emails automatically?",
      answer:
        "Yes! Repliora uses intent detection, smart tagging, and customizable templates to auto-reply to common inquiries such as shipping times, refunds, and order status.",
    },
    {
      question: "Does Repliora.ai integrate with Shopify?",
      answer:
        "Absolutely. You can securely connect your Shopify store and let Repliora fetch order info, shipping updates, and customer details to enhance replies.",
    },
    {
      question: "Is it beginner friendly?",
      answer:
        "Very much so. You’ll be guided with a step-by-step onboarding quiz and can easily manage everything through the clean dashboard.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Yes. Your email credentials are stored locally and never shared or uploaded to the cloud. We prioritize security and privacy.",
    },
    {
      question: "Can I customize my replies?",
      answer:
        "Definitely. You can edit all default templates or add your own per category, ensuring every reply reflects your brand’s tone.",
    },
  ];

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white py-20 px-6 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12">
          🙋 Frequently Asked <span className="text-[#10a37f]">Questions</span>
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`transition-all duration-200 rounded-xl shadow-sm border ${openIndex === index ? "bg-white border-[#10a37f]" : "bg-gray-50 border-gray-200"
                }`}
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="font-semibold text-lg text-gray-800">{faq.question}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-[#10a37f]" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-gray-600 text-[15px] leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
