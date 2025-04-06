// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './styles.css';

const Sidebar = () => {
    const base = "/dashboard";
    const navigate = useNavigate();
    const [role, setRole] = useState("");

    useEffect(() => {
        const storedRole = localStorage.getItem("user_role");
        if (storedRole) setRole(storedRole);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_role");
        navigate("/"); // Redirect to homepage
    };

    return (
        <div className="sidebar">
            <h2 className="mb-6">
                <NavLink to="/" className="sidebar-logo-link">Repliora.AI</NavLink>
            </h2>

            <ul className="space-y-1">
                {/* Main Section */}
                <li className="section-label">Main</li>
                <li><NavLink to={`${base}`} end className={({ isActive }) => isActive ? "active" : ""}>📊 Dashboard</NavLink></li>
                <li><NavLink to={`${base}/email-automation`} className={({ isActive }) => isActive ? "active" : ""}>🤖 Email Automation</NavLink></li>
                <li><NavLink to={`${base}/email-credentials`} className={({ isActive }) => isActive ? "active" : ""}>🔐 Email Credentials</NavLink></li>
                <li><NavLink to={`${base}/answered-emails`} className={({ isActive }) => isActive ? "active" : ""}>📩 Answered Emails</NavLink></li>
                <li><NavLink to={`${base}/unanswered-emails`} className={({ isActive }) => isActive ? "active" : ""}>📭 Unanswered Emails</NavLink></li>
                <li><NavLink to={`${base}/faq-manager`} className={({ isActive }) => isActive ? "active" : ""}>💬 FAQ Manager</NavLink></li>

                {/* Smart Features */}
                <li className="section-label">Smart Features</li>
                <li><NavLink to={`${base}/self-learning-faq`} className={({ isActive }) => isActive ? "active" : ""}>🧠 Self-learning FAQ</NavLink></li>
                <li><NavLink to={`${base}/confidence-tuning`} className={({ isActive }) => isActive ? "active" : ""}>📈 Confidence Tuning</NavLink></li>
                <li><NavLink to={`${base}/auto-reply-scheduling`} className={({ isActive }) => isActive ? "active" : ""}>🕓 Auto-Reply Scheduling</NavLink></li>
                <li><NavLink to={`${base}/auto-sync`} className={({ isActive }) => isActive ? "active" : ""}>🔁 Auto-Sync with Email</NavLink></li>

                {/* Integrations */}
                <li className="section-label">Integrations</li>
                <li><NavLink to={`${base}/shopify-integration`} className={({ isActive }) => isActive ? "active" : ""}>🛒 Shopify Integration</NavLink></li>
                <li><NavLink to={`${base}/shipping-lookup`} className={({ isActive }) => isActive ? "active" : ""}>📦 Shipping Lookup</NavLink></li>

                {/* System */}
                <li className="section-label">System</li>
                <li><NavLink to={`${base}/settings`} className={({ isActive }) => isActive ? "active" : ""}>⚙️ Settings</NavLink></li>
                <li><NavLink to={`${base}/account`} className={({ isActive }) => isActive ? "active" : ""}>👤 Account</NavLink></li>

                {/* Other */}
                <li className="section-label">Other</li>
                <li><NavLink to={`${base}/logs`} className={({ isActive }) => isActive ? "active" : ""}>🧾 Logs / Activity History</NavLink></li>
                <li><NavLink to={`${base}/manual-reply`} className={({ isActive }) => isActive ? "active" : ""}>📤 Manual Reply Console</NavLink></li>
                <li><NavLink to={`${base}/help`} className={({ isActive }) => isActive ? "active" : ""}>📚 Help / Documentation</NavLink></li>
                <li><NavLink to={`${base}/notifications`} className={({ isActive }) => isActive ? "active" : ""}>🔔 Notification Center</NavLink></li>

                {/* Admin Section */}
                {role === "admin" && (
                    <>
                        <li className="section-label">Admin</li>
                        <li><NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>🛠️ Admin Dashboard</NavLink></li>
                        <li><NavLink to="/admin/user-management" className={({ isActive }) => isActive ? "active" : ""}>👥 User Management</NavLink></li>
                    </>
                )}

                {/* Logout Button */}
                <li>
                    <button
                        onClick={handleLogout}
                        className="w-full text-sm font-semibold text-white py-2 mt-4 rounded-md transition duration-200"
                        style={{
                            backgroundColor: "#10a37f",
                            boxShadow: "0 0 12px #15803d",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#16a34a";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#10a37f";
                        }}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
