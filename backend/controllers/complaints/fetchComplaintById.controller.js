import Complaint from "../../models/complaint.model.js";

export const fetchComplaintById = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const complaint = await Complaint.findById(complaintId)
            .populate("studentId", "name email role branch enrollment")
            .populate("resolverId", "name email");

        if (!complaint) return res.status(404).json({ message: "Complaint not found" });

        res.status(200).json(complaint);
    } catch (error) {
        console.error("❌ Error fetching complaint:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default fetchComplaintById;