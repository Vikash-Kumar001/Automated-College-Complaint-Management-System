import { motion } from "framer-motion";
import {
    FaGithub,
    FaLinkedin,
    FaEnvelope,
    FaMapMarkerAlt,
    FaFacebook,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.1 * i, duration: 0.5, type: "spring", stiffness: 70 }
    }),
};

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full bg-gradient-to-tr from-indigo-50 via-purple-50 to-blue-100 text-gray-800 py-10 px-4 mt-auto shadow-inner border-t border-indigo-100 backdrop-blur-lg"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Links Section */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={1}
                >
                    <h3 className="text-xl font-bold mb-4 text-indigo-700 tracking-wide">Quick Links</h3>
                    <ul className="space-y-3 text-base">
                        <li>
                            <Link to="/terms" className="hover:text-indigo-600 transition-colors font-medium">Terms & Conditions</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-indigo-600 transition-colors font-medium">Contact Us</Link>
                        </li>
                        <li>
                            <Link to="/disclaimer" className="hover:text-indigo-600 transition-colors font-medium">Disclaimer</Link>
                        </li>
                    </ul>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={2}
                >
                    <h3 className="text-xl font-bold mb-4 text-indigo-700 tracking-wide">Contact Information</h3>
                    <ul className="space-y-3 text-base">
                        <li className="flex items-center gap-3">
                            <span className="bg-indigo-100 p-2 rounded-full">
                                <FaEnvelope className="text-indigo-600" />
                            </span>
                            <span className="font-medium">support@college.edu</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="bg-indigo-100 p-2 rounded-full">
                                <FaMapMarkerAlt className="text-pink-500" />
                            </span>
                            <span className="font-medium">Gurgaon, Haryana, India</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Social Media Section */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={3}
                >
                    <h3 className="text-xl font-bold mb-4 text-indigo-700 tracking-wide">Follow Us</h3>
                    <div className="flex gap-5 items-center text-gray-600">
                        <motion.a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.15, color: "#dc2626" }}
                            className="transition-all duration-200"
                        >
                            <FaYoutube size={26} />
                        </motion.a>
                        <motion.a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.15, color: "#2563eb" }}
                            className="transition-all duration-200"
                        >
                            <FaFacebook size={26} />
                        </motion.a>
                        <motion.a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.15, color: "#db2777" }}
                            className="transition-all duration-200"
                        >
                            <FaInstagram size={26} />
                        </motion.a>
                        <motion.a
                            href="https://github.com/your-repo"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.15, color: "#000" }}
                            className="transition-all duration-200"
                        >
                            <FaGithub size={26} />
                        </motion.a>
                        <motion.a
                            href="https://linkedin.com/in/your-profile"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.15, color: "#2563eb" }}
                            className="transition-all duration-200"
                        >
                            <FaLinkedin size={26} />
                        </motion.a>
                        <motion.a
                            href="mailto:support@college.edu"
                            whileHover={{ scale: 1.15, color: "#4f46e5" }}
                            className="transition-all duration-200"
                        >
                            <FaEnvelope size={26} />
                        </motion.a>
                        <motion.a
                            href="https://goo.gl/maps/location"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.15, color: "#16a34a" }}
                            className="transition-all duration-200"
                        >
                            <FaMapMarkerAlt size={26} />
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Bottom copyright */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-center text-xs text-gray-500 mt-10 tracking-wide"
            >
                <span className="inline-block bg-white/70 px-4 py-2 rounded-xl shadow-sm">
                    © {new Date().getFullYear()} Automated Complaint Management System. All rights reserved.
                </span>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;