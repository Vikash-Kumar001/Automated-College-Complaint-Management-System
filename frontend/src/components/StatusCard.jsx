import React from "react";
import { motion } from "framer-motion";
import { FaHourglassHalf, FaTools, FaCheckCircle } from "react-icons/fa";

const statusColors = {
  pending: {
    bg: "bg-white",
    text: "text-yellow-700",
    border: "border-indigo-100",
    icon: <FaHourglassHalf className="text-yellow-500 text-4xl mb-4" />,
    title: "text-indigo-800",
  },
  "in progress": {
    bg: "bg-white",
    text: "text-blue-700",
    border: "border-indigo-100",
    icon: <FaTools className="text-blue-500 text-4xl mb-4" />,
    title: "text-indigo-800",
  },
  resolved: {
    bg: "bg-white",
    text: "text-green-700",
    border: "border-indigo-100",
    icon: <FaCheckCircle className="text-green-500 text-4xl mb-4" />,
    title: "text-indigo-800",
  },
  default: {
    bg: "bg-white",
    text: "text-gray-700",
    border: "border-indigo-100",
    icon: <FaHourglassHalf className="text-gray-500 text-4xl mb-4" />,
    title: "text-indigo-800",
  },
};

const StatusCard = ({ status, count }) => {
  const safeStatus = typeof status === "string" ? status.toLowerCase() : "";
  const { bg, text, border, icon, title } = statusColors[safeStatus] || statusColors.default;

  return (
    <div className="w-[70%] mx-auto px-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl shadow-md border ${bg} ${border} py-6 px-10 flex flex-col items-center text-center`}
      >
        {icon}
        <h3 className={`text-lg font-semibold mb-2 capitalize ${title}`}>
          {status || "Unknown"}
        </h3>
        <div className={`text-3xl font-bold ${text}`}>{count}</div>
      </motion.div>
    </div>
  );
};

export default StatusCard;
