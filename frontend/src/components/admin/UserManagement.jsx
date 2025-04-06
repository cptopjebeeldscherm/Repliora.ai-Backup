import React, { useEffect, useState } from "react";
import api from "../../utils/api"; // Axios instance

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await api.get("/admin/users"); // This should hit the backend that reads from users.json
            setUsers(response); // Axios already returns data directly
        } catch (err) {
            setError("Failed to fetch users.");
        }
    };

    const handleRoleChange = async (email, newRole) => {
        try {
            await api.post("/admin/update-role", {
                user_id: email,
                role: newRole,
            });
            fetchUsers(); // Refresh after change
        } catch (err) {
            console.error("Failed to update role:", err);
            alert("Error updating role.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-6 min-h-screen bg-white dark:bg-gray-900">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">👥 User Management</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                        {users.map((user) => (
                            <tr key={user.email}>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{user.email}</td>
                                <td className="px-6 py-4 text-sm capitalize text-gray-700 dark:text-gray-200">
                                    {user.role || "user"}
                                </td>
                                <td className="px-6 py-4">
                                    {user.role !== "admin" && (
                                        <button
                                            onClick={() => handleRoleChange(user.email, "admin")}
                                            className="bg-[#10a37f] text-white px-3 py-1 rounded text-sm hover:bg-[#0e8e6c]"
                                        >
                                            Promote to Admin
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
