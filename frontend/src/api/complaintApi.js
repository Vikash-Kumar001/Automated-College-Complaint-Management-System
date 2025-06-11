import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/complaints";

const apiClient = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});


const authHeaders = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});


export const submitComplaint = async (data, token) => {
    try {
        const response = await apiClient.post("/submit", data, authHeaders(token));
        return response.data;
    } catch (error) {
        console.error("Error submitting complaint:", error.response?.data || error.message);
        throw error;
    }
};


export const fetchComplaints = async (token) => {
    try {
        const response = await apiClient.get("/", authHeaders(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching complaints:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchComplaintStatus = async (complaintId, token) => {
    try {
        const response = await apiClient.get(`/${complaintId}`, authHeaders(token));
        return response.data;
    } catch (error) {
        console.error("Error fetching complaint status:", error.response?.data || error.message);
        throw error;
    }
};

export const updateComplaintStatus = async (complaintId, status, token) => {
    try {
        const response = await apiClient.put(`/${complaintId}/status`, { status }, authHeaders(token));
        return response.data;
    } catch (error) {
        console.error("Error updating complaint status:", error.response?.data || error.message);
        throw error;
    }
};