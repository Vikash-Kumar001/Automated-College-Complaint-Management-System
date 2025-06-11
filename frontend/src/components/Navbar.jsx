import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const isLoggedIn = localStorage.getItem("token"); // Check if user is logged in

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 70 }}
            className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-indigo-100 py-4 px-6 flex justify-between items-center sticky top-0 z-30"
        >
            {/* 🔹 Brand Name */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 60 }}
            >
                <Link to="/" className="text-2xl md:text-3xl font-black text-indigo-700 tracking-wider drop-shadow">
                    Starex University
                </Link>
            </motion.div>

            {/* 🔹 Navigation Links */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15, type: "spring", stiffness: 60 }}
                className="space-x-4 md:space-x-6"
            >
                {!isLoggedIn ? (
                    <>
                        <Link to="/register" className="hover:underline font-bold text-indigo-700 hover:text-purple-600 transition-all">Register</Link>
                        <Link to="/login" className="hover:underline font-bold text-indigo-700 hover:text-purple-600 transition-all">Login</Link>
                    </>
                ) : (
                    <Link to="/dashboard" className="hover:underline font-bold text-indigo-700 hover:text-purple-600 transition-all">Dashboard</Link>
                )}
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;