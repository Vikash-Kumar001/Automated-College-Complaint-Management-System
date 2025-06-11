import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const universityBranches = [
    "Computer Science",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Electronics & Communication",
    "Information Technology",
    "Biotechnology",
    "Pharmacy",
    "Business Administration",
    "Commerce",
    "Law",
    "Hotel Management",
    "Agriculture",
    "Physics",
    "Chemistry",
    "Mathematics",
    "English",
    "Other"
];

function FormikEffect() {
    const { values, setFieldValue } = useFormikContext();
    useEffect(() => {
        if (values.role === "admin") {
            setFieldValue("branch", "Administration");
        }
    }, [values.role, setFieldValue]);
    return null;
}

const Register = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const initialValues = {
        name: "",
        email: "",
        branch: "",
        enrollment: "",
        password: "",
        role: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Full Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        role: Yup.string().required("Role selection is required"),
        enrollment: Yup.string().required("Enrollment is required"),
        branch: Yup.string().required("Branch is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });

    const handleRegister = async (values, { setSubmitting }) => {
        setError(null);
        try {
            await API.post("/auth/register", values);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#f0fdfa]">
            {/* Sticky Navbar */}
            <div className="sticky top-0 z-30 w-full">
                <Navbar />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 70 }}
                className="flex flex-1 items-center justify-center pt-6 md:pt-8"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 60 }}
                    className="w-full max-w-5xl mx-auto flex flex-col md:flex-row rounded-2xl shadow-2xl border border-indigo-100 bg-white/90 backdrop-blur-lg overflow-hidden"
                >
                    {/* Left Side - Welcome */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.15, type: "spring", stiffness: 60 }}
                        className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-400 p-10"
                    >
                        <div className="text-center space-y-6">
                            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">Welcome!</h1>
                            <p className="text-lg text-white/90">
                                Join <span className="font-bold text-yellow-200">STAREX UNIVERSITY</span> and resolve your queries easily.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block mt-8 px-8 py-3 bg-white/90 text-indigo-700 font-bold rounded-xl shadow-xl hover:bg-white transition-all text-base"
                            >
                                Already have an account? Login
                            </Link>
                        </div>
                    </motion.div>
                    {/* Right Side - Registration Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 60 }}
                        className="flex-1 flex items-center justify-center bg-white/95 p-6"
                    >
                        <div className="w-full max-w-md mx-auto">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.25 }}
                                className="text-2xl md:text-3xl font-black text-indigo-700 text-center mb-8 tracking-tight drop-shadow"
                            >
                                Create Your Account
                            </motion.h2>
                            {error && <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-center mb-4">{error}</motion.p>}

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleRegister}
                            >
                                {({ isSubmitting, values }) => (
                                    <Form className="space-y-6">
                                        <FormikEffect />
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="flex gap-3"
                                        >
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Role <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="role"
                                                    className="w-full border border-indigo-200 px-3 py-2 rounded bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 text-sm"
                                                >
                                                    <option value="">Select Role</option>
                                                    <option value="student">Student</option>
                                                    <option value="teacher">Teacher</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="resolver">Resolver</option>
                                                </Field>
                                                <ErrorMessage name="role" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.32 }}
                                            className="flex gap-3"
                                        >
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    className="w-full border border-indigo-200 px-3 py-2 rounded bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 text-sm"
                                                />
                                                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    className="w-full border border-indigo-200 px-3 py-2 rounded bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 text-sm"
                                                />
                                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.34 }}
                                            className="flex gap-3"
                                        >
                                            {values.role === "admin" ? (
                                                <div className="flex-1">
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Branch <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="branch"
                                                        value="Administration"
                                                        disabled
                                                        className="w-full border border-indigo-200 px-3 py-2 rounded bg-gray-100 text-gray-900 focus:ring-2 focus:ring-indigo-400 text-sm cursor-not-allowed"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex-1">
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Branch <span className="text-red-500">*</span></label>
                                                    <Field
                                                        as="select"
                                                        name="branch"
                                                        className="w-full border border-indigo-200 px-3 py-2 rounded bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 text-sm"
                                                    >
                                                        <option value="">Select Branch</option>
                                                        {universityBranches.map(branch => (
                                                            <option key={branch} value={branch}>{branch}</option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="branch" component="div" className="text-red-500 text-xs mt-1" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    {values.role === "student"
                                                        ? "Enrollment No."
                                                        : values.role === "teacher"
                                                            ? "Teacher ID"
                                                            : values.role === "admin" || values.role === "resolver"
                                                                ? "ID No."
                                                                : "ID / Enrollment / Teacher ID"}
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="enrollment"
                                                    className="w-full border border-indigo-200 px-3 py-2 rounded bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 text-sm"
                                                />
                                                <ErrorMessage name="enrollment" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.36 }}
                                        >
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                                            <Field
                                                type="password"
                                                name="password"
                                                className="w-full border border-indigo-200 px-3 py-2 rounded bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 text-sm"
                                            />
                                            <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                                        </motion.div>

                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl text-base font-bold shadow-xl hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-all mt-2"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Registering..." : "Register"}
                                        </motion.button>
                                    </Form>
                                )}
                            </Formik>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mt-6 text-center"
                            >
                                <span className="text-gray-600 text-base">Already registered?</span>{" "}
                                <Link to="/login" className="font-semibold text-indigo-600 hover:underline text-base">
                                    Click here to login
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;