import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaShare, FaTrash, FaHeadset, FaTimes } from "react-icons/fa";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Profile from "./Profile";
import { AnimatePresence, motion } from "framer-motion";
import FeedbackSection from "../components/FeedbackSection";

const sectionList = ["complaints", "history", "profile", "supportRequests", "feedback"];

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    forwarded: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800",
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const urlSection = location.pathname.split("/")[2] || "complaints";
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [resolvers, setResolvers] = useState([]);
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [forwardComplaintId, setForwardComplaintId] = useState(null);
    const [selectedResolver, setSelectedResolver] = useState("");
    const [supportRequests, setSupportRequests] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [activeSection, setActiveSection] = useState(sectionList.includes(urlSection) ? urlSection : "complaints");

    // Only redirect if the section in the URL is invalid
    useEffect(() => {
        const urlSection = location.pathname.split("/")[2] || "complaints";
        if (!sectionList.includes(urlSection)) {
            navigate(`/admin-dashboard/complaints`, { replace: true });
        } else if (activeSection !== urlSection) {
            setActiveSection(urlSection);
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    // When activeSection changes (e.g., via sidebar), update the URL if needed
    useEffect(() => {
        const urlSection = location.pathname.split("/")[2] || "complaints";
        if (activeSection && urlSection !== activeSection) {
            navigate(`/admin-dashboard/${activeSection}`);
        }
        // eslint-disable-next-line
    }, [activeSection]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (!token || !user || user.role !== "admin") {
            localStorage.clear();
            navigate("/login");
        }
        fetchComplaints();
    }, [navigate]);

    const fetchComplaints = async () => {
        try {
            const response = await API.get("/complaints", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setComplaints(response.data);
            setLoading(false);
        } catch {
            setLoading(false);
        }
    };

    const fetchResolvers = async () => {
        try {
            const response = await API.get("/complaints/resolvers");
            setResolvers(response.data);
        } catch (error) {
            console.error("Error fetching resolvers:", error);
        }
    };

    const fetchSupportRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await API.get("/complaints/support", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSupportRequests(response.data);
        } catch {
            setSupportRequests([]);
        }
    };

    const handleForward = (complaintId) => {
        setForwardComplaintId(complaintId);
        setShowForwardModal(true);
        fetchResolvers();
    };

    const handleConfirmForward = async () => {
        if (!selectedResolver) return;
        try {
            await API.put(`/complaints/${forwardComplaintId}/assign`, { resolverId: selectedResolver });
            setShowForwardModal(false);
            setForwardComplaintId(null);
            setSelectedResolver("");
            fetchComplaints();
            alert("Complaint forwarded successfully!");
        } catch {
            alert("Failed to forward complaint.");
        }
    };

    const handleDeleteComplaint = async (complaintId) => {
        if (!window.confirm("Are you sure you want to delete this complaint?")) return;
        setDeletingId(complaintId);
        try {
            await API.delete(`/complaints/${complaintId}`);
            setComplaints((prev) => prev.filter((c) => c._id !== complaintId));
            setDeletingId(null);
        } catch {
            alert("Failed to delete complaint.");
            setDeletingId(null);
        }
    };

    useEffect(() => {
        if (activeSection === "supportRequests") {
            fetchSupportRequests();
        }
    }, [activeSection]);

    // Polling for complaints and support requests
    useEffect(() => {
        let intervalId;
        const fetchData = async () => {
            try {
                // Fetch complaints
                const complaintsRes = await API.get("/complaints", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setComplaints(Array.isArray(complaintsRes.data) ? complaintsRes.data : []);
                // Fetch support requests if needed
                const supportRes = await API.get("/complaints/support", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setSupportRequests(Array.isArray(supportRes.data) ? supportRes.data : []);
            } catch {
                setComplaints([]);
                setSupportRequests([]);
            }
        };
        fetchData();
        intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, [activeSection]);

    if (loading) return <p className="text-center">Loading complaints...</p>;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
            <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
            <main className="flex-1 p-6 md:p-10 bg-transparent overflow-y-auto">
                <AnimatePresence mode="wait">
                    {activeSection === "complaints" && (
                        <motion.div
                            key="complaints"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-extrabold mb-6 text-blue-900 tracking-tight position-sticky"
                            >
                                Admin Dashboard
                            </motion.h1>
                            {complaints.filter(c => (c.status || "").toLowerCase() !== "resolved").length === 0 ? (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center text-gray-700"
                                >
                                    No complaints found.
                                </motion.p>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="overflow-x-auto"
                                >
                                    <table className="min-w-full bg-white/90 shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                                        <thead
                                            className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900"
                                            style={{ position: "sticky", top: 0, zIndex: 10 }}
                                        >
                                            <tr>
                                                <th className="px-4 py-3 text-left text-blue-900">Sr No</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Student Name</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Complaint ID</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Branch</th>
                                                <th className="px-4 py-3 text-left text-blue-900">HOD</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Submitted On</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Status</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...complaints]
                                                .filter(c => (c.status || "").toLowerCase() !== "resolved")
                                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                                .map((complaint, index) => (
                                                    <motion.tr
                                                        key={complaint._id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                                        className="border-t hover:bg-blue-50 transition"
                                                    >
                                                        <td className="px-4 py-3 text-gray-900">{index + 1}</td>
                                                        <td className="px-4 py-3 text-gray-900">{complaint.studentId?.name || "N/A"}</td>
                                                        <td className="px-4 py-3 text-gray-900">{complaint._id}</td>
                                                        <td className="px-4 py-3 text-gray-900">{complaint.branch || "N/A"}</td>
                                                        <td className="px-4 py-3 text-gray-900">{complaint.inchargeName || complaint.category || "N/A"}</td>
                                                        <td className="px-4 py-3 text-gray-900">{new Date(complaint.createdAt).toLocaleString()}</td>
                                                        <td className="px-4 py-3 text-gray-900">
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[complaint.status] || statusColors.default}`}>
                                                                {complaint.status ? complaint.status : "Pending"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 flex gap-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                                                                title="View"
                                                                onClick={() => setSelectedComplaint(complaint)}
                                                            >
                                                                <FaEye size={18} />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
                                                                title="Forward"
                                                                onClick={() => handleForward(complaint._id)}
                                                            >
                                                                <FaShare size={18} />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className={`p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition ${deletingId === complaint._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                title="Delete"
                                                                onClick={() => handleDeleteComplaint(complaint._id)}
                                                                disabled={deletingId === complaint._id}
                                                            >
                                                                {deletingId === complaint._id ? (
                                                                    <svg className="animate-spin h-5 w-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                                                    </svg>
                                                                ) : (
                                                                    <FaTrash size={18} />
                                                                )}
                                                            </motion.button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                            <AnimatePresence>
                                {selectedComplaint && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
                                    >
                                        <motion.div
                                            initial={{ y: 40, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: 40, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white p-8 rounded-2xl shadow-2xl w-[95vw] max-w-md relative"
                                        >
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
                                                <p><strong>Complaint About (Category/Department):</strong> {selectedComplaint?.category || selectedComplaint?.branch || "N/A"}</p>
                                                <p><strong>Complaint ID:</strong> {selectedComplaint?._id}</p>
                                                <p><strong>Priority:</strong> {selectedComplaint.priority || "N/A"}</p>
                                                <p><strong>Description:</strong> {selectedComplaint.description || "N/A"}</p>
                                                <p><strong>Submitted At:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                                                <p><strong>HOD:</strong> {selectedComplaint?.inchargeName || selectedComplaint?.category || "N/A"}</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="mt-6 w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                                                onClick={() => setSelectedComplaint(null)}
                                            >
                                                Close
                                            </motion.button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                    {activeSection === "history" && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-extrabold mb-6 text-blue-900"
                            >
                                Complaints History
                            </motion.h1>
                            {complaints.filter(c => (c.status || "").toLowerCase() === "resolved").length === 0 ? (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center text-gray-700"
                                >
                                    No resolved complaints found.
                                </motion.p>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="overflow-x-auto"
                                >
                                    <table className="min-w-full bg-white/90 shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                                        <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900" style={{ position: "sticky", top: 0, zIndex: 10 }}>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-blue-900">Sr No</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Student Name</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Complaint ID</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Branch</th>
                                                <th className="px-4 py-3 text-left text-blue-900">HOD</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Submitted On</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {complaints.filter(c => (c.status || "").toLowerCase() === "resolved").map((c, i) => (
                                                <motion.tr
                                                    key={c._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                                    className="border-t text-gray-800"
                                                >
                                                    <td className="p-2">{i + 1}</td>
                                                    <td className="p-2">{c.studentId?.name || "N/A"}</td>
                                                    <td className="p-2 text-green-600">{c._id}</td>
                                                    <td className="p-2">{c.branch || "N/A"}</td>
                                                    <td className="p-2">{c.inchargeName || c.category || "N/A"}</td>
                                                    <td className="p-2">{c.createdAt ? new Date(c.createdAt).toLocaleString() : "N/A"}</td>
                                                    <td className="p-2 capitalize font-semibold">{c.status}</td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                    {activeSection === "profile" && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Profile />
                        </motion.div>
                    )}
                    {activeSection === "supportRequests" && (
                        <motion.div
                            key="support"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-extrabold mb-6 text-blue-900 flex items-center gap-2"
                            >
                                <FaHeadset /> Support Requests
                            </motion.h1>
                            {supportRequests.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white/90 rounded-2xl p-8 shadow-xl text-center text-gray-500"
                                >
                                    <p>No support requests found.</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="overflow-x-auto"
                                >
                                    <table className="min-w-full bg-white/90 shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                                        <thead
                                            className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900"
                                            style={{ position: "sticky", top: 0, zIndex: 10 }}
                                        >
                                            <tr>
                                                <th className="px-4 py-3 text-left text-blue-900">Name</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Email</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Message</th>
                                                <th className="px-4 py-3 text-left text-blue-900">Submitted On</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {supportRequests.map((req, i) => (
                                                <motion.tr
                                                    key={req._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                                    className="border-t hover:bg-blue-50 transition"
                                                >
                                                    <td className="px-4 py-3 text-gray-900">{req.name}</td>
                                                    <td className="px-4 py-3 text-gray-900">{req.email}</td>
                                                    <td className="px-4 py-3 text-gray-900">{req.message}</td>
                                                    <td className="px-4 py-3 text-gray-900">{new Date(req.createdAt).toLocaleString()}</td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                    {activeSection === "feedback" && (
                        <FeedbackSection />
                    )}
                </AnimatePresence>
            </main>
            {showForwardModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.97, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.97, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-8 rounded-2xl shadow-2xl w-[95vw] max-w-md relative"
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                            onClick={() => setShowForwardModal(false)}
                            title="Close"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-lg font-bold mb-4 text-blue-900">Forward Complaint</h2>
                        <select
                            className="w-full p-2 border rounded mb-4 text-gray-900"
                            value={selectedResolver}
                            onChange={e => setSelectedResolver(e.target.value)}
                        >
                            <option value="">Select Resolver</option>
                            {resolvers.map(resolver => (
                                <option key={resolver._id} value={resolver._id}>
                                    {resolver.name} ({resolver.email})
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2 text-gray-900">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setShowForwardModal(false)}
                            >Cancel</motion.button>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className={`px-4 py-2 rounded text-white font-semibold transition ${
                                    selectedResolver
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-blue-300 cursor-not-allowed"
                                }`}
                                onClick={handleConfirmForward}
                                disabled={!selectedResolver}
                            >Forward</motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default AdminDashboard;