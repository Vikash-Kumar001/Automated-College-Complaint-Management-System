import Complaint from "../../models/complaint.model.js";

const fetchUserComplaintHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        // Fetch complaints where the user is the student or resolver
        const complaints = await Complaint.find({
            $or: [
                { studentId: userId },
                { resolverId: userId }
            ]
        }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export default fetchUserComplaintHistory; 