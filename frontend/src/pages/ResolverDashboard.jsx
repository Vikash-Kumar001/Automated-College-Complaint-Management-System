import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaEye, FaPen, FaCommentDots, FaTimes, FaHeadset } from "react-icons/fa";
import axios from "axios";
import Profile from "../pages/Profile";
import API from "../services/api";
import FeedbackSection from "../components/FeedbackSection";
import { motion } from "framer-motion";
import React from "react";

const sectionList = ["complaints", "forwarded", "resolved", "history", "profile", "feedback", "supportRequests"];
const statusOptions = ["pending", "in progress", "resolved"];

function ComplaintTableModern({ complaints, statusLoading, handleStatusChange, handleViewComplaint, openCommentModal, openResolveModal, statusOptions }) {
    const sortedComplaints = [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white/90 shadow-xl rounded-2xl overflow-hidden border border-gray-200 text-[15px]">
                <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900">
                    <tr>
                        <th className="px-4 py-3 text-left">Sr No</th>
                        <th className="px-4 py-3 text-left">Student Name</th>
                        <th className="px-4 py-3 text-left">Complaint ID</th>
                        <th className="px-4 py-3 text-left">Branch</th>
                        <th className="px-4 py-3 text-left">HOD</th>
                        <th className="px-4 py-3 text-left">Submitted On</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedComplaints.map((complaint, idx) => (
                        <motion.tr
                            key={complaint._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.07 }}
                            className="border-t hover:bg-blue-50 transition"
                        >
                            <td className="px-4 py-3 text-gray-900">{idx + 1}</td>
                            <td className="px-4 py-3 text-gray-900">{complaint.studentId?.name || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-900">{complaint._id}</td>
                            <td className="px-4 py-3 text-gray-900">{complaint.branch || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-900">{complaint.inchargeName || complaint.category || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-900">{complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : "N/A"}</td>
                            <td className="px-4 py-3 text-gray-900">
                                <select
                                    className="rounded-lg border px-2 py-1 bg-white text-xs font-semibold"
                                    value={complaint.status?.toLowerCase()}
                                    disabled={statusLoading}
                                    onChange={e => handleStatusChange(complaint._id, e.target.value)}
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                                <button
                                    className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                                    title="View"
                                    onClick={() => handleViewComplaint(complaint)}
                                >
                                    <FaEye size={18} />
                                </button>
                                <button
                                    className="p-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                                    title="Comment"
                                    onClick={() => openCommentModal(complaint)}
                                >
                                    <FaCommentDots size={18} />
                                </button>
                                <button
                                    className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
                                    title="Resolve"
                                    onClick={() => openResolveModal(complaint)}
                                >
                                    <FaPen size={18} />
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const ResolverDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [forwardedComplaints, setForwardedComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [commentModal, setCommentModal] = useState({ open: false, complaint: null, comments: [], newComment: "" });
    const [resolveModal, setResolveModal] = useState({ open: false, complaint: null, resolution: "" });
    const [statusLoading, setStatusLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const urlSection = location.pathname.split("/")[2] || "complaints";
    const [activeSection, setActiveSection] = useState(sectionList.includes(urlSection) ? urlSection : "complaints");

    // Only redirect if the section in the URL is invalid
    useEffect(() => {
        const urlSection = location.pathname.split("/")[2] || "complaints";
        if (!sectionList.includes(urlSection)) {
            navigate(`/resolver-dashboard/complaints`, { replace: true });
        } else if (activeSection !== urlSection) {
            setActiveSection(urlSection);
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    // When activeSection changes (e.g., via sidebar), update the URL if needed
    useEffect(() => {
        const urlSection = location.pathname.split("/")[2] || "complaints";
        if (activeSection && urlSection !== activeSection) {
            navigate(`/resolver-dashboard/${activeSection}`);
        }
        // eslint-disable-next-line
    }, [activeSection]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (!token || !user || user.role !== "resolver") {
            localStorage.clear();
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (token && user && user.role === "resolver") {
            if (window.history.state && window.history.state.idx === 0 && location.pathname !== "/resolver-dashboard/complaints") {
                navigate("/resolver-dashboard/complaints", { replace: true });
            }
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        let intervalId;
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user?._id) return;
                const activeRes = await axios.get(
                    `/api/complaints/resolver/${user._id}/active`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setForwardedComplaints(Array.isArray(activeRes.data) ? activeRes.data : []);
                const complaintsRes = await axios.get(
                    `/api/complaints/resolver/${user._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setComplaints(Array.isArray(complaintsRes.data) ? complaintsRes.data : []);
            } catch {
                setComplaints([]);
                setForwardedComplaints([]);
            }
        };
        fetchData();
        intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, [activeSection]);

    const handleComment = async (complaintId, commentText) => {
        if (!commentText.trim()) return alert("Comment cannot be empty");
        try {
            await axios.post(`/api/complaints/${complaintId}/comment`, { comment: commentText });
            setCommentModal((prev) => ({ ...prev, newComment: "" }));
        } catch {
            // Error handling intentionally left blank
        }
    };

    const handleResolveComplaint = async (complaintId, resolution) => {
        if (!resolution.trim()) return alert("Resolution comment cannot be empty");
        try {
            await axios.put(`/api/complaints/${complaintId}/resolve`, { comment: resolution });
            setResolveModal({ open: false, complaint: null, resolution: "" });
            alert("Complaint resolved successfully!");
        } catch {
            // Error handling intentionally left blank
        }
    };

    const handleStatusChange = async (complaintId, newStatus) => {
        setStatusLoading(true);
        try {
            await API.put(`/complaints/${complaintId}/status`, { status: newStatus });
        } catch {
            alert("Failed to update status");
        }
        setStatusLoading(false);
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const getResolverId = (c) => typeof c.resolverId === "string" ? c.resolverId : c.resolverId?._id;
    const filteredComplaints = {
        complaints: complaints.filter(
            c => getResolverId(c) === user._id && ["in progress", "forwarded"].includes((c.status || "").toLowerCase().trim())
        ),
        resolved: complaints.filter(
            c => getResolverId(c) === user._id && (c.status || "").toLowerCase().trim() === "resolved"
        ),
        history: complaints,
    };

    const handleViewComplaint = (complaint) => setSelectedComplaint(complaint);

    // Open comment modal and fetch comments
    const openCommentModal = async (complaint) => {
        try {
            const res = await axios.get(`/api/complaints/${complaint._id}/comments`);
            setCommentModal({ open: true, complaint, comments: res.data || [], newComment: "" });
        } catch {
            setCommentModal({ open: true, complaint, comments: [], newComment: "" });
        }
    };

    // Open resolve modal
    const openResolveModal = (complaint) => {
        setResolveModal({ open: true, complaint, resolution: "" });
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
            <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
            <main className="flex-1 p-6 md:p-10 bg-transparent overflow-y-auto">
                {activeSection === "complaints" && (
                    <div key="complaints">
                        <h1 className="text-3xl font-extrabold mb-6 text-blue-900 tracking-tight position-sticky">
                            Resolver Dashboard
                        </h1>
                        {filteredComplaints.complaints.length === 0 ? (
                            <p className="text-center text-gray-700">No complaints found.</p>
                        ) : (
                            <ComplaintTableModern
                                complaints={filteredComplaints.complaints}
                                statusLoading={statusLoading}
                                handleStatusChange={handleStatusChange}
                                handleViewComplaint={handleViewComplaint}
                                openCommentModal={openCommentModal}
                                openResolveModal={openResolveModal}
                                statusOptions={statusOptions}
                            />
                        )}
                    </div>
                )}
                {activeSection === "history" && (
                    <div key="history">
                        <h1 className="text-3xl font-extrabold mb-6 text-blue-900">
                            Complaints History
                        </h1>
                        {filteredComplaints.history.filter(c => (c.status || "").toLowerCase() === "resolved").length === 0 ? (
                            <p className="text-center text-gray-700">No resolved complaints found.</p>
                        ) : (
                            <ComplaintTableModern
                                complaints={filteredComplaints.history.filter(c => (c.status || "").toLowerCase() === "resolved")}
                                statusLoading={statusLoading}
                                handleStatusChange={handleStatusChange}
                                handleViewComplaint={handleViewComplaint}
                                openCommentModal={openCommentModal}
                                openResolveModal={openResolveModal}
                                statusOptions={statusOptions}
                            />
                        )}
                    </div>
                )}
                {activeSection === "forwarded" && (
                    <div key="forwarded">
                        <h1 className="text-3xl font-extrabold mb-6 text-blue-900">
                            Forwarded Complaints
                        </h1>
                        {forwardedComplaints.length === 0 ? (
                            <p className="text-center text-gray-700">No forwarded complaints found.</p>
                        ) : (
                            <ComplaintTableModern
                                complaints={forwardedComplaints}
                                statusLoading={statusLoading}
                                handleStatusChange={handleStatusChange}
                                handleViewComplaint={handleViewComplaint}
                                openCommentModal={openCommentModal}
                                openResolveModal={openResolveModal}
                                statusOptions={statusOptions}
                            />
                        )}
                    </div>
                )}
                {activeSection === "resolved" && (
                    <div key="resolved">
                        <h1 className="text-3xl font-extrabold mb-6 text-green-800">
                            Resolved Complaints
                        </h1>
                        {filteredComplaints.resolved.length === 0 ? (
                            <p className="text-center text-gray-700">No resolved complaints found.</p>
                        ) : (
                            <ComplaintTableModern
                                complaints={filteredComplaints.resolved}
                                statusLoading={statusLoading}
                                handleStatusChange={handleStatusChange}
                                handleViewComplaint={handleViewComplaint}
                                openCommentModal={openCommentModal}
                                openResolveModal={openResolveModal}
                                statusOptions={statusOptions}
                            />
                        )}
                    </div>
                )}
                {/* Support Requests Section for Resolver */}
                {activeSection === "supportRequests" && (
                    <div key="supportRequests">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-900 mb-6">
                            <FaHeadset /> Support Requests
                        </h2>
                        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl flex items-center justify-center min-h-[120px]">
                            <span className="text-gray-500 text-lg">No support requests found.</span>
                        </div>
                    </div>
                )}
                {activeSection === "profile" && (
                    <div key="profile">
                        <Profile />
                    </div>
                )}
                {activeSection === "feedback" && (
                    <FeedbackSection />
                )}
                {/* Modal for viewing complaint details */}
                {selectedComplaint && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-[95vw] max-w-md relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                                onClick={() => setSelectedComplaint(null)}
                                title="Close"
                            >
                                <FaTimes />
                            </button>
                            <h2 className="text-xl font-bold mb-3 text-blue-900">Complaint Details</h2>
                            <div className="space-y-2 text-gray-800">
                                <p><strong>Name:</strong> {selectedComplaint?.studentId?.name || "N/A"}</p>
                                <p><strong>Email:</strong> {selectedComplaint?.studentId?.email || "N/A"}</p>
                                <p><strong>Role:</strong> {selectedComplaint?.studentId?.role || "N/A"}</p>
                                <p><strong>Student Branch:</strong> {selectedComplaint?.studentId?.branch || "N/A"}</p>
                                <p><strong>Enrollment No.:</strong> {selectedComplaint?.studentId?.enrollment || selectedComplaint?.studentId?.enrollmentNo || selectedComplaint?.studentId?.universityEnrollmentNo || "N/A"}</p>
                                <p><strong>Complaint About (Category/Branch):</strong> {selectedComplaint?.branch || selectedComplaint?.category || "N/A"}</p>
                                <p><strong>Complaint ID:</strong> {selectedComplaint?._id}</p>
                                <p><strong>HOD:</strong> {selectedComplaint?.inchargeName || selectedComplaint?.category || "N/A"}</p>
                                <p><strong>Priority:</strong> {selectedComplaint.priority || "N/A"}</p>
                                <p><strong>Description:</strong> {selectedComplaint.description || "N/A"}</p>
                                <p><strong>Submitted At:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                            </div>
                            <button
                                className="mt-6 w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                                onClick={() => setSelectedComplaint(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
                {/* Modal for comments */}
                {commentModal.open && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-2xl w-[95vw] max-w-md relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                                onClick={() => setCommentModal({ open: false, complaint: null, comments: [], newComment: "" })}
                                title="Close"
                            >
                                <FaTimes />
                            </button>
                            <h2 className="text-lg font-bold mb-3 text-purple-900">Comments</h2>
                            <div className="max-h-40 overflow-y-auto mb-3 space-y-2">
                                {commentModal.comments.length === 0 && <div className="text-gray-400">No comments yet.</div>}
                                {commentModal.comments.map((c, i) => (
                                    <div key={i} className="bg-purple-50 rounded-lg px-3 py-2 text-sm text-gray-800">
                                        <span className="font-semibold">{c.user?.name || "Resolver"}:</span> {c.comment}
                                    </div>
                                ))}
                            </div>
                            <textarea
                                className="w-full border rounded-lg p-2 mb-2 text-sm text-black"
                                rows={2}
                                placeholder="Add a comment..."
                                value={commentModal.newComment}
                                onChange={e => setCommentModal(prev => ({ ...prev, newComment: e.target.value }))}
                            />
                            <button
                                className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                                onClick={async () => {
                                    await handleComment(commentModal.complaint._id, commentModal.newComment);
                                    // Refresh comments
                                    const res = await axios.get(`/api/complaints/${commentModal.complaint._id}/comments`);
                                    setCommentModal(prev => ({ ...prev, comments: res.data || [], newComment: "" }));
                                }}
                            >
                                Add Comment
                            </button>
                        </div>
                    </div>
                )}
                {/* Modal for resolve */}
                {resolveModal.open && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-2xl w-[95vw] max-w-md relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                                onClick={() => setResolveModal({ open: false, complaint: null, resolution: "" })}
                                title="Close"
                            >
                                <FaTimes />
                            </button>
                            <h2 className="text-lg font-bold mb-3 text-green-900">Resolve Complaint</h2>
                            <textarea
                                className="w-full border rounded-lg p-2 mb-2 text-sm text-black"
                                rows={3}
                                placeholder="Enter resolution comment..."
                                value={resolveModal.resolution}
                                onChange={e => setResolveModal(prev => ({ ...prev, resolution: e.target.value }))}
                            />
                            <button
                                className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                                onClick={async () => {
                                    await handleResolveComplaint(resolveModal.complaint._id, resolveModal.resolution);
                                }}
                            >
                                Resolve
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResolverDashboard;