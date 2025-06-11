import Complaint from "../../models/complaint.model.js";

const getComplaintStats = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        // Defensive: Use $in to count all valid and common typo statuses
        const resolvedComplaints = await Complaint.countDocuments({ status: { $in: ["resolved", "Resolved"] } });
        const pendingComplaints = await Complaint.countDocuments({ status: { $in: ["pending", "Pending"] } });
        const inProgressComplaints = await Complaint.countDocuments({ status: { $in: ["in progress", "In Progress", "inprogress", "InProgress"] } });
        const forwardedComplaints = await Complaint.countDocuments({ status: { $in: ["forwarded", "Forwarded"] } });

        // Log all unique statuses for debugging
        const allStatuses = await Complaint.distinct("status");
        console.log("All unique complaint statuses in DB:", allStatuses);

        res.json({
            totalComplaints: totalComplaints || 0,
            resolvedComplaints: resolvedComplaints || 0,
            pendingComplaints: pendingComplaints || 0,
            inProgressComplaints: inProgressComplaints || 0,
            forwardedComplaints: forwardedComplaints || 0,
        });
    } catch (error) {
        console.error("Error fetching complaint stats:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export default getComplaintStats;
