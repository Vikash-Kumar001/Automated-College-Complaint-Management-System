import Complaint from "../../models/complaint.model.js";
import User from "../../models/user.model.js";

export const fetchResolverStats = async (req, res) => {
    try {
        const { resolverId } = req.params;

        // Ensure the resolver exists
        const resolverExists = await User.findById(resolverId);
        if (!resolverExists) {
            return res.status(404).json({ message: "Resolver not found." });
        }

        // Fetch complaint statistics for the resolver
        const total = await Complaint.countDocuments({ resolverId });
        if (total === 0) {
            return res.json({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
        }

        const pending = await Complaint.countDocuments({ resolverId, status: "pending" });
        const inProgress = await Complaint.countDocuments({ resolverId, status: "in progress" });
        const resolved = await Complaint.countDocuments({ resolverId, status: "resolved" });

        res.json({ total, pending, inProgress, resolved });
    } catch (error) {
        console.error("❌ Error fetching resolver stats:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export default fetchResolverStats;
