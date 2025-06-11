import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // 🔴 Redirect to login if no token or user is found
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // 🔴 Redirect to home if user role is not allowed
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children; // ✅ Allow access if role is valid
};

export default ProtectedRoute;
