// src/components/DashboardLayout.jsx
import React from "react";
import Sidebar from "./Sidebar"; // Import Sidebar
import { Outlet } from "react-router-dom"; // This will render the nested routes

const DashboardLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="main-content">
        <Outlet /> {/* This is where the child routes will render */}
      </div>
    </div>
  );
};

export default DashboardLayout;
