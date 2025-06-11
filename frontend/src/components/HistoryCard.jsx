import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const StarRating = ({ rating, setRating, disabled }) => (
    <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                className={`text-xl md:text-2xl transition-colors duration-150 ${star <= rating ? "text-yellow-400" : "text-gray-300"
                    } ${!disabled ? "hover:scale-110" : ""}`}
                onClick={() => !disabled && setRating(star)}
                disabled={disabled}
            >
                ★
            </button>
        ))}
    </div>
);

const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
    Resolved: "bg-green-100 text-green-700 border-green-300",
    resolved: "bg-green-100 text-green-700 border-green-300",
};

const HistoryCard = () => {
    const [history, setHistory] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [feedbacks, setFeedbacks] = useState({});
    const [rating, setRating] = useState({});
    const [comment, setComment] = useState({});
    const [submitting, setSubmitting] = useState({});

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/complaints/history", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHistory(Array.isArray(res.data) ? res.data : []);
            } catch {
                setHistory([]);
            }
        };
        fetchHistory();
    }, []);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            const resolved = history.filter(item => item.status?.toLowerCase() === "resolved");
            const feedbackMap = {};
            await Promise.all(
                resolved.map(async (item) => {
                    try {
                        const res = await axios.get(`http://localhost:5000/api/complaints/${item._id}/feedback`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        });
                        if (Array.isArray(res.data) && res.data.length > 0) {
                            feedbackMap[item._id] = res.data[0];
                        }
                    } catch { }
                })
            );
            setFeedbacks(feedbackMap);
        };

        if (history.length > 0) fetchFeedbacks();
    }, [history]);

    const handleSubmitFeedback = async (complaintId) => {
        setSubmitting(s => ({ ...s, [complaintId]: true }));
        try {
            await axios.post(
                `http://localhost:5000/api/complaints/${complaintId}/feedback`,
                { rating: rating[complaintId], comment: comment[complaintId] },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setFeedbacks(f => ({ ...f, [complaintId]: { rating: rating[complaintId], comment: comment[complaintId] } }));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit feedback");
        } finally {
            setSubmitting(s => ({ ...s, [complaintId]: false }));
        }
    };

    const filteredHistory = filterStatus === "all"
        ? history
        : history.filter(item => item.status?.toLowerCase() === filterStatus.toLowerCase());

    return (
        <section className="py-0 px-0 sm:px-4 lg:px-8">
            <div className="max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/90 shadow-2xl rounded-2xl p-4 md:p-8 w-full max-w-2xl mx-auto mt-4 border border-indigo-100"
                >
                    <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-800 mb-6">
                        Complaint History
                    </h2>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Filter by Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-white text-gray-900 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>

                    {filteredHistory.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredHistory.map((item, index) => (
                                <motion.li
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="p-4 md:p-5 border border-gray-100 rounded-xl shadow-sm bg-gradient-to-br from-white via-blue-50 to-indigo-50"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                        <h3 className="text-base md:text-lg font-semibold text-indigo-900">
                                            {item.title || item.description || "No Title"}
                                        </h3>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusColors[item.status] || "bg-gray-100 text-gray-600 border-gray-300"}`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-1">
                                        <p className="text-xs text-gray-500">
                                            Submitted: {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                        {(item.status?.toLowerCase() === "resolved") && (
                                            <p className="text-xs text-gray-500">
                                                Resolved: {new Date(item.updatedAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    {(item.status?.toLowerCase() === "resolved") && (
                                        <div className="mt-3">
                                            {feedbacks[item._id] ? (
                                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <span className="text-yellow-500 text-lg">
                                                        {'★'.repeat(feedbacks[item._id].rating)}
                                                    </span>
                                                    <span className="text-gray-600 text-sm">Feedback submitted</span>
                                                    {feedbacks[item._id].comment && (
                                                        <span className="italic text-gray-500 text-xs md:text-sm">
                                                            "{feedbacks[item._id].comment}"
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <form
                                                    className="flex flex-col md:flex-row md:items-center gap-2 mt-2"
                                                    onSubmit={e => {
                                                        e.preventDefault();
                                                        handleSubmitFeedback(item._id);
                                                    }}
                                                >
                                                    <StarRating
                                                        rating={rating[item._id] || 0}
                                                        setRating={r => setRating(prev => ({ ...prev, [item._id]: r }))}
                                                        disabled={submitting[item._id]}
                                                    />
                                                    <textarea
                                                        className="border border-indigo-200 rounded p-2 text-xs md:text-sm flex-1"
                                                        placeholder="Optional comment"
                                                        value={comment[item._id] || ""}
                                                        onChange={e => setComment(prev => ({ ...prev, [item._id]: e.target.value }))}
                                                        disabled={submitting[item._id]}
                                                        rows={1}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-xs md:text-sm"
                                                        disabled={submitting[item._id] || !(rating[item._id] > 0)}
                                                    >
                                                        {submitting[item._id] ? "Submitting..." : "Submit Feedback"}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    )}
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-center py-8">
                            No complaints found for the selected status.
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default HistoryCard;
