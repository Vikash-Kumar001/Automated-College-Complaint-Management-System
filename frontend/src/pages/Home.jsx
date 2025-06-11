import React from "react";
import { Link } from "react-router-dom";
import HOMEIMAGE from "../assets/complaint-resolution.jpg";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const features = [
    {
        title: "Helping Hand",
        desc: "Easy complaint submission and support for students and staff. We bridge the communication gap for a better campus experience.",
        icon: "🤝"
    },
    {
        title: "Instant Notification",
        desc: "Get real-time updates and notifications about your complaint status and actions taken by the administration.",
        icon: "🔔"
    },
    {
        title: "Track Progress",
        desc: "Monitor your complaint at every stage with a transparent dashboard and timely status updates.",
        icon: "📊"
    },
    {
        title: "Secure & Private",
        desc: "Your data and complaints are handled securely and confidentially, ensuring your privacy is always protected.",
        icon: "🔒"
    }
];

const featureVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.1 + i * 0.13, duration: 0.6, type: "spring", stiffness: 80 }
    }),
};

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#f0fdfa] flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 70 }}
                className="flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-16 py-10 md:py-16 bg-gradient-to-tr from-white/80 via-purple-50 to-indigo-50 rounded-b-[2rem] shadow-2xl mt-4"
            >
                {/* Hero Text */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 60 }}
                    className="w-full md:w-1/2 text-center md:text-left"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 leading-tight drop-shadow mb-4">
                        Complaint Management <br />
                        <span className="text-indigo-700">for Starex University</span>
                    </h2>
                    <p className="mt-2 text-gray-700 text-base md:text-lg font-medium">
                        Empowering students and staff to resolve issues quickly and transparently.
                    </p>
                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start"
                    >
                        <Link
                            to="/register"
                            className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-all"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="px-7 py-3 bg-white text-indigo-700 border-2 border-indigo-200 rounded-xl shadow-xl font-bold text-base hover:bg-indigo-50 hover:scale-105 transition-all"
                        >
                            Login
                        </Link>
                    </motion.div>
                </motion.div>
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, type: "spring", stiffness: 60 }}
                    className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0"
                >
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        className="relative group"
                    >
                        <img
                            src={HOMEIMAGE}
                            alt="Complaint System"
                            className="max-w-[90vw] md:max-w-[340px] rounded-2xl shadow-2xl border-8 border-white/80 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-lg text-base font-bold opacity-95"
                        >
                            24/7 Support
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <section className="py-14 px-4 md:px-16 bg-gradient-to-br from-white via-indigo-50 to-purple-50 flex-1">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-center text-2xl md:text-3xl font-black text-indigo-700 mb-10 tracking-tight drop-shadow"
                >
                    Why Choose Us?
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            variants={featureVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            className="bg-white/95 p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center border-2 border-indigo-100 hover:scale-105 hover:shadow-indigo-200 transition-all duration-300"
                        >
                            <span className="text-4xl mb-4">{feature.icon}</span>
                            <h4 className="text-lg font-bold text-indigo-700 mb-1">{feature.title}</h4>
                            <p className="text-gray-600 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
            <style>
                {`
                .bg-glass {
                    background: rgba(255,255,255,0.7);
                    backdrop-filter: blur(12px);
                }
                `}
            </style>
        </div>
    );
};

export default Home;