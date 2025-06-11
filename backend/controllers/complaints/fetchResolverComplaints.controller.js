import Complaint from "../../models/complaint.model.js";
import mongoose from "mongoose";

const fetchResolverComplaints = async (req, res) => {
    try {
        const { resolverId } = req.params;
        const complaints = await Complaint.find({ resolverId: new mongoose.Types.ObjectId(resolverId) })
            .populate("studentId", "name email role branch enrollment")
            .populate("resolverId", "fullName email");
        res.json(complaints);
    } catch (error) {
        console.error("Error fetching resolver complaints:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default fetchResolverComplaints; 