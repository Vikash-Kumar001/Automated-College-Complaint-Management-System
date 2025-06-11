import { useEffect, useState, useRef } from "react";
import { FaUserEdit, FaKey, FaSignOutAlt, FaUserCircle, FaCamera, FaTrashAlt, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

const Profile = () => {
    const [user, setUser] = useState({});
    const [showEdit, setShowEdit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [editData, setEditData] = useState({});
    const [passwords, setPasswords] = useState({ old: "", new: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData._id) {
            API.get(`/auth/profile/${userData._id}`)
                .then(res => {
                    setUser(res.data);
                    setEditData(res.data);
                })
                .catch(() => {
                    setUser(userData || {});
                    setEditData(userData || {});
                });
        } else {
            setUser(userData || {});
            setEditData(userData || {});
        }
    }, []);

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setUser(editData);
        localStorage.setItem("user", JSON.stringify(editData));
        setShowEdit(false);
        setMessage("Profile updated!");
        setTimeout(() => setMessage(""), 2000);
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (passwords.new.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setShowPassword(false);
        setMessage("Password changed!");
        setTimeout(() => setMessage(""), 2000);
        setPasswords({ old: "", new: "" });
    };

    const handleLogout = () => {
        if (uploading) return;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const getInitials = (name) => {
        if (!name) return "";
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };

    const handleProfilePicChange = async (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        setAvatarUploading(true);
        setError("");
        const formData = new FormData();
        formData.append("profilePic", e.target.files[0]);
        try {
            const res = await API.post(`/auth/profile/${user._id}/picture`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
            setMessage("Profile picture updated!");
            setTimeout(() => setMessage(""), 2000);
        } catch {
            setError("Failed to upload profile picture.");
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleDeleteProfilePic = async () => {
        setAvatarUploading(true);
        setError("");
        try {
            await API.delete(`/auth/profile/${user._id}/picture`);
            setUser((prev) => ({ ...prev, profilePic: null }));
            setMessage("Profile picture deleted!");
            setTimeout(() => setMessage(""), 2000);
        } catch {
            setError("Failed to delete profile picture.");
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (uploading) return;
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
        setUploading(true);
        setError("");
        try {
            await API.delete(`/auth/profile/${user._id}`);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/register";
        } catch {
            setError("Failed to delete account.");
        } finally {
            setUploading(false);
        }
    };

    // 2025 Modern UI with motion
    return (
        <section className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#f0fdfa] flex items-center justify-center py-10 px-2">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-3xl bg-white/90 shadow-2xl rounded-3xl p-8 md:p-14 border border-indigo-100 relative"
            >
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-col md:flex-row items-center gap-8 mb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        className="relative group"
                    >
                        {user?.profilePic ? (
                            <motion.img
                                src={user.profilePic && !user.profilePic.startsWith('http') ? `http://localhost:5000/uploads/${user.profilePic}` : user.profilePic}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-indigo-200"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            />
                        ) : (
                            <motion.div
                                className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-5xl text-white font-bold shadow-lg"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                {getInitials(user?.name)}
                            </motion.div>
                        )}
                        {/* Camera Button */}
                        <motion.button
                            type="button"
                            className="absolute bottom-2 right-2 bg-indigo-600 text-white rounded-full p-2 shadow-lg hover:bg-indigo-700 transition"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            disabled={avatarUploading}
                            title="Change profile picture"
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaCamera />
                        </motion.button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePicChange}
                            disabled={avatarUploading}
                        />
                        {/* Delete Button */}
                        {user?.profilePic && (
                            <motion.button
                                type="button"
                                className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition"
                                onClick={handleDeleteProfilePic}
                                disabled={avatarUploading}
                                title="Delete profile picture"
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaTrashAlt />
                            </motion.button>
                        )}
                        {avatarUploading && (
                            <motion.div
                                className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                            </motion.div>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex-1 text-center md:text-left"
                    >
                        <h2 className="text-4xl font-extrabold text-indigo-900 tracking-tight mb-1">{user?.name}</h2>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                            <span className="text-gray-500 text-lg">{user?.email}</span>
                            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold ml-0 md:ml-2">{user?.role?.toUpperCase()}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition text-sm"
                                onClick={() => setShowEdit(true)}
                            >
                                <FaUserEdit /> Edit Profile
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition text-sm"
                                onClick={() => setShowPassword(true)}
                            >
                                <FaKey /> Change Password
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition text-sm"
                                onClick={handleLogout}
                                disabled={uploading}
                            >
                                <FaSignOutAlt /> Logout
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm"
                                onClick={handleDeleteAccount}
                                disabled={uploading}
                            >
                                <FaTrashAlt /> Delete Account
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
                {/* Success/Error Messages */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm"
                        >
                            <FaCheckCircle /> <span>{message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 text-red-600 font-semibold text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Profile Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <ProfileRow label="Name" value={user?.name} />
                    <ProfileRow label="Email" value={user?.email} />
                    <ProfileRow label="Role" value={user?.role?.toUpperCase()} />
                    <ProfileRow
                        label={user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'resolver'
                            ? 'ID No.'
                            : user?.role?.toLowerCase() === 'student'
                                ? 'Enrollment No.'
                                : user?.role?.toLowerCase() === 'teacher'
                                    ? 'Teacher ID'
                                    : 'ID / Enrollment / Teacher ID'}
                        value={user?.enrollment}
                    />
                    {user?.role?.toLowerCase() !== 'admin' && <ProfileRow label="Branch" value={user?.branch} />}
                    <ProfileRow label="Password" value={user?.password ? '********' : ''} />
                </motion.div>

                {/* Edit Profile Modal */}
                <AnimatePresence>
                    {showEdit && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
                        >
                            <motion.form
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-indigo-100"
                                onSubmit={handleEditSubmit}
                            >
                                <h3 className="text-xl font-bold mb-4 text-indigo-800 flex items-center gap-2">
                                    <FaUserEdit /> Edit Profile
                                </h3>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name || ""}
                                        onChange={handleEditChange}
                                        className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-400"
                                        autoFocus
                                    />
                                </div>
                                {user?.branch !== undefined && (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-1">Branch</label>
                                        <input
                                            type="text"
                                            name="branch"
                                            value={editData.branch || ""}
                                            onChange={handleEditChange}
                                            className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-400"
                                        />
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 mt-6">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                                        onClick={() => setShowEdit(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </motion.form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Change Password Modal */}
                <AnimatePresence>
                    {showPassword && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
                        >
                            <motion.form
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-indigo-100"
                                onSubmit={handlePasswordSubmit}
                            >
                                <h3 className="text-xl font-bold mb-4 text-purple-800 flex items-center gap-2">
                                    <FaKey /> Change Password
                                </h3>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-1">Old Password</label>
                                    <input
                                        type="password"
                                        name="old"
                                        value={passwords.old}
                                        onChange={handlePasswordChange}
                                        className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-1">New Password</label>
                                    <input
                                        type="password"
                                        name="new"
                                        value={passwords.new}
                                        onChange={handlePasswordChange}
                                        className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                                        onClick={() => setShowPassword(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                                    >
                                        Change
                                    </button>
                                </div>
                            </motion.form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

const ProfileRow = ({ label, value }) => (
    <div className="flex flex-col gap-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 shadow-sm border border-indigo-50 mb-2">
        <span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">{label}</span>
        <span className="text-gray-900 text-base font-medium">{value || "N/A"}</span>
    </div>
);

export default Profile;