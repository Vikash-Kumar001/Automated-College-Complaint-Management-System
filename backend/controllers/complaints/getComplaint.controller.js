import Complaint from "../../models/complaint.model.js";


export const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("studentId", "fullName email branch")
            .populate("resolverId", "fullName email")
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default getComplaints;