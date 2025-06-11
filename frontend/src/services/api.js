import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",  // Ensure backend is running on this port
    headers: { "Content-Type": "application/json" },
    withCredentials: true,  // ✅ Sends cookies (for JWT authentication)
});

// ✅ Attach Authorization header from localStorage (fallback if cookies fail)
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("⚠️ No token found in localStorage");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Handle Errors & Unauthorized Access
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("🔴 API Error:", error.response?.data || error.message);

        if (error.response?.status === 401) {
            console.warn("⚠ Unauthorized! Redirecting to login...");

            // ✅ Handle session expiration
            localStorage.removeItem("token");  // Remove stored token
            localStorage.removeItem("user");   // Clear user session
            window.location.href = "/login";   // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default API;