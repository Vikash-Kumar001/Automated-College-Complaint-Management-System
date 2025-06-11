import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // Import the Navbar component

const Terms = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-50 flex flex-col">
            {/* Navbar */}
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl mx-auto bg-white/90 rounded-3xl shadow-2xl border border-indigo-100 p-8 md:p-14">
                    <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center tracking-tight">
                        Terms & <span className="text-blue-600">Conditions</span>
                    </h1>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-indigo-700 mb-2">1. Acceptance of Terms</h2>
                        <p className="text-gray-800">
                            By accessing and using the Automated College Complaint Management System, you agree to comply with and be bound by these terms and conditions. If you do not agree with any part of these terms, you must not use this platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-indigo-700 mb-2">2. User Responsibilities</h2>
                        <p className="text-gray-800">
                            Users are expected to provide accurate information while submitting complaints. Any misuse of the system, including submission of false or misleading complaints, may lead to suspension of access or disciplinary actions as per institutional policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-indigo-700 mb-2">3. Complaint Review Process</h2>
                        <p className="text-gray-800">
                            All complaints submitted through this platform will be reviewed by the designated authorities. The resolution process may vary based on the nature of the complaint and institutional policies.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-indigo-700 mb-2">4. Data Privacy</h2>
                        <p className="text-gray-800">
                            We are committed to protecting your privacy. Personal data provided during complaint registration will be used solely for the purpose of resolving the complaint and will not be shared with unauthorized third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-indigo-700 mb-2">5. Modifications to Terms</h2>
                        <p className="text-gray-800">
                            The institution reserves the right to modify or update these terms at any time without prior notice. It is the user's responsibility to review the terms periodically for any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-indigo-700 mb-2">6. Contact Information</h2>
                        <p className="text-gray-800">
                            If you have any questions or concerns about these terms, please contact us at <strong>support@college.edu</strong>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Terms;