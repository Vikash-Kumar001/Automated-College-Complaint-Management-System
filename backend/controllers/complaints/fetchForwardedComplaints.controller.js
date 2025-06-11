import Complaint from "../../models/complaint.model.js";

const fetchForwardedComplaints = async (req, res) => {
    try {
        const { resolverId } = req.query;
        const filter = { status: "forwarded" };
        if (resolverId) filter.resolverId = resolverId;
        const complaints = await Complaint.find(filter)
            .populate("studentId", "fullName universityEnrollmentNo branch")
            .populate("resolverId", "fullName email");
        res.json(complaints);
    } catch (error) {
        console.error("Error fetching forwarded complaints:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default fetchForwardedComplaints; 