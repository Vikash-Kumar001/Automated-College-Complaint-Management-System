import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const ComplaintDetails = () => {
    const { complaintId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/complaints/${complaintId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(response => {
                setComplaint(response.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        axios.get(`http://localhost:5000/api/complaints/${complaintId}/feedback`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                if (Array.isArray(res.data)) setFeedbacks(res.data);
            })
            .catch(() => {});
    }, [complaintId]);

    const handleBackToDashboard = () => {
        if (user?.role === "admin") {
            navigate("/admin-dashboard");
        } else {
            navigate("/dashboard");
        }
    };

    if (loading) return <p className="text-center text-[15px] text-gray-700">Loading complaint details...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
            <motion.div
                className="max-w-2xl mx-auto bg-white/90 p-8 rounded-2xl shadow-xl border border-gray-200"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-3xl font-extrabold mb-6 text-blue-900">Complaint Details</h1>

                {complaint ? (
                    <motion.div className="space-y-2 text-[15px] text-gray-900" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
                        <p><strong>Student Name:</strong> {complaint.studentId?.name || complaint.studentName || "N/A"}</p>
                        <p><strong>Student Branch:</strong> {complaint.studentId?.branch || "N/A"}</p>
                        <p><strong>Complaint About (Category/Branch):</strong> {complaint.branch || complaint.category || "N/A"}</p>
                        <p><strong>Enrollment No.:</strong> {complaint.studentId?.enrollment || "N/A"}</p>
                        <p><strong>Complaint ID:</strong> {complaint._id}</p>
                        <p><strong>Incharge Name:</strong> {complaint.inchargeName || "N/A"}</p>
                        <p><strong>Status:</strong>
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                complaint.status === "resolved"
                                    ? "bg-green-100 text-green-800"
                                    : complaint.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : complaint.status === "in progress"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}>
                                {complaint.status}
                            </span>
                        </p>
                        <p className="mt-3"><strong>Description:</strong> {complaint.description}</p>

                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-2 text-blue-900">Comments</h2>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                {(!complaint.comments || complaint.comments.length === 0) ? (
                                    <p className="text-gray-500">No comments yet.</p>
                                ) : (
                                    complaint.comments.map((c, index) => (
                                        <motion.p
                                            key={index}
                                            className="text-gray-900 mb-1"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.07 }}
                                        >
                                            <strong>{c.author}:</strong> {c.text}
                                        </motion.p>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-2 text-green-800">Feedback</h2>
                            {feedbacks.length > 0 ? (
                                <div className="space-y-3">
                                    {feedbacks.map((fb, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="bg-green-50 p-4 rounded-xl border border-green-100"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: idx * 0.09 }}
                                        >
                                            <p className="text-yellow-600 text-lg font-bold">{'★'.repeat(fb.rating)}</p>
                                            <p className="text-gray-800"><strong>Comment:</strong> {fb.comment || 'No comment'}</p>
                                            <p className="text-gray-600 text-xs">By: {fb.student?.name || 'Student'}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No feedback submitted yet.</p>
                            )}
                        </div>

                        <button
                            onClick={handleBackToDashboard}
                            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            Back to Dashboard
                        </button>
                    </motion.div>
                ) : (
                    <p className="text-red-500">Complaint not found.</p>
                )}
            </motion.div>
        </div>
    );
};

export default ComplaintDetails;
