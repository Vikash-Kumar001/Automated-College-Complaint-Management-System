import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ComplaintForm from "../components/ComplaintForm";
import StatusCard from "../components/StatusCard";
import HistoryCard from "../components/HistoryCard";
import SupportSection from "../components/SupportSection";
import Profile from "../pages/Profile";
import API from "../services/api";

const sectionList = ["addComplaint", "checkStatus", "history", "support", "profile"];

const StudentDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const urlSection = location.pathname.split("/")[2] || "addComplaint";
    const [activeSection, setActiveSection] = useState(sectionList.includes(urlSection) ? urlSection : "addComplaint");

    // New state for complaints and status summary
    const [complaints, setComplaints] = useState([]);
    const [latestStatus, setLatestStatus] = useState("");
    const [statusCounts, setStatusCounts] = useState({ pending: 0, "in progress": 0, resolved: 0 });

    useEffect(() => {
        const urlSection = location.pathname.split("/")[2] || "addComplaint";
        if (!sectionList.includes(urlSection)) {
            navigate(`/student-dashboard/addComplaint`, { replace: true });
        } else if (activeSection !== urlSection) {
            setActiveSection(urlSection);
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    useEffect(() => {
        const urlSection = location.pathname.split("/")[2] || "addComplaint";
        if (activeSection && urlSection !== activeSection) {
            navigate(`/student-dashboard/${activeSection}`);
        }
        // eslint-disable-next-line
    }, [activeSection]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        // Debug logs
        if (!token) console.warn("[StudentDashboard] No token in localStorage");
        if (!user) console.warn("[StudentDashboard] No user in localStorage");
        if (user && user.role !== "student") console.warn("[StudentDashboard] User role is not student", user.role);

        if (!token || !user || user.role !== "student") {
            // Do NOT clear localStorage here, just redirect
            navigate("/login?reason=unauthorized", { replace: true });
        }
    }, [navigate]);

    // Prevent navigating back to login if still authenticated
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (token && user && user.role === "student") {
            // If the previous page is /login, replace it with the dashboard
            if (window.history.state && window.history.state.idx === 0 && location.pathname !== "/student-dashboard/addComplaint") {
                navigate("/student-dashboard/addComplaint", { replace: true });
            }
        }
    }, [location.pathname, navigate]);

    // Fetch complaints for status and history (with polling)
    useEffect(() => {
        let intervalId;
        const fetchComplaints = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await API.get("/complaints/history", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (Array.isArray(res.data)) {
                    setComplaints(res.data);
                    // Latest status
                    const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setLatestStatus(sorted[0]?.status || "Unknown");
                    // Count by status
                    const counts = { pending: 0, "in progress": 0, resolved: 0 };
                    res.data.forEach(c => {
                        const s = (c.status || "").toLowerCase();
                        if (counts[s] !== undefined) counts[s]++;
                    });
                    setStatusCounts(counts);
                }
            } catch {
                setComplaints([]);
                setLatestStatus("Unknown");
                setStatusCounts({ pending: 0, "in progress": 0, resolved: 0 });
            }
        };
        fetchComplaints();
        intervalId = setInterval(fetchComplaints, 5000);
        return () => clearInterval(intervalId);
    }, [activeSection]);

    const handleSubmitComplaint = async (complaintData) => {
        try {
            await API.post("/complaints", complaintData);
            localStorage.setItem("complaint_updated", Date.now());
            alert("Complaint submitted successfully!");
            setActiveSection("checkStatus");
        } catch {
            alert("Failed to submit complaint. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />

            <main className="flex-1">
                {activeSection === "addComplaint" && (
                    <ComplaintForm onSubmit={handleSubmitComplaint} />
                )}
                {activeSection === "checkStatus" && (
                    <>
                        <StatusCard status={latestStatus} count={complaints.length} />
                        <div className="flex mt-4 w-[70%] mx-auto ">
                            {/* gap-4 mt-4 */}
                            <StatusCard status="pending" count={statusCounts.pending} />
                            <StatusCard status="in progress" count={statusCounts["in progress"]} />
                            <StatusCard status="resolved" count={statusCounts.resolved} />
                        </div>
                    </>
                )}
                {activeSection === "history" && (
                    <HistoryCard complaints={complaints} />
                )}
                {activeSection === "support" && (
                    <SupportSection />
                )}
                {activeSection === "profile" && (
                    <Profile />
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;


