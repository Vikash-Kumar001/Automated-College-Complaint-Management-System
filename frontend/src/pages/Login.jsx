import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await API.post("/auth/login", values);

            if (!response.data || !response.data.token || !response.data.user) {
                setErrors({ general: "Invalid server response. Please try again later." });
                return;
            }

            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            login(user, token);

            switch (user.role) {
                case "admin":
                    navigate("/admin-dashboard");
                    break;
                case "resolver":
                    navigate("/resolver-dashboard");
                    break;
                case "student":
                    navigate("/student-dashboard");
                    break;
                case "teacher":
                    navigate("/teacher-dashboard");
                    break;
                default:
                    setErrors({ general: "Unauthorized role detected. Please contact support." });
            }
        } catch (err) {
            setErrors({
                general: err.response?.data?.message || "Login failed. Please check your credentials.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    });

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
                            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">STAREX UNIVERSITY</h1>
                            <p className="text-lg text-white/90">
                                A platform to <span className="font-bold text-yellow-200">RESOLVE</span> your queries
                            </p>
                            <Link
                                to="/register"
                                className="inline-block mt-8 px-8 py-3 bg-white/90 text-indigo-700 font-bold rounded-xl shadow-xl hover:bg-white transition-all text-base"
                            >
                                New Here? Register
                            </Link>
                        </div>
                    </motion.div>
                    {/* Right Side - Login Form */}
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
                                Login to Your Account
                            </motion.h2>
                            <Formik
                                initialValues={{ email: "", password: "" }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, errors }) => (
                                    <Form className="space-y-6">
                                        {errors.general && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-red-500 text-center"
                                            >
                                                {errors.general}
                                            </motion.p>
                                        )}

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                        >
                                            <Field
                                                type="email"
                                                name="email"
                                                placeholder="Email Address"
                                                className="w-full border border-indigo-200 px-4 py-3 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 text-base"
                                            />
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.35 }}
                                        >
                                            <Field
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                className="w-full border border-indigo-200 px-4 py-3 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 text-base"
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
                                            {isSubmitting ? "Logging in..." : "Login"}
                                        </motion.button>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            className="text-center mt-6"
                                        >
                                            <span className="text-gray-600 text-base">New here?</span>{" "}
                                            <Link to="/register" className="font-semibold text-indigo-600 hover:underline text-base">
                                                Register
                                            </Link>
                                        </motion.div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;