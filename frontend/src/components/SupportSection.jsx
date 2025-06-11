import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaHeadset } from "react-icons/fa";

export default function SupportSection() {
  return (
    <section className="bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#f0fdfa] w-full h-full p-10 ">
      {/* py-12 px-20 sm:px-20 lg:px-20 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-black text-indigo-700 mb-4 tracking-tight drop-shadow">
          Need Help or Support?
        </h2>
        <p className="text-gray-700 mb-10 text-base md:text-lg">
          Our support team is here to assist students, faculty, and admins with any issues related to complaints or system access.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl">
            <FaEnvelope className="text-indigo-600 text-4xl mb-4" />
            <h3 className="text-lg font-bold text-indigo-800 mb-2">
              Email Us
            </h3>
            <p className="text-sm text-gray-600">vikashkumarsudhi8527@gmail.com</p>
            {/* <p className="text-sm text-gray-600">support@collegecomplaints.edu</p> */}
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl">
            <FaPhoneAlt className="text-green-500 text-4xl mb-4" />
            <h3 className="text-lg font-bold text-indigo-800 mb-2">
              Call Us
            </h3>
            <p className="text-sm text-gray-600">+91-8595654823</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl">
            <FaHeadset className="text-purple-600 text-4xl mb-4" />
            <h3 className="text-lg font-bold text-indigo-800 mb-2">
              Live Support
            </h3>
            <p className="text-sm text-gray-600">Available 9 AM - 6 PM (Mon - Fri)</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}