import Complaint from "../../models/complaint.model.js";
import mongoose from "mongoose";

const fetchActiveResolverComplaints = async (req, res) => {
    try {
        const { resolverId } = req.params;
        console.log("[fetchActiveResolverComplaints] resolverId:", resolverId);
        // Use aggregation to match status case-insensitively
        const complaints = await Complaint.aggregate([
            { $match: {
                resolverId: new mongoose.Types.ObjectId(resolverId),
                status: { $exists: true }
            }},
            { $addFields: { statusLower: { $toLower: "$status" } } },
            { $match: { statusLower: { $in: ["forwarded", "in progress"] } } },
        ]);
        // Populate studentId and resolverId manually since aggregate doesn't support populate
        const populatedComplaints = await Complaint.populate(complaints, [
            { path: "studentId", select: "name universityEnrollmentNo branch" },
            { path: "resolverId", select: "fullName email" }
        ]);
        if (!populatedComplaints || populatedComplaints.length === 0) {
            // Log all unique statuses for debugging
            const allStatuses = await Complaint.distinct("status");
            console.log("[fetchActiveResolverComplaints] No complaints found. Unique statuses in DB:", allStatuses);
            return res.status(200).json({
                message: "No complaints found for this resolver.",
                query: { resolverId, statuses: ["forwarded", "in progress"] },
                uniqueStatuses: allStatuses
            });
        }
        res.json(populatedComplaints);
    } catch (error) {
        console.error("Error fetching active resolver complaints:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default fetchActiveResolverComplaints; 