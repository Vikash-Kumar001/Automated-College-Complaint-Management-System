import axios from "axios";
import { useState, useRef } from "react";
import { FaCheckCircle, FaExclamationCircle, FaUpload, FaTimesCircle, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const categories = [
    "Hostel",
    "Mess",
    "Library",
    "IT Services",
    "Others",
];

const branches = [
    "IT Department",
    "Electrical Department",
    "Mechanical Department",
    "Civil Department",
    "Others",
];

const priorities = [
    "Low",
    "Medium",
    "High",
    "Urgent",
];

const ComplaintForm = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [complaint, setComplaint] = useState({
        title: user?.name || "",
        category: "",
        description: "",
        branch: user?.branch || "",
        priority: "",
        file: null,
        inchargeName: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [charCount, setCharCount] = useState(0);
    const fileInputRef = useRef();

    const handleChange = (e) => {
        setComplaint({ ...complaint, [e.target.name]: e.target.value });
        if (e.target.name === "description") {
            setCharCount(e.target.value.length);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            setError("⚠️ File size should be less than 5MB.");
            return;
        }
        setComplaint({ ...complaint, file });
        setFileName(file ? file.name : "");
    };

    const handleRemoveFile = () => {
        setComplaint({ ...complaint, file: null });
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { title, category, description, branch, priority, inchargeName } = complaint;
        if (!title || !category || !description || !branch || !priority || !inchargeName) {
            setError("⚠️ Please fill out all required fields.");
            setLoading(false);
            return;
        }

        if (description.length < 20) {
            setError("⚠️ Description should be at least 20 characters.");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("⚠️ Unauthorized: Please log in again. Redirecting to login...");
            setLoading(false);
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
            return;
        }

        const formData = new FormData();
        Object.entries(complaint).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        try {
            await axios.post("http://localhost:5000/api/complaints/submit", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setIsSubmitted(true);
            setComplaint({
                title: "",
                category: "",
                description: "",
                branch: "",
                priority: "",
                file: null,
                inchargeName: "",
            });
            setFileName("");
            setCharCount(0);
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred while submitting your complaint.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#f0fdfa] py-2 px-0 sm:px-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-2xl mx-auto"
            >
                <div className="bg-white/90 shadow-2xl rounded-3xl p-8 md:p-12 border border-indigo-100">
                    <h2 className="text-3xl font-black text-indigo-800 mb-6 flex items-center gap-3 tracking-tight drop-shadow">
                        <FaUpload className="text-indigo-500 text-2xl" /> Submit a Complaint
                    </h2>

                    {isSubmitted ? (
                        <div className="flex flex-col items-center gap-3 py-10">
                            <FaCheckCircle className="text-green-500 text-5xl mb-2" />
                            <p className="text-green-700 font-semibold text-lg text-center">
                                Your complaint has been submitted successfully.
                            </p>
                            <button
                                className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 shadow transition"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Submit Another Complaint
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-base font-medium">
                                    <FaExclamationCircle /> <span>{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 text-base">Complaint Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        onChange={handleChange}
                                        value={complaint.title}
                                        placeholder="Complaint Title"
                                        required
                                        maxLength={100}
                                        className="w-full p-3 border border-indigo-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                                        readOnly={user?.role === "student"}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 text-base">Category <span className="text-red-500">*</span></label>
                                    <select
                                        name="category"
                                        value={complaint.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-indigo-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                                    >
                                        <option value="">Select Complaint Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1 text-base">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    name="description"
                                    onChange={handleChange}
                                    value={complaint.description}
                                    placeholder="Describe your complaint (min 20 characters)"
                                    required
                                    minLength={20}
                                    maxLength={1000}
                                    rows={4}
                                    className="w-full p-3 border border-indigo-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-base"
                                />
                                <div className="text-xs text-gray-500 text-right">{charCount}/1000</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 text-base">Department/Branch <span className="text-red-500">*</span></label>
                                    {user?.role === "student" ? (
                                        <input
                                            type="text"
                                            value={user.branch}
                                            readOnly
                                            className="w-full p-3 border border-indigo-200 rounded-xl bg-gray-100 text-gray-900"
                                        />
                                    ) : (
                                        <select
                                            name="branch"
                                            value={complaint.branch}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border border-indigo-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                                        >
                                            <option value="">Select Department/Branch</option>
                                            {branches.map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 text-base">Priority <span className="text-red-500">*</span></label>
                                    <select
                                        name="priority"
                                        value={complaint.priority}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-indigo-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                                    >
                                        <option value="">Select Priority</option>
                                        {priorities.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 text-base">HOD Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="inchargeName"
                                        onChange={handleChange}
                                        value={complaint.inchargeName}
                                        placeholder="Enter HOD Name"
                                        required
                                        maxLength={100}
                                        className="w-full p-3 border border-indigo-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 text-base">Attach File (optional, max 5MB)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            name="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition text-base font-medium"
                                        >
                                            <FaFileAlt /> {fileName ? "Change File" : "Upload File"}
                                        </button>
                                        {fileName && (
                                            <span className="flex items-center gap-1 text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                                {fileName}
                                                <button type="button" onClick={handleRemoveFile} className="ml-1 text-red-500 hover:text-red-700">
                                                    <FaTimesCircle />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">Accepted: jpg, png, pdf, doc, docx. Max 5MB.</div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 ${
                                    loading ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                            >
                                {loading ? "Submitting..." : "Submit Complaint"}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </section>
    );
};

export default ComplaintForm;