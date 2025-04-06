import React from "react";

export default function Help() {
    const sections = [
        {
            title: "🛠️ Step 1: Complete the Store Setup Quiz",
            content: [
                "Navigate to the **Email Automation** tab to begin.",
                "You’ll be guided through a short quiz to enter your:",
                "• **Store Name** (used in greetings)",
                "• **Processing Time** and **Shipping Time**",
                "• **Shipping Partner**, **Return Policy URL**, **Support Email**, **Location**, and **Signature**",
                "**Why this matters**: These values are used to dynamically personalize each reply using placeholders like [storeName], [supportEmail], [signature].",
                "Click **Finish** to save your setup. You can always update it later via ⚙️ **Edit Store Info** or 🔁 **Restart Quiz** to start over."
            ]
        },
        {
            title: "✉️ Step 2: Connect Your Email",
            content: [
                "In the **Settings** tab, add your support inbox credentials.",
                "**Gmail Users**:",
                "• Enable IMAP in your Gmail settings",
                "• Use a secure **App Password**, not your regular password. Visit: https://myaccount.google.com/apppasswords",
                "**Other Providers**: Enter your correct IMAP/SMTP credentials and port info.",
                "Once set, your inbox is ready to be scanned by Repliora’s AI."
            ]
        },
        {
            title: "⚡ Step 3: Automate with Email Templates",
            content: [
                "After the quiz, you can access a library of **pre-made smart templates** under the Email Automation tab.",
                "Each template belongs to a **category**: Orders, Shipping, Refunds, Returns, Issues.",
                "Click on any template to see a **live preview** filled with your store data.",
                "✍️ You can edit the reply text, add your own templates, or delete existing ones.",
                "Every time a customer sends an email, Repliora matches it to the **right category**, selects the best template, and fills in your store’s info automatically."
            ]
        },
        {
            title: "💬 Step 4: Train the AI with FAQs",
            content: [
                "Go to the **FAQ Manager** tab to help the AI understand how your customers ask questions.",
                "You can:",
                "• Add questions manually with a category (e.g. 'Where is my order?' → Orders)",
                "• Upload a CSV file of common questions",
                "• Edit, remove or simulate chats to test the replies",
                "The system uses these FAQs to detect **intent** and route messages to the right reply templates."
            ]
        },
        {
            title: "🤖 Step 5: How Auto-Replies Work",
            content: [
                "Here’s what happens under the hood:",
                "1. The AI scans your inbox for new **unread** messages",
                "2. It uses NLP to detect the **intent** (e.g. refund, order issue, delivery)",
                "3. If there’s a confident match in the templates, it sends a **personalized auto-reply** using your store info",
                "4. If not confident, it adds the email to your **Unanswered Emails** list so you can reply manually",
                "💡 You can configure your desired **confidence threshold** to control how cautious the AI is."
            ]
        },
        {
            title: "📬 Answered Emails (💬 Inbox History)",
            content: [
                "All successful replies are logged in the **Answered Emails** tab.",
                "You’ll see:",
                "• Sender email, subject, original message, and the reply sent",
                "• Detected **intent** and **tags** (e.g. Orders, Urgent, VIP)",
                "• A filter tool so you can search by tag or issue type",
                "**Why it matters**: This gives you full transparency into your AI’s performance and helps you fine-tune replies."
            ]
        },
        {
            title: "📥 Unanswered Emails",
            content: [
                "Emails the bot wasn’t confident enough to reply to are shown here.",
                "This means the AI wasn’t 100% sure which template to use, so it didn’t send anything.",
                "Use this list to:",
                "• Review tricky messages manually",
                "• Improve your templates or FAQs to better match the question",
                "• Re-run the bot later if needed"
            ]
        },
        {
            title: "📊 Analytics & Confidence Settings",
            content: [
                "Under the **Analytics** page, you’ll see:",
                "• Total emails processed",
                "• Replied vs Unanswered ratio",
                "• Average AI confidence score per message",
                "• Daily reply trends",
                "**Pro Tip**: If too many messages go unanswered, try lowering the confidence threshold or expanding your FAQ coverage."
            ]
        },
        {
            title: "🎯 Best Practices",
            content: [
                "• Make sure your **store info** is complete before editing templates",
                "• Use short, clear phrases for FAQs (e.g. 'track my order')",
                "• Keep your tone helpful, calm, and brand-aligned",
                "• Check Answered Emails weekly to ensure AI accuracy",
                "• Always test using the built-in chat simulator at the bottom of the FAQ Manager"
            ]
        },
        {
            title: "🆘 Still Need Help?",
            content: [
                "We're here for you. If you’re experiencing bugs, errors or confusion:",
                "• Double check your email setup (App Passwords, IMAP enabled)",
                "• Review your template categories and store info",
                "• Contact support through your dashboard (coming soon)",
                "• Or shoot us an email at support@yourcompany.com"
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-[#10a37f]">📖 Help & Documentation</h1>
            <p className="text-xl font-bold mb-6 text-[#10a37f]">👋 Welcome to Repliora AI!</p>
            <p className="text-gray-600 mb-10 leading-relaxed">
                We're so glad you're here! Repliora is your AI-powered virtual assistant designed to help ecommerce stores respond to customer emails — instantly, accurately, and personally.
                This guide will walk you through **everything you need** to get started — from setting up your store, to automating replies, tracking performance, and troubleshooting.
                Let’s get you fully automated — so you never miss a customer again. 💪
            </p>

            <div className="space-y-6">
                {sections.map((section, index) => (
                    <details
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm group"
                    >
                        <summary className="text-lg font-semibold cursor-pointer text-[#10a37f] group-open:mb-3">
                            {section.title}
                        </summary>
                        <ul className="list-disc list-inside text-gray-800 space-y-2 mt-2">
                            {section.content.map((line, i) => (
                                <li key={i}>
                                    <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                                </li>
                            ))}
                        </ul>
                    </details>
                ))}
            </div>
        </div>
    );
}
