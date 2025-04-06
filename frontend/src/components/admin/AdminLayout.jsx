import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar"; // ✅ Make sure this path is correct

export default function AdminLayout() {
    return (
        <div className="flex">
            {/* Sidebar on the left */}
            <Sidebar />

            {/* Main admin area */}
            <main className="main-content">
                <Outlet /> {/* ✅ AdminDashboard or UserManagement will render here */}
            </main>
        </div>
    );
}
