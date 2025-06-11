import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaSignOutAlt,
    FaUserCircle,
    FaHistory,
    FaPlus,
    FaList,
    FaHeadset,
    FaShare,
    FaCommentDots,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:5000/api";

const Sidebar = ({ setActiveSection, activeSection }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [adminStats, setAdminStats] = useState({
        total: 0,
        forwarded: 0,
        pending: 0,
        resolved: 0,
    });
    const [resolverStats, setResolverStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        setUser(storedUser);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user")) || {};
            if (!token || !storedUser) return;

            try {
                if (storedUser?.role === "admin") {
                    const res = await fetch(`${API_URL}/complaints/stats`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await res.json();

                    setAdminStats({
                        total: data.totalComplaints || 0,
                        forwarded: data.forwardedComplaints || 0,
                        pending: (data.pendingComplaints || 0) + (data.forwardedComplaints || 0) + (data.inProgressComplaints || 0),
                        resolved: data.resolvedComplaints || 0,
                    });
                }

                if (storedUser?.role === "resolver") {
                    const res = await fetch(
                        `${API_URL}/complaints/resolver/stats/${storedUser._id}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const data = await res.json();

                    setResolverStats({
                        total: data.total || 0,
                        pending: data.pending || 0,
                        inProgress: data.inProgress || 0,
                        resolved: data.resolved || 0,
                    });
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
        const intervalId = setInterval(fetchStats, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    let navItems = [];
    if (user?.role === "admin") {
        navItems = [
            {
                icon: <FaList />,
                label: <span className="text-base font-semibold tracking-wide">Complaints</span>,
                section: "complaints",
            },
            {
                icon: <FaHistory />,
                label: <span className="text-base font-semibold tracking-wide">History</span>,
                section: "history",
            },
            {
                icon: <FaHeadset />,
                label: <span className="text-base font-semibold tracking-wide">Support</span>,
                section: "supportRequests",
            },
            {
                icon: <FaUserCircle />,
                label: <span className="text-base font-semibold tracking-wide">Profile</span>,
                section: "profile",
            },
            {
                icon: <FaCommentDots />,
                label: <span className="text-base font-semibold tracking-wide">Feedback</span>,
                section: "feedback",
            },
        ];
    } else if (user?.role === "resolver") {
        navItems = [
            {
                icon: <FaList />,
                label: <span className="text-base font-semibold tracking-wide">Complaints</span>,
                section: "complaints",
            },
            {
                icon: <FaHistory />,
                label: <span className="text-base font-semibold tracking-wide">History</span>,
                section: "history",
            },
            {
                icon: <FaHeadset />,
                label: <span className="text-base font-semibold tracking-wide">Support</span>,
                section: "supportRequests",
            },
            {
                icon: <FaUserCircle />,
                label: <span className="text-base font-semibold tracking-wide">Profile</span>,
                section: "profile",
            },
            {
                icon: <FaCommentDots />,
                label: <span className="text-base font-semibold tracking-wide">Feedback</span>,
                section: "feedback",
            },
        ];
    } else if (user?.role === "student") {
        navItems = [
            {
                icon: <FaPlus />,
                label: <span className="text-base font-semibold tracking-wide">Add Complaint</span>,
                section: "addComplaint",
            },
            {
                icon: <FaList />,
                label: <span className="text-base font-semibold tracking-wide">Check Status</span>,
                section: "checkStatus",
            },
            {
                icon: <FaHistory />,
                label: <span className="text-base font-semibold tracking-wide">History</span>,
                section: "history",
            },
            {
                icon: <FaHeadset />,
                label: <span className="text-base font-semibold tracking-wide">Support</span>,
                section: "support",
            },
            {
                icon: <FaUserCircle />,
                label: <span className="text-base font-semibold tracking-wide">Profile</span>,
                section: "profile",
            },
        ];
    }

    // StatCard only for admin and resolver
    const StatCard = ({ label, value, color, icon }) => (
        <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 mb-2 shadow-lg border border-white/30 backdrop-blur-md"
            style={{
                background: color.bg,
                color: color.text,
                borderLeft: `6px solid ${color.border}`,
                fontSize: "1rem",
            }}
        >
            <div className="text-2xl">{icon}</div>
            <div>
                <div className="font-bold text-lg">{value}</div>
                <div className="text-xs font-semibold">{label}</div>
            </div>
        </div>
    );

    // Color palette for stat cards
    const adminColors = [
        { bg: "rgba(255,247,230,0.85)", text: "#b45309", border: "#f59e42" }, // Total Complaints - orange
        { bg: "rgba(230,247,255,0.85)", text: "#0369a1", border: "#38bdf8" }, // Forwarded - blue
        { bg: "rgba(254,249,249,0.85)", text: "#be123c", border: "#f43f5e" }, // Pending - red
        { bg: "rgba(230,251,230,0.85)", text: "#15803d", border: "#22c55e" }, // Resolved - green
    ];
    const resolverColors = [
        { bg: "rgba(255,247,230,0.85)", text: "#b45309", border: "#f59e42" }, // Total Complaints - orange
        { bg: "rgba(254,249,249,0.85)", text: "#be123c", border: "#f43f5e" }, // Pending - red
        { bg: "rgba(224,231,255,0.85)", text: "#3730a3", border: "#6366f1" }, // In Progress - indigo
        { bg: "rgba(230,251,230,0.85)", text: "#15803d", border: "#22c55e" }, // Resolved - green
    ];

    return (
        <motion.aside
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="w-64 h-screen bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#6366f1] text-white p-5 shadow-2xl flex flex-col overflow-y-auto"
            // fixed h-full
            style={{
                borderTopRightRadius: "1.5rem",
                borderBottomRightRadius: "1.5rem",
                minWidth: 220,
                maxWidth: 270,
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                backdropFilter: "blur(8px)",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mb-7 flex flex-col items-start"
            >
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl bg-white/10 rounded-full p-2 shadow">
                        <FaUserCircle />
                    </span>
                    <div>
                        <h2 className="text-xl font-extrabold tracking-wide leading-tight drop-shadow">
                            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"} Panel
                        </h2>
                        <p className="text-xs text-gray-200">
                            Welcome, <span className="font-semibold">{user?.name || "User"}</span>
                        </p>
                    </div>
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mb-1"></div>
            </motion.div>

            {/* Admin Stats */}
            {user?.role === "admin" && (
                <div className="mb-6">
                    <StatCard label="Total" value={adminStats.total} color={adminColors[0]} icon={<FaList />} />
                    <StatCard label="Forwarded" value={adminStats.forwarded} color={adminColors[1]} icon={<FaShare />} />
                    <StatCard label="Pending" value={adminStats.pending} color={adminColors[2]} icon={<FaHistory />} />
                    <StatCard label="Resolved" value={adminStats.resolved} color={adminColors[3]} icon={<FaUserCircle />} />
                </div>
            )}
            {/* Resolver Stats */}
            {user?.role === "resolver" && (
                <div className="mb-6">
                    <StatCard label="Total" value={resolverStats.total} color={resolverColors[0]} icon={<FaList />} />
                    <StatCard label="Pending" value={resolverStats.pending} color={resolverColors[1]} icon={<FaHistory />} />
                    <StatCard label="In Progress" value={resolverStats.inProgress} color={resolverColors[2]} icon={<FaHeadset />} />
                    <StatCard label="Resolved" value={resolverStats.resolved} color={resolverColors[3]} icon={<FaUserCircle />} />
                </div>
            )}
            {/* No stat cards for students */}

            <nav className="flex-1 space-y-1 mt-1">
                <AnimatePresence>
                    {navItems.map((item, idx) => (
                        <motion.div
                            key={item.section}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: 0.05 * idx }}
                        >
                            <SidebarButton
                                icon={item.icon}
                                label={item.label}
                                isActive={activeSection === item.section}
                                onClick={() => {
                                    if (activeSection !== item.section) setActiveSection(item.section);
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </nav>

            <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 flex items-center justify-center gap-2 w-full p-3 rounded-xl border-2 border-blue-400 text-blue-100 bg-gradient-to-r from-blue-700 to-indigo-700 font-semibold text-base tracking-wide transition-all hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
                onClick={handleLogout}
            >
                <span className="text-lg"><FaSignOutAlt /></span>
                <span className="text-base font-semibold tracking-wide">Logout</span>
            </motion.button>
        </motion.aside>
    );
};

// Advanced Sidebar Button with motion
const SidebarButton = ({ icon, label, onClick, isActive }) => (
    <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full shadow-sm font-semibold tracking-wide
            ${isActive
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-white/10 text-gray-100 hover:bg-indigo-500/80 hover:text-white"
            }
            text-base
        `}
        onClick={onClick}
    >
        <span className="text-xl">{icon}</span>
        <span className="text-base font-semibold tracking-wide">{label}</span>
    </motion.button>
);

export default Sidebar;