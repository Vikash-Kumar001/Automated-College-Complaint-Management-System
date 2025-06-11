import { useEffect, useState } from "react";
import axios from "axios";

const FeedbackSection = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let intervalId;
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get("/api/complaints/feedbacks", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setFeedbacks(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            } catch {
                setFeedbacks([]);
                setLoading(false);
            }
        };
        fetchFeedbacks();
        intervalId = setInterval(fetchFeedbacks, 5000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <p className="text-center">Loading feedbacks...</p>;

    return (
        <div className="bg-white/90 shadow-2xl rounded-2xl p-4 md:p-8 w-full max-w-4xl mx-auto mt-4 border border-indigo-100">
            <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-800 mb-6 flex items-center gap-2">All Student Feedback</h2>
            {feedbacks.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No feedback found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead>
                            <tr className="bg-gray-200 text-gray-800">
                                <th className="p-2">Complaint</th>
                                <th className="p-2">Student</th>
                                <th className="p-2">Rating</th>
                                <th className="p-2">Comment</th>
                                <th className="p-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.map((fb, idx) => (
                                <tr key={fb._id || idx} className="border-t text-gray-800">
                                    <td className="p-2">{fb.complaint?.title || fb.complaint?.description || fb.complaint?._id || "N/A"}</td>
                                    <td className="p-2">{fb.student?.name || "N/A"}</td>
                                    <td className="p-2 text-yellow-600">{'★'.repeat(fb.rating)}</td>
                                    <td className="p-2">{fb.comment || "No comment"}</td>
                                    <td className="p-2">{fb.createdAt ? new Date(fb.createdAt).toLocaleString() : "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FeedbackSection; 