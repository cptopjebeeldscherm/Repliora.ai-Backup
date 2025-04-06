import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function PublicLayout() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem("user_email");
        setIsLoggedIn(!!email);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_id");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold mb-6 text-[#10a37f] hover:underline transition duration-150 ease-in-out">
                        <Link to="/">Repliora.ai</Link>
                    </h1>

                    <nav className="space-x-6 text-base font-medium">
                        <Link to="/about" className="text-gray-700 hover:text-black">About Us</Link>
                        <Link to="/features" className="text-gray-700 hover:text-black">Features</Link>
                        <Link to="/pricing" className="text-gray-700 hover:text-black">Pricing</Link>
                        <Link to="/faqs" className="text-gray-700 hover:text-black">FAQs</Link>
                        <Link to="/support" className="text-gray-700 hover:text-black">Support</Link>

                        {isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="text-[#10a37f] hover:underline px-4 py-2 border border-[#10a37f] rounded-lg"
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-[#10a37f] hover:underline px-4 py-2 border border-[#10a37f] rounded-lg"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-white bg-[#10a37f] px-4 py-2 rounded-lg hover:bg-[#0e8e6c]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-white border-t py-6">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
                    <p>© {new Date().getFullYear()} Repliora.ai — All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
