import React from "react";
import EmailAutomation from "./EmailAutomation";
import EmailCredentials from "./EmailCredentials";
import LoginSection from "./LoginSection";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">📊 Email Bot Dashboard</h1>

        <LoginSection />

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <EmailAutomation />
          <EmailCredentials />
        </div>
      </div>
    </div>
  );
}
