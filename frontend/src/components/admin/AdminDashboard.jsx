import React from "react";
import { FiUsers, FiSettings, FiDatabase } from "react-icons/fi";

export default function AdminDashboard() {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 transition-colors duration-300">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">🛠️ Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-10">Manage users, system settings, logs, and more.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    icon={<FiUsers className="text-[#10a37f] text-2xl" />}
                    title="User Management"
                    description="View, update, or remove users from the system."
                />
                <Card
                    icon={<FiSettings className="text-[#10a37f] text-2xl" />}
                    title="System Settings"
                    description="Control platform configurations and global preferences."
                />
                <Card
                    icon={<FiDatabase className="text-[#10a37f] text-2xl" />}
                    title="Email & Activity Logs"
                    description="Review recent email replies, bot activity, and error logs."
                />
            </div>
        </div>
    );
}

const Card = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6 hover:shadow-md transition-all">
        <div className="flex items-center gap-4 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);
