import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Contact = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-50 flex flex-col">
            <Navbar/>

            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl border border-indigo-100 p-8 md:p-14">
                    <h1 className="text-4xl font-extrabold text-indigo-800 mb-4 text-center tracking-tight">
                        Contact <span className="text-blue-600">Support</span>
                    </h1>
                    <p className="text-gray-600 text-center mb-10">
                        If you have any questions, issues, or need help using the Complaint Management System,
                        feel free to reach out through the form below or use our contact details.
                    </p>
                    <form className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Your Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                placeholder="example@college.edu.in"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Student ID / Enrollment No.</label>
                            <input
                                type="text"
                                placeholder="Enter your student ID"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                rows="4"
                                placeholder="Describe your issue or inquiry..."
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
                        >
                            Submit Query
                        </button>
                    </form>
                    <div className="mt-10 text-center space-y-4">
                        <p className="text-gray-700">You can also reach us at:</p>
                        <p>Email: <a href="mailto:support@collegecms.edu.in" className="text-blue-600 underline">support@collegecms.edu.in</a></p>
                        <p>Phone: <span className="text-gray-800">+91 85956 54823</span></p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;