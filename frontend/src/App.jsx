import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResolverDashboard from "./pages/ResolverDashboard";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import Footer from "./components/Footer";

// Layout wrapper to control Footer visibility
const Layout = ({ children }) => {
    const location = useLocation();
    const publicPathsWithFooter = ["/", "/contact", "/terms", "/disclaimer", "/login", "/register"];
    const showFooter = publicPathsWithFooter.includes(location.pathname);

    return (
        <>
            {children}
            {showFooter && <Footer />}
        </>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/disclaimer" element={<Disclaimer />} />

                        {/* Protected Routes */}
                        <Route
                            path="/student-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={["student"]}>
                                    <StudentDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/student-dashboard/:section"
                            element={
                                <ProtectedRoute allowedRoles={["student"]}>
                                    <StudentDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin-dashboard/:section"
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/resolver-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={["resolver"]}>
                                    <ResolverDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/resolver-dashboard/:section"
                            element={
                                <ProtectedRoute allowedRoles={["resolver"]}>
                                    <ResolverDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Layout>
            </AuthProvider>
        </Router>
    );
}

export default App;
