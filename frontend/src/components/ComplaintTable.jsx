import { useState, useEffect } from "react";
import { FaEye, FaPen, FaCommentDots } from "react-icons/fa";
import axios from "axios";

const ComplaintTable = ({ complaints, handleComment, handleResolveComplaint, onStatusChange, handleViewComplaint }) => {
    const [editingComment, setEditingComment] = useState({});
    const [showComments, setShowComments] = useState(null);
    const [modalComments, setModalComments] = useState([]);

    // Poll for latest comments when modal is open
    useEffect(() => {
        let intervalId;
        const fetchComments = async () => {
            if (!showComments) return;
            try {
                const res = await axios.get(`/api/complaints/${showComments._id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setModalComments(res.data.comments || []);
            } catch {
                setModalComments([]);
            }
        };
        if (showComments) {
            fetchComments();
            intervalId = setInterval(fetchComments, 5000);
        } else {
            setModalComments([]);
        }
        return () => clearInterval(intervalId);
    }, [showComments]);

    const handleInputChange = (id, value) => {
        setEditingComment(prev => ({ ...prev, [id]: value }));
    };

    const handleCommentSubmit = (id) => {
        if (!editingComment[id] || !editingComment[id].trim()) {
            alert("Comment cannot be empty");
            return;
        }
        handleComment(id, editingComment[id]);
        setEditingComment(prev => ({ ...prev, [id]: "" }));
    };

    return (
        <>
        <table className="min-w-full bg-white border rounded-lg">
            <thead>
                <tr className="bg-gray-200 text-gray-800">
                    <th className="p-2">SrNo</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Complaint ID</th>
                    <th className="p-2">Incharge</th>
                    <th className="p-2">Branch</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {[...complaints]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((complaint, index) => (
                        <tr key={complaint._id} className="border-t text-gray-800">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{complaint.name || complaint.studentId?.name || "N/A"}</td>
                            <td className="p-2 text-green-600">{complaint._id}</td>
                            <td className="p-2">{complaint.inchargeName || complaint.category || "N/A"}</td>
                            <td className="p-2">{complaint.branch || "N/A"}</td>
                            <td className="p-2">
                                <select
                                    value={complaint.status}
                                    onChange={e => onStatusChange && onStatusChange(complaint._id, e.target.value)}
                                    className="border rounded p-1"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </td>
                            <td className="p-2 flex flex-col gap-2">
                                <button className="text-green-600 hover:text-green-800" onClick={() => handleViewComplaint && handleViewComplaint(complaint)}><FaEye /></button>
                                <button className="text-blue-600 hover:text-blue-800" onClick={() => setShowComments(complaint)}><FaCommentDots /> View/Add Comments</button>
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => handleResolveComplaint(complaint._id)}
                                >
                                    <FaPen /> Resolve
                                </button>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
        {/* Comments Modal */}
        {showComments && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white p-6 rounded-2xl shadow-2xl w-[95vw] max-w-lg relative">
                    <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                        onClick={() => setShowComments(null)}
                        title="Close"
                    >
                        &times;
                    </button>
                    <h2 className="text-xl font-bold mb-3 text-blue-900">Comments</h2>
                    <div className="max-h-48 overflow-y-auto mb-4 bg-gray-50 p-3 rounded">
                        {Array.isArray(modalComments) && modalComments.length > 0 ? (
                            modalComments.map((c, idx) => (
                                <div key={idx} className="mb-2">
                                    <span className="font-semibold text-indigo-700">{c.author || "Resolver"}</span>
                                    <span className="text-xs text-gray-500 ml-2">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</span>
                                    <div className="text-gray-800 ml-2">{c.text || c.comment}</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No comments yet.</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Write a comment"
                            value={editingComment[showComments._id] || ""}
                            onChange={e => handleInputChange(showComments._id, e.target.value)}
                            className="border p-2 rounded w-full text-sm"
                        />
                        <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            onClick={() => { handleCommentSubmit(showComments._id); }}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default ComplaintTable; 