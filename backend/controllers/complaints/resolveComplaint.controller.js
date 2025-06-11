import Complaint from "../../models/complaint.model.js";

export const resolveComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { resolverComment } = req.body;

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { status: "resolved", resolutionComment: resolverComment },
            { new: true }
        );

        if (!updatedComplaint) return res.status(404).json({ message: "Complaint not found" });

        res.status(200).json({ message: "Complaint resolved successfully", complaint: updatedComplaint });
    } catch (error) {
        console.error("❌ Error resolving complaint:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default resolveComplaint;
