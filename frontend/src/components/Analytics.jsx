import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";

export default function Analytics() {
    const [data, setData] = useState({
        total_emails_processed: 0,
        total_replied: 0,
        total_unanswered: 0,
        average_confidence: 0,
        chart: [],
    });

    useEffect(() => {
        const userEmail = localStorage.getItem("user_email");

        fetch("http://localhost:8000/get-analytics", {
            headers: { "x-user-email": userEmail },
        })
            .then((res) => res.json())
            .then((analyticsData) => setData(analyticsData))
            .catch((err) => console.error("Failed to load analytics:", err));
    }, []);

    return (
        <div className="min-h-screen p-6 bg-white dark:bg-gray-900 transition-colors duration-300">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">📊 Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard title="Emails Processed" value={data.total_emails_processed} />
                <StatCard title="Total Replied" value={data.total_replied} />
                <StatCard title="Unanswered Emails" value={data.total_unanswered} />
                <StatCard title="Avg. Confidence" value={data.average_confidence?.toFixed(2)} />
            </div>

            <ChartCard title="📈 Processed vs Replied Emails (Last 14 Days)">
                <LineChart data={data.chart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="processed" stroke="#10a37f" strokeWidth={2} />
                    <Line type="monotone" dataKey="replied" stroke="#1f2937" strokeWidth={2} />
                </LineChart>
            </ChartCard>

            <ChartCard title="🔍 Confidence Score Over Time">
                <AreaChart data={data.chart}>
                    <defs>
                        <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10a37f" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10a37f" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="confidence" stroke="#10a37f" fillOpacity={1} fill="url(#colorConf)" />
                </AreaChart>
            </ChartCard>
        </div>
    );
}

const StatCard = ({ title, value }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6 text-center hover:shadow-md transition-all">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h4>
        <p className="text-3xl font-bold text-[#10a37f]">{value ?? "0"}</p>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
            {children}
        </ResponsiveContainer>
    </div>
);
