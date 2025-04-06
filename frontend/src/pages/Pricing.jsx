import React from "react";
import { FaCheck } from "react-icons/fa";

const plans = [
  {
    title: "Starter",
    price: "$19/mo",
    description: "Perfect for solo founders and small stores starting out.",
    features: [
      "50 AI replies/month",
      "1 store integration",
      "Basic analytics",
      "FAQ automation",
    ],
  },
  {
    title: "Pro",
    price: "$49/mo",
    description: "For growing ecommerce brands needing automation at scale.",
    features: [
      "Unlimited replies",
      "3 store integrations",
      "Advanced analytics",
      "Smart templates & auto-tagging",
    ],
    popular: true,
  },
  {
    title: "Enterprise",
    price: "Contact Us",
    description: "Tailored AI solutions with advanced controls and onboarding.",
    features: [
      "Custom integrations",
      "Dedicated support",
      "Onboarding assistance",
      "Private hosting options",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white py-20 px-6 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-4">
          💳 Simple, Transparent Pricing
        </h1>

        {/* 14-day trial note */}
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Choose a plan that fits your business. No hidden fees. Cancel anytime.
        </p>

        <p className="text-center text-sm text-[#10a37f] font-medium mb-2 mx-auto mb-12">
          ✨ All plans include a 14-day free trial — no credit card required.
        </p>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative border rounded-xl bg-white shadow-md transition-all hover:shadow-xl p-8 ${plan.popular ? "border-[#10a37f]" : "border-gray-200"
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#10a37f] text-white text-xs px-3 py-1 rounded-bl-xl font-medium">
                  Most Popular
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              <p className="text-4xl font-extrabold text-[#10a37f] mb-6">
                {plan.price}
              </p>

              <ul className="space-y-3 text-gray-700 text-sm mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-[#10a37f] text-white py-2.5 rounded-lg font-medium hover:bg-[#0e8e6c] transition-all">
                {plan.price === "Contact Us" ? "Get in Touch" : "Start Free Trial"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
