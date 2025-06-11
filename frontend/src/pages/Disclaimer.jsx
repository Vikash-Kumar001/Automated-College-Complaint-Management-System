import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Disclaimer = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-50 flex flex-col">
            <Navbar/>

            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl mx-auto bg-white/90 rounded-3xl shadow-2xl border border-indigo-100 p-8 md:p-14 text-gray-800">
                    <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center tracking-tight">
                        Platform <span className="text-blue-600">Disclaimer</span>
                    </h1>

                    <p className="mb-6 text-gray-800 text-base text-center">
                        The information provided by the <strong>Automated College Complaint Management System</strong> is for general
                        informational and grievance redressal purposes within the institution only.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-700 mt-10 mb-4">Official Use Only</h2>
                    <p className="mb-6">
                        This platform is intended solely for registered students, faculty, and administrative staff. Unauthorized use is prohibited and may result in disciplinary action.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-700 mt-10 mb-4">No Legal Liability</h2>
                    <p className="mb-6">
                        The system administrators and college authorities are not legally liable for any information entered by users. Complaints must be genuine and submitted with accurate details.
                    </p>

                    <h2 className="text-2xl font-bold text-indigo-700 mt-10 mb-4">External Content</h2>
                    <p className="mb-6">
                        This platform does not include or endorse external content or third-party links unless officially approved by the institution.
                    </p>

                    <p className="mt-10 text-sm text-gray-500 text-center">
                        Last updated: April 10, 2025
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Disclaimer;